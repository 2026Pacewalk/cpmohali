// Saves enquiries from any site form to /api/leads (stored in Postgres, managed in /admin).
const UTM_KEY = 'cpg-utm';
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

/** Call once on app start: remembers the campaign a visitor arrived from for this browser session. */
export function captureUtm() {
  try {
    const p = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(UTM_PARAMS.filter(k => p.get(k)).map(k => [k, p.get(k)]));
    if (Object.keys(found).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(found));
  } catch { /* storage blocked */ }
}

function readUtm() {
  try { return JSON.parse(sessionStorage.getItem(UTM_KEY) || '{}'); } catch { return {}; }
}

/**
 * Fire-and-forget: does not block the WhatsApp window that opens in the same click
 * (browsers block window.open after an await). keepalive lets the request finish even if the tab changes.
 * @param {{name?:string, phone:string, email?:string, studentClass?:string, programs?:string[], message?:string, source:string, website?:string}} lead
 */
export function submitLead(lead) {
  const body = JSON.stringify({ ...lead, page: window.location.pathname, utm: readUtm() });
  return fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    .then(r => r.ok)
    .catch(() => false);
}
