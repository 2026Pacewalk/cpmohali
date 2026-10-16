import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import EnquiryPopup from './EnquiryPopup';
import { submitLead } from '../lib/leads';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Phone, Mail, MapPin, ArrowUp, FileText, Award, ShieldCheck, Trees, Building2 } from 'lucide-react';
import { site, footerLinks, tel } from '../data/site';
import { socialIcon, WhatsApp } from './Icons';

const exploreLinks = [
  { label: 'The Gurukul Concept', to: '/cp-gurukul/' },
  { label: 'Integrated coaching', to: '/integrated-coaching/' },
  { label: 'Residential Facilities', to: '/hostel-facilities/' },
  { label: 'Girls boarding school', to: '/best-boarding-schools-for-girls-in-mohali/' },
  { label: 'Day in Gurukul', to: '/day-in-cpgurukul/' },
  { label: 'Admission Guidelines', to: '/admission-guidelines/' },
  { label: 'Photo Gallery', to: '/photo-gallery/' },
  { label: 'Video Gallery', to: '/video-gallery/' },
];

function UpdatesSignup() {
  const [phone, setPhone] = useState('');
  const submit = e => {
    e.preventDefault();
    submitLead({ phone, source: 'footer-updates', message: 'Wants admission & scholarship updates on WhatsApp' });
    const text = encodeURIComponent(`Hello Career Point Gurukul, please send me admission & scholarship updates. My number: ${phone}`);
    window.open(`https://wa.me/${site.whatsappNumber}?text=${text}`, '_blank', 'noopener');
  };
  return (
    <div className="f-news">
      <form onSubmit={submit}>
        <label htmlFor="f-phone" className="sr-only">Mobile number</label>
        <input id="f-phone" type="tel" required pattern="[0-9+\- ]{10,15}" placeholder="Your mobile number" value={phone} onChange={e => setPhone(e.target.value)} />
        <button type="submit"><WhatsApp /> Get updates</button>
      </form>
      <small>Admission dates &amp; CP Star Scholarship alerts on WhatsApp.</small>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <motion.div className="f-cta" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="pill"><i />Admissions open</span>
            <h2>Dream Big. Study Smart. Succeed.</h2>
            <p>Join Career Point Gurukul and open the doors to your future.</p>
          </div>
          <div className="actions">
            <a className="btn white" href={site.wa.register} target="_blank" rel="noreferrer"><WhatsApp /> Register now</a>
            <a className="btn outline" href={tel(site.phones[0])}><Phone /> {site.phones[0]}</a>
          </div>
        </motion.div>

        <div className="f-trust">
          <div><Award /><span><b>Since 1993</b><small>Legacy of Career Point, Kota</small></span></div>
          <div><ShieldCheck /><span><b>CBSE Affiliated</b><small>Affiliation No: 1631077</small></span></div>
          <div><Trees /><span><b>15-Acre Campus</b><small>Lush green &amp; pollution-free</small></span></div>
          <div><Building2 /><span><b>Separate AC Hostels</b><small>For boys &amp; girls, 24×7 security</small></span></div>
        </div>

        <div className="footer-grid">
          <div>
            <Link to="/" className="flogo"><img src={site.logo} alt="Career Point Gurukul" /></Link>
            <h4>About Us</h4>
            <p>{site.about}</p>
            <div className="f-socials">
              {site.socials.map(s => { const I = socialIcon[s.name]; return <a key={s.name} data-n={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><I /></a>; })}
            </div>
          </div>
          <div>
            <h4>Important Links</h4>
            <ul>{footerLinks.map(l => <li key={l.to}><Link to={l.to}><ChevronRight />{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>{exploreLinks.map(l => <li key={l.to}><Link to={l.to}><ChevronRight />{l.label}</Link></li>)}</ul>
          </div>
          <div>
            <h4>Reach Us</h4>
            <div className="f-contact">
              <a href={tel(site.phones[0])}><Phone /><span><small>Phone</small>{site.phones.join(' | ')}</span></a>
              <a href={`mailto:${site.email}`}><Mail /><span><small>Email</small>{site.email}</span></a>
              <a href={site.mapLink} target="_blank" rel="noreferrer"><MapPin /><span><small>Campus</small>{site.address}</span></a>
            </div>
            <UpdatesSignup />
            <div className="f-app">
              <a className="gp" href={site.playStore} target="_blank" rel="noreferrer" aria-label="Get it on Google Play"><img src="/images/google-play-badge.png" alt="Get it on Google Play" width="534" height="160" /></a>
              <a className="fee" href={site.feePdf} target="_blank" rel="noreferrer"><FileText /> Fee Structure</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Copyright © {new Date().getFullYear()} Career Point Gurukul, Chandigarh. All rights reserved. · Developed by <a href="https://pacewalk.com" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>PACEWALK</a></span>
          <nav aria-label="Legal">
            <Link to="/privacy-policy/">Privacy Policy</Link>
            <Link to="/certificates/">Certificates</Link>
            <Link to="/contact/">Contact</Link>
            <Link to="/sitemap/">Sitemap</Link>
          </nav>
          <button className="top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}><ArrowUp /> Back to top</button>
        </div>
      </div>
    </footer>
  );
}

function Floating() {
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 800);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <>
      <div className="fab">
        <a className="call" href={tel(site.phones[1])} aria-label="Call admissions"><Phone /></a>
        <a className="wa" href={site.wa.register} target="_blank" rel="noreferrer" aria-label="WhatsApp admissions"><WhatsApp /></a>
      </div>
      <AnimatePresence>
        {top && <motion.button className="to-top" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ArrowUp /></motion.button>}
      </AnimatePresence>
    </>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return (
    <>
      <a href="#main" className="skip">Skip to main content</a>
      <motion.div className="progress" style={{ scaleX }} />
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <Floating />
      <EnquiryPopup />
    </>
  );
}
