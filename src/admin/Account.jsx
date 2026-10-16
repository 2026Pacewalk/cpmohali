import { useState } from 'react';
import { KeyRound, Check } from 'lucide-react';
import { api, fmtDateTime } from './api';
import { useAuth } from './AdminApp';

export default function Account() {
  const { user } = useAuth();
  const [f, setF] = useState({ current: '', next: '', confirm: '' });
  const [msg, setMsg] = useState(null);
  const submit = async e => {
    e.preventDefault();
    if (f.next !== f.confirm) return setMsg({ err: 'New passwords do not match' });
    try { await api('/auth/password', { method: 'PATCH', body: { current: f.current, next: f.next } }); setF({ current: '', next: '', confirm: '' }); setMsg({ ok: 'Password changed.' }); }
    catch (err) { setMsg({ err: err.message }); }
  };
  return (
    <div className="ad-page narrow">
      <header className="ad-head"><div><h1>My account</h1><p>{user.name} · {user.email} · {user.role === 'admin' ? 'Admin' : 'Counsellor'}</p></div></header>
      <section className="ad-card">
        <h2><KeyRound /> Change password</h2>
        <form onSubmit={submit} className="ad-form">
          <label className="ad-field"><span>Current password</span><input type="password" required autoComplete="current-password" value={f.current} onChange={e => setF({ ...f, current: e.target.value })} /></label>
          <label className="ad-field"><span>New password <small>(8+ characters)</small></span><input type="password" required minLength={8} autoComplete="new-password" value={f.next} onChange={e => setF({ ...f, next: e.target.value })} /></label>
          <label className="ad-field"><span>Confirm new password</span><input type="password" required minLength={8} autoComplete="new-password" value={f.confirm} onChange={e => setF({ ...f, confirm: e.target.value })} /></label>
          {msg?.err && <div className="ad-alert">{msg.err}</div>}
          {msg?.ok && <div className="ad-alert ok"><Check /> {msg.ok}</div>}
          <button className="ad-btn primary">Update password</button>
        </form>
      </section>
      {user.last_login_at && <p className="ad-help">Last login: {fmtDateTime(user.last_login_at)}</p>}
    </div>
  );
}
