# Imagery decision and brief

## The decision
**Use real photography of real Saudi places and people. Do not use AI-generated "realistic" photographs. Keep the illustrated artwork only as a clearly illustrative fallback and for diagrams and pattern tiles.**

Why, from the seat of a Fortune 500 CEO deciding whether to trust an advisory firm with a market-entry decision:
1. **Proof beats polish.** The firm sells judgement and access. Real people in real rooms in real Saudi places are evidence. Illustration, however crisp, reads as a template or a start-up, and tells a sceptical reader nothing about who they will actually meet.
2. **AI photoreal is a liability for this firm in particular.** Landmarks come out subtly wrong, faces and hands betray themselves, and cultural details (dress, architecture, gender and setting) are easy to get wrong in ways Saudi readers notice at once. A board member who spots a fake image will doubt the facts next to it. Undisclosed synthetic imagery also sits badly with the trust the whole site is built on.
3. **Saudi-specific and Vision 2030-aligned is right, but generic is not.** Riyadh and KAFD towers, Diriyah, AlUla, the Jeddah Corniche, Red Sea and NEOM-region projects say "this firm is here". A handshake in a glass office says nothing.
4. **The illustrations stay for now, honestly.** They are sharp, on-brand and cost nothing, so the site is never blocked on photography. Each image is described on the page as illustrative. Replace them as real photos arrive, slot by slot.

## What to get, in priority order
| Priority | What | How |
|---|---|---|
| 1 | **The team**: five headshots and six working photos (meeting, whiteboard, site visit) | A half-day shoot at the Jeddah office with a local photographer. Written release from every person shown. This is the single biggest credibility upgrade. |
| 2 | **Three hero scenes**: Riyadh skyline at blue hour, Jeddah Corniche, one heritage scene (Diriyah or AlUla) | Commission a local photographer, or license editorial-quality images. Make sure the licence covers commercial web use and any property release the landmark needs. |
| 3 | **Sector scenes** for the 13 industries: real facilities, not stock clichés | Licensed Saudi imagery (filter by country, avoid handshakes and thumbs-up), or official press kits of agencies and giga-projects used with written permission. |
| 4 | **Client context** (only with consent): a clinic, a plant, a showroom | Ask each client; never imply a client relationship through a stock photo. |

## Rules for every image
- Written licence or release on file, with scope (web, print, social) and term.
- No identifiable person without a signed release; no children; no clients or logos without permission.
- Culturally accurate dress, architecture and settings; check with a Saudi colleague before publishing.
- Real photographs are captioned truthfully ("Riyadh, KAFD", not "our office" unless it is).
- Minimum 2200 px wide for heroes and 900 px for cards; sRGB; no watermarks; keep originals.
- No AI-generated photographs of people, places or clients. If an illustration is used, label it illustrative.

## How to swap them in (no code)
1. Name each file after its slot (table below), for example `hero-home.jpg`, `ind-healthcare.jpg`, `svc-sessions.jpg`.
2. `python3 scripts/import-photos.py <folder>` crops each to the slot's shape, sizes it for sharp display and writes `assets/img/<slot>.webp`. Use `--dry` to preview. It warns when a photo is too small.
3. `node build.mjs`. Every page that used the slot now shows the photo.
4. Update the alt text where it says "Illustrative ..." (`src/pages.mjs`, `INDUSTRIES_PAGE.alt`).

## Slots (name, pixel size the importer writes, source aspect)
| Slot | Pixels | Source aspect |
|---|---|---|
| `alula-tombs` | 1526 x 1230 | 587:473 |
| `band-man-desert` | 1633 x 889 | 628:342 |
| `ck-cta-terrace` | 1685 x 913 | 648:351 |
| `ck-hero-arcade` | 1563 x 1108 | 601:426 |
| `ck-hero-night` | 1477 x 1272 | 568:489 |
| `ck1` | 900 x 963 | 259:277 |
| `ck2` | 900 x 956 | 259:275 |
| `ck3` | 900 x 1015 | 259:292 |
| `ck4` | 900 x 969 | 259:279 |
| `ck5` | 900 x 969 | 259:279 |
| `ck6` | 900 x 900 | 259:259 |
| `colonnade-tower` | 1526 x 876 | 587:337 |
| `cta-cliffs-light` | 1617 x 967 | 622:372 |
| `cta-desert-cliffs` | 1698 x 866 | 653:333 |
| `cta-fort-palm` | 1024 x 538 | 394:207 |
| `cta-rocks-dark` | 1786 x 803 | 687:309 |
| `curved-building` | 1594 x 840 | 613:323 |
| `fort-tower` | 1404 x 686 | 540:264 |
| `founder-back` | 1472 x 1459 | 566:561 |
| `hero-corniche` | 1890 x 1336 | 727:514 |
| `hero-home` | 2200 x 1461 | 1024:680 |
| `hero-man-light` | 1960 x 1370 | 754:527 |
| `hero-man-skyline` | 2072 x 1123 | 797:432 |
| `hero-riyadh-bridge` | 2200 x 1409 | 910:583 |
| `hero-riyadh-sunset` | 1927 x 1534 | 741:590 |
| `hero-skyline-dusk` | 2179 x 1196 | 838:460 |
| `hero-skyline-wide` | 1973 x 1357 | 759:522 |
| `ind-construction` | 900 x 639 | 342:243 |
| `ind-education` | 900 x 799 | 340:302 |
| `ind-energy` | 900 x 799 | 340:302 |
| `ind-fmcg` | 900 x 799 | 340:302 |
| `ind-food` | 900 x 799 | 340:302 |
| `ind-healthcare` | 900 x 639 | 342:243 |
| `ind-hospitality` | 900 x 795 | 342:302 |
| `ind-logistics` | 900 x 643 | 340:243 |
| `ind-manufacturing` | 900 x 799 | 340:302 |
| `ind-professional` | 959 x 616 | 369:237 |
| `ind-realestate` | 900 x 799 | 340:302 |
| `ind-retail` | 991 x 616 | 381:237 |
| `ind-tech` | 900 x 639 | 342:243 |
| `ind-tourism` | 983 x 616 | 378:237 |
| `ins-rocks` | 1430 x 897 | 550:345 |
| `ins-skyline` | 1430 x 936 | 550:360 |
| `ins-wall` | 1430 x 926 | 550:356 |
| `jeddah-waterfront` | 1362 x 1188 | 524:457 |
| `lounge-arch` | 1498 x 1082 | 576:416 |
| `man-on-rocks` | 1979 x 1071 | 761:412 |
| `meeting-window` | 1817 x 1180 | 699:454 |
| `office-lobby` | 1700 x 811 | 654:312 |
| `p-business-meeting` | 1882 x 941 | 724:362 |
| `p-construction` | 1633 x 1139 | 628:438 |
| `p-desert` | 1880 x 780 | 723:300 |
| `p-district-skyline` | 1882 x 941 | 724:362 |
| `p-education` | 1882 x 941 | 724:362 |
| `p-energy` | 1882 x 941 | 724:362 |
| `p-engineering-workspace` | 1882 x 941 | 724:362 |
| `p-fmcg` | 1638 x 1201 | 630:462 |
| `p-fmcg-overview` | 1404 x 848 | 540:326 |
| `p-food` | 1882 x 941 | 724:362 |
| `p-founder` | 1739 x 931 | 669:358 |
| `p-healthcare` | 1659 x 1025 | 638:394 |
| `p-hospitality-lobby` | 1882 x 941 | 724:362 |
| `p-insight1` | 1661 x 616 | 639:237 |
| `p-insight2` | 1646 x 616 | 633:237 |
| `p-insight3` | 1661 x 616 | 639:237 |
| `p-manufacturing-floor` | 1882 x 941 | 724:362 |
| `p-port-logistics` | 1882 x 941 | 724:362 |
| `p-professional` | 1648 x 1219 | 634:469 |
| `p-retail` | 1656 x 1258 | 637:484 |
| `p-skyline-dusk` | 2200 x 3300 | 1024:1536 |
| `palms-arch` | 1394 x 1085 | 536:417 |
| `sq-palms-fort` | 2194 x 624 | 844:240 |
| `sq1` | 1045 x 686 | 402:264 |
| `sq2` | 1045 x 686 | 402:264 |
| `sq3` | 1045 x 634 | 402:244 |
| `sq4` | 1045 x 655 | 402:252 |
| `sq5` | 1045 x 686 | 402:264 |
| `sq6` | 1045 x 671 | 402:258 |
| `sq7` | 1045 x 608 | 402:234 |
| `stage1` | 1040 x 874 | 400:336 |
| `stage2` | 1040 x 874 | 400:336 |
| `stage3` | 1040 x 879 | 400:338 |
| `stage4` | 1040 x 907 | 400:349 |
| `stage5` | 1040 x 850 | 400:327 |
| `svc-brand` | 1022 x 468 | 393:180 |
| `svc-formation` | 1022 x 447 | 393:172 |
| `svc-governance` | 1022 x 403 | 393:155 |
| `svc-hr` | 1022 x 395 | 393:152 |
| `svc-operations` | 1022 x 403 | 393:155 |
| `svc-partnerships` | 1022 x 395 | 393:152 |
| `svc-sessions` | 1022 x 447 | 393:172 |
| `svc-strategy` | 1022 x 447 | 393:172 |
| `svc-tech` | 1022 x 468 | 393:180 |
| `walkers-mashrabiya` | 1758 x 1436 | 676:552 |
