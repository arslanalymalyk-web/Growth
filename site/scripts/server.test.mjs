import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createHmac } from 'node:crypto';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server.mjs';

process.env.QUIET = '1';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteDir = join(root, 'dist'), briefsDir = join(root, 'private', 'briefs');

async function start(opts = {}) {
  const dataDir = mkdtempSync(join(tmpdir(), 'gba-'));
  const app = createApp({ siteDir, briefsDir, dataDir, secret: 'test-secret', ...opts });
  await new Promise((r) => app.listen(0, '127.0.0.1', r));
  const base = `http://127.0.0.1:${app.address().port}`;
  const call = (path, o = {}) => fetch(base + path, { redirect: 'manual', ...o, headers: { ...(o.json ? { 'Content-Type': 'application/json' } : {}), ...(o.headers || {}) }, body: o.json ? JSON.stringify(o.json) : o.body });
  const lines = (n) => { const f = join(dataDir, n + '.jsonl'); return existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)) : []; };
  return { app, base, call, lines, dataDir, close: () => new Promise((r) => app.close(r)) };
}
const buyer = { name: 'Sara Almansour', email: 'sara@example.com', company: 'Neom Ventures' };
const okConsent = { licence: true, privacy: true, marketing: false };

test('static site is served with security headers; private files and traversal are not reachable', async (t) => {
  const s = await start(); t.after(s.close);
  const r = await s.call('/en/index.html');
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-security-policy'), /frame-ancestors 'none'/);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  for (const p of ['/../server.mjs', '/%2e%2e/server.mjs', '/..%2fprivate/briefs/fmcg.pdf', '/private/briefs/fmcg.pdf', '/data/orders.jsonl', '/%00']) {
    const x = await s.call(p); assert.ok([400, 403, 404].includes(x.status), `${p} -> ${x.status}`);
    assert.ok(!(await x.text()).includes('createApp'));
  }
  const nf = await s.call('/ar/nope'); assert.equal(nf.status, 404);
  assert.match(await nf.text(), /dir="rtl"/);
});

test('API rejects non-JSON, oversized bodies and foreign origins', async (t) => {
  const s = await start(); t.after(s.close);
  assert.equal((await s.call('/api/lead', { method: 'POST', body: 'x=1', headers: { 'Content-Type': 'text/plain' } })).status, 415);
  assert.equal((await s.call('/api/lead', { method: 'POST', body: JSON.stringify({ x: 'a'.repeat(70000) }), headers: { 'Content-Type': 'application/json' } }).catch(() => ({ status: 413 }))).status, 413);
  assert.equal((await s.call('/api/lead', { method: 'POST', json: {}, headers: { Origin: 'https://evil.example' } })).status, 403);
});

test('newsletter: needs explicit consent, double opt-in, no enumeration, unsubscribe', async (t) => {
  const s = await start(); t.after(s.close);
  assert.equal((await s.call('/api/newsletter', { method: 'POST', json: { email: 'a@b.co', lang: 'en' } })).status, 400);
  assert.equal((await s.call('/api/newsletter', { method: 'POST', json: { email: 'nope', consent: true } })).status, 400);
  const r = await s.call('/api/newsletter', { method: 'POST', json: { email: 'Reader@Example.com', lang: 'ar', consent: true, source: 'footer' } });
  const j = await r.json(); assert.equal(r.status, 200); assert.equal(j.status, 'pending');
  assert.equal(s.lines('consents')[0].type, 'newsletter'); assert.equal(s.lines('consents')[0].given, true);
  assert.ok(!JSON.stringify(s.lines('consents')).includes('reader@example.com'), 'consent log stores a hash, not the address');
  // not subscribed until confirmed
  assert.equal([...s.app.subs.values()][0].status, 'pending');
  const c = await s.call(new URL(j.demoConfirmUrl).pathname + new URL(j.demoConfirmUrl).search);
  assert.equal(c.status, 302); assert.match(c.headers.get('location'), /^\/ar\/newsletter\/confirmed\//);
  assert.equal([...s.app.subs.values()][0].status, 'confirmed');
  // same response for an already-known address
  const again = await (await s.call('/api/newsletter', { method: 'POST', json: { email: 'reader@example.com', consent: true } })).json();
  assert.equal(again.status, 'pending');
  // tampered confirm link is rejected
  assert.equal((await s.call('/api/newsletter/confirm?t=' + j.demoConfirmUrl.split('t=')[1].slice(0, -3) + 'abc')).status, 400);
  // honeypot looks like success but stores nothing new
  const n = s.lines('consents').length;
  assert.equal((await s.call('/api/newsletter', { method: 'POST', json: { email: 'bot@x.co', consent: true, website: 'http://spam' } })).status, 200);
  assert.equal(s.lines('consents').length, n);
});

test('lead: validates, records consent versions, queues for CRM when no webhook is set', async (t) => {
  const s = await start(); t.after(s.close);
  const base = { type: 'enquiry', lang: 'en', source: 'enquiry', contact: { name: 'Sara', email: 'sara@example.com', company: 'X' }, data: { interest: 'Entering Saudi Arabia' } };
  assert.equal((await s.call('/api/lead', { method: 'POST', json: { ...base, consent: { processing: false } } })).status, 400);
  assert.equal((await s.call('/api/lead', { method: 'POST', json: { ...base, contact: { name: 'S', email: 'bad' }, consent: { processing: true } } })).status, 400);
  assert.equal((await s.call('/api/lead', { method: 'POST', json: { ...base, type: 'hack', consent: { processing: true } } })).status, 400);
  const r = await s.call('/api/lead', { method: 'POST', json: { ...base, consent: { processing: true, marketing: true } } });
  const j = await r.json(); assert.equal(r.status, 200); assert.match(j.ref, /^GBA-\d{6}-[0-9A-F]{6}$/);
  const types = s.lines('consents').map((c) => c.type); assert.deepEqual(types, ['lead-processing', 'lead-marketing']);
  assert.equal(s.lines('consents')[0].version, 'privacy-2026-3');
  assert.equal(s.lines('leads')[0].contact.email, 'sara@example.com');
  await s.app.idle(); assert.equal(s.lines('crm-outbox')[0].status, 'unconfigured');
});

test('CRM webhook: signed with HMAC, retried on failure, kept in the outbox if it never succeeds', async (t) => {
  let calls = 0, last;
  const crm = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { calls++; last = { headers: req.headers, body: b }; res.writeHead(calls < 3 ? 500 : 200); res.end('{}'); }); });
  await new Promise((r) => crm.listen(0, '127.0.0.1', r)); t.after(() => crm.close());
  const s = await start({ crmUrl: `http://127.0.0.1:${crm.address().port}/hook`, crmSecret: 'shh', crmRetryMs: [5, 5, 5] }); t.after(s.close);
  await s.call('/api/lead', { method: 'POST', json: { type: 'booking', lang: 'en', contact: { name: 'A', email: 'a@b.co' }, consent: { processing: true } } });
  await s.app.idle();
  assert.equal(calls, 3);
  assert.equal(last.headers['x-gba-event'], 'lead.booking');
  assert.equal(last.headers['x-gba-signature'], 'sha256=' + createHmac('sha256', 'shh').update(last.body).digest('hex'));
  assert.equal(JSON.parse(last.body).consents.processing.given, true);
  assert.equal(s.lines('crm-outbox').at(-1).status, 'delivered');
  // an endpoint that always fails ends up in the outbox as failed
  const bad = await start({ crmUrl: 'http://127.0.0.1:9/none', crmRetryMs: [1] }); t.after(bad.close);
  await bad.call('/api/lead', { method: 'POST', json: { type: 'enquiry', contact: { name: 'A', email: 'a@b.co' }, consent: { processing: true } } });
  await bad.app.idle(); assert.equal(bad.lines('crm-outbox').at(-1).status, 'failed');
});

async function buy(s, extra = {}) {
  const r = await s.call('/api/shop/checkout', { method: 'POST', json: { lang: 'en', items: ['fmcg-market-entry-brief'], buyer, consent: okConsent, ...extra } });
  return { r, j: await r.json() };
}

test('shop: server sets the price, requires licence + privacy consent, and keeps payments off unless enabled', async (t) => {
  const s = await start(); t.after(s.close);
  assert.equal((await buy(s, { consent: { licence: false, privacy: true } })).r.status, 400);
  assert.equal((await buy(s, { consent: { licence: true, privacy: false } })).r.status, 400);
  assert.equal((await buy(s, { items: ['../../etc/passwd'] })).r.status, 400);
  const { r, j } = await buy(s, { price: 1, total: 1, items: ['fmcg-market-entry-brief', 'fmcg-market-entry-brief', 'hospitality-market-entry-brief'] });
  assert.equal(r.status, 200); assert.equal(j.total, 1725); // (750 + 750) + 15% VAT, duplicates ignored, client price ignored
  assert.ok(!JSON.stringify(s.lines('orders')).includes(j.key), 'access key is stored hashed');
  const off = await start({ demoPayments: false }); t.after(off.close);
  assert.equal((await buy(off)).r.status, 501);
});

test('shop: signed single-use expiring download links, bound to the order and its owner key', async (t) => {
  const s = await start({ dlMax: 2 }); t.after(s.close);
  const { j } = await buy(s);
  const ask = (key = j.key, item = 'fmcg-market-entry-brief') => s.call('/api/shop/download-link', { method: 'POST', json: { o: j.orderId, item }, headers: { 'X-Order-Key': key } });
  assert.equal((await s.call(`/api/shop/order?o=${j.orderId}`, { headers: { 'X-Order-Key': 'wrong' } })).status, 404);
  assert.equal((await ask('wrong')).status, 404);
  assert.equal((await ask(j.key, 'hospitality-market-entry-brief')).status, 404, 'cannot download what was not bought');
  const a = await (await ask()).json(); assert.equal(a.ok, true); assert.equal(a.left, 2);
  const f = await s.call(a.url); assert.equal(f.status, 200);
  assert.equal(f.headers.get('content-type'), 'application/pdf'); assert.match(f.headers.get('content-disposition'), /attachment/);
  assert.equal(Buffer.from(await f.arrayBuffer()).subarray(0, 4).toString(), '%PDF');
  assert.equal((await s.call(a.url)).status, 403, 'a link works once');
  const tampered = a.url.slice(0, -2) + (a.url.endsWith('AA') ? 'BB' : 'AA');
  assert.equal((await s.call(tampered)).status, 403);
  const b2 = await (await ask()).json(); assert.equal((await s.call(b2.url)).status, 200);
  assert.equal((await ask()).status, 403, 'per-item download limit');
  const view = await (await s.call(`/api/shop/order?o=${j.orderId}`, { headers: { 'X-Order-Key': j.key } })).json();
  assert.equal(view.order.items[0].left, 0);
  assert.equal(s.lines('downloads').length, 2);
});

test('shop: expired links are refused', async (t) => {
  const s = await start({ dlTtl: -1 }); t.after(s.close);
  const { j } = await buy(s);
  const a = await (await s.call('/api/shop/download-link', { method: 'POST', json: { o: j.orderId, item: 'fmcg-market-entry-brief' }, headers: { 'X-Order-Key': j.key } })).json();
  assert.equal((await s.call(a.url)).status, 403);
});

test('privacy request is logged with a 30-day due date; rate limiting kicks in', async (t) => {
  const s = await start({ rate: { form: [3, 3600e3], shop: [30, 3600e3], dl: [60, 3600e3], read: [240, 600e3] } }); t.after(s.close);
  const r = await (await s.call('/api/privacy/request', { method: 'POST', json: { email: 'a@b.co', type: 'deletion', lang: 'en' } })).json();
  assert.match(r.ref, /^PDP-/); assert.ok(new Date(r.dueBy) > new Date());
  await s.call('/api/privacy/request', { method: 'POST', json: { email: 'a@b.co', type: 'access' } });
  await s.call('/api/privacy/request', { method: 'POST', json: { email: 'a@b.co', type: 'access' } });
  assert.equal((await s.call('/api/privacy/request', { method: 'POST', json: { email: 'a@b.co', type: 'access' } })).status, 429);
});

test('invoice: sequential number and a ZATCA phase-1 QR that decodes to seller, VAT no., time, total and VAT', async (t) => {
  const s = await start(); t.after(s.close);
  const place = async () => (await (await s.call('/api/shop/checkout', { method: 'POST', json: { items: ['fmcg-market-entry-brief'], buyer, consent: okConsent, lang: 'en' } })).json());
  const a = await place(), b = await place();
  const inv = await (await s.call(`/api/shop/invoice?o=${a.orderId}&k=${a.key}`)).text();
  assert.match(inv, /INV-000001/); assert.match(inv, /<svg/); assert.match(inv, /simulated/i);
  const inv2 = await (await s.call(`/api/shop/invoice?o=${b.orderId}&k=${b.key}`)).text(); assert.match(inv2, /INV-000002/);
  const { orders } = s.app; const o = orders.get(a.orderId);
  assert.equal(o.total, 862.5); assert.equal(o.vat, 112.5);
  const buf = Buffer.from(s.app.zatcaQr(o), 'base64'), f = {}; for (let i = 0; i < buf.length;) { f[buf[i]] = buf.subarray(i + 2, i + 2 + buf[i + 1]).toString(); i += 2 + buf[i + 1]; }
  assert.deepEqual([f[1], f[4], f[5]], ['Growth Blueprint', '862.50', '112.50']); assert.match(f[3], /^\d{4}-\d\d-\d\dT[\d:]+Z$/); assert.ok(f[2]);
});

test('admin console is off by default, needs the token, exports CSV (formula-safe) and updates privacy requests', async (t) => {
  const off = await start(); t.after(off.close);
  assert.equal((await off.call('/admin')).status, 404);
  const s = await start({ adminToken: 'letmein-123' }); t.after(s.close);
  assert.equal((await s.call('/admin')).status, 200);
  assert.equal((await s.call('/api/admin/data?kind=leads')).status, 401);
  assert.equal((await s.call('/api/admin/data?kind=leads', { headers: { Authorization: 'Bearer wrong' } })).status, 401);
  await s.call('/api/lead', { method: 'POST', json: { type: 'enquiry', lang: 'en', source: '=cmd|calc', contact: { name: 'A', email: 'a@example.com' }, consent: { processing: true } } });
  const H = { Authorization: 'Bearer letmein-123' };
  const d = await (await s.call('/api/admin/data?kind=leads', { headers: H })).json(); assert.equal(d.count, 1);
  const csv = await (await s.call('/api/admin/data?kind=leads&format=csv', { headers: H })).text(); assert.ok(csv.includes('"\'=cmd|calc"'), 'formula prefix neutralised');
  const pr = await (await s.call('/api/privacy/request', { method: 'POST', json: { email: 'p@example.com', type: 'access', lang: 'en' } })).json();
  assert.equal((await s.call('/api/admin/privacy-status', { method: 'POST', headers: H, json: { ref: pr.ref, status: 'done' } })).status, 200);
  const list = await (await s.call('/api/admin/data?kind=privacy', { headers: H })).json(); assert.equal(list.rows.find((r) => r.ref === pr.ref).status, 'done');
});

test('mail provider: with a webhook configured, messages are handed over and logged; without one they stay in the outbox', async (t) => {
  const got = [];
  const hook = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { got.push(JSON.parse(b)); res.end('ok'); }); });
  await new Promise((r) => hook.listen(0, '127.0.0.1', r)); t.after(() => hook.close());
  process.env.MAIL_WEBHOOK_URL = `http://127.0.0.1:${hook.address().port}/`; process.env.MAIL_FROM = 'hello@example.com';
  const s = await start({ mailProvider: 'webhook' }); t.after(s.close);
  const r = await (await s.call('/api/lead', { method: 'POST', json: { type: 'enquiry', lang: 'en', contact: { name: 'Sara', email: 'sara@example.com' }, consent: { processing: true } } })).json();
  assert.equal(r.delivered, true); await s.app.idle();
  assert.equal(got.length, 1); assert.equal(got[0].to, 'sara@example.com');
  assert.equal(s.lines('mail-log')[0].status, 'sent'); assert.ok(s.lines('mail-outbox').length === 1);
  delete process.env.MAIL_WEBHOOK_URL; delete process.env.MAIL_FROM;
});

test('captcha: when Turnstile is configured, forms without a valid token are refused', async (t) => {
  const s = await start({ turnstileSecret: 'x' }); t.after(s.close);
  const r = await s.call('/api/newsletter', { method: 'POST', json: { email: 'a@example.com', consent: true, lang: 'en' } });
  assert.equal(r.status, 400); assert.equal((await r.json()).error, 'captcha');
});

/* ---------------- advisory sessions ---------------- */
const sbuyer = { name: 'Sara Almansour', email: 'sara@example.com', company: 'Neom Ventures' };
const sBody = (slot, extra = {}) => ({ plan: 'single', slot, buyer: sbuyer, topic: 'Entry route for a healthcare clinic', consent: { privacy: true, terms: true, marketing: false }, lang: 'en', ...extra });
async function firstSlots(s, n = 3) { const a = await (await s.call('/api/sessions/availability?days=21')).json(); return a.days.flatMap((d) => d.slots).slice(0, n); }

test('sessions: slots follow the rules (Sunday to Thursday, 24h lead, nothing on blackout dates)', async (t) => {
  const s = await start(); t.after(s.close);
  const a = await (await s.call('/api/sessions/availability?days=28')).json(); assert.ok(a.days.length >= 10);
  for (const d of a.days) { const dow = new Date(d.date + 'T00:00:00Z').getUTCDay(); assert.ok(dow <= 4, `${d.date} is a Friday or Saturday`); for (const sl of d.slots) assert.ok(Date.parse(sl) > Date.now() + 23.9 * 36e5); }
  const first = a.days[0].date; const b = await start({ sess: { blackout: first } }); t.after(b.close);
  assert.ok(!(await (await b.call('/api/sessions/availability?days=28')).json()).days.some((d) => d.date === first));
  const c = await (await s.call('/api/sessions/config')).json(); assert.equal(c.plans.single.n, 1); assert.equal(c.plans.bundle.n, 3); assert.equal(c.pay, 'demo');
});

test('sessions: booking validates input, takes payment (simulated), blocks double booking, issues invoice, ICS and CRM event', async (t) => {
  const s = await start(); t.after(s.close);
  const [slot, slot2] = await firstSlots(s, 2);
  const post = (b) => s.call('/api/sessions/book', { method: 'POST', json: b });
  assert.equal((await post(sBody(slot, { consent: { privacy: true, terms: false } }))).status, 400);
  assert.equal((await post(sBody(slot, { consent: { privacy: false, terms: true } }))).status, 400);
  assert.equal((await post(sBody('2030-01-01T09:30:00.000Z'))).status, 400);
  assert.equal((await post(sBody(slot.replace(/:\d\d\.000Z$/, ':01.000Z')))).status, 400, 'off-grid time');
  assert.equal((await post(sBody(slot, { plan: 'free' }))).status, 400);
  const ok = await (await post(sBody(slot, { price: 1, total: 1 }))).json(); assert.equal(ok.status, 'paid'); assert.equal(ok.total, 1725); // 1500 + 15% VAT, client price ignored
  assert.equal((await post(sBody(slot))).status, 409, 'same slot cannot be booked twice');
  const o = await (await s.call(`/api/sessions/order?o=${ok.id}`, { headers: { 'x-order-key': ok.key } })).json(); assert.equal(o.order.bookings[0].slot, slot); assert.equal(o.order.credits, 0);
  assert.equal((await s.call(`/api/sessions/order?o=${ok.id}`, { headers: { 'x-order-key': 'nope' } })).status, 404);
  const ics = await (await s.call(`/api/sessions/ics?o=${ok.id}&k=${ok.key}&n=1`)).text(); assert.match(ics, /BEGIN:VEVENT/); assert.match(ics, /DTSTART:\d{8}T\d{6}Z/);
  const inv = await (await s.call(`/api/shop/invoice?o=${ok.id}&k=${ok.key}`)).text(); assert.match(inv, /INV-000001/); assert.match(inv, /Advisory session/); assert.match(inv, /<svg/);
  assert.equal(s.lines('consents').filter((c) => c.order === ok.id).map((c) => c.type).sort().join(), 'session-privacy,session-terms');
  await s.app.idle(); assert.ok(s.lines('crm-outbox').some((r) => r.evt && r.evt.event === 'session.booked'));
  assert.ok(!(await firstSlots(s, 40)).includes(slot), 'taken slot disappears from availability'); void slot2;
});

test('sessions: a bundle gives three sessions, scheduled one by one, and reschedule closes 24h before', async (t) => {
  const s = await start(); t.after(s.close);
  const [a, b, c, d] = await firstSlots(s, 4);
  const r = await (await s.call('/api/sessions/book', { method: 'POST', json: sBody(a, { plan: 'bundle' }) })).json(); assert.equal(r.total, 4485); // 3900 + VAT
  const H = { 'x-order-key': r.key }, sch = (slot) => s.call('/api/sessions/schedule', { method: 'POST', headers: H, json: { o: r.id, slot } });
  assert.equal((await (await s.call(`/api/sessions/order?o=${r.id}`, { headers: H })).json()).order.credits, 2);
  assert.equal((await sch(b)).status, 200); assert.equal((await sch(b)).status, 409); assert.equal((await sch(c)).status, 200); assert.equal((await sch(d)).status, 403, 'no credits left');
  assert.equal((await s.call('/api/sessions/schedule', { method: 'POST', headers: { 'x-order-key': 'bad' }, json: { o: r.id, slot: d } })).status, 404);
  const rs = await s.call('/api/sessions/reschedule', { method: 'POST', headers: H, json: { o: r.id, n: 3, slot: d } }); assert.equal(rs.status, 200);
  assert.equal((await (await s.call(`/api/sessions/order?o=${r.id}`, { headers: H })).json()).order.bookings[2].slot, d);
  const late = await start({ sess: { leadHours: 0, rescheduleHours: 24 * 400 } }); t.after(late.close);
  const [x, y] = await firstSlots(late, 2); const lr = await (await late.call('/api/sessions/book', { method: 'POST', json: sBody(x) })).json();
  assert.equal((await late.call('/api/sessions/reschedule', { method: 'POST', headers: { 'x-order-key': lr.key }, json: { o: lr.id, n: 1, slot: y } })).status, 403);
});

test('payments: with a provider configured the order stays pending until the provider says paid for the right amount', async (t) => {
  const inv = { id: 'inv_1', status: 'initiated', amount: 0, currency: 'SAR' }, seen = [];
  const mock = http.createServer((req, res) => { let b = ''; req.on('data', (c) => (b += c)); req.on('end', () => { seen.push([req.method, req.url, req.headers.authorization]); res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST' && req.url === '/invoices') { const j = JSON.parse(b); inv.amount = j.amount; res.end(JSON.stringify({ id: inv.id, url: 'https://pay.example/inv_1', status: 'initiated' })); } else if (req.url === '/invoices/inv_1') res.end(JSON.stringify(inv)); else { res.statusCode = 404; res.end('{}'); } }); });
  await new Promise((r) => mock.listen(0, '127.0.0.1', r)); t.after(() => mock.close());
  const s = await start({ payProvider: 'moyasar', payKey: 'sk_test_x', payApi: `http://127.0.0.1:${mock.address().port}`, demoPayments: false }); t.after(s.close);
  const [slot] = await firstSlots(s, 1);
  const r = await (await s.call('/api/sessions/book', { method: 'POST', json: sBody(slot) })).json();
  assert.equal(r.status, 'pending'); assert.equal(r.redirect, 'https://pay.example/inv_1'); assert.equal(inv.amount, 172500, 'amount in halalas, set by the server');
  assert.match(seen[0][2], /^Basic /);
  const ver = () => s.call('/api/pay/verify', { method: 'POST', headers: { 'x-order-key': r.key }, json: { o: r.id } }).then((x) => x.json());
  assert.equal((await ver()).status, 'pending');
  assert.equal((await s.call(`/api/shop/invoice?o=${r.id}&k=${r.key}`)).status, 404, 'no invoice before payment');
  inv.status = 'paid'; inv.amount = 100; assert.equal((await ver()).status, 'pending', 'wrong amount is not accepted');
  inv.amount = 172500; assert.equal((await ver()).status, 'paid');
  assert.equal((await s.call(`/api/shop/invoice?o=${r.id}&k=${r.key}`)).status, 200);
  const b = await (await s.call('/api/shop/checkout', { method: 'POST', json: { items: ['fmcg-market-entry-brief'], buyer, consent: okConsent, lang: 'en' } })).json(); assert.equal(b.status, 'pending');
  const dl = await s.call('/api/shop/download-link', { method: 'POST', headers: { 'x-order-key': b.key }, json: { o: b.orderId, item: 'fmcg-market-entry-brief' } }); assert.equal(dl.status, 404, 'no download before payment');
  const off = await start({ demoPayments: false }); t.after(off.close); assert.equal((await off.call('/api/sessions/book', { method: 'POST', json: sBody(slot) })).status, 501);
});
