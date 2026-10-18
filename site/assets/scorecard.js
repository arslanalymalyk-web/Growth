/* Saudi Readiness Scorecard: assessment, scoring and report. Everything runs in the browser; answers stay on this device
   unless the visitor asks to have the report emailed (then only the summary below is sent, with consent). */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var KEY = 'gba.sc.v1';
  var dataEl = $('#sc-data');
  var store = {
    get: function () { try { return JSON.parse(window.localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
    set: function (v) { try { window.localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage unavailable: progress is simply not kept */ } },
    clear: function () { try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
  };
  var el = function (tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === 'text') n.textContent = attrs[k]; else if (k === 'html') n.innerHTML = attrs[k]; else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), attrs[k]); else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k] === true ? '' : attrs[k]); });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  };

  /* ---------- Intro page: resume button ---------- */
  var saved = store.get();
  if (!dataEl) {
    var res = $('[data-sc-resume]');
    if (res && saved && saved.answers && saved.answers.some(function (a) { return a !== null && a !== undefined; }) && !saved.done) res.hidden = false;
    return;
  }

  var D = JSON.parse(dataEl.textContent);
  var NQ = D.dims.reduce(function (a, d) { return a + d.q.length; }, 0);

  /* ---------- Scoring (also used by the report) ---------- */
  function score(answers) {
    var dims = D.dims.map(function (d, di) {
      var sum = 0, flagged = [];
      d.q.forEach(function (q, qi) {
        var v = answers[di * 4 + qi];
        sum += Math.max(0, v === -1 || v == null ? 0 : v);
        if (v === -1 || v === 0 || v == null) flagged.push({ d: d.id, di: di, qi: qi, unsure: v === -1, text: q });
      });
      return { id: d.id, t: d.t, score: Math.round(sum / (d.q.length * 3) * 100), flagged: flagged, svc: d.svc };
    });
    var overall = Math.round(dims.reduce(function (a, d) { return a + d.score; }, 0) / dims.length);
    return { dims: dims, overall: overall };
  }
  var levelOf = function (s) { return s >= 70 ? 'high' : s >= 40 ? 'mid' : 'low'; };

  /* ---------- Assessment ---------- */
  if ($('#sc-app')) {
    var app = $('#sc-app'), U = D.ui, state = saved && !saved.done ? saved : { v: D.v, ctx: {}, answers: new Array(NQ).fill(null), step: 0 };
    if (state.v !== D.v || !state.answers || state.answers.length !== NQ) state = { v: D.v, ctx: {}, answers: new Array(NQ).fill(null), step: 0 };
    var total = D.dims.length + 1;
    var persist = function () { store.set(state); };

    var header = function () {
      var left = Math.max(1, Math.round((total - state.step) * 10 / total));
      return el('div', { class: 'sc-head' }, [
        el('div', { class: 'sc-head__row' }, [el('span', { class: 'sc-head__part', text: U.part + ' ' + (state.step + 1) + ' ' + U.of + ' ' + total }), el('span', { class: 'sc-head__min', text: U.min + ' ' + left + ' ' + U.minutes })]),
        el('div', { class: 'sc-bar', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(total), 'aria-valuenow': String(state.step + 1) }, [el('i', { style: 'width:' + Math.round(((state.step + 1) / total) * 100) + '%' })])
      ]);
    };
    var nav = function (valid) {
      var last = state.step === total - 1;
      var next = el('button', { type: 'button', class: 'btn btn--gold', onclick: function () { valid() ? advance() : warn(); } }, [el('span', { text: last ? U.finish : U.next })]);
      var kids = [];
      if (state.step > 0) kids.push(el('button', { type: 'button', class: 'btn btn--outline-dark', onclick: function () { state.step -= 1; persist(); draw(true); } }, [el('span', { text: U.back })]));
      kids.push(next);
      return el('div', { class: 'sc-nav' }, kids);
    };
    var warnEl = el('p', { class: 'err sc-warn', role: 'alert', hidden: true, text: U.answerAll });
    var warn = function () { warnEl.hidden = false; var f = app.querySelector('fieldset:not(.is-done)'); if (f) { f.classList.add('is-missing'); f.scrollIntoView({ block: 'center', behavior: 'smooth' }); var i = f.querySelector('input'); if (i) i.focus({ preventScroll: true }); } };
    var advance = function () {
      if (state.step < total - 1) { state.step += 1; persist(); draw(true); return; }
      var done = { v: D.v, ctx: state.ctx, answers: state.answers, done: true, at: new Date().toISOString() };
      store.set(done); window.location.href = app.getAttribute('data-results');
    };

    var ctxStep = function () {
      var sel = function (id, label, opts, key) {
        var s = el('select', { id: id, name: id, onchange: function (e) { state.ctx[key] = e.target.value; persist(); } }, [el('option', { value: '', text: U.ctx.choose })].concat(opts.map(function (o) { return el('option', { value: o.v, text: o.t, selected: String(state.ctx[key]) === String(o.v) }); })));
        return el('div', { class: 'field' }, [el('label', { for: id, text: label }), s]);
      };
      return el('div', {}, [
        el('h1', { class: 'h2', id: 'sc-t', tabindex: '-1', text: U.ctx.title }), el('p', { class: 'lead', text: U.ctx.body }),
        el('div', { class: 'sc-ctx' }, [
          sel('sc-sector', U.ctx.sector, D.sectors.map(function (s) { return { v: s.id, t: s.t }; }).concat([{ v: 'other', t: U.ctx.other }]), 'sector'),
          sel('sc-stage', U.ctx.stage, U.ctx.stages.map(function (t, i) { return { v: i, t: t }; }), 'stage'),
          sel('sc-size', U.ctx.size, U.ctx.sizes.map(function (t, i) { return { v: i, t: t }; }), 'size')
        ])
      ]);
    };

    var dimStep = function (di) {
      var d = D.dims[di], kids = [el('p', { class: 'eyebrow', text: d.t }), el('h1', { class: 'h2', id: 'sc-t', tabindex: '-1', text: d.d })];
      d.q.forEach(function (q, qi) {
        var idx = di * 4 + qi, cur = state.answers[idx], name = 'q' + idx;
        var opt = function (val, text, cls) {
          var id = name + '_' + (val === -1 ? 'u' : val);
          return el('label', { class: 'sc-opt ' + (cls || ''), for: id }, [el('input', { type: 'radio', id: id, name: name, value: String(val), checked: cur === val, onchange: function () { state.answers[idx] = val; persist(); var fs = this.closest('fieldset'); fs.classList.add('is-done'); fs.classList.remove('is-missing'); if (!app.querySelector('fieldset:not(.is-done)')) warnEl.hidden = true; } }), el('span', { text: text })]);
        };
        var opts = U.scale.map(function (t, v) { return opt(v, t); });
        kids.push(el('fieldset', { class: 'sc-q' + (cur !== null && cur !== undefined ? ' is-done' : '') }, [
          el('legend', {}, [el('span', { class: 'sc-q__n', text: (idx + 1) + '.' }), document.createTextNode(' ' + q)]),
          el('div', { class: 'sc-opts', role: 'presentation' }, opts.concat([opt(-1, U.unsure, 'sc-opt--unsure')]))
        ]));
      });
      return el('div', {}, kids);
    };

    var draw = function (focus) {
      app.textContent = ''; warnEl.hidden = true;
      var body = state.step === 0 ? ctxStep() : dimStep(state.step - 1);
      var valid = function () { return state.step === 0 ? true : !app.querySelector('fieldset:not(.is-done)'); };
      app.appendChild(header()); app.appendChild(body); app.appendChild(warnEl); app.appendChild(nav(valid)); app.appendChild(el('p', { class: 'sc-saved', text: U.saved }));
      if (focus) { var t = $('#sc-t'); if (t) { t.focus({ preventScroll: true }); window.scrollTo({ top: Math.max(0, app.getBoundingClientRect().top + window.scrollY - 110), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); } }
    };
    draw(false);
    return;
  }

  /* ---------- Report ---------- */
  var root = $('#sc-report'), R = D.r;
  var run = store.get();
  if (!run || !run.done || !run.answers || run.answers.length !== NQ) {
    root.appendChild(el('div', { class: 'sc-empty' }, [el('h1', { class: 'h2', text: R.none }), el('a', { class: 'btn btn--gold', href: R.start && D.urls.assess }, [el('span', { text: R.start })])]));
    return;
  }
  var S = score(run.answers), band = D.bands.slice().reverse().find(function (b) { return S.overall >= b.min; });
  var ctx = run.ctx || {}, sectorId = ctx.sector && ctx.sector !== 'other' ? ctx.sector : null;
  var sectorName = sectorId ? (D.sectors.find(function (s) { return s.id === sectorId; }) || {}).t : '';
  var stageI = ctx.stage !== undefined && ctx.stage !== '' ? Number(ctx.stage) : null;
  var sorted = S.dims.slice().sort(function (a, b) { return a.score - b.score; });
  var priorities = sorted.slice(0, 3), strengths = S.dims.filter(function (d) { return d.score >= 70; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 2);

  /* radar */
  var radar = function () {
    var n = S.dims.length, cx = 150, cy = 150, r = 100, NS = 'http://www.w3.org/2000/svg';
    var pt = function (i, k) { var a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k]; };
    var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 300 300'); svg.setAttribute('class', 'sc-radar'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', R.by + ': ' + S.dims.map(function (d) { return d.t + ' ' + d.score; }).join(', '));
    var add = function (tag, attrs) { var e = document.createElementNS(NS, tag); Object.keys(attrs).forEach(function (k) { if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }); svg.appendChild(e); return e; };
    [0.25, 0.5, 0.75, 1].forEach(function (k) { add('polygon', { points: S.dims.map(function (_, i) { return pt(i, k).join(','); }).join(' '), class: 'rg' }); });
    S.dims.forEach(function (_, i) { var p = pt(i, 1); add('line', { x1: cx, y1: cy, x2: p[0], y2: p[1], class: 'ra' }); });
    add('polygon', { points: S.dims.map(function (d, i) { return pt(i, d.score / 100).join(','); }).join(' '), class: 'rv' });
    S.dims.forEach(function (d, i) { var p = pt(i, d.score / 100); add('circle', { cx: p[0], cy: p[1], r: 3.5, class: 'rd' }); var l = pt(i, 1.2); add('text', { x: l[0], y: l[1], class: 'rl', 'text-anchor': l[0] < cx - 5 ? 'end' : l[0] > cx + 5 ? 'start' : 'middle', 'dominant-baseline': 'middle', text: d.t.split(' ')[0].replace('&', '') }); });
    return svg;
  };

  var sec = function (title, kids, cls) { return el('section', { class: 'sc-sec ' + (cls || '') }, [el('h2', { class: 'h3 h3--lg', text: title })].concat(kids)); };
  var list = function (arr, cls) { return el('ul', { class: cls || 'sc-list' }, arr.map(function (t) { return el('li', { text: t }); })); };
  var lvlClass = function (s) { return 'lv-' + levelOf(s); };

  var overall = el('div', { class: 'sc-overall' }, [
    el('div', { class: 'sc-ring', role: 'img', 'aria-label': R.overall + ': ' + S.overall + ' ' + R.outOf, html: '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" class="ring-bg"/><circle cx="60" cy="60" r="52" class="ring-fg" pathLength="100" style="--s:' + S.overall + '"/></svg><div><b></b><small></small></div>' }),
    el('div', { class: 'sc-overall__t' }, [el('p', { class: 'eyebrow', text: R.overall }), el('h2', { class: 'h2', text: band.t }), el('p', { class: 'lead', text: band.p }),
      sectorName || stageI !== null ? el('p', { class: 'sc-ctxline', text: [sectorName, stageI !== null ? D.ui.ctx.stages[stageI] : ''].filter(Boolean).join('  ·  ') }) : null])
  ]);
  overall.querySelector('.sc-ring b').textContent = String(S.overall); overall.querySelector('.sc-ring small').textContent = R.outOf;

  var bars = el('ul', { class: 'sc-bars' }, S.dims.map(function (d) { return el('li', { class: lvlClass(d.score) }, [el('span', { text: d.t }), el('i', {}, [el('b', { style: 'width:' + d.score + '%' })]), el('em', { text: String(d.score) })]); }));
  var scoreBlock = el('div', { class: 'sc-scores' }, [radar(), el('div', {}, [el('h2', { class: 'h3', text: R.by }), bars])]);

  var parts = [overall, scoreBlock];
  parts.push(el('div', { class: 'sc-two' }, [
    sec(R.strengths, [strengths.length ? el('ul', { class: 'sc-list sc-list--good' }, strengths.map(function (d) { return el('li', {}, [el('b', { text: d.t + ' · ' + d.score + '. ' }), document.createTextNode(D.report[d.id].high.m)]); })) : el('p', { text: R.noStrength })]),
    sec(R.priorities, [el('ol', { class: 'sc-list sc-list--gap' }, priorities.map(function (d) { return el('li', {}, [el('b', { text: d.t + ' · ' + d.score })]); }))])
  ]));

  var detail = S.dims.map(function (d) {
    var lv = levelOf(d.score), rp = D.report[d.id][lv];
    return el('article', { class: 'sc-dim ' + lvlClass(d.score) }, [
      el('header', {}, [el('h3', { class: 'h4', text: d.t }), el('span', { class: 'sc-chip', text: R.levels[lv] + ' · ' + d.score })]),
      el('h4', { class: 'sc-k', text: R.whatItMeans }), el('p', { text: rp.m }),
      el('h4', { class: 'sc-k', text: R.doNext }), list(rp.a)
    ]);
  });
  parts.push(sec(R.detail, [el('div', { class: 'sc-dims-detail' }, detail)]));

  var flagged = []; S.dims.forEach(function (d) { d.flagged.forEach(function (f) { flagged.push(f); }); });
  var order = {}; sorted.forEach(function (d, i) { order[d.id] = i; });
  flagged.sort(function (a, b) { return (a.unsure === b.unsure ? 0 : a.unsure ? -1 : 1) || order[a.d] - order[b.d]; });
  if (flagged.length) parts.push(sec(R.flagged.t, [el('p', { text: R.flagged.d }), el('ul', { class: 'sc-list sc-list--flag' }, flagged.slice(0, 7).map(function (f) { return el('li', { text: f.text }); }))]));

  var extras = [];
  if (stageI !== null && D.stagePlan[stageI]) extras.push(sec(R.plan, [el('ol', { class: 'sc-list sc-list--plan' }, D.stagePlan[stageI].map(function (t) { return el('li', { text: t }); }))], 'sc-sec--half'));
  if (sectorId && D.sectorNote[sectorId]) extras.push(sec(R.sector, [el('p', { text: D.sectorNote[sectorId] })].concat(D.briefs[sectorId] ? [el('p', {}, [el('a', { class: 'more', href: D.briefs[sectorId].href }, [el('span', { text: D.briefs[sectorId].t + ' · ' + R.brief.cta })])])] : []), 'sc-sec--half'));
  if (extras.length) parts.push(el('div', { class: 'sc-two' }, extras));

  var svcIds = []; priorities.forEach(function (d) { d.svc.forEach(function (s) { if (svcIds.indexOf(s) < 0) svcIds.push(s); }); });
  parts.push(sec(R.help.t, [el('p', { text: R.help.d }), el('ul', { class: 'sc-svc' }, svcIds.slice(0, 4).map(function (s) { return el('li', {}, [el('a', { href: D.services[s].href, text: D.services[s].t })]); }))]));

  /* email my report: consent first, nothing is sent otherwise */
  var E = R.email;
  var form = el('form', { class: 'form sc-mail', novalidate: true, 'data-sc-mail': true }, [
    el('h2', { class: 'h3', text: E.t }), el('p', { text: E.d }),
    el('input', { type: 'text', name: 'website', tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true', class: 'hp' }),
    el('div', { class: 'fgrid' }, [
      el('div', { class: 'field' }, [el('label', { for: 'sm-name', text: E.name }), el('input', { id: 'sm-name', name: 'name', type: 'text', autocomplete: 'name' })]),
      el('div', { class: 'field' }, [el('label', { for: 'sm-mail', text: E.mail }), el('input', { id: 'sm-mail', name: 'email', type: 'email', autocomplete: 'email', dir: 'ltr' })])
    ]),
    el('div', { class: 'field' }, [el('label', { for: 'sm-co', text: E.company }), el('input', { id: 'sm-co', name: 'company', type: 'text', autocomplete: 'organization' })]),
    el('label', { class: 'check' }, [el('input', { type: 'checkbox', name: 'consent' }), el('span', { class: 'check__b', 'aria-hidden': 'true', html: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>' }), el('span', {}, [document.createTextNode(E.consent + ' '), el('a', { href: D.urls.privacy, text: '' })])]),
    el('label', { class: 'check' }, [el('input', { type: 'checkbox', name: 'marketing' }), el('span', { class: 'check__b', 'aria-hidden': 'true', html: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>' }), el('span', { text: E.marketing })]),
    el('p', { class: 'err', role: 'alert', hidden: true, 'data-mail-err': true }),
    el('p', { class: 'sc-mail__ok', role: 'status', hidden: true, 'data-mail-ok': true }),
    el('button', { type: 'submit', class: 'btn btn--gold' }, [el('span', { text: E.send })])
  ]);
  var pl = form.querySelector('.check a'); pl.textContent = E.plink;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var err = form.querySelector('[data-mail-err]'), ok = form.querySelector('[data-mail-ok]'); err.hidden = true;
    var name = form.elements.name.value.trim(), mail = form.elements.email.value.trim();
    var bad = function (m, f) { err.textContent = m; err.hidden = false; f.focus(); };
    var msgs = D.lang === 'ar' ? { name: 'يرجى إدخال اسمك.', email: 'يرجى إدخال بريد إلكتروني صحيح.', consent: 'يرجى تأكيد موافقتك للمتابعة.', server: 'حدث خطأ. يرجى المحاولة مرة أخرى.' } : { name: 'Please enter your name.', email: 'Please enter a valid email address.', consent: 'Please confirm your consent to continue.', server: 'Something went wrong. Please try again.' };
    if (!name) return bad(msgs.name, form.elements.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) return bad(msgs.email, form.elements.email);
    if (!form.elements.consent.checked) return bad(msgs.consent, form.elements.consent);
    var btn = form.querySelector('button'); btn.disabled = true;
    var summary = { overall: S.overall, band: band.id, sector: sectorId || '', stage: stageI === null ? '' : String(stageI), scores: S.dims.map(function (d) { return d.id + ':' + d.score; }).join(','), priorities: priorities.map(function (d) { return d.id; }).join(','), version: D.v };
    window.GBA.post('/api/lead', { type: 'scorecard', lang: D.lang, source: 'scorecard', website: form.elements.website.value, contact: { name: name, email: mail, company: form.elements.company.value.trim() }, data: summary, consent: { processing: true, marketing: form.elements.marketing.checked } }).then(function (r) {
      btn.disabled = false;
      if (r.ok) { ok.textContent = E.done + ' (' + r.data.ref + ')'; ok.hidden = false; form.reset(); }
      else if (r.demo) { ok.textContent = E.demo; ok.hidden = false; }
      else bad(msgs.server, form.elements.email);
    });
  });
  parts.push(el('div', { class: 'sc-two sc-two--cta' }, [
    el('section', { class: 'sc-cta' }, [el('h2', { class: 'h3', text: R.cta.t }), el('p', { text: R.cta.d }), el('a', { class: 'btn btn--gold', href: D.urls.book }, [el('span', { text: R.book })])]),
    form
  ]));
  parts.push(el('div', { class: 'sc-foot' }, [
    el('p', { class: 'sc-disc', text: R.disclaimer }),
    el('p', { class: 'sc-gen', text: R.generated + ' · ' + R.on + ' ' + new Date(run.at || Date.now()).toLocaleDateString(D.lang === 'ar' ? 'ar-SA' : 'en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) })
  ]));

  var top = el('div', { class: 'sc-top' }, [
    el('div', {}, [el('p', { class: 'eyebrow', text: D.lang === 'ar' ? 'غروث بلوبرينت' : 'Growth Blueprint' }), el('h1', { class: 'h2', text: R.eyebrow })]),
    el('div', { class: 'sc-top__act' }, [
      el('button', { type: 'button', class: 'btn btn--outline-dark btn--sm', onclick: function () { window.print(); } }, [el('span', { text: R.print })]),
      el('a', { class: 'btn btn--outline-dark btn--sm', href: D.urls.assess, onclick: function () { store.clear(); } }, [el('span', { text: R.retake })])
    ])
  ]);
  root.appendChild(top); parts.forEach(function (p) { root.appendChild(p); });
  var h1 = root.querySelector('h1'); if (h1) h1.setAttribute('tabindex', '-1');
})();
