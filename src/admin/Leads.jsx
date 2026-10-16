import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Phone, X, Trash2, Send, ChevronLeft, ChevronRight, BellRing, RotateCcw, Mail, MapPin, Megaphone } from 'lucide-react';
import { api, STATUS, SOURCE, fmtDateTime, fmtDay, today, waLink } from './api';
import { useAuth } from './AdminApp';
import { WhatsApp } from '../components/Icons';

const FILTER_KEYS = ['q', 'status', 'source', 'assigned', 'from', 'to', 'followup', 'page'];

export default function Leads() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.map(k => [k, params.get(k) || ''])), [params]);
  const [data, setData] = useState({ leads: [], total: 0, page: 1, pageSize: 25 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState(filters.q);
  const openId = params.get('open');

  const query = useMemo(() => new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString(), [filters]);
  const load = useCallback(() => {
    setLoading(true);
    api(`/leads?${query}`).then(d => { setData(d); setErr(''); }).catch(e => setErr(e.message)).finally(() => setLoading(false));
  }, [query]);
  useEffect(load, [load]);
  useEffect(() => { api('/users').then(d => setUsers(d.users.filter(u => u.active))).catch(() => {}); }, []);

  const setFilter = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    if (k !== 'page') next.delete('page');
    next.delete('open');
    setParams(next);
  };
  // debounce search box
  useEffect(() => { const t = setTimeout(() => { if (q !== filters.q) setFilter('q', q.trim()); }, 350); return () => clearTimeout(t); }, [q]); // eslint-disable-line react-hooks/exhaustive-deps
  const openLead = id => { const next = new URLSearchParams(params); id ? next.set('open', id) : next.delete('open'); setParams(next); };
  const quickStatus = async (lead, status) => {
    setData(d => ({ ...d, leads: d.leads.map(l => (l.id === lead.id ? { ...l, status } : l)) }));
    await api(`/leads/${lead.id}`, { method: 'PATCH', body: { status } }).catch(e => { setErr(e.message); load(); });
  };
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const anyFilter = FILTER_KEYS.some(k => k !== 'page' && filters[k]);

  return (
    <div className="ad-page">
      <header className="ad-head">
        <div><h1>Leads</h1><p>{data.total} {data.total === 1 ? 'enquiry' : 'enquiries'}{anyFilter ? ' match your filters' : ' in total'}</p></div>
        <a className="ad-btn" href={`/api/leads/export.csv?${query}`}><Download /> Export CSV</a>
      </header>

      <div className="ad-filters">
        <label className="ad-search"><Search /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, email, message…" aria-label="Search leads" /></label>
        <select value={filters.status} onChange={e => setFilter('status', e.target.value)} aria-label="Status">
          <option value="">All statuses</option>
          {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
        </select>
        <select value={filters.source} onChange={e => setFilter('source', e.target.value)} aria-label="Source">
          <option value="">All sources</option>
          {Object.entries(SOURCE).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <select value={filters.assigned} onChange={e => setFilter('assigned', e.target.value)} aria-label="Assigned to">
          <option value="">Anyone</option>
          <option value="me">Assigned to me</option>
          <option value="none">Unassigned</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <input type="date" value={filters.from} onChange={e => setFilter('from', e.target.value)} aria-label="From date" max={filters.to || undefined} />
        <input type="date" value={filters.to} onChange={e => setFilter('to', e.target.value)} aria-label="To date" min={filters.from || undefined} />
        <button className={`ad-chip ${filters.followup ? 'on' : ''}`} onClick={() => setFilter('followup', filters.followup ? '' : 'due')}><BellRing /> Follow-ups due</button>
        {anyFilter && <button className="ad-chip ghost" onClick={() => { setQ(''); setParams(new URLSearchParams()); }}><RotateCcw /> Reset</button>}
      </div>

      {err && <div className="ad-alert">{err}</div>}

      <div className="ad-card flush">
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Received</th><th>Student / parent</th><th>Phone</th><th>Source</th><th>Status</th><th>Assigned</th><th>Follow-up</th></tr></thead>
            <tbody>
              {data.leads.map(l => (
                <tr key={l.id} onClick={() => openLead(l.id)} className={l.status === 'new' ? 'is-new' : ''}>
                  <td className="nowrap">{fmtDateTime(l.created_at)}</td>
                  <td><b>{l.name}</b>{(l.student_class || l.programs.length > 0) && <small>{[l.student_class && `Class ${l.student_class}`, ...l.programs].filter(Boolean).join(' · ')}</small>}</td>
                  <td className="nowrap" onClick={e => e.stopPropagation()}>
                    <a href={`tel:+91${l.phone}`} className="ad-phone">{l.phone}</a>
                    <a href={waLink(l.phone, l.name)} target="_blank" rel="noreferrer" className="ad-wa" aria-label="WhatsApp"><WhatsApp /></a>
                  </td>
                  <td><span className="ad-src">{SOURCE[l.source] || l.source}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <select className={`ad-status ${STATUS[l.status]?.tone}`} value={l.status} onChange={e => quickStatus(l, e.target.value)} aria-label="Change status">
                      {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                    </select>
                  </td>
                  <td>{l.assigned_name || <span className="muted">—</span>}</td>
                  <td className="nowrap">{l.follow_up_at ? <span className={`ad-date ${l.follow_up_at.slice(0, 10) < today() ? 'late' : ''}`}>{fmtDay(l.follow_up_at)}</span> : <span className="muted">—</span>}</td>
                </tr>
              ))}
              {!loading && data.leads.length === 0 && <tr><td colSpan={7} className="ad-empty">No leads {anyFilter ? 'match these filters' : 'yet — they’ll appear here as soon as someone submits a form on the website'}.</td></tr>}
            </tbody>
          </table>
        </div>
        {pages > 1 && (
          <div className="ad-pager">
            <button disabled={data.page <= 1} onClick={() => setFilter('page', String(data.page - 1))}><ChevronLeft /></button>
            <span>Page {data.page} of {pages}</span>
            <button disabled={data.page >= pages} onClick={() => setFilter('page', String(data.page + 1))}><ChevronRight /></button>
          </div>
        )}
      </div>

      {openId && <LeadDrawer id={openId} users={users} onClose={() => openLead(null)} onChanged={load} />}
    </div>
  );
}

function LeadDrawer({ id, users, onClose, onChanged }) {
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [note, setNote] = useState('');
  const [err, setErr] = useState('');
  const load = useCallback(() => api(`/leads/${id}`).then(setD).catch(e => setErr(e.message)), [id]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const k = e => e.key === 'Escape' && onClose(); document.addEventListener('keydown', k); return () => document.removeEventListener('keydown', k); }, [onClose]);

  const patch = async body => {
    try { await api(`/leads/${id}`, { method: 'PATCH', body }); await load(); onChanged(); } catch (e) { setErr(e.message); }
  };
  const addNote = async e => {
    e.preventDefault(); if (!note.trim()) return;
    try { await api(`/leads/${id}/notes`, { method: 'POST', body: { body: note } }); setNote(''); await load(); onChanged(); } catch (e2) { setErr(e2.message); }
  };
  const remove = async () => {
    if (!window.confirm('Delete this lead permanently? This cannot be undone.')) return;
    try { await api(`/leads/${id}`, { method: 'DELETE' }); onChanged(); onClose(); } catch (e) { setErr(e.message); }
  };
  const l = d?.lead;

  return (
    <>
      <div className="ad-scrim show" onClick={onClose} />
      <aside className="ad-drawer" role="dialog" aria-modal="true" aria-label="Lead details">
        <button className="ad-drawer-x" onClick={onClose} aria-label="Close"><X /></button>
        {!l ? (err ? <div className="ad-alert">{err}</div> : <div className="ad-loading inline"><span /></div>) : (
          <>
            <div className="ad-drawer-head">
              <span className={`ad-pill ${STATUS[l.status]?.tone}`}>{STATUS[l.status]?.label}</span>
              <h2>{l.name}</h2>
              <p>Received {fmtDateTime(l.created_at)} · {SOURCE[l.source] || l.source}</p>
              <div className="ad-actions">
                <a className="ad-btn primary" href={`tel:+91${l.phone}`}><Phone /> Call {l.phone}</a>
                <a className="ad-btn wa" href={waLink(l.phone, l.name)} target="_blank" rel="noreferrer"><WhatsApp /> WhatsApp</a>
              </div>
            </div>

            {err && <div className="ad-alert">{err}</div>}

            <div className="ad-kv">
              <div><small>Class</small><b>{l.student_class || '—'}</b></div>
              <div><small>Interested in</small><b>{l.programs.length ? l.programs.join(', ') : '—'}</b></div>
              {l.email && <div><small><Mail /> Email</small><b><a href={`mailto:${l.email}`}>{l.email}</a></b></div>}
              <div><small><MapPin /> Page</small><b>{l.page || '—'}</b></div>
              {Object.keys(l.utm || {}).length > 0 && <div className="wide"><small><Megaphone /> Campaign</small><b>{Object.entries(l.utm).map(([k, v]) => `${k.replace('utm_', '')}: ${v}`).join(' · ')}</b></div>}
              {l.message && <div className="wide"><small>Message</small><p>{l.message}</p></div>}
            </div>

            <div className="ad-manage">
              <label><span>Status</span>
                <select value={l.status} onChange={e => patch({ status: e.target.value })}>
                  {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
                </select>
              </label>
              <label><span>Assigned to</span>
                <select value={l.assigned_to || ''} onChange={e => patch({ assigned_to: e.target.value ? Number(e.target.value) : null })}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}{u.id === user.id ? ' (me)' : ''}</option>)}
                </select>
              </label>
              <label><span>Follow-up date</span>
                <input type="date" value={l.follow_up_at ? l.follow_up_at.slice(0, 10) : ''} onChange={e => patch({ follow_up_at: e.target.value || null })} />
              </label>
            </div>

            <form className="ad-note-form" onSubmit={addNote}>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note — call outcome, questions asked, visit plans…" rows={2} />
              <button className="ad-btn primary" disabled={!note.trim()}><Send /> Add note</button>
            </form>

            <h3 className="ad-tl-title">Activity</h3>
            <ol className="ad-timeline">
              {d.notes.map(n => (
                <li key={n.id} className={n.kind}>
                  <span className="dot" />
                  <div><p>{n.body}</p><small>{n.user_name || 'Website'} · {fmtDateTime(n.created_at)}</small></div>
                </li>
              ))}
              <li className="system"><span className="dot" /><div><p>Enquiry received via {SOURCE[l.source] || l.source}</p><small>{fmtDateTime(l.created_at)}</small></div></li>
            </ol>

            {user.role === 'admin' && <button className="ad-btn danger ghost" onClick={remove}><Trash2 /> Delete lead</button>}
          </>
        )}
      </aside>
    </>
  );
}
