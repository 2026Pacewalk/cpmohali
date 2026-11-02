// Production server: serves the built React site (dist/) and the /api routes for lead management.
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { migrate } from './db.js';
import { ensureBootstrapAdmin } from './auth.js';
import api from './api.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST; // e.g. 127.0.0.1 behind Nginx on the VPS; unset = all interfaces (Railway)

const app = express();
app.set('trust proxy', true); // Railway sits behind a proxy: use X-Forwarded-For for req.ip
app.disable('x-powered-by');
app.use(compression());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.get('/healthz', (req, res) => res.json({ ok: true }));
app.use('/api', api);

if (fs.existsSync(DIST)) {
  // Hashed build assets never change
  app.use('/assets', express.static(path.join(DIST, 'assets'), { immutable: true, maxAge: '1y', fallthrough: false }));
  // Mirrored WordPress media keep their old URLs; missing files are real 404s
  app.use('/wp-content', express.static(path.join(DIST, 'wp-content'), { maxAge: '30d', fallthrough: false }));
  app.use(express.static(DIST, { index: false, maxAge: '1h' }));
  // Single-page app: every other GET route renders index.html
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(DIST, 'index.html'));
  });
}

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.status === 404 || err.statusCode === 404) return res.status(404).send('Not found');
  console.error(err);
  res.status(500).send('Server error');
});

await migrate();
await ensureBootstrapAdmin();
app.listen(PORT, HOST, () => console.log(`CP Gurukul server listening on ${HOST || ''}:${PORT}`));
