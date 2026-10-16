# Career Point Gurukul Mohali — React rebuild of cpmohali.in

Vite + React 19 + React Router + Framer Motion. Content, images, logo, favicon and URL slugs mirror the live WordPress site.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Where things live
- `src/data/pages.json` – every page/post's content, extracted from the WordPress REST API.
- `src/data/seo.json` – Yoast titles & meta descriptions per slug.
- `src/data/site.js` – phone, email, address, socials, WhatsApp links, menu, footer links.
- `public/wp-content/uploads/…` – all images/PDFs/videos at the **same paths** as the old site, so old media URLs keep working.
- `src/App.jsx` – route table (all original slugs + fixes for menu links that 404 on the live site).
- `src/components/Blocks.jsx` – renders page content, auto-detecting feature grids, cards, FAQs, galleries, splits.

## Sitemap
- HTML sitemap: `/sitemap/` (linked in the footer), with a "View XML Sitemap" button.
- `public/sitemap.xml` + `public/robots.txt` are generated from `src/data/sitemap.js` and the blog posts by `npm run sitemap`; this also runs automatically before `npm run build`. Add new pages to `src/data/sitemap.js`.

## Deploy
SPA fallbacks are included: `public/.htaccess` (Apache/cPanel), `public/_redirects` (Netlify), `vercel.json` (Vercel).
Note: 4 MP4 videos in `public/wp-content/uploads` total ~450 MB; compress them or host on YouTube before deploying to hosts with file-size limits (e.g. Vercel 100 MB).

## Forms
Enquiry / updates forms open WhatsApp pre-filled to +91 70872 28881 (no backend needed).
