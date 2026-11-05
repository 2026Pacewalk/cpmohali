import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown, ChevronRight, Menu, X, Phone, Mail, Search, FileText, ArrowRight, CornerDownLeft, MapPin, Megaphone,
  UserRound, MessageSquareQuote, Landmark, School, BookOpenCheck, BedDouble, Sparkles, Flower2, Building, Laptop,
  Dumbbell, Sun, Images, Clapperboard, Award, Home as HomeIcon, ClipboardList, GraduationCap, Monitor,
} from 'lucide-react';
import { nav, site, tel, UP } from '../data/site';
import { sitemapGroups } from '../data/sitemap';
import { posts } from './ui';
import { socialIcon, WhatsApp } from './Icons';
import { openEnquiry } from './EnquiryPopup';

/* Short helper text + icons for every menu link (mega menu & mobile menu) */
const INFO = {
  '/chairman/': [UserRound, 'A welcome from our Chairman'],
  '/director-message/': [UserRound, 'Our philosophy of personal care'],
  '/principal-message/': [UserRound, 'Values, character & excellence'],
  '/about-gurukul/': [Landmark, 'An initiative of Career Point Kota'],
  '/parents-reviews/': [MessageSquareQuote, 'What families say about us'],
  '/why-career-point/': [Award, 'Since 1993 — 30,000+ students a year'],
  '/cp-gurukul/': [Sparkles, 'The Gurukul concept at a glance'],
  '/school-2/': [School, 'CBSE schooling, Class 6th onwards'],
  '/integrated-coaching/': [BookOpenCheck, 'IIT-JEE, NEET & NDA by Kota experts'],
  '/hostel-facilities/': [BedDouble, 'Separate AC hostels, 24×7 security'],
  '/life-skill-development/': [Flower2, 'Clubs, houses & competitions'],
  '/best-boarding-schools-for-girls-in-mohali/': [GraduationCap, 'Safe, supportive girls’ boarding'],
  '/hostel/': [BedDouble, 'Rooms, mess, laundry & care'],
  '/facility-copy/': [Sun, 'Mentors, clubs & sports'],
  '/technology-support/': [Laptop, 'Online Student-Parent Zone'],
  '/facilities-at-gurukul-2/': [Dumbbell, 'Labs, pool, gym & more'],
  '/day-in-cpgurukul/': [Building, 'From 6:00 am to lights out'],
  '/photo-gallery/': [Images, 'Moments from campus life'],
  '/video-gallery/': [Clapperboard, 'Campus tours & student stories'],
};
const FEATURE = {
  'About Us': { img: `${UP}/2025/12/0N2A0751-2048x1152.jpg`, title: 'A unit of legendary Career Point, Kota', to: '/about-us/', cta: 'Our story' },
  'CP-Gurukal Concept': { img: `${UP}/2025/09/Integrated-Coaching-cp-mohali.jpg`, title: 'Schooling + coaching + hostel on one campus', to: '/cp-gurukul/', cta: 'Explore the concept' },
  'Campus Life': { img: `${UP}/2025/09/cp-hostel-1-1.jpg`, title: 'A disciplined, joyful day — every day', to: '/day-in-cpgurukul/', cta: 'A day in Gurukul' },
  Media: { img: `${UP}/2025/09/Life-at-Gurukul-768x576-1.jpg`, title: 'See life at Gurukul', to: '/photo-gallery/', cta: 'Open gallery' },
};
const TICKER = [
  'Admissions open for the 2027-28 session — Class 6th onwards',
  'CP Star Scholarship 2026 · Phase I: 11 October · Phase II: 11 November',
  'Integrated IIT-JEE, NEET & NDA coaching by expert faculty from Kota',
  'Separate AC hostels for boys & girls with 24×7 security',
];

const isActive = (item, path) => item.to === path || item.children?.some(c => c.to === path);

/* ---------------- Search palette (Ctrl/⌘ + K) ---------------- */
// Extra words people search for, per page
const KEYWORDS = {
  '/cbt-computer-based-test/': 'cbt computer based test online exam neet 2027 jee nta mock practice',
  '/admission-guidelines/': 'apply admission process documents eligibility refund class 6',
  '/contact/': 'phone call email address map location directions enquiry',
  '/integrated-coaching/': 'iit jee neet nda kota coaching faculty competitive exam',
  '/school-2/': 'cbse school academics classroom labs scholarship',
  '/hostel-facilities/': 'hostel rooms boarding residential girls boys security',
  '/hostel/': 'hostel rooms mess food laundry',
  '/best-boarding-schools-for-girls-in-mohali/': 'girls hostel safety boarding',
  '/indoor-outdoor-sports/': 'sports games football basketball cricket volleyball badminton table tennis chess skating swimming pool',
  '/yoga-physical-training/': 'yoga pt physical training fitness exercise meditation breathing wellness',
  '/facility/': 'labs pool swimming gym sports library smart class medical',
  '/facilities-at-gurukul-2/': 'labs pool swimming gym sports library',
  '/day-in-cpgurukul/': 'routine timetable schedule daily',
  '/certificates/': 'cbse affiliation noc documents fire safety mandatory disclosure fee 2026',
  '/photo-gallery/': 'photos pictures images events',
  '/video-gallery/': 'videos youtube campus tour',
  '/clat-ipmat/': 'clat ipmat iim law management',
  '/parents-reviews/': 'testimonials reviews feedback',
  '/about-us/': 'about campus infrastructure neet jee nda commerce study abroad',
};
const SEARCH_INDEX = [
  ...sitemapGroups.flatMap(g => g.links.map(l => ({ label: l.label, to: l.to, group: g.title, keys: [INFO[l.to]?.[1], KEYWORDS[l.to]].filter(Boolean).join(' ') }))),
  ...posts.map(p => ({ label: p.title, to: `/${p.slug}/`, group: 'Blog', keys: p.topics.join(' ') })),
  { label: 'Fee Structure (PDF)', href: site.feePdf, group: 'Downloads', keys: 'fees cost charges pdf' },
];
const searchPages = (q, limit) => {
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return SEARCH_INDEX
    .map(r => {
      const label = r.label.toLowerCase(), all = `${label} ${r.group} ${r.keys || ''}`.toLowerCase();
      if (!words.every(w => all.includes(w))) return null;
      return { r, score: words.reduce((s, w) => s + (label.includes(w) ? 3 : 1), 0) };
    })
    .filter(Boolean).sort((a, b) => b.score - a.score).slice(0, limit).map(x => x.r);
};

function SearchPalette({ onClose }) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SEARCH_INDEX.filter(r => ['Main pages', 'CP-Gurukul Concept'].includes(r.group)).slice(0, 8);
    return searchPages(s, 10);
  }, [q]);
  useEffect(() => { inputRef.current?.focus(); document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => setSel(0), [q]);
  const open = r => { onClose(); if (r.href) window.open(r.href, '_blank', 'noopener'); else navigate(r.to); };
  const onKey = e => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[sel]) open(results[sel]);
  };
  return (
    <motion.div className="sp-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.div className="sp" role="dialog" aria-modal="true" aria-label="Search the site" initial={{ y: -20, scale: .97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ type: 'spring', damping: 26, stiffness: 320 }} onMouseDown={e => e.stopPropagation()}>
        <label className="sp-input">
          <Search size={20} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search pages, programmes, articles…" aria-label="Search" />
          <kbd>Esc</kbd>
        </label>
        <div className="sp-list" role="listbox">
          {!q && <small className="sp-label">Popular</small>}
          {results.length === 0 && <p className="sp-empty">No results for “{q}”. Try “hostel”, “NEET” or “admission”.</p>}
          {results.map((r, i) => (
            <button key={r.label + r.group} role="option" aria-selected={i === sel} className={i === sel ? 'on' : ''} onMouseEnter={() => setSel(i)} onClick={() => open(r)}>
              <span className="sp-ico">{r.href ? <FileText size={16} /> : <ArrowRight size={16} />}</span>
              <span className="sp-txt"><b>{r.label}</b><small>{r.group}</small></span>
              {i === sel && <CornerDownLeft size={15} className="sp-enter" />}
            </button>
          ))}
        </div>
        <div className="sp-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><Link to="/sitemap/" onClick={onClose}>All pages <ArrowRight size={13} /></Link></div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Desktop mega menu item ---------------- */
function NavItem({ item, path, hovered, setHovered, open, setOpen }) {
  const active = isActive(item, path);
  const pill = hovered === item.label && <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />;
  if (!item.children) {
    return (
      <li onMouseEnter={() => setHovered(item.label)}>
        {item.href
          ? <a href={item.href} target="_blank" rel="noreferrer">{pill}<span>{item.label}</span><em className="pdf">PDF</em></a>
          : <NavLink to={item.to} end title={item.title} className={({ isActive: a }) => (a ? 'active' : '')}>{pill}<span>{item.label}</span>{item.badge && <em className="new-tag">{item.badge}</em>}</NavLink>}
      </li>
    );
  }
  const f = FEATURE[item.label];
  const isOpen = open === item.label;
  return (
    <li className={isOpen ? 'open' : ''} onMouseEnter={() => { setHovered(item.label); setOpen(item.label); }} onMouseLeave={() => setOpen(null)}>
      <button className={active ? 'active' : ''} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : item.label)}>
        {pill}<span>{item.label}</span><ChevronDown className="chev" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div className="mega" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: .18 }} onClick={() => setOpen(null)}>
            <div className="mega-links">
              {item.to && (
                <NavLink to={item.to} end className="mega-link overview">
                  <span className="mi"><HomeIcon /></span><span><b>{item.label} — Overview</b><small>Start here</small></span>
                </NavLink>
              )}
              {item.children.map(c => {
                const [I, d] = INFO[c.to] || [ChevronRight, ''];
                return (
                  <NavLink key={c.to} to={c.to} className="mega-link">
                    <span className="mi"><I /></span><span><b>{c.label}</b>{d && <small>{d}</small>}</span>
                  </NavLink>
                );
              })}
            </div>
            {f && (
              <Link to={f.to} className="mega-feature">
                <img src={f.img} alt="" />
                <span><b>{f.title}</b><em>{f.cta} <ArrowRight size={14} /></em></span>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/* ---------------- Mobile menu ---------------- */
function MobileMenu({ onClose, path, openSearch }) {
  const [open, setOpen] = useState(() => nav.findIndex(n => isActive(n, path)));
  const [q, setQ] = useState('');
  const s = q.trim().toLowerCase();
  const matches = s ? searchPages(s, 8) : [];
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);

  return (
    <>
      <motion.div className="mm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside className="mm" role="dialog" aria-modal="true" aria-label="Menu"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}
        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={{ left: 0, right: .5 }}
        onDragEnd={(_, info) => { if (info.offset.x > 110 || info.velocity.x > 600) onClose(); }}>
        <div className="mm-head">
          <Link to="/" onClick={onClose} className="mm-logo"><img src={site.logo} alt="Career Point Gurukul" /></Link>
          <button className="mm-close" onClick={onClose} aria-label="Close menu"><X /></button>
        </div>
        <div className="mm-handle" aria-hidden>Swipe right to close</div>

        <div className="mm-scroll">
          <label className="mm-search">
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search pages…" aria-label="Search pages" />
            {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={15} /></button>}
          </label>

          {s ? (
            <div className="mm-results">
              {matches.length === 0 && <p className="mm-empty">No pages match “{q}”.</p>}
              {matches.map(r => r.href
                ? <a key={r.label} href={r.href} target="_blank" rel="noreferrer"><b>{r.label}</b><small>{r.group}</small></a>
                : <Link key={r.label} to={r.to} onClick={onClose}><b>{r.label}</b><small>{r.group}</small></Link>)}
            </div>
          ) : (
            <>
              <div className="mm-quick">
                <a href={tel(site.phones[0])}><Phone /><span>Call</span></a>
                <a href={site.wa.register} target="_blank" rel="noreferrer" className="wa"><WhatsApp /><span>WhatsApp</span></a>
                <a href={site.mapLink} target="_blank" rel="noreferrer"><MapPin /><span>Directions</span></a>
                <a href={site.feePdf} target="_blank" rel="noreferrer"><FileText /><span>Fees</span></a>
              </div>

              <nav className="mm-nav">
                {nav.map((n, i) => {
                  if (!n.children) {
                    return n.href
                      ? <a key={n.label} className="mm-row" href={n.href} target="_blank" rel="noreferrer"><span className="mm-ri"><FileText /></span>{n.label}<em className="pdf">PDF</em></a>
                      : <NavLink key={n.label} className="mm-row" to={n.to} end onClick={onClose}><span className="mm-ri">{n.to === '/' ? <HomeIcon /> : n.badge ? <Monitor /> : <ClipboardList />}</span>{n.title || n.label}{n.badge && <em className="new-tag">{n.badge}</em>}<ChevronRight className="mm-arrow" /></NavLink>;
                  }
                  const isO = open === i;
                  return (
                    <div key={n.label} className={`mm-group ${isO ? 'open' : ''} ${isActive(n, path) ? 'has-active' : ''}`}>
                      <button className="mm-row" onClick={() => setOpen(isO ? -1 : i)} aria-expanded={isO}>
                        <span className="mm-ri">{n.label === 'About Us' ? <Landmark /> : n.label === 'Media' ? <Images /> : n.label === 'Campus Life' ? <Building /> : <Sparkles />}</span>
                        {n.label}<i className="mm-count">{n.children.length}</i><ChevronDown className="mm-chev" />
                      </button>
                      <AnimatePresence initial={false}>
                        {isO && (
                          <motion.div className="mm-sub" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .25 }}>
                            {n.to && <NavLink to={n.to} end onClick={onClose}><b>Overview</b><small>{n.label}</small></NavLink>}
                            {n.children.map(c => {
                              const [, d] = INFO[c.to] || [null, ''];
                              return <NavLink key={c.to} to={c.to} onClick={onClose}><b>{c.label}</b>{d && <small>{d}</small>}</NavLink>;
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
                <NavLink className="mm-row" to="/contact/" onClick={onClose}><span className="mm-ri"><Mail /></span>Contact Us<ChevronRight className="mm-arrow" /></NavLink>
              </nav>

              <div className="mm-cta">
                <span className="pill"><i />Admissions open 2027-28</span>
                <b>Schooling + coaching + hostel — one safe campus.</b>
                <a className="btn gold" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Register now</a>
              </div>
            </>
          )}
        </div>

        <div className="mm-foot">
          <div className="mm-socials">
            {site.socials.map(sc => { const I = socialIcon[sc.name]; return <a key={sc.name} href={sc.href} target="_blank" rel="noreferrer" aria-label={sc.name}><I /></a>; })}
          </div>
          <button className="mm-searchall" onClick={() => { onClose(); openSearch(); }}><Search size={15} /> Search all</button>
        </div>
      </motion.aside>
    </>
  );
}

/* ---------------- Header ---------------- */
export default function Header() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [open, setOpen] = useState(null);
  const lastY = useRef(0);

  useEffect(() => {
    const on = () => {
      const y = window.scrollY;
      setScrolled(y > 10);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 320) setHidden(false);
      lastY.current = y;
    };
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => { setDrawer(false); setOpen(null); setSearch(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = drawer ? 'hidden' : ''; }, [drawer]);
  useEffect(() => {
    const k = e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearch(s => !s); } };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <div className="tb-left">
            <a href={tel(site.phones[0])}><Phone />{site.phones[0]}</a>
            <span className="badge-cbse">{site.affiliation}</span>
          </div>
          <div className="tb-ticker" aria-label="Announcements">
            <Megaphone className="tb-mega" />
            <div className="tb-track">{[...TICKER, ...TICKER].map((t, i) => <span key={i}>{t}</span>)}</div>
          </div>
          <div className="tb-right">
            <a className="tb-hide" href={`mailto:${site.email}`}><Mail />{site.email}</a>
            <div className="socials">
              {site.socials.map(s => { const I = socialIcon[s.name]; return <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><I /></a>; })}
            </div>
          </div>
        </div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''} ${hidden && !open && !drawer ? 'hide' : ''}`}>
        <div className="wrap">
          <Link to="/" className="brand" aria-label="Career Point Gurukul Chandigarh — Home"><img src={site.logo} alt="Career Point Gurukul Chandigarh" width="408" height="246" /></Link>
          <nav aria-label="Main">
            <ul className="menu" onMouseLeave={() => setHovered(null)}>
              {nav.map(n => <NavItem key={n.label} item={n} path={pathname} hovered={hovered} setHovered={setHovered} open={open} setOpen={setOpen} />)}
            </ul>
          </nav>
          <div className="header-cta">
            <button className="icon-btn search-btn" onClick={() => setSearch(true)} aria-label="Search (Ctrl+K)" title="Search  (Ctrl + K)">
              <Search />
            </button>
            <a className="icon-btn call-btn" href={tel(site.phones[0])} aria-label="Call admissions"><Phone /></a>
            <button className="btn sm desktop apply" onClick={openEnquiry}><WhatsApp /> Apply Now</button>
            <button className="burger" onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer}><Menu /></button>
          </div>
        </div>
      </header>

      <AnimatePresence>{drawer && <MobileMenu onClose={() => setDrawer(false)} path={pathname} openSearch={() => setSearch(true)} />}</AnimatePresence>
      <AnimatePresence>{search && <SearchPalette onClose={() => setSearch(false)} />}</AnimatePresence>
    </>
  );
}
