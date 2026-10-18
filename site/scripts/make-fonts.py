"""Subsets the brand fonts to Latin + Arabic and writes WOFF2 files to assets/fonts (self-hosted: no requests to Google).
   python3 scripts/make-fonts.py <font-dir>  (fonts: Newsreader[opsz,wght], Inter[opsz,wght], NotoNaskhArabic[wght], IBMPlexSansArabic-{Regular,Medium,SemiBold})"""
import sys, os
from fontTools import subset
from fontTools.ttLib import TTFont
FD = sys.argv[1] if len(sys.argv) > 1 else '/tmp/fnt'
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'fonts'); os.makedirs(OUT, exist_ok=True)
LATIN = list(range(0x20, 0x7F)) + list(range(0xA0, 0x100)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC, 0x2192, 0x2190, 0x00D7]
ARABIC = list(range(0x600, 0x700)) + list(range(0x750, 0x780)) + list(range(0xFB50, 0xFDFF)) + list(range(0xFE70, 0xFF00)) + [0x200C, 0x200D, 0x200E, 0x200F, 0x25CC, 0x060C, 0x061B, 0x061F] + list(range(0x660, 0x66A))
def make(src, dst, uni, layout=None):
    opt = subset.Options(); opt.flavor = 'woff2'; opt.layout_features = ['*']; opt.notdef_outline = True; opt.name_IDs = [1, 2, 3, 4, 6]; opt.drop_tables += ['DSIG']
    f = TTFont(os.path.join(FD, src)); s = subset.Subsetter(opt); s.populate(unicodes=uni); s.subset(f)
    f.flavor = 'woff2'; f.save(os.path.join(OUT, dst)); print(dst, os.path.getsize(os.path.join(OUT, dst)) // 1024, 'KB')
make('nr.ttf', 'newsreader-latin.woff2', LATIN)
make('inter.ttf', 'inter-latin.woff2', LATIN)
make('naskh.ttf', 'noto-naskh-arabic.woff2', ARABIC + LATIN[:95])
for w in ('Regular', 'Medium', 'SemiBold'): make(f'plex-{w}.ttf', f'plex-arabic-{w.lower()}.woff2', ARABIC + LATIN[:95])
