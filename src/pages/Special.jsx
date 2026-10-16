import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Download, FileText, Phone, Mail, ArrowRight, Calendar } from 'lucide-react';
import pages from '../data/pages.json';
import seo from '../data/seo.json';
import { site, tel, UP } from '../data/site';
import Blocks from '../components/Blocks';
import { PageHero, Seo, Reveal, SectionHead, Video, Faq, ContactSection, useLightbox, BlogGrid, posts, fmtDate, blogImages } from '../components/ui';
import { WhatsApp } from '../components/Icons';

const P = slug => pages[slug].blocks;
const ABOUT = [{ label: 'About Us', to: '/about-us/' }];
const MEDIA = [{ label: 'Media' }];
const CAMPUS = [{ label: 'Campus Life' }];

/* ---------------- Contact ---------------- */
export function Contact() {
  const B = P('contact');
  const faqs = B.filter(b => b.t === 'qa');
  const gallery = B.find(b => b.t === 'gallery')?.v || [];
  const [open, lb] = useLightbox(gallery);
  return (
    <>
      <Seo slug="contact" title="Contact" />
      <PageHero title="Contact" lede="We’d love to show you around. Call, WhatsApp or write to us — our admissions team responds quickly." image={`${UP}/2025/08/Smart-Classes-768x768.jpg`} />
      <section className="section tight">
        <div className="wrap">
          <div className="cards few">
            <Reveal className="card"><span className="c-ico" style={{ background: '#25d36622', color: '#1a9e4b', width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', marginBottom: 16 }}><WhatsApp width={24} /></span><h3>WhatsApp</h3><p><a href={site.wa.register} target="_blank" rel="noreferrer" className="link-arrow">Chat with Us on WhatsApp <ArrowRight /></a></p></Reveal>
            <Reveal className="card" delay={.06}><span style={{ background: 'var(--sky)', color: 'var(--blue)', width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', marginBottom: 16 }}><Phone width={22} /></span><h3>Phone Number</h3><p>{['+91 7087228881', '+91 7087228882'].map(p => <a key={p} href={tel(p)} style={{ display: 'block', fontWeight: 700, color: 'var(--ink)' }}>{p}</a>)}</p></Reveal>
            <Reveal className="card" delay={.12}><span style={{ background: '#e11d2a14', color: 'var(--red)', width: 54, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', marginBottom: 16 }}><Mail width={22} /></span><h3>Email Us</h3><p><a href={`mailto:${site.email}`} style={{ fontWeight: 700, color: 'var(--ink)' }}>{site.email}</a></p></Reveal>
          </div>
        </div>
      </section>
      <ContactSection />
      <section className="section bg-white">
        <div className="wrap faq-layout">
          <div className="sticky"><SectionHead eyebrow="FAQ" title="Frequently Asked Questions" /></div>
          <Reveal><Faq items={faqs} /></Reveal>
        </div>
      </section>
      {gallery.length > 0 && (
        <section className="section tight">
          <div className="wrap">
            <Reveal className="legacy">
              <div className="legacy-head">
                <span className="eyebrow">Career Point legacy</span>
                <h2>Numbers that build <em>trust</em></h2>
              </div>
              <div className="legacy-row">
                {gallery.map((g, i) => (
                  <button key={g} onClick={() => open(i)} style={{ '--d': `${i * 60}ms` }}>
                    <img src={g} alt="Career Point Gurukul achievement" loading="lazy" />
                  </button>
                ))}
              </div>
            </Reveal>
            {lb}
          </div>
        </section>
      )}
    </>
  );
}

/* ---------------- Photo gallery ---------------- */
export function PhotoGallery() {
  const g = P('photo-gallery').find(b => b.t === 'pgallery');
  const [cat, setCat] = useState('*');
  const items = useMemo(() => g.items.filter(it => cat === '*' || it.cats.includes(cat)), [g, cat]);
  const [open, lb] = useLightbox(items.map(i => i.src));
  const label = k => g.cats.find(c => c.key === k)?.label;
  return (
    <>
      <Seo slug="photo-gallery" title="Photo Gallery" />
      <PageHero title="Photo Gallery" crumbs={MEDIA} lede="Moments from classrooms, celebrations, competitions and everyday life at Gurukul." image={`${UP}/2025/09/Life-at-Gurukul-768x576-1.jpg`} />
      <section className="section">
        <div className="wrap">
          <div className="filters" role="tablist">
            {g.cats.map(c => <button key={c.key} role="tab" aria-selected={cat === c.key} className={cat === c.key ? 'on' : ''} onClick={() => setCat(c.key)}>{c.label}</button>)}
          </div>
          <motion.div layout className="masonry">
            <AnimatePresence>
              {items.map((it, i) => (
                <motion.button layout key={it.src} initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} onClick={() => open(i)}>
                  <img src={it.thumb || it.src} alt={label(it.cats[0]) || 'Gallery'} loading="lazy" />
                  {it.cats[0] && <span className="tag">{label(it.cats[0])}</span>}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
          {lb}
        </div>
      </section>
    </>
  );
}

/* ---------------- Video gallery ---------------- */
export function VideoGallery() {
  const vids = P('video-gallery').filter(b => b.t === 'video');
  return (
    <>
      <Seo slug="video-gallery" title="Video Gallery" />
      <PageHero title="Video Gallery" crumbs={MEDIA} lede="Campus tours, student stories and life at Career Point Gurukul." image={`${UP}/2025/09/Classroom-1-1.jpg`} />
      <section className="section">
        <div className="wrap">
          <div className="video-grid">{vids.map((v, i) => <Reveal key={v.v} delay={i * .06}><Video src={v.v} /></Reveal>)}</div>
          <Reveal className="center" style={{ marginTop: 40 }}><a className="btn" href="https://youtube.com/@careerpointgurukulchandigarh" target="_blank" rel="noreferrer">More on our YouTube channel <ArrowRight /></a></Reveal>
        </div>
      </section>
    </>
  );
}

/* ---------------- A day in CP-Gurukul ---------------- */
export function DayInGurukul() {
  const B = P('day-in-cpgurukul');
  const items = [];
  B.forEach((b, i) => { if (b.t === 'h2' && /\d:\d\d/.test(b.v) && B[i + 1]?.t === 'p') items.push({ time: b.v, what: B[i + 1].v }); });
  const note = B.find(b => /^Note:/.test(b.v || ''))?.v;
  return (
    <>
      <Seo slug="day-in-cpgurukul" title="Day in CP-Gurukul" />
      <PageHero title="A Day in CP-Gurukul" crumbs={CAMPUS} lede="From the 6:00 am wake-up to lights out at 10:30 pm — a disciplined, balanced rhythm built for results." image={`${UP}/2025/09/yoga.jpg`} />
      <section className="section">
        <div className="wrap">
          <div className="timeline">
            {items.map((it, i) => (
              <Reveal className="tl-item" key={i} y={20}>
                <span className="dot" />
                <div className="tl-card"><time><Clock />{it.time}</time><p>{it.what}</p></div>
              </Reveal>
            ))}
          </div>
          {note && <Reveal className="center" style={{ marginTop: 40 }}><p className="lede" style={{ fontStyle: 'italic' }}>{note}</p></Reveal>}
        </div>
      </section>
    </>
  );
}

/* ---------------- Certificates ---------------- */
export function Certificates() {
  const rows = P('certificates').find(b => b.t === 'table').v.slice(1);
  return (
    <>
      <Seo slug="certificates" title="Certificates" />
      <PageHero title="Official Certificates & Documents" lede="Career Point Gurukul - Official Certificates & Documents" image={`${UP}/2025/09/excellence.jpg`} />
      <section className="section">
        <div className="wrap">
          <div className="docs">
            {rows.map(([name, link], i) => (
              <Reveal key={name} delay={(i % 3) * .05}>
                <a className="doc" href={link.href} target="_blank" rel="noreferrer">
                  <span className="ic"><FileText /></span>
                  <span><b>{name}</b><small><Download />{link.text}</small></span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ---------------- Leader messages ---------------- */
export function Message({ slug }) {
  const page = pages[slug];
  const B = page.blocks;
  const title = B.find(b => b.t === 'h2')?.v || page.title;
  const img = B.find(b => b.t === 'img')?.v;
  const paras = B.filter(b => b.t === 'p').map(b => b.v);
  const signIdx = paras.findIndex(p => /^–/.test(p));
  const sign = signIdx > -1 ? paras[signIdx].replace(/^–\s*/, '') : '';
  const body = paras.filter((p, i) => i !== signIdx && p !== 'Best Wishes');
  const [name, role] = sign.split(/\s*\((.+)\)\s*$/);
  return (
    <>
      <Seo slug={slug} title={page.title} />
      <PageHero title={title} crumbs={ABOUT} image={`${UP}/2025/09/recreation-1-1536x496-1-1024x331.jpg`} />
      <section className="section">
        <div className="wrap letter">
          <Reveal className="letter-portrait">
            <div className="pf"><img src={img} alt={name} /></div>
            <div className="sig"><b>{name}</b><span>{role}</span></div>
          </Reveal>
          <Reveal className="letter-body">
            {body.map((p, i) => <p key={i}>{p}</p>)}
            <div className="signoff">Best Wishes,<br />— {name}</div>
          </Reveal>
        </div>
      </section>
      <section className="section tight bg-white">
        <div className="wrap btn-row" style={{ justifyContent: 'center' }}>
          {[['chairman', 'Chairman’s Message'], ['director-message', 'Managing Director’s Message'], ['principal-message', 'Principal’s Message']].filter(([s]) => s !== slug)
            .map(([s, l]) => <Link key={s} className="btn ghost" to={`/${s}/`}>{l} <ArrowRight /></Link>)}
        </div>
      </section>
    </>
  );
}

/* ---------------- Parents' reviews ---------------- */
const NAME_RE = /^(Parents? of|Mother of|Father of|Proud Parents)/i;
export function Reviews() {
  const B = P('parents-reviews').slice(1);
  const entries = []; const imgs = [];
  let cur = null;
  for (const b of B) {
    if (b.t === 'img') { imgs.push(b.v); continue; }
    if ((b.t === 'h2' || b.t === 'p') && NAME_RE.test(b.v)) { if (cur) cur.name = b.v; continue; }
    if (b.t === 'h2') { cur = { title: b.v, body: [], name: '' }; entries.push(cur); continue; }
    if (b.t === 'p' && cur) cur.body.push(b.v);
  }
  const stop = /^(parents?|mother|father|proud|of|and|naveen|sonia|class|iit|jee|neet|from|program|year|th)$/i;
  for (const e of entries) {
    const words = e.name.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !stop.test(w)).map(w => w.toLowerCase());
    e.img = imgs.find(src => words.some(w => src.toLowerCase().includes(w)));
  }
  return (
    <>
      <Seo slug="parents-reviews" title="Parent’s Reviews" />
      <PageHero title="Parent's Reviews" crumbs={ABOUT} lede="In their own words — families from Punjab, across India and abroad on life at CP Gurukul." image={`${UP}/2025/12/aneeshparents-scaled.jpg`} />
      <section className="section">
        <div className="wrap reviews">
          {entries.map((e, i) => (
            <Reveal className={`review ${i === 0 ? 'featured' : ''}`} key={i}>
              <div style={{ font: 'italic 700 4rem/0.5 var(--display)', color: 'var(--gold)', height: 30 }}>“</div>
              <h3>{e.title}</h3>
              {e.body.map((p, k) => <p key={k}>{p.replace(/\*/g, '')}</p>)}
              <div className="who">{e.img && <img src={e.img} alt={e.name} loading="lazy" />}<b>{e.name}</b></div>
            </Reveal>
          ))}
        </div>
      </section>
      <ContactSection withMap={false} />
    </>
  );
}

/* ---------------- Blog ---------------- */
export function Category() {
  const { cat } = useParams();
  const c = (seo._categories || []).find(x => x.slug === cat);
  if (!c) return <NotFound />;
  const items = posts.filter(p => p.categories.some(x => x.slug === cat));
  return (
    <>
      <Seo title={`${c.name} Archives`} />
      <PageHero title={c.name} crumbs={[{ label: 'Blog', to: '/blog/' }]} image={`${UP}/2024/02/New-Career-Point-Blog-Post-8.jpg`} />
      <section className="section"><div className="wrap"><BlogGrid items={items} /></div></section>
    </>
  );
}

/* ---------------- 404 ---------------- */
export function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <section className="section not-found">
        <div className="wrap">
          <div className="big">404</div>
          <h2>This page took a study break.</h2>
          <p className="lede" style={{ margin: '0 auto 24px' }}>The page you’re looking for doesn’t exist or has moved.</p>
          <div className="btn-row" style={{ justifyContent: 'center' }}><Link className="btn" to="/">Back to Home</Link><Link className="btn ghost" to="/contact/">Contact Us</Link></div>
        </div>
      </section>
    </>
  );
}
