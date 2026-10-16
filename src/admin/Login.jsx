import { useState } from 'react';
import { Lock, Mail, LogIn } from 'lucide-react';
import { api } from './api';
import { useAuth } from './AdminApp';

export default function Login() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('');
    try { const d = await api('/auth/login', { method: 'POST', body: { email, password } }); setUser(d.user); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return (
    <div className="ad-login">
      <form className="ad-login-card" onSubmit={submit}>
        <img src="/wp-content/uploads/2023/07/Screenshot-2025-09-14-213813.png" alt="Career Point Gurukul" className="ad-login-logo" />
        <h1>Leads admin</h1>
        <p>Sign in to manage admission enquiries.</p>
        <label className="ad-field"><span>Email</span><div className="ad-input"><Mail /><input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@cpmohali.in" /></div></label>
        <label className="ad-field"><span>Password</span><div className="ad-input"><Lock /><input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div></label>
        {error && <div className="ad-alert">{error}</div>}
        <button className="ad-btn primary block" disabled={busy}><LogIn /> {busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  );
}
