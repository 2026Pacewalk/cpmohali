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

## Lead management (/admin)
- Every site form (enquiry popup, contact form, footer WhatsApp updates) saves the lead to Postgres via `POST /api/leads`, then opens WhatsApp as before. Duplicates from the same phone within 30 minutes are merged; a honeypot field and rate limit block spam.
- Staff log in at **/admin**: dashboard, leads table (search, filters, status, assignment, follow-up dates, notes timeline, CSV export) and staff accounts.
- Roles: **admin** (manage staff, reset passwords, delete leads) and **counsellor** (work all leads).
- First admin is created on first start from `ADMIN_EMAIL` / `ADMIN_PASSWORD` (Railway variables on the `web` service). Change the password after first login under *My account*.
- Server: `server/` (Express + pg). Run locally with a `.env` (DATABASE_URL, SESSION_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PORT=8090): `npm run server` + `npm run dev` (Vite proxies /api to 8090).

## Sitemap
- HTML sitemap: `/sitemap/` (linked in the footer), with a "View XML Sitemap" button.
- `public/sitemap.xml` + `public/robots.txt` are generated from `src/data/sitemap.js` and the blog posts by `npm run sitemap`; this also runs automatically before `npm run build`. Add new pages to `src/data/sitemap.js`.

## Deploy
**Live on Railway:** https://web-production-d6d3b.up.railway.app (project `cpmohali-site`, service `web`).
Railway builds the `Dockerfile` (Vite build, then a Node server in `server/` that serves the site + API; Postgres is the `Postgres` service) from GitHub `2026Pacewalk/cpmohali-site`; every push to `main` redeploys automatically.

Other hosts: SPA fallbacks are included: `public/.htaccess` (Apache/cPanel), `public/_redirects` (Netlify), `vercel.json` (Vercel).
Videos are web-optimised 720p copies; the full-size 4K originals (and pre-optimisation images) are kept locally in `media-originals/`, which is not committed or deployed.

## Forms
Enquiry / updates forms open WhatsApp pre-filled to +91 70872 28881 (no backend needed).
