"""Swap in real photography without touching code.
   python3 scripts/import-photos.py <folder-of-photos> [--dry]
Name each photo after the slot it replaces (see IMAGE_BRIEF.md), e.g. hero-home.jpg, ind-healthcare.jpg, svc-sessions.png.
Each file is cover-cropped to the slot's aspect ratio (scripts/art/dims.json), resized to 2.6x the display width (max 2200 px) and saved as WebP in assets/img/.
Needs Pillow."""
import json, os, sys
from PIL import Image, ImageOps
here = os.path.dirname(os.path.abspath(__file__)); out = os.path.join(here, '..', 'assets', 'img')
dims = json.load(open(os.path.join(here, 'art', 'dims.json')))
src = sys.argv[1] if len(sys.argv) > 1 else sys.exit(__doc__); dry = '--dry' in sys.argv
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
