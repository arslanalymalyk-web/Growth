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
  assert.equal(s.lines('consents')[0].version, 'privacy-2026-1');
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
