// Growth Blueprint: web server (no dependencies).
//   node server.mjs            -> http://127.0.0.1:3000
// Serves dist/, plus the JSON API used by the forms, the newsletter and the briefs shop.
// See README.md for configuration (CRM webhook, payments, download signing).
import http from 'node:http';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, appendFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { PRODUCTS, productBySlug, VAT_RATE } from './src/shop.mjs';
import { SESS, slotsForDate, localDate } from './src/sessions.mjs';
const qrcode = createRequire(import.meta.url)('./vendor/qrcode-generator.cjs');

const here = dirname(fileURLToPath(import.meta.url));
export const VERSIONS = { privacy: 'privacy-2026-3', marketing: 'marketing-2026-1', licence: 'licence-2026-1', sessions: 'sessions-2026-1' };
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.xml': 'application/xml' };

const b64u = (b) => Buffer.from(b).toString('base64url');
const sha256 = (s) => createHash('sha256').update(s).digest('hex');
const safeEq = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && timingSafeEqual(x, y); };
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

export function createApp(opts = {}) {
  const cfg = {
    siteDir: resolve(opts.siteDir || process.env.SITE_DIR || join(here, 'dist')),
    dataDir: resolve(opts.dataDir || process.env.DATA_DIR || join(here, 'data')),
    briefsDir: resolve(opts.briefsDir || process.env.BRIEFS_DIR || join(here, 'private', 'briefs')),
    crmUrl: opts.crmUrl ?? process.env.CRM_WEBHOOK_URL ?? '',
    crmSecret: opts.crmSecret ?? process.env.CRM_WEBHOOK_SECRET ?? '',
    demoPayments: opts.demoPayments ?? (process.env.DEMO_PAYMENTS ? process.env.DEMO_PAYMENTS === '1' : process.env.NODE_ENV !== 'production'),
    baseUrl: (opts.baseUrl ?? process.env.PUBLIC_BASE_URL ?? '').replace(/\/$/, ''),
    dlTtl: Number(opts.dlTtl ?? process.env.DOWNLOAD_TTL_SECONDS ?? 600),
    dlMax: Number(opts.dlMax ?? process.env.DOWNLOAD_MAX ?? 5),
    sellerVat: process.env.SELLER_VAT_NO || '[VAT number to be added]',
    sellerName: process.env.SELLER_NAME || 'Growth Blueprint',
    sellerCr: process.env.SELLER_CR_NO || '',
    sellerAddress: process.env.SELLER_ADDRESS || 'Office #303, Optima Tower, Al-Shatie District, Jeddah, Saudi Arabia',
    mailProvider: opts.mailProvider ?? process.env.MAIL_PROVIDER ?? '',       // 'resend' | 'webhook' | '' (outbox only)
    mailFrom: process.env.MAIL_FROM || '',
    mailKey: process.env.RESEND_API_KEY || '',
    mailWebhook: process.env.MAIL_WEBHOOK_URL || '',
    turnstileSecret: opts.turnstileSecret ?? process.env.TURNSTILE_SECRET_KEY ?? '',
    payProvider: opts.payProvider ?? process.env.PAYMENT_PROVIDER ?? '',          // '' (simulated or off) | 'moyasar' (hosted invoice page)
    payKey: opts.payKey ?? process.env.MOYASAR_SECRET_KEY ?? '',
    payApi: (opts.payApi ?? process.env.PAYMENT_API_BASE ?? 'https://api.moyasar.com/v1').replace(/\/$/, ''),
    sess: (() => { const o = opts.sess || {}, num = (v, d) => (Number.isFinite(Number(v)) && v !== '' && v != null ? Number(v) : d); return { ...SESS, ...o, plans: { single: { n: 1, price: num(o.single ?? process.env.SESSION_PRICE_SINGLE, SESS.plans.single.price) }, bundle: { n: 3, price: num(o.bundle ?? process.env.SESSION_PRICE_BUNDLE, SESS.plans.bundle.price) } }, blackout: (o.blackout || process.env.SESSION_BLACKOUT_DATES || '').toString().split(',').map((x) => x.trim()).filter(Boolean) }; })(),
    meetingUrl: process.env.MEETING_URL || '',
    adminToken: opts.adminToken ?? process.env.ADMIN_TOKEN ?? '',
    analyticsDomain: process.env.ANALYTICS_DOMAIN || '',
    trustProxy: opts.trustProxy ?? process.env.TRUST_PROXY === '1',
    rate: opts.rate ?? { form: [12, 3600e3], shop: [30, 3600e3], dl: [60, 3600e3], read: [240, 600e3] },
    crmRetryMs: opts.crmRetryMs ?? [1000, 3000, 9000]
  };
  mkdirSync(cfg.dataDir, { recursive: true });

  /* ---- secrets: env, else a random one persisted next to the data (never committed) ---- */
  const secretFile = join(cfg.dataDir, '.secret');
  let secret = opts.secret || process.env.DOWNLOAD_SIGNING_SECRET || '';
  if (!secret) {
    if (existsSync(secretFile)) secret = readFileSync(secretFile, 'utf8').trim();
    else { secret = randomBytes(32).toString('hex'); writeFileSync(secretFile, secret, { mode: 0o600 }); }
  }
  const salt = sha256('ip:' + secret).slice(0, 16);
  const sign = (s) => createHmac('sha256', secret).update(s).digest();

  /* ---- append-only JSONL storage ---- */
  const file = (n) => join(cfg.dataDir, n + '.jsonl');
  const append = (n, o) => appendFileSync(file(n), JSON.stringify(o) + '\n', { mode: 0o600 });
  const readAll = (n) => (existsSync(file(n)) ? readFileSync(file(n), 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []);
  const orders = new Map(); readAll('orders').forEach((o) => orders.set(o.id, o));
  const sess = new Map(); readAll('sessions').forEach((o) => sess.set(o.id, o));
  const saveSess = (o) => { sess.set(o.id, o); append('sessions', o); };
  const subs = new Map(); readAll('newsletter').forEach((s) => subs.set(s.emailHash, s));
  const usedNonces = new Set(readAll('downloads').map((d) => d.nonce));
  const now = () => Date.now();
  const iso = () => new Date().toISOString();
  const ref = (p) => `${p}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const hashEmail = (e) => sha256(e.toLowerCase());

  /* ---- outbound mail: written to an outbox. Plug SMTP or an email API into sendMail() to deliver. ---- */
  const pendingMail = new Set();
  const mailLog = (m, status, error) => append('mail-log', { ts: iso(), to: m.to ? sha256(String(m.to).toLowerCase()).slice(0, 16) : '', kind: m.kind, status, error });
  async function deliverMail(m) {
    try {
      let r;
      if (cfg.mailProvider === 'resend') r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + cfg.mailKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: cfg.mailFrom, to: [m.to], subject: m.subject, text: m.text }), signal: AbortSignal.timeout(8000) });
      else if (cfg.mailProvider === 'webhook') r = await fetch(cfg.mailWebhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ from: cfg.mailFrom, to: m.to, subject: m.subject, text: m.text, kind: m.kind }), signal: AbortSignal.timeout(8000) });
      mailLog(m, r && r.ok ? 'sent' : 'failed', r && r.ok ? '' : 'HTTP ' + (r && r.status));
    } catch (e) { mailLog(m, 'failed', String(e.message || e).slice(0, 100)); }
  }
  const mailReady = () => (cfg.mailProvider === 'resend' && cfg.mailKey && cfg.mailFrom) || (cfg.mailProvider === 'webhook' && cfg.mailWebhook);
  /** Always keeps a copy in the outbox. With a provider configured, also hands the message over; returns true when it was handed over (queued for delivery). */
  const sendMail = (m) => {
    append('mail-outbox', { ts: iso(), ...m });
    if (!mailReady()) return false;
    const p = deliverMail(m).finally(() => pendingMail.delete(p)); pendingMail.add(p); return true;
  };

  /* ---- CRM webhook with HMAC signature, retry and a durable outbox ---- */
  const crmOutbox = (evt, status, error) => append('crm-outbox', { ts: iso(), status, error, evt });
  async function forwardToCrm(evt) {
    if (!cfg.crmUrl) { crmOutbox(evt, 'unconfigured'); return 'unconfigured'; }
    const body = JSON.stringify(evt);
    const headers = { 'Content-Type': 'application/json', 'X-GBA-Event': evt.event, 'X-GBA-Delivery': evt.id };
    if (cfg.crmSecret) headers['X-GBA-Signature'] = 'sha256=' + createHmac('sha256', cfg.crmSecret).update(body).digest('hex');
    let err = '';
    for (let i = 0; i <= cfg.crmRetryMs.length; i++) {
      try {
        const r = await fetch(cfg.crmUrl, { method: 'POST', headers, body, signal: AbortSignal.timeout(8000) });
        if (r.ok) { append('crm-outbox', { ts: iso(), status: 'delivered', id: evt.id, event: evt.event }); return 'delivered'; }
        err = 'HTTP ' + r.status;
      } catch (e) { err = String(e.message || e).slice(0, 120); }
      if (i < cfg.crmRetryMs.length) await new Promise((r) => setTimeout(r, cfg.crmRetryMs[i]));
    }
    crmOutbox(evt, 'failed', err); return 'failed';
  }
  const pendingCrm = new Set();
  const crm = (evt) => { const p = forwardToCrm(evt).finally(() => pendingCrm.delete(p)); pendingCrm.add(p); return p; };

  /* ---- rate limiting (in memory, by hashed IP) ---- */
  const hits = new Map();
  const limited = (ipHash, kind) => {
    const [max, win] = cfg.rate[kind]; const k = kind + ':' + ipHash; const t = now();
    const arr = (hits.get(k) || []).filter((x) => t - x < win); arr.push(t); hits.set(k, arr); return arr.length > max;
  };
  setInterval(() => { const t = now(); for (const [k, v] of hits) if (!v.some((x) => t - x < 3600e3)) hits.delete(k); }, 600e3).unref();

  /* ---- optional Cloudflare Turnstile (set TURNSTILE_SECRET_KEY here and TURNSTILE_SITE_KEY at build time) ---- */
  async function turnstileOk(token, req) {
    if (!cfg.turnstileSecret) return true;
    if (!token || typeof token !== 'string') return false;
    try {
      const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret: cfg.turnstileSecret, response: token, remoteip: clientIp(req) }), signal: AbortSignal.timeout(6000) });
      return (await r.json()).success === true;
    } catch { return false; }
  }

  /* ---- CSP hashes for the small inline scripts the static pages use ---- */
  const inlineHashes = new Set();
  (function scan(dir) {
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      const p = join(dir, f); const st = statSync(p);
      if (st.isDirectory()) scan(p);
      else if (f.endsWith('.html')) for (const m of readFileSync(p, 'utf8').matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/json")[^>]*>([\s\S]*?)<\/script>/g)) inlineHashes.add(`'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
    }
  })(cfg.siteDir);
  const extScript = [cfg.turnstileSecret || process.env.TURNSTILE_SITE_KEY ? 'https://challenges.cloudflare.com' : '', cfg.analyticsDomain ? 'https://plausible.io' : ''].filter(Boolean);
  const csp = [`default-src 'self'`, `script-src 'self' ${[...inlineHashes].join(' ')} ${extScript.join(' ')}`.trim(), `style-src 'self' 'unsafe-inline'`, `font-src 'self'`, `img-src 'self' data:`, `connect-src 'self'${cfg.analyticsDomain ? ' https://plausible.io' : ''}`, `frame-src ${cfg.turnstileSecret || process.env.TURNSTILE_SITE_KEY ? 'https://challenges.cloudflare.com' : "'none'"}`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`].join('; ');

  /* ---- helpers ---- */
  const secHeaders = (req, extra = {}) => ({
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()', 'Content-Security-Policy': csp,
    ...((cfg.baseUrl.startsWith('https') || req.headers['x-forwarded-proto'] === 'https') ? { 'Strict-Transport-Security': 'max-age=31536000; includeSubDomains' } : {}), ...extra
  });
  const send = (req, res, status, body, headers = {}) => { res.writeHead(status, secHeaders(req, headers)); res.end(body); };
  const json = (req, res, status, obj) => send(req, res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  const clientIp = (req) => (cfg.trustProxy && req.headers['x-forwarded-for'] ? String(req.headers['x-forwarded-for']).split(',')[0].trim() : req.socket.remoteAddress || '');
  const ipHash = (req) => sha256(salt + clientIp(req)).slice(0, 24);
  const meta = (req) => ({ ipHash: ipHash(req), ua: clip(req.headers['user-agent'] || '', 120) });
  const origin = (req) => cfg.baseUrl || `http://${req.headers.host}`;
  const readBody = (req, max = 64 * 1024) => new Promise((ok, bad) => {
    if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return bad({ status: 415, code: 'content_type' });
    let n = 0; const chunks = [];
    req.on('data', (c) => { n += c.length; if (n > max) { bad({ status: 413, code: 'too_large' }); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { ok(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch { bad({ status: 400, code: 'bad_json' }); } });
    req.on('error', () => bad({ status: 400, code: 'read_error' }));
  });
  const sameOrigin = (req) => { const o = req.headers.origin; if (!o) return true; try { return new URL(o).host === req.headers.host; } catch { return false; } };
  const lang = (v) => (v === 'ar' ? 'ar' : 'en');
  const consentRecord = (type, given, version, body, req, extra = {}) => ({ ts: iso(), type, given: !!given, version, lang: lang(body.lang), source: clip(body.source, 60), ...meta(req), ...extra });

  /* ---- signed tokens: payload.signature, both base64url ---- */
  const makeToken = (payload) => { const p = b64u(JSON.stringify(payload)); return p + '.' + b64u(sign(p)); };
  const readToken = (tok) => {
    const [p, s] = String(tok || '').split('.'); if (!p || !s) return null;
    if (!safeEq(b64u(sign(p)), s)) return null;
    try { const o = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); return o.exp && o.exp < now() ? null : o; } catch { return null; }
  };

  /* ================= API handlers ================= */
  const H = {};

  H['POST /api/newsletter'] = async (req, res, body) => {
    if (clip(body.website, 50)) return json(req, res, 200, { ok: true, status: 'pending' }); // honeypot: pretend success
    const email = clip(body.email, 254).toLowerCase();
    if (!EMAIL.test(email)) return json(req, res, 400, { ok: false, error: 'email' });
    if (body.consent !== true) return json(req, res, 400, { ok: false, error: 'consent' });
    const L = lang(body.lang), eh = hashEmail(email);
    append('consents', consentRecord('newsletter', true, VERSIONS.marketing, body, req, { emailHash: eh }));
    const prev = subs.get(eh);
    if (!prev || prev.status === 'unsubscribed') {
      const sub = { emailHash: eh, email, name: clip(body.name, 80), lang: L, topics: Array.isArray(body.topics) ? body.topics.slice(0, 6).map((t) => clip(String(t), 30)) : [], status: 'pending', ts: iso(), source: clip(body.source, 60) };
      subs.set(eh, sub); append('newsletter', sub);
    }
    const tok = makeToken({ k: 'confirm', e: email, l: L, exp: now() + 7 * 864e5 });
    const confirmUrl = `${origin(req)}/api/newsletter/confirm?t=${tok}`;
    const delivered = (subs.get(eh).status === 'pending') ? sendMail({ to: email, subject: L === 'ar' ? 'يرجى تأكيد اشتراكك' : 'Please confirm your subscription', text: `${confirmUrl}\n`, kind: 'newsletter-confirm' }) : false;
    // identical response whether or not the address was already known (no account enumeration)
    return json(req, res, 200, { ok: true, status: 'pending', delivered, ...(cfg.demoPayments ? { demoConfirmUrl: confirmUrl } : {}) });
  };

  H['GET /api/newsletter/confirm'] = (req, res, _b, q) => {
    const t = readToken(q.get('t')); if (!t || t.k !== 'confirm') return send(req, res, 400, 'Invalid or expired link', { 'Content-Type': 'text/plain; charset=utf-8' });
    const eh = hashEmail(t.e), sub = subs.get(eh);
    if (sub && sub.status !== 'confirmed') {
      sub.status = 'confirmed'; sub.confirmedAt = iso(); append('newsletter', sub);
      append('consents', { ts: iso(), type: 'newsletter-confirm', given: true, version: VERSIONS.marketing, lang: t.l, emailHash: eh, ...meta(req) });
      crm({ id: ref('EVT'), event: 'newsletter.confirmed', occurredAt: iso(), lang: t.l, source: sub.source, contact: { email: sub.email, name: sub.name }, data: { topics: sub.topics }, consents: { marketing: { given: true, version: VERSIONS.marketing, ts: sub.confirmedAt } } });
    }
    res.writeHead(302, secHeaders(req, { Location: `/${t.l}/newsletter/confirmed/index.html`, 'Cache-Control': 'no-store' })); res.end();
  };

  H['GET /api/newsletter/unsubscribe'] = (req, res, _b, q) => {
    const t = readToken(q.get('t')); if (!t || t.k !== 'unsub') return send(req, res, 400, 'Invalid link', { 'Content-Type': 'text/plain; charset=utf-8' });
    const eh = hashEmail(t.e), sub = subs.get(eh);
    if (sub && sub.status !== 'unsubscribed') { sub.status = 'unsubscribed'; sub.unsubscribedAt = iso(); append('newsletter', sub); append('consents', { ts: iso(), type: 'newsletter-withdraw', given: false, version: VERSIONS.marketing, lang: t.l, emailHash: eh, ...meta(req) }); crm({ id: ref('EVT'), event: 'newsletter.unsubscribed', occurredAt: iso(), lang: t.l, contact: { email: sub.email }, data: {}, consents: { marketing: { given: false, version: VERSIONS.marketing, ts: sub.unsubscribedAt } } }); }
    res.writeHead(302, secHeaders(req, { Location: `/${t.l}/newsletter/unsubscribed/index.html`, 'Cache-Control': 'no-store' })); res.end();
  };

  H['POST /api/lead'] = async (req, res, body) => {
    if (clip(body.website, 50)) return json(req, res, 200, { ok: true, ref: 'GBA-OK' });
    const type = ['enquiry', 'booking', 'scorecard'].includes(body.type) ? body.type : null;
    const c = body.contact || {}, email = clip(c.email, 254).toLowerCase(), name = clip(c.name, 100);
    if (!type) return json(req, res, 400, { ok: false, error: 'type' });
    if (!name) return json(req, res, 400, { ok: false, error: 'name' });
    if (!EMAIL.test(email)) return json(req, res, 400, { ok: false, error: 'email' });
    if (!body.consent || body.consent.processing !== true) return json(req, res, 400, { ok: false, error: 'consent' });
    const L = lang(body.lang), r = ref('GBA');
    const data = {}; for (const [k, v] of Object.entries(body.data || {}).slice(0, 40)) data[clip(k, 40)] = typeof v === 'string' ? clip(v, 2000) : (typeof v === 'number' || typeof v === 'boolean' ? v : JSON.stringify(v).slice(0, 2000));
    const contact = { name, email, company: clip(c.company, 120), phone: clip(c.phone, 40), role: clip(c.role, 80) };
    const consents = { processing: { given: true, version: VERSIONS.privacy, ts: iso() }, marketing: { given: body.consent.marketing === true, version: VERSIONS.marketing, ts: iso() } };
    append('consents', consentRecord('lead-processing', true, VERSIONS.privacy, body, req, { ref: r, emailHash: hashEmail(email) }));
    if (consents.marketing.given) append('consents', consentRecord('lead-marketing', true, VERSIONS.marketing, body, req, { ref: r, emailHash: hashEmail(email) }));
    const lead = { ref: r, type, lang: L, source: clip(body.source, 60), contact, data, consents, ts: iso() };
    append('leads', { ...lead, meta: meta(req) });
    crm({ id: r, event: `lead.${type}`, occurredAt: lead.ts, lang: L, source: lead.source, contact, data, consents, meta: meta(req) });
    const delivered = sendMail({ to: email, subject: L === 'ar' ? `استلمنا طلبك (${r})` : `We have your request (${r})`, text: L === 'ar' ? `شكرًا ${name}. مرجعك: ${r}. سنتواصل معك قريبًا.` : `Thank you ${name}. Your reference is ${r}. We will be in touch soon.`, kind: 'lead-ack' });
    return json(req, res, 200, { ok: true, ref: r, delivered });
  };

  H['POST /api/privacy/request'] = async (req, res, body) => {
    if (clip(body.website, 50)) return json(req, res, 200, { ok: true, ref: 'GBA-OK' });
    const email = clip(body.email, 254).toLowerCase(), type = ['access', 'correction', 'deletion', 'withdraw', 'objection', 'copy'].includes(body.type) ? body.type : null;
    if (!EMAIL.test(email) || !type) return json(req, res, 400, { ok: false, error: 'invalid' });
    const r = ref('PDP'), L = lang(body.lang), due = new Date(now() + 30 * 864e5).toISOString().slice(0, 10);
    append('privacy-requests', { ref: r, type, emailHash: hashEmail(email), email, details: clip(body.details, 1500), lang: L, ts: iso(), dueBy: due, status: 'received', ...meta(req) });
    crm({ id: r, event: 'privacy.request', occurredAt: iso(), lang: L, contact: { email }, data: { type, dueBy: due }, consents: {} });
    sendMail({ to: email, subject: L === 'ar' ? `استلمنا طلبك (${r})` : `We received your privacy request (${r})`, text: `${r}. Due by ${due}.`, kind: 'privacy-ack' });
    return json(req, res, 200, { ok: true, ref: r, dueBy: due });
  };

  /* ---- shop ---- */
  const money = (n) => Math.round(n * 100) / 100;
  const orderView = (o) => ({ id: o.id, status: o.status, createdAt: o.createdAt, currency: 'SAR', subtotal: o.subtotal, vat: o.vat, total: o.total, items: o.items.map((i) => ({ slug: i.slug, title: i.title, price: i.price, left: Math.max(0, cfg.dlMax - (i.downloads || 0)) })) });
  const authOrder = (req, id, key) => { const o = orders.get(String(id || '')); if (!o || !key || !safeEq(sha256(String(key)), o.keyHash)) return null; return o; };

  H['POST /api/shop/checkout'] = async (req, res, body) => {
    if (clip(body.website, 50)) return json(req, res, 400, { ok: false, error: 'invalid' });
    const pm = payMode(); if (pm === 'off') return json(req, res, 501, { ok: false, error: 'payments_not_configured' });
    const slugs = [...new Set((Array.isArray(body.items) ? body.items : []).map((s) => String(s)).filter((s) => productBySlug(s)))].slice(0, 8);
    if (!slugs.length) return json(req, res, 400, { ok: false, error: 'items' });
    const b = body.buyer || {}, email = clip(b.email, 254).toLowerCase(), name = clip(b.name, 100);
    if (!name) return json(req, res, 400, { ok: false, error: 'name' });
    if (!EMAIL.test(email)) return json(req, res, 400, { ok: false, error: 'email' });
    if (!body.consent || body.consent.licence !== true) return json(req, res, 400, { ok: false, error: 'licence' });
    if (body.consent.privacy !== true) return json(req, res, 400, { ok: false, error: 'privacy' });
    const items = slugs.map((s) => { const p = productBySlug(s); return { slug: s, title: p.title.en, file: p.file, price: p.price, downloads: 0 }; }); // price comes from the server catalogue, never from the client
    const subtotal = money(items.reduce((a, i) => a + i.price, 0)), vat = money(subtotal * VAT_RATE), total = money(subtotal + vat);
    const id = ref('ORD'), key = randomBytes(24).toString('base64url'), L = lang(body.lang);
    const invoiceNo = nextInvoiceNo();
    const order = { id, invoiceNo, keyHash: sha256(key), status: pm === 'demo' ? 'paid' : 'pending', paymentMode: pm === 'demo' ? 'simulated' : cfg.payProvider, payment: {}, createdAt: iso(), lang: L, buyer: { name, email, company: clip(b.company, 120), vatNo: clip(b.vatNo, 40), country: clip(b.country, 60) }, items, subtotal, vat, total, emailHash: hashEmail(email) };
    orders.set(id, order); append('orders', order);
    append('consents', consentRecord('order-licence', true, VERSIONS.licence, body, req, { order: id, emailHash: order.emailHash }));
    append('consents', consentRecord('order-privacy', true, VERSIONS.privacy, body, req, { order: id, emailHash: order.emailHash }));
    const wantsNews = body.consent.marketing === true;
    if (wantsNews) { append('consents', consentRecord('order-marketing', true, VERSIONS.marketing, body, req, { order: id, emailHash: order.emailHash })); const eh = order.emailHash; if (!subs.get(eh)) { const sub = { emailHash: eh, email, name, lang: L, topics: [], status: 'pending', ts: iso(), source: 'shop' }; subs.set(eh, sub); append('newsletter', sub); sendMail({ to: email, subject: 'Please confirm your subscription', text: `${origin(req)}/api/newsletter/confirm?t=${makeToken({ k: 'confirm', e: email, l: L, exp: now() + 7 * 864e5 })}`, kind: 'newsletter-confirm' }); } }
    const orderUrl = `${origin(req)}/${L}/shop/order/index.html?o=${id}#k=${key}`;
    if (pm === 'provider') {
      try { const pr = await providerCreate(order, orderUrl, `${origin(req)}/${L}/shop/checkout/index.html`); order.payment = { ref: pr.ref, url: pr.url }; orders.set(id, order); append('orders', order); }
      catch (e) { order.status = 'failed'; orders.set(id, order); append('orders', order); return json(req, res, 502, { ok: false, error: 'payment_unavailable' }); }
      return json(req, res, 200, { ok: true, orderId: id, key, status: 'pending', redirect: order.payment.url, total });
    }
    const delivered = sendMail({ to: email, subject: L === 'ar' ? `إيصال طلبك ${id}` : `Your receipt ${id}`, text: orderUrl, kind: 'receipt' });
    crm({ id, event: 'order.paid', occurredAt: order.createdAt, lang: L, source: 'shop', contact: { name, email, company: order.buyer.company }, data: { total, currency: 'SAR', items: slugs, paymentMode: 'simulated' }, consents: { marketing: { given: wantsNews, version: VERSIONS.marketing, ts: order.createdAt } } });
    return json(req, res, 200, { ok: true, orderId: id, key, emailSent: delivered, redirect: `/${L}/shop/order/index.html?o=${id}#k=${key}`, total });
  };

  H['GET /api/shop/order'] = (req, res, _b, q) => {
    const o = authOrder(req, q.get('o'), req.headers['x-order-key']); if (!o) return json(req, res, 404, { ok: false, error: 'not_found' });
    return json(req, res, 200, { ok: true, order: orderView(o), dlMax: cfg.dlMax, ttl: cfg.dlTtl });
  };

  H['POST /api/shop/download-link'] = async (req, res, body) => {
    const o = authOrder(req, body.o, req.headers['x-order-key']); if (!o || o.status !== 'paid') return json(req, res, 404, { ok: false, error: 'not_found' });
    const item = o.items.find((i) => i.slug === body.item); if (!item) return json(req, res, 404, { ok: false, error: 'not_found' });
    if ((item.downloads || 0) >= cfg.dlMax) return json(req, res, 403, { ok: false, error: 'limit' });
    const nonce = randomBytes(12).toString('base64url'), exp = now() + cfg.dlTtl * 1000;
    const tok = makeToken({ k: 'dl', o: o.id, s: item.slug, n: nonce, exp });
    return json(req, res, 200, { ok: true, url: `/download/${tok}`, expiresIn: cfg.dlTtl, left: cfg.dlMax - (item.downloads || 0) });
  };

  /** ZATCA phase-1 QR payload: TLV (tag, length, value) of seller, VAT no., timestamp, total, VAT; base64. Phase-2 (XML, cryptographic stamp, clearance/reporting) is NOT implemented. */
  const zatcaQr = (o) => {
    const tlv = (t, v) => { const b = Buffer.from(String(v), 'utf8'); return Buffer.concat([Buffer.from([t, b.length]), b]); };
    const ts = o.createdAt.replace(/\.\d+Z$/, 'Z');
    return Buffer.concat([tlv(1, cfg.sellerName), tlv(2, cfg.sellerVat), tlv(3, ts), tlv(4, o.total.toFixed(2)), tlv(5, o.vat.toFixed(2))]).toString('base64');
  };
  H['GET /api/shop/invoice'] = (req, res, _b, q) => {
    const so = authSess(q.get('o'), q.get('k') || req.headers['x-order-key']);
    const o = so ? { ...so, paymentMode: so.payment.mode, items: [{ title: (so.plan === 'bundle' ? 'Advisory sessions: bundle of three' : 'Advisory session: single') + ' (60 min)', price: so.subtotal }] } : authOrder(req, q.get('o'), q.get('k') || req.headers['x-order-key']); if (!o || o.status !== 'paid') return send(req, res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const sim = o.paymentMode === 'simulated';
    const qr = qrcode(0, 'M'); qr.addData(zatcaQr(o), 'Byte'); qr.make();
    const rows = o.items.map((i) => `<tr><td>${esc(i.title)}</td><td style="text-align:right">${i.price.toFixed(2)}</td></tr>`).join('');
    const htmlDoc = `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><title>${esc(o.invoiceNo || o.id)}</title><body style="font:14px/1.5 system-ui;max-width:680px;margin:40px auto;padding:0 20px;color:#1a2433">
<h1 style="font-weight:500;margin:0 0 4px">Simplified tax invoice | فاتورة ضريبية مبسطة${sim ? ' (simulated: no real payment)' : ''}</h1>
<p style="margin:0 0 18px;color:#5c6778">Invoice no. ${esc(o.invoiceNo || o.id)} · Order ${esc(o.id)} · ${esc(o.createdAt.replace('T', ' ').slice(0, 16))} UTC</p>
<p><b>${esc(cfg.sellerName)}</b><br>${esc(cfg.sellerAddress)}<br>VAT registration no. ${esc(cfg.sellerVat)}${cfg.sellerCr ? `<br>Commercial registration no. ${esc(cfg.sellerCr)}` : ''}</p>
<p>Buyer: ${esc(o.buyer.name)}${o.buyer.company ? ', ' + esc(o.buyer.company) : ''}${o.buyer.vatNo ? ' · VAT ' + esc(o.buyer.vatNo) : ''}</p>
<table style="width:100%;border-collapse:collapse"><tr><th style="text-align:left;border-bottom:1px solid #ccc">Item</th><th style="text-align:right;border-bottom:1px solid #ccc">SAR</th></tr>${rows}<tr><td>Subtotal (excl. VAT)</td><td style="text-align:right">${o.subtotal.toFixed(2)}</td></tr><tr><td>VAT 15%</td><td style="text-align:right">${o.vat.toFixed(2)}</td></tr><tr><th style="text-align:left;border-top:1px solid #ccc">Total (incl. VAT)</th><th style="text-align:right;border-top:1px solid #ccc">${o.total.toFixed(2)}</th></tr></table>
<div style="margin-top:22px;display:flex;gap:18px;align-items:center"><div style="width:120px">${qr.createSvgTag(3, 0)}</div><p style="font-size:12px;color:#5c6778;margin:0">QR code with the seller, VAT number, time, total and VAT (ZATCA phase 1 format). E-invoicing phase 2 (integration with the ZATCA platform) is not included in this version.${sim ? ' This invoice belongs to a simulated order and is not a valid tax document.' : ''}</p></div>
<p style="margin-top:22px"><button onclick="print()" style="padding:8px 16px">Print</button></p></body>`;
    return send(req, res, 200, htmlDoc, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  };

  /* ================= Admin console (read-only data + privacy-request status), enabled by ADMIN_TOKEN ================= */
  const adminAuth = (req) => {
    if (!cfg.adminToken) return false;
    const a = String(req.headers.authorization || '');
    const tok = a.startsWith('Bearer ') ? a.slice(7) : a.startsWith('Basic ') ? Buffer.from(a.slice(6), 'base64').toString().split(':').slice(1).join(':') : '';
    return !!tok && safeEq(sha256(tok), sha256(cfg.adminToken));
  };
  const latest = (rows, key) => { const m = new Map(); for (const r of rows) m.set(r[key], { ...m.get(r[key]), ...r }); return [...m.values()]; };
  const ADMIN_KINDS = {
    leads: () => readAll('leads'), newsletter: () => latest(readAll('newsletter'), 'emailHash').map(({ emailHash, ...r }) => r),
    privacy: () => latest(readAll('privacy-requests'), 'ref'), orders: () => [...orders.values()].map((o) => ({ id: o.id, invoiceNo: o.invoiceNo, status: o.status, createdAt: o.createdAt, total: o.total, buyer: o.buyer.email, items: o.items.map((i) => i.slug).join(' ') })),
    consents: () => readAll('consents'), crm: () => readAll('crm-outbox'), mail: () => readAll('mail-log')
  };
  const csvOf = (rows) => { const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))]; const cell = (v) => { let t = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); if (/^[=+\-@]/.test(t)) t = "'" + t; return '"' + t.replace(/"/g, '""') + '"'; }; return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n'); };
  H['GET /api/admin/data'] = (req, res, _b, q) => {
    if (!adminAuth(req)) return json(req, res, 401, { ok: false, error: 'unauthorised' });
    const k = q.get('kind'); if (!ADMIN_KINDS[k]) return json(req, res, 400, { ok: false, error: 'kind' });
    const rows = ADMIN_KINDS[k]();
    if (q.get('format') === 'csv') return send(req, res, 200, csvOf(rows), { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="gba-${k}.csv"`, 'Cache-Control': 'no-store' });
    return json(req, res, 200, { ok: true, kind: k, count: rows.length, rows });
  };
  H['POST /api/admin/privacy-status'] = (req, res, body) => {
    if (!adminAuth(req)) return json(req, res, 401, { ok: false, error: 'unauthorised' });
    const r = readAll('privacy-requests').find((x) => x.ref === body.ref); if (!r || !['received', 'in-progress', 'done', 'refused'].includes(body.status)) return json(req, res, 400, { ok: false, error: 'invalid' });
    append('privacy-requests', { ref: r.ref, status: body.status, note: clip(body.note, 300), updatedAt: iso() });
    return json(req, res, 200, { ok: true });
  };
  const ADMIN_HTML = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin | Growth Blueprint</title><link rel="stylesheet" href="/admin/admin.css"><body><header><b>Growth Blueprint admin</b><form id="login"><input id="tok" type="password" placeholder="Admin token" autocomplete="off" aria-label="Admin token"><button>Open</button></form></header><nav id="tabs" hidden></nav><main><p id="msg">Enter the admin token. Data stays on this server; nothing here is sent anywhere else.</p><div id="out" role="region" aria-label="Records" tabindex="0"></div></main><script src="/admin/admin.js"></script></body></html>`;
  const ADMIN_CSS = `body{font:14px/1.5 system-ui;margin:0;color:#1a2433;background:#f6f1e6}header{display:flex;gap:16px;align-items:center;justify-content:space-between;background:#0d1f38;color:#fff;padding:12px 20px;flex-wrap:wrap}input,button,select{font:inherit;padding:6px 10px}button{cursor:pointer}nav{display:flex;gap:6px;padding:10px 20px;flex-wrap:wrap}nav button.on{background:#0d1f38;color:#fff}main{padding:0 20px 40px}#out{overflow:auto;max-height:70vh;background:#fff;border:1px solid #ddd}table{border-collapse:collapse;width:100%}td,th{padding:6px 10px;border-bottom:1px solid #eee;text-align:left;vertical-align:top;font-size:13px;max-width:360px;overflow-wrap:anywhere}th{position:sticky;top:0;background:#eee}`;
  const ADMIN_JS = `(function(){var T='',K='leads',KINDS=['leads','newsletter','privacy','orders','consents','crm','mail'];var $=function(i){return document.getElementById(i)};
function h(v){return String(v==null?'':typeof v==='object'?JSON.stringify(v):v).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function api(p,o){o=o||{};o.headers=Object.assign({Authorization:'Bearer '+T},o.headers||{});return fetch(p,o).then(function(r){return r.json()})}
function tabs(){var n=$('tabs');n.hidden=false;n.innerHTML=KINDS.map(function(k){return '<button data-k="'+k+'" class="'+(k===K?'on':'')+'">'+k+'</button>'}).join('')+'<a href="/api/admin/data?kind='+K+'&format=csv" id="csv" style="margin-inline-start:auto">CSV needs the token header: use the button</a><button id="dl">Download CSV</button>';n.querySelectorAll('button[data-k]').forEach(function(b){b.onclick=function(){K=b.dataset.k;load()}});$('csv').remove();$('dl').onclick=function(){fetch('/api/admin/data?kind='+K+'&format=csv',{headers:{Authorization:'Bearer '+T}}).then(function(r){return r.blob()}).then(function(b){var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gba-'+K+'.csv';a.click()})}}
function load(){api('/api/admin/data?kind='+K).then(function(d){if(!d.ok){$('msg').textContent='Not authorised.';return}$('msg').textContent=d.count+' records in '+K;tabs();var cols=[];d.rows.forEach(function(r){Object.keys(r).forEach(function(c){if(cols.indexOf(c)<0)cols.push(c)})});$('out').innerHTML='<table><tr>'+cols.map(function(c){return '<th>'+h(c)+'</th>'}).join('')+(K==='privacy'?'<th>action</th>':'')+'</tr>'+d.rows.slice().reverse().map(function(r){return '<tr>'+cols.map(function(c){return '<td>'+h(r[c])+'</td>'}).join('')+(K==='privacy'?'<td><select data-ref="'+h(r.ref)+'">'+['received','in-progress','done','refused'].map(function(s){return '<option'+(s===r.status?' selected':'')+'>'+s+'</option>'}).join('')+'</select></td>':'')+'</tr>'}).join('')+'</table>';$('out').querySelectorAll('select[data-ref]').forEach(function(s){s.onchange=function(){api('/api/admin/privacy-status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ref:s.dataset.ref,status:s.value})}).then(load)}})})}
$('login').onsubmit=function(e){e.preventDefault();T=$('tok').value;load()}})();`;

  /* ================= Advisory sessions: one session or a bundle of three, paid online ================= */
  const nextInvoiceNo = () => 'INV-' + String(Math.max(0, ...[...orders.values(), ...sess.values()].map((x) => Number(String(x.invoiceNo || '').slice(4)) || 0)) + 1).padStart(6, '0');
  const payMode = () => (cfg.payProvider === 'moyasar' && cfg.payKey ? 'provider' : cfg.demoPayments ? 'demo' : 'off');

  /** Hosted-invoice payment through a Saudi gateway (Moyasar API shape). Card details never touch this server. UNTESTED against the live service: verify in the provider's sandbox before launch. */
  async function providerCreate(o, successUrl, backUrl) {
    const r = await fetch(`${cfg.payApi}/invoices`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(cfg.payKey + ':').toString('base64') }, signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ amount: Math.round(o.total * 100), currency: 'SAR', description: `Growth Blueprint ${o.id}`, success_url: successUrl, back_url: backUrl, callback_url: `${origin({ headers: {} })}/api/pay/callback`, metadata: { order: o.id } }) });
    const j = await r.json().catch(() => ({})); if (!r.ok || !j.id || !j.url) throw new Error('provider ' + r.status);
    return { ref: j.id, url: j.url };
  }
  async function providerStatus(o) {
    const r = await fetch(`${cfg.payApi}/invoices/${encodeURIComponent(o.payment.ref)}`, { headers: { Authorization: 'Basic ' + Buffer.from(cfg.payKey + ':').toString('base64') }, signal: AbortSignal.timeout(10000) });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error('provider ' + r.status);
    if (j.status === 'paid' && Number(j.amount) === Math.round(o.total * 100) && String(j.currency || 'SAR').toUpperCase() === 'SAR') return 'paid';
    return ['failed', 'canceled', 'cancelled', 'expired'].includes(j.status) ? 'failed' : 'pending';
  }
  const sView = (o) => ({ id: o.id, plan: o.plan, status: o.status, createdAt: o.createdAt, currency: 'SAR', subtotal: o.subtotal, vat: o.vat, total: o.total, invoiceNo: o.invoiceNo, credits: o.credits, validUntil: o.validUntil, simulated: o.payment.mode === 'simulated', bookings: o.bookings.map((b) => ({ n: b.n, slot: b.slot, status: b.status, mode: b.mode, rescheduled: b.rescheduled || 0 })), buyer: { name: o.buyer.name, email: o.buyer.email } });
  const authSess = (id, key) => { const o = sess.get(String(id || '')); if (!o || !key || !safeEq(sha256(String(key)), o.keyHash)) return null; return o; };
  const live = (o) => o.status === 'paid' || (o.status === 'pending' && now() <= Date.parse(o.holdUntil));
  const taken = (iso, self) => { for (const o of sess.values()) if (live(o)) for (const b of o.bookings) if (b.slot === iso && b.status === 'booked' && !(self && self.id === o.id && self.n === b.n)) return true; return false; };
  const slotOk = (iso) => { const t = Date.parse(iso); if (!Number.isFinite(t) || new Date(t).toISOString() !== iso) return false; if (t < now() + cfg.sess.leadHours * 36e5 || t > now() + cfg.sess.horizonDays * 864e5) return false; return slotsForDate(localDate(iso, cfg.sess), cfg.sess.blackout, cfg.sess).includes(iso); };
  const fmtAst = (iso) => new Date(Date.parse(iso) + cfg.sess.tzOffsetMin * 60000).toISOString().replace('T', ' ').slice(0, 16) + ' AST';
  const where = (b) => (b.mode === 'person' ? cfg.sellerAddress : cfg.meetingUrl || 'Online: we will email the video link before the session');

  function sessionMail(o, b, kind) {
    const L = o.lang, base = origin({ headers: {} });
    const ics = (n) => `${base}/api/sessions/ics?o=${o.id}&n=${n}`;
    const subj = { booked: L === 'ar' ? `تأكيد جلستك (${o.id})` : `Your session is confirmed (${o.id})`, scheduled: L === 'ar' ? `تم تحديد موعد جلستك (${o.id})` : `Your session is scheduled (${o.id})`, rescheduled: L === 'ar' ? `تم تغيير موعد جلستك (${o.id})` : `Your session was rescheduled (${o.id})` }[kind];
    const text = L === 'ar' ? `الموعد: ${fmtAst(b.slot)} (توقيت المملكة)\nالمكان: ${where(b)}\nالمرجع: ${o.id}\n` : `When: ${fmtAst(b.slot)} (Saudi Arabia time)\nWhere: ${where(b)}\nReference: ${o.id}\nManage your booking with the link on the page you saw after paying.\n`;
    return sendMail({ to: o.buyer.email, subject: subj, text, kind: 'session-' + kind });
  }
  async function markPaid(o) {
    if (o.status === 'paid') return; o.status = 'paid'; o.paidAt = iso(); o.invoiceNo = o.invoiceNo || nextInvoiceNo();
    if (o.plan === 'bundle') o.validUntil = new Date(now() + cfg.sess.bundleValidDays * 864e5).toISOString().slice(0, 10);
    saveSess(o); sessionMail(o, o.bookings[0], 'booked');
    crm({ id: o.id, event: 'session.booked', occurredAt: o.paidAt, lang: o.lang, source: 'book-a-session', contact: { name: o.buyer.name, email: o.buyer.email, company: o.buyer.company, phone: o.buyer.phone }, data: { plan: o.plan, slot: o.bookings[0].slot, mode: o.bookings[0].mode, topic: o.topic, total: o.total, currency: 'SAR', paymentMode: o.payment.mode }, consents: {} });
  }

  H['GET /api/sessions/config'] = (req, res) => json(req, res, 200, { ok: true, tz: cfg.sess.tzName, minutes: cfg.sess.minutes, vat: cfg.sess.vat, cur: 'SAR', plans: cfg.sess.plans, bundleValidDays: cfg.sess.bundleValidDays, rescheduleHours: cfg.sess.rescheduleHours, pay: payMode() });
  H['GET /api/sessions/availability'] = (req, res, _b, q) => {
    const days = Math.min(Math.max(parseInt(q.get('days') || '14', 10) || 14, 1), 35); const d = q.get('from') && /^\d{4}-\d{2}-\d{2}$/.test(q.get('from')) ? q.get('from') : localDate(new Date().toISOString(), cfg.sess);
    const out = [];
    for (let i = 0; i < days; i++) { const dt = new Date(Date.parse(d + 'T00:00:00Z') + i * 864e5).toISOString().slice(0, 10); const slots = slotsForDate(dt, cfg.sess.blackout, cfg.sess).filter((x) => slotOk(x) && !taken(x)); if (slots.length) out.push({ date: dt, slots }); }
    return json(req, res, 200, { ok: true, tz: cfg.sess.tzName, days: out });
  };

  H['POST /api/sessions/book'] = async (req, res, body) => {
    if (clip(body.website, 50)) return json(req, res, 400, { ok: false, error: 'invalid' });
    const pm = payMode(); if (pm === 'off') return json(req, res, 501, { ok: false, error: 'payments_not_configured' });
    const plan = cfg.sess.plans[body.plan] ? body.plan : null; if (!plan) return json(req, res, 400, { ok: false, error: 'plan' });
    const b = body.buyer || {}, email = clip(b.email, 254).toLowerCase(), name = clip(b.name, 100), topic = clip(body.topic, 1500);
    if (!name) return json(req, res, 400, { ok: false, error: 'name' }); if (!EMAIL.test(email)) return json(req, res, 400, { ok: false, error: 'email' }); if (!topic) return json(req, res, 400, { ok: false, error: 'topic' });
    if (!body.consent || body.consent.privacy !== true) return json(req, res, 400, { ok: false, error: 'privacy' }); if (body.consent.terms !== true) return json(req, res, 400, { ok: false, error: 'terms' });
    const slot = String(body.slot || ''); if (!slotOk(slot)) return json(req, res, 400, { ok: false, error: 'slot' }); if (taken(slot)) return json(req, res, 409, { ok: false, error: 'taken' });
    const L = lang(body.lang), id = ref('SES'), key = randomBytes(24).toString('base64url'), price = cfg.sess.plans[plan].price, subtotal = money(price), vat = money(subtotal * cfg.sess.vat), total = money(subtotal + vat);
    const o = { id, keyHash: sha256(key), plan, status: 'pending', createdAt: iso(), holdUntil: new Date(now() + cfg.sess.holdMin * 60000).toISOString(), lang: L, topic, emailHash: hashEmail(email), subtotal, vat, total, credits: cfg.sess.plans[plan].n - 1,
      buyer: { name, email, company: clip(b.company, 120), phone: clip(b.phone, 40), vatNo: clip(b.vatNo, 40) }, bookings: [{ n: 1, slot, status: 'booked', mode: body.mode === 'person' ? 'person' : 'online', rescheduled: 0 }], payment: { mode: pm === 'demo' ? 'simulated' : cfg.payProvider } };
    append('consents', consentRecord('session-terms', true, VERSIONS.sessions, body, req, { order: id, emailHash: o.emailHash })); append('consents', consentRecord('session-privacy', true, VERSIONS.privacy, body, req, { order: id, emailHash: o.emailHash }));
    if (body.consent.marketing === true) { append('consents', consentRecord('session-marketing', true, VERSIONS.marketing, body, req, { order: id, emailHash: o.emailHash })); if (!subs.get(o.emailHash)) { const sub = { emailHash: o.emailHash, email, name, lang: L, topics: [], status: 'pending', ts: iso(), source: 'session' }; subs.set(o.emailHash, sub); append('newsletter', sub); } }
    const conf = `/${L}/book-a-session/confirmation/index.html?o=${id}#k=${key}`;
    if (pm === 'demo') { saveSess(o); await markPaid(o); return json(req, res, 200, { ok: true, id, key, status: 'paid', redirect: conf, total }); }
    try { const p = await providerCreate(o, `${origin(req)}${conf}`, `${origin(req)}/${L}/book-a-session/index.html`); o.payment.ref = p.ref; o.payment.url = p.url; saveSess(o); }
    catch (e) { return json(req, res, 502, { ok: false, error: 'payment_unavailable' }); }
    return json(req, res, 200, { ok: true, id, key, status: 'pending', redirect: o.payment.url, total });
  };

  H['GET /api/sessions/order'] = (req, res, _b, q) => { const o = authSess(q.get('o'), req.headers['x-order-key']); if (!o) return json(req, res, 404, { ok: false, error: 'not_found' }); return json(req, res, 200, { ok: true, order: sView(o), reschedule: cfg.sess.rescheduleHours }); };

  H['POST /api/sessions/schedule'] = (req, res, body) => {
    const o = authSess(body.o, req.headers['x-order-key']); if (!o || o.status !== 'paid') return json(req, res, 404, { ok: false, error: 'not_found' });
    if (o.credits < 1) return json(req, res, 403, { ok: false, error: 'no_credits' }); if (o.validUntil && now() > Date.parse(o.validUntil + 'T23:59:59Z')) return json(req, res, 403, { ok: false, error: 'expired' });
    const slot = String(body.slot || ''); if (!slotOk(slot)) return json(req, res, 400, { ok: false, error: 'slot' }); if (taken(slot)) return json(req, res, 409, { ok: false, error: 'taken' });
    const bk = { n: o.bookings.length + 1, slot, status: 'booked', mode: body.mode === 'person' ? 'person' : 'online', rescheduled: 0 }; o.bookings.push(bk); o.credits -= 1; saveSess(o);
    sessionMail(o, bk, 'scheduled'); crm({ id: `${o.id}-${bk.n}`, event: 'session.scheduled', occurredAt: iso(), lang: o.lang, source: 'book-a-session', contact: { name: o.buyer.name, email: o.buyer.email }, data: { plan: o.plan, slot, n: bk.n }, consents: {} });
    return json(req, res, 200, { ok: true, order: sView(o) });
  };
  H['POST /api/sessions/reschedule'] = (req, res, body) => {
    const o = authSess(body.o, req.headers['x-order-key']); if (!o || o.status !== 'paid') return json(req, res, 404, { ok: false, error: 'not_found' });
    const bk = o.bookings.find((x) => x.n === Number(body.n) && x.status === 'booked'); if (!bk) return json(req, res, 404, { ok: false, error: 'not_found' });
    if (Date.parse(bk.slot) - now() < cfg.sess.rescheduleHours * 36e5) return json(req, res, 403, { ok: false, error: 'too_late' }); if ((bk.rescheduled || 0) >= 2) return json(req, res, 403, { ok: false, error: 'limit' });
    const slot = String(body.slot || ''); if (!slotOk(slot)) return json(req, res, 400, { ok: false, error: 'slot' }); if (taken(slot, { id: o.id, n: bk.n })) return json(req, res, 409, { ok: false, error: 'taken' });
    bk.slot = slot; bk.rescheduled = (bk.rescheduled || 0) + 1; saveSess(o); sessionMail(o, bk, 'rescheduled'); return json(req, res, 200, { ok: true, order: sView(o) });
  };
  H['GET /api/sessions/ics'] = (req, res, _b, q) => {
    const o = authSess(q.get('o'), q.get('k') || req.headers['x-order-key']); const bk = o && o.bookings.find((x) => x.n === Number(q.get('n'))); if (!o || !bk || o.status !== 'paid') return send(req, res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const z = (t) => new Date(t).toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''), esc = (t) => String(t).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Growth Blueprint//Sessions//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', `UID:${o.id}-${bk.n}@growthblueprint`, `DTSTAMP:${z(now())}`, `DTSTART:${z(bk.slot)}`, `DTEND:${z(Date.parse(bk.slot) + cfg.sess.minutes * 60000)}`, 'SUMMARY:Growth Blueprint advisory session', `LOCATION:${esc(where(bk))}`, `DESCRIPTION:${esc('Reference ' + o.id)}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n';
    return send(req, res, 200, ics, { 'Content-Type': 'text/calendar; charset=utf-8', 'Content-Disposition': `attachment; filename="growth-blueprint-session-${bk.n}.ics"`, 'Cache-Control': 'no-store' });
  };
  /** Re-checks a pending payment with the provider (on return from the payment page, and from the provider callback). */
  async function verifyOrder(o) {
    if (o.status !== 'pending' || !o.payment || !o.payment.ref) return o.status;
    try {
      const st = await providerStatus(o);
      if (st === 'paid') { if (o.bookings) await markPaid(o); else { o.status = 'paid'; o.paidAt = iso(); orders.set(o.id, o); append('orders', o); sendMail({ to: o.buyer.email, subject: o.lang === 'ar' ? `إيصال طلبك ${o.id}` : `Your receipt ${o.id}`, text: `${origin({ headers: {} })}/${o.lang}/shop/order/index.html?o=${o.id}`, kind: 'receipt' }); } }
      else if (st === 'failed') { o.status = 'failed'; if (o.bookings) saveSess(o); else { orders.set(o.id, o); append('orders', o); } }
    } catch { /* leave pending */ }
    return o.status;
  }
  H['POST /api/pay/verify'] = async (req, res, body) => {
    const key = req.headers['x-order-key'] || body.k; const o = authSess(body.o, key) || authOrder(req, body.o, key); if (!o) return json(req, res, 404, { ok: false, error: 'not_found' });
    return json(req, res, 200, { ok: true, status: await verifyOrder(o) });
  };
  H['POST /api/pay/callback'] = async (req, res, body) => {
    const id = body && ((body.metadata && body.metadata.order) || body.order); const o = id && (sess.get(String(id)) || orders.get(String(id))); if (o) await verifyOrder(o); return json(req, res, 200, { ok: true }); // status is always re-read from the provider; the payload is never trusted
  };

  H['GET /api/health'] = (req, res) => json(req, res, 200, { ok: true, shop: cfg.demoPayments ? 'simulated-payments' : 'payments-not-configured', crm: cfg.crmUrl ? 'configured' : 'not-configured', mail: mailReady() ? cfg.mailProvider : 'outbox', captcha: cfg.turnstileSecret ? 'turnstile' : 'honeypot-only', admin: cfg.adminToken ? 'enabled' : 'disabled' });

  function download(req, res, tok) {
    const t = readToken(tok);
    if (!t || t.k !== 'dl') return send(req, res, 403, 'This link is invalid or has expired.', { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    const o = orders.get(t.o), item = o && o.items.find((i) => i.slug === t.s), p = productBySlug(t.s);
    if (!o || o.status !== 'paid' || !item || !p || usedNonces.has(t.n) || (item.downloads || 0) >= cfg.dlMax) return send(req, res, 403, 'This link is invalid or has already been used.', { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    const path = join(cfg.briefsDir, p.file);
    if (!existsSync(path)) return send(req, res, 404, 'File unavailable', { 'Content-Type': 'text/plain; charset=utf-8' });
    usedNonces.add(t.n); item.downloads = (item.downloads || 0) + 1; append('downloads', { ts: iso(), order: o.id, item: item.slug, nonce: t.n, ipHash: ipHash(req) }); append('orders', o);
    res.writeHead(200, secHeaders(req, { 'Content-Type': 'application/pdf', 'Content-Length': statSync(path).size, 'Content-Disposition': `attachment; filename="growth-blueprint-${p.sector}-brief.pdf"`, 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' }));
    createReadStream(path).pipe(res);
  }

  /* ---- static files (dist only; private/ and data/ are never under siteDir) ---- */
  function serveStatic(req, res, pathname) {
    let p; try { p = decodeURIComponent(pathname); } catch { return send(req, res, 400, 'Bad request'); }
    if (p.includes('\0')) return send(req, res, 400, 'Bad request');
    let f = normalize(join(cfg.siteDir, p));
    if (f !== cfg.siteDir && !f.startsWith(cfg.siteDir + sep)) return send(req, res, 403, 'Forbidden');
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    if (!existsSync(f) || !statSync(f).isFile()) {
      const lg = (p.match(/^\/(en|ar)\//) || [])[1] || 'en'; const nf = join(cfg.siteDir, lg, '404.html');
      return send(req, res, 404, existsSync(nf) ? readFileSync(nf) : 'Not found', { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    }
    const ext = extname(f).toLowerCase(), st = statSync(f);
    const long = ext !== '.html' && f.includes(`${sep}assets${sep}`);
    res.writeHead(200, secHeaders(req, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Content-Length': st.size, 'Cache-Control': long ? 'public, max-age=86400' : 'no-cache', ...(/\/(shop\/order|readiness-scorecard\/results)\//.test(p) ? { 'Cache-Control': 'no-store' } : {}) }));
    if (req.method === 'HEAD') return res.end();
    createReadStream(f).pipe(res);
  }

  const server = http.createServer(async (req, res) => {
    const t0 = now(); const u = new URL(req.url, 'http://x'); const key = `${req.method} ${u.pathname}`;
    res.on('finish', () => { if (!process.env.QUIET) console.log(`${req.method} ${u.pathname} ${res.statusCode} ${now() - t0}ms`); });
    try {
      if (u.pathname.startsWith('/download/') && req.method === 'GET') {
        if (limited(ipHash(req), 'dl')) return json(req, res, 429, { ok: false, error: 'rate_limited' });
        return download(req, res, u.pathname.slice('/download/'.length));
      }
      const h = H[key];
      if (u.pathname.startsWith('/api/')) {
        if (!h) return json(req, res, req.method === 'GET' || req.method === 'POST' ? 404 : 405, { ok: false, error: 'not_found' });
        const kind = /\/(shop|sessions|pay)\//.test(key) ? 'shop' : req.method === 'GET' ? 'read' : 'form';
        if (limited(ipHash(req), kind)) return json(req, res, 429, { ok: false, error: 'rate_limited' });
        if (req.method === 'POST') {
          if (!sameOrigin(req)) return json(req, res, 403, { ok: false, error: 'origin' });
          let body; try { body = await readBody(req); } catch (e) { return json(req, res, e.status || 400, { ok: false, error: e.code || 'bad_request' }); }
          if (cfg.turnstileSecret && /^POST \/api\/(newsletter|lead|privacy\/request|shop\/checkout|sessions\/book)$/.test(key) && !(await turnstileOk(body.turnstile, req))) return json(req, res, 400, { ok: false, error: 'captcha' });
          return await h(req, res, body, u.searchParams);
        }
        return await h(req, res, null, u.searchParams);
      }
      if (cfg.adminToken && (u.pathname === '/admin' || u.pathname === '/admin/')) return send(req, res, 200, ADMIN_HTML, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      if (cfg.adminToken && u.pathname === '/admin/admin.js') return send(req, res, 200, ADMIN_JS, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
      if (cfg.adminToken && u.pathname === '/admin/admin.css') return send(req, res, 200, ADMIN_CSS, { 'Content-Type': 'text/css; charset=utf-8', 'Cache-Control': 'no-store' });
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(req, res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
      if (u.pathname === '/') { res.writeHead(302, secHeaders(req, { Location: `/${(req.headers['accept-language'] || '').toLowerCase().startsWith('ar') ? 'ar' : 'en'}/index.html` })); return res.end(); }
      return serveStatic(req, res, u.pathname);
    } catch (e) {
      console.error('error', key, String(e && e.stack || e).split('\n')[0]);
      if (!res.headersSent) json(req, res, 500, { ok: false, error: 'server_error' });
    }
  });
  server.idle = () => Promise.allSettled([...pendingCrm, ...pendingMail]);
  server.cfg = cfg; server.orders = orders; server.subs = subs; server.zatcaQr = zatcaQr;
  return server;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const port = Number(process.env.PORT || 3000), host = process.env.HOST || '127.0.0.1';
  const s = createApp();
  s.listen(port, host, () => {
    console.log(`Growth Blueprint on http://${host}:${port}`);
    console.log(`  shop payments : ${s.cfg.demoPayments ? 'SIMULATED (set DEMO_PAYMENTS=0 and add a provider for live sales)' : 'not configured (checkout disabled)'}`);
    console.log(`  CRM webhook   : ${s.cfg.crmUrl ? 'configured' : 'not configured (events are kept in data/crm-outbox.jsonl)'}`);
    console.log('  email         : outbox only (data/mail-outbox.jsonl)');
  });
}
