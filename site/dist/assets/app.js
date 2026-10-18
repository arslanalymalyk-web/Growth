/* Growth Blueprint Advisory: progressive enhancement. The site is fully readable without JavaScript. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* Shared helpers. API calls fall back to "demo mode" when no server is reachable (static hosting, file://). */
  var GBA = window.GBA = {
    versions: { privacy: 'privacy-2026-1', marketing: 'marketing-2026-1', licence: 'licence-2026-1' },
    lang: document.documentElement.lang === 'ar' ? 'ar' : 'en',
    post: function (path, body, headers) {
      var h = { 'Content-Type': 'application/json' }; if (headers) for (var k in headers) h[k] = headers[k];
      return fetch(path, { method: 'POST', headers: h, body: JSON.stringify(body) }).then(function (r) {
        return r.json().then(function (j) { return { ok: r.ok && j.ok !== false, status: r.status, data: j, demo: false }; }, function () { return { ok: false, status: r.status, data: null, demo: r.status === 404 || r.status === 405 || r.status === 501 }; });
      }).catch(function () { return { ok: false, status: 0, data: null, demo: true }; });
    },
    get: function (path, headers) {
      return fetch(path, { headers: headers || {} }).then(function (r) { return r.json().then(function (j) { return { ok: r.ok && j.ok !== false, status: r.status, data: j }; }, function () { return { ok: false, status: r.status, data: null, demo: r.status === 404 || r.status === 501 }; }); }).catch(function () { return { ok: false, status: 0, data: null, demo: true }; });
    },
    basket: function () { try { var b = JSON.parse(window.localStorage.getItem('gba.basket') || '[]'); return Array.isArray(b) ? b : []; } catch (e) { return []; } },
    setBasket: function (b) { try { window.localStorage.setItem('gba.basket', JSON.stringify(b)); } catch (e) { /* unavailable */ } GBA.badge(); },
    badge: function () { var n = GBA.basket().length; document.querySelectorAll('[data-basket-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; }); }
  };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* Mobile navigation */
  var toggle = $('.nav-toggle'), nav = $('#main-nav');
  if (toggle && nav) {
    var close = function () { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.matchMedia('(min-width: 1221px)').addEventListener('change', close);
  }

  /* Scroll reveal */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var targets = $$('.tile, .card, .step, .post, .icard, .photo-tile, .rel, .jstep__c, .jblock, .why li, .principles li, .rbox, .trust li, .deliv li, .proc li, .ch li, .ck, .irow, .path');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (t, i) { t.classList.add('rv'); t.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(t); });
  }

  /* Cookie notice (choice stored locally; nothing is loaded either way in this demo) */
  var cookie = $('#cookie');
  if (cookie && !store.get('gba.cookie')) {
    cookie.hidden = false;
    $$('[data-cookie]', cookie).forEach(function (b) {
      b.addEventListener('click', function () { store.set('gba.cookie', b.getAttribute('data-cookie')); cookie.hidden = true; });
    });
  }

  /* Insights filter */
  var chips = $$('.fchip');
  if (chips.length) {
    var rows = $$('.irow'), empty = $('#iempty');
    chips.forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-filter'), shown = 0;
        chips.forEach(function (x) { var on = x === c; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
        rows.forEach(function (r) { var ok = f === 'all' || r.getAttribute('data-cat') === f; r.hidden = !ok; if (ok) shown++; });
        if (empty) empty.hidden = shown > 0;
      });
    });
  }

  /* Readiness checklist */
  var boxes = $$('.ck input[type=checkbox]');
  if (boxes.length) {
    var KEY = 'gba.checklist.v1', saved = {};
    try { saved = JSON.parse(store.get(KEY) || '{}'); } catch (e) { saved = {}; }
    var update = function () {
      var done = 0;
      $$('.ck').forEach(function (area) {
        var inputs = $$('input', area), n = inputs.filter(function (i) { return i.checked; }).length;
        var c = $('[data-count]', area); if (c) c.textContent = n; done += n;
      });
      var pct = Math.round((done / boxes.length) * 100);
      $('#ckPct').textContent = pct + '%'; $('#ckFill').style.width = pct + '%'; $('#ckBar').setAttribute('aria-valuenow', String(pct));
    };
    boxes.forEach(function (b) {
      var q = b.getAttribute('data-q'); if (saved[q]) b.checked = true;
      b.addEventListener('change', function () { saved[q] = b.checked; store.set(KEY, JSON.stringify(saved)); update(); });
    });
    var reset = $('[data-ck-reset]');
    if (reset) reset.addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); saved = {}; store.set(KEY, '{}'); update(); });
    update();
  }
  $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  /* WOW hero: pointer parallax, scroll drift, score count-up */
  var wow = $('.wow');
  if (wow && !reduce) {
    var raf = 0, tx = 0, ty = 0;
    var apply = function () { raf = 0; wow.style.setProperty('--mx', tx.toFixed(3)); wow.style.setProperty('--my', ty.toFixed(3)); };
    if (window.matchMedia('(hover: hover) and (min-width: 981px)').matches) {
      wow.addEventListener('pointermove', function (e) { var r = wow.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5; if (!raf) raf = requestAnimationFrame(apply); });
    }
    var sy = 0, onScroll = function () { sy = Math.min(window.scrollY, 900); wow.style.setProperty('--sy', String(sy)); };
    window.addEventListener('scroll', function () { requestAnimationFrame(onScroll); }, { passive: true });
  }
  $$('[data-count]').forEach(function (el) {
    var to = Number(el.getAttribute('data-count')) || 0;
    if (reduce) { el.textContent = to; return; }
    el.textContent = '0';
    setTimeout(function () {
      var t0 = performance.now(), dur = 1700;
      (function step(t) { var k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0);
    }, 2400);
  });

  /* Simple form validation helpers */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var msgFor = function (field) { return $('.err', field.closest('.field')); };
  var setInvalid = function (el, bad, msgText) {
    var wrap = el.closest('.field'); if (!wrap) return;
    wrap.classList.toggle('is-invalid', bad); el.setAttribute('aria-invalid', bad ? 'true' : 'false');
    var m = $('.err', wrap);
    if (m) { if (msgText) m.textContent = msgText; m.hidden = !bad; if (bad && m.id) el.setAttribute('aria-describedby', m.id); }
  };
  var valid = function (el) {
    if (el.type === 'email') return EMAIL.test(el.value.trim());
    return el.value.trim() !== '';
  };
  var lang = document.documentElement.lang === 'ar' ? 'ar' : 'en';
  var T = { req: lang === 'ar' ? 'هذا الحقل مطلوب.' : 'This field is required.', email: lang === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.' };

  /* Booking request form (demo: validates, then shows the demo confirmation page) */
  var demo = $('[data-demo-form]');
  if (demo) {
    var req = $$('[required]', demo);
    req.forEach(function (el, i) { var m = msgFor(el); if (m) m.id = 'derr' + i; });
    // Errors are added on blur but only cleared while typing, so the layout never shifts under a click on the submit button.
    req.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value !== '' && !valid(el)) setInvalid(el, true, el.type === 'email' ? T.email : T.req); });
      el.addEventListener('input', function () { if (el.closest('.field').classList.contains('is-invalid') && valid(el)) setInvalid(el, false); });
      el.addEventListener('change', function () { if (el.closest('.field').classList.contains('is-invalid') && valid(el)) setInvalid(el, false); });
    });
    demo.addEventListener('submit', function (e) {
      e.preventDefault(); var first = null;
      req.forEach(function (el) { var bad = !valid(el); setInvalid(el, bad, el.type === 'email' ? T.email : T.req); if (bad && !first) first = el; });
      var cons = $('input[name=consent]', demo), cerr = $('[data-consent-err]', demo);
      if (cons) { var okc = cons.checked; if (cerr) cerr.hidden = okc; if (!okc && !first) first = cons; }
      if (first) { first.focus(); return; }
      var btn = $('button[type=submit]', demo); btn.disabled = true;
      var f = function (n) { var el = demo.elements[n]; return el ? el.value.trim() : ''; };
      GBA.post('/api/lead', { type: 'booking', lang: GBA.lang, source: 'book-a-meeting', website: f('website'), contact: { name: f('name'), email: f('email'), company: f('company'), phone: f('phone') }, data: { topic: f('help'), message: f('more') }, consent: { processing: true, marketing: !!(demo.elements.marketing && demo.elements.marketing.checked) } }).then(function (r) {
        var go = demo.getAttribute('action');
        if (r.ok) window.location.href = go + '?ref=' + encodeURIComponent(r.data.ref);
        else if (r.demo) window.location.href = go + '?demo=1';
        else { btn.disabled = false; var m = $('[data-form-err]', demo); if (m) m.hidden = false; }
      });
    });
  }

  /* Multi-step enquiry */
  var form = $('[data-enquiry]');
  if (form) {
    var data = JSON.parse($('#enqData').textContent), step = 1, total = 5;
    var steps = $$('.enq__step', form), items = $$('#stp li'), back = $('[data-back]', form), nextBtn = $('[data-next]', form), nextL = $('[data-next-l]', form);
    var title = $('#enqTitle'), intro = $('#enqIntro'), crumb = $('#enqCrumb'), review = $('#review');
    var errText = function (el) { var m = msgFor(el); return m && m.textContent ? m.textContent : T.req; };
    var fieldsFor = function (n) {
      return $$('.enq__step[data-step="' + n + '"] [required]', form);
    };
    var render = function () {
      steps.forEach(function (s) { s.hidden = Number(s.getAttribute('data-step')) !== step; });
      items.forEach(function (li, i) { li.classList.toggle('is-active', i + 1 === step); li.classList.toggle('is-done', i + 1 < step); if (i + 1 === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      title.textContent = data.word + ' ' + step + ' — ' + data.steps[step - 1];
      intro.textContent = data.intros[step - 1]; crumb.textContent = data.steps[step - 1];
      back.hidden = step === 1; nextL.textContent = step === total ? data.submit : data.next;
      if (step === total) buildReview();
    };
    var val = function (id) { var el = $('#' + id, form); return el && el.value.trim() ? el.value.trim() : data.none; };
    function buildReview() {
      var L = data.labels, picked = $$('input[name=objectives]:checked', form).map(function (c) { return data.objectiveOpts[Number(c.value)]; });
      var rows = [[L.name, val('name')], [L.email, val('email')], [L.company, val('company')], [L.role, val('role')], [L.interest, val('interest')], [L.sector, (function () { var s = $('#sector', form); return s.value ? s.options[s.selectedIndex].text : data.none; })()],
        [L.objectives, picked.length ? picked.join(', ') : data.none], [L.timeline, val('timeline')], [L.phone, val('phone')], [L.contact, val('contact')], [L.message, val('message')]];
      review.innerHTML = '';
      rows.forEach(function (r) { var d = document.createElement('div'), t = document.createElement('dt'), v = document.createElement('dd'); t.textContent = r[0]; v.textContent = r[1]; d.appendChild(t); d.appendChild(v); review.appendChild(d); });
    }
    var validateStep = function (n) {
      var ok = true, firstBad = null;
      fieldsFor(n).forEach(function (el) {
        var bad = !valid(el); setInvalid(el, bad, el.type === 'email' ? (errText(el)) : errText(el));
        if (bad) { ok = false; if (!firstBad) firstBad = el; }
      });
      if (n === 3) {
        var any = $$('input[name=objectives]:checked', form).length > 0, fs = $('input[name=objectives]', form).closest('fieldset'), m = $('.err', fs);
        fs.classList.toggle('is-invalid', !any); if (m) m.hidden = any; if (!any) { ok = false; if (!firstBad) firstBad = $('input[name=objectives]', form); }
      }
      if (n === 5) {
        var c = $('#consent'), ce = $('#consentErr'); ce.hidden = c.checked; if (!c.checked) { ok = false; firstBad = c; }
      }
      if (firstBad) firstBad.focus();
      return ok;
    };
    $$('[required]', form).forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value !== '' && !valid(el)) setInvalid(el, true, errText(el)); });
      var clear = function () { if (el.closest('.field').classList.contains('is-invalid') && valid(el)) setInvalid(el, false); };
      el.addEventListener('input', clear); el.addEventListener('change', clear);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(step)) return;
      if (step < total) { step += 1; render(); title.focus({ preventScroll: false }); window.scrollTo({ top: Math.max(0, title.getBoundingClientRect().top + window.scrollY - 140), behavior: reduce ? 'auto' : 'smooth' }); }
      else {
        var g = function (id) { var el = $('#' + id, form); return el ? el.value.trim() : ''; }, btn2 = $('[data-next]', form); btn2.disabled = true;
        var objs = $$('input[name=objectives]:checked', form).map(function (c) { return data.objectiveOpts[Number(c.value)]; });
        var sec = $('#sector', form);
        GBA.post('/api/lead', { type: 'enquiry', lang: GBA.lang, source: 'enquiry', website: g('website'), contact: { name: g('name'), email: g('email'), company: g('company'), phone: g('phone'), role: g('role') }, data: { interest: g('interest'), sector: sec.value ? sec.options[sec.selectedIndex].text : '', objectives: objs.join('; '), timeline: g('timeline'), preferred_contact: g('contact'), message: g('message') }, consent: { processing: true, marketing: !!($('#marketing') && $('#marketing').checked) } }).then(function (r) {
          var go = form.getAttribute('data-confirm');
          if (r.ok) window.location.href = go + '?ref=' + encodeURIComponent(r.data.ref);
          else if (r.demo) window.location.href = go + '?demo=1';
          else { btn2.disabled = false; var m = $('[data-form-err]', form); if (m) m.hidden = false; }
        });
      }
    });
    back.addEventListener('click', function () { if (step > 1) { step -= 1; render(); title.focus(); } });
    render();
  }

  /* Newsletter sign-up: explicit, unticked consent; double opt-in handled by the server */
  $$('[data-newsletter]').forEach(function (f) {
    var msg = $('[data-news-msg]', f), err = $('[data-news-err]', f);
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var email = f.elements.email.value.trim(), cons = f.elements.consent.checked;
      if (err) err.hidden = true;
      if (!EMAIL.test(email) || !cons) { if (err) { err.textContent = !EMAIL.test(email) ? f.getAttribute('data-err-email') : f.getAttribute('data-err-consent'); err.hidden = false; } (EMAIL.test(email) ? f.elements.consent : f.elements.email).focus(); return; }
      var btn = $('button[type=submit]', f); btn.disabled = true;
      GBA.post('/api/newsletter', { email: email, name: f.elements.name ? f.elements.name.value.trim() : '', lang: GBA.lang, consent: true, source: f.getAttribute('data-source') || 'site', website: f.elements.website ? f.elements.website.value : '' }).then(function (r) {
        btn.disabled = false;
        if (r.ok) { msg.textContent = f.getAttribute('data-ok'); msg.hidden = false; f.reset();
          if (r.data && r.data.demoConfirmUrl) { var a = document.createElement('a'); a.href = r.data.demoConfirmUrl; a.textContent = f.getAttribute('data-demo-confirm'); a.className = 'more'; msg.appendChild(document.createElement('br')); msg.appendChild(a); } }
        else if (r.demo) { msg.textContent = f.getAttribute('data-demo'); msg.hidden = false; }
        else if (err) { err.textContent = f.getAttribute('data-err-server'); err.hidden = false; }
      });
    });
  });

  /* Confirmation page: show the live or demo wording */
  var conf = $('[data-confirm-page]');
  if (conf) {
    var q = new URLSearchParams(window.location.search), refv = q.get('ref');
    if (refv && !q.get('demo')) {
      $$('[data-live]').forEach(function (el) { el.textContent = el.getAttribute('data-live'); });
      $$('[data-ref]').forEach(function (el) { el.textContent = refv; el.closest('[hidden]') && (el.closest('[hidden]').hidden = false); });
      $$('[data-demo-only]').forEach(function (el) { el.hidden = true; }); $$('[data-live-only]').forEach(function (el) { el.hidden = false; });
      document.title = conf.getAttribute('data-live-title') || document.title;
    }
  }

  /* Privacy request form */
  var pr = $('[data-privacy-form]');
  if (pr) {
    pr.addEventListener('submit', function (e) {
      e.preventDefault(); var em = pr.elements.email.value.trim(), msg = $('[data-pr-msg]', pr), err = $('[data-pr-err]', pr);
      err.hidden = true; msg.hidden = true;
      if (!EMAIL.test(em)) { err.textContent = pr.getAttribute('data-err-email'); err.hidden = false; pr.elements.email.focus(); return; }
      GBA.post('/api/privacy/request', { email: em, type: pr.elements.type.value, details: pr.elements.details.value.trim(), lang: GBA.lang, website: pr.elements.website.value }).then(function (r) {
        if (r.ok) { msg.textContent = pr.getAttribute('data-ok').replace('{ref}', r.data.ref).replace('{due}', r.data.dueBy); msg.hidden = false; pr.reset(); }
        else if (r.demo) { msg.textContent = pr.getAttribute('data-demo'); msg.hidden = false; }
        else { err.textContent = pr.getAttribute('data-err-server'); err.hidden = false; }
      });
    });
  }
  GBA.badge();
})();
