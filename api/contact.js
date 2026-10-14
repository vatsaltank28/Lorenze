/* Vercel serverless function: POST /api/contact
   Emails a website brief to Devereux Edits via Resend (https://resend.com).
   Required env vars (Vercel → Project → Settings → Environment Variables):
     RESEND_API_KEY      secret API key from Resend — never put it in browser code
   Optional:
     CONTACT_TO_EMAIL    inbox that receives briefs (default devereuxedits.01@gmail.com)
     CONTACT_FROM_EMAIL  verified sender (default "Devereux Edits <onboarding@resend.dev>",
                         which only delivers to the email the Resend account was created with) */

const LIMITS = { name: 100, contact: 200, method: 20, channel: 300, brief: 5000 };
const hits = new Map(); // best-effort per-instance rate limit: 5 sends / 10 min / IP
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'method not allowed' }); }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now(), recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 5) return res.status(429).json({ ok: false, error: 'too many messages — please wait a few minutes' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return res.status(400).json({ ok: false, error: 'invalid request' });

  // honeypot: bots fill the hidden "website" field; pretend success, send nothing
  if (body.website) return res.status(200).json({ ok: true });

  const d = {};
  for (const [k, max] of Object.entries(LIMITS)) {
    let v = typeof body[k] === 'string' ? body[k].trim() : '';
    if (k !== 'brief') v = v.replace(/[\r\n]+/g, ' '); // no line breaks in subject/header fields
    if (v.length > max) return res.status(400).json({ ok: false, error: `${k} is too long` });
    d[k] = v;
  }
  if (!d.name || !d.contact || !d.brief) return res.status(400).json({ ok: false, error: 'name, contact and brief are required' });

  const key = process.env.RESEND_API_KEY;
  if (!key) { console.error('[contact] RESEND_API_KEY is not set'); return res.status(503).json({ ok: false, error: 'website messaging is not set up yet' }); }

  recent.push(now); hits.set(ip, recent);
  const to = process.env.CONTACT_TO_EMAIL || 'devereuxedits.01@gmail.com';
  const from = process.env.CONTACT_FROM_EMAIL || 'Devereux Edits <onboarding@resend.dev>';
  const html = `<h2>New project brief from the website</h2>
    <p><b>Name:</b> ${esc(d.name)}<br><b>Reply via ${esc(d.method || '—')}:</b> ${esc(d.contact)}${d.channel ? `<br><b>Channel:</b> ${esc(d.channel)}` : ''}</p>
    <pre style="white-space:pre-wrap;font-family:inherit">${esc(d.brief)}</pre>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to: [to], subject: `New brief from ${d.name} (${d.method || 'website'})`, html,
        ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.contact) ? { reply_to: d.contact } : {}),
      }),
    });
    if (!r.ok) { console.error('[contact] Resend error', r.status); return res.status(502).json({ ok: false, error: 'email delivery failed' }); }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('[contact] network error', e.name);
    return res.status(502).json({ ok: false, error: 'email delivery failed' });
  }
};
