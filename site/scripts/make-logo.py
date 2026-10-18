"""Builds the Growth Blueprint logo suite (SVG with outlined text, PNG previews are made separately).
   python3 scripts/make-logo.py <font-dir>   (needs Newsreader, Noto Naskh Arabic, Inter variable TTFs; fontTools, uharfbuzz)"""
import sys, os
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import uharfbuzz as hb

FD = sys.argv[1] if len(sys.argv) > 1 else '/tmp/fnt'
OUT = os.path.join(os.path.dirname(__file__), '..', 'brand')
os.makedirs(OUT, exist_ok=True)

def load(file, axes):
    f = TTFont(os.path.join(FD, file)); f = instantiateVariableFont(f, axes, inplace=False)
    p = os.path.join('/tmp', 'inst_' + file + str(sorted(axes.items())).replace(' ', '') + '.ttf'); f.save(p); return p

FONTS = {
    'serif': load('nr.ttf', {'wght': 500, 'opsz': 72}),
    'sans': load('inter.ttf', {'wght': 600, 'opsz': 14}),
    'ar': load('naskh.ttf', {'wght': 700}),
    'ar_s': load('naskh.ttf', {'wght': 600}),
}

def text(s, key, size, x=0, y=0, track=0.0, rtl=False, anchor='start'):
    """Shaped, outlined text -> (path d, advance width). y is the baseline. track is in em."""
    path = FONTS[key]; tt = TTFont(path); gs = tt.getGlyphSet(); upm = tt['head'].unitsPerEm
    blob = hb.Blob.from_file_path(path); face = hb.Face(blob); font = hb.Font(face)
    buf = hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    if rtl: buf.direction = 'rtl'
    hb.shape(font, buf, {'kern': True, 'liga': True})
    sc = size / upm; order = tt.getGlyphOrder(); pos = 0; items = []
    for info, p in zip(buf.glyph_infos, buf.glyph_positions):
        items.append((order[info.codepoint], pos + p.x_offset, p.y_offset)); pos += p.x_advance + (0 if rtl else 0) + track * upm
    width = (pos - track * upm) * sc
    x0 = x - (width if anchor == 'end' else width / 2 if anchor == 'middle' else 0)
    pen = SVGPathPen(gs, ntos=lambda v: ('%.2f' % v).rstrip('0').rstrip('.'))
    for name, ox, oy in items:
        tp = TransformPen(pen, (sc, 0, 0, -sc, x0 + ox * sc, y - oy * sc)); gs[name].draw(tp)
    return pen.getCommands(), width

GOLD1, GOLD2, NAVY, IVORY, GOLD_TXT = '#e3cd9a', '#b8944d', '#0d1f38', '#f6f1e6', '#7a5c22'

def mark_body(g, bars, rule, uid):
    """The mark in a 64x64 box: a pointed gateway arch drawn as a G, three rising bars, a drafting rule."""
    return f'''<g>
<path d="M10 58V34A30 30 0 0 1 32 5.1A30 30 0 0 1 54 34" fill="none" stroke="{g}" stroke-width="3.2" stroke-linejoin="miter" stroke-miterlimit="8"/>
<path d="M54 58V44H41" fill="none" stroke="{g}" stroke-width="3.2" stroke-linejoin="miter"/>
<path d="M18 58V49H21.6V58ZM25.6 58V41H29.2V58ZM33.2 58V32.5H36.8V58Z" fill="{bars}"/>
<path d="M35 20.2L37.2 23.6L35 27L32.8 23.6Z" fill="{g}"/>
<path d="M4 62.2H60M4 59.6V64.8M60 59.6V64.8" stroke="{rule}" stroke-width=".9" fill="none"/>
</g>'''

def grad(uid): return f'<defs><linearGradient id="g{uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{GOLD1}"/><stop offset="1" stop-color="{GOLD2}"/></linearGradient></defs>'

def svg(w, h, inner, title, bg=None, uid='a'):
    b = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{title}"><title>{title}</title>{grad(uid)}{b}{inner}</svg>\n'

def lockup(theme, bilingual=True, uid='a'):
    ink = {'light': NAVY, 'dark': IVORY, 'mono': NAVY, 'white': '#ffffff'}[theme]
    gold = {'light': f'url(#g{uid})', 'dark': f'url(#g{uid})', 'mono': NAVY, 'white': '#ffffff'}[theme]
    sub = {'light': GOLD_TXT, 'dark': GOLD1, 'mono': NAVY, 'white': '#ffffff'}[theme]
    bars = ink if theme in ('light', 'mono', 'white') else IVORY
    mx = 12
    inner = f'<g transform="translate({mx} 14) scale(1.5)">{mark_body(gold, bars, sub if theme!="light" else GOLD2, uid)}</g>'
    tx = mx + 64 * 1.5 + 18
    d1, w1 = text('GROWTH BLUEPRINT', 'serif', 40, tx, 58, 0.13)
    d2, w2 = text('SAUDI MARKET ADVISORY', 'sans', 10.5, tx, 82, 0.36)
    inner += f'<path d="{d1}" fill="{ink}"/><path d="{d2}" fill="{sub}"/>'
    W = tx + max(w1, w2) + 14
    H = 112
    if bilingual:
        da, wa = text('غروث بلوبرينت', 'ar', 25, tx + w1, 126, 0, rtl=True, anchor='end')
        inner += f'<path d="{da}" fill="{gold if theme in ("mono","white") else sub}"/>'; H = 142
        inner += f'<path d="M{tx} 98H{tx+w1}" stroke="{sub}" stroke-opacity=".35" stroke-width=".8"/>'
    return svg(round(W), H, inner, 'Growth Blueprint — غروث بلوبرينت', None, uid), round(W), H

def write(name, s): open(os.path.join(OUT, name), 'w').write(s)

for theme, nm in [('light', 'logo-primary'), ('dark', 'logo-reversed'), ('mono', 'logo-mono-navy'), ('white', 'logo-mono-white')]:
    s, W, H = lockup(theme, True, theme); write(nm + '.svg', s)
for theme in ('light', 'dark'):
    s, W, H = lockup(theme, False, 'h' + theme); write(f'logo-horizontal-{theme}.svg', s)

# Mark only (padding included) in three colourways
for theme, nm, bg in [('light', 'mark', None), ('dark', 'mark-reversed', None)]:
    ink = NAVY if theme == 'light' else IVORY
    write(nm + '.svg', svg(72, 72, f'<g transform="translate(4 4)">{mark_body(f"url(#gm{theme})", ink, GOLD2 if theme=="light" else GOLD1, theme)}</g>', 'Growth Blueprint mark', None, 'm' + theme))
# Favicon / app icon: gold mark on navy tile
write('favicon.svg', svg(64, 64, f'<g transform="translate(7 5) scale(.78)">{mark_body("url(#gf)", IVORY, GOLD1, "f")}</g>', 'Growth Blueprint', None, 'f').replace('<rect', '<rect').replace('<defs>', f'<rect width="64" height="64" rx="14" fill="{NAVY}"/><defs>', 1))
# Stacked (centred) lockup for covers and social
dE, wE = text('GROWTH BLUEPRINT', 'serif', 34, 300, 196, 0.13, anchor='middle')
dS, wS = text('SAUDI MARKET ADVISORY', 'sans', 10, 300, 224, 0.38, anchor='middle')
dA, wA = text('غروث بلوبرينت', 'ar', 26, 300, 272, 0, rtl=True, anchor='middle')
st = f'<g transform="translate(250 34) scale(1.5)">{mark_body("url(#gs)", IVORY, GOLD1, "s")}</g><path d="{dE}" fill="{IVORY}"/><path d="{dS}" fill="{GOLD1}"/><path d="M252 240H348" stroke="{GOLD1}" stroke-opacity=".5" stroke-width=".8"/><path d="{dA}" fill="{GOLD1}"/>'
write('logo-stacked.svg', svg(600, 300, st, 'Growth Blueprint — غروث بلوبرينت', NAVY, 's'))
print('ok', sorted(os.listdir(OUT)))

# ---- Small-size mark (16-32 px): arch + three bars only, thicker strokes, no node or rule ----
def small_mark(g, bars, uid):
    return f'''<path d="M9 58V34A31 31 0 0 1 32 4A31 31 0 0 1 55 34" fill="none" stroke="{g}" stroke-width="5.2" stroke-miterlimit="8"/>
<path d="M55 58V45H41" fill="none" stroke="{g}" stroke-width="5.2"/>
<path d="M16 58V47H22.5V58ZM25.5 58V38H32V58ZM35 58V28H41.5V58Z" fill="{bars}"/>'''
write('mark-small.svg', svg(64, 64, small_mark('url(#gsm)', NAVY, 'sm'), 'Growth Blueprint mark (small sizes)', None, 'sm'))
write('favicon-small.svg', svg(64, 64, f'<rect width="64" height="64" rx="14" fill="{NAVY}"/><g transform="translate(6 6) scale(.81)">{small_mark("url(#gfs)", IVORY, "fs")}</g>', 'Growth Blueprint', None, 'fs'))
# ---- Alternative B: the bars become one rising step line (less generic than a bar chart) ----
alt = f'''<path d="M10 58V34A30 30 0 0 1 32 5.1A30 30 0 0 1 54 34" fill="none" stroke="url(#gmb)" stroke-width="3.2" stroke-miterlimit="8"/>
<path d="M54 58V44H41" fill="none" stroke="url(#gmb)" stroke-width="3.2"/>
<path d="M17 58V50H24.500V42H32V34H39.500V26" fill="none" stroke="{NAVY}" stroke-width="3" stroke-linejoin="miter"/>
<path d="M39.500 19.500L41.700 22.900L39.500 26.300L37.300 22.900Z" fill="url(#gmb)"/>
<path d="M4 62.200H60M4 59.600V64.800M60 59.600V64.800" stroke="{GOLD2}" stroke-width=".9" fill="none"/>'''
write('mark-alt-steps.svg', svg(72, 72, f'<g transform="translate(4 4)">{alt}</g>', 'Growth Blueprint mark, alternative B', None, 'mb'))
print('small marks written')
