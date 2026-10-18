// Exports all website copy to Markdown, straight from the built pages, so the documents always match what visitors read.
//   node build.mjs && node scripts/export-content.mjs        ->  CONTENT-EN.md and CONTENT-AR.md
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SERVICES } from '../src/services.mjs';
import { INDUSTRIES } from '../src/industries.mjs';
import { ARTICLES } from '../src/pages.mjs';
import { PRODUCTS } from '../src/shop.mjs';
import { SC_PAGE, SC_UI, SC_DIMS, SC_BANDS, SC_REPORT, SC_STAGE_PLAN, SC_SECTOR_NOTE, SC_RESULT } from '../src/scorecard.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pw = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright').catch(() => import(pathToFileURL('/opt/node-tools/node_modules/playwright/index.mjs').href));
const chromium = pw.chromium || pw.default.chromium;

const pages = [
  ['Home', ''], ['Services overview', 'services/'], ...SERVICES.map((s) => [`Service: ${s.title.en}`, `services/${s.slug}/`]),
  ['Industries overview', 'industries/'], ...INDUSTRIES.map((i) => [`Industry: ${i.title.en}`, `industries/${i.slug}/`]),
  ['Our Approach', 'our-approach/'], ['About', 'about/'], ['Entering Saudi Arabia', 'entering-saudi-arabia/'], ['Growing in Saudi Arabia', 'growing-in-saudi-arabia/'],
  ['Insights', 'insights/'], ...ARTICLES.map((a) => [`Article: ${a.title.en}`, `insights/${a.slug}/`]),
  ['Readiness Scorecard: introduction', 'readiness-scorecard/'], ['Readiness Checklist', 'readiness-checklist/'],
  ['Briefs shop', 'shop/'], ...PRODUCTS.map((p) => [`Brief: ${p.title.en}`, `shop/${p.slug}/`]), ['Basket', 'shop/basket/'], ['Checkout', 'shop/checkout/'], ['Order page', 'shop/order/'],
  ['Book a meeting', 'book-a-meeting/'], ['Enquiry form', 'enquiry/'], ['Enquiry confirmation', 'enquiry/confirmation/'],
  ['Newsletter confirmed', 'newsletter/confirmed/'], ['Newsletter unsubscribed', 'newsletter/unsubscribed/'], ['Privacy Notice', 'privacy/'], ['Terms of Use', 'terms/'], ['Cookie Policy', 'cookies/']
];

/** Runs in the page: converts <main> (or a given root) to Markdown, block by block. */
function toMarkdown(rootSel) {
  const BLOCK = new Set(['DIV', 'SECTION', 'ARTICLE', 'UL', 'OL', 'LI', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'TABLE', 'FORM', 'DETAILS', 'FIGURE', 'NAV', 'ASIDE', 'DL', 'BLOCKQUOTE', 'FIELDSET', 'HEADER', 'FOOTER', 'MAIN']);
  const out = [];
  const clean = (t) => t.replace(/\s+/g, ' ').trim();
  const hidden = (el) => { if (el.hidden || el.getAttribute('aria-hidden') === 'true') return true; const s = getComputedStyle(el); return s.display === 'none' || s.visibility === 'hidden'; };
  const hasBlock = (el) => [...el.children].some((c) => BLOCK.has(c.tagName) || c.matches('a.btn, button, select, input, textarea, details, table') || hasBlock(c));
  const leaf = (el) => {
    const c = el.cloneNode(true); c.querySelectorAll('svg, script, style, img, .sr-only, .hp').forEach((n) => n.remove()); return clean(c.textContent);
  };
  (function walk(el) {
    for (const n of el.children) {
      if (['SCRIPT', 'STYLE', 'SVG', 'NOSCRIPT', 'IMG', 'PICTURE', 'HEADER'].includes(n.tagName) && !(n.tagName === 'HEADER' && n.closest('main'))) continue;
      if (n.classList.contains('hp') || n.classList.contains('cookie') || n.classList.contains('skip') || n.matches('.wow__ring, .wow__bars, .wow__pills, .wow__coords, .wow__cue, .skyline')) continue;
      if (hidden(n)) continue;
      const tag = n.tagName;
      if (/^H[1-5]$/.test(tag)) { const t = leaf(n); if (t) out.push('#'.repeat(Math.min(+tag[1] + 0, 4)) + ' ' + t); continue; }
      if (tag === 'DETAILS') { const s = n.querySelector('summary'), a = n.querySelector('.faq__a'); out.push('**' + leaf(s) + '**'); if (a) out.push(leaf(a)); continue; }
      if (tag === 'TABLE') { for (const r of n.querySelectorAll('tr')) out.push('| ' + [...r.children].map((c) => leaf(c)).join(' | ') + ' |'); out.push(''); continue; }
      if (n.matches('a.btn, a.more, button.btn')) { const t = leaf(n); if (t) out.push('**[ ' + t + ' ]**'); continue; }
      if (tag === 'SELECT') { out.push('(choose: ' + [...n.options].map((o) => clean(o.textContent)).filter(Boolean).join(' / ') + ')'); continue; }
      if (tag === 'INPUT' || tag === 'TEXTAREA') continue;
      if (tag === 'LI' && !hasBlock(n)) { const t = leaf(n); if (t) out.push('- ' + t); continue; }
      if (!hasBlock(n)) { const t = leaf(n); if (t) out.push(t); continue; }
      walk(n);
    }
  })(document.querySelector(rootSel));
  // collapse
  const lines = []; for (const l of out) { if (lines[lines.length - 1] === l) continue; lines.push(l); }
  return lines.map((l, i) => (/^(- |\| )/.test(l) && /^(- |\| )/.test(lines[i + 1] || '') ? l : l + '\n')).join('\n');
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const pg = await ctx.newPage();

const scBlock = (lang) => {
  const t = (v) => v[lang], A = [];
  A.push('# Readiness Scorecard: questions, bands and report library (rendered by script)\n');
  A.push('## Context questions\n' + [SC_UI.ctx.sector, SC_UI.ctx.stage, SC_UI.ctx.size].map(t).join('\n- '));
  A.push('Stages: ' + SC_UI.ctx.stages.map(t).join(' / ') + '\nSizes: ' + SC_UI.ctx.sizes.map(t).join(' / '));
  A.push('## Answer scale\n' + SC_UI.scale.map(t).join(' / ') + ' / ' + t(SC_UI.unsure) + '\n\n' + t(SC_UI.q));
  SC_DIMS.forEach((d, i) => { A.push(`## Part ${i + 2}: ${t(d.t)}\n${t(d.d)}\n\n` + d.q.map((q, j) => `${i * 4 + j + 1}. ${t(q)}`).join('\n')); });
  A.push('## Result bands\n' + SC_BANDS.map((b) => `**${t(b.t)}** (from ${b.min})\n\n${t(b.p)}`).join('\n\n'));
  A.push('## What each area says at each level');
  for (const d of SC_DIMS) for (const lv of ['low', 'mid', 'high']) { const r = SC_REPORT[d.id][lv]; A.push(`### ${t(d.t)}: ${lv}\n${t(r.m)}\n\n` + r.a.map((x) => '- ' + t(x)).join('\n')); }
  A.push('## First 30 days by stage\n' + Object.entries(SC_STAGE_PLAN).map(([k, v]) => `**${t(SC_UI.ctx.stages[k])}**\n` + v.map((x) => '- ' + t(x)).join('\n')).join('\n\n'));
  A.push('## Sector notes\n' + Object.entries(SC_SECTOR_NOTE).map(([k, v]) => `- **${k}**: ${t(v)}`).join('\n'));
  A.push('## Report page labels\n' + ['eyebrow', 'overall', 'by', 'strengths', 'priorities', 'detail', 'whatItMeans', 'doNext', 'sector', 'plan'].map((k) => `- ${t(SC_RESULT[k])}`).join('\n') + '\n- ' + t(SC_RESULT.disclaimer));
  return A.join('\n\n');
};

for (const lang of ['en', 'ar']) {
  const parts = [`# Growth Blueprint Advisory: website content (${lang === 'en' ? 'English' : 'العربية'})\n`, `_Generated from the built site on ${new Date().toISOString().slice(0, 10)} by scripts/export-content.mjs. Edit the copy in src/*.mjs, not this file._\n`];
  let first = true;
  for (const [name, path] of pages) {
    await pg.goto(pathToFileURL(join(root, 'dist', lang, path, 'index.html')).href);
    await pg.waitForTimeout(150);
    const title = await pg.title();
    if (first) {
      first = false;
      const chrome = await pg.evaluate(() => {
        const nav = [...document.querySelectorAll('.main-nav a')].map((a) => a.textContent.trim());
        return { nav, cookie: document.querySelector('#cookie')?.innerText || '' };
      });
      chrome.footer = await pg.evaluate(toMarkdown, '.site-footer');
      parts.push('---\n\n# Global elements (on every page)\n\n**Navigation:** ' + chrome.nav.join(' · ') + '\n\n**Cookie notice:** ' + chrome.cookie.replace(/\s+/g, ' ') + '\n\n**Footer:**\n\n' + chrome.footer + '\n');
    }
    const md = await pg.evaluate(toMarkdown, 'main');
    parts.push(`---\n\n# PAGE: ${name}\n\n_Page title: ${title}_\n\n${md}`);
  }
  parts.push('---\n\n' + scBlock(lang));
  const file = join(root, `CONTENT-${lang.toUpperCase()}.md`);
  writeFileSync(file, parts.join('\n\n'));
  console.log(file, Math.round(parts.join('').length / 1024) + ' KB');
}
await browser.close();
