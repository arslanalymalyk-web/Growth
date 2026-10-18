// Retention and erasure for the JSONL data files.
//   node scripts/retention.mjs                         dry run: shows what would be removed
//   node scripts/retention.mjs --apply                 removes it (rewrites files; a tally goes to data/retention-log.jsonl)
//   node scripts/retention.mjs --erase person@x.com    erases one person's leads, newsletter record, consents, privacy requests and outbox entries (--apply to execute)
// Periods (days) come from env: RETAIN_LEADS_DAYS=730 RETAIN_UNSUB_DAYS=365 RETAIN_LOGS_DAYS=365 RETAIN_PRIVACY_DAYS=730.
// Orders and invoices are NEVER touched here: keep them for as long as tax and accounting law requires (confirm the period with your accountant).
import { existsSync, readFileSync, writeFileSync, renameSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const dir = process.env.DATA_DIR || join(process.cwd(), 'data');
const apply = process.argv.includes('--apply');
const ei = process.argv.indexOf('--erase'); const eraseEmail = ei > -1 ? String(process.argv[ei + 1] || '').trim().toLowerCase() : '';
const days = (k, d) => Number(process.env[k] || d) * 864e5;
const cut = { leads: Date.now() - days('RETAIN_LEADS_DAYS', 730), unsub: Date.now() - days('RETAIN_UNSUB_DAYS', 365), logs: Date.now() - days('RETAIN_LOGS_DAYS', 365), privacy: Date.now() - days('RETAIN_PRIVACY_DAYS', 730) };
const eh = eraseEmail ? createHash('sha256').update(eraseEmail).digest('hex') : '';
const read = (n) => { const f = join(dir, n + '.jsonl'); return existsSync(f) ? readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean) : []; };
const old = (r, c) => Date.parse(r.ts || r.updatedAt || 0) < c;
const report = {};

const rules = {
  leads: (r) => (eh ? r.contact?.email?.toLowerCase() === eraseEmail : old(r, cut.leads)),
  newsletter: (r) => (eh ? r.emailHash === eh : r.status === 'unsubscribed' && Date.parse(r.unsubscribedAt || r.ts) < cut.unsub),
  'privacy-requests': (r) => (eh ? r.emailHash === eh : old(r, cut.privacy)),
  'mail-outbox': (r) => (eh ? String(r.to || '').toLowerCase() === eraseEmail : old(r, cut.logs)),
  'mail-log': (r) => !eh && old(r, cut.logs),
  'crm-outbox': (r) => (eh ? JSON.stringify(r).toLowerCase().includes(eraseEmail) : old(r, cut.logs)),
  downloads: (r) => !eh && old(r, cut.logs),
  consents: (r) => (eh ? r.emailHash === eh : false) // consent proof is kept for as long as the data is used; it is removed only on erasure
};
for (const [name, drop] of Object.entries(rules)) {
  const rows = read(name); const keep = rows.filter((r) => !drop(r));
  report[name] = rows.length - keep.length;
  if (apply && keep.length !== rows.length) { const f = join(dir, name + '.jsonl'); writeFileSync(f + '.tmp', keep.map((r) => JSON.stringify(r)).join('\n') + (keep.length ? '\n' : ''), { mode: 0o600 }); renameSync(f + '.tmp', f); }
}
console.log(apply ? 'Removed:' : 'Would remove (dry run, add --apply):', report);
if (apply) appendFileSync(join(dir, 'retention-log.jsonl'), JSON.stringify({ ts: new Date().toISOString(), mode: eh ? 'erase' : 'retention', subjectHash: eh.slice(0, 16), removed: report }) + '\n');
