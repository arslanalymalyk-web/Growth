"""Swap in real photography without touching code.
   python3 scripts/import-photos.py <folder-of-photos> [--dry]
   python3 scripts/import-photos.py --map scripts/photo-map.json [--dry]     (several slots from the same photo, each with its own crop: see photos-src/)
Name each photo after the slot it replaces (see IMAGE_BRIEF.md), e.g. hero-home.jpg, ind-healthcare.jpg, svc-sessions.png.
Each file is cover-cropped to the slot's aspect ratio (scripts/art/dims.json), resized to 2.6x the display width (max 2200 px) and saved as WebP in assets/img/.
Needs Pillow."""
import json, os, sys
from PIL import Image, ImageOps
here = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(here, '..', 'assets', 'img')
dims = json.load(open(os.path.join(here, 'art', 'dims.json')))
dry = '--dry' in sys.argv
if '--map' in sys.argv:
    mp = json.load(open(sys.argv[sys.argv.index('--map') + 1])); base = os.path.join(here, '..', 'photos-src'); done = 0
    for slot, m in mp.items():
        if slot.startswith('_'): continue
        w, h = dims[slot]; px = min(2200, max(900, round(w * 2.6))); im = ImageOps.exif_transpose(Image.open(os.path.join(base, m['src'] + '.jpg'))).convert('RGB')
        ar = w / h; cw = min(im.width, im.height * ar) / m.get('zoom', 1.0); ch = cw / ar
        x0 = min(max(m.get('cx', .5) * im.width - cw / 2, 0), im.width - cw); y0 = min(max(m.get('cy', .5) * im.height - ch / 2, 0), im.height - ch)
        crop = im.crop((round(x0), round(y0), round(x0 + cw), round(y0 + ch))); px = min(px, crop.width); ph = round(px / ar)
        crop = crop.resize((px, ph), Image.LANCZOS)
        if not dry: crop.save(os.path.join(out, slot + '.webp'), 'WEBP', quality=84, method=6)
        print(('would write ' if dry else 'wrote '), slot + '.webp', f'{px}x{ph}', '<-', m['src']); done += 1
    print(done, 'image(s)'); sys.exit(0)
src = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__)
done = 0
for f in sorted(os.listdir(src)):
    name, ext = os.path.splitext(f)
    if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'): continue
    if name not in dims: print('skip (no such slot):', f); continue
    w, h = dims[name]; px = min(2200, max(900, round(w * 2.6))); ph = round(px * h / w)
    im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert('RGB')
    if im.width < px * .8: print(f'WARNING {f}: only {im.width}px wide, slot wants about {px}px. It will look soft.')
    im = ImageOps.fit(im, (px, ph), Image.LANCZOS, centering=(0.5, 0.45))
    if not dry: im.save(os.path.join(out, name + '.webp'), 'WEBP', quality=82, method=6)
    print(('would write ' if dry else 'wrote '), name + '.webp', f'{px}x{ph}'); done += 1
print(done, 'image(s)', '(dry run)' if dry else 'imported. Now run: node build.mjs')
