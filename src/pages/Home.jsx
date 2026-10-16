import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, Sparkles, Phone } from 'lucide-react';
import pages from '../data/pages.json';
import { site, UP } from '../data/site';
import { Seo, Reveal, SectionHead, Stamp, Ring, Video, Faq, Testimonials, ContactSection, BlogSection, useLightbox } from '../components/ui';
import { Rail } from '../components/Blocks';
import { WhatsApp } from '../components/Icons';

const B = pages['home-2'].blocks;
const ofType = t => B.filter(b => b.t === t);
const galleries = ofType('gallery');
const uniq = a => [...new Set(a)];

const heroSlides = [
  { d: `${UP}/2026/08/shared-image.jpg`, m: `${UP}/2026/08/new-banner-mobile.jpeg` },
  { d: `${UP}/2026/08/cp-banner-first-fina.jpeg`, m: `${UP}/2026/08/new-2nd-banner.jpeg` },
  { d: `${UP}/2025/10/Desktop-fully-residential-scaled.jpg`, m: `${UP}/2025/10/square-mobile-fully-residential-school-scaled.jpg` },
  { d: `${UP}/2026/08/WhatsApp-Image-2026-08-03-at-1.14.10-PM.jpeg`, m: `${UP}/2025/10/square-mobile-wellness-beyond-academics-yoga-scaled.jpg` },
  { d: `${UP}/2025/10/Desktop-complete-sports-scaled.jpg`, m: `${UP}/2025/10/square-mobile-complete-sports-infra-scaled.jpg` },
  { d: `${UP}/2025/10/Desktop-music-dance-scaled.jpg`, m: `${UP}/2025/10/square-mobile-music-dance-scaled.jpg` },
  { d: `${UP}/2026/08/shared-image-1.jpg`, m: `${UP}/2025/10/square-mobile-complete-sports-infra-1-scaled.jpg` },
];

const paths = [
  { img: `${UP}/elementor/thumbs/new-slie-rbsln59ipdwh6ywdrimako5df5xwdr9mq6o795sjts.png`, t: 'A well defined path for success', to: '/cp-gurukul/' },
  { img: `${UP}/2025/09/new-sli.png`, t: 'Excellent School Education', to: '/school-2/' },
  { img: `${UP}/2025/09/Residential.jpg`, t: 'Integrated Coaching by Experts from KOTA', to: '/integrated-coaching/' },
  { img: `${UP}/2025/09/new4.png`, t: 'Residential facilities', to: '/hostel-facilities/' },
  { img: `${UP}/2025/09/LIFE-SKILL-DEVELOPMENT.jpg`, t: 'Recreations and Sports', to: '/facility/' },
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

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI(x => (x + 1) % heroSlides.length), 5200);
    return () => clearTimeout(t);
  }, [i, paused]);
  const go = d => setI(x => (x + d + heroSlides.length) % heroSlides.length);
  const words = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };
  return (
    <section className="hero">
      <div className="hero-glow" style={{ width: 420, height: 420, background: '#f6c343', top: -120, left: -160 }} />
      <div className="hero-glow" style={{ width: 380, height: 380, background: '#2f7bf5', bottom: -160, right: -100, opacity: .3 }} />
      <div className="wrap hero-grid">
        <div>
          <motion.span className="eyebrow" {...words} transition={{ duration: .6 }}>Fully Residential CBSE School · Mohali</motion.span>
          <motion.h1 {...words} transition={{ duration: .8, delay: .08 }}>
            Schooling, <span className="script">coaching</span> &amp; a home — on <span className="under">one campus
              <svg viewBox="0 0 300 20" preserveAspectRatio="none"><path d="M2 14 C 80 2, 200 2, 298 12" stroke="#f6c343" strokeWidth="6" fill="none" strokeLinecap="round" /></svg>
            </span>.
          </motion.h1>
          <motion.p className="lede" {...words} transition={{ duration: .8, delay: .18 }}>
            Welcome to Career Point Gurukul Mohali, the best boarding school in Punjab, offering integrated coaching for JEE, NEET &amp; NDA with world-class facilities — a unit of legendary Career Point, Kota.
          </motion.p>
          <motion.div className="btn-row" {...words} transition={{ duration: .8, delay: .26 }}>
            <a className="btn" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Register now - limited seats</a>
            <Link className="btn ghost" to="/admission-guidelines/">Admission Guidelines <ArrowRight /></Link>
          </motion.div>
          <motion.ul className="hero-tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }}>
            {['IIT - JEE', 'NEET', 'NDA', 'Commerce', 'Study Abroad', 'Pre - Foundation'].map(t => <li key={t}>{t}</li>)}
          </motion.ul>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <Stamp className="hero-stamp" />
          {['desktop', 'mobile'].map(kind => (
            <div className={`hero-frame ${kind}`} key={kind}>
              <AnimatePresence initial={false}>
                <motion.img key={i} src={kind === 'desktop' ? heroSlides[i].d : heroSlides[i].m} alt="Career Point Gurukul Mohali highlights"
                  initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .9 }} />
              </AnimatePresence>
              <div className="hero-arrows">
                <button onClick={() => go(-1)} aria-label="Previous slide"><ChevronLeft /></button>
                <button onClick={() => go(1)} aria-label="Next slide"><ChevronRight /></button>
              </div>
            </div>
          ))}
          <div className="hero-dots">{heroSlides.map((_, k) => <button key={k} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />)}</div>
          <div className="hero-floating"><b>1993</b><small>Legacy of<br />Career Point, Kota</small></div>
        </motion.div>
      </div>
    </section>
  );
}

function Marquee({ items, blue }) {
  const all = [...items, ...items];
  return (
    <div className={`marquee ${blue ? 'blue' : ''}`} aria-hidden>
      <div className="marquee-track">{all.map((t, i) => <span key={i}>{t}</span>)}</div>
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

      <Marquee items={['IIT - JEE', 'NEET', 'NDA', 'Commerce', 'Study Abroad', 'Pre - Foundation', 'CBSE Schooling', 'AC Hostels']} />

      {/* Path */}
      <section className="section">
        <div className="wrap">
          <SectionHead center eyebrow="The Gurukul Way" title={<>A well defined <em className="accent">path</em> for success</>} />
          <div className="path-grid">
            {paths.map((p, i) => (
              <Reveal key={p.t} delay={i * .07}>
                <Link to={p.to} className="path-card" style={{ display: 'block' }}>
                  <img src={p.img} alt={p.t} loading="lazy" /><span className="num">0{i + 1}</span><span className="cap">{p.t}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="center" style={{ marginTop: 28 }}><Link to="/life-skill-development/" className="link-arrow">Life skill Development <ArrowRight /></Link></Reveal>
        </div>
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
          <Reveal style={{ maxWidth: 1000, margin: '0 auto' }}><Video src="https://youtu.be/qqIIUznuza8" /></Reveal>
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

      {/* FAQ */}
      <section className="section bg-white">
        <div className="wrap faq-layout">
          <div className="sticky">
            <SectionHead eyebrow="FAQ" title={<>Frequently asked <em className="accent">Questions</em></>} />
            <Reveal>
              <h3>Still have Questions?</h3>
              <a className="btn" href={site.wa.principal} target="_blank" rel="noreferrer"><MessageCircle /> Chat with principal directly!</a>
            </Reveal>
          </div>
          <Reveal><Faq items={faqs} /></Reveal>
        </div>
      </section>

      <ContactSection />
      <BlogSection />
    </>
  );
}
