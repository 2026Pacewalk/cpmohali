import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, Sparkles, CalendarDays, TrendingUp, GraduationCap, UserCheck, ArrowRight, BellRing } from 'lucide-react';
import { api, STATUS, SOURCE, fmtDay } from './api';
import { useAuth } from './AdminApp';

export default function Dashboard() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/stats').then(setS).catch(e => setErr(e.message)); }, []);
  if (err) return <div className="ad-alert">{err}</div>;
  if (!s) return <div className="ad-loading inline"><span /></div>;

  const max = Math.max(1, ...s.daily.map(d => d.n));
  const statusCount = Object.fromEntries(s.byStatus.map(r => [r.status, r.n]));
  const kpis = [
    { label: 'Total leads', v: s.total, I: Inbox, to: '/admin/leads' },
    { label: 'New (uncontacted)', v: s.fresh, I: Sparkles, to: '/admin/leads?status=new', tone: 'red' },
    { label: 'Today', v: s.today, I: CalendarDays },
    { label: 'Last 7 days', v: s.week, I: TrendingUp },
    { label: 'Admitted', v: s.admitted, I: GraduationCap, to: '/admin/leads?status=admitted', tone: 'green' },
    { label: 'Assigned to me', v: s.mine, I: UserCheck, to: '/admin/leads?assigned=me' },
  ];

  return (
    <div className="ad-page">
      <header className="ad-head">
        <div><h1>Hello, {user.name.split(' ')[0]} 👋</h1><p>Here’s how admission enquiries are coming in.</p></div>
        <Link className="ad-btn primary" to="/admin/leads">Open leads <ArrowRight /></Link>
      </header>

      <div className="ad-kpis">
        {kpis.map(({ label, v, I, to, tone }) => {
          const inner = <><span className={`ad-kpi-ico ${tone || ''}`}><I /></span><b>{v}</b><small>{label}</small></>;
          return to ? <Link key={label} to={to} className="ad-kpi">{inner}</Link> : <div key={label} className="ad-kpi">{inner}</div>;
        })}
      </div>

      <div className="ad-grid2">
        <section className="ad-card">
          <h2>Leads per day <small>last 14 days</small></h2>
          <div className="ad-bars" role="img" aria-label="Leads per day for the last 14 days">
            {s.daily.map(d => (
              <div key={d.day} className="ad-bar" title={`${fmtDay(d.day)}: ${d.n}`}>
                <span className="v">{d.n || ''}</span>
                <i style={{ height: `${(d.n / max) * 100}%` }} />
                <small>{new Date(d.day).getDate()}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="ad-card">
          <h2>Pipeline</h2>
          <div className="ad-pipe">
            {Object.entries(STATUS).map(([k, { label, tone }]) => {
              const n = statusCount[k] || 0;
              return (
                <Link key={k} to={`/admin/leads?status=${k}`} className="ad-pipe-row">
                  <span className={`ad-pill ${tone}`}>{label}</span>
                  <span className="ad-pipe-bar"><i className={tone} style={{ width: `${s.total ? (n / s.total) * 100 : 0}%` }} /></span>
                  <b>{n}</b>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      <div className="ad-grid2">
        <section className="ad-card">
          <h2><BellRing /> Follow-ups due</h2>
          {s.due.length === 0 ? <p className="ad-empty">No follow-ups due. 🎉</p> : (
            <ul className="ad-list">
              {s.due.map(l => (
                <li key={l.id}><Link to={`/admin/leads?open=${l.id}`}>
                  <span><b>{l.name}</b><small>{l.phone} · {l.assigned_name || 'Unassigned'}</small></span>
                  <span className={`ad-date ${l.follow_up_at.slice(0, 10) < new Date().toISOString().slice(0, 10) ? 'late' : ''}`}>{fmtDay(l.follow_up_at)}</span>
                </Link></li>
              ))}
            </ul>
          )}
        </section>
        <section className="ad-card">
          <h2>Where leads come from</h2>
          {s.bySource.length === 0 ? <p className="ad-empty">No leads yet.</p> : (
            <ul className="ad-list">
              {s.bySource.map(r => (
                <li key={r.source}><Link to={`/admin/leads?source=${r.source}`}><span><b>{SOURCE[r.source] || r.source}</b></span><span className="ad-count">{r.n}</span></Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
