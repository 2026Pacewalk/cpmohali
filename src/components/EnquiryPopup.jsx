import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Lock, Check, Phone, School, Target, Users, Trophy, Trees, ShieldCheck, Sparkles,
  BookOpenCheck, BedDouble, PartyPopper,
} from 'lucide-react';
import { site, tel, UP } from '../data/site';
import { WhatsApp } from './Icons';

/* Open from anywhere: window.dispatchEvent(new Event('open-enquiry')) */
export const openEnquiry = () => window.dispatchEvent(new Event('open-enquiry'));

const POSTER = `${UP}/2025/12/popup-img.jpeg`;
const CHIPS = [
  [School, 'Excellent School Education'],
  [Target, 'High Success Ratio'],
  [BookOpenCheck, 'Integrated Coaching by Experts from Kota'],
  [Users, 'Kota’s Expert Faculty'],
  [Trees, '14 Acre Lush Green Campus'],
  [BedDouble, 'Separate Hostels for Boys & Girls'],
  [ShieldCheck, 'Distraction-free Environment'],
  [Trophy, 'Holistic Growth'],
];
const CLASSES = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const DISMISS_KEY = 'cpg-enquiry-dismissed';
const SEEN_KEY = 'cpg-enquiry-seen';
const SKIP_PATHS = ['/contact/', '/privacy-policy/', '/sitemap/'];
const store = {
  get: (s, k) => { try { return s.getItem(k); } catch { return null; } },
  set: (s, k, v) => { try { s.setItem(k, v); } catch { /* private mode */ } },
};

export default function EnquiryPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0 details, 1 preferences, 2 done
  const [f, setF] = useState({ name: '', phone: '', cls: '' });
  const [touched, setTouched] = useState(false);
  const nameRef = useRef(null);

  const phoneOk = /^[6-9]\d{9}$/.test(f.phone);
  const nameOk = f.name.trim().length >= 2;

  const show = useCallback(() => {
    setOpen(true);
    store.set(sessionStorage, SEEN_KEY, '1');
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    if (step < 2) store.set(localStorage, DISMISS_KEY, String(Date.now()));
    setTimeout(() => { setStep(0); setTouched(false); }, 400);
  }, [step]);

  // Auto-open: after 7s, or on desktop exit-intent — once per session, not within 24h of a dismissal
  useEffect(() => {
    const dismissed = Number(store.get(localStorage, DISMISS_KEY) || 0);
    const eligible = () => !store.get(sessionStorage, SEEN_KEY) && Date.now() - dismissed > 864e5 && !SKIP_PATHS.includes(pathname);
    if (!eligible()) return;
    const t = setTimeout(() => eligible() && show(), 7000);
    const onLeave = e => { if (e.clientY <= 0 && eligible()) show(); };
    document.addEventListener('mouseout', onLeave);
    return () => { clearTimeout(t); document.removeEventListener('mouseout', onLeave); };
  }, [pathname, show]);

  // Manual open from buttons
  useEffect(() => {
    const h = () => show();
    window.addEventListener('open-enquiry', h);
    return () => window.removeEventListener('open-enquiry', h);
  }, [show]);

  // Esc to close, lock scroll, focus first field
  useEffect(() => {
    if (!open) return;
    const k = e => e.key === 'Escape' && close();
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => nameRef.current?.focus(), 350);
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; clearTimeout(t); };
  }, [open, close]);

  const up = k => e => setF({ ...f, [k]: k === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value });
  const submit = e => {
    e.preventDefault();
    setTouched(true);
    if (!nameOk || !phoneOk || !f.cls) return;
    const lines = [
      'Hello Career Point Gurukul, I would like a call back about admission.',
      `Student Name: ${f.name.trim()}`,
      `Mobile: +91 ${f.phone}`,
      `Currently Studying in: ${f.cls} Class`,
    ];
    window.open(`https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    setStep(2);
  };
  const resendHref = () => `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(`Hello Career Point Gurukul, please call back ${f.name.trim()} on +91 ${f.phone}.`)}`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="eq-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={close}>
          <motion.div className="eq" role="dialog" aria-modal="true" aria-labelledby="eq-title"
            initial={{ opacity: 0, y: 40, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: .97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }} onMouseDown={e => e.stopPropagation()}>
            <button className="eq-close" onClick={close} aria-label="Close"><X /></button>

            {/* Feature chips marquee */}
            <div className="eq-chips" aria-hidden>
              <div className="eq-chips-track">
                {[...CHIPS, ...CHIPS].map(([I, t], i) => <span key={i}><I />{t}</span>)}
              </div>
            </div>

            <div className="eq-body">
              {/* Poster side */}
              <div className="eq-art">
                <div className="eq-art-glow" />
                <motion.div className="eq-poster" initial={{ rotate: -6, y: 30, opacity: 0 }} animate={{ rotate: -3, y: 0, opacity: 1 }} transition={{ delay: .15, type: 'spring', damping: 18 }}>
                  <img src={POSTER} alt="Career Point Gurukul — Admission Open 2026, Residential School Chandigarh" />
                </motion.div>
                <motion.span className="eq-float f1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .45 }}><Sparkles size={14} /> Class 6th – 12th</motion.span>
                <motion.span className="eq-float f2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .6 }}><ShieldCheck size={14} /> CBSE Affiliated</motion.span>
                <motion.span className="eq-float f3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .75 }}><Users size={14} /> Boys &amp; Girls</motion.span>
              </div>

              {/* Form side */}
              <div className="eq-form">
                <AnimatePresence mode="wait">
                  {step < 2 ? (
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}>
                      <span className="eq-pill"><i />Admission Open 2026</span>
                      <h2 id="eq-title">Request a <em>Call</em></h2>
                      <p className="eq-sub">Share a few details — our admission counsellor will call you back.</p>

                          <form onSubmit={submit} noValidate>
                            <label className={`eq-field ${touched && !nameOk ? 'err' : ''}`}>
                              <span>Student Name</span>
                              <input ref={nameRef} value={f.name} onChange={up('name')} placeholder="e.g. Ankita Sharma" autoComplete="name" />
                              {touched && !nameOk && <small>Please enter the student’s name</small>}
                            </label>
                            <label className={`eq-field ${touched && !phoneOk ? 'err' : ''} ${phoneOk ? 'ok' : ''}`}>
                              <span>Mobile Number</span>
                              <div className="eq-phone">
                                <em>+91</em>
                                <input value={f.phone} onChange={up('phone')} inputMode="numeric" placeholder="10-digit mobile" autoComplete="tel-national" aria-describedby="eq-ph" />
                                {phoneOk && <Check className="eq-tick" />}
                              </div>
                              {touched && !phoneOk ? <small id="eq-ph">Enter a valid 10-digit Indian mobile number</small> : <small id="eq-ph" className="hint">{f.phone.length}/10 digits</small>}
                            </label>
                            <div className={`eq-group ${touched && !f.cls ? 'err' : ''}`}>
                              <span>Currently Studying in ?</span>
                              <div className="eq-chipset" role="radiogroup" aria-label="Current class">
                                {CLASSES.map(c => <button type="button" role="radio" aria-checked={f.cls === c} key={c} className={f.cls === c ? 'on' : ''} onClick={() => setF({ ...f, cls: c })}>{c}</button>)}
                              </div>
                              {touched && !f.cls && <small className="eq-err">Please choose the class</small>}
                            </div>
                            <button className="btn eq-next" type="submit"><WhatsApp /> Submit Enquiry</button>
                          </form>
                    </motion.div>
                  ) : (
                    <motion.div key="done" className="eq-done" initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }}>
                      <motion.span className="eq-done-ico" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12, delay: .1 }}><PartyPopper /></motion.span>
                      <h2>Thank you, {f.name.trim().split(' ')[0]}!</h2>
                      <p>Your enquiry is ready in WhatsApp — just tap <b>Send</b>. Our admission team will call you back on <b>+91 {f.phone}</b>.</p>
                      <div className="eq-done-actions">
                        <a className="btn" href={resendHref()} target="_blank" rel="noopener noreferrer"><WhatsApp /> Open WhatsApp again</a>
                        <a className="btn ghost" href={tel(site.phones[1])}><Phone /> Call {site.phones[1]}</a>
                      </div>
                      <button className="eq-link" onClick={close}>Continue browsing</button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="eq-secure"><Lock size={14} /> Your personal information is secure with us</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
