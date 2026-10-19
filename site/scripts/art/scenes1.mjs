import { W, H, rng, f, id, TOD, defs, sky, stars, sun, haze, ridge, dunes, mix, windows, palm, merlons, najdiOpenings, grain, vignette } from './lib.mjs';

class S { constructor(t) { this.d = ''; this.b = t ? `<rect width="${W}" height="${H}" fill="${TOD[t].near}"/>` : ''; } add(x) { if (x && typeof x === 'object') { this.d += x.defs || ''; this.b += x.body || ''; } else this.b += x || ''; return this; } def(x) { this.d += x; return this; } }
export { S };

/* ---------- glass tower with a lit facade ---------- */
function slab(s, r, t, x, base, w, h, { taper = 0, fill, lit, top = 'flat', edge = true } = {}) {
  const P = TOD[t], g = id('tw'), c = fill || P.mid, light = mix(c, P.haze, .35);
  s.def(defs.grad(g, [[0, mix(c, '#000', .1)], [.5, c], [1, light]], 0, 0, 1, 0));
  const tw = w * (1 - taper), y = base - h; let pts = `${f(x)},${base} ${f(x + (w - tw) / 2)},${y} ${f(x + (w + tw) / 2)},${y} ${f(x + w)},${base}`;
  if (top === 'slant') pts = `${f(x)},${base} ${f(x)},${f(y + h * .06)} ${f(x + w)},${y} ${f(x + w)},${base}`;
  if (top === 'peak') pts = `${f(x)},${base} ${f(x)},${f(y + 40)} ${f(x + w / 2)},${y} ${f(x + w)},${f(y + 40)} ${f(x + w)},${base}`;
  s.add(`<polygon points="${pts}" fill="url(#${g})"/>`);
  s.add(windows(r, x, y, w, h, t, { gap: 10 + Math.floor(r() * 4), size: 4, lit }));
  if (edge) s.add(`<rect x="${f(x + w - 3)}" y="${y}" width="3" height="${h}" fill="${P.haze}" opacity=".22"/>`);
}
/** Kingdom Centre: tapering body with the sky-bridge opening near the top. */
function kingdom(s, t, x, base, h) {
  const P = TOD[t], g = id('kc'), w = 150, y = base - h; s.def(defs.grad(g, [[0, mix(P.mid, '#000', .15)], [.55, mix(P.mid, P.haze, .22)], [1, mix(P.mid, P.haze, .5)]], 0, 0, 1, 0));
  const arcTop = y + h * .045, arcBot = y + h * .17;
  s.add(`<path fill-rule="evenodd" fill="url(#${g})" d="M${x} ${base}L${x + w * .04} ${y + h * .1}Q${x + w * .06} ${y} ${x + w * .5} ${y - 6}Q${x + w * .94} ${y} ${x + w * .96} ${y + h * .1}L${x + w} ${base}Z M${x + w * .27} ${arcBot}L${x + w * .27} ${y + h * .09}Q${x + w * .5} ${arcTop - h * .075} ${x + w * .73} ${y + h * .09}L${x + w * .73} ${arcBot}Z"/>`);
  s.add(`<path d="M${x + w * .5} ${y - 6}V${y - 60}" stroke="${P.mid}" stroke-width="3"/>`);
  s.add(`<rect x="${x + w * .3}" y="${arcBot - 4}" width="${w * .4}" height="6" fill="${TOD[t].glow}" opacity="${t === 'night' || t === 'dusk' ? .8 : .25}"/>`);
}
/** Al Faisaliyah: faceted shaft, golden sphere, spire. */
function faisaliyah(s, t, x, base, h) {
  const P = TOD[t], g = id('fa'), w = 110, y = base - h, gs = id('fs');
  s.def(defs.grad(g, [[0, mix(P.mid, '#000', .12)], [1, mix(P.mid, P.haze, .45)]], 0, 0, 1, 0)).def(defs.radial(gs, [[0, '#fff2c4'], [.5, '#e0b25a'], [1, '#8a5f1f']], .38, .35, .75));
  s.add(`<polygon points="${x},${base} ${x + 14},${y + h * .26} ${x + w / 2},${y + h * .12} ${x + w - 14},${y + h * .26} ${x + w},${base}" fill="url(#${g})"/>`);
  s.add(`<polygon points="${x + 14},${y + h * .26} ${x + w / 2},${y + h * .12} ${x + w / 2},${y + h * .4} ${x + 14},${y + h * .42}" fill="#000" opacity=".12"/>`);
  s.add(`<rect x="${x + w / 2 - 6}" y="${y - 12}" width="12" height="${h * .13}" fill="${P.mid}"/><circle cx="${x + w / 2}" cy="${y + h * .06}" r="30" fill="url(#${gs})"/><path d="M${x + w / 2} ${y + h * .06 - 30}V${y - 80}" stroke="${P.mid}" stroke-width="3"/>`);
}
/** KAFD-style faceted tower (parallelogram crown). */
function kafd(s, r, t, x, base, w, h, tilt = 1) {
  const P = TOD[t], g = id('kf'), y = base - h, c = mix(P.mid, P.haze, .12 + r() * .15);
  s.def(defs.grad(g, [[0, mix(c, '#000', .2)], [.5, c], [1, mix(c, P.haze, .4)]], 0, 0, 1, 1));
  s.add(`<polygon points="${x},${base} ${x},${y + 60 * tilt} ${x + w},${y} ${x + w},${base}" fill="url(#${g})"/>`);
  s.add(`<polygon points="${x + w * .5},${base} ${x + w * .5},${y + 30 * tilt} ${x + w},${y} ${x + w},${base}" fill="#fff" opacity=".07"/>`);
  s.add(windows(r, x, y + 60, w, h - 60, t, { gap: 9, size: 3.6 }));
}

/** Riyadh skyline: Kingdom Centre, Faisaliyah, KAFD cluster, low-rise city, haze. */
export function riyadh(t = 'dusk', seed = 1, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), by = o.by ?? 1000;
  s.add(sky(t, { horizon: by })); s.add(stars(r, t));
  const sx = o.sunX ?? 1500; if (t !== 'night' && t !== 'day') s.add(sun(sx, by - 60, 70, t, .95)); else if (t === 'night') s.add(sun(o.moonX ?? 420, 230, 34, t, .9));
  s.add(haze(by - 260, 300, P.haze, .55));
  // far city
  for (let i = 0; i < 70; i++) { const w = 26 + r() * 40, h = 60 + r() * 150, x = r() * W; s.add(`<rect x="${f(x)}" y="${f(by - h)}" width="${f(w)}" height="${h + 40}" fill="${mix(P.far, P.haze, .4)}" opacity=".7"/>`); }
  s.add(haze(by - 150, 200, P.haze, .5));
  // mid cluster
  const kx = o.kingdomX ?? 560; kingdom(s, t, kx, by + 8, 640);
  faisaliyah(s, t, o.faisX ?? 1010, by + 8, 520);
  for (let i = 0; i < 9; i++) kafd(s, r, t, (o.kafdX ?? 1500) + i * 95 + r() * 20, by + 8, 70 + r() * 50, 220 + r() * 330, r() < .5 ? 1 : -1);
  for (let i = 0; i < 16; i++) slab(s, r, t, r() * W, by + 10, 50 + r() * 70, 90 + r() * 200, { fill: mix(P.mid, P.far, .5), taper: r() < .3 ? .2 : 0, top: r() < .3 ? 'slant' : 'flat' });
  s.add(haze(by - 60, 160, P.haze, .45));
  // foreground low-rise + highway glow
  let low = ''; for (let x = -20; x < W; x += 28 + r() * 26) { const h = 26 + r() * 74; low += `<rect x="${f(x)}" y="${f(by + 30 - h)}" width="${f(24 + r() * 30)}" height="${h + 80}" fill="${P.near}"/>`; }
  s.add(`<g opacity=".95">${low}</g>`);
  const gg = id('gd'); s.def(defs.grad(gg, [[0, mix(P.near, P.haze, .22)], [.35, P.near], [1, mix(P.near, '#000', .45)]])); s.add(`<rect x="0" y="${by + 40}" width="${W}" height="${H}" fill="url(#${gg})"/>`);
  if (P.lit > .2) { let tr = ''; for (let i = 0; i < 90; i++) { const x = r() * W, y = by + 80 + r() * 200; tr += `<rect x="${f(x)}" y="${f(y)}" width="${f(10 + r() * 40)}" height="2.4" fill="${r() < .5 ? '#ffd9a0' : '#ff6d5a'}" opacity="${f(.25 + r() * .5)}"/>`; } s.add(tr); }
  s.add(`<g>${ridge(r, by + 330, 20, mix(P.near, '#000', .25), { rough: .2, freq: .3 })}</g>`);
  return s;
}

/** Layered dunes under a big sky, with sun. */
export function desert(t = 'dawn', seed = 2, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = o.y ?? 760;
  s.add(sky(t, { horizon: y })); s.add(stars(r, t, 160));
  s.add(sun(o.sunX ?? 1300, y - (o.sunH ?? 40), o.sunR ?? 64, t, .98)); s.add(haze(y - 220, 280, P.haze, .5));
  s.add(ridge(r, y - 30, 60, mix(P.far, P.haze, .25), { rough: .6, freq: .5, sharp: .2 }));
  s.add(dunes(r, t, y + 30, 5)); s.add(haze(y + 120, 160, P.haze, .22));
  if (o.palms) s.add(palm(o.palms, H - 120, 1.5, P.near, -30, r) + palm(o.palms + 130, H - 100, 1.1, P.near, 40, r));
  return s;
}

/** Hegra / AlUla: sandstone mesas with striated faces, a carved tomb facade, Elephant Rock arch. */
export function alula(t = 'gold', seed = 3, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 800, rock = t === 'night' ? '#26304f' : t === 'blue' ? '#8a7a80' : t === 'day' ? '#c07a4a' : '#b5683f';
  s.add(sky(t, { horizon: y + 260 })); s.add(stars(r, t)); s.add(sun(o.sunX ?? 400, y - 120, 56, t, .9)); s.add(haze(y - 200, 260, P.haze, .45));
  const sandG = id('sg'); s.def(defs.grad(sandG, [[0, mix(rock, P.haze, .35)], [1, mix(rock, '#000', .45)]])); s.add(`<rect x="0" y="${y + 100}" width="${W}" height="${H}" fill="url(#${sandG})"/>`);
  const texId = id('tx'); s.def(`<filter id="${texId}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".006 .06" numOctaves="4" seed="${seed}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.6 1.1"/></filter>`);
  const tex = (d) => { const c = id('cp'); s.def(`<clipPath id="${c}"><path d="${d}"/></clipPath>`); s.add(`<g clip-path="url(#${c})"><rect width="${W}" height="${H}" filter="url(#${texId})" opacity=".32"/></g>`); };
  const mesa = (x, w, h, c, k = 1) => { const g = id('ms'); s.def(defs.grad(g, [[0, mix(c, P.haze, .45)], [.5, c], [1, mix(c, '#000', .35)]], 0, 0, 1, 0)); let d = `M${x} ${y + 120}L${x + w * .04} ${y - h * .72}`; const steps = 6 + Math.floor(r() * 4); for (let i = 0; i <= steps; i++) d += `L${f(x + w * (.04 + .92 * i / steps))} ${f(y - h + (r() - .5) * h * .08 - (i % 2) * 10)}`; d += `L${x + w * .96} ${y - h * .6}L${x + w} ${y + 120}Z`; s.add(`<path d="${d}" fill="url(#${g})"/>`); tex(d); for (let i = 0; i < 7; i++) s.add(`<path d="M${x + 6} ${f(y - h * (.1 + i * .12))}H${x + w - 6}" stroke="#000" stroke-opacity=".09" stroke-width="${2 + r() * 3}"/>`); };
  mesa(-80, 620, 520, mix(rock, P.far, .45)); mesa(1700, 860, 470, mix(rock, P.far, .4)); mesa(1000, 520, 330, mix(rock, P.far, .3));
  const ex = o.arch ?? 1190; // elephant rock
  const g2 = id('er'); s.def(defs.grad(g2, [[0, mix(rock, P.haze, .3)], [1, mix(rock, '#000', .4)]], 0, 0, 1, 0));
  s.add(`<path d="M${ex - 210} ${y + 130}L${ex - 190} ${y - 150}Q${ex - 150} ${y - 270} ${ex - 60} ${y - 250}Q${ex} ${y - 215} ${ex + 20} ${y - 110}L${ex + 40} ${y + 130}Z" fill="url(#${g2})"/>`);
  s.add(`<path d="M${ex + 20} ${y + 130}L${ex + 28} ${y - 40}Q${ex + 120} ${y - 110} ${ex + 240} ${y - 70}Q${ex + 330} ${y - 40} ${ex + 340} ${y + 130}Z" fill="url(#${g2})"/>`);
  s.add(`<path d="M${ex - 60} ${y - 250}Q${ex + 180} ${y - 300} ${ex + 250} ${y - 120}L${ex + 220} ${y - 70}Q${ex + 120} ${y - 180} ${ex + 30} ${y - 110}Z" fill="${mix(rock, '#000', .12)}"/>`);
  // tomb facade
  const tx = o.tomb ?? 1900, tg = id('tb'); s.def(defs.grad(tg, [[0, mix(rock, P.haze, .2)], [1, mix(rock, '#000', .45)]], 0, 0, 1, 0));
  s.add(`<rect x="${tx}" y="${y - 40}" width="380" height="${H - y + 40}" fill="url(#${tg})"/>`);
  s.add(`<path d="M${tx + 30} ${y + 160}V${y + 20}H${tx + 350}V${y + 160}" fill="#000" opacity=".22"/><path d="M${tx + 20} ${y + 20}H${tx + 360}M${tx + 40} ${y - 6}H${tx + 340}M${tx + 60} ${y - 30}H${tx + 320}" stroke="#000" stroke-opacity=".3" stroke-width="6"/>`);
  for (let i = 0; i < 6; i++) s.add(`<path d="M${tx + 18 + i * 12} ${y - 40 + i * 6}h${380 - 36 - i * 24}" stroke="#fff" stroke-opacity=".1" stroke-width="3"/>`);
  s.add(`<path d="M${tx + 140} ${y + 360}V${y + 190}Q${tx + 190} ${y + 150} ${tx + 240} ${y + 190}V${y + 360}Z" fill="#000" opacity=".55"/>`);
  s.add(dunes(r, t, y + 320, 3)); s.add(haze(y + 120, 160, P.haze, .2));
  return s;
}

/** Diriyah / At-Turaif: mud-brick fort with stepped crenellations and palms at golden hour. */
export function diriyah(t = 'gold', seed = 4, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 960, mud = t === 'night' ? '#4a4660' : '#c99a6a';
  s.add(sky(t, { horizon: y })); s.add(stars(r, t)); s.add(sun(o.sunX ?? 1900, y - 140, 60, t, .95)); s.add(haze(y - 240, 280, P.haze, .45));
  const wall = (x, w, h, c) => { const g = id('wl'); s.def(defs.grad(g, [[0, mix(c, P.haze, .4)], [1, mix(c, '#2a1d18', .45)]], 0, 0, 1, 0)); s.add(`<rect x="${x}" y="${y - h}" width="${w}" height="${h + 80}" fill="url(#${g})"/>`); s.add(merlons(x, y - h, w, 1.6, mix(c, P.haze, .2))); s.add(najdiOpenings(x, y - h, w, h, 1.1, mix(c, '#2a1d18', .6), r)); };
  const tower = (x, w, h, c) => { const g = id('tr'); s.def(defs.grad(g, [[0, mix(c, P.haze, .4)], [1, mix(c, '#2a1d18', .5)]], 0, 0, 1, 0)); s.add(`<polygon points="${x},${y + 80} ${x + w * .08},${y - h} ${x + w * .92},${y - h} ${x + w},${y + 80}" fill="url(#${g})"/>`); s.add(merlons(x + w * .08, y - h, w * .84, 1.6, mix(c, P.haze, .25))); s.add(najdiOpenings(x + 6, y - h + 10, w - 12, h - 20, 1.1, mix(c, '#2a1d18', .6), r)); };
  wall(60, 520, 190, mix(mud, P.far, .3)); tower(560, 170, 360, mix(mud, P.far, .2)); wall(730, 640, 230, mix(mud, P.far, .15));
  tower(1330, 220, 440, mud); wall(1550, 800, 210, mix(mud, P.far, .25)); tower(1260, 110, 250, mix(mud, P.far, .3));
  s.add(ridge(r, y + 90, 26, mix(P.near, '#2b1f22', .3), { rough: .3, freq: .6 }));
  s.add(palm(280, H - 60, 1.6, '#16301f', -40, r)); s.add(palm(430, H - 40, 1.2, '#16301f', 36, r)); s.add(palm(2050, H - 70, 1.7, '#16301f', 30, r)); s.add(palm(2250, H - 40, 1.25, '#16301f', -44, r));
  s.add(haze(y + 30, 200, P.haze, .25));
  return s;
}
