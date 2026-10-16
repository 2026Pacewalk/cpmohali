import { createContext, useContext, useEffect, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users2, UserCog, LogOut, Inbox, Menu, X, ExternalLink } from 'lucide-react';
import { api } from './api';
import Login from './Login';
import Dashboard from './Dashboard';
import Leads from './Leads';
import Staff from './Staff';
import Account from './Account';
import './admin.css';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out
  useEffect(() => { api('/auth/me').then(d => setUser(d.user)).catch(() => setUser(null)); }, []);

  return (
    <AuthCtx.Provider value={{ user, setUser }}>
      <title>Admin · Career Point Gurukul</title>
      <meta name="robots" content="noindex, nofollow" />
      {user === undefined ? <div className="ad-loading"><span /></div> : user ? <Shell /> : <Login />}
    </AuthCtx.Provider>
  );
}

function Shell() {
  const { user, setUser } = useAuth();
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const logout = async () => { await api('/auth/logout', { method: 'POST' }).catch(() => {}); setUser(null); navigate('/admin'); };
  const links = [
    { to: '/admin', end: true, label: 'Dashboard', I: LayoutDashboard },
    { to: '/admin/leads', label: 'Leads', I: Inbox },
    { to: '/admin/staff', label: 'Staff', I: Users2 },
    { to: '/admin/account', label: 'My account', I: UserCog },
  ];
  return (
    <div className="ad">
      <aside className={`ad-side ${menu ? 'open' : ''}`} onClick={() => setMenu(false)}>
        <div className="ad-brand"><img src="/wp-content/uploads/2025/08/New-Career-Point-Logo-Icon-.png" alt="" /><span><b>CP Gurukul</b><small>Leads admin</small></span></div>
        <nav>{links.map(({ to, end, label, I }) => <NavLink key={to} to={to} end={end}><I />{label}</NavLink>)}</nav>
        <a className="ad-site" href="/" target="_blank" rel="noreferrer"><ExternalLink /> View website</a>
        <div className="ad-me">
          <span className="ad-avatar">{user.name.slice(0, 1).toUpperCase()}</span>
          <span><b>{user.name}</b><small>{user.role === 'admin' ? 'Admin' : 'Counsellor'}</small></span>
          <button onClick={logout} aria-label="Log out" title="Log out"><LogOut /></button>
        </div>
      </aside>
      {menu && <div className="ad-scrim" onClick={() => setMenu(false)} />}
      <main className="ad-main">
        <button className="ad-burger" onClick={() => setMenu(m => !m)} aria-label="Menu">{menu ? <X /> : <Menu />}</button>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="staff" element={<Staff />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
}
