import { W, H, rng, f, id, TOD, defs, sky, stars, sun, haze, ridge, dunes, mix, windows, palm, grain } from './lib.mjs';
import { S, riyadh } from './scenes1.mjs';

/** The Line: two mirrored walls converging on the horizon over open desert. */
export function theLine(t = 'dawn', seed = 11, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), vx = o.vx ?? 1200, vy = o.vy ?? 640;
  s.add(sky(t, { horizon: vy })); s.add(stars(r, t)); s.add(sun(vx, vy - 6, 54, t, 1)); s.add(haze(vy - 200, 260, P.haze, .55));
  s.add(ridge(r, vy + 10, 26, mix(P.far, P.haze, .3), { rough: .3, freq: .5 })); s.add(ridge(r, vy + 60, 38, mix(P.mid, P.far, .4), { rough: .35, freq: .7, sharp: .3 }));
  const g = id('fl'); s.def(defs.grad(g, [[0, mix(P.far, P.haze, .45)], [1, P.near]], 0, 0, 0, 1)); s.add(`<polygon points="0,${vy + 40} ${W},${vy + 40} ${W},${H} 0,${H}" fill="url(#${g})"/>`);
  for (let i = -14; i <= 14; i++) s.add(`<line x1="${vx}" y1="${vy + 40}" x2="${vx + i * 260}" y2="${H}" stroke="${P.haze}" stroke-opacity=".08" stroke-width="2"/>`);
  const mirror = (side) => {
    const sg = side < 0 ? -1 : 1, xn = vx + sg * (o.gap ?? 560), xf = vx + sg * 26, tn = -420, bn = H + 420;
    const mg = id('mr'); s.def(defs.grad(mg, [[0, P.sky[0]], [.35, P.sky[1]], [.55, P.sky[2]], [.7, P.sky[3]], [1, mix(P.sky[3], P.near, .5)]], 0, 0, 0, 1));
    const pts = `${xn},${tn} ${xf},${vy - 44} ${xf},${vy + 56} ${xn},${bn}`;
    s.add(`<polygon points="${pts}" fill="url(#${mg})"/>`);
    const sh = id('sh'); s.def(defs.grad(sh, [[0, '#000', sg < 0 ? .5 : .05], [.6, '#000', .0], [1, '#fff', sg < 0 ? .0 : .22]], sg < 0 ? 0 : 1, 0, sg < 0 ? 1 : 0, 0)); s.add(`<polygon points="${pts}" fill="url(#${sh})"/>`);
    for (let k = 1; k < 30; k++) { const u = k / 30, e = Math.pow(u, 1.8); const x = xn + (xf - xn) * e; const yt = tn + (vy - 44 - tn) * e, yb = bn + (vy + 56 - bn) * e; s.add(`<line x1="${f(x)}" y1="${f(yt)}" x2="${f(x)}" y2="${f(yb)}" stroke="#fff" stroke-opacity=".12" stroke-width="${f(3 - 2.4 * e)}"/>`); }
    for (let k = 1; k < 9; k++) { const u = k / 9; s.add(`<line x1="${xn}" y1="${f(tn + (bn - tn) * u)}" x2="${xf}" y2="${f(vy - 44 + 100 * u)}" stroke="#fff" stroke-opacity=".07" stroke-width="2"/>`); }
    s.add(`<polygon points="${xn},${tn} ${xf},${vy - 44} ${xf + sg * 6},${vy - 44} ${xn + sg * 20},${tn}" fill="${P.glow}" opacity=".5"/>`);
  };
  mirror(-1); mirror(1); s.add(haze(vy - 40, 120, P.haze, .5));
  return s;
}

/** Red Sea: turquoise water, sun glitter, overwater villas on a pier, a dhow. */
export function redSea(t = 'dawn', seed = 12, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = o.y ?? 640;
  s.add(sky(t, { horizon: y })); s.add(sun(o.sunX ?? 1500, y - 20, 58, t, 1)); s.add(haze(y - 160, 220, P.haze, .5));
  const wg = id('sea'); s.def(defs.grad(wg, [[0, mix('#2fb7bd', P.haze, .35)], [.35, '#1d8fa8'], [1, '#0a3f66']])); s.add(`<rect y="${y}" width="${W}" height="${H}" fill="url(#${wg})"/>`);
  s.add(ridge(r, y + 4, 10, mix(P.far, '#2b6f86', .5), { rough: .2, freq: .4, bottom: y + 14 }));
  let gl = ''; for (let i = 0; i < 170; i++) { const yy = y + 12 + Math.pow(r(), 1.7) * 520, w = 20 + r() * 150 * (1 + (yy - y) / 300); gl += `<rect x="${f((o.sunX ?? 1500) - w / 2 + (r() - .5) * 260 * (1 + (yy - y) / 200))}" y="${f(yy)}" width="${f(w)}" height="${f(1.6 + (yy - y) / 160)}" fill="${P.sun}" opacity="${f(.15 + r() * .5)}"/>`; } s.add(gl);
  // pier + villas in perspective
  const px0 = o.pier ?? 200, py = y + 330;
  s.add(`<polygon points="${px0},${py + 30} ${px0 + 1500},${y + 120} ${px0 + 1500},${y + 132} ${px0},${py + 52}" fill="#caa06a"/>`);
  for (let i = 0; i < 9; i++) { const u = i / 9, e = Math.pow(u, .85), x = px0 + 90 + e * 1360, sc = 1 - e * .78, base = py + 22 - (py - (y + 118)) * e;
    const vw = 190 * sc, vh = 78 * sc; s.add(`<rect x="${f(x)}" y="${f(base - vh)}" width="${f(vw)}" height="${f(vh)}" fill="#e8d6b4"/><polygon points="${f(x - 14 * sc)},${f(base - vh)} ${f(x + vw / 2)},${f(base - vh - 70 * sc)} ${f(x + vw + 14 * sc)},${f(base - vh)}" fill="#8a6a45"/><rect x="${f(x + vw * .15)}" y="${f(base - vh * .75)}" width="${f(vw * .7)}" height="${f(vh * .45)}" fill="${P.glow}" opacity="${t === 'dawn' ? .5 : .85}"/>`); for (let k = 0; k < 4; k++) s.add(`<rect x="${f(x + k * vw / 3.4)}" y="${f(base)}" width="${f(5 * sc)}" height="${f(46 * sc)}" fill="#5b4126"/>`); }
  // dhow
  const bx = o.dhow ?? 1750, by = y + 250; s.add(`<path d="M${bx - 170} ${by}L${bx + 150} ${by}L${bx + 100} ${by + 40}L${bx - 120} ${by + 40}Z" fill="#2a1a12"/><path d="M${bx - 10} ${by}V${by - 230}L${bx + 140} ${by - 12}Z" fill="#f4ead6"/><path d="M${bx - 22} ${by}V${by - 170}L${bx - 130} ${by - 8}Z" fill="#e8d8b8"/>`);
  s.add(palm(W - 160, H - 40, 1.8, P.near, -50, r));
  return s;
}

/** Jeddah Corniche: slender tower, the fountain jet, waterfront lights and reflections. */
export function corniche(t = 'dusk', seed = 13) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 760;
  s.add(sky(t, { horizon: y })); s.add(stars(r, t)); s.add(sun(1700, y - 40, 60, t, .85)); s.add(haze(y - 240, 300, P.haze, .5));
  for (let i = 0; i < 40; i++) { const w = 30 + r() * 60, h = 50 + r() * 120, x = r() * W; s.add(`<rect x="${f(x)}" y="${y - h}" width="${f(w)}" height="${h + 30}" fill="${mix(P.far, P.haze, .35)}" opacity=".75"/>`); }
  const tx = 480, tg = id('jt'); s.def(defs.grad(tg, [[0, mix(P.mid, '#000', .15)], [1, mix(P.mid, P.haze, .5)]], 0, 0, 1, 0));
  s.add(`<polygon points="${tx},${y + 20} ${tx + 22},${y - 560} ${tx + 44},${y - 880} ${tx + 66},${y - 560} ${tx + 90},${y + 20}" fill="url(#${tg})"/><polygon points="${tx + 44},${y - 880} ${tx + 66},${y - 560} ${tx + 90},${y + 20} ${tx + 44},${y + 20}" fill="#fff" opacity=".1"/>`);
  s.add(windows(r, tx + 14, y - 520, 62, 520, t, { gap: 8, size: 3 }));
  const wg = id('w'); s.def(defs.grad(wg, [[0, mix(P.sky[2], '#1b4f78', .5)], [1, P.near]])); s.add(`<rect y="${y}" width="${W}" height="${H - y}" fill="url(#${wg})"/>`);
  // fountain jet
  const fx = 1350; s.add(`<path d="M${fx} ${y}V${y - 560}" stroke="#fff" stroke-width="10" stroke-opacity=".85" stroke-linecap="round"/><path d="M${fx} ${y - 560}Q${fx - 60} ${y - 470} ${fx - 90} ${y}M${fx} ${y - 560}Q${fx + 60} ${y - 470} ${fx + 90} ${y}" stroke="#fff" stroke-width="3" fill="none" stroke-opacity=".5"/>`);
  // promenade + reflections
  s.add(`<rect y="${y - 6}" width="${W}" height="26" fill="${P.near}"/>`); for (let i = 0; i < 36; i++) { const x = i * 70 + 10; s.add(`<circle cx="${x}" cy="${y - 22}" r="4" fill="${P.glow}"/><rect x="${x - 1}" y="${y - 20}" width="2" height="16" fill="${P.near}"/><rect x="${x - 3}" y="${y + 24}" width="6" height="${f(40 + r() * 120)}" fill="${P.glow}" opacity=".22"/>`); }
  s.add(palm(140, y + 20, 1.5, P.near, 30, r)); s.add(palm(2260, y + 20, 1.6, P.near, -30, r));
  return s;
}

/** Container port: gantry cranes, stacked containers, ship, water. */
export function port(t = 'blue', seed = 14) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 820;
  s.add(sky(t, { horizon: y })); s.add(stars(r, t)); s.add(sun(500, y - 40, 56, t, .8)); s.add(haze(y - 200, 260, P.haze, .5));
  const wg = id('w'); s.def(defs.grad(wg, [[0, mix(P.sky[3], '#2a6f95', .6)], [1, '#06223f']])); s.add(`<rect y="${y}" width="${W}" height="${H}" fill="url(#${wg})"/>`);
  const cols = ['#b5472d', '#2f6f8f', '#c99a3f', '#4a7a4f', '#7a4f7a', '#d9d4c7', '#356a9e']; 
  const stack = (x, w, n, rows) => { for (let j = 0; j < rows; j++) for (let i = 0; i < n; i++) { const c = cols[Math.floor(r() * cols.length)]; s.add(`<rect x="${f(x + i * w)}" y="${f(y - 34 - j * 30)}" width="${w - 2}" height="28" fill="${mix(c, P.near, .35)}"/>`); } };
  stack(1180, 56, 14, 4); stack(1280, 56, 10, 6); stack(0, 58, 9, 3);
  const crane = (x, sc) => { const c = '#cfd6dc', dk = mix(P.near, '#fff', .15); s.add(`<g stroke="${mix(c, P.near, .35)}" stroke-width="${f(10 * sc)}" fill="none" stroke-linecap="square"><path d="M${x} ${y + 20}L${x + 40 * sc} ${y - 560 * sc}M${x + 220 * sc} ${y + 20}L${x + 180 * sc} ${y - 560 * sc}M${x + 20 * sc} ${y - 300 * sc}H${x + 200 * sc}"/><path d="M${x - 420 * sc} ${y - 520 * sc}H${x + 620 * sc}" stroke-width="${f(18 * sc)}"/><path d="M${x + 40 * sc} ${y - 560 * sc}L${x - 420 * sc} ${y - 520 * sc}M${x + 180 * sc} ${y - 560 * sc}L${x + 620 * sc} ${y - 520 * sc}" stroke-width="${f(6 * sc)}"/></g><rect x="${f(x + 60 * sc)}" y="${f(y - 520 * sc)}" width="${f(80 * sc)}" height="${f(40 * sc)}" fill="${dk}"/><circle cx="${f(x + 100 * sc)}" cy="${f(y - 506 * sc)}" r="${f(5 * sc)}" fill="${P.glow}"/>`); };
  crane(1000, 1); crane(1700, .8); crane(120, .65);
  // ship
  s.add(`<path d="M300 ${y + 30}H1900L1800 ${y + 130}H400Z" fill="#101a2a"/><rect x="340" y="${y - 2}" width="1500" height="36" fill="#d9d4c7" opacity=".8"/>`);
  let rf = ''; for (let i = 0; i < 40; i++) rf += `<rect x="${f(r() * W)}" y="${f(y + 170 + r() * 260)}" width="${f(30 + r() * 140)}" height="2.2" fill="${P.glow}" opacity="${f(.1 + r() * .3)}"/>`; s.add(rf);
  return s;
}

/** Wind turbines and solar rows over dunes (renewables). */
export function energy(t = 'day', seed = 15) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 760;
  s.add(sky(t, { horizon: y })); s.add(sun(1800, y - 200, 70, t, .85)); s.add(haze(y - 220, 280, P.haze, .45));
  s.add(ridge(r, y - 10, 40, mix(P.far, P.haze, .3), { rough: .4, freq: .5, sharp: .3 })); s.add(dunes(r, t, y + 20, 3));
  const turb = (x, base, h, a) => { s.add(`<path d="M${x - 4} ${base}L${x - 2} ${base - h}H${x + 2}L${x + 4} ${base}Z" fill="#e9eef2"/>`); for (let i = 0; i < 3; i++) { const ang = a + i * 2 * Math.PI / 3; s.add(`<path d="M${x} ${base - h}L${f(x + Math.cos(ang) * h * .55)} ${f(base - h + Math.sin(ang) * h * .55)}" stroke="#f3f6f8" stroke-width="${f(2 + h / 90)}" stroke-linecap="round"/>`); } s.add(`<circle cx="${x}" cy="${base - h}" r="${f(3 + h / 60)}" fill="#dfe6ea"/>`); };
  for (let i = 0; i < 14; i++) { const k = r(), x = 80 + i * 170 + r() * 80, base = y + 10 + k * 30; turb(x, base, 90 + k * 110, r() * 6); }
  const sg = id('sp'); s.def(defs.grad(sg, [[0, '#2c4f8a'], [1, '#0e2147']], 0, 0, 1, 1));
  for (let row = 0; row < 9; row++) { const yy = y + 190 + row * row * 9 + row * 30, hh = 20 + row * 9, sc = .35 + row * .16; for (let x = -300; x < W + 300; x += 120 * sc * 1.4) s.add(`<polygon points="${f(x)},${f(yy + hh)} ${f(x + 110 * sc)},${f(yy + hh)} ${f(x + 100 * sc + 18 * sc)},${f(yy)} ${f(x + 18 * sc)},${f(yy)}" fill="url(#${sg})" stroke="#9db8e0" stroke-opacity=".5" stroke-width="${f(.8 + row * .2)}"/>`); }
  s.add(haze(y + 120, 120, P.haze, .2));
  return s;
}

/** Factory: sawtooth roofs, stacks with steam, tanks and pipework at first light. */
export function factory(t = 'dawn', seed = 16) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 960;
  s.add(sky(t, { horizon: y })); s.add(sun(500, y - 70, 64, t, .95)); s.add(haze(y - 260, 320, P.haze, .5));
  s.add(ridge(r, y - 40, 40, mix(P.far, P.haze, .3), { rough: .3, freq: .5, sharp: .2 }));
  const wall = mix(P.mid, P.haze, .2), g = id('fw'); s.def(defs.grad(g, [[0, mix(wall, P.haze, .35)], [1, mix(wall, '#000', .35)]], 0, 0, 1, 0));
  for (let i = 0; i < 6; i++) { const x = 140 + i * 360, w = 330; s.add(`<rect x="${x}" y="${y - 150}" width="${w}" height="190" fill="url(#${g})"/>`); for (let k = 0; k < 4; k++) s.add(`<polygon points="${x + k * w / 4},${y - 150} ${x + k * w / 4 + w / 4},${y - 150} ${x + k * w / 4},${y - 215}" fill="${mix(wall, '#000', .15)}"/>`); s.add(`<rect x="${x + 20}" y="${y - 100}" width="${w - 40}" height="34" fill="${P.glow}" opacity=".55"/>`); }
  for (let i = 0; i < 4; i++) { const x = 1100 + i * 300, h = 330 + r() * 210; s.add(`<rect x="${x}" y="${y - h}" width="52" height="${h + 40}" fill="${mix(P.mid, '#000', .1)}"/><rect x="${x}" y="${y - h}" width="52" height="14" fill="#c24a36"/>`); for (let k = 0; k < 5; k++) s.add(`<circle cx="${f(x + 26 + k * 26)}" cy="${f(y - h - 44 - k * 58)}" r="${f(34 + k * 18)}" fill="#fff" opacity="${f(.5 - k * .09)}"/>`); }
  for (let i = 0; i < 3; i++) { const x = 1980 + i * 150; s.add(`<rect x="${x}" y="${y - 210}" width="120" height="250" rx="20" fill="url(#${g})"/><path d="M${x} ${y - 210}a60 40 0 0 1 120 0z" fill="${mix(wall, P.haze, .3)}"/>`); }
  s.add(`<path d="M0 ${y - 30}H${W}M0 ${y - 54}H${W}" stroke="${mix(P.near, '#fff', .1)}" stroke-width="6"/>`); s.add(`<rect y="${y + 38}" width="${W}" height="${H}" fill="${P.near}"/>`);
  return s;
}

/** Medical campus: glass atrium, low wings, palms, clear sky. */
export function medical(t = 'day', seed = 17) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 900;
  s.add(sky(t, { horizon: y })); s.add(haze(y - 200, 240, P.haze, .5));
  const gl = id('gl'); s.def(defs.grad(gl, [[0, mix('#8fc4e4', P.haze, .3)], [1, '#2b6c9a']], 0, 0, 1, 1)); const wh = id('wh'); s.def(defs.grad(wh, [[0, '#ffffff'], [1, '#c9d4dc']], 0, 0, 1, 0));
  s.add(`<path d="M300 ${y} V${y - 420} Q300 ${y - 520} 420 ${y - 540} L1500 ${y - 640} Q1620 ${y - 650} 1620 ${y - 540} V${y}Z" fill="url(#${wh})"/>`);
  for (let i = 0; i < 14; i++) s.add(`<rect x="${340 + i * 90}" y="${y - 500 + i * -7}" width="64" height="${360 + i * 7}" fill="url(#${gl})" opacity=".92"/>`);
  s.add(`<rect x="1620" y="${y - 360}" width="520" height="360" fill="url(#${wh})"/>`); for (let i = 0; i < 5; i++) s.add(`<rect x="${1660 + i * 96}" y="${y - 320}" width="70" height="250" fill="url(#${gl})"/>`);
  s.add(`<rect x="60" y="${y - 250}" width="240" height="250" fill="url(#${wh})"/>`); for (let i = 0; i < 2; i++) s.add(`<rect x="${90 + i * 100}" y="${y - 210}" width="70" height="170" fill="url(#${gl})"/>`);
  s.add(`<path d="M900 ${y - 100}a140 140 0 0 1 280 0z" fill="url(#${gl})" stroke="#fff" stroke-width="6"/>`);
  s.add(`<rect y="${y}" width="${W}" height="${H}" fill="#cdbfa2"/><rect y="${y}" width="${W}" height="16" fill="#9a8a6b"/>`);
  for (const [x, sc] of [[220, 1.5], [700, 1.2], [1420, 1.3], [2100, 1.6], [2300, 1.1]]) s.add(palm(x, y + 90, sc, '#1f5a35', (x % 3 - 1) * 30, r));
  return s;
}

/** Boardroom: window wall onto the Riyadh skyline, long table, pendant lights. */
export function boardroom(t = 'dusk', seed = 18) {
  const r = rng(seed), P = TOD[t], s = new S(t), wy = 140, wh = 700;
  const inner = riyadh(t, seed, { sunX: 1700 }); s.d += inner.d;
  s.add(`<g transform="translate(0 ${wy - 10}) scale(1 .78)">${inner.b}</g>`);
  s.add(`<rect width="${W}" height="${wy}" fill="#0a1224"/><rect y="${wy + wh}" width="${W}" height="${H}" fill="#0b1426"/>`);
  for (let i = 1; i < 6; i++) s.add(`<rect x="${i * 400 - 6}" y="${wy}" width="12" height="${wh}" fill="#0a1224"/>`);
  const tg = id('tb'); s.def(defs.grad(tg, [[0, '#3a2a1e'], [1, '#14100f']])); s.add(`<polygon points="260,${wy + wh + 30} ${W - 260},${wy + wh + 30} ${W - 40},${H} 40,${H}" fill="url(#${tg})"/><rect x="260" y="${wy + wh + 30}" width="${W - 520}" height="10" fill="#d9b06a" opacity=".5"/>`);
  for (let i = 0; i < 9; i++) { const x = 320 + i * 220; s.add(`<rect x="${x}" y="${wy + wh - 50}" width="150" height="86" rx="26" fill="#050a14"/>`); }
  for (let i = 0; i < 4; i++) { const x = 460 + i * 480; s.add(`<path d="M${x} 0V70" stroke="#0a1224" stroke-width="4"/><path d="M${x - 60} 70h120l30 40h-180z" fill="#e8c27a"/><ellipse cx="${x}" cy="${wy + wh + 44}" rx="150" ry="14" fill="${TOD[t].glow}" opacity=".32"/>`); }
  return s;
}

/** Pointed-arch arcade in perspective: nested arch frames (far to near) with latticed light on the floor. */
export function arcade(t = 'gold', seed = 19, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), vx = o.vx ?? 1200, vy = 600, stone = t === 'night' ? '#4a4266' : t === 'blue' ? '#8fa0b8' : '#d9bb8e';
  s.add(sky(t, { horizon: vy })); s.add(stars(r, t, 60)); s.add(sun(vx, vy - 90, 66, t, .95)); s.add(haze(vy - 200, 300, P.haze, .5));
  s.add(ridge(r, vy + 10, 26, mix(P.far, P.haze, .3), { rough: .3, freq: .5 })); s.add(palm(vx - 200, vy + 50, .8, mix(P.near, P.far, .3), 20, r)); s.add(palm(vx + 240, vy + 50, .7, mix(P.near, P.far, .3), -20, r));
  const fl = id('fl'); s.def(defs.grad(fl, [[0, mix(stone, P.haze, .45)], [1, mix(stone, '#000', .5)]])); s.add(`<rect y="${vy + 20}" width="${W}" height="${H}" fill="url(#${fl})"/>`);
  for (let i = -9; i <= 9; i++) s.add(`<line x1="${vx}" y1="${vy + 20}" x2="${vx + i * 300}" y2="${H}" stroke="#000" stroke-opacity=".12" stroke-width="2"/>`);
  for (let k = 5; k >= 0; k--) {
    const sc = Math.pow(.64, k), g = id('ar'), shade = mix(stone, '#000', .1 + (5 - k) * .045), fog = Math.max(0, k - 1) * .1;
    s.def(defs.grad(g, [[0, mix(shade, '#000', .25)], [.5, shade], [1, mix(shade, P.haze, .25)]], 0, 0, 1, 0));
    const hw = 500, sp = 480, top = -40, bot = H + 60;
    s.add(`<g transform="translate(${vx} ${vy}) scale(${f(sc)}) translate(${-vx} ${-vy})"><path fill-rule="evenodd" fill="${mix(shade, P.haze, fog)}" d="M${vx - 3200} ${bot + 400}V${top - 900}H${vx + 3200}V${bot + 400}H${vx + hw}V${sp}Q${vx + hw} ${sp - 300} ${vx} ${top + 40}Q${vx - hw} ${sp - 300} ${vx - hw} ${sp}V${bot + 400}Z"/><path d="M${vx - hw} ${bot + 400}V${sp}Q${vx - hw} ${sp - 300} ${vx} ${top + 40}Q${vx + hw} ${sp - 300} ${vx + hw} ${sp}V${bot + 400}" fill="none" stroke="${P.glow}" stroke-opacity="${t === 'night' ? .55 : .28}" stroke-width="${f(10 / sc)}"/><rect x="${vx - hw - 90}" y="${sp + 60}" width="90" height="${bot}" fill="url(#${g})" opacity=".7"/><rect x="${vx + hw}" y="${sp + 60}" width="90" height="${bot}" fill="url(#${g})" opacity=".5"/></g>`);
  }
  for (let i = -8; i <= 8; i++) s.add(`<polygon points="${vx + i * 40},${vy + 24} ${vx + i * 80},${vy + 24} ${vx + i * 360},${H} ${vx + i * 310},${H}" fill="${P.glow}" opacity="${f(.05 + (i % 2 ? .05 : 0))}"/>`);
  if (t === 'night' || t === 'dusk') for (let k = 0; k < 4; k++) { const sc = Math.pow(.64, k); s.add(`<circle cx="${vx}" cy="${f(vy + (150 - 0) * sc - 150 * sc + 60 * sc)}" r="${f(10 * sc)}" fill="${P.glow}" opacity=".9"/>`); }
  return s;
}

/** Gold geometric (mashrabiya) lattice on deep blue: for small tiles. */
export function lattice(t = 'night', seed = 20, o = {}) {
  const r = rng(seed), s = new S(t), P = TOD[t], g = id('lt'), step = o.step ?? 150;
  s.def(defs.radial(g, [[0, '#24467c'], [1, '#0a1630']], .5, .45, .8)); s.add(`<rect width="${W}" height="${H}" fill="url(#${g})"/>`);
  const star = (cx, cy, R, col, sw) => { let d = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 - Math.PI / 2, rr = i % 2 ? R * .6 : R; d += `${i ? 'L' : 'M'}${f(cx + Math.cos(a) * rr)} ${f(cy + Math.sin(a) * rr)}`; } return `<path d="${d}Z" fill="none" stroke="${col}" stroke-width="${sw}"/>`; };
  let o2 = ''; for (let y = 0; y < H + step; y += step) for (let x = 0; x < W + step; x += step) { const sx = x + ((y / step) % 2) * step / 2; o2 += star(sx, y, step * .5, '#d6b369', 2.2) + `<circle cx="${sx}" cy="${y}" r="5" fill="#e9c97f" opacity=".8"/>` + star(sx + step / 2, y + step / 2, step * .26, '#d6b369', 1.4); }
  s.add(`<g opacity=".8">${o2}</g>`); const v = id('lv'); s.def(defs.radial(v, [[0, '#ffd98a', .22], [1, '#ffd98a', 0]], o.cx ?? .5, o.cy ?? .5, .5)); s.add(`<rect width="${W}" height="${H}" fill="url(#${v})"/>`);
  return s;
}

/** Night skyline with network arcs and nodes (digital Saudi). */
export function tech(t = 'night', seed = 21) {
  const r = rng(seed), s = riyadh(t, seed, { kingdomX: 500, faisX: 900, kafdX: 1350 }), pts = []; for (let i = 0; i < 26; i++) pts.push([180 + r() * 2040, 160 + r() * 520]);
  let o = ''; for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i]; const [x2, y2] = pts[(i * 7 + 3) % pts.length]; o += `<path d="M${f(x)} ${f(y)}Q${f((x + x2) / 2)} ${f(Math.min(y, y2) - 110)} ${f(x2)} ${f(y2)}" stroke="#7fd3ff" stroke-opacity=".34" stroke-width="2" fill="none"/>`; } for (const [x, y] of pts) o += `<circle cx="${f(x)}" cy="${f(y)}" r="14" fill="#7fd3ff" opacity=".12"/><circle cx="${f(x)}" cy="${f(y)}" r="5" fill="#bfe8ff"/>`;
  s.add(o); return s;
}

/** Construction at dawn: tower cranes and a rising frame. */
export function cranes(t = 'dawn', seed = 22) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 1010;
  s.add(sky(t, { horizon: y })); s.add(sun(1600, y - 90, 64, t, .95)); s.add(haze(y - 260, 320, P.haze, .5));
  for (let i = 0; i < 34; i++) { const w = 34 + r() * 50, h = 60 + r() * 220, x = r() * W; s.add(`<rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${h + 40}" fill="${mix(P.far, P.haze, .35)}" opacity=".8"/>`); }
  const fr = (x, w, floors) => { const fh = 62; for (let i = 0; i <= floors; i++) s.add(`<rect x="${x}" y="${y - i * fh}" width="${w}" height="9" fill="${P.near}"/>`); for (let c = 0; c <= 4; c++) s.add(`<rect x="${f(x + c * w / 4 - 4)}" y="${y - floors * fh}" width="8" height="${floors * fh}" fill="${P.near}"/>`); s.add(`<polygon points="${x},${y - floors * fh} ${x + w},${y - floors * fh - 40} ${x + w},${y - floors * fh}" fill="${P.near}" opacity=".5"/>`); };
  fr(900, 320, 11); fr(1300, 260, 7); fr(560, 240, 5);
  const crane = (x, h, jib) => { const c = P.near; s.add(`<g stroke="${c}" stroke-width="7" fill="none"><path d="M${x} ${y}V${y - h}M${x + 30} ${y}V${y - h}"/>${Array.from({ length: Math.floor(h / 70) }, (_, i) => `<path d="M${x} ${y - i * 70}L${x + 30} ${y - i * 70 - 70}M${x + 30} ${y - i * 70}L${x} ${y - i * 70 - 70}" stroke-width="3"/>`).join('')}<path d="M${x - jib * .3} ${y - h}H${x + jib}" stroke-width="12"/><path d="M${x + 15} ${y - h - 80}L${x - jib * .3} ${y - h}M${x + 15} ${y - h - 80}L${x + jib} ${y - h}" stroke-width="4"/><path d="M${x + jib * .8} ${y - h}V${y - h + 160}" stroke-width="3"/></g><rect x="${x - jib * .3 - 40}" y="${y - h - 10}" width="46" height="28" fill="${c}"/>`); };
  crane(250, 700, 700); crane(1750, 820, 600); crane(2150, 560, 330);
  s.add(`<rect y="${y + 20}" width="${W}" height="${H}" fill="${P.near}"/>`); s.add(ridge(r, y + 90, 10, mix(P.near, '#000', .25), { rough: .2, freq: .5 }));
  return s;
}

/** Retail boulevard at night: glowing shopfronts, canopy lights, bokeh. */
export function boulevard(t = 'night', seed = 23) {
  const r = rng(seed), P = TOD[t], s = new S(t), vx = 1200, vy = 600;
  s.add(sky(t, { horizon: vy })); s.add(stars(r, t, 100));
  const fl = id('bf'); s.def(defs.grad(fl, [[0, '#2a3a5c'], [1, '#080f1f']])); s.add(`<rect y="${vy}" width="${W}" height="${H}" fill="url(#${fl})"/>`);
  const side = (sg) => { for (let k = 0; k < 7; k++) { const e0 = Math.pow(k / 7, 1.6), e1 = Math.pow((k + 1) / 7, 1.6); const xa = vx + sg * (1250 * (1 - e0) + 70), xb = vx + sg * (1250 * (1 - e1) + 70), ta = -100 + e0 * (vy - 160), tb = -100 + e1 * (vy - 160), ba = H + 80 - e0 * (H - vy - 60), bb = H + 80 - e1 * (H - vy - 60); const c = ['#e9c27a', '#7fd3ff', '#ff9d6b', '#cfa3ff'][k % 4];
      s.add(`<polygon points="${f(xa)},${f(ta)} ${f(xb)},${f(tb)} ${f(xb)},${f(bb)} ${f(xa)},${f(ba)}" fill="${mix('#1b2744', c, .08)}"/><polygon points="${f(xa)},${f(ta + (ba - ta) * .42)} ${f(xb)},${f(tb + (bb - tb) * .42)} ${f(xb)},${f(bb - (bb - tb) * .12)} ${f(xa)},${f(ba - (ba - ta) * .12)}" fill="${c}" opacity=".7"/><polygon points="${f(xa)},${f(ta + (ba - ta) * .36)} ${f(xb)},${f(tb + (bb - tb) * .36)} ${f(xb)},${f(tb + (bb - tb) * .4)} ${f(xa)},${f(ta + (ba - ta) * .4)}" fill="#fff" opacity=".5"/>`); } };
  side(-1); side(1);
  for (let i = 0; i < 70; i++) { const x = r() * W, y2 = vy + 80 + r() * 600, rr = 6 + r() * 26; s.add(`<circle cx="${f(x)}" cy="${f(y2)}" r="${f(rr)}" fill="${['#ffd98a', '#7fd3ff', '#ff9d6b'][i % 3]}" opacity="${f(.05 + r() * .18)}"/>`); }
  for (let i = 0; i < 12; i++) { const e = Math.pow(i / 12, 1.5), y2 = 60 + e * 520, x0 = vx - 1100 * (1 - e) - 60, x1 = vx + 1100 * (1 - e) + 60; s.add(`<path d="M${f(x0)} ${f(y2)}Q${vx} ${f(y2 + 70 * (1 - e) + 8)} ${f(x1)} ${f(y2)}" stroke="#ffd98a" stroke-opacity="${f(.25 + e * .5)}" stroke-width="${f(2 + e * 3)}" fill="none"/>`); }
  return s;
}

/** Glass towers seen from below, converging overhead (finance district). */
export function towersUp(t = 'blue', seed = 24, o = {}) {
  const r = rng(seed), P = TOD[t], s = new S(t), vx = o.vx ?? 1200, vy = -300;
  s.add(sky(t, { horizon: 700 }));
  for (let i = -5; i <= 5; i++) { const x0 = vx + i * 330, x1 = vx + i * 330 + 270, g = id('tu'); s.def(defs.grad(g, [[0, mix(P.mid, '#000', .2)], [.5, mix(P.mid, P.haze, .3)], [1, mix(P.far, '#fff', .15)]], 0, 0, 1, 0));
    const tl = vx + (x0 - vx) * .08, tr2 = vx + (x1 - vx) * .08; s.add(`<polygon points="${f(x0)},${H} ${f(tl)},60 ${f(tr2)},60 ${f(x1)},${H}" fill="url(#${g})" opacity="${f(1 - Math.abs(i) * .04)}"/>`);
    for (let k = 1; k < 24; k++) { const e = k / 24, y = H - Math.pow(e, .6) * (H - 60); const xl = x0 + (tl - x0) * Math.pow(e, .6), xr = x1 + (tr2 - x1) * Math.pow(e, .6); s.add(`<line x1="${f(xl)}" y1="${f(y)}" x2="${f(xr)}" y2="${f(y)}" stroke="#fff" stroke-opacity=".18"/>`); } }
  s.add(`<polygon points="${vx - 380},0 ${vx + 380},0 ${vx + 140},140 ${vx - 140},140" fill="${P.sky[3]}" opacity=".85"/>`);
  return s;
}

/** Trojena-style mountains with snow-dusted peaks above a still lake. */
export function mountains(t = 'blue', seed = 25) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 800;
  s.add(sky(t, { horizon: y })); s.add(stars(r, t)); s.add(sun(1700, y - 260, 50, t, .8)); s.add(haze(y - 260, 340, P.haze, .45));
  [[y - 380, 220, '#6f8fb4'], [y - 260, 190, '#4b6a92'], [y - 120, 140, '#2c4668']].forEach(([yy, am, c], i) => { s.add(ridge(r, yy, am, c, { rough: .9, freq: .7 + i * .2, sharp: .7 })); s.add(haze(yy - 50, 200, P.haze, .22)); });
  const lg = id('lk'); s.def(defs.grad(lg, [[0, '#3d6f98'], [1, '#08203d']])); s.add(`<rect y="${y}" width="${W}" height="${H}" fill="url(#${lg})"/>`);
  let rf = ''; for (let i = 0; i < 60; i++) rf += `<rect x="${f(r() * W)}" y="${f(y + 20 + r() * 420)}" width="${f(40 + r() * 200)}" height="2" fill="#fff" opacity="${f(.05 + r() * .12)}"/>`; s.add(rf);
  return s;
}

/** University / training campus: arched facade with a dome, courtyard and palms. */
export function campus(t = 'gold', seed = 26) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 930, stone = t === 'night' ? '#4a4266' : '#e2c79c';
  s.add(sky(t, { horizon: y })); s.add(sun(380, y - 140, 60, t, .9)); s.add(haze(y - 240, 300, P.haze, .5));
  const g = id('cm'); s.def(defs.grad(g, [[0, mix(stone, P.haze, .3)], [1, mix(stone, '#2a1d18', .45)]], 0, 0, 1, 0));
  s.add(`<rect x="420" y="${y - 330}" width="1560" height="360" fill="url(#${g})"/><rect x="380" y="${y - 350}" width="1640" height="30" fill="${mix(stone, '#2a1d18', .2)}"/>`);
  s.add(`<path d="M1020 ${y - 330}a180 180 0 0 1 360 0z" fill="${mix(stone, P.haze, .25)}"/><path d="M1200 ${y - 510}V${y - 600}" stroke="#d4af5f" stroke-width="6"/><circle cx="1200" cy="${y - 606}" r="14" fill="#d4af5f"/>`);
  for (let i = 0; i < 9; i++) { const x = 470 + i * 166; s.add(`<path d="M${x} ${y + 30}V${y - 120}Q${x} ${y - 200} ${x + 60} ${y - 220}Q${x + 120} ${y - 200} ${x + 120} ${y - 120}V${y + 30}Z" fill="${mix(P.near, '#000', .2)}"/><path d="M${x + 14} ${y + 30}V${y - 110}Q${x + 14} ${y - 170} ${x + 60} ${y - 190}Q${x + 106} ${y - 170} ${x + 106} ${y - 110}V${y + 30}Z" fill="${P.glow}" opacity="${t === 'day' ? .15 : .5}"/>`); }
  s.add(`<rect y="${y + 30}" width="${W}" height="${H}" fill="${mix(stone, '#000', .35)}"/>`);
  for (let i = -6; i <= 6; i++) s.add(`<line x1="1200" y1="${y + 30}" x2="${1200 + i * 330}" y2="${H}" stroke="#000" stroke-opacity=".1" stroke-width="2"/>`);
  for (const [x, sc] of [[200, 1.5], [330, 1.1], [2100, 1.6], [2260, 1.15]]) s.add(palm(x, y + 120, sc, '#1f4f31', (x % 3 - 1) * 30, r));
  return s;
}
/** Date-palm grove and irrigated fields at golden hour. */
export function farm(t = 'gold', seed = 27) {
  const r = rng(seed), P = TOD[t], s = new S(t), y = 760;
  s.add(sky(t, { horizon: y })); s.add(sun(1700, y - 80, 62, t, .95)); s.add(haze(y - 220, 280, P.haze, .5));
  s.add(ridge(r, y - 10, 36, mix(P.far, P.haze, .3), { rough: .4, freq: .5, sharp: .3 }));
  const gg = id('fg'); s.def(defs.grad(gg, [[0, mix('#7aa24c', P.haze, .35)], [1, '#2b4a24']])); s.add(`<rect y="${y}" width="${W}" height="${H}" fill="url(#${gg})"/>`);
  for (let row = 0; row < 9; row++) { const e = row / 9, yy = y + 30 + e * e * 520; s.add(`<rect y="${f(yy)}" width="${W}" height="${f(6 + e * 20)}" fill="#1f3a1b" opacity=".35"/>`); }
  for (let row = 0; row < 7; row++) { const e = Math.pow(row / 7, 1.4), yy = y + 40 + e * 560, sc = .35 + e * 1.4; for (let x = -100 + (row % 2) * 90; x < W + 100; x += 330 * (.4 + e * .9)) s.add(palm(f(x + r() * 20), f(yy), f(sc), '#17401f', (r() - .5) * 40, r)); }
  s.add(haze(y + 60, 140, P.haze, .2));
  return s;
}
