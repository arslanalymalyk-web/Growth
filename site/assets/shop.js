/* Briefs shop: basket (kept on this device), checkout and the order page with secure downloads. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var dataEl = $('#shop-data'); if (!dataEl) return;
  var D = JSON.parse(dataEl.textContent), G = window.GBA, byslug = {};
  D.products.forEach(function (p) { byslug[p.slug] = p; });
  var fmt = function (n) { return new Intl.NumberFormat(D.lang === 'ar' ? 'ar-SA' : 'en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(n); };
  var money = function (n) { return D.lang === 'ar' ? fmt(n) + ' ' + D.cur : D.cur + ' ' + fmt(n); };
  var totals = function (slugs) { var sub = slugs.reduce(function (a, s) { return a + (byslug[s] ? byslug[s].price : 0); }, 0), vat = Math.round(sub * D.vat * 100) / 100; return { sub: sub, vat: vat, total: Math.round((sub + vat) * 100) / 100 }; };

  /* add-to-basket buttons (catalogue and product pages) */
  $$('[data-add]').forEach(function (b) {
    var slug = b.getAttribute('data-add'), label = b.querySelector('span');
    var sync = function () { var has = G.basket().indexOf(slug) >= 0; label.textContent = has ? D.t.inBasket : D.t.add; b.classList.toggle('is-in', has); b.setAttribute('aria-pressed', String(has)); };
    b.addEventListener('click', function () { var bk = G.basket(), i = bk.indexOf(slug); if (i < 0) bk.push(slug); else bk.splice(i, 1); G.setBasket(bk); sync(); });
    sync();
  });
  $$('[data-buy]').forEach(function (b) { b.addEventListener('click', function (e) { var slug = b.getAttribute('data-buy'), bk = G.basket(); if (bk.indexOf(slug) < 0) bk.push(slug); G.setBasket(bk); }); });

  /* basket page */
  var basket = $('#basket');
  if (basket) {
    var draw = function () {
      var bk = G.basket().filter(function (s) { return byslug[s]; }); basket.textContent = '';
      if (!bk.length) { basket.innerHTML = '<div class="shop-empty"><p></p><a class="btn btn--gold" href="' + D.urls.shop + '"><span></span></a></div>'; basket.querySelector('p').textContent = D.t.empty; basket.querySelector('span').textContent = D.t.emptyCta; return; }
      var t = totals(bk), ul = document.createElement('ul'); ul.className = 'basket-list';
      bk.forEach(function (s) {
        var p = byslug[s], li = document.createElement('li');
        li.innerHTML = '<img alt="" width="96" height="72"><div><b></b><small></small></div><span class="basket-price"></span><button type="button" class="link-btn"></button>';
        li.querySelector('img').src = p.img; li.querySelector('b').textContent = p.title; li.querySelector('small').textContent = p.pages + ' ' + D.t.pages + ' · PDF';
        li.querySelector('.basket-price').textContent = money(p.price);
        var rm = li.querySelector('button'); rm.textContent = D.t.remove; rm.addEventListener('click', function () { G.setBasket(G.basket().filter(function (x) { return x !== s; })); draw(); });
        ul.appendChild(li);
      });
      var sum = document.createElement('dl'); sum.className = 'basket-sum';
      sum.innerHTML = '<div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div><div class="is-total"><dt></dt><dd></dd></div>';
      var dts = sum.querySelectorAll('dt'), dds = sum.querySelectorAll('dd');
      [[D.t.subtotal, t.sub], [D.t.vat, t.vat], [D.t.total, t.total]].forEach(function (r, i) { dts[i].textContent = r[0]; dds[i].textContent = money(r[1]); });
      var act = document.createElement('div'); act.className = 'basket-act';
      act.innerHTML = '<a class="btn btn--outline-dark" href="' + D.urls.shop + '"><span></span></a><a class="btn btn--gold" href="' + D.urls.checkout + '"><span></span></a>';
      act.querySelectorAll('span')[0].textContent = D.t.continue; act.querySelectorAll('span')[1].textContent = D.t.checkout;
      basket.appendChild(ul); basket.appendChild(sum); basket.appendChild(act);
    };
    draw();
  }

  /* checkout */
  var co = $('#checkout');
  if (co) {
    var bk = G.basket().filter(function (s) { return byslug[s]; }), sumEl = $('#co-summary');
    if (!bk.length) { window.location.replace(D.urls.basket); return; }
    var t = totals(bk);
    sumEl.innerHTML = '<ul class="co-items"></ul><dl class="basket-sum"><div><dt></dt><dd></dd></div><div><dt></dt><dd></dd></div><div class="is-total"><dt></dt><dd></dd></div></dl>';
    var ul = $('.co-items', sumEl); bk.forEach(function (s) { var li = document.createElement('li'); li.innerHTML = '<span></span><b></b>'; li.firstChild.textContent = byslug[s].title; li.lastChild.textContent = money(byslug[s].price); ul.appendChild(li); });
    var dd = sumEl.querySelectorAll('dd'), dt = sumEl.querySelectorAll('dt'); [[D.t.subtotal, t.sub], [D.t.vat, t.vat], [D.t.total, t.total]].forEach(function (r, i) { dt[i].textContent = r[0]; dd[i].textContent = money(r[1]); });
    $('[data-pay-amount]', co).textContent = money(t.total);
    var EM = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var setErr = function (name, msg) { var f = co.elements[name]; var w = f.closest('.field') || f.closest('.check'); var m = w.querySelector('.err') || w.parentNode.querySelector('.err[data-for="' + name + '"]'); if (w.classList) w.classList.toggle('is-invalid', !!msg); if (m) { m.textContent = msg || ''; m.hidden = !msg; } return !msg; };
    co.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = co.elements, bad = null, chk = function (ok, name, msg) { setErr(name, ok ? '' : msg); if (!ok && !bad) bad = f[name]; };
      chk(f.name.value.trim() !== '', 'name', D.t.err.name); chk(EM.test(f.email.value.trim()), 'email', D.t.err.email); chk(f.licence.checked, 'licence', D.t.err.licence); chk(f.privacy.checked, 'privacy', D.t.err.privacy);
      if (bad) { bad.focus(); return; }
      var btn = $('button[type=submit]', co), lbl = $('span', btn), old = lbl.textContent; btn.disabled = true; lbl.textContent = D.t.paying;
      G.post('/api/shop/checkout', { lang: D.lang, items: bk, website: f.website.value, buyer: { name: f.name.value.trim(), email: f.email.value.trim(), company: f.company.value.trim(), vatNo: f.vatno.value.trim(), country: f.country.value.trim() }, consent: { licence: true, privacy: true, marketing: f.marketing.checked } }).then(function (r) {
        if (r.ok) { G.setBasket([]); window.location.href = r.data.redirect; return; }
        btn.disabled = false; lbl.textContent = old; var m = $('[data-co-err]', co); m.textContent = (r.demo || r.status === 501) ? D.t.noServer : D.t.err.server; m.hidden = false; m.scrollIntoView({ block: 'center' });
      });
    });
  }

  /* order page: fragment holds the access key (never sent to the server in a URL) */
  var ord = $('#order');
  if (ord) {
    var q = new URLSearchParams(window.location.search), oid = q.get('o'), key = new URLSearchParams(window.location.hash.slice(1)).get('k');
    var fail = function (m) { ord.innerHTML = '<p class="shop-empty"></p>'; ord.firstChild.textContent = m; };
    if (!oid || !key) return fail(D.t.notFound);
    G.get('/api/shop/order?o=' + encodeURIComponent(oid), { 'X-Order-Key': key }).then(function (r) {
      if (!r.ok) return fail(D.t.notFound);
      var o = r.data.order; ord.textContent = '';
      var head = document.createElement('p'); head.className = 'order-ref'; head.innerHTML = '<span></span> <b></b>'; head.firstChild.textContent = D.t.ref + ':'; head.lastChild.textContent = o.id; ord.appendChild(head);
      var ul = document.createElement('ul'); ul.className = 'order-items';
      o.items.forEach(function (it) {
        var li = document.createElement('li'); li.innerHTML = '<div><b></b><small></small></div><div class="order-act"><button type="button" class="btn btn--gold btn--sm"><span></span></button><small class="order-left"></small><p class="err" hidden role="alert"></p></div>';
        li.querySelector('b').textContent = it.title; li.querySelector('small').textContent = money(it.price);
        var btn = li.querySelector('button'), lbl = btn.querySelector('span'), left = li.querySelector('.order-left'), er = li.querySelector('.err');
        lbl.textContent = D.t.download; var setLeft = function (n) { left.textContent = n + ' ' + D.t.left; if (n <= 0) { btn.disabled = true; er.textContent = D.t.none; er.hidden = false; } }; setLeft(it.left);
        btn.addEventListener('click', function () {
          btn.disabled = true; lbl.textContent = D.t.preparing; er.hidden = true;
          G.post('/api/shop/download-link', { o: o.id, item: it.slug }, { 'X-Order-Key': key }).then(function (x) {
            lbl.textContent = D.t.download; btn.disabled = false;
            if (x.ok) { setLeft(x.data.left - 1); window.location.href = x.data.url; }
            else { er.textContent = x.status === 403 ? D.t.none : D.t.expired; er.hidden = false; if (x.status === 403) btn.disabled = true; }
          });
        });
        ul.appendChild(li);
      });
      ord.appendChild(ul);
      var tot = document.createElement('p'); tot.className = 'order-total'; tot.textContent = D.t.total + ': ' + money(o.total) + ' (' + D.t.vatIncl + ')'; ord.appendChild(tot);
      var tip = document.createElement('p'); tip.className = 'order-tip'; tip.textContent = D.t.tips; ord.appendChild(tip);
      var inv = document.createElement('a'); inv.className = 'more'; inv.href = '/api/shop/invoice?o=' + encodeURIComponent(o.id) + '&k=' + encodeURIComponent(key); inv.target = '_blank'; inv.rel = 'noopener'; inv.innerHTML = '<span></span>'; inv.firstChild.textContent = D.t.invoice; ord.appendChild(inv);
    });
  }
})();
