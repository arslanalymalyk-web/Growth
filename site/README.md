# Growth Blueprint Advisory: complete website

A complete, static, bilingual (English `/en`, Arabic `/ar`, RTL) website built from the supplied design mock-ups. It is separate from the Next.js app in the repository root and needs no server, database or API keys.

**Open it:** `site/dist/index.html` (double-click, or `npx serve site/dist`). **Rebuild:** `cd site && node build.mjs` (Node 20+, no dependencies).

## What is in it (41 pages per language, 82 in total)
Home · Services overview (Enter / Operate / Grow) · 8 service pages · Industries overview (4 core + 7 target sectors) · 11 sector pages · Our Approach (5 stages) · About · Entering Saudi Arabia · Growing in Saudi Arabia · Insights (filterable) with 6 articles · Saudi Market Readiness Checklist (22 questions, saved progress, print/PDF) · Book a Meeting · 5-step Enquiry · demo confirmation · Privacy, Terms, Cookies · 404.

## Behaviour
- Forms validate in the browser and end on the **demo confirmation page**. Nothing is sent or stored anywhere (as in the mock-up's own "Demo enquiry confirmation").
- Checklist progress and the cookie choice are stored in the visitor's browser only.
- Responsive from 360 px, keyboard accessible (skip link, focus styles, native `<details>` FAQs), reduced-motion aware.
- Fonts (Newsreader, Inter, Noto Naskh Arabic, IBM Plex Sans Arabic) load from Google Fonts with system fallbacks.

## Structure
`src/` content and templates (`ui`, `services`, `industries`, `pages`, `views`, `render`, `icons`) · `assets/` stylesheet, script, `img/` · `build.mjs` generator · `dist/` generated output (committed so it can be opened directly).
Content is bilingual in one place: `L('English', 'العربية')`.

## Things to replace before this is a live business site
- **Photography.** All images are cropped from the mock-up screens (about 400 to 900 px wide, AI-generated look, some people may be recognisable). Replace with licensed, full-resolution photography in `assets/img/` using the same file names.
- **Contact details** (`src/ui.mjs`): `info@growthblueprint.sa`, `+966 11 123 4567` and "Riyadh" are placeholders; the mock-ups disagree (Riyadh / Jeddah).
- **Claims** carried over from the mock-ups, unconfirmed: "over 20 years of experience", sector lists, service names.
- **Arabic copy** is a good-faith draft and needs review by a native Saudi copywriter.
- **Legal pages** contain sample text, not reviewed legal wording.
- **Forms** need a real backend (CRM/email) and a booking calendar to go live.
