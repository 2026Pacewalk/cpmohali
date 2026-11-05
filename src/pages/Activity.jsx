import { CheckCircle2, ArrowRight } from 'lucide-react';
import { site, UP } from '../data/site';
import { Seo, PageHero, Reveal, SectionHead, Faq } from '../components/ui';
import { WhatsApp } from '../components/Icons';
import { openEnquiry } from '../components/EnquiryPopup';

const CAMPUS_LIFE = [{ label: 'Campus Life' }];

// Content supplied by the school (Google Docs, Nov 2026) — keep the wording as given
const PAGES = {
  sports: {
    seo: { title: 'Indoor & Outdoor Sports Facilities', description: 'Indoor and outdoor sports at Career Point Gurukul Chandigarh: table tennis, chess, skating, badminton, football, basketball, cricket, swimming pool and more — building fitness, confidence and team spirit.' },
    title: 'Indoor & Outdoor Sports',
    lede: 'Building Fitness, Confidence & Team Spirit',
    hero: `${UP}/2026/10/badminton-court.webp`,
    intro: {
      heading: 'Indoor & Outdoor Sports Facilities at Career Point Gurukul – Building Fitness, Confidence & Team Spirit',
      text: ["At Career Point Gurukul, we believe that education extends beyond classrooms and academic achievements. Sports and physical activities play an important role in developing a student's personality, discipline and overall well-being. Our campus encourages students to participate in indoor and outdoor sports, helping them maintain an active lifestyle while learning the values of teamwork, perseverance and sportsmanship. Through structured physical activities and recreational opportunities, students get an environment where they can discover their interests, build confidence and grow stronger both physically and mentally."],
      img: `${UP}/2026/10/sports-recreation-collage.webp`,
    },
    pillars: {
      eyebrow: 'A Sports-Friendly Campus',
      heading: 'A Sports-Friendly Campus for Active Student Development',
      text: 'Sports are an essential part of a balanced educational experience. At Career Point Gurukul, students are encouraged to participate in physical activities that promote fitness, concentration and healthy competition.',
      items: [{ t: 'Physical Fitness' }, { t: 'Mental Strength' }, { t: 'Teamwork & Leadership' }, { t: 'Discipline & Sportsmanship' }],
    },
    blocks: [
      {
        eyebrow: 'Indoor Sports Facilities', heading: 'Learn, Play & Develop Skills Indoors', img: `${UP}/2026/10/badminton-court.webp`,
        text: ['Our indoor sports facilities provide students with opportunities to enjoy recreational games, sharpen their concentration and develop coordination and strategic thinking.'],
        listLabel: 'Students can participate in a variety of indoor activities, including:',
        list: [
          ['Table Tennis', 'Develops reflexes, coordination and concentration.'],
          ['Carrom', 'Encourages precision, patience and strategic thinking.'],
          ['Chess', 'Builds logical reasoning, planning and problem-solving skills.'],
          ['Skating', 'Supports balance, coordination and physical fitness.'],
          ['Lawn Tennis', 'Helps improve agility, stamina and hand-eye coordination.'],
          ['Badminton', 'Encourages speed, reflexes and active participation.'],
        ],
        closing: 'Whether playing for recreation or developing their skills, students get an environment where learning and enjoyment go hand in hand.',
      },
      {
        heading: 'Outdoor Sports Facilities', img: `${UP}/2026/10/facilities/outdoor-sports.webp`,
        text: ['Outdoor sports encourage students to challenge themselves, stay physically active and learn the value of teamwork. Our outdoor sports facilities provide opportunities to participate in a range of games and physical activities.'],
        listLabel: 'Available Outdoor Sports:',
        list: [
          ['Football', 'Encourages teamwork, stamina and coordination.'],
          ['Basketball', 'Develops agility, speed and team strategy.'],
          ['Volleyball', 'Builds communication, coordination and cooperation.'],
          ['Lawn Tennis', 'Improves movement, focus and physical endurance.'],
          ['Cricket', 'Teaches teamwork, patience and game awareness.'],
          ['Gymnastics', 'Supports flexibility, balance, strength and body coordination.'],
        ],
        closing: 'These activities help students discover their sporting interests while developing confidence, discipline and a spirit of healthy competition.',
      },
    ],
    lessons: {
      heading: 'More Than Games: Life Skills Through Sports',
      text: 'At CP Gurukul Chandigarh, sports are not just about winning. They are about learning valuable lessons that students can carry into everyday life.',
      items: [
        ['Teamwork', 'Learning to work together and achieve common goals.'],
        ['Leadership', 'Taking responsibility, making decisions and motivating others.'],
        ['Confidence', "Overcoming challenges and believing in one's abilities."],
        ['Perseverance', 'Understanding that improvement comes through regular effort and practice.'],
        ['Respect', 'Valuing teammates, opponents, rules and the spirit of the game.'],
      ],
    },
    notes: [
      { heading: 'A Healthy Balance Between Academics & Physical Activities', img: `${UP}/2026/10/swimming-pool.webp`, text: ['We believe that a balanced school experience includes academic learning, physical activity and recreation. Sports provide students with opportunities to refresh their minds, build healthy routines and develop skills beyond the classroom.', 'At CP Gurukul Chandigarh, indoor games, outdoor sports and recreational activities contribute to a more engaging and well-rounded student experience.'] },
      { heading: 'Helping Students Grow Beyond the Classroom', img: `${UP}/2025/12/cp-sports-image-1536x864.jpg`, text: ['Every student has different interests, strengths and abilities. Through varied sports and recreational opportunities, we encourage students to explore their potential, develop new interests and become more confident individuals.', 'At CP Gurukul Chandigarh, we aim to nurture not just academic achievers, but active, confident and well-rounded individuals.'] },
    ],
    faqs: [
      ['What indoor sports facilities are available at CP Gurukul Chandigarh?', 'Students can participate in table tennis, carrom, chess, skating, lawn tennis and badminton.'],
      ['Does CP Gurukul Chandigarh have a swimming pool?', 'Yes. The campus features a swimming pool with a lush landscape setting for sports and recreation.'],
      ['Which outdoor sports are available at the campus?', 'Outdoor sports include football, basketball, volleyball, lawn tennis, cricket and gymnastics.'],
      ["Why are sports important in a student's school life?", 'Sports help students develop physical fitness, concentration, teamwork, discipline and confidence.'],
      ['Do students get opportunities to participate in indoor and outdoor activities?', 'Yes. Students have access to a range of indoor games, outdoor sports and recreational activities as part of their school experience.'],
      ['How do sports contribute to overall student development?', 'Sports encourage students to develop physical abilities, communication, leadership, resilience and a positive attitude.'],
    ],
  },

  yoga: {
    seo: { title: 'Yoga & Physical Training (PT)', description: 'Yoga and Physical Training at CP Gurukul Chandigarh — building strong bodies and focused minds through flexibility, mindful breathing, strength, stamina and discipline.' },
    title: 'Yoga & Physical Training – Building Strong Bodies and Focused Minds',
    hero: `${UP}/2025/09/yoga.jpg`,
    intro: {
      heading: 'A Healthy Mind Begins with a Healthy Body',
      text: [
        "At CP Gurukul Chandigarh, we believe that a healthy body and a focused mind are essential for a student's overall growth. Through yoga and physical training, we encourage students to develop fitness, flexibility, concentration and self-discipline.",
        "Academic excellence is important, but a student's development also depends on physical fitness and mental well-being.",
        'At CP Gurukul Chandigarh, yoga and physical training are an integral part of a balanced student experience. These activities encourage students to stay active, improve their physical abilities and develop habits that support a healthier lifestyle.',
        'Our focus is to help students become physically stronger, mentally refreshed and more confident in their everyday lives.',
      ],
      img: `${UP}/2025/09/yoga.jpg`,
    },
    pillars: {
      eyebrow: 'Why it matters',
      heading: 'Benefits of Yoga & Physical Training',
      items: [
        { t: 'Physical Fitness', d: 'Regular physical activity helps students improve stamina, strength, flexibility and overall fitness.' },
        { t: 'Mental Well-being', d: 'Yoga and breathing exercises encourage relaxation, emotional balance and a calm mindset.' },
        { t: 'Better Concentration', d: 'Mindful activities help students improve focus and stay attentive in their academic routine.' },
        { t: 'Discipline & Consistency', d: 'Following a regular fitness routine develops self-discipline, commitment and healthy habits.' },
      ],
    },
    blocks: [
      {
        eyebrow: 'Yoga Sessions', heading: 'Find Balance Through Yoga', img: `${UP}/2025/10/square-mobile-wellness-beyond-academics-yoga-scaled.jpg`,
        text: ['Yoga encourages students to connect their physical and mental well-being through movement, breathing and mindfulness.', 'At CP Gurukul Chandigarh, yoga activities provide students with an opportunity to slow down, refresh their minds and develop greater awareness of their bodies.'],
        listLabel: 'Key Benefits of Yoga:',
        list: [
          ['Improved Flexibility', 'Helps develop better movement and body flexibility.'],
          ['Better Posture', 'Encourages body awareness and proper posture.'],
          ['Stress Management', 'Supports relaxation and emotional well-being.'],
          ['Mindful Breathing', 'Encourages calmness and better control over breathing.'],
          ['Improved Focus', 'Helps students develop concentration and mental clarity.'],
        ],
        closing: 'Yoga promotes a balanced approach to student life, helping students feel refreshed and prepared for their daily activities.',
      },
      {
        eyebrow: 'Physical Training (PT)', heading: 'Stay Active and Build Strength Along With Academics', img: `${UP}/2025/12/cp-sports-image-1536x864.jpg`,
        text: ['Physical Training (PT) encourages students to maintain an active lifestyle through structured physical activities and exercise routines.', 'At CP Gurukul Chandigarh, PT activities are aimed at developing physical strength, endurance, coordination and an understanding of the importance of regular exercise.'],
        listLabel: 'Key Benefits of Physical Training:',
        list: [
          ['Strength & Stamina', 'Helps students build physical endurance and strength.'],
          ['Agility & Coordination', 'Encourages better body movement and coordination.'],
          ['Active Lifestyle', 'Develops healthy habits through regular physical activity.'],
          ['Team Spirit', 'Group activities encourage cooperation and participation.'],
          ['Self-Discipline', 'Builds consistency, responsibility and commitment.'],
        ],
      },
    ],
    lessons: {
      heading: 'Developing Confidence Beyond the Classroom',
      text: 'Yoga and physical training are not just about exercise. They also help students develop qualities that support their growth in everyday life.',
      items: [
        ['Confidence', 'Becoming more comfortable with physical challenges and personal progress.'],
        ['Discipline', 'Learning the value of consistency and regular practice.'],
        ['Patience', 'Understanding that strength, flexibility and improvement develop over time.'],
        ['Focus', 'Building awareness and concentration through mindful activities.'],
        ['Positive Habits', 'Developing a routine that supports long-term health and well-being.'],
      ],
    },
    notes: [
      { heading: 'Supporting Academic Performance Through Physical Well-being', img: `${UP}/2026/10/facilities/aerobic-hall.webp`, text: ["A student's day involves learning, problem-solving, practice and preparation. Regular physical activity provides an important balance to these academic responsibilities.", 'Yoga and PT give students opportunities to stay active, refresh their minds and develop the discipline required to maintain a healthy daily routine.', 'At CP Gurukul Chandigarh, we encourage students to give importance to both academic learning and physical well-being.'] },
      { heading: 'A Balanced Approach to Student Development', img: `${UP}/2026/10/facilities/fitness-center.webp`, text: ["At CP Gurukul Chandigarh, we believe that education should nurture every aspect of a student's personality.", 'Along with classroom education and integrated competitive exam preparation, students are encouraged to participate in activities that support their physical and mental development.', 'Yoga and PT contribute to a balanced school environment where students can learn, stay active and grow with confidence.'] },
    ],
    why: {
      heading: 'Why Choose CP Gurukul Chandigarh for Holistic Development?',
      items: [
        'A learning environment that values physical fitness alongside academics.',
        'Opportunities to participate in yoga and physical training.',
        'Focus on discipline, concentration and healthy habits.',
        'Activities that support physical and mental well-being.',
        'An approach to education that encourages all-round student development.',
      ],
    },
    faqs: [
      ['Does CP Gurukul Chandigarh offer yoga activities for students?', "Yes. Yoga is included among the activities that support students' physical fitness, flexibility, concentration and mental well-being."],
      ['What is the importance of Physical Training (PT) in school?', 'PT helps students develop strength, stamina, coordination, discipline and an active lifestyle.'],
      ['How does yoga benefit students?', 'Yoga encourages flexibility, body awareness, mindful breathing, relaxation and concentration.'],
      ['How do yoga and PT support academic life?', 'Physical activity provides a healthy balance to academic routines and can help students feel refreshed and focused.'],
      ['Why are physical activities important for overall student development?', 'They help students develop healthy habits, confidence, discipline and a positive approach towards challenges.'],
    ],
  },
};

function ActivityPage({ d }) {
  return (
    <>
      <Seo title={d.seo.title} description={d.seo.description} />
      <PageHero title={d.title} crumbs={CAMPUS_LIFE} lede={d.lede} image={d.hero} />

      {/* Intro */}
      <section className="section">
        <div className="wrap split">
          <Reveal className="split-media" y={40}><img src={d.intro.img} alt={d.title} loading="lazy" /></Reveal>
          <Reveal className="text-col">
            <h2 className="ac-h2">{d.intro.heading}</h2>
            {d.intro.text.map((t, i) => <p key={i}>{t}</p>)}
          </Reveal>
        </div>
      </section>

      {/* Pillars / benefits */}
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead center eyebrow={d.pillars.eyebrow} title={d.pillars.heading} lede={d.pillars.text} />
          <div className="ac-pillars">
            {d.pillars.items.map((p, i) => (
              <Reveal key={p.t} className="ac-pillar" delay={i * .06}>
                <span className="ac-num">{String(i + 1).padStart(2, '0')}</span>
                <b>{p.t}</b>
                {p.d && <small>{p.d}</small>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      {d.blocks.map((b, bi) => (
        <section className={`section ${bi % 2 ? 'bg-white' : ''}`} key={b.heading}>
          <div className={`wrap split ${bi % 2 ? 'rev' : ''}`}>
            <Reveal className="split-media" y={40}><img src={b.img} alt={b.eyebrow || b.heading} loading="lazy" /></Reveal>
            <Reveal className="text-col">
              {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
              <h2 className="ac-h2">{b.heading}</h2>
              {b.text.map((t, i) => <p key={i}>{t}</p>)}
              <p className="ac-label">{b.listLabel}</p>
              <ul className="ac-list">
                {b.list.map(([n, t]) => <li key={n}><CheckCircle2 /><span><b>{n}:</b> {t}</span></li>)}
              </ul>
              {b.closing && <p className="ac-closing">{b.closing}</p>}
            </Reveal>
          </div>
        </section>
      ))}

      {/* Life lessons */}
      <section className="section bg-ink ac-lessons">
        <div className="wrap">
          <SectionHead center title={d.lessons.heading} lede={d.lessons.text} />
          <div className="ac-lesson-grid">
            {d.lessons.items.map(([t, s], i) => (
              <Reveal key={t} className="ac-lesson" delay={i * .05}><b>{t}</b><small>{s}</small></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Balance notes */}
      <section className="section">
        <div className="wrap ac-notes">
          {d.notes.map((n, i) => (
            <Reveal key={n.heading} className="ac-note" delay={i * .08}>
              <img src={n.img} alt="" loading="lazy" />
              <div>
                <h3>{n.heading}</h3>
                {n.text.map((t, k) => <p key={k}>{t}</p>)}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {d.why && (
        <section className="section bg-white">
          <div className="wrap">
            <SectionHead center title={d.why.heading} />
            <Reveal className="ac-why">
              {d.why.items.map(t => <div key={t}><CheckCircle2 /><span>{t}</span></div>)}
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className={`section ${d.why ? '' : 'bg-white'}`}>
        <div className="wrap" style={{ maxWidth: 900 }}>
          <SectionHead center eyebrow="FAQ" title="Frequently Asked Questions" />
          <Faq items={d.faqs.map(([q, a]) => ({ q, a }))} />
          <div className="ac-ctas">
            <button className="btn gold" onClick={openEnquiry}>Apply Now <ArrowRight /></button>
            <a className="btn ghost" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Ask on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}

export const SportsPage = () => <ActivityPage d={PAGES.sports} />;
export const YogaPage = () => <ActivityPage d={PAGES.yoga} />;
