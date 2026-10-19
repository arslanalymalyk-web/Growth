import fs from 'node:fs';
import { riyadh, desert, alula, diriyah } from './scenes1.mjs';
import * as B from './scenes2.mjs';
const dims = JSON.parse(fs.readFileSync(new URL('./dims.json', import.meta.url)));

/** Scene variants (Vision 2030 themes: capital, giga-projects, heritage, renewables, industry, health, logistics, tourism). */
const V = {
  riyDusk: () => riyadh('dusk', 1), riyGold: () => riyadh('gold', 31, { sunX: 1500 }), riyNight: () => riyadh('night', 5), riyBlue: () => riyadh('blue', 32, { sunX: 900 }), riyDawn: () => riyadh('dawn', 33, { sunX: 700 }),
  heroHome: () => riyadh('gold', 61, { sunX: 1750, kingdomX: 420, faisX: 860, kafdX: 1180 }), line: () => B.theLine('dawn', 11), lineDusk: () => B.theLine('dusk', 34), redsea: () => B.redSea('dawn', 12), redseaDusk: () => B.redSea('dusk', 35, { sunX: 800, dhow: 1600 }),
  corn: () => B.corniche('dusk', 13), cornGold: () => B.corniche('gold', 36), port: () => B.port('blue', 14), portDusk: () => B.port('dusk', 41),
  energy: () => B.energy('day', 15), energyDawn: () => B.energy('dawn', 37), factory: () => B.factory('dawn', 16), factoryDusk: () => B.factory('dusk', 42), medical: () => B.medical('day', 17),
  board: () => B.boardroom('dusk', 18), boardNight: () => B.boardroom('night', 38), arcade: () => B.arcade('gold', 19), arcadeNight: () => B.arcade('night', 43), arcadeBlue: () => B.arcade('blue', 44), arcadeDusk: () => B.arcade('dusk', 45),
  lattice: () => B.lattice('night', 20), lattice2: () => B.lattice('night', 46, { step: 110, cx: .3 }), lattice3: () => B.lattice('night', 47, { step: 190, cx: .7, cy: .3 }),
  campus: () => B.campus('gold', 26), campusDay: () => B.campus('day', 57), farm: () => B.farm('gold', 27), farmDawn: () => B.farm('dawn', 58),
  tech: () => B.tech('night', 21), cranes: () => B.cranes('dawn', 22), towers: () => B.towersUp('blue', 24), mount: () => B.mountains('blue', 25), mountDusk: () => B.mountains('dusk', 48),
  alula: () => alula('gold', 3), alulaDay: () => alula('day', 49), alulaDawn: () => alula('dawn', 50), alulaNight: () => alula('night', 51), alulaBlue: () => alula('blue', 52),
  diriyah: () => diriyah('gold', 4), diriyahDusk: () => diriyah('dusk', 53), diriyahDay: () => diriyah('day', 54),
  desert: () => desert('dawn', 2, { palms: 300 }), desertGold: () => desert('gold', 55, { sunX: 700 }), desertDusk: () => desert('dusk', 56, { sunX: 1700 })
};
// name -> [scene, focus]
const ASSIGN = {
  'hero-home': ['heroHome'], 'hero-skyline-dusk': ['riyDusk'], 'hero-riyadh-sunset': ['riyGold'], 'hero-riyadh-bridge': ['riyBlue'], 'hero-skyline-wide': ['riyDawn'], 'hero-corniche': ['corn'], 'hero-man-skyline': ['board'], 'hero-man-light': ['redsea'],
  'ck-hero-night': ['riyNight'], 'ck-hero-arcade': ['arcade'], 'p-skyline-dusk': ['riyDusk', 'xMinYMid'],
  'cta-cliffs-light': ['alulaDay'], 'cta-desert-cliffs': ['alulaDawn'], 'cta-fort-palm': ['diriyah'], 'cta-rocks-dark': ['alulaNight'], 'ck-cta-terrace': ['redseaDusk'], 'band-man-desert': ['desert'],
  'svc-strategy': ['riyDawn', 'xMidYMid'], 'svc-formation': ['towers'], 'svc-partnerships': ['diriyahDusk'], 'svc-hr': ['arcadeBlue'], 'svc-governance': ['alulaBlue'], 'svc-operations': ['factoryDusk'], 'svc-tech': ['tech'], 'svc-brand': ['lattice'],
  'ind-fmcg': ['arcadeNight'], 'ind-realestate': ['riyBlue', 'xMinYMid'], 'ind-hospitality': ['redsea', 'xMaxYMid'], 'ind-manufacturing': ['factory'], 'ind-tech': ['tech'], 'ind-construction': ['cranes'], 'ind-healthcare': ['medical'], 'ind-logistics': ['port'], 'ind-professional': ['towers'], 'ind-retail': ['arcadeDusk'], 'ind-tourism': ['alula'],
  'p-fmcg': ['arcadeNight'], 'p-fmcg-overview': ['lattice2'], 'p-founder': ['riyGold', 'xMinYMid'], 'p-healthcare': ['medical'], 'p-hospitality-lobby': ['redseaDusk'], 'p-manufacturing-floor': ['factoryDusk'], 'p-port-logistics': ['portDusk'], 'p-professional': ['towers'], 'p-retail': ['arcadeDusk'],
  'p-business-meeting': ['boardNight'], 'p-construction': ['cranes'], 'p-desert': ['desertGold'], 'p-district-skyline': ['riyDawn'], 'p-engineering-workspace': ['energyDawn'], 'p-insight1': ['alulaDawn'], 'p-insight2': ['desertDusk'], 'p-insight3': ['diriyahDay'],
  'ins-rocks': ['alulaBlue'], 'ins-skyline': ['riyDusk'], 'ins-wall': ['diriyahDusk'],
  'alula-tombs': ['alula'], 'colonnade-tower': ['arcadeBlue'], 'curved-building': ['towers'], 'fort-tower': ['diriyah'], 'founder-back': ['riyGold', 'xMinYMid'], 'jeddah-waterfront': ['cornGold'], 'lounge-arch': ['arcadeNight'], 'palms-arch': ['arcade'], 'man-on-rocks': ['alulaDay'], 'meeting-window': ['board'], 'office-lobby': ['arcadeDusk'], 'walkers-mashrabiya': ['lattice3'], 'sq-palms-fort': ['diriyahDay'],
  'sq1': ['desertGold'], 'sq2': ['energy'], 'sq3': ['mount'], 'sq4': ['redsea'], 'sq5': ['lattice2'], 'sq6': ['alulaDawn'], 'sq7': ['mountDusk'],
  'stage1': ['riyDawn', 'xMinYMid'], 'stage2': ['lattice'], 'stage3': ['cranes'], 'stage4': ['port'], 'stage5': ['energyDawn'],
  'ind-energy': ['energy'], 'p-energy': ['energyDawn'], 'ind-education': ['campus'], 'p-education': ['campusDay'], 'ind-food': ['farm'], 'p-food': ['farmDawn'],
  'ck1': ['lattice'], 'ck2': ['lattice2'], 'ck3': ['towers'], 'ck4': ['desertGold'], 'ck5': ['redsea'], 'ck6': ['mount']
};
export const MAP = {};
for (const [name, [v, focus]] of Object.entries(ASSIGN)) { const [w, h] = dims[name]; MAP[name] = { w, h, scene: V[v], focus: focus || 'xMidYMid', seed: name.length * 7 }; }
for (const n of Object.keys(dims)) if (!MAP[n]) console.warn('UNMAPPED', n);
