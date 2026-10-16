import express from 'express';
import { q, pool, STATUSES, SOURCES } from './db.js';
import {
  requireAuth, requireAdmin, issueToken, setSessionCookie, clearSessionCookie, publicUser,
  hashPassword, checkPassword, passwordProblem, rateLimit,
} from './auth.js';

const api = express.Router();
api.use(express.json({ limit: '32kb' }));
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* ------------------------------------------------------------------ */
/* Public: capture a lead from any site form                           */
/* ------------------------------------------------------------------ */
api.post('/leads', rateLimit('lead', 8, 10 * 60e3), wrap(async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.status(201).json({ ok: true }); // honeypot: bots fill hidden fields
  const name = str(b.name, 80);
  const phone = str(b.phone, 20).replace(/\D/g, '').slice(-10);
  const email = str(b.email, 120).toLowerCase();
  if (!/^[6-9]\d{9}$/.test(phone)) return res.status(400).json({ error: 'Enter a valid 10-digit mobile number' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email' });
  const lead = {
    name: name || 'Website visitor',
    phone, email: email || null,
    student_class: str(b.studentClass, 20) || null,
    programs: Array.isArray(b.programs) ? b.programs.map(p => str(p, 40)).filter(Boolean).slice(0, 8) : [],
    message: str(b.message, 1000) || null,
    source: SOURCES.includes(b.source) ? b.source : 'other',
    page: str(b.page, 300) || null,
    utm: b.utm && typeof b.utm === 'object' ? Object.fromEntries(Object.entries(b.utm).filter(([k]) => /^utm_\w+$|^gclid$|^fbclid$/.test(k)).map(([k, v]) => [k, str(v, 120)])) : {},
  };

  // Same phone within 30 minutes → merge into that lead instead of duplicating
  const recent = await q(`SELECT id, programs FROM leads WHERE phone = $1 AND created_at > now() - interval '30 minutes' ORDER BY id DESC LIMIT 1`, [phone]);
  if (recent.rows[0]) {
    const r = recent.rows[0];
    await q(`UPDATE leads SET name = CASE WHEN $2 <> 'Website visitor' THEN $2 ELSE name END, email = COALESCE($3, email),
             student_class = COALESCE($4, student_class), programs = $5, message = COALESCE($6, message), updated_at = now() WHERE id = $1`,
      [r.id, lead.name, lead.email, lead.student_class, [...new Set([...r.programs, ...lead.programs])], lead.message]);
    await q(`INSERT INTO lead_notes (lead_id, kind, body) VALUES ($1,'system',$2)`, [r.id, `Submitted again via ${lead.source}`]);
    return res.status(200).json({ ok: true, id: r.id, merged: true });
  }
  const { rows } = await q(
    `INSERT INTO leads (name, phone, email, student_class, programs, message, source, page, utm, ip, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`,
    [lead.name, lead.phone, lead.email, lead.student_class, lead.programs, lead.message, lead.source, lead.page, lead.utm, req.ip, str(req.get('user-agent'), 300)]);
  res.status(201).json({ ok: true, id: rows[0].id });
}));

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
api.post('/auth/login', rateLimit('login', 10, 15 * 60e3), wrap(async (req, res) => {
  const email = str(req.body?.email, 120).toLowerCase();
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const { rows } = await q('SELECT * FROM users WHERE email = $1', [email]);
  const u = rows[0];
  if (!u || !(await checkPassword(password, u.password_hash))) return res.status(401).json({ error: 'Wrong email or password' });
  if (!u.active) return res.status(403).json({ error: 'This account has been disabled' });
  await q('UPDATE users SET last_login_at = now() WHERE id = $1', [u.id]);
  setSessionCookie(res, issueToken(u));
  res.json({ user: publicUser(u) });
}));
api.post('/auth/logout', (req, res) => { clearSessionCookie(res); res.json({ ok: true }); });
api.get('/auth/me', wrap(requireAuth), (req, res) => res.json({ user: publicUser(req.user) }));
api.patch('/auth/password', wrap(requireAuth), wrap(async (req, res) => {
  const { current, next } = req.body || {};
  if (!(await checkPassword(String(current || ''), req.user.password_hash))) return res.status(400).json({ error: 'Current password is wrong' });
  const p = passwordProblem(next); if (p) return res.status(400).json({ error: p });
  await q('UPDATE users SET password_hash = $2 WHERE id = $1', [req.user.id, await hashPassword(next)]);
  res.json({ ok: true });
}));

/* Everything below needs a logged-in staff member */
api.use(wrap(requireAuth));

/* ------------------------------------------------------------------ */
/* Leads                                                               */
/* ------------------------------------------------------------------ */
function leadFilters(query, user) {
  const where = []; const params = [];
  const add = (sql, v) => { params.push(v); where.push(sql.replace('?', `$${params.length}`)); };
  const s = str(query.q, 80);
  if (s) { params.push(`%${s}%`); const i = params.length; where.push(`(l.name ILIKE $${i} OR l.phone ILIKE $${i} OR l.email ILIKE $${i} OR l.message ILIKE $${i})`); }
  if (STATUSES.includes(query.status)) add('l.status = ?', query.status);
  if (SOURCES.includes(query.source)) add('l.source = ?', query.source);
  if (query.assigned === 'me') add('l.assigned_to = ?', user.id);
  else if (query.assigned === 'none') where.push('l.assigned_to IS NULL');
  else if (/^\d+$/.test(query.assigned || '')) add('l.assigned_to = ?', Number(query.assigned));
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.from || '')) add('l.created_at >= ?::date', query.from);
  if (/^\d{4}-\d{2}-\d{2}$/.test(query.to || '')) add("l.created_at < (?::date + interval '1 day')", query.to);
  if (query.followup === 'due') where.push('l.follow_up_at <= current_date AND l.status NOT IN (\'admitted\',\'not_interested\')');
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}
const LEAD_COLS = `l.*, u.name AS assigned_name`;

api.get('/leads', wrap(async (req, res) => {
  const { sql, params } = leadFilters(req.query, req.user);
  const page = Math.max(1, Number(req.query.page) || 1); const size = 25;
  const [list, count] = await Promise.all([
    q(`SELECT ${LEAD_COLS} FROM leads l LEFT JOIN users u ON u.id = l.assigned_to ${sql} ORDER BY l.created_at DESC LIMIT ${size} OFFSET ${(page - 1) * size}`, params),
    q(`SELECT count(*)::int AS n FROM leads l ${sql}`, params),
  ]);
  res.json({ leads: list.rows, total: count.rows[0].n, page, pageSize: size });
}));

api.get('/leads/export.csv', wrap(async (req, res) => {
  const { sql, params } = leadFilters(req.query, req.user);
  const { rows } = await q(`SELECT ${LEAD_COLS} FROM leads l LEFT JOIN users u ON u.id = l.assigned_to ${sql} ORDER BY l.created_at DESC LIMIT 20000`, params);
  const cols = ['id', 'created_at', 'name', 'phone', 'email', 'student_class', 'programs', 'message', 'source', 'page', 'status', 'assigned_name', 'follow_up_at'];
  const cell = v => {
    let s = v == null ? '' : Array.isArray(v) ? v.join('; ') : v instanceof Date ? v.toISOString() : String(v);
    if (/^[=+\-@]/.test(s)) s = `'${s}`; // block spreadsheet formula injection
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = '﻿' + [cols.join(','), ...rows.map(r => cols.map(c => cell(r[c])).join(','))].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="cp-gurukul-leads-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
}));

api.get('/leads/:id', wrap(async (req, res) => {
  const { rows } = await q(`SELECT ${LEAD_COLS} FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE l.id = $1`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Lead not found' });
  const notes = await q(`SELECT n.*, u.name AS user_name FROM lead_notes n LEFT JOIN users u ON u.id = n.user_id WHERE n.lead_id = $1 ORDER BY n.created_at DESC`, [req.params.id]);
  res.json({ lead: rows[0], notes: notes.rows });
}));

api.patch('/leads/:id', wrap(async (req, res) => {
  const { rows } = await q(`SELECT l.*, u.name AS assigned_name FROM leads l LEFT JOIN users u ON u.id = l.assigned_to WHERE l.id = $1`, [req.params.id]);
  const cur = rows[0];
  if (!cur) return res.status(404).json({ error: 'Lead not found' });
  const b = req.body || {}; const sets = []; const params = [cur.id]; const logs = [];
  const set = (col, v) => { params.push(v); sets.push(`${col} = $${params.length}`); };

  if (b.status !== undefined && b.status !== cur.status) {
    if (!STATUSES.includes(b.status)) return res.status(400).json({ error: 'Unknown status' });
    set('status', b.status); logs.push(`Status: ${cur.status} → ${b.status}`);
  }
  if (b.assigned_to !== undefined && (b.assigned_to || null) !== cur.assigned_to) {
    let name = 'nobody';
    if (b.assigned_to) {
      const u = await q('SELECT name FROM users WHERE id = $1 AND active', [b.assigned_to]);
      if (!u.rows[0]) return res.status(400).json({ error: 'Staff member not found' });
      name = u.rows[0].name;
    }
    set('assigned_to', b.assigned_to || null); logs.push(`Assigned to ${name}`);
  }
  if (b.follow_up_at !== undefined) {
    const d = b.follow_up_at || null;
    if (d && !/^\d{4}-\d{2}-\d{2}$/.test(d)) return res.status(400).json({ error: 'Bad follow-up date' });
    set('follow_up_at', d); logs.push(d ? `Follow-up set for ${d}` : 'Follow-up cleared');
  }
  for (const [k, max] of [['name', 80], ['email', 120], ['student_class', 20]]) if (typeof b[k] === 'string' && b[k].trim() !== (cur[k] || '')) set(k, str(b[k], max) || null);
  if (!sets.length) return res.json({ ok: true });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`UPDATE leads SET ${sets.join(', ')}, updated_at = now() WHERE id = $1`, params);
    for (const body of logs) await client.query(`INSERT INTO lead_notes (lead_id, user_id, kind, body) VALUES ($1,$2,'system',$3)`, [cur.id, req.user.id, body]);
    await client.query('COMMIT');
  } catch (e) { await client.query('ROLLBACK'); throw e; } finally { client.release(); }
  res.json({ ok: true });
}));

api.post('/leads/:id/notes', wrap(async (req, res) => {
  const body = str(req.body?.body, 2000);
  if (!body) return res.status(400).json({ error: 'Note is empty' });
  const { rows } = await q(`INSERT INTO lead_notes (lead_id, user_id, body) SELECT id, $2, $3 FROM leads WHERE id = $1 RETURNING *`, [req.params.id, req.user.id, body]);
  if (!rows[0]) return res.status(404).json({ error: 'Lead not found' });
  await q('UPDATE leads SET updated_at = now() WHERE id = $1', [req.params.id]);
  res.status(201).json({ note: { ...rows[0], user_name: req.user.name } });
}));

api.delete('/leads/:id', requireAdmin, wrap(async (req, res) => {
  const r = await q('DELETE FROM leads WHERE id = $1', [req.params.id]);
  res.json({ ok: r.rowCount > 0 });
}));

/* ------------------------------------------------------------------ */
/* Dashboard stats                                                     */
/* ------------------------------------------------------------------ */
api.get('/stats', wrap(async (req, res) => {
  const [totals, byStatus, bySource, daily, due] = await Promise.all([
    q(`SELECT count(*)::int AS total,
              count(*) FILTER (WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata')::int AS today,
              count(*) FILTER (WHERE created_at >= now() - interval '7 days')::int AS week,
              count(*) FILTER (WHERE status = 'new')::int AS fresh,
              count(*) FILTER (WHERE status = 'admitted')::int AS admitted,
              count(*) FILTER (WHERE assigned_to = $1)::int AS mine
       FROM leads`, [req.user.id]),
    q(`SELECT status, count(*)::int AS n FROM leads GROUP BY status`),
    q(`SELECT source, count(*)::int AS n FROM leads GROUP BY source ORDER BY n DESC`),
    q(`SELECT to_char(d, 'YYYY-MM-DD') AS day, count(l.id)::int AS n
       FROM generate_series((now() AT TIME ZONE 'Asia/Kolkata')::date - 13, (now() AT TIME ZONE 'Asia/Kolkata')::date, '1 day') d
       LEFT JOIN leads l ON (l.created_at AT TIME ZONE 'Asia/Kolkata')::date = d GROUP BY d ORDER BY d`),
    q(`SELECT ${LEAD_COLS} FROM leads l LEFT JOIN users u ON u.id = l.assigned_to
       WHERE l.follow_up_at <= current_date AND l.status NOT IN ('admitted','not_interested') ORDER BY l.follow_up_at LIMIT 8`),
  ]);
  res.json({ ...totals.rows[0], byStatus: byStatus.rows, bySource: bySource.rows, daily: daily.rows, due: due.rows });
}));

/* ------------------------------------------------------------------ */
/* Staff accounts                                                      */
/* ------------------------------------------------------------------ */
api.get('/users', wrap(async (req, res) => {
  const { rows } = await q(`SELECT u.*, (SELECT count(*)::int FROM leads WHERE assigned_to = u.id) AS lead_count FROM users u ORDER BY u.active DESC, u.name`);
  res.json({ users: rows.map(u => ({ ...publicUser(u), lead_count: u.lead_count })) });
}));

api.post('/users', requireAdmin, wrap(async (req, res) => {
  const name = str(req.body?.name, 80); const email = str(req.body?.email, 120).toLowerCase();
  const role = req.body?.role === 'admin' ? 'admin' : 'counsellor';
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Name and a valid email are required' });
  const p = passwordProblem(req.body?.password); if (p) return res.status(400).json({ error: p });
  try {
    const { rows } = await q('INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING *', [name, email, await hashPassword(req.body.password), role]);
    res.status(201).json({ user: publicUser(rows[0]) });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'A user with this email already exists' });
    throw e;
  }
}));

api.patch('/users/:id', requireAdmin, wrap(async (req, res) => {
  const id = Number(req.params.id); const b = req.body || {};
  if (id === req.user.id && (b.active === false || b.role === 'counsellor')) return res.status(400).json({ error: 'You cannot disable or demote your own account' });
  const sets = []; const params = [id];
  const set = (col, v) => { params.push(v); sets.push(`${col} = $${params.length}`); };
  if (typeof b.name === 'string' && b.name.trim()) set('name', str(b.name, 80));
  if (b.role === 'admin' || b.role === 'counsellor') set('role', b.role);
  if (typeof b.active === 'boolean') set('active', b.active);
  if (b.password) { const p = passwordProblem(b.password); if (p) return res.status(400).json({ error: p }); set('password_hash', await hashPassword(b.password)); }
  if (!sets.length) return res.json({ ok: true });
  const { rows } = await q(`UPDATE users SET ${sets.join(', ')} WHERE id = $1 RETURNING *`, params);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  res.json({ user: publicUser(rows[0]) });
}));

api.use((req, res) => res.status(404).json({ error: 'Not found' }));
api.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

export default api;
