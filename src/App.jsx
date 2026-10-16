import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Generic from './pages/Generic';
import LifeSkill from './pages/LifeSkill';
import { Contact, PhotoGallery, VideoGallery, DayInGurukul, Certificates, Message, Reviews, Category, NotFound } from './pages/Special';
import Blog from './pages/Blog';
import Post from './pages/Post';
import Sitemap from './pages/Sitemap';
import { posts } from './components/ui';

const ABOUT = [{ label: 'About Us', to: '/about-us/' }];
const CONCEPT = [{ label: 'CP-Gurukul Concept', to: '/cp-gurukul/' }];
const CAMPUS = [{ label: 'Campus Life' }];

// Every slug from the live cpmohali.in sitemap + menu, mapped to its content.
const generic = [
  ['about-us', 'about-us', [], { contact: true }],
  ['about-gurukul', 'about-gurukul', ABOUT, { contact: true }],
  ['why-career-point-2', 'why-career-point-2', ABOUT, { contact: true }],
  ['why-career-point', 'why-career-point-2', ABOUT, { contact: true }],
  ['cp-gurukul', 'cp-gurukul', [], { contact: true }],
  ['school-2', 'school-2', CONCEPT, { contact: true }],
  ['integrated-coaching', 'integrated-coaching', CONCEPT, { contact: true }],
  ['integrated-coaching-duplicate-7654', 'integrated-coaching-duplicate-7654', CONCEPT, { title: 'Career Point Gurukul: Best Integrated Coaching School In India' }],
  ['hostel-facilities', 'hostel-facilities-duplicate-7655', CONCEPT, {}],
  ['hostel-facilities-duplicate-7655', 'hostel-facilities-duplicate-7655', CONCEPT, {}],
  ['best-boarding-schools-for-girls-in-mohali', 'girls-boarding-school-2', CONCEPT, {}],
  ['girls-boarding-school-2', 'girls-boarding-school-2', CONCEPT, {}],
  ['hostel', 'hostel', CAMPUS, { contact: true }],
  ['facility-copy', 'facility-copy', CAMPUS, { contact: true, title: 'Student Life' }],
  ['technology-support', 'technology-support', CAMPUS, { contact: true }],
  ['facility', 'facility', CAMPUS, { contact: true }],
  ['facilities-at-gurukul-2', 'facility', CAMPUS, { contact: true }],
  ['admission-guidelines', 'admission-guidelines', [], { contact: true }],
  ['clat-ipmat', 'clat-ipmat', [], { contact: true }],
  ['privacy-policy', 'privacy-policy', [], { prose: true, title: 'Privacy Policy' }],
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="home-2" element={<Navigate to="/" replace />} />
        {generic.map(([path, slug, crumbs, opts]) => (
          <Route key={path} path={`${path}/*`} element={<Generic key={path} slug={slug} crumbs={crumbs} {...opts} />} />
        ))}
        <Route path="life-skill-development/*" element={<LifeSkill />} />
        <Route path="chairman/*" element={<Message key="c" slug="chairman" />} />
        <Route path="director-message/*" element={<Message key="d" slug="director-message" />} />
        <Route path="directors-desk/*" element={<Message key="dd" slug="director-message" />} />
        <Route path="principal-message/*" element={<Message key="p" slug="principal-message" />} />
        <Route path="parents-reviews/*" element={<Reviews />} />
        <Route path="contact/*" element={<Contact />} />
        <Route path="photo-gallery/*" element={<PhotoGallery />} />
        <Route path="video-gallery/*" element={<VideoGallery />} />
        <Route path="day-in-cpgurukul/*" element={<DayInGurukul />} />
        <Route path="certificates/*" element={<Certificates />} />
        <Route path="sitemap/*" element={<Sitemap />} />
        <Route path="blog/*" element={<Blog />} />
        <Route path="category/:cat/*" element={<Category />} />
        <Route path="community-2/*" element={<Navigate to="/" replace />} />
        {posts.map(p => <Route key={p.slug} path={`${p.slug}/*`} element={<Post key={p.slug} slug={p.slug} />} />)}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
