import { Link } from 'react-router-dom';
import { Palette, Users, Lightbulb, Compass, HeartHandshake, Flower2, CookingPot, Music2, Brush, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import pages from '../data/pages.json';
import { site, UP } from '../data/site';
import { Seo, PageHero, Reveal, SectionHead, ContactSection, useLightbox } from '../components/ui';
import { WhatsApp } from '../components/Icons';

const B = pages['life-skill-development'].blocks;
const intro = B.find(b => b.t === 'h2' && b.v.startsWith('Gurukul provides'))?.v;

// The five pillars — original text from the live page ("Label:" paragraph followed by its description)
const ICONS = { 'Clubs & Activities': Palette, 'Leadership & Interpersonal Skills': Users, 'Imagination & Creativity': Lightbulb, 'Independence & Initiative': Compass, 'Family & Community': HeartHandshake };
const pillars = [];
B.forEach((b, i) => { if (b.t === 'p' && /:$/.test(b.v) && B[i + 1]?.t === 'p') pillars.push({ title: b.v.replace(/:$/, ''), text: B[i + 1].v }); });
const clubs = ['Painting', 'Literary activities', 'Photography', 'Public speaking', 'Dramatics', 'Music', 'Dance'];

// Competition photos from the live page; descriptions written for this rebuild
const competitions = [
  { img: `${UP}/2025/09/recreation-5.jpg`, title: 'Inter-house Rangoli Competition', icon: Flower2,
    text: 'Each house turns the floor into a canvas — themes like “Emerging India” come alive with colours, flower petals and glowing diyas. Students pick a concept together, divide the work and finish their design against the clock.',
    tags: ['Teamwork', 'Planning', 'Cultural pride'] },
  { img: `${UP}/2025/09/recreation-4.jpg`, title: 'Inter-house Fireless Cooking Competition', icon: CookingPot,
    text: 'No flame, no stove — just creativity. Houses set up their own food stalls, plan the menu, prepare healthy no-cook dishes, plate them beautifully and pitch them to the judges. A delicious lesson in hygiene, nutrition and self-reliance.',
    tags: ['Self-reliance', 'Hygiene', 'Presentation'] },
  { img: `${UP}/2025/09/recreation-2.jpg`, title: 'Inter-house Dance Competition', icon: Music2,
    text: 'Group choreographies that blend classical, folk and contemporary styles. Weeks of practice in the dance hall build rhythm, fitness and coordination — and the confidence to own the stage in front of the whole school.',
    tags: ['Confidence', 'Fitness', 'Coordination'] },
  { img: `${UP}/2025/09/recreation-3.jpg`, title: 'Inter-house Painting Competition', icon: Brush,
    text: 'Paper, colours and imagination. From nature and social themes to free expression, students sketch, paint and craft their ideas in the fine-arts studio — learning patience, observation and the joy of creating something their own.',
    tags: ['Imagination', 'Patience', 'Expression'] },
];

const outcomes = [
  { t: 'Teamwork', d: 'Working in houses, clubs and teams every week.' },
  { t: 'Leadership', d: 'Captains, coordinators and event heads from among students.' },
  { t: 'Confidence', d: 'Stage, sports field and public speaking — regularly.' },
  { t: 'Responsibility', d: 'A disciplined routine with room for independence.' },
];

export default function LifeSkill() {
  const [open, lb] = useLightbox(competitions.map(c => c.img));
  const [P0, ...rest] = pillars;
  const Icon0 = ICONS[P0?.title] || Palette;
  return (
    <>
      <Seo slug="life-skill-development" title="Life Skill Development" />
      <PageHero title="Life Skill Development" crumbs={[{ label: 'CP-Gurukul Concept', to: '/cp-gurukul/' }]}
        lede="Beyond marks and ranks — clubs, houses and competitions that shape confident, caring and creative young people."
        image={`${UP}/2025/09/recreation-1024x331.jpg`} />

      {/* Intro */}
      <section className="section tight">
        <div className="wrap ls-intro">
          <Reveal className="ls-intro-img">
            <img src={`${UP}/2025/09/recreation-1024x331.jpg`} alt="CP Gurukul students performing in the music room" />
            <span className="ls-sticker"><Sparkles size={16} /> Learning beyond classrooms</span>
          </Reveal>
          <Reveal delay={.1}>
            <span className="eyebrow">Life at Gurukul</span>
            <p className="ls-quote">{intro}</p>
          </Reveal>
        </div>
      </section>

      {/* Pillars bento */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead center eyebrow="Five pillars" title={<>How Gurukul builds <em className="accent">life skills</em></>} />
          <div className="ls-bento">
            {P0 && (
              <Reveal className="ls-card big">
                <span className="ls-ico"><Icon0 /></span>
                <span className="ls-no">01</span>
                <h3>{P0.title}</h3>
                <p>{P0.text}</p>
                <ul className="ls-clubs">{clubs.map(c => <li key={c}>{c}</li>)}</ul>
              </Reveal>
            )}
            {rest.map((p, i) => {
              const I = ICONS[p.title] || Sparkles;
              return (
                <Reveal className="ls-card" key={p.title} delay={(i % 2) * .08}>
                  <span className="ls-ico"><I /></span>
                  <span className="ls-no">0{i + 2}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitions */}
      <section className="section">
        <div className="wrap">
          <div className="head-row">
            <SectionHead eyebrow={<><Trophy size={14} /> Inter-house events</>} title={<>Competitions that <em className="accent">bring out the best</em></>}
              lede="Every student belongs to a house. Through the year, houses compete in art, culture and life-skill events — earning points, pride and lifelong friendships." />
            <Link to="/photo-gallery/" className="btn ghost">See photo gallery <ArrowRight /></Link>
          </div>
          <div className="ls-comps">
            {competitions.map((c, i) => {
              const I = c.icon;
              return (
                <Reveal className="ls-comp" key={c.title} delay={(i % 2) * .08}>
                  <button className="ls-comp-img" onClick={() => open(i)} aria-label={`View photo: ${c.title}`}>
                    <img src={c.img} alt={c.title} loading="lazy" />
                    <span className="ls-comp-ico"><I /></span>
                  </button>
                  <div className="ls-comp-bd">
                    <h3>{c.title.replace('Inter-house ', '')}<small>Inter-house</small></h3>
                    <p>{c.text}</p>
                    <ul>{c.tags.map(t => <li key={t}>{t}</li>)}</ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
          {lb}
        </div>
      </section>

      {/* Outcomes + CTA */}
      <section className="section tight">
        <div className="wrap">
          <Reveal className="ls-cta">
            <div className="ls-cta-copy">
              <span className="eyebrow">What students take home</span>
              <h2>Skills that last a lifetime</h2>
              <div className="btn-row">
                <a className="btn gold" href={site.wa.tour} target="_blank" rel="noreferrer"><WhatsApp /> Experience Gurukul Life: Schedule a Tour</a>
              </div>
            </div>
            <div className="ls-outcomes">
              {outcomes.map((o, i) => <div key={o.t}><b><span>0{i + 1}</span>{o.t}</b><small>{o.d}</small></div>)}
            </div>
          </Reveal>
        </div>
      </section>

      <ContactSection withMap={false} />
    </>
  );
}
