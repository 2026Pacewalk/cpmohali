import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Plus, Play, X, ChevronLeft, Phone, Mail, MapPin, Send, ArrowRight } from 'lucide-react';
import { site, tel } from '../data/site';
import { WhatsApp } from './Icons';
import seo from '../data/seo.json';

/* ---------- SEO (React 19 hoists these into <head>) ---------- */
export function Seo({ slug, title, description }) {
  const s = (slug && seo[slug]) || {};
  const t = s.title || (title ? `${title} - Career Point Gurukul Chandigarh` : 'Career Point Gurukul Chandigarh');
  const d = s.description || description;
  return (
    <>
      <title>{t}</title>
      {d && <meta name="description" content={d} />}
      <meta property="og:title" content={t} />
      {d && <meta property="og:description" content={d} />}
    </>
  );
}

/* ---------- Motion ---------- */
export const Reveal = ({ children, delay = 0, y = 28, className, as = 'div', ...rest }) => {
  const M = motion[as];
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: .7, delay, ease: [.2, .8, .2, 1] }} {...rest}>
      {children}
    </M>
  );
};

export const Ring = ({ className, color = 'rgba(255,255,255,.35)' }) => (
  <svg className={`ring-svg ${className || ''}`} viewBox="0 0 400 400" style={{ color }} aria-hidden>
    {[190, 150, 110, 70].map((r, i) => <circle key={r} cx="200" cy="200" r={r} strokeWidth="1" strokeDasharray={i % 2 ? '3 7' : 'none'} />)}
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return <line key={i} x1={200 + Math.cos(a) * 110} y1={200 + Math.sin(a) * 110} x2={200 + Math.cos(a) * 150} y2={200 + Math.sin(a) * 150} stroke="currentColor" strokeWidth=".6" />;
    })}
  </svg>
);

export const Stamp = ({ text = 'Since 1993 • Career Point Kota • Gurukul Mohali • ', className }) => (
  <svg viewBox="0 0 120 120" className={className} aria-hidden>
    <circle cx="60" cy="60" r="58" fill="#f6c343" />
    <g className="stamp" style={{ transformOrigin: '60px 60px' }}>
      <defs><path id="circ" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
      <text><textPath href="#circ">{text}</textPath></text>
    </g>
    <image href={site.icon} x="38" y="38" width="44" height="44" />
  </svg>
);

/* ---------- Page hero ---------- */
export function PageHero({ title, crumbs = [], lede, image, children }) {
  return (
    <section className="page-hero">
      {image && <div className="ph-bg"><img src={image} alt="" /></div>}
      <Ring className="ph-ring" />
      <div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map(c => (<span key={c.label} style={{ display: 'contents' }}><ChevronRight />{c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}</span>))}
          <ChevronRight /><span style={{ color: '#fff' }}>{title}</span>
        </nav>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.2, .8, .2, 1] }}>{title}</motion.h1>
        {lede && <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .3 }}>{lede}</motion.p>}
        {children}
      </div>
    </section>
  );
}

export const SectionHead = ({ eyebrow, title, lede, center, children }) => (
  <Reveal className={`head ${center ? 'center' : ''}`}>
    {eyebrow && <span className="eyebrow">{eyebrow}</span>}
    {title && <h2>{title}</h2>}
    {lede && <p className="lede">{lede}</p>}
    {children}
  </Reveal>
);

/* ---------- Links (internal vs external) ---------- */
export function SmartLink({ href, children, ...rest }) {
  if (!href || href === '#') return <span {...rest}>{children}</span>;
  if (href.startsWith('/') && !href.startsWith('/wp-content')) return <Link to={href} {...rest}>{children}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>{children}</a>;
}

/* ---------- Video ---------- */
export const ytId = url => (url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];

export function Video({ src, portrait, poster }) {
  const [on, setOn] = useState(false);
  const id = ytId(src || '');
  if (id) {
    return (
      <div className="video">
        {on ? (
          <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`} title="Career Point Gurukul video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        ) : (
          <button className="video-poster" onClick={() => setOn(true)} aria-label="Play video">
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="play"><Play fill="currentColor" /></span>
          </button>
        )}
      </div>
    );
  }
  return (
    <div className={`video ${portrait ? 'portrait' : ''}`}>
      <video src={src} controls muted loop playsInline preload="metadata" poster={poster} />
    </div>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq">
      {items.map((it, i) => (
        <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            {it.q}<span className="pm"><Plus /></span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35 }}>
                <div className="faq-a">{it.a}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---------- Lightbox ---------- */
export function useLightbox(images) {
  const [idx, setIdx] = useState(-1);
  const close = useCallback(() => setIdx(-1), []);
  const go = useCallback(d => setIdx(i => (i + d + images.length) % images.length), [images.length]);
  useEffect(() => {
    if (idx < 0) return;
    const onKey = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [idx, close, go]);
  const node = (
    <AnimatePresence>
      {idx >= 0 && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} role="dialog" aria-modal="true">
          <motion.img key={images[idx]} src={images[idx]} alt="" initial={{ scale: .94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()} />
          <button className="lb-btn lb-close" onClick={close} aria-label="Close"><X /></button>
          {images.length > 1 && <>
            <button className="lb-btn lb-prev" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Previous"><ChevronLeft /></button>
            <button className="lb-btn lb-next" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Next"><ChevronRight /></button>
            <span className="lb-count">{idx + 1} / {images.length}</span>
          </>}
        </motion.div>
      )}
    </AnimatePresence>
  );
  return [setIdx, node];
}

/* ---------- Testimonials scroller ---------- */
function TestiCard({ t }) {
  const [more, setMore] = useState(false);
  return (
    <article className="testi">
      <div className="who">
        {t.img && <img src={t.img} alt={t.name} loading="lazy" />}
        <div><b>{t.name}</b><span className="stars" aria-label="5 stars">★★★★★</span></div>
        <span className="q" aria-hidden>“</span>
      </div>
      <p className={more ? '' : 'clamp'}>{t.quote}</p>
      {t.quote.length > 220 && <button className="more" onClick={() => setMore(m => !m)}>{more ? 'Show less' : 'Read more'}</button>}
    </article>
  );
}

export function Testimonials({ items }) {
  const ref = useRef(null);
  const scroll = d => ref.current?.scrollBy({ left: d * ref.current.clientWidth * .8, behavior: 'smooth' });
  return (
    <div className="testi-wrap">
      <div className="testi-scroller" ref={ref}>
        {items.map((t, i) => (
          <TestiCard t={t} key={i} />
        ))}
      </div>
      <div className="scroller-nav" style={{ justifyContent: 'center', marginTop: 8 }}>
        <button className="round-btn" onClick={() => scroll(-1)} aria-label="Previous"><ChevronLeft /></button>
        <button className="round-btn" onClick={() => scroll(1)} aria-label="Next"><ChevronRight /></button>
      </div>
    </div>
  );
}

/* ---------- Contact (form sends via WhatsApp — no backend needed) ---------- */
export function ContactForm({ compact }) {
  const [f, setF] = useState({ name: '', phone: '', email: '', cls: '', msg: '' });
  const up = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => {
    e.preventDefault();
    const text = `Hello Career Point Gurukul,%0A%0AStudent Name: ${f.name}%0AMobile: ${f.phone}%0AEmail: ${f.email}%0ACurrently Studying in: ${f.cls}%0AMessage: ${f.msg}`;
    window.open(`https://wa.me/${site.whatsappNumber}?text=${text.replace(/ /g, '%20')}`, '_blank', 'noopener');
  };
  return (
    <form onSubmit={submit} className="form-grid">
      <div className="field"><label htmlFor="cf-n">Student Name</label><input id="cf-n" required value={f.name} onChange={up('name')} placeholder="Student Name" /></div>
      <div className="field"><label htmlFor="cf-p">Mobile Number</label><input id="cf-p" required type="tel" pattern="[0-9+\- ]{10,15}" value={f.phone} onChange={up('phone')} placeholder="Mobile Number" /></div>
      {!compact && <div className="field"><label htmlFor="cf-e">Email</label><input id="cf-e" type="email" value={f.email} onChange={up('email')} placeholder="Email address" /></div>}
      <div className={`field ${compact ? '' : ''}`}><label htmlFor="cf-c">Currently Studying in ?</label>
        <select id="cf-c" required value={f.cls} onChange={up('cls')}>
          <option value="">Select class</option>
          {['6th Class', '7th Class', '8th Class', '9th Class', '10th Class', '11th Class', '12th Class'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="field full"><label htmlFor="cf-m">Your message</label><textarea id="cf-m" value={f.msg} onChange={up('msg')} placeholder="Your message..." /></div>
      <div className="full">
        <button className="btn" type="submit"><Send /> Submit Enquiry</button>
        <p className="form-note">Your enquiry opens in WhatsApp, pre-filled, and goes straight to our admissions desk.</p>
      </div>
    </form>
  );
}

export function ContactSection({ withMap = true }) {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <Reveal className="contact-grid">
          <div className="contact-info">
            <Ring className="ph-ring" color="rgba(255,255,255,.18)" />
            <span className="eyebrow">Contact us</span>
            <h2>Get In Touch</h2>
            <p style={{ marginBottom: 20 }}>Visit our green campus near Chandigarh International Airport, or reach the admissions team directly.</p>
            <div className="c-row"><span className="c-ico"><Phone /></span><div><small>Phone</small>{site.phones.map((p, i) => <span key={p}>{i > 0 && ' | '}<a href={tel(p)}>{p}</a></span>)}</div></div>
            <div className="c-row"><span className="c-ico"><Mail /></span><div><small>Email</small><a href={`mailto:${site.email}`}>{site.email}</a></div></div>
            <div className="c-row"><span className="c-ico"><MapPin /></span><div><small>Locations</small><a href={site.mapLink} target="_blank" rel="noreferrer">{site.address}</a></div></div>
            <a className="btn gold" style={{ marginTop: 20 }} href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Chat on WhatsApp</a>
          </div>
          <div className="contact-form">
            <h3 style={{ marginBottom: 20 }}>Request a Call</h3>
            <ContactForm />
          </div>
        </Reveal>
        {withMap && <Reveal className="map"><iframe title="Career Point Gurukul location" src={site.mapEmbed} loading="lazy" /></Reveal>}
      </div>
    </section>
  );
}

/* ---------- Blog ---------- */
import pages from '../data/pages.json';
const cats = Object.fromEntries((seo._categories || []).map(c => [c.id, c]));
export const blogImages = {
  'boarding-school-vs-day-school-which-is-right-for-your-child': '/wp-content/uploads/2024/02/New-Career-Point-Blog-Post-6.jpg',
  'boarding-school-in-india-vs-studying-abroad-pros-and-cons': '/wp-content/uploads/2024/02/New-Career-Point-Blog-Post-8.jpg',
  'debunking-10-myths-about-boarding-schools-in-india': '/wp-content/uploads/2024/02/Debunking-10-Myths-about-boarding-school.jpg',
};
const decodeEntities = s => (s || '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;/g, '’').replace(/&#8211;/g, '–').replace(/&hellip;|&#8230;/g, '…').replace(/\s+/g, ' ').trim();
const wordCount = blocks => blocks.reduce((n, b) => n + [b.v, b.q, b.a, b.title, b.desc].filter(x => typeof x === 'string').join(' ').split(/\s+/).filter(Boolean).length + (Array.isArray(b.v) ? JSON.stringify(b.v).split(/\s+/).length : 0), 0);
export const posts = Object.entries(pages).filter(([, p]) => p.kind === 'post').map(([slug, p]) => ({
  slug, title: p.title, date: p.date, image: blogImages[slug],
  excerpt: decodeEntities(seo[slug]?.excerpt), categories: (seo[slug]?.categories || []).map(id => cats[id]).filter(Boolean),
  readMins: Math.max(1, Math.round(wordCount(p.blocks) / 200)),
  topics: p.blocks.filter(b => b.t === 'h2' && b.v !== p.title).map(b => b.v.replace(/^[✅⚠️\s]+/u, '').replace(/:$/, '')).slice(0, 4),
})).sort((a, b) => b.date.localeCompare(a.date));

export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

export function BlogGrid({ items = posts }) {
  return (
    <div className="blog-grid">
      {items.map((p, i) => (
        <Reveal key={p.slug} delay={i * .08}>
          <Link to={`/${p.slug}/`} className="blog-card">
            <div className="im"><img src={p.image} alt={p.title} loading="lazy" /></div>
            <div className="bd">
              <div className="cats">{p.categories.map(c => <span className="chip" key={c.id}>{c.name}</span>)}</div>
              <h3>{p.title}</h3>
              <p>{(p.excerpt || '').replace(/\s*(Read More|…)?\s*$/, '…')}</p>
              <span className="link-arrow">Read More <ArrowRight /></span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function BlogSection() {
  return (
    <section className="section bg-paper2">
      <div className="wrap">
        <div className="head-row">
          <SectionHead eyebrow="Blogs & Article" title={<>Notes for <em className="accent">thoughtful</em> parents</>} />
          <Link to="/blog/" className="btn ghost">View all articles <ArrowRight /></Link>
        </div>
        <BlogGrid />
      </div>
    </section>
  );
}
