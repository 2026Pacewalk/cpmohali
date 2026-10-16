import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, GraduationCap, Building2, Image, Tag, Newspaper, Search, FileCode2, ArrowUpRight, X } from 'lucide-react';
import { Seo, PageHero, Reveal, posts } from '../components/ui';
import { sitemapGroups } from '../data/sitemap';
import { UP } from '../data/site';

const ICONS = { home: Home, users: Users, graduation: GraduationCap, building: Building2, image: Image, tag: Tag, news: Newspaper };

export default function Sitemap() {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const all = [...sitemapGroups, { title: 'Blog articles', icon: 'news', links: posts.map(p => ({ label: p.title, to: `/${p.slug}/` })) }];
    const s = q.trim().toLowerCase();
    return all.map(g => ({ ...g, links: s ? g.links.filter(l => l.label.toLowerCase().includes(s)) : g.links })).filter(g => g.links.length);
  }, [q]);
  const total = sitemapGroups.reduce((n, g) => n + g.links.length, 0) + posts.length;

  return (
    <>
      <Seo title="Sitemap" description="All pages of the Career Point Gurukul Mohali website in one place." />
      <PageHero title="Sitemap" lede={`Every page of the Career Point Gurukul website — ${total} pages in one place.`} image={`${UP}/2025/08/library-New-Career-Piont-lll-scaled.jpg`}>
        <div className="sm-tools">
          <label className="sm-search">
            <Search size={18} />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Find a page…" aria-label="Search pages" />
            {q && <button onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>}
          </label>
          <a className="btn gold" href="/sitemap.xml" target="_blank" rel="noopener noreferrer"><FileCode2 /> View XML Sitemap</a>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          {groups.length === 0 && <p className="lede center" style={{ margin: '0 auto' }}>No pages match “{q}”.</p>}
          <div className="sm-grid">
            {groups.map((g, i) => {
              const I = ICONS[g.icon] || Home;
              return (
                <Reveal className="sm-card" key={g.title} delay={(i % 3) * .06}>
                  <div className="sm-head"><span className="sm-ico"><I /></span><h2>{g.title}</h2><em>{g.links.length}</em></div>
                  <ul>
                    {g.links.map(l => (
                      <li key={l.to}><Link to={l.to}><span>{l.label}</span><small>{l.to}</small><ArrowUpRight className="go" /></Link></li>
                    ))}
                  </ul>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
