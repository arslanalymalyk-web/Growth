// Tiny SVG scene toolkit. Scenes are drawn on a 2400x1350 canvas and cropped per image with preserveAspectRatio="slice".
export const W = 2400, H = 1350;
export const rng = (seed) => { let s = (seed * 2654435761) >>> 0 || 1; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); };
export const f = (n) => Math.round(n * 10) / 10;
let uid = 0; export const id = (p = 'g') => `${p}${++uid}`;

/** Time-of-day palettes: sky stops (top to horizon), light colour, shadow colour, haze colour, window glow. */
export const TOD = {
  dawn:  { sky: ['#1a2750', '#5b5a93', '#d98a8a', '#ffd7a0'], sun: '#ffe2ad', far: '#7a7fa6', mid: '#4a5478', near: '#1c2744', haze: '#ffd7a0', glow: '#ffd58a', lit: .12, star: 0 },
  day:   { sky: ['#2c6aa8', '#6fa8d8', '#b9d9ee', '#eef3f2'], sun: '#fff6d6', far: '#9db5c9', mid: '#6d8aa3', near: '#334c66', haze: '#eef3f2', glow: '#ffe9a8', lit: 0, star: 0 },
  dusk:  { sky: ['#0d1a3d', '#3a3b78', '#c8627a', '#f6b47a'], sun: '#ffd49a', far: '#8a6f9c', mid: '#4d4670', near: '#1a1f45', haze: '#f6b47a', glow: '#ffcf7a', lit: .35, star: .15 },
  gold:  { sky: ['#17305c', '#6d6a9a', '#e0925f', '#ffd596'], sun: '#fff0c2', far: '#a98a7c', mid: '#6d5a66', near: '#2a2a48', haze: '#ffd596', glow: '#ffd27a', lit: .2, star: 0 },
  night: { sky: ['#040a1a', '#0a1b3d', '#17406a', '#2d5d8c'], sun: '#cfe3ff', far: '#1d3a63', mid: '#112a4c', near: '#071327', haze: '#2d5d8c', glow: '#ffd98a', lit: .62, star: 1 },
  blue:  { sky: ['#0b1e46', '#1d4a86', '#5e92c2', '#cfe1ee'], sun: '#eaf4ff', far: '#6f92b6', mid: '#3d5f88', near: '#142b4d', haze: '#cfe1ee', glow: '#ffe3a0', lit: .3, star: .1 }
};

export const defs = {
  grad(i, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) { return `<linearGradient id="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`; },
  radial(i, stops, cx = .5, cy = .5, r = .5) { return `<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`; }
};

export function sky(t, { horizon = 800 } = {}) {
  const g = id('sky'), P = TOD[t];
  return { defs: defs.grad(g, [[0, P.sky[0]], [.38, P.sky[1]], [.72, P.sky[2]], [1, P.sky[3]]]), body: `<rect width="${W}" height="${horizon + 60}" fill="url(#${g})"/>` };
}
export function stars(r, t, n = 120) {
  const P = TOD[t]; if (!P.star) return '';
  let o = ''; for (let i = 0; i < n * P.star; i++) o += `<circle cx="${f(r() * W)}" cy="${f(r() * 520)}" r="${f(.6 + r() * 1.4)}" fill="#fff" opacity="${f(.25 + r() * .6)}"/>`;
  return o;
}
export function sun(x, y, rad, t, o = 1) {
  const g = id('sun'), P = TOD[t];
  return { defs: defs.radial(g, [[0, P.sun, o], [.22, P.sun, o * .75], [.5, P.haze, o * .22], [1, P.haze, 0]]), body: `<circle cx="${x}" cy="${y}" r="${rad * 4}" fill="url(#${g})"/><circle cx="${x}" cy="${y}" r="${rad}" fill="${P.sun}" opacity="${o}"/>` };
}
/** Soft horizontal haze band. */
export function haze(y, h, color, a = .5) { const g = id('hz'); return { defs: defs.grad(g, [[0, color, 0], [.55, color, a], [1, color, 0]]), body: `<rect x="-20" y="${y}" width="${W + 40}" height="${h}" fill="url(#${g})"/>` }; }

/** Smooth ridge / dune line filled down to the canvas bottom. */
export function ridge(r, y0, amp, fill, { rough = .5, freq = 1, sharp = 0, x0 = -40, x1 = W + 40, step = 16, bottom = H + 40, stroke = '' } = {}) {
  const p = [r() * 6, r() * 6, r() * 6], a = [1, .42 + rough * .3, .16 + rough * .2], fr = [.0016 * freq, .0041 * freq, .0097 * freq];
  let d = `M${x0} ${bottom}`;
  for (let x = x0; x <= x1; x += step) {
    let v = a[0] * Math.sin(x * fr[0] + p[0]) + a[1] * Math.sin(x * fr[1] + p[1]) + a[2] * Math.sin(x * fr[2] + p[2]);
    if (sharp) v = v * (1 - sharp) + sharp * (1 - 2 * Math.abs(Math.sin(x * fr[0] * 1.3 + p[0]))) * 1.2;
    d += `L${x} ${f(y0 - amp * v)}`;
  }
  return `<path d="${d}L${x1} ${bottom}Z" fill="${fill}"${stroke ? ` stroke="${stroke}"` : ''}/>`;
}
export function dunes(r, t, y = 880, layers = 4) {
  const P = TOD[t], cols = [P.far, P.mid, P.near]; let o = '';
  for (let i = 0; i < layers; i++) {
    const k = i / Math.max(1, layers - 1), c = mix(i < layers - 1 ? P.far : P.mid, P.near, k * .85);
    o += ridge(r, y + i * 70, 40 + i * 22, c, { rough: .4, freq: .8 - i * .08, sharp: .55 });
  }
  return o;
}
export const hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
export const mix = (a, b, k) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };

/** Window grid for a rectangular facade. */
export function windows(r, x, y, w, h, t, { cols = 0, gap = 11, size = 5, lit } = {}) {
  const P = TOD[t], prob = lit ?? P.lit; if (prob <= 0) return `<g opacity=".14" fill="#fff">${grid(x, y, w, h, gap, size, () => r() < .2)}</g>`;
  return `<g fill="${P.glow}" opacity=".9">${grid(x, y, w, h, gap, size, () => r() < prob)}</g><g fill="#fff" opacity=".06">${grid(x, y, w, h, gap, size, () => r() < .5)}</g>`;
}
function grid(x, y, w, h, gap, size, pick) { let o = ''; for (let yy = y + 10; yy < y + h - 6; yy += gap * 1.5) for (let xx = x + 7; xx < x + w - 7; xx += gap) if (pick()) o += `<rect x="${f(xx)}" y="${f(yy)}" width="${size}" height="${f(size * 1.5)}"/>`; return o; }

/** Palm tree: curved trunk and fronds. */
export function palm(x, y, s, color = '#12301f', lean = 0, r = rng(7)) {
  const tx = x + lean * s * .5, ty = y - 220 * s; let o = `<path d="M${x} ${y}Q${x + lean * s * .1} ${y - 120 * s} ${tx} ${ty}" stroke="${color}" stroke-width="${f(7 * s)}" fill="none" stroke-linecap="round"/>`;
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + r() * .3, len = (95 + r() * 55) * s, ex = tx + Math.cos(a) * len, ey = ty + Math.sin(a) * len * .55 + len * .28;
    o += `<path d="M${tx} ${ty}Q${f(tx + Math.cos(a) * len * .55)} ${f(ty - 30 * s + Math.sin(a) * len * .2)} ${f(ex)} ${f(ey)}" stroke="${color}" stroke-width="${f(5 * s)}" fill="none" stroke-linecap="round"/>`;
  }
  return o;
}
/** Najdi-style crenellation (stepped triangles) along the top of a wall. */
export function merlons(x, y, w, s, color) { let o = ''; const n = Math.max(2, Math.floor(w / (26 * s))); const mw = w / n; for (let i = 0; i < n; i++) o += `<path d="M${f(x + i * mw)} ${y}l${f(mw / 2)} ${f(-16 * s)}l${f(mw / 2)} ${f(16 * s)}z" fill="${color}"/>`; return o; }
/** Triangular openings typical of Najdi walls. */
export function najdiOpenings(x, y, w, h, s, color, r) { let o = ''; for (let yy = y + 20 * s; yy < y + h - 20 * s; yy += 44 * s) for (let xx = x + 14 * s; xx < x + w - 14 * s; xx += 30 * s) if (r() < .55) o += `<path d="M${f(xx)} ${f(yy + 16 * s)}l${f(6 * s)} ${f(-16 * s)}l${f(6 * s)} ${f(16 * s)}z" fill="${color}"/>`; return o; }

export function grain(seed = 3, o = .09) { const g = id('gr'); return `<filter id="${g}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}" result="n"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 ${o}"/></feComponentTransfer></filter><rect width="${W}" height="${H}" filter="url(#${g})" style="mix-blend-mode:overlay"/>`; }
export function vignette(a = .45) { const g = id('vg'); return `<defs>${defs.radial(g, [[.55, '#000', 0], [1, '#000', a]], .5, .5, .75)}</defs><rect width="${W}" height="${H}" fill="url(#${g})"/>`; }
