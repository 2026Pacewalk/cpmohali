import { useCallback, useEffect, useState } from 'react';
import { UserPlus, KeyRound, ShieldCheck, Shuffle, X, Copy, Check } from 'lucide-react';
import { api, fmtDateTime } from './api';
import { useAuth } from './AdminApp';

const genPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const a = new Uint32Array(12); crypto.getRandomValues(a);
  return Array.from(a, n => chars[n % chars.length]).join('');
};

export default function Staff() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState('');
  const [modal, setModal] = useState(null); // {mode:'add'} | {mode:'reset', user}
  const load = useCallback(() => api('/users').then(d => setUsers(d.users)).catch(e => setErr(e.message)), []);
  useEffect(() => { load(); }, [load]);

  const update = async (u, body) => {
    try { await api(`/users/${u.id}`, { method: 'PATCH', body }); load(); } catch (e) { setErr(e.message); }
  };

  return (
    <div className="ad-page">
      <header className="ad-head">
        <div><h1>Staff</h1><p>{isAdmin ? 'Add counsellors, set roles and manage access.' : 'Your team. Only admins can change accounts.'}</p></div>
        {isAdmin && <button className="ad-btn primary" onClick={() => setModal({ mode: 'add' })}><UserPlus /> Add staff</button>}
      </header>
      {err && <div className="ad-alert">{err}</div>}
      <div className="ad-card flush">
        <div className="ad-table-wrap">
          <table className="ad-table plain">
            <thead><tr><th>Name</th><th>Role</th><th>Leads</th><th>Last login</th><th>Status</th>{isAdmin && <th />}</tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className={u.active ? '' : 'is-off'}>
                  <td><b>{u.name}{u.id === user.id && ' (you)'}</b><small>{u.email}</small></td>
                  <td>
                    {isAdmin && u.id !== user.id
                      ? <select value={u.role} onChange={e => update(u, { role: e.target.value })} aria-label="Role"><option value="counsellor">Counsellor</option><option value="admin">Admin</option></select>
                      : <span className={`ad-pill ${u.role === 'admin' ? 'indigo' : 'teal'}`}>{u.role === 'admin' ? <><ShieldCheck /> Admin</> : 'Counsellor'}</span>}
                  </td>
                  <td>{u.lead_count}</td>
                  <td className="nowrap">{u.last_login_at ? fmtDateTime(u.last_login_at) : <span className="muted">Never</span>}</td>
                  <td>
                    {isAdmin && u.id !== user.id
                      ? <label className="ad-switch"><input type="checkbox" checked={u.active} onChange={e => update(u, { active: e.target.checked })} /><span />{u.active ? 'Active' : 'Disabled'}</label>
                      : <span className={`ad-pill ${u.active ? 'green' : 'grey'}`}>{u.active ? 'Active' : 'Disabled'}</span>}
                  </td>
                  {isAdmin && <td className="right"><button className="ad-btn sm" onClick={() => setModal({ mode: 'reset', user: u })}><KeyRound /> Reset password</button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="ad-help">
        <b>Roles:</b> <em>Counsellors</em> see and work all leads (status, notes, follow-ups, assignment). <em>Admins</em> can also add or disable staff, reset passwords and delete leads.
      </div>
      {modal && <StaffModal modal={modal} onClose={() => setModal(null)} onDone={() => { setModal(null); load(); }} />}
    </div>
  );
}

function StaffModal({ modal, onClose, onDone }) {
  const adding = modal.mode === 'add';
  const [f, setF] = useState({ name: '', email: '', role: 'counsellor', password: genPassword() });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setErr('');
    try {
      if (adding) await api('/users', { method: 'POST', body: f });
      else await api(`/users/${modal.user.id}`, { method: 'PATCH', body: { password: f.password } });
      setSaved(true);
    } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(`Email: ${adding ? f.email : modal.user.email}\nPassword: ${f.password}\nLogin: ${window.location.origin}/admin`); setCopied(true); } catch { /* ignore */ } };

  return (
    <>
      <div className="ad-scrim show" onClick={onClose} />
      <div className="ad-modal" role="dialog" aria-modal="true">
        <button className="ad-drawer-x" onClick={onClose} aria-label="Close"><X /></button>
        {saved ? (
          <div className="ad-saved">
            <span className="ad-kpi-ico green"><Check /></span>
            <h2>{adding ? 'Staff account created' : 'Password reset'}</h2>
            <p>Share these login details privately with {adding ? f.name : modal.user.name}. They can change the password from “My account”.</p>
            <button className="ad-btn" onClick={copy}>{copied ? <><Check /> Copied</> : <><Copy /> Copy login details</>}</button>
            <button className="ad-btn primary" onClick={onDone}>Done</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <h2>{adding ? 'Add staff member' : `Reset password — ${modal.user.name}`}</h2>
            {adding && <>
              <label className="ad-field"><span>Full name</span><input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Riya Sharma" /></label>
              <label className="ad-field"><span>Email (used to log in)</span><input required type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="riya@cpmohali.in" /></label>
              <label className="ad-field"><span>Role</span>
                <select value={f.role} onChange={e => setF({ ...f, role: e.target.value })}><option value="counsellor">Counsellor</option><option value="admin">Admin</option></select>
              </label>
            </>}
            <label className="ad-field"><span>{adding ? 'Temporary password' : 'New password'}</span>
              <div className="ad-input"><input required minLength={8} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /><button type="button" className="ad-icon-btn" onClick={() => setF({ ...f, password: genPassword() })} title="Generate"><Shuffle /></button></div>
            </label>
            {err && <div className="ad-alert">{err}</div>}
            <button className="ad-btn primary block" disabled={busy}>{busy ? 'Saving…' : adding ? 'Create account' : 'Set new password'}</button>
          </form>
        )}
      </div>
    </>
  );
}
