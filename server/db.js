import pg from 'pg';

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

// Railway's internal network needs no SSL; public proxy URLs (used for local dev) do.
const internal = /\.railway\.internal/.test(DATABASE_URL);
export const pool = new pg.Pool({
  connectionString: DATABASE_URL,
  ssl: internal || /localhost|127\.0\.0\.1/.test(DATABASE_URL) ? false : { rejectUnauthorized: false },
  max: Number(process.env.PG_POOL_MAX) || 10, // local PGlite test DB allows one connection: PG_POOL_MAX=1
});

export const q = (text, params) => pool.query(text, params);

export const STATUSES = ['new', 'contacted', 'follow_up', 'visit_scheduled', 'visited', 'admitted', 'not_interested'];
export const STATUS_LABELS = { new: 'New', contacted: 'Contacted', follow_up: 'Follow-up', visit_scheduled: 'Visit scheduled', visited: 'Visited', admitted: 'Admitted', not_interested: 'Not interested' };
export const SOURCES = ['popup', 'contact-form', 'footer-updates', 'other'];

export async function migrate() {
  await q(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'counsellor' CHECK (role IN ('admin','counsellor')),
      active        BOOLEAN NOT NULL DEFAULT TRUE,
      last_login_at TIMESTAMPTZ,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS leads (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      phone         TEXT NOT NULL,
      email         TEXT,
      student_class TEXT,
      programs      TEXT[] NOT NULL DEFAULT '{}',
      message       TEXT,
      source        TEXT NOT NULL DEFAULT 'other',
      page          TEXT,
      utm           JSONB NOT NULL DEFAULT '{}',
      status        TEXT NOT NULL DEFAULT 'new',
      assigned_to   INTEGER REFERENCES users(id) ON DELETE SET NULL,
      follow_up_at  DATE,
      ip            TEXT,
      user_agent    TEXT,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);
    CREATE INDEX IF NOT EXISTS leads_phone_idx ON leads (phone);
    CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
    CREATE TABLE IF NOT EXISTS lead_notes (
      id         SERIAL PRIMARY KEY,
      lead_id    INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
      user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
      kind       TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note','system')),
      body       TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS lead_notes_lead_idx ON lead_notes (lead_id, created_at);
  `);
}
