// Global site data — identical to the live cpmohali.in header/footer
export const UP = '/wp-content/uploads';

export const site = {
  name: 'Career Point Gurukul',
  tagline: 'A Unit of Legendary Career Point, Kota',
  logo: `${UP}/2023/07/Screenshot-2025-09-14-213813.png`,
  footerLogo: `${UP}/2023/07/footer-New-Career-Point-Logo-For-Website--scaled.jpg`,
  icon: `${UP}/2025/08/New-Career-Point-Logo-Icon-.png`,
  affiliation: 'CBSE Affiliation No: 1631077',
  phones: ['+91-7087228882', '+91-7087228881'],
  email: 'hellocpgurukulmohali@gmail.com',
  address: 'Landra-Banur Road NH 16, Vill, Tangori, near Chandigarh International Airport, Mohali, Punjab 140601',
  mapEmbed: 'https://maps.google.com/maps?q=Career%20Point%20Gurukul%2C%20Mohali%20-%20Best%20Boarding%20School&t=m&z=13&output=embed&iwloc=near',
  mapLink: 'https://share.google/ZrIjOyE5P9m5052wU',
  whatsappNumber: '917087228881',
  feePdf: `${UP}/2025/11/CP-NEW-New-Fee-Structure-PDF-.pdf`,
  playStore: 'https://play.google.com/store/apps/details?id=co.shield.shesw&hl=en&gl=US&pli=1',
  wa: {
    register: 'https://wa.link/kvd3td',
    tour: 'https://wa.link/ht8oio',
    next: 'https://wa.link/whfkpq',
    scholarship: 'https://wa.link/9qlhf2',
    principal: 'https://wa.link/23egu0',
  },
  socials: [
    { name: 'Facebook', href: 'https://www.facebook.com/cpmohali' },
    { name: 'X', href: 'https://x.com/CareerGuru52178' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/career-point-gurukul-mohali-a12257322/' },
    { name: 'YouTube', href: 'https://youtube.com/@careerpointgurukulchandigarh' },
    { name: 'Instagram', href: 'https://www.instagram.com/careerpointgurukulmohali/' },
  ],
  about:
    'Career Point Gurukul, Chandigarh – Punjab’s No.1 Residential School with Coaching for JEE | NEET | NDA. CP Gurukul is a top-rated institute offering integrated coaching for IIT-JEE, NEET, and NDA with expert Kota faculty and a distraction-free campus. Spread across, the school ensures holistic growth by combining academics, personal development, and career-focused training. Our commitment has delivered outstanding competitive exam results year after year.',
};

export const nav = [
  { label: 'Home', to: '/' },
  {
    label: 'About Us', to: '/about-us/',
    children: [
      { label: 'Chairman’s Message', to: '/chairman/' },
      { label: 'Managing Director’s Message', to: '/director-message/' },
      { label: 'Principal’s Message', to: '/principal-message/' },
      { label: 'About Gurukul', to: '/about-gurukul/' },
      { label: 'Parent’s Reviews', to: '/parents-reviews/' },
      { label: 'Why Career Point', to: '/why-career-point/' },
    ],
  },
  {
    label: 'CP-Gurukal Concept',
    children: [
      { label: 'The Gurukul Concept', to: '/cp-gurukul/' },
      { label: 'Excellent School Education', to: '/school-2/' },
      { label: 'Integrated coaching', to: '/integrated-coaching/' },
      { label: 'Residential Facilities', to: '/hostel-facilities/' },
      { label: 'Life Skill Development', to: '/life-skill-development/' },
      { label: 'Girls boarding school', to: '/best-boarding-schools-for-girls-in-mohali/' },
    ],
  },
  {
    label: 'Campus Life',
    children: [
      { label: 'Hostel', to: '/hostel/' },
      { label: 'Student Life', to: '/facility-copy/' },
      { label: 'Technology Support', to: '/technology-support/' },
      { label: 'Facilities at Gurukul', to: '/facilities-at-gurukul-2/' },
      { label: 'Day in Gurukul', to: '/day-in-cpgurukul/' },
    ],
  },
  {
    label: 'Media',
    children: [
      { label: 'Photo Gallery', to: '/photo-gallery/' },
      { label: 'Video Gallery', to: '/video-gallery/' },
    ],
  },
  { label: 'Admission Guidelines', to: '/admission-guidelines/' },
  { label: 'Fee Structure', href: `${UP}/2025/11/CP-NEW-New-Fee-Structure-PDF-.pdf` },
];

export const footerLinks = [
  { label: 'Blog', to: '/blog/' },
  { label: 'About Us', to: '/about-us/' },
  { label: 'Contact Us', to: '/contact/' },
  { label: 'Certificates', to: '/certificates/' },
  { label: 'Privacy Policy', to: '/privacy-policy/' },
  { label: "Director's Desk", to: '/directors-desk/' },
  { label: 'Why Career Point Gurukul', to: '/why-career-point-2/' },
  { label: 'Sitemap', to: '/sitemap/' },
];

export const tel = p => 'tel:' + p.replace(/[^+\d]/g, '');
