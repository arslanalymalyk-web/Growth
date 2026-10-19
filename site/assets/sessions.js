/* Advisory sessions: pick a plan and a time, pay online, then manage the booking. Falls back to a local demonstration when no server is reachable. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var dataEl = $('#sx-data'); if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent), G = window.GBA, U = D.ui, C = D.conf;
  var LOC = D.lang === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', RY = 'Asia/Riyadh';
  var el = function (tag, attrs, kids) { var e = document.createElement(tag); for (var k in (attrs || {})) { if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; };
  var money = function (n) { var s = new Intl.NumberFormat(D.lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n); return D.lang === 'ar' ? s + ' ' + D.cur : D.cur + ' ' + s; };
  var fday = function (iso, long) { return new Intl.DateTimeFormat(LOC, { timeZone: RY, weekday: long ? 'long' : 'short', day: 'numeric', month: long ? 'long' : 'short' }).format(new Date(iso)); };
  var ftime = function (iso) { return new Intl.DateTimeFormat(LOC, { timeZone: RY, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso)); };
  var localNote = function (iso) { var tz = Intl.DateTimeFormat().resolvedOptions().timeZone; if (!tz || tz === RY) return ''; return U.yourTime + ': ' + new Intl.DateTimeFormat(LOC, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' }).format(new Date(iso)); };
  var full = function (iso) { return fday(iso, true) + ', ' + ftime(iso) + ' ' + D.tz.split(' ')[0]; };
  var totals = function (plan) { var sub = D.plans[plan].price, vat = Math.round(sub * D.vat * 100) / 100; return { sub: sub, vat: vat, total: Math.round((sub + vat) * 100) / 100 }; };

  /* ---------- local demonstration (no server): rules, storage ---------- */
  var DEMO_KEY = 'gba.sess.demo';
  var demoAll = function () { try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '{}'); } catch (e) { return {}; } };
  var demoSave = function (o) { var a = demoAll(); a[o.id] = o; try { localStorage.setItem(DEMO_KEY, JSON.stringify(a)); } catch (e) { /* unavailable */ } };
  var localSlots = function () {
    var R = D.rules, out = [], now = Date.now(), taken = {}; var all = demoAll(); Object.keys(all).forEach(function (k) { all[k].bookings.forEach(function (b) { if (b.status === 'booked') taken[b.slot] = 1; }); });
    var today = new Date(now + R.tzOffsetMin * 60000); today = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
    for (var i = 0; i < 21; i++) { var d = new Date(today + i * 864e5); if (R.days.indexOf(d.getUTCDay()) < 0) continue; var slots = [];
      R.times.forEach(function (t) { var p = t.split(':'), ms = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), +p[0], +p[1]) - R.tzOffsetMin * 60000, iso = new Date(ms).toISOString(); if (ms >= now + R.leadHours * 36e5 && ms <= now + R.horizonDays * 864e5 && !taken[iso]) slots.push(iso); });
      if (slots.length) out.push({ date: d.toISOString().slice(0, 10), slots: slots }); }
    return out;
  };
  var loadAvail = function () { return G.get('/api/sessions/availability?days=21').then(function (r) { if (r.ok && r.data && r.data.days) return { days: r.data.days, local: false }; return { days: localSlots(), local: true }; }); };

  /* ---------- day and time picker ---------- */
  function Picker(daysEl, timesEl, onPick) {
    var days = [], cur = null, slot = null;
    var drawTimes = function () {
      timesEl.textContent = ''; var d = days.filter(function (x) { return x.date === cur; })[0];
      if (!d) { timesEl.appendChild(el('p', { class: 'sx-load', text: days.length ? '' : U.noneAll })); return; }
      d.slots.forEach(function (s) { var b = el('button', { type: 'button', class: 'sx-time', 'aria-pressed': String(s === slot), text: ftime(s) }); b.addEventListener('click', function () { slot = s; drawTimes(); if (onPick) onPick(s); }); timesEl.appendChild(b); });
      if (slot) { var n = localNote(slot); if (n) timesEl.appendChild(el('p', { class: 'sx-note', text: n })); }
    };
    var drawDays = function () {
      daysEl.textContent = ''; if (!days.length) { daysEl.appendChild(el('p', { class: 'sx-load', text: U.noneAll })); return; }
      days.forEach(function (d) { var b = el('button', { type: 'button', class: 'sx-day', 'aria-pressed': String(d.date === cur) }, [el('span', { text: fday(d.slots[0]).split(' ')[0] }), el('b', { text: fday(d.slots[0]).replace(/^\S+\s*/, '') })]);
        b.addEventListener('click', function () { cur = d.date; slot = null; drawDays(); drawTimes(); if (onPick) onPick(null); }); daysEl.appendChild(b); });
    };
    return { set: function (list) { days = list; if (!days.some(function (d) { return d.date === cur; })) { cur = days.length ? days[0].date : null; slot = null; } drawDays(); drawTimes(); }, slot: function () { return slot; }, clear: function () { slot = null; drawTimes(); } };
  }

  /* ---------- booking page ---------- */
  var form = $('#sx-form');
  if (form) {
    var pay = 'demo', local = false, state = { plan: 'single' }, EM = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var sumEl = $('#sx-sum'), amt = $('[data-pay-amount]', form), btn = $('#sx-pay'), note = $('[data-pay-note]', form);
    var picker = Picker($('#sx-days'), $('#sx-times'), function () { drawSum(); err('slot', ''); });
    var err = function (name, msg) { var e = $('[data-err="' + name + '"]', form); if (e) { e.textContent = msg; e.hidden = !msg; } };
    var fieldErr = function (name, msg) { var f = form.elements[name]; if (!f) return; var w = f.closest('.field'), m = w && w.querySelector('.err'); if (w) w.classList.toggle('has-err', !!msg); if (m) { m.textContent = msg; m.hidden = !msg; } f.setAttribute('aria-invalid', msg ? 'true' : 'false'); };
    var drawSum = function () {
      var t = totals(state.plan), s = picker.slot(); sumEl.textContent = '';
      sumEl.appendChild(el('p', { class: 'sx-sum__p', html: '<b></b><span></span>' })); $('b', sumEl).textContent = D.plans[state.plan].t; $('span', sumEl).textContent = money(t.sub);
      var when = el('p', { class: 'sx-sum__when' }); when.textContent = s ? full(s) : U.errSlot; sumEl.appendChild(when);
      var dl = el('dl', { class: 'basket-sum', html: '<div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div><div class="is-total"><dt></dt><dd></dd></div>' }); var dt = dl.querySelectorAll('dt'), dd = dl.querySelectorAll('dd');
      [[U.subtotal, t.sub], [U.vat, t.vat], [U.total, t.total]].forEach(function (r, i) { dt[i].textContent = r[0]; dd[i].textContent = money(r[1]); }); sumEl.appendChild(dl);
      amt.textContent = money(t.total);
    };
    var setMode = function () { var lab = $('[data-pay-label]', form); if (pay === 'provider') { note.textContent = U.payNote; } else if (pay === 'off') { btn.disabled = true; note.textContent = U.failed; } else { note.textContent = U.demoNote; lab.firstChild.textContent = U.payDemo + ' · '; } };
    $$('input[name=plan]', form).forEach(function (r) { r.addEventListener('change', function () { state.plan = r.value; drawSum(); }); });
    G.get('/api/sessions/config').then(function (r) { if (r.ok && r.data && r.data.plans) { D.plans.single.price = r.data.plans.single.price; D.plans.bundle.price = r.data.plans.bundle.price; D.vat = r.data.vat; pay = r.data.pay; local = false; } else { pay = 'demo'; local = true; } setMode(); drawSum(); });
    loadAvail().then(function (a) { picker.set(a.days); if (a.local) local = true; drawSum(); });
    drawSum(); setMode();
    form.addEventListener('submit', function (e) {
      e.preventDefault(); var f = form.elements, bad = null, v = function (n) { return f[n].value.trim(); };
      var chk = function (cond, name, msg) { fieldErr(name, cond ? '' : msg); if (!cond && !bad) bad = f[name]; };
      chk(!!v('name'), 'name', U.errName); chk(EM.test(v('email')), 'email', U.errEmail); chk(!!v('topic'), 'topic', U.errTopic); chk(f.terms.checked, 'terms', U.errTerms); chk(f.privacy.checked, 'privacy', U.errPrivacy);
      var slot = picker.slot(); err('slot', slot ? '' : U.errSlot); if (!slot && !bad) bad = $('#sx-days button');
      if (bad) { bad.focus(); return; } err('form', ''); btn.disabled = true; var lab = $('[data-pay-label]', form), old = lab.innerHTML; lab.textContent = U.working;
      var body = { plan: state.plan, slot: slot, lang: D.lang, website: f.website.value, topic: v('topic'), mode: f.mode.value, buyer: { name: v('name'), email: v('email'), company: v('company'), phone: v('phone'), vatNo: v('vatNo') }, consent: { terms: f.terms.checked, privacy: f.privacy.checked, marketing: f.marketing.checked } };
      var done = function () { btn.disabled = false; lab.innerHTML = old; };
      G.post('/api/sessions/book', body).then(function (r) {
        if (r.status === 0 || r.status === 404 || r.status === 405) { /* no server: local demonstration */ var id = 'DEMO-' + Math.random().toString(36).slice(2, 8).toUpperCase(), key = Math.random().toString(36).slice(2), t = totals(state.plan);
          demoSave({ id: id, key: key, plan: state.plan, status: 'paid', simulated: true, createdAt: new Date().toISOString(), currency: D.cur, subtotal: t.sub, vat: t.vat, total: t.total, credits: D.plans[state.plan].n - 1, validUntil: new Date(Date.now() + D.bundleValidDays * 864e5).toISOString().slice(0, 10), bookings: [{ n: 1, slot: slot, status: 'booked', mode: body.mode, rescheduled: 0 }], buyer: { name: body.buyer.name, email: body.buyer.email } });
          window.location.href = D.urls.confirm + '?o=' + id + '#k=' + key; return; }
        if (r.ok && r.data && r.data.redirect) { window.location.href = r.data.redirect; return; }
        done(); var code = r.data && r.data.error;
        if (code === 'taken' || code === 'slot') { err('slot', U.taken); picker.clear(); loadAvail().then(function (a) { picker.set(a.days); drawSum(); }); return; }
        if (code === 'email') { fieldErr('email', U.errEmail); return; } if (code === 'captcha') { err('form', U.failed); return; }
        err('form', U.failed);
      });
    });
  }

  /* ---------- confirmation page ---------- */
  var root = $('#sx-conf');
  if (root) {
    var q = new URLSearchParams(location.search), oid = q.get('o') || '', hk = (location.hash.match(/k=([^&]+)/) || [])[1] || '', polls = 0, order = null, isLocal = false;
    var hdr = { 'x-order-key': hk };
    var fetchOrder = function () { return G.get('/api/sessions/order?o=' + encodeURIComponent(oid), hdr).then(function (r) { if (r.ok && r.data && r.data.order) { isLocal = false; return r.data.order; } var d = demoAll()[oid]; if (d && d.key === hk) { isLocal = true; return d; } return null; }); };
    var inH = function (iso) { return (Date.parse(iso) - Date.now()) / 36e5; };
    var say = function (cls, msg) { var p = el('p', { class: 'sx-msg ' + cls, role: 'status', text: msg }); return p; };
    var render = function () {
      root.textContent = ''; if (!order) { root.appendChild(say('is-err', C.notFound)); return; }
      var head = el('div', { class: 'sx-head' });
      if (order.status === 'paid') head.appendChild(el('h2', { class: 'h3', text: C.confirmed })); else if (order.status === 'pending') head.appendChild(el('h2', { class: 'h3', text: C.pending })); else head.appendChild(el('h2', { class: 'h3', text: C.unpaid }));
      head.appendChild(el('p', { class: 'sx-ref', html: '<span></span> <b dir="ltr"></b>' })); head.querySelector('span').textContent = C.ref + ':'; head.querySelector('b').textContent = order.id; root.appendChild(head);
      if (order.simulated) root.appendChild(say('is-demo', U.demoNote));
      if (order.status === 'pending') { root.appendChild(say('', C.pendingBody)); return; } if (order.status !== 'paid') return;
      root.appendChild(el('p', { class: 'sx-note', text: C.emailNote }));
      var list = el('ul', { class: 'sx-books' });
      order.bookings.forEach(function (b) {
        var li = el('li', {}, [el('div', {}, [el('b', { text: D.plans[order.plan].t + ' · #' + b.n }), el('span', { class: 'sx-when', text: full(b.slot) }), el('small', { text: (b.mode === 'person' ? U.person : U.online) + (localNote(b.slot) ? ' · ' + localNote(b.slot) : '') })]), el('span', { class: 'sx-pill', text: C.booked })]);
        var act = el('div', { class: 'sx-act' });
        if (!isLocal) act.appendChild(el('a', { class: 'btn btn--outline-dark btn--sm', href: '/api/sessions/ics?o=' + encodeURIComponent(order.id) + '&k=' + encodeURIComponent(hk) + '&n=' + b.n }, [el('span', { text: C.addCal })]));
        if (inH(b.slot) >= D.rescheduleHours && b.rescheduled < 2) { var rb = el('button', { type: 'button', class: 'btn btn--outline-dark btn--sm' }, [el('span', { text: C.reschedule })]); rb.addEventListener('click', function () { openPicker(li, function (slot) { return doReschedule(b.n, slot); }, false); rb.hidden = true; }); act.appendChild(rb); } else if (inH(b.slot) < D.rescheduleHours) act.appendChild(el('small', { class: 'sx-note', text: C.tooLate }));
        li.appendChild(act); list.appendChild(li);
      }); root.appendChild(list);
      if (order.credits > 0) { var box = el('div', { class: 'sx-credits' }, [el('h3', { class: 'h4', text: order.credits + ' ' + C.left }), el('p', { class: 'sx-note', text: C.validUntil + ' ' + order.validUntil + '.' })]); var sb = el('button', { type: 'button', class: 'btn btn--gold' }, [el('span', { text: C.schedule })]); sb.addEventListener('click', function () { sb.hidden = true; openPicker(box, doSchedule, true); }); box.appendChild(sb); root.appendChild(box); }
      var foot = el('div', { class: 'sx-foot' }); if (!isLocal) foot.appendChild(el('a', { class: 'btn btn--outline-dark', href: '/api/shop/invoice?o=' + encodeURIComponent(order.id) + '&k=' + encodeURIComponent(hk), target: '_blank', rel: 'noopener' }, [el('span', { text: C.invoice })]));
      var pb = el('button', { type: 'button', class: 'btn btn--outline-dark' }, [el('span', { text: C.print })]); pb.addEventListener('click', function () { window.print(); }); foot.appendChild(pb); root.appendChild(foot);
    };
    var openPicker = function (host, save, askMode) {
      var wrap = el('div', { class: 'sx-pick' }); var days = el('div', { class: 'sx-days', role: 'group', 'aria-label': U.pickDay }), times = el('div', { class: 'sx-times', role: 'group', 'aria-label': U.pickTime }), msg = el('p', { class: 'sx-msg', role: 'status' });
      var mode = null; if (askMode) { mode = el('div', { class: 'sx-mode', role: 'radiogroup', 'aria-label': U.mode, html: '<label><input type="radio" name="m" value="online" checked><span></span></label><label><input type="radio" name="m" value="person"><span></span></label>' }); var sp = mode.querySelectorAll('span'); sp[0].textContent = U.online; sp[1].textContent = U.person; }
      var ok = el('button', { type: 'button', class: 'btn btn--gold btn--sm' }, [el('span', { text: C.saved ? U.pickTime : '' })]); ok.firstChild.textContent = D.lang === 'ar' ? 'حفظ' : 'Save';
      var pk = Picker(days, times, function () { msg.textContent = ''; });
      ok.addEventListener('click', function () { var s = pk.slot(); if (!s) { msg.textContent = U.errSlot; return; } ok.disabled = true; save(s, mode ? mode.querySelector('input:checked').value : 'online').then(function (res) { ok.disabled = false; if (res === true) return; msg.className = 'sx-msg is-err'; msg.textContent = res === 'taken' ? U.taken : res === 'late' ? C.tooLate : U.failed; if (res === 'taken') loadAvail().then(function (a) { pk.set(a.days); }); }); });
      wrap.appendChild(days); wrap.appendChild(times); if (mode) wrap.appendChild(mode); wrap.appendChild(ok); wrap.appendChild(msg); host.appendChild(wrap); loadAvail().then(function (a) { pk.set(a.days); });
    };
    var after = function (r) { if (r.ok && r.data && r.data.order) { order = r.data.order; render(); root.insertBefore(say('is-ok', C.saved), root.children[1] || null); return true; } var c = r.data && r.data.error; return c === 'taken' ? 'taken' : c === 'too_late' ? 'late' : 'fail'; };
    var doSchedule = function (slot, mode) {
      if (isLocal) { order.bookings.push({ n: order.bookings.length + 1, slot: slot, status: 'booked', mode: mode, rescheduled: 0 }); order.credits -= 1; demoSave(Object.assign({ key: hk }, order)); render(); return Promise.resolve(true); }
      return G.post('/api/sessions/schedule', { o: order.id, slot: slot, mode: mode }, hdr).then(after);
    };
    var doReschedule = function (n, slot) {
      if (isLocal) { order.bookings.forEach(function (b) { if (b.n === n) { b.slot = slot; b.rescheduled += 1; } }); demoSave(Object.assign({ key: hk }, order)); render(); return Promise.resolve(true); }
      return G.post('/api/sessions/reschedule', { o: order.id, n: n, slot: slot }, hdr).then(after);
    };
    var poll = function () { if (!order || order.status !== 'pending' || polls++ > 24) return; G.post('/api/pay/verify', { o: oid }, hdr).then(function (r) { if (r.ok && r.data && r.data.status !== 'pending') { fetchOrder().then(function (o) { order = o; render(); }); } else setTimeout(poll, 3000); }); };
    fetchOrder().then(function (o) { order = o; render(); poll(); });
  }
})();
