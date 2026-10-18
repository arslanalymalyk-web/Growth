// Growth Blueprint: web server (no dependencies).
//   node server.mjs            -> http://127.0.0.1:3000
// Serves dist/, plus the JSON API used by the forms, the newsletter and the briefs shop.
// See README.md for configuration (CRM webhook, payments, download signing).
import http from 'node:http';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createReadStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync, appendFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { PRODUCTS, productBySlug, VAT_RATE } from './src/shop.mjs';

const here = dirname(fileURLToPath(import.meta.url));
export const VERSIONS = { privacy: 'privacy-2026-1', marketing: 'marketing-2026-1', licence: 'licence-2026-1' };
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
  const subs = new Map(); readAll('newsletter').forEach((s) => subs.set(s.emailHash, s));
  const usedNonces = new Set(readAll('downloads').map((d) => d.nonce));
  const now = () => Date.now();
  const iso = () => new Date().toISOString();
  const ref = (p) => `${p}-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
  const hashEmail = (e) => sha256(e.toLowerCase());

  /* ---- outbound mail: written to an outbox. Plug SMTP or an email API into sendMail() to deliver. ---- */
  const sendMail = (m) => { append('mail-outbox', { ts: iso(), ...m }); return false; /* false = queued, not delivered */ };

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
  const csp = [`default-src 'self'`, `script-src 'self' ${[...inlineHashes].join(' ')}`, `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`].join('; ');

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
    if (!cfg.demoPayments) return json(req, res, 501, { ok: false, error: 'payments_not_configured' });
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
    const order = { id, keyHash: sha256(key), status: 'paid', paymentMode: 'simulated', createdAt: iso(), lang: L, buyer: { name, email, company: clip(b.company, 120), vatNo: clip(b.vatNo, 40), country: clip(b.country, 60) }, items, subtotal, vat, total, emailHash: hashEmail(email) };
    orders.set(id, order); append('orders', order);
    append('consents', consentRecord('order-licence', true, VERSIONS.licence, body, req, { order: id, emailHash: order.emailHash }));
    append('consents', consentRecord('order-privacy', true, VERSIONS.privacy, body, req, { order: id, emailHash: order.emailHash }));
    const wantsNews = body.consent.marketing === true;
    if (wantsNews) { append('consents', consentRecord('order-marketing', true, VERSIONS.marketing, body, req, { order: id, emailHash: order.emailHash })); const eh = order.emailHash; if (!subs.get(eh)) { const sub = { emailHash: eh, email, name, lang: L, topics: [], status: 'pending', ts: iso(), source: 'shop' }; subs.set(eh, sub); append('newsletter', sub); sendMail({ to: email, subject: 'Please confirm your subscription', text: `${origin(req)}/api/newsletter/confirm?t=${makeToken({ k: 'confirm', e: email, l: L, exp: now() + 7 * 864e5 })}`, kind: 'newsletter-confirm' }); } }
    const orderUrl = `${origin(req)}/${L}/shop/order/index.html?o=${id}#k=${key}`;
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

  H['GET /api/shop/invoice'] = (req, res, _b, q) => {
    const o = authOrder(req, q.get('o'), q.get('k') || req.headers['x-order-key']); if (!o) return send(req, res, 404, 'Not found', { 'Content-Type': 'text/plain; charset=utf-8' });
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const rows = o.items.map((i) => `<tr><td>${esc(i.title)}</td><td style="text-align:right">${i.price.toFixed(2)}</td></tr>`).join('');
    const htmlDoc = `<!doctype html><meta charset="utf-8"><title>Invoice ${esc(o.id)}</title><body style="font:14px/1.5 system-ui;max-width:640px;margin:40px auto;padding:0 20px"><h1 style="font-weight:500">Tax invoice (simulated)</h1><p>Seller: Growth Blueprint · VAT no. ${esc(cfg.sellerVat)}<br>Invoice ref: ${esc(o.id)} · ${esc(o.createdAt.slice(0, 10))}<br>Buyer: ${esc(o.buyer.name)}${o.buyer.company ? ', ' + esc(o.buyer.company) : ''}${o.buyer.vatNo ? ' · VAT ' + esc(o.buyer.vatNo) : ''}</p><table style="width:100%;border-collapse:collapse" border="0"><tr><th style="text-align:left">Item</th><th style="text-align:right">SAR</th></tr>${rows}<tr><td>Subtotal</td><td style="text-align:right">${o.subtotal.toFixed(2)}</td></tr><tr><td>VAT 15%</td><td style="text-align:right">${o.vat.toFixed(2)}</td></tr><tr><th style="text-align:left">Total</th><th style="text-align:right">${o.total.toFixed(2)}</th></tr></table><p style="color:#666;font-size:12px">This is a demonstration invoice. It is not a ZATCA-compliant e-invoice.</p>`;
    return send(req, res, 200, htmlDoc, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  };

  H['GET /api/health'] = (req, res) => json(req, res, 200, { ok: true, shop: cfg.demoPayments ? 'simulated-payments' : 'payments-not-configured', crm: cfg.crmUrl ? 'configured' : 'not-configured', mail: 'outbox' });

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
        const kind = key.includes('/shop/') ? 'shop' : req.method === 'GET' ? 'read' : 'form';
        if (limited(ipHash(req), kind)) return json(req, res, 429, { ok: false, error: 'rate_limited' });
        if (req.method === 'POST') {
          if (!sameOrigin(req)) return json(req, res, 403, { ok: false, error: 'origin' });
          let body; try { body = await readBody(req); } catch (e) { return json(req, res, e.status || 400, { ok: false, error: e.code || 'bad_request' }); }
          return await h(req, res, body, u.searchParams);
        }
        return await h(req, res, null, u.searchParams);
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') return send(req, res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
      if (u.pathname === '/') { res.writeHead(302, secHeaders(req, { Location: `/${(req.headers['accept-language'] || '').toLowerCase().startsWith('ar') ? 'ar' : 'en'}/index.html` })); return res.end(); }
      return serveStatic(req, res, u.pathname);
    } catch (e) {
      console.error('error', key, String(e && e.stack || e).split('\n')[0]);
      if (!res.headersSent) json(req, res, 500, { ok: false, error: 'server_error' });
    }
  });
  server.idle = () => Promise.allSettled([...pendingCrm]);
  server.cfg = cfg; server.orders = orders; server.subs = subs;
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
