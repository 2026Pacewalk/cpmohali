import { Monitor, Clock, Users, Layers, BookOpenCheck, CheckCircle2, XCircle, ArrowRight, Megaphone } from 'lucide-react';
import { site } from '../data/site';
import { Seo, PageHero, Reveal, SectionHead } from '../components/ui';
import { WhatsApp } from '../components/Icons';
import { openEnquiry } from '../components/EnquiryPopup';

// Content supplied by the school (Oct 2026) — keep the wording as given
const NOTICE = 'NTA has declared that NEET will also be conducted Online from 2027 onwards, like IIT-JEE.';
const MEANS = 'Means NEET will also be a Computer Based Test from 2027 session onwards. Students need exhaustive Computer based online test practice before appearing in final exam.';
const LIMITED = 'Online CBT facility can be provided by only those Institutions which keep limited seats in 11th and 12th classes. Career Point Gurukul offers limited seats being fully residential campus, not more than 6 batches of 30-35 Students each for 11th/12th for both NEET/ JEE.';
const CLOSING = 'This is one of the most important facility which is being provided by CP Gurukul, which is practically not possible for large Coaching Institutes.';

const FACTS = [
  { icon: Layers, b: '≤ 6', s: 'Batches for 11th / 12th' },
  { icon: Users, b: '30–35', s: 'Students per batch' },
  { icon: BookOpenCheck, b: 'NEET + JEE', s: 'Both streams' },
  { icon: Monitor, b: 'Online CBT', s: 'Practice facility' },
];

function CbtScreen() {
  return (
    <div className="cbt-screen" aria-hidden>
      <div className="cbt-bar"><i /><i /><i /><span>NEET · Computer Based Test</span><b><Clock size={13} /> 02:59:41</b></div>
      <div className="cbt-body">
        <div className="cbt-q">
          <small>Question 12 · Biology</small>
          <p>Which organelle is known as the powerhouse of the cell?</p>
          {['Ribosome', 'Mitochondria', 'Golgi body', 'Lysosome'].map((o, k) => <span key={o} className={k === 1 ? 'on' : ''}><em>{'ABCD'[k]}</em>{o}</span>)}
          <div className="cbt-btns"><span>Mark for review</span><span className="go">Save &amp; Next</span></div>
        </div>
        <div className="cbt-pal">
          <small>Question palette</small>
          <div>{Array.from({ length: 20 }, (_, k) => <i key={k} className={k < 11 ? 'a' : k === 11 ? 'c' : k === 14 ? 'r' : ''}>{k + 1}</i>)}</div>
        </div>
      </div>
    </div>
  );
}

export default function CBT() {
  return (
    <>
      <Seo title="CBT (Computer Based Test)" description="NEET will be a Computer Based Test from 2027. Career Point Gurukul offers online CBT practice with limited seats — not more than 6 batches of 30-35 students for 11th/12th NEET & JEE." />
      <PageHero title="CBT (Computer Based Test)" crumbs={[{ label: 'CP-Gurukul Concept', to: '/cp-gurukul/' }]}
        lede="NEET goes online from 2027 — practise the way you will be tested." />

      {/* Announcement + CBT mock screen */}
      <section className="section tight">
        <div className="wrap cbt-intro">
          <Reveal>
            <span className="cbt-flag"><Megaphone size={15} /> NTA announcement</span>
            <p className="cbt-notice">{NOTICE}</p>
            <div className="cbt-exams">
              <span><b>IIT-JEE</b><small>Computer Based Test</small></span>
              <span className="new"><b>NEET</b><small>Computer Based Test from 2027</small></span>
            </div>
            <p className="cbt-text">{MEANS}</p>
          </Reveal>
          <Reveal delay={.1}><CbtScreen /></Reveal>
        </div>
      </section>

      {/* Limited seats */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead center eyebrow="Why it needs limited seats" title={<>Online CBT practice needs <em className="accent">limited seats</em></>} />
          <Reveal className="cbt-limited"><p>{LIMITED}</p></Reveal>
          <div className="cbt-facts">
            {FACTS.map(({ icon: Icon, b, s }, k) => (
              <Reveal key={s} className="cbt-fact" delay={k * .06}>
                <span className="cbt-fi"><Icon /></span><b>{b}</b><small>{s}</small>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing comparison */}
      <section className="section">
        <div className="wrap">
          <Reveal className="cbt-close">
            <p>{CLOSING}</p>
            <div className="cbt-vs">
              <div className="yes"><CheckCircle2 /><span><b>CP Gurukul</b><small>Limited seats on a fully residential campus — online CBT practice is possible</small></span></div>
              <div className="no"><XCircle /><span><b>Large coaching institutes</b><small>Online CBT practice is practically not possible</small></span></div>
            </div>
            <div className="cbt-ctas">
              <button className="btn gold" onClick={openEnquiry}>Apply Now <ArrowRight /></button>
              <a className="btn ghost" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Ask on WhatsApp</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
