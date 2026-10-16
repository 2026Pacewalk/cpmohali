// Small fetch wrapper for the admin panel (same-origin cookie session).
export class ApiError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data;
}

export const STATUS = {
  new: { label: 'New', tone: 'blue' },
  contacted: { label: 'Contacted', tone: 'indigo' },
  follow_up: { label: 'Follow-up', tone: 'amber' },
  visit_scheduled: { label: 'Visit scheduled', tone: 'purple' },
  visited: { label: 'Visited', tone: 'teal' },
  admitted: { label: 'Admitted', tone: 'green' },
  not_interested: { label: 'Not interested', tone: 'grey' },
};
export const SOURCE = {
  popup: 'Website popup',
  'contact-form': 'Contact form',
  'footer-updates': 'Footer WhatsApp updates',
  other: 'Other',
};

export const fmtDateTime = d => new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
export const fmtDay = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const today = () => new Date(Date.now() + 5.5 * 3600e3).toISOString().slice(0, 10); // IST date
export const waLink = (phone, name) => `https://wa.me/91${phone}?text=${encodeURIComponent(`Hello${name && name !== 'Website visitor' ? ' ' + name : ''}, this is Career Point Gurukul Mohali regarding your admission enquiry.`)}`;
