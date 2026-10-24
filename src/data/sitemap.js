// Single source for the HTML sitemap page (/sitemap/) and public/sitemap.xml (scripts/generate-sitemap.mjs)
export const SITE_URL = 'https://cpmohali.in';

export const sitemapGroups = [
  {
    title: 'Main pages', icon: 'home',
    links: [
      { label: 'Home', to: '/', priority: 1.0, freq: 'weekly' },
      { label: 'About Us', to: '/about-us/', priority: 0.9 },
      { label: 'Admission Guidelines', to: '/admission-guidelines/', priority: 0.9 },
      { label: 'Contact Us', to: '/contact/', priority: 0.9 },
      { label: 'Certificates', to: '/certificates/', priority: 0.6 },
      { label: 'Blog', to: '/blog/', priority: 0.8, freq: 'weekly' },
      { label: 'Privacy Policy', to: '/privacy-policy/', priority: 0.3, freq: 'yearly' },
      { label: 'Sitemap', to: '/sitemap/', priority: 0.3 },
    ],
  },
  {
    title: 'About Us', icon: 'users',
    links: [
      { label: 'Chairman’s Message', to: '/chairman/', priority: 0.6 },
      { label: 'Managing Director’s Message', to: '/director-message/', priority: 0.6 },
      { label: 'Principal’s Message', to: '/principal-message/', priority: 0.6 },
      { label: 'About Gurukul', to: '/about-gurukul/', priority: 0.7 },
      { label: 'Parent’s Reviews', to: '/parents-reviews/', priority: 0.7 },
      { label: 'Why Career Point', to: '/why-career-point-2/', priority: 0.7 },
    ],
  },
  {
    title: 'CP-Gurukul Concept', icon: 'graduation',
    links: [
      { label: 'The Gurukul Concept', to: '/cp-gurukul/', priority: 0.8 },
      { label: 'Excellent School Education', to: '/school-2/', priority: 0.8 },
      { label: 'Integrated Coaching', to: '/integrated-coaching/', priority: 0.8 },
      { label: 'Residential Facilities', to: '/hostel-facilities/', priority: 0.8 },
      { label: 'Life Skill Development', to: '/life-skill-development/', priority: 0.7 },
      { label: 'Girls Boarding School', to: '/best-boarding-schools-for-girls-in-mohali/', priority: 0.8 },
      { label: 'CLAT / IPMAT', to: '/clat-ipmat/', priority: 0.6 },
      { label: 'CBT (Computer Based Test)', to: '/cbt-computer-based-test/', priority: 0.8 },
    ],
  },
  {
    title: 'Campus Life', icon: 'building',
    links: [
      { label: 'Hostel', to: '/hostel/', priority: 0.7 },
      { label: 'Student Life', to: '/facility-copy/', priority: 0.7 },
      { label: 'Technology Support', to: '/technology-support/', priority: 0.6 },
      { label: 'Facilities at Gurukul', to: '/facility/', priority: 0.7 },
      { label: 'A Day in Gurukul', to: '/day-in-cpgurukul/', priority: 0.7 },
    ],
  },
  {
    title: 'Media', icon: 'image',
    links: [
      { label: 'Photo Gallery', to: '/photo-gallery/', priority: 0.6, freq: 'weekly' },
      { label: 'Video Gallery', to: '/video-gallery/', priority: 0.6, freq: 'weekly' },
    ],
  },
  {
    title: 'Blog topics', icon: 'tag',
    links: [
      { label: 'Boarding School', to: '/category/boarding-school/', priority: 0.5 },
      { label: 'Boarding School vs Day School', to: '/category/boarding-school-vs-day-school/', priority: 0.5 },
    ],
  },
];
