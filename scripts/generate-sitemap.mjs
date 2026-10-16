// Generates public/sitemap.xml + public/robots.txt from src/data/sitemap.js and the blog posts in pages.json.
// Runs automatically before `npm run build` (see "prebuild" in package.json).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { sitemapGroups, SITE_URL } from '../src/data/sitemap.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(readFileSync(join(root, 'src/data/pages.json'), 'utf8'));
const today = new Date().toISOString().slice(0, 10);

const urls = sitemapGroups.flatMap(g => g.links).map(l => ({ loc: l.to, priority: l.priority ?? 0.5, freq: l.freq ?? 'monthly', lastmod: today }));
for (const [slug, p] of Object.entries(pages)) {
  if (p.kind === 'post') urls.push({ loc: `/${slug}/`, priority: 0.7, freq: 'monthly', lastmod: (p.date || today).slice(0, 10) });
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${esc(SITE_URL + u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(root, 'public/sitemap.xml'), xml);
writeFileSync(join(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`sitemap.xml: ${urls.length} URLs`);
