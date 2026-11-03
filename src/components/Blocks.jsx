import { Fragment } from 'react';
import { Check, ArrowRight, Download } from 'lucide-react';
import { Reveal, Video, Faq, useLightbox, Testimonials, ContactSection, BlogSection, SmartLink } from './ui';
import { WhatsApp } from './Icons';

const isH = b => /^h[1-6]$/.test(b?.t);
const isSmallImg = src => /-150x150|\.svg$/i.test(src || '');
const RUNS = ['card', 'qa', 'testimonial', 'li', 'video', 'btn'];

/* 1. blocks -> units (detect visual patterns) */
export function toUnits(blocks) {
  const units = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    // bullet paragraphs become list items
    if (b.t === 'p' && /^[•·]\s*/.test(b.v)) { blocks[i] = { t: 'li', v: b.v.replace(/^[•·]\s*/, '') }; continue; }
    if (b.t === 'img') {
      // features: (img, heading, p*/li*) repeated >= 3
      let items = []; let j = i;
      while (blocks[j]?.t === 'img' && isH(blocks[j + 1]) && blocks[j + 1].t !== 'h1') {
        const it = { img: blocks[j].v, title: blocks[j + 1].v, desc: [], list: [] }; j += 2;
        while (blocks[j]?.t === 'p' || blocks[j]?.t === 'li') { (blocks[j].t === 'p' ? it.desc : it.list).push(blocks[j].v); j++; }
        items.push(it);
      }
      if (items.length >= 3) { units.push({ u: 'features', items }); i = j; continue; }
      // programmes: (img, label-button '#', heading) repeated
      items = []; j = i;
      while (blocks[j]?.t === 'img' && blocks[j + 1]?.t === 'btn' && (!blocks[j + 1].href || blocks[j + 1].href === '#') && isH(blocks[j + 2])) {
        items.push({ img: blocks[j].v, kicker: blocks[j + 1].v.replace(/:$/, ''), title: blocks[j + 2].v, desc: [], list: [] }); j += 3;
      }
      if (items.length >= 2) { units.push({ u: 'features', items, tall: true }); i = j; continue; }
      // captioned photos: (img, p) repeated >= 3
      items = []; j = i;
      while (blocks[j]?.t === 'img' && blocks[j + 1]?.t === 'p') {
        const m = blocks[j + 1].v.match(/^(.{6,70}?):\s*(.+)$/);
        items.push({ img: blocks[j].v, title: m ? m[1] : '', desc: [m ? m[2] : blocks[j + 1].v], list: [] }); j += 2;
      }
      if (items.length >= 3) { units.push({ u: 'features', items }); i = j; continue; }
    }
    // runs of same type
    if (RUNS.includes(b.t)) {
      const run = []; let j = i;
      while (blocks[j]?.t === b.t) run.push(blocks[j++]);
      units.push({ u: b.t + 's', items: run }); i = j; continue;
    }
    if (b.t === 'img') {
      const run = []; let j = i;
      while (blocks[j]?.t === 'img') run.push(blocks[j++].v);
      units.push(run.length > 1 ? { u: 'imgs', items: run } : { u: 'img', v: run[0], alt: b.alt, below: b.below }); i = j; continue;
    }
    if (b.t === 'gallery') {
      const run = []; let j = i;
      while (blocks[j]?.t === 'gallery') run.push(...blocks[j++].v);
      units.push({ u: 'rail', items: [...new Set(run)] }); i = j; continue;
    }
    units.push({ u: b.t, ...b }); i++;
  }
  return units;
}

/* 2. units -> sections split at h1/h2 */
export function toSections(units) {
  const out = []; let cur = { heading: null, units: [] };
  for (const u of units) {
    if (u.u === 'contact' || u.u === 'blogfeed' || u.u === 'pgallery') {
      if (cur.heading || cur.units.length) out.push(cur);
      out.push({ special: u.u, unit: u }); cur = { heading: null, units: [] }; continue;
    }
    if (u.u === 'h1' || u.u === 'h2') {
      if (cur.heading || cur.units.length) out.push(cur);
      cur = { heading: u.v, units: [] }; continue;
    }
    cur.units.push(u);
  }
  if (cur.heading || cur.units.length) out.push(cur);
  // merge heading-only sections into the next one as an eyebrow ("Integrated Coaching" + long sub-heading)
  const merged = [];
  for (let k = 0; k < out.length; k++) {
    const s = out[k], n = out[k + 1];
    if (s.heading && !s.units.length && n && n.heading && !n.special && n.units.length) {
      n.eyebrow = s.heading; continue;
    }
    merged.push(s);
  }
  return merged;
}

/* ---------- text rendering ---------- */
function Para({ v }) {
  if (/^\d{1,2}\.\s+[A-Z][^.]{2,60}$/.test(v)) return <h3>{v}</h3>;
  const m = v.match(/^([A-Z][^:.]{2,70}):\s+(.{8,})$/);
  if (m) return <p><span className="p-label">{m[1]}</span>{m[2]}</p>;
  if (/:$/.test(v) && v.length < 70) return <span className="p-label">{v.replace(/:$/, '')}</span>;
  if (/^[“"].+[”"]$/.test(v)) return <p className="lead-q">{v}</p>;
  if (/^–\s/.test(v)) return <p style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: '1.15rem', color: 'var(--ink)' }}>{v}</p>;
  return <p>{v}</p>;
}

function Checklist({ items, cols }) {
  return (
    <ul className={`checklist ${cols ? 'cols' : ''}`}>
      {items.map((li, i) => <li key={i}><span className="tick"><Check /></span><span>{li.href && !li.href.startsWith('mailto:%20') ? <SmartLink href={li.href}>{li.v}</SmartLink> : li.v}</span></li>)}
    </ul>
  );
}

function Buttons({ items }) {
  const real = items.filter(b => b.href && b.href !== '#');
  const labels = items.filter(b => !b.href || b.href === '#');
  return (
    <>
      {labels.map((b, i) => <span key={i} className="eyebrow" style={{ display: 'flex' }}>{b.v.replace(/:$/, '')}</span>)}
      {real.length > 0 && (
        <div className="btn-row" style={{ margin: '8px 0 12px' }}>
          {real.map((b, i) => {
            const wa = /wa\.link|wa\.me/.test(b.href);
            const pdf = /\.pdf$/i.test(b.href);
            return <SmartLink key={i} href={b.href} className={`btn ${i ? 'blue' : ''}`}>{wa ? <WhatsApp /> : pdf ? <Download /> : null}{b.v}{!wa && !pdf && <ArrowRight />}</SmartLink>;
          })}
        </div>
      )}
    </>
  );
}

function Cards({ items }) {
  if (items.every(c => c.flip)) {
    return (
      <div className="cards">
        {items.map((c, i) => (
          <div className="flip" key={i} tabIndex={0}>
            <div className="flip-in">
              <div className="flip-f"><span className="c-no" style={{ color: 'var(--gold)' }}>0{i + 1}</span><h3>{c.title}</h3><span className="hint">Hover to reveal</span></div>
              <div className="flip-b">{c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className={`cards ${items.length < 4 ? 'few' : ''}`}>
      {items.map((c, i) => (
        <Reveal className="card" key={i} delay={(i % 4) * .06}>
          {c.img ? <img className="c-img" src={c.img} alt="" loading="lazy" /> : <span className="c-no">{String(i + 1).padStart(2, '0')}</span>}
          <h3>{c.title.replace(/:$/, '')}</h3>
          {c.desc && <p>{c.desc}</p>}
        </Reveal>
      ))}
    </div>
  );
}

function Features({ items, tall }) {
  if (items.every(f => isSmallImg(f.img))) {
    return <Cards items={items.map(f => ({ img: f.img, title: f.title, desc: f.desc.join(' ') }))} />;
  }
  return (
    <div className={`features ${tall ? 'tall' : ''}`}>
      {items.map((f, i) => (
        <Reveal className="feature" key={i} delay={(i % 3) * .07}>
          <div className="im"><img src={f.img} alt={f.title || f.kicker || ''} loading="lazy" /><span className="n">{f.kicker || String(i + 1).padStart(2, '0')}</span></div>
          <div className="bd">
            {f.title && <h3>{f.title.replace(/:$/, '')}</h3>}
            {f.desc.map((d, k) => <p key={k}>{d}</p>)}
            {f.list.length > 0 && <Checklist items={f.list.map(v => ({ v }))} />}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Images({ items }) {
  const [open, lb] = useLightbox(items);
  const natural = items.length <= 3;
  return (
    <>
      <div className={natural ? '' : 'mosaic'} style={natural ? { display: 'grid', gap: 16, gridTemplateColumns: `repeat(auto-fit, minmax(${items.length > 1 ? 260 : 300}px, 1fr))`, alignItems: 'start' } : null}>
        {items.map((src, i) => natural
          ? <button key={i} onClick={() => open(i)} style={{ padding: 0, border: 0, background: 'none', cursor: 'zoom-in' }}><img className="single-img" src={src} alt="" loading="lazy" /></button>
          : <button key={i} onClick={() => open(i)}><img src={src} alt="" loading="lazy" /></button>)}
      </div>
      {lb}
    </>
  );
}

export function Rail({ items, logos }) {
  const [open, lb] = useLightbox(items);
  const loop = [...items, ...items];
  return (
    <>
      <div className="rail">
        <div className="rail-track">
          {loop.map((src, i) => logos
            ? <div className="logo-tile" key={i}><img src={src} alt="" loading="lazy" /></div>
            : <button className="result-tile" key={i} onClick={() => open(i % items.length)} style={{ padding: 0, border: 0 }}><img src={src} alt="Career Point Gurukul result" loading="lazy" /></button>)}
        </div>
      </div>
      {lb}
    </>
  );
}

function Table({ rows }) {
  const cell = c => (typeof c === 'object' && c ? <a className="link-arrow" href={c.href} target="_blank" rel="noreferrer"><Download />{c.text}</a> : c);
  return (
    <div className="table-wrap">
      <table className="tbl"><tbody>
        {rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k} colSpan={r.length === 1 ? 2 : 1}>{cell(c)}</td>)}</tr>)}
      </tbody></table>
    </div>
  );
}

export function Unit({ u }) {
  switch (u.u) {
    case 'p': return <Para v={u.v} />;
    case 'sub': return <p className="lede">{u.v}</p>;
    case 'h3': case 'h4': case 'h5': case 'h6': return <h3 style={{ marginTop: '1.2em' }}>{u.v}</h3>;
    case 'lis': return <Checklist items={u.items} cols={u.items.length > 5 && u.items.every(l => l.v.length < 70)} />;
    case 'cards': return <Cards items={u.items} />;
    case 'features': return <Features items={u.items} tall={u.tall} />;
    case 'qas': return <Faq items={u.items} />;
    case 'testimonials': return <Testimonials items={u.items} />;
    case 'videos': return <div className={`video-grid ${u.items.length >= 3 ? 'three' : ''}`} style={u.items.length === 1 ? { gridTemplateColumns: '1fr', maxWidth: 900, margin: '0 auto' } : null}>{u.items.map((v, i) => <Video key={i} src={v.v} />)}</div>;
    case 'img': return <Images items={[u.v]} />;
    case 'imgs': return <Images items={u.items} />;
    case 'rail': return <Rail items={u.items} logos={u.items.every(s => /\.webp$/.test(s))} />;
    case 'btns': return <Buttons items={u.items} />;
    case 'table': return <Table rows={u.v} />;
    case 'map': return <div className="map"><iframe title="Map" src={u.v} loading="lazy" /></div>;
    case 'hr': return <hr />;
    case 'counter': return <div className="stat"><b>{u.v}</b><span>{u.title}</span></div>;
    default: return null;
  }
}

const TEXTY = ['p', 'lis', 'h3', 'h4', 'h5', 'h6', 'sub', 'btns', 'hr'];

/* 3. render a page body */
export default function Blocks({ blocks, skipFirstHeading, prose }) {
  const sections = toSections(toUnits(blocks.map(b => ({ ...b }))));
  if (skipFirstHeading && sections[0]?.heading) {
    sections[0] = { ...sections[0], heading: null };
  }
  // Articles (blog posts, policies): one continuous column — headings set the rhythm, not section padding
  if (prose) {
    return (
      <section className="section article-wrap">
        <article className="wrap prose article">
          {sections.filter(s => !s.special && (s.heading || s.units.length)).map((s, idx) => (
            <Fragment key={idx}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.units.map((u, k) => <Unit key={k} u={u} />)}
            </Fragment>
          ))}
        </article>
      </section>
    );
  }

  let alt = 0, splitSide = 0;
  return sections.map((s, idx) => {
    if (s.special === 'contact') return <ContactSection key={idx} />;
    if (s.special === 'blogfeed') return <BlogSection key={idx} />;
    if (s.special) return null;
    if (!s.heading && !s.units.length) return null;

    const hasFlip = s.units.some(u => u.u === 'cards' && u.items.every(c => c.flip));
    const bg = hasFlip ? 'bg-ink' : (alt++ % 2 ? 'bg-white' : '');
    const imgUnits = s.units.filter(u => u.u === 'img');
    const textUnits = s.units.filter(u => TEXTY.includes(u.u));
    const textLen = textUnits.reduce((n, u) => n + (u.v?.length || 0) + (u.items?.length || 0) * 40, 0);
    const canSplit = imgUnits.length === 1 && textUnits.length > 0 && textLen > 120;
    const longHead = s.heading && s.heading.length > 90;

    const Head = s.heading && (
      <Reveal className="head" style={canSplit ? { marginBottom: 20 } : null}>
        {s.eyebrow && <span className="eyebrow">{s.eyebrow}</span>}
        <h2 style={longHead ? { fontSize: 'clamp(1.35rem, 2.2vw, 1.9rem)', lineHeight: 1.3 } : null}>{s.heading}</h2>
      </Reveal>
    );

    if (canSplit) {
      const img = imgUnits[0];
      const rest = s.units.filter(u => u !== img && !TEXTY.includes(u.u));
      const side = splitSide++ % 2;
      // An img block marked `below: true` stays under the text when the split stacks on phones
      const mediaLast = !!img.below;
      return (
        <section className={`section ${bg}`} key={idx}>
          <div className="wrap">
            <div className={`split ${side ? 'rev' : ''} ${mediaLast ? 'media-last' : ''}`}>
              <Reveal className="split-media" y={40}><img src={img.v} alt={img.alt || s.heading || ''} loading="lazy" /></Reveal>
              <div className="text-col">{Head}<Reveal>{textUnits.map((u, k) => <Unit key={k} u={u} />)}</Reveal></div>
            </div>
            {rest.length > 0 && <div style={{ marginTop: 48, display: 'grid', gap: 28 }}>{rest.map((u, k) => <Unit key={k} u={u} />)}</div>}
          </div>
        </section>
      );
    }

    return (
      <section className={`section ${bg}`} key={idx}>
        <div className="wrap">
          {Head}
          <div style={{ display: 'grid', gap: 22 }}>
            {groupText(s.units).map((g, k) => g.text
              ? <Reveal key={k} className="text-col" style={{ maxWidth: 900 }}>{g.items.map((u, j) => <Unit key={j} u={u} />)}</Reveal>
              : <Fragment key={k}><Unit u={g} /></Fragment>)}
          </div>
        </div>
      </section>
    );
  });
}

function groupText(units) {
  const out = [];
  for (const u of units) {
    if (TEXTY.includes(u.u)) {
      const last = out[out.length - 1];
      if (last?.text) last.items.push(u); else out.push({ text: true, items: [u] });
    } else out.push(u);
  }
  return out;
}
