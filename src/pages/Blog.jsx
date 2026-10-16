import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock, Calendar, BookOpen, Sparkles, MessageCircle } from 'lucide-react';
import { Seo, Reveal, Ring, posts, fmtDate } from '../components/ui';
import { site } from '../data/site';

const allCats = (() => {
  const m = new Map();
  posts.forEach(p => p.categories.forEach(c => m.set(c.slug, { ...c, count: (m.get(c.slug)?.count || 0) + 1 })));
  return [...m.values()];
})();
const totalMins = posts.reduce((n, p) => n + p.readMins, 0);
const short = d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

function Meta({ p, light }) {
  return (
    <div className={`bl-meta ${light ? 'light' : ''}`}>
      <span><Calendar size={14} />{fmtDate(p.date)}</span>
      <span><Clock size={14} />{p.readMins} min read</span>
    </div>
  );
}

function Featured({ p }) {
  return (
    <Reveal className="bl-feat">
      <Link to={`/${p.slug}/`} className="bl-feat-img" aria-label={p.title}>
        <img src={p.image} alt={p.title} />
        <span className="bl-latest"><Sparkles size={14} /> Latest article</span>
      </Link>
      <div className="bl-feat-body">
        <div className="bl-cats">{p.categories.map(c => <span key={c.id}>{c.name}</span>)}</div>
        <Link to={`/${p.slug}/`}><h2>{p.title}</h2></Link>
        <Meta p={p} light />
        <p>{p.excerpt.replace(/[\s.…]+$/, '')}…</p>
        {p.topics.length > 0 && (
          <div className="bl-inside">
            <small><BookOpen size={14} /> Inside this article</small>
            <ol>{p.topics.slice(0, 3).map(t => <li key={t}>{t}</li>)}</ol>
          </div>
        )}
        <Link to={`/${p.slug}/`} className="btn gold">Read the article <ArrowRight /></Link>
      </div>
    </Reveal>
  );
}

function Card({ p, i }) {
  return (
    <motion.article layout initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .45, delay: i * .06 }} className="bl-card">
      <Link to={`/${p.slug}/`} className="bl-card-img">
        <img src={p.image} alt={p.title} loading="lazy" />
        <span className="bl-date"><b>{short(p.date).split(' ')[0]}</b>{short(p.date).split(' ')[1]}</span>
        <span className="bl-go"><ArrowUpRight /></span>
      </Link>
      <div className="bl-card-body">
        <span className="bl-idx">{String(i + 1).padStart(2, '0')}</span>
        <div className="bl-cats">{p.categories.map(c => <span key={c.id}>{c.name}</span>)}</div>
        <Link to={`/${p.slug}/`}><h3>{p.title}</h3></Link>
        <p>{p.excerpt.replace(/[\s.…]+$/, '')}…</p>
        {p.topics.length > 0 && <ul className="bl-topics">{p.topics.slice(0, 2).map(t => <li key={t}>{t}</li>)}</ul>}
        <div className="bl-card-foot">
          <span><Clock size={14} />{p.readMins} min read</span>
          <Link to={`/${p.slug}/`} className="link-arrow">Read More <ArrowRight /></Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function Blog() {
  const [cat, setCat] = useState('all');
  const list = useMemo(() => (cat === 'all' ? posts.slice(1) : posts.filter(p => p.categories.some(c => c.slug === cat))), [cat]);
  return (
    <>
      <Seo slug="blog" title="Blog" />

      {/* Masthead */}
      <section className="bl-mast">
        <Ring className="ph-ring" color="rgba(11,27,63,.12)" />
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>Blog</span></nav>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            Blogs <span>&amp;</span> <em>Article</em>
          </motion.h1>
          <div className="bl-mast-row">
            <p className="lede">Read the Career Point Gurukul blog for updates, tips, and insights from the best boarding school in Mohali, Chandigarh &amp; India.</p>
            <div className="bl-stats">
              <div><b>{posts.length}</b><span>Articles</span></div>
              <div><b>{totalMins}</b><span>Min of reading</span></div>
              <div><b>{allCats.length}</b><span>Topics</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {posts[0] && <Featured p={posts[0]} />}

          <div className="bl-bar">
            <h2>{cat === 'all' ? <>More to <em>read</em></> : <>Topic: <em>{allCats.find(c => c.slug === cat)?.name}</em></>}</h2>
            <div className="bl-filters" role="tablist">
              <button role="tab" aria-selected={cat === 'all'} className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>All <i>{posts.length}</i></button>
              {allCats.map(c => <button role="tab" key={c.slug} aria-selected={cat === c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setCat(c.slug)}>{c.name} <i>{c.count}</i></button>)}
            </div>
          </div>

          <motion.div layout className="bl-grid">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => <Card key={p.slug} p={p} i={i} />)}
            </AnimatePresence>
          </motion.div>

          <Reveal className="bl-ask">
            <div>
              <span className="eyebrow">Still deciding?</span>
              <h3>Have a question our articles didn’t answer?</h3>
            </div>
            <a className="btn" href={site.wa.principal} target="_blank" rel="noreferrer"><MessageCircle /> Chat with principal directly!</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
