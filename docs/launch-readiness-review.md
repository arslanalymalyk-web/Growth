# Launch-readiness review

**Status: ready for client review. Blocked from public launch** until the launch blockers (B1 to B8) in `docs/client-inputs.md` are signed off (per-integration detail: `docs/integration-implementation-plan.md`) and the blockers below are cleared.

## Checks completed
- Every public route in `/en` and `/ar` (64 pages found by following links from the homepages, plus shop, order, booking-step and scorecard-step URLs): all return 200; no dead links or anchors; every English page has an Arabic pair with the same navigation, footer, heading and link counts. Header, footer, CTA and language-switch links followed.
- 74 pages at desktop (1280px) and mobile (360px): no horizontal overflow, mobile tap targets at least 44px, axe (WCAG 2.0/2.1/2.2 A/AA and best practice) clean after one fix; keyboard tab order reaches the footer with a visible focus indicator and a skip link first, on six representative pages in both languages.
- Contrast: one real failure fixed (gold numerals on industry pages). Axe left "incomplete" contrast results over the hero photo/gradients; token ratios checked by hand (gold-400 on navy 7.3:1, ivory on navy 16:1, gold-700 on ivory 6:1).
- Focus ring: the old gold ring was 2.1:1 on ivory; replaced with a two-tone ring.
- Demo and unavailable states: in production, booking, scorecard, shop, contact and newsletter show "opening soon / not available" with no forms. In the development demos, every screen is labelled and a test of the contact and newsletter forms, plus the booking, shop and scorecard screens in both languages, found no network POSTs, no browser storage and no claim of a sent enquiry, booking, payment, report or download.
- Secrets and personal data: no keys, tokens, real emails or phone numbers in `src`, `docs`, `scripts`, `.env.example` or README. The only secret-looking string is the labelled development-only `demo-only-not-a-secret`, which is absent from production bundles. No client code reads private variables. Server logs contain only generic Sanity-fallback warnings (no personal data).
- Without credentials the site renders fully with sample content (all the above checks ran in that state).
- SEO: metadata, canonicals, hreflang, sitemap, robots and structured data re-verified on a launch-style build (54 indexable and 26 non-indexable URLs, 0 failures).
- Visual reference pass: see `docs/reference-map.md`.

## Fixes made in this review
- Bilingual branded 404 for unmatched URLs (previously unstyled English Next.js default, also under `/ar`). Uses `experimental.globalNotFound`.
- Industry-page numerals contrast; two-tone focus ring; Insights landmark-name duplicate; SEO fields now also fetched from Sanity; README rewritten; launch checklist, client-inputs list and monthly care report added; `reference-assets/` git-ignored.

## Unresolved blockers (launch)
1. No CMS, CRM, newsletter, booking, payment, shop storage or analytics provider exists; all are placeholders.
2. No approved Privacy or Terms text; no approved consent wording. Legal pages are shells.
3. Arabic copy is unreviewed draft; English copy is draft pending client approval; sample article titles and placeholders remain.
4. Missing: logo, favicon (browsers request `/favicon.ico` and get a 404), social share image, approved business contact details.
5. Provenance and licence of the six supplied photographs unconfirmed; one reference file was corrupt in the upload.
6. Scorecard, booking packages and shop products have no approved content, so those pages stay in "opening soon".
7. Hosting, domain, uptime monitoring and error reporting are not set up; the 404 relies on an experimental Next.js flag (re-test on every Next.js upgrade).

## Known limits
- `npm audit`: 5 high-severity advisories (`braces` via `eslint-config-next`, development tooling only). No dependency was changed or downgraded.
- Non-text contrast of decorative gold icons (2.75:1) is below 3:1; they are decorative and accompanied by text.
- Visual match: only two standalone photographs existed, so most reference photography is not reproduced; industries without a supplied photo show a labelled placeholder.
