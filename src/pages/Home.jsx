import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BedDouble, ChevronLeft, ChevronRight, GraduationCap, MessageCircle, Music, School, Sparkles, Phone, Play, Trophy, X } from 'lucide-react';
import pages from '../data/pages.json';
import { site, UP } from '../data/site';
import { Seo, Reveal, SectionHead, Stamp, Ring, Video, Faq, Testimonials, ContactSection, BlogSection, useLightbox } from '../components/ui';
import { Rail } from '../components/Blocks';
import { WhatsApp } from '../components/Icons';
import { openEnquiry } from '../components/EnquiryPopup';

const B = pages['home-2'].blocks;
const ofType = t => B.filter(b => b.t === t);
const galleries = ofType('gallery');
const uniq = a => [...new Set(a)];

const CAMPUS = `${UP}/2026/10/school-campus.webp`;
const heroSlides = [
  { d: `${UP}/2026/08/shared-image.jpg`, m: `${UP}/2026/08/new-banner-mobile.jpeg` },
  { d: `${UP}/2026/08/cp-banner-first-fina.jpeg`, m: `${UP}/2026/08/complete-gurukul-life-mobile.jpg` },
  { d: `${UP}/2025/10/Desktop-fully-residential-v2.jpg`, m: `${UP}/2025/10/square-mobile-fully-residential-v2.jpg` },
  { d: `${UP}/2026/08/WhatsApp-Image-2026-08-03-at-1.14.10-PM.jpeg`, m: `${UP}/2025/10/square-mobile-wellness-beyond-academics-yoga-scaled.jpg` },
  { d: `${UP}/2025/10/Desktop-complete-sports-scaled.jpg`, m: `${UP}/2025/10/square-mobile-complete-sports-infra-scaled.jpg` },
  { d: `${UP}/2025/10/Desktop-music-dance-scaled.jpg`, m: `${UP}/2025/10/square-mobile-music-dance-scaled.jpg` },
  { d: `${UP}/2026/08/shared-image-1.jpg`, m: `${UP}/2025/10/square-mobile-complete-sports-infra-1-scaled.jpg` },
];

const paths = [
  { img: `${UP}/2025/09/new-sli.png`, t: 'Excellent School Education', to: '/school-2/' },
  { img: `${UP}/elementor/thumbs/new-slie-rbsln59ipdwh6ywdrimako5df5xwdr9mq6o795sjts.png`, t: 'Integrated Coaching by Experts from Kota', to: '/integrated-coaching/' },
  { img: `${UP}/2026/10/boys-hostel-building.webp`, t: 'AC Hostels for Boys/ Girls', to: '/hostel-facilities/' },
  { img: `${UP}/2026/10/sports-card.webp`, t: 'Indoor and Outdoor Sports', to: '/indoor-outdoor-sports/' },
  { img: `${UP}/2025/09/yoga.jpg`, t: 'Yoga/ PT', to: '/yoga-physical-training/' },
  { img: `${UP}/2025/09/LIFE-SKILL-DEVELOPMENT.jpg`, t: 'Life Skills and Recreation', to: '/life-skill-development/' },
];

const streams = ofType('card').slice(0, 6);
const unique = ofType('card').slice(6, 15);

const programs = [
  { img: `${UP}/2025/09/WhatsApp-Image-2025-09-08-at-7.29.16-PM-819x1024.jpeg`, k: 'Integrated NEET Coaching', t: 'Integrated NEET coaching by expert faculty from Kota with top results and complete residential support' },
  { img: `${UP}/2025/09/WhatsApp-Image-2025-09-08-at-7.29.17-PM-819x1024.jpeg`, k: 'Integrated IIT - JEE Coaching', t: 'Schooling + IIT JEE coaching by expert faculty from Kota with proven success, mentoring, and full support' },
  { img: `${UP}/2025/09/classroom-pic-819x1024.jpg`, k: 'Commerce Schooling + Coaching', t: 'Commerce schooling with expert coaching for CA, CS, CUET, ensuring strong results' },
  { img: `${UP}/2025/09/WhatsApp-Image-2025-09-08-at-7.29.16-PM-1-819x1024.jpeg`, k: 'Integrated NDA Coaching', t: 'Integrated NDA coaching by expert faculty from Kota with schooling, fitness training, and discipline focus' },
  { img: `${UP}/2025/09/WhatsApp-Image-2025-09-08-at-7.28.35-PM-819x1024.jpeg`, k: 'Study Abroad Division', t: 'From IELTS to University Admissions — Your Gateway to the UK, USA, Canada, Europe, Australia & Beyond' },
];

const stay = [
  { img: `${UP}/2025/08/ChatGPT-Image-Aug-22-2025-02_25_26-PM-1024x683.png`, b: 'Career Point Gurukul IIT JEE Coaching:', t: 'Fueling Success through Knowledge and Innovation. Unlock Your True Potential in IIT JEE Preparation!' },
  { img: `${UP}/2025/08/NEET-on-Exam-Sheet-1024x683.png`, b: 'Career Point Gurukul NEET Coaching:', t: 'Building Future Doctors with Precision, Knowledge, and Care. Your Journey to a White Coat Starts Here.' },
  { img: `${UP}/2025/08/NDA-Khadakwasla.webp`, b: 'Career Point Gurukul NDA Coaching:', t: 'Forging Leaders of Tomorrow with Discipline, Knowledge, and Courage. Your Path to the Armed Forces Begins Here.' },
  { img: `${UP}/2025/08/ChatGPT-Image-Aug-22-2025-02_27_59-PM-1024x683.png`, b: 'Career Point Gurukul Commerce Schooling + Coaching:', t: 'Where Academic Excellence Meets Career Success in CA, CS, CUET, CLAT & Beyond.' },
];

const stressFree = B.find(b => b.t === 'p' && b.v.startsWith('Introducing the Stress-Free'))?.v || '';
const testimonials = ofType('testimonial');
const faqs = ofType('qa');
const life = [
  { img: `${UP}/2025/09/mothers-day.jpg`, t: "Mother's Day Celeberation" },
  { img: `${UP}/2025/09/1.jpg`, t: 'Annual Function' },
  { img: `${UP}/2025/09/thumb.jpg`, t: 'Cleanliness Activity' },
];

// Campus tour: YouTube Short (vertical), used in the hero pop-up and the Campus Tour section
const TOUR_ID = '0T7u0xO5q4g';
// Campus Tour section shows two Shorts side by side (left, right)
const TOUR_SHORTS = ['JzMI7B9VF9I', TOUR_ID];

// Exam list from the school's banner (NTSE dropped at the school's request)
const ROTATE = ['IIT-JEE (Main & Adv.)', 'NEET (Pre-medical)', 'NDA', 'CA Foundation etc.'];
const HERO_BG = `${UP}/2025/12/0N2A0751-2048x1152.jpg`;

function useIsNarrow(px = 640) {
  const [n, setN] = useState(() => typeof window !== 'undefined' && window.innerWidth <= px);
  useEffect(() => {
    const on = () => setN(window.innerWidth <= px);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [px]);
  return n;
}

function TourModal({ onClose }) {
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <motion.div className="tour-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="tour portrait" initial={{ scale: .92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .95, opacity: 0 }} onClick={e => e.stopPropagation()}>
        <button className="tour-x" onClick={onClose} aria-label="Close video"><X /></button>
        <div className="video portrait"><iframe src={`https://www.youtube-nocookie.com/embed/${TOUR_ID}?autoplay=1&rel=0`} title="Career Point Gurukul campus tour" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  const narrow = useIsNarrow();
  const [i, setI] = useState(0);
  const [w, setW] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tour, setTour] = useState(false);
  const n = heroSlides.length;

  useEffect(() => { const t = setInterval(() => setW(x => (x + 1) % ROTATE.length), 2200); return () => clearInterval(t); }, []);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI(x => (x + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, paused, n]);
  const go = d => setI(x => (x + d + n) % n);

  const word = { hidden: { opacity: 0, y: 40 }, show: k => ({ opacity: 1, y: 0, transition: { duration: .8, delay: .1 + k * .08, ease: [.2, .8, .2, 1] } }) };

  return (
    <section className="hx">
      <div className="hx-bg" aria-hidden><img src={HERO_BG} alt="" /></div>
      <div className="hx-shade" aria-hidden />
      <div className="hx-grain" aria-hidden />
      <span className="hx-orb o1" aria-hidden /><span className="hx-orb o2" aria-hidden />
      <Ring className="hx-ring" color="rgba(246,195,67,.22)" />

      <div className="wrap hx-grid">
        <div className="hx-copy">
          <motion.span className="hx-pill" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
            <i /> Admissions Open 2027-28 · Class 6th – 12th
          </motion.span>
          <h1>
            {['New Edge', 'World Class', 'Fully Boarding School'].map((t, k) => (
              <motion.span key={t} className={`hx-line ${k === 2 ? 'gold' : ''}`} variants={word} initial="hidden" animate="show" custom={k}>{t} </motion.span>
            ))}
          </h1>
          <motion.div className="hx-rotate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55 }}>
            <span>with Integrated Coaching for</span>
            <span className="hx-word">
              <b key={ROTATE[w]}>{ROTATE[w]}</b>
            </span>
          </motion.div>
          <motion.p className="hx-lede" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .65 }}>
            Welcome to Career Point Gurukul, Chandigarh, the best fully residential school near Chandigarh, the City Beautiful, with the best integrated career preparation (coaching) by expert faculty from CP Kota for IIT-JEE/ NEET/ NDA/ CA FOUNDATION/ STUDY ABROAD &amp; PRE-FOUNDATION (6th to 12th).
            <span className="hx-lede-key"><b>School + Coaching + Hostel</b> All facilities within huge 14 acre lush green campus.</span>
          </motion.p>
          <motion.div className="hx-ctas" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}>
            <button className="btn gold hx-apply" onClick={openEnquiry}>Apply Now <ArrowRight /></button>
            <button className="hx-play" onClick={() => setTour(true)}>
              <span className="hx-play-ico"><Play fill="currentColor" /></span>
              <span><b>Watch campus tour</b><small>Short video</small></span>
            </button>
          </motion.div>
        </div>

        {/* 3D banner stack */}
        <motion.div className="hx-stage" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .9, delay: .2 }}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className={`hx-stack ${narrow ? 'sq' : ''}`}>
            {heroSlides.map((s, k) => {
              const off = (k - i + n) % n;
              const visible = off < 3;
              return (
                <motion.div key={k} className="hx-card"
                  style={{ zIndex: n - off, pointerEvents: off === 0 ? 'auto' : 'none' }}
                  animate={{ x: off * 26, y: off * -22, scale: 1 - off * .06, rotate: off * 2.5, opacity: visible ? 1 - off * .25 : 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                  drag={off === 0 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.6}
                  onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 70) go(info.offset.x < 0 ? 1 : -1); }}>
                  <img src={narrow ? s.m : s.d} alt="Career Point Gurukul Mohali highlights" draggable={false} />
                </motion.div>
              );
            })}
          </div>
          <div className="hx-controls">
            <button onClick={() => go(-1)} aria-label="Previous slide"><ChevronLeft /></button>
            <div className="hx-dots">{heroSlides.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`}>{k === i && !paused && <span key={i} className="fill" />}</button>)}</div>
            <button onClick={() => go(1)} aria-label="Next slide"><ChevronRight /></button>
          </div>
          <Stamp className="hx-stamp" />
        </motion.div>
      </div>

      {/* Glass stats bar */}
      <div className="wrap">
        <motion.div className="hx-stats" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .9, duration: .7 }}>
          <div><b>1993</b><span>Career Point legacy, Kota</span></div>
          <div><b>30K<em>+</em></b><span>Students taught every year</span></div>
          <div><b>14<em> acre</em></b><span>Lush green campus</span></div>
          <div><b>CBSE</b><span>Affiliation No: 1631077</span></div>
        </motion.div>
      </div>

      <AnimatePresence>{tour && <TourModal onClose={() => setTour(false)} />}</AnimatePresence>
    </section>
  );
}

const CAMPUS_FACILITIES = [
  { icon: School, t: 'School', s: 'CBSE · Class 6th – 12th' },
  { icon: GraduationCap, t: 'Coaching', s: 'Expert faculty from CP Kota' },
  { icon: BedDouble, t: 'Hostel', s: 'Fully residential, AC rooms' },
  { icon: Trophy, t: 'Sports', s: 'Complete sports infrastructure' },
  { icon: Music, t: 'Recreation', s: 'Music, dance & celebrations' },
  { icon: Sparkles, t: 'All facilities', s: 'Within one campus' },
];

function CampusShowcase() {
  return (
    <section className="section cs">
      <div className="wrap">
        <SectionHead center eyebrow="One Integrated Campus" title={<>Everything within a <em className="accent">14 acre</em> lush green campus</>} />
        <Reveal className="cs-frame">
          <img src={CAMPUS} alt="Career Point Gurukul campus building and lawns with students studying" loading="lazy" />
          <span className="cs-badge"><b>14</b><span>acre<br />campus</span></span>
          <div className="cs-cap">
            <small>School + Coaching + Hostel</small>
            <b>+ Sports + Recreations &amp; all facilities</b>
          </div>
        </Reveal>
        <div className="cs-grid">
          {CAMPUS_FACILITIES.map(({ icon: Icon, t, s }, k) => (
            <Reveal key={t} className="cs-item" delay={k * .05}>
              <span className="cs-ico"><Icon /></span>
              <span><b>{t}</b><small>{s}</small></span>
            </Reveal>
          ))}
        </div>
        <div className="cs-ctas">
          <button className="btn gold" onClick={openEnquiry}>Apply Now <ArrowRight /></button>
          <Link to="/facility/" className="link-arrow">Explore campus facilities <ArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function Marquee({ items, blue, dur }) {
  const all = [...items, ...items];
  return (
    <div className={`marquee ${blue ? 'blue' : ''}`} aria-hidden>
      <div className="marquee-track" style={dur ? { animationDuration: dur } : undefined}>{all.map((t, i) => <span key={i}>{t}</span>)}</div>
    </div>
  );
}

function Results() {
  const allResults = uniq([...galleries[2].v, ...galleries[3].v]);
  return (
    <section className="section">
      <div className="wrap">
        <div className="head-row">
          <SectionHead eyebrow="Our Toppers" title={<>Proven Results That <em className="accent">Speak</em> for Themselves</>} />
          <a className="btn" href={site.wa.next} target="_blank" rel="noreferrer"><WhatsApp /> you can be the next - contact us now</a>
        </div>
      </div>
      <Rail items={allResults} />
    </section>
  );
}

const SCH = [`${UP}/2026/07/horizontal-oct-and-nov-banner.jpeg`, `${UP}/2026/07/square-new-dates.jpeg`];
function Scholarship() {
  const [open, lb] = useLightbox(SCH);
  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="sch">
          <div className="sch-copy">
            <div>
              <span className="eyebrow"><Sparkles size={14} /> CP Star Scholarship</span>
              <h2>Excellence Rewarded: <em>CP Star Scholarship 2026</em></h2>
              <div className="sch-big"><b>100%</b><span>Scholarship<br />upto</span><i /><b>₹1 Cr</b><span>Rewards<br />worth</span></div>
              <ul className="sch-tags">{['IIT - JEE', 'NEET', 'NDA', 'Foundation'].map(t => <li key={t}>{t}</li>)}</ul>
            </div>
            <div>
            <div className="sch-dates">
              {[['Phase I', 'Oct', '11'], ['Phase II', 'Nov', '11']].map(([p, m, d]) => (
                <div className="sch-date" key={p}>
                  <span className="cal"><small>{m}</small><b>{d}</b></span>
                  <span><small>{p}</small><b>{m === 'Oct' ? 'October' : 'November'} {d}th, 2026</b><em>Offline exam</em></span>
                </div>
              ))}
            </div>
            <div className="btn-row">
              <a className="btn gold" href={site.wa.scholarship} target="_blank" rel="noreferrer"><WhatsApp /> Claim Your Scholarship</a>
              <a className="btn ghost" href="tel:+917087228881"><Phone size={18} /> 70872-28881</a>
            </div>
            </div>
          </div>
          <div className="sch-media">
            <button onClick={() => open(0)} aria-label="View scholarship banner"><img src={SCH[0]} alt="CP Star Scholarship 2026 – Phase I & II dates" loading="lazy" /></button>
            <button onClick={() => open(1)} aria-label="View scholarship poster"><img src={SCH[1]} alt="CP Star – Career Point Scholarship Exam" loading="lazy" /></button>
          </div>
        </Reveal>
        {lb}
      </div>
    </section>
  );
}

function LifeGrid() {
  const [open, lb] = useLightbox(life.map(l => l.img));
  return (
    <div className="stay-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      {life.map((l, i) => (
        <Reveal key={l.t} delay={i * .08}>
          <button className="path-card" style={{ border: 0, padding: 0, width: '100%', aspectRatio: '4/3', cursor: 'zoom-in' }} onClick={() => open(i)}>
            <img src={l.img} alt={l.t} loading="lazy" /><span className="cap">{l.t}</span>
          </button>
        </Reveal>
      ))}
      {lb}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Seo slug="home-2" />
      <Hero />

      <Marquee items={['IIT - JEE', 'NEET', 'NDA', 'Commerce', 'Study Abroad', 'Pre-Foundation (6th to 12th)', 'CBSE Schooling', 'Indoor Sports', 'Outdoor Sports', 'Swimming Pool', 'Attached Washroom Boys / Girls Hostels', 'AC Hostels']} dur="60s" />

      <CampusShowcase />

      {/* Path */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="The Gurukul Way" title={<>A well defined <em className="accent">path</em> for success</>} />
          <div className="path-grid">
            {paths.map((p, i) => (
              <Reveal key={p.t} delay={i * .07}>
                <Link to={p.to} className="path-card" style={{ display: 'block' }}>
                  <img src={p.img} alt={p.t} loading="lazy" /><span className="num">0{i + 1}</span><span className="cap">{p.t}{p.s && <small>{p.s}</small>}</span>
                </Link>
              </Reveal>
            ))}
          </div>        </div>
      </section>

      {/* Streams */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead center eyebrow="Integrated Programmes" title="Career Preparation Along With Schooling" />
          <div className="streams">
            {streams.map((s, i) => (
              <Reveal className="stream" key={s.title} delay={i * .06}>
                <img src={s.img} alt="" loading="lazy" /><h3>{s.title}</h3><p>{s.desc || 'By Expert Faculty From Kota'}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Programs stacked */}
      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow="Our Divisions" title={<>One campus. <em className="accent">Five</em> powerful pathways.</>} lede="Stay Ahead With all-round performance in your chosen stream" />
          <div className="programs">
            {programs.map((p, i) => (
              <article className="program" key={p.k}>
                <div className="pg-img"><img src={p.img} alt={p.k} loading="lazy" /></div>
                <div className="pg-body">
                  <div className="pg-no">0{i + 1}</div>
                  <div className="pg-kicker">{p.k}</div>
                  <h3>{p.t}</h3>
                  <div className="btn-row on-dark">
                    <a className="btn gold" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Enquire on WhatsApp</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stay ahead */}
      <section className="section bg-paper2">
        <div className="wrap">
          <SectionHead center eyebrow="Stay Ahead" title="Stay Ahead With all-round performance in your chosen stream" />
          <div className="stay-grid">
            {stay.map((s, i) => (
              <Reveal className="stay" key={s.b} delay={i * .07}>
                <div className="im"><img src={s.img} alt={s.b} loading="lazy" /></div>
                <p><b>{s.b.replace(/:$/, '')}</b>{s.t}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="center" style={{ marginTop: 36 }}>
            <a className="btn" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Register now - limited seats available</a>
          </Reveal>
        </div>
      </section>

      {/* Campus tour */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="Take a walk" title={<>Campus <em className="accent">Tour</em></>} />
          <div className="tour-shorts">
            {TOUR_SHORTS.map((id, i) => <Reveal key={id} className="tour-short" delay={i * .08}><Video src={`https://youtube.com/shorts/${id}`} portrait /></Reveal>)}
          </div>
        </div>
      </section>

      {/* Unique */}
      <section className="section bg-ink" style={{ overflow: 'hidden' }}>
        <Ring className="ph-ring" color="rgba(246,195,67,.25)" />
        <div className="wrap">
          <div className="split" style={{ alignItems: 'end', marginBottom: 48 }}>
            <Reveal>
              <span className="eyebrow">Stress Free Environment</span>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>What Career Point Gurukul Makes <em className="accent" style={{ color: 'var(--gold)' }}>Unique</em>?</h2>
            </Reveal>
            <Reveal delay={.1}><p className="lede" style={{ fontSize: '1rem' }}>{stressFree}</p></Reveal>
          </div>
          <div className="unique-grid">
            {unique.map((u, i) => (
              <Reveal className="u-card" key={u.title} delay={(i % 3) * .07}>
                <span className="u-no">0{i + 1}</span>
                <img src={u.img} alt="" loading="lazy" />
                <h3>{u.title}</h3><p>{u.desc}</p>
              </Reveal>
            ))}
          </div>
          <Reveal className="center" style={{ marginTop: 40 }}>
            <a className="btn gold" href={site.wa.tour} target="_blank" rel="noreferrer"><WhatsApp /> Experience Gurukul Life: Schedule a Tour</a>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="section tight">
        <div className="wrap">
          <Reveal className="stats">
            <div className="stat"><b>1993</b><span>Career Point journey began in Kota</span></div>
            <div className="stat"><b>31<em>+</em></b><span>Years of legacy in Kota</span></div>
            <div className="stat"><b>30K<em>+</em></b><span>Students taught every year by Career Point Group</span></div>
            <div className="stat"><b>15<em>-acre</em></b><span>Lush green residential campus</span></div>
          </Reveal>
        </div>
      </section>

      {/* Nation's best */}
      <section className="section tight" style={{ paddingTop: 0 }}>
        <div className="wrap"><SectionHead center eyebrow="Where our students go" title={<>From Here to the <em className="accent">Nation’s Best</em></>} /></div>
        <Rail items={galleries[0].v} logos />
      </section>

      <Results />

      <Marquee blue items={['Dream Big', 'Study Smart', 'Succeed', 'Join Career Point Gurukul', 'Open the doors to your future']} />

      {/* Testimonials */}
      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <SectionHead eyebrow="Parents speak" title={<>Testimonials That <em className="accent">Speak Volumes</em></>} />
            <Link to="/parents-reviews/" className="btn ghost">Read All Testimonials <ArrowRight /></Link>
          </div>
          <Testimonials items={testimonials} />
        </div>
      </section>

      {/* Student videos */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead center eyebrow="Student stories" title="Hear It Straight from Our Students" />
          <div className="video-grid three">
            <Video src="https://youtu.be/OXP68PcdUYg" />
            <Video src="https://youtu.be/u4cXiRCcQE8" />
            <Video src={`${UP}/2025/11/Shrishti-Yadav-Testimony-.mp4`} />
          </div>
        </div>
      </section>

      <Scholarship />

      {/* Life beyond classrooms */}
      <section className="section bg-ink">
        <div className="wrap">
          <div className="split">
            <div>
              <SectionHead eyebrow="Life Beyond Classrooms" title={<>Where Curiosity Meets <em className="accent" style={{ color: 'var(--gold)' }}>Books</em></>} lede="Dream Big. Study Smart. Succeed. Join Career Point Gurukul and open the doors to your future." />
              <Link className="btn gold" to="/photo-gallery/">Explore Photo Gallery <ArrowRight /></Link>
            </div>
            <Reveal><Video src={`${UP}/2025/08/New-Career-Point-Video-for-Website-.mp4`} /></Reveal>
          </div>
        </div>
      </section>

      {/* Life at CP */}
      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <SectionHead eyebrow="CARRER POINT GURUKUL CHANDIGARH" title={<>Life at <em className="accent">CP Gurukul</em></>} />
            <Link className="btn ghost" to="/photo-gallery/">View Gallery <ArrowRight /></Link>
          </div>
          <LifeGrid />
        </div>
      </section>

      {/* App */}
      <section className="section tight">
        <div className="wrap">
          <Reveal className="app-band">
            <img className="phone" src={`${UP}/2025/08/New-career-Point-Mobile-PNG-.png`} alt="Career Point Gurukul mobile app" loading="lazy" />
            <div className="app-txt">
              <span className="eyebrow">Student · Parent Zone</span>
              <h2>DOWNLOAD OUR APP NOW!</h2>
              <p>Career Point Gurukul App Is Available On Play Store</p>
            </div>
            <a className="play-badge" href={site.playStore} target="_blank" rel="noreferrer" aria-label="Get it on Google Play"><img src="/images/google-play-badge.png" alt="Get it on Google Play" width="534" height="160" /></a>
          </Reveal>
        </div>
      </section>

      {/* FAQ — compact: header row + two independent columns */}
      <section className="section bg-white">
        <div className="wrap">
          <div className="head-row">
            <SectionHead eyebrow="FAQ" title={<>Frequently asked <em className="accent">Questions</em></>} />
            <Reveal className="faq-ask">
              <h3>Still have Questions?</h3>
              <a className="btn" href={site.wa.principal} target="_blank" rel="noreferrer"><MessageCircle /> Chat with principal directly!</a>
            </Reveal>
          </div>
          <Reveal className="faq-compact">
            <Faq items={faqs.slice(0, Math.ceil(faqs.length / 2))} />
            <Faq items={faqs.slice(Math.ceil(faqs.length / 2))} defaultOpen={-1} />
          </Reveal>
        </div>
      </section>

      <ContactSection />
      <BlogSection />
    </>
  );
}
