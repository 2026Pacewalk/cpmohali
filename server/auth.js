import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { q } from './db.js';

const SECRET = process.env.SESSION_SECRET;
if (!SECRET || SECRET.length < 32) throw new Error('SESSION_SECRET must be set (32+ chars)');

export const COOKIE = 'cpg_session';
const MAX_AGE = 7 * 24 * 3600; // seconds

const b64 = buf => Buffer.from(buf).toString('base64url');
const sign = data => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

export function issueToken(user) {
  const payload = b64(JSON.stringify({ uid: user.id, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${sign(payload)}`;
}

function readToken(token) {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() / 1000 ? data : null;
  } catch { return null; }
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: MAX_AGE * 1000, path: '/' });
}
export function clearSessionCookie(res) { res.clearCookie(COOKIE, { path: '/' }); }

function cookieValue(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

export const publicUser = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, last_login_at: u.last_login_at, created_at: u.created_at });

/** Attaches req.user if the session cookie is valid and the account is active. */
export async function requireAuth(req, res, next) {
  const data = readToken(cookieValue(req, COOKIE));
  if (!data) return res.status(401).json({ error: 'Please log in' });
  const { rows } = await q('SELECT * FROM users WHERE id = $1 AND active', [data.uid]);
  if (!rows[0]) return res.status(401).json({ error: 'Account not found or disabled' });
  req.user = rows[0];
  next();
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
}

export const hashPassword = pw => bcrypt.hash(pw, 11);
export const checkPassword = (pw, hash) => bcrypt.compare(pw, hash);
export const passwordProblem = pw => (typeof pw !== 'string' || pw.length < 8 ? 'Password must be at least 8 characters' : null);

/** First boot: create the admin from ADMIN_EMAIL / ADMIN_PASSWORD if no users exist yet. */
export async function ensureBootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  // One-time credential rotation: with ADMIN_RESET_PASSWORD=1 the ADMIN_EMAIL account is (re)set to
  // ADMIN_PASSWORD on boot. Remove the flag after that deploy, or every restart would reset it again.
  if (process.env.ADMIN_RESET_PASSWORD === '1' && email && !passwordProblem(password)) {
    const hash = await hashPassword(password);
    const r = await q("UPDATE users SET password_hash = $2, active = TRUE, role = 'admin' WHERE email = $1", [email, hash]);
    if (!r.rowCount) await q('INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)', ['Administrator', email, hash, 'admin']);
    console.log(`Admin password reset from ADMIN_PASSWORD for ${email} — now remove ADMIN_RESET_PASSWORD`);
    return;
  }
  const { rows } = await q('SELECT count(*)::int AS n FROM users');
  if (rows[0].n > 0) return;
  if (!email || passwordProblem(password)) { console.warn('No users yet: set ADMIN_EMAIL and ADMIN_PASSWORD (8+ chars) to create the first admin.'); return; }
  await q('INSERT INTO users (name, email, password_hash, role) VALUES ($1,$2,$3,$4)', ['Administrator', email, await hashPassword(password), 'admin']);
  console.log(`Created first admin account: ${email}`);
}

/* Tiny in-memory rate limiter (per IP + key) */
const hits = new Map();
export function rateLimit(key, limit, windowMs) {
  return (req, res, next) => {
    const id = `${key}:${req.ip}`;
    const now = Date.now();
    const arr = (hits.get(id) || []).filter(t => now - t < windowMs);
    if (arr.length >= limit) return res.status(429).json({ error: 'Too many requests, please try again later' });
    arr.push(now); hits.set(id, arr);
    next();
  };
}
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (v.every(t => now - t > 3600e3)) hits.delete(k); }, 600e3).unref();
