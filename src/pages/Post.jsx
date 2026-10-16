import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, ChevronRight, ChevronLeft, Link2, Check, ListOrdered, ShieldCheck, ThumbsUp, AlertTriangle,
  Lightbulb, Sparkles, ArrowRight, ArrowUp, BookOpen, Quote,
} from 'lucide-react';
import pages from '../data/pages.json';
import { site, UP } from '../data/site';
import { Seo, Reveal, Faq, useLightbox, posts, fmtDate, blogImages } from '../components/ui';
import { WhatsApp, Facebook, XIcon, LinkedIn } from '../components/Icons';

const slugify = s => s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60);
const splitLabel = v => { const m = v.match(/^([^:]{3,80}):\s+(.+)$/s); return m ? [m[1], m[2]] : [null, v]; };

/* ---------- turn flat blocks into rich article nodes ---------- */
function buildArticle(blocks) {
  const nodes = []; const toc = [];
  let i = 0, faqMode = false;
  const pushH2 = text => {
    const id = slugify(text);
    const myth = text.match(/^Myth\s*#(\d+):\s*(.+)$/i);
    toc.push({ id, text: myth ? `Myth #${myth[1]}` : text, sub: myth ? myth[2] : null });
    nodes.push({ k: 'h2', id, text, myth, n: toc.length });
    faqMode = /^(faqs?|frequently asked questions)/i.test(text);
  };
  while (i < blocks.length) {
    const b = blocks[i];
    // first paragraph = lead
    if (i === 0 && b.t === 'p') { nodes.push({ k: 'lead', text: b.v }); i++; continue; }
    if (b.t === 'h2') { pushH2(b.v); i++; continue; }
    // "Conclusion: ..." written as a paragraph is really a heading
    if (b.t === 'p' && /^Conclusion:/.test(b.v) && b.v.length < 90) { pushH2(b.v.replace(/^Conclusion:\s*/, 'Conclusion: ')); i++; continue; }
    // ✅ / ⚠️ pros & cons → callout cards (consecutive ones form a grid)
    if (b.t === 'h3' && /^[✅⚠]/u.test(b.v)) {
      const group = [];
      while (blocks[i]?.t === 'h3' && /^[✅⚠]/u.test(blocks[i].v)) {
        const title = blocks[i].v.replace(/^[✅⚠️\uFE0F\s]+/u, '').replace(/:$/, '');
        const tone = /^✅/u.test(blocks[i].v) ? 'pro' : 'con'; i++;
        const items = [];
        while (blocks[i]?.t === 'li') items.push(blocks[i++].v);
        group.push({ title, tone, items });
      }
      nodes.push({ k: 'proscons', group }); continue;
    }
    // FAQ section → accordion
    if (faqMode && (b.t === 'p' || b.t === 'li')) {
      const qa = [];
      while (i < blocks.length && blocks[i].t !== 'h2') {
        const c = blocks[i];
        const qm = c.t === 'p' && c.v.match(/^Q\d*[:.]\s*(.+)$/);
        if (qm && blocks[i + 1]?.t === 'p') {
          let a = blocks[i + 1].v.replace(/^A:\s*/, ''); i += 2;
          const extra = []; while (blocks[i]?.t === 'li') extra.push(blocks[i++].v);
          qa.push({ q: qm[1], a: extra.length ? <>{a}<ul className="pa-list">{extra.map(x => <li key={x}>{x}</li>)}</ul></> : a });
          continue;
        }
        if (c.t === 'li' && /\?/.test(c.v)) { const at = c.v.indexOf('?') + 1; qa.push({ q: c.v.slice(0, at), a: c.v.slice(at).trim() }); i++; continue; }
        break;
      }
      if (qa.length) { nodes.push({ k: 'faq', qa }); continue; }
    }
    if (b.t === 'li') {
      const items = [];
      while (blocks[i]?.t === 'li') items.push(blocks[i++].v);
      const labelled = items.filter(x => splitLabel(x)[0]).length >= Math.ceil(items.length / 2);
      nodes.push({ k: labelled ? 'compare' : 'list', items }); continue;
    }
    if (b.t === 'img') { nodes.push({ k: 'img', src: b.v }); i++; continue; }
    if (b.t === 'h3') { nodes.push({ k: 'h3', text: b.v }); i++; continue; }
    if (b.t === 'p') {
      const v = b.v.replace(/^ruth:/, 'Truth:');
      if (/^Truth:/.test(v)) { nodes.push({ k: 'truth', text: v.replace(/^Truth:\s*/, '') }); i++; continue; }
      if (/^(Bottom line|Call to Action|In summary|In short|In essence|In conclusion|In sum)\b/i.test(v)) { const [l, t] = splitLabel(v); nodes.push({ k: 'takeaway', label: l || 'Key takeaway', text: l ? t : v }); i++; continue; }
      if (/^Sources:/.test(v)) { nodes.push({ k: 'sources', text: v }); i++; continue; }
      // consecutive "Label: text" paragraphs → comparison rows
      if (splitLabel(v)[0] && splitLabel(v)[0].split(' ').length <= 6) {
        const items = [];
        while (blocks[i]?.t === 'p' && splitLabel(blocks[i].v)[0] && splitLabel(blocks[i].v)[0].split(' ').length <= 6 && !/^(Truth|Bottom line|Call to Action|Sources|Conclusion)/.test(blocks[i].v)) items.push(blocks[i++].v);
        nodes.push({ k: items.length > 1 ? 'compare' : 'labelp', items }); continue;
      }
      nodes.push({ k: 'p', text: v }); i++; continue;
    }
    i++;
  }
  return { nodes, toc };
}

/* ---------- node renderers ---------- */
const TONES = ['blue', 'red', 'gold', 'green'];
function Compare({ items }) {
  return (
    <div className="pa-compare">
      {items.map((x, k) => {
        const [l, t] = splitLabel(x);
        return (
          <div key={k} className={`pa-cmp tone-${TONES[k % TONES.length]}`}>
            {l && <b>{l}</b>}
            <p>{t}</p>
          </div>
        );
      })}
    </div>
  );
}

function Node({ n, openImg }) {
  switch (n.k) {
    case 'lead': return <p className="pa-lead">{n.text}</p>;
    case 'h2':
      return n.myth ? (
        <h2 id={n.id} className="pa-h2 myth"><span className="pa-myth-tag">Myth #{n.myth[1]}</span>{n.myth[2]}</h2>
      ) : (
        <h2 id={n.id} className="pa-h2"><span className="pa-num">{String(n.n).padStart(2, '0')}</span>{n.text}</h2>
      );
    case 'h3': return <h3 className="pa-h3">{n.text}</h3>;
    case 'p': return <p>{n.text}</p>;
    case 'labelp': { const [l, t] = splitLabel(n.items[0]); return <p><strong className="pa-inline-label">{l}:</strong> {t}</p>; }
    case 'list': return <ul className="pa-list">{n.items.map((x, k) => <li key={k}>{x}</li>)}</ul>;
    case 'compare': return <Compare items={n.items} />;
    case 'img': return <figure className="pa-fig"><button onClick={() => openImg(n.src)} aria-label="Enlarge image"><img src={n.src} alt="" loading="lazy" /></button></figure>;
    case 'truth': return <div className="pa-truth"><span><ShieldCheck size={16} /> Truth</span><p>{n.text}</p></div>;
    case 'takeaway': return <aside className="pa-takeaway"><Lightbulb /><div><small>{n.label}</small><p>{n.text}</p></div></aside>;
    case 'sources': return <p className="pa-sources">{n.text}</p>;
    case 'faq': return <div className="pa-faq"><Faq items={n.qa} /></div>;
    case 'proscons':
      return (
        <div className="pa-pc">
          {n.group.map(g => (
            <div key={g.title} className={`pa-pc-card ${g.tone}`}>
              <h4>{g.tone === 'pro' ? <ThumbsUp /> : <AlertTriangle />}{g.title}</h4>
              <ul>{g.items.map((x, k) => { const [l, t] = splitLabel(x); return <li key={k}>{l ? <><b>{l}.</b> {t}</> : x}</li>; })}</ul>
            </div>
          ))}
        </div>
      );
    default: return null;
  }
}

/* ---------- share ---------- */
function Share({ title, vertical }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const u = encodeURIComponent(url), t = encodeURIComponent(title);
  const links = [
    { n: 'WhatsApp', I: WhatsApp, href: `https://wa.me/?text=${t}%20${u}`, c: '#25d366' },
    { n: 'Facebook', I: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, c: '#1877f2' },
    { n: 'X', I: XIcon, href: `https://x.com/intent/tweet?text=${t}&url=${u}`, c: '#000' },
    { n: 'LinkedIn', I: LinkedIn, href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`, c: '#0a66c2' },
  ];
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* ignore */ } };
  return (
    <div className={`pa-share ${vertical ? 'v' : ''}`}>
      {links.map(({ n, I, href, c }) => <a key={n} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${n}`} style={{ '--c': c }}><I /></a>)}
      <button onClick={copy} aria-label="Copy link">{copied ? <Check /> : <Link2 />}</button>
    </div>
  );
}

/* ---------- page ---------- */
export default function Post({ slug }) {
  const page = pages[slug];
  const meta = posts.find(p => p.slug === slug);
  const { nodes, toc } = useMemo(() => buildArticle(page.blocks), [page]);
  const imgs = useMemo(() => nodes.filter(n => n.k === 'img').map(n => n.src), [nodes]);
  const [openIdx, lb] = useLightbox(imgs);
  const openImg = src => openIdx(imgs.indexOf(src));
  const [active, setActive] = useState(toc[0]?.id);
  const [tocOpen, setTocOpen] = useState(false);
  const idx = posts.findIndex(p => p.slug === slug);
  const prev = posts[idx + 1], next = posts[idx - 1];
  const related = posts.filter(p => p.slug !== slug);

  useEffect(() => {
    const els = toc.map(t => document.getElementById(t.id)).filter(Boolean);
    const io = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: '-15% 0px -70% 0px' });
    els.forEach(e => io.observe(e));
    return () => io.disconnect();
  }, [toc]);

  const go = id => { setTocOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const activeIdx = Math.max(0, toc.findIndex(t => t.id === active));

  return (
    <>
      <Seo slug={slug} title={page.title} />

      {/* Hero */}
      <section className="pa-hero">
        <div className="pa-hero-glow" />
        <div className="wrap pa-hero-grid">
          <div>
            <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><ChevronRight /><Link to="/blog/">Blog</Link><ChevronRight /><span>Article</span></nav>
            <div className="bl-cats">{meta?.categories.map(c => <Link key={c.id} to={`/category/${c.slug}/`}><span>{c.name}</span></Link>)}</div>
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>{page.title}</motion.h1>
            <div className="pa-byline">
              <img src={site.icon} alt="" />
              <div><b>Career Point Gurukul</b><span><Calendar size={13} />{fmtDate(page.date)}<i /> <Clock size={13} />{meta?.readMins} min read</span></div>
            </div>
            <Share title={page.title} />
          </div>
          <motion.div className="pa-hero-art" initial={{ opacity: 0, rotate: 2, y: 20 }} animate={{ opacity: 1, rotate: -1.5, y: 0 }} transition={{ duration: .9, delay: .1 }}>
            <img src={blogImages[slug]} alt={page.title} />
            <span className="pa-badge"><BookOpen size={16} /> {toc.length} sections</span>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="pa-body">
        <div className="wrap pa-grid">
          {/* TOC */}
          <aside className="pa-toc">
            <button className="pa-toc-head" onClick={() => setTocOpen(o => !o)} aria-expanded={tocOpen}>
              <ListOrdered size={16} /> On this page <em>{activeIdx + 1}/{toc.length}</em>
            </button>
            <div className="pa-toc-bar"><span style={{ height: `${((activeIdx + 1) / toc.length) * 100}%` }} /></div>
            <ol className={tocOpen ? 'open' : ''}>
              {toc.map(t => (
                <li key={t.id} className={t.id === active ? 'on' : ''}>
                  <button onClick={() => go(t.id)}>{t.text}{t.sub && <small>{t.sub}</small>}</button>
                </li>
              ))}
            </ol>
          </aside>

          {/* Article */}
          <article className="pa-article">
            {nodes.map((n, k) => <Node key={k} n={n} openImg={openImg} />)}
            <div className="pa-end">
              <div className="bl-cats">{meta?.categories.map(c => <Link key={c.id} to={`/category/${c.slug}/`}><span>#{c.name}</span></Link>)}</div>
              <div className="pa-end-share"><small>Found this useful? Share it</small><Share title={page.title} /></div>
            </div>
            <div className="pa-author">
              <img src={site.icon} alt="" />
              <div>
                <small>Written by</small>
                <b>Career Point Gurukul, Mohali</b>
                <p>{site.tagline}. Fully residential CBSE school with integrated coaching for IIT-JEE, NEET &amp; NDA.</p>
              </div>
            </div>
            <nav className="pa-pn" aria-label="More articles">
              {prev ? <Link to={`/${prev.slug}/`} className="prev"><small><ChevronLeft size={14} /> Previous</small><b>{prev.title}</b></Link> : <span />}
              {next ? <Link to={`/${next.slug}/`} className="next"><small>Next <ChevronRight size={14} /></small><b>{next.title}</b></Link> : <span />}
            </nav>
          </article>

          {/* Sidebar */}
          <aside className="pa-side">
            <div className="pa-cta">
              <span className="pill"><i />Admissions open</span>
              <h3>Give your child the Gurukul advantage</h3>
              <p>CBSE schooling + IIT-JEE / NEET / NDA coaching + AC hostel — on one safe campus.</p>
              <a className="btn gold" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Register on WhatsApp</a>
              <Link className="pa-cta-link" to="/admission-guidelines/">Admission Guidelines <ArrowRight size={14} /></Link>
            </div>
            <div className="pa-side-card">
              <h4><Sparkles size={15} /> Keep reading</h4>
              {related.map(r => (
                <Link key={r.slug} to={`/${r.slug}/`} className="pa-rel">
                  <img src={r.image} alt="" loading="lazy" />
                  <span><b>{r.title}</b><small>{r.readMins} min read</small></span>
                </Link>
              ))}
            </div>
            <button className="pa-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp size={15} /> Back to top</button>
          </aside>
        </div>
        {lb}
      </section>

      {/* Closing quote band */}
      <section className="section tight">
        <div className="wrap">
          <Reveal className="pa-close">
            <Quote className="q" />
            <div>
              <h2>Still deciding what’s right for your child?</h2>
              <p>Talk to us — we’ll answer every question about schooling, coaching, hostel life and safety.</p>
            </div>
            <div className="btn-row">
              <a className="btn" href={site.wa.principal} target="_blank" rel="noreferrer"><WhatsApp /> Chat with principal directly!</a>
              <Link className="btn ghost" to="/blog/">All articles <ArrowRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
