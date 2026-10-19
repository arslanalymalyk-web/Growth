// Line icons (24x24, stroke). Paths are intentionally simple and geometric.
const P = {
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 15h6M9 18h4"/>',
  network: '<rect x="9" y="3" width="6" height="4"/><rect x="2.5" y="16" width="6" height="4"/><rect x="15.5" y="16" width="6" height="4"/><path d="M12 7v4M5.5 16v-5h13v5"/>',
  gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5a7.7 7.7 0 0 0 0-3l1.8-1.4-1.8-3.1-2.1.8a7.6 7.6 0 0 0-2.6-1.5L14.4 3.1h-3.6l-.3 2.2a7.6 7.6 0 0 0-2.6 1.5l-2.1-.8-1.8 3.1 1.8 1.4a7.7 7.7 0 0 0 0 3l-1.8 1.4 1.8 3.1 2.1-.8a7.6 7.6 0 0 0 2.6 1.5l.3 2.2h3.6l.3-2.2a7.6 7.6 0 0 0 2.6-1.5l2.1.8 1.8-3.1z"/>',
  users: '<circle cx="12" cy="8" r="3"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/><circle cx="4.5" cy="10" r="2"/><circle cx="19.5" cy="10" r="2"/><path d="M1.5 18v-1.2a3.5 3.5 0 0 1 3-3.4M22.5 18v-1.2a3.5 3.5 0 0 0-3-3.4"/>',
  chart: '<path d="M4 20V13h4v7M10 20V8h4v12M16 20V3h4v17M3 20.5h18"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-15 0 9-5 15-13 15"/><path d="M5 19c3-5 6-8 10-10"/>',
  nodes: '<circle cx="6" cy="12" r="2.2"/><circle cx="17" cy="6" r="2.2"/><circle cx="17" cy="18" r="2.2"/><circle cx="12" cy="12" r="0.01"/><path d="m8 11 7-4M8 13l7 4"/>',
  door: '<path d="M6 21V3h10l2 2v16M3 21h18"/><path d="M13 12h1.5"/><path d="M6 3l7 2v16"/>',
  building: '<rect x="5" y="3" width="14" height="18"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3"/>',
  cart: '<path d="M2.5 4h3l2.4 11h10l2-8H6.5"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  bell: '<path d="M3 17h18M5 17a7 7 0 0 1 14 0M12 7.5V5M10.5 5h3M2.5 20h19"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V6h3v15zM3 21h18M8 17h1M12 17h1M16 17h1"/>',
  chip: '<rect x="6" y="6" width="12" height="12"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v3M12 3v3M15 3v3M9 18v3M12 18v3M15 18v3M3 9h3M3 12h3M3 15h3M18 9h3M18 12h3M18 15h3"/>',
  crane: '<path d="M5 21V4l-2 3M5 4h15M5 8l11-4M17 4v6M17 10v.01M3 21h9M8 21V12h4v9"/>',
  steth: '<path d="M6 3v6a4 4 0 0 0 8 0V3M4.5 3H8M12 3h3.5M10 13v3a4 4 0 0 0 8 0v-1"/><circle cx="18" cy="13" r="2"/>',
  truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>',
  bag: '<path d="M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  palm: '<path d="M12 21c0-5 .5-8 2-11M12 10c-2-3-5-3-8-1 3 0 5 .5 8 1zM12 10c0-3 2-5 5-5-1 2-2 3.500-5 5zM12 10c3 0 6 1 8 3-3 0-6-1-8-3zM12 10C9 8 8 5 8.500 3.500 11 4.500 12 7 12 10zM8 21h8"/>',
  target: '<circle cx="11" cy="13" r="8"/><circle cx="11" cy="13" r="4.5"/><circle cx="11" cy="13" r="1"/><path d="m11 13 8-8M16 3v3.500H19.500"/>',
  bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.500 10.900c.7.600 1 1.300 1 2.100h5c0-.8.300-1.500 1-2.100A6 6 0 0 0 12 3z"/>',
  chat: '<path d="M4 5h16v11H11l-5 4v-4H4z"/>',
  person: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  handshake: '<path d="m2 12 4-4 4 1 3-2 4 2 5 0M2 12l7 7a2 2 0 0 0 3 0l.5-.5M22 12l-6 6a2 2 0 0 1-3 0M7 13l3 3M10 11l4 4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M12 14h2M8 17h2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 7 9-7"/>',
  pin: '<path d="M12 21s7-6.100 7-11a7 7 0 0 0-14 0c0 4.900 7 11 7 11z"/><circle cx="12" cy="10" r="2.500"/>',
  phone: '<path d="M5 3h4l2 5-2.500 1.500a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2C10 21 3 14 3 5a2 2 0 0 1 2-2z"/>',
  check: '<path d="m4 12.500 5 5L20 6.500"/>',
  shield: '<path d="M12 3 4.500 6v6c0 4.500 3 7.500 7.500 9 4.500-1.500 7.500-4.500 7.500-9V6z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3M12 15v3"/>',
  scale: '<path d="M12 3v18M7 21h10M4 7h16M4 7l-2.500 7a3.500 3.500 0 0 0 5 0zM20 7l-2.500 7a3.500 3.500 0 0 0 5 0z"/>',
  flag: '<path d="M5 21V4M5 4h13l-2.500 4 2.500 4H5"/>',
  coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.700 3 3 7 3s7-1.300 7-3V6M5 12v6c0 1.700 3 3 7 3s7-1.300 7-3v-6"/>',
  megaphone: '<path d="M3 10v4h4l9 5V5L7 10zM19 9.500a4 4 0 0 1 0 5M7 14l1.500 6h3L10 16.500"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="1"/><path d="M9 4V3h6v1M9 11l1.500 1.500L14 9M9 16h6"/>',
  route: '<circle cx="6" cy="18" r="2.500"/><circle cx="18" cy="6" r="2.500"/><path d="M8.500 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.500"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="1"/><path d="M9 7V4h6v3M3 13h18M11 13v2h2v-2"/>',
  download: '<path d="M12 3v12M7 10.500l5 5 5-5M4 20h16"/>',
  award: '<circle cx="12" cy="9" r="5.500"/><path d="m8.500 14-1.500 7 5-3 5 3-1.500-7"/>',
  scales2: '<path d="M4 20h16M12 4v16M6 8h12"/>',
  tower: '<path d="M9 21V9l3-6 3 6v12M6 21V14l3-2M18 21V14l-3-2M3 21h18"/>',
  home: '<path d="m3 11 9-8 9 8M5 9.500V21h14V9.500M10 21v-6h4v6"/>',
  rocket: '<path d="M14 4c3 0 6 0 6 0s0 3-.5 6c-1 3-4 5.500-7 7l-5-5C9 9 11 5.500 14 4zM9 12l-4 1-2 3 4-.5M12 15l-1 4-3 2 .5-4"/><circle cx="15" cy="9" r="1.500"/>',
  heart: '<path d="M12 20S4 15 4 9a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z"/><path d="M6 12h3l1.500-2.500 2 4L14 12h3"/>',
  plane: '<path d="m3 12 18-8-6 17-3-7zM12 14l9-10"/>',
  send: '<path d="m21 3-9 18-2.500-8L3 10.500z"/><path d="m9.500 13 11.500-10"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H5M11 6l-6 6 6 6"/>',
  arrowRight: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  play: '<path d="M8 5l11 7-11 7z"/>',
  arrowdown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  warning: '<path d="M12 3 2 20h20zM12 10v5M12 17.500v.01"/>',
  stack: '<path d="m12 3 9 5-9 5-9-5zM3 13l9 5 9-5M3 17.500l9 5 9-5"/>',
  filechk: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 14l2 2 4-4"/>',
  chess: '<path d="M9 21h8M10 21c0-4 1-5 1-8l-3-1 1-3c0-2 1.500-4 4-5l2 2-1 2 3 2c1 2 1 5 1 8 0 2 .500 3 1 3M10 8.500h.01"/>',
  pyramid: '<path d="m3 21 9-16 9 16zM12 5v16"/>'
};

export const icon = (name, cls = '') => {
  const body = P[name] || P.doc;
  return `<svg class="ic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
};

const SOCIAL = {
  linkedin: '<path d="M4.500 3A1.800 1.800 0 1 0 4.500 6.600 1.800 1.800 0 0 0 4.500 3zM3 8h3v13H3zM9 8h2.800v1.800C12.500 8.500 14 7.800 15.500 7.800c3 0 4 2 4 4.700V21h-3v-7.800c0-1.500-.5-2.400-1.800-2.400-1.400 0-2.200 1-2.200 2.600V21H9z"/>',
  x: '<path d="M17.500 3h3l-6.600 7.600L21.700 21h-6l-4.700-6.200L5.600 21h-3l7-8.100L2.300 3h6.200l4.300 5.700zM16.400 19.200h1.700L7.600 4.700H5.800z"/>',
  youtube: '<path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z"/>'
};
export const social = (name) => `<svg class="ic ic-fill" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">${SOCIAL[name]}</svg>`;

/** Brand mark: a pointed gateway arch drawn as a "G", three rising bars and a drafting rule. Source: brand/mark.svg */
export const logoMark = `<svg class="logo-mark" viewBox="0 0 64 68" fill="none" aria-hidden="true"><defs><linearGradient id="gbm" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3cd9a"/><stop offset="1" stop-color="#b8944d"/></linearGradient></defs><path d="M10 58V34A30 30 0 0 1 32 5.1A30 30 0 0 1 54 34M54 58V44H41" stroke="url(#gbm)" stroke-width="3.2" stroke-miterlimit="8"/><path d="M18 58V49H21.600V58ZM25.600 58V41H29.200V58ZM33.200 58V32.500H36.800V58Z" fill="#f6f1e6"/><path d="M35 20.200L37.200 23.600L35 27L32.800 23.600Z" fill="url(#gbm)"/><path d="M4 62.200H60M4 59.600V64.800M60 59.600V64.800" stroke="#c9a867" stroke-width=".9"/></svg>`;
