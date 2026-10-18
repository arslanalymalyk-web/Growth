# Growth Blueprint Advisory: website

Bilingual (English `/en` LTR, Arabic `/ar` RTL) marketing site for a Saudi market-entry advisory. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4. Content is data-driven from a planned Sanity CMS with built-in sample content as fallback.

**Status: ready for client review, blocked from public launch.** Nothing here is connected to a live provider. See `docs/launch-readiness-review.md`, `docs/client-inputs.md` (sign-off checklist), `docs/integration-implementation-plan.md` (per-integration plan) and `docs/launch-checklist.md` (launch operations).

## Local setup
```bash
npm install          # Node 22+ recommended (tests use Node's built-in TypeScript support)
npm run dev          # http://localhost:3000, redirects / to /en or /ar
```
No environment variables are needed to run. Without any provider settings the site shows built-in sample content and every transactional feature shows an honest "opening soon / not available" state.

## Commands
| Command | What it does |
|---|---|
| `npm run dev` | development server |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run test:scorecard` / `test:booking` / `test:shop` / `test:contact` / `test:seo` / `test:analytics` | unit tests (Node test runner), 71 tests in total |
| `npm run build` / `npm start` | production build and server |
| `npm run check` | typecheck, lint, all tests and a production build |

## Environment variables
Copy `.env.example` to `.env.local` (git-ignored). Secrets are always server-side, never `NEXT_PUBLIC_*`, never committed.
| Variable | Purpose | Status |
|---|---|---|
| `SITE_URL` | public https origin for canonical, hreflang, sitemap (build time) | **set for production** |
| `ALLOW_INDEXING` | `1` only on the live production build; otherwise the site is noindex | unset (not launched) |
| `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` | read-only public content from the client's Sanity project | unset: sample content |
| `SHOW_DRAFT_PREVIEWS` | layout testing of draft articles in a production build | never set live |
| `SCORECARD_DEMO`, `BOOKING_DEMO`, `SHOP_DEMO`, `CONTACT_DEMO` | development-only labelled demos; ignored and not bundled in production | dev only |
| CRM / newsletter / booking / payment / storage / analytics credentials | to be defined with each chosen provider | **none exist** |

## Provider configuration status
| Area | Connected? | What exists |
|---|---|---|
| CMS (Sanity) | No | Read-only reader for `homePage`, `servicesPage`/`service`, `industriesPage`/`industry`, `aboutPage`, `approachPage`, `journeyPage`, `insightsPage`/`article` and `product` documents. Inactive until `SANITY_PROJECT_ID` + `SANITY_DATASET`; schema is not created; falls back to sample content per page |
| Scorecard | No | Typed model, validator, scoring and gating; real config is an empty draft; "opening soon" |
| Booking and payment | No | Provider interfaces and gating; no calendar or payment provider; "opening soon" |
| Shop and delivery | No | Product/order/signed-download design; no payment, private storage or order store; "not available" |
| CRM and email | No | `CrmProvider` interface only; enquiries show "not open yet" |
| Newsletter | No | `NewsletterProvider` interface only; signup hidden/unavailable |
| Analytics | No | Provider-neutral, consent-gated hooks, all off; no script loaded |
| Google Business Profile | Not accessed | Handover checklist only |
| Legal pages | Shell | Headings marked pending legal review; no legal text |

## Build, test and deploy
1. `npm run check` must pass on the commit you deploy.
2. Set production env (`SITE_URL`, then `ALLOW_INDEXING=1` only at launch) in the hosting platform **before building** (sitemap, robots and metadata are generated at build time).
3. Build with `npm run build`, run with `npm start` (or deploy to a Node-capable host such as Vercel). Use the client's own hosting account.
4. Smoke test: `/en`, `/ar`, `/en/contact`, `/ar/shop`, an unknown URL (bilingual 404), `/robots.txt`, `/sitemap.xml`.
5. Follow `docs/launch-checklist.md`. Monthly upkeep: `docs/monthly-care-report-template.md`.

## Accounts and assets that must stay owned by Growth Blueprint Advisory
Domain registration and DNS, hosting account, source repository organisation, Sanity project/dataset, payment, calendar/booking, CRM, newsletter and email accounts, analytics and Search Console properties, Google Business Profile, private file storage for paid briefs, and all brand assets, photography and logo files. The developer holds delegated (team-member) access only and every credential lives in the hosting secret store or the company's password manager.

## Visual references
`reference-assets/growth-blueprint/` holds the supplied design screenshots (non-public, git-ignored). `docs/reference-map.md` maps them to routes and lists the standalone photographs used. Screenshots are never shipped. An unmatched URL shows a bilingual 404 (`src/app/global-not-found.tsx`, enabled by `experimental.globalNotFound`).

## Structure
- `src/app/[lang]/` routes; `src/proxy.ts` locale redirect; `src/i18n/` locales and route helpers.
- `src/content/` typed content layer (Sanity or sample), `photos.ts` supplied photography.
- `src/components/` layout, ui, home, pages, scorecard, booking, shop, contact, analytics, seo.
- `src/scorecard|booking|shop|contact|seo|analytics/` framework-free domain modules (tested in `scripts/`).
- Design tokens: `src/app/globals.css`. Brand hex values are estimates from the reference screens; confirm with the client's brand guide.

## Content rules
- Sanity is for public-site content only. Never store enquiry, scorecard, customer or payment data in it.
- All accounts and integrations must be client-owned.
- All Arabic copy is an unreviewed draft and is marked as such. Insight titles are marked "Sample". Image slots without supplied photos are labelled placeholders.

## Services and industries (Stage 2)
Routes (each in `/en` and `/ar`): `/services`, `/services/[slug]` (8), `/industries`, `/industries/[slug]` (11). Unknown slugs return 404.
- `src/content/catalog.ts` — structural catalogue (ids = URL slugs, icons, service groups, related services). Language-independent, so both locales always have matching pages and the language switch can keep the current page.
- `src/content/sample/services.ts`, `industries.ts` (+ `industries.en.ts`, `industries.ar.ts`) — typed copy per locale. Every item carries a `review` status: English = `draft`, Arabic = `needs-professional-review`; pages show a notice until content is `approved`.
- `getServicesContent()` / `getIndustriesContent()` — use Sanity (`servicesPage`/`service`, `industriesPage`/`industry` documents) only when ALL catalogue entries are present and valid, otherwise sample content.
- Page templates: `src/components/pages/ServicesPages.tsx` and `IndustriesPages.tsx`; shared `ui/PageHero`, `Breadcrumbs`, `Cards`.
- Adding a service or sector means adding it to `catalog.ts` and to every locale's copy.
- Related insights on sector pages are empty until the client supplies articles.

## About, approach, journeys and insights (Stage 3)
Routes (each in `/en` and `/ar`): `/about`, `/our-approach`, `/entering-saudi-arabia`, `/growing-in-saudi-arabia`, `/insights`, `/insights/[slug]`.
- Typed content: `src/content/sample/{about,approach,journeys,insights}.ts`; loaders `getAboutContent`, `getApproachContent`, `getJourneyContent`, `getInsightsContent` (Sanity when configured and valid, otherwise sample). Each content record has `review` status and internal `editorialNotes` listing claims the client must confirm (never rendered).
- Templates: `components/pages/{AboutPage,ApproachPage,JourneyPage,InsightsPages}.tsx`; one `JourneyPage` serves both journeys (`timeline` / `grid` variants). Link targets in content use typed `LinkTarget`s resolved by `hrefFor()`.
- **Draft previews:** articles have `status: "published" | "draft-preview"`. Draft previews show (labelled "Draft preview") in `npm run dev`, but are hidden in production builds, and their URLs return 404, unless `status` is changed to `published` in the content data. `SHOW_DRAFT_PREVIEWS=1` shows them in a production build for layout testing only.
- The language switch keeps an article page only when that slug is visible in both languages.
- Not used because unconfirmed: the "20+ years" claim, founder details, testimonials, statistics.

## Saudi Readiness Scorecard
Routes (each in `/en` and `/ar`): `/readiness-scorecard` (introduction), `/readiness-scorecard/assessment`, `/readiness-scorecard/results`.
- **Configuration, not content:** `src/scorecard/types.ts` defines sections, questions (single, multiple, scale, text), answer options, scoring rules, result bands and report content. The real configuration in `src/scorecard/config.ts` is an **empty draft** because the client has not supplied questions, scoring, bands, report text or reviewed consent wording.
- **Activation:** `validateScorecard()` (`validate.ts`) must return no issues (approved status and approval record, English and Arabic review approved, complete questions/scoring/bands/report/consent, not a demo). Otherwise every scorecard route shows the "opening soon" state, which collects no personal information.
- **Demo fixture:** `src/scorecard/demo.ts` holds labelled sample questions for layout testing. It loads only when `NODE_ENV=development` **and** `SCORECARD_DEMO=1` (`npm run dev` with the flag); it is flagged `isDemo` (always rejected for live use), shows a DEMO banner on every screen, and is removed from production bundles.
- **Answers:** held in memory for the current tab only (`src/scorecard/store.ts`). Nothing is sent, stored in browser storage, or sent to a CRM/analytics tool in this stage.
- **Tests:** `npm run test:scorecard` (Node's built-in runner) covers validation, activation gating, answer validation and scoring.
- The Privacy page is a shell (see below); consent wording is draft and needs legal approval.

## Consultation booking (single session and three-session bundle)
Routes (each in `/en` and `/ar`): `/book-consultation` (choose a package), `/book-consultation/schedule` (date and time), `/details`, `/checkout` (review, terms, hosted-checkout handoff), and the return states `/confirmation`, `/pending`, `/cancelled`, `/error`. `/demo-checkout` exists only in the development demo and returns 404 everywhere else.
- **Draft/unavailable:** `src/booking/config.ts` is a draft with **no prices, durations, terms, availability rules, calendar provider or payment gateway** (none supplied by the client). Until `validateBookingConfig()` is clean **and** both provider adapters are installed (`src/booking/providers.ts`, currently empty), every booking route shows "Booking opening soon", which reserves nothing and collects nothing.
- **Provider interfaces:** `CalendarProvider` and `PaymentProvider` in `src/booking/types.ts`. Payment is a **hosted checkout handoff only** (`createCheckoutSession` returns a provider URL); there are no card fields anywhere (a unit test scans the source for them). Payment results are verified server-side with `getCheckoutStatus`; a return URL alone can never show "confirmed".
- **Demo:** `src/booking/demo.ts` (fake packages, `XXX` prices, generated availability, simulated checkout) loads only with `NODE_ENV=development` **and** `BOOKING_DEMO=1`; it is flagged `isDemo`, labelled on every screen, and not bundled into production.
- **Privacy:** selections and details live in memory for the current tab (`src/booking/store.ts`). The only server calls are availability lookups and the demo handoff, which carry no personal data. Nothing is stored in browser storage or sent to a CRM, analytics tool or backend.
- **Time zone:** all times display in `Asia/Riyadh`; availability always comes from the calendar provider (nothing is hard-coded).
- **Tests:** `npm run test:booking`.
- Cancellation, refund, booking and privacy wording are "approval needed" placeholders until the client supplies reviewed text.

## Sector-brief shop (individual briefs, secure digital delivery)
Routes (each in `/en` and `/ar`): `/shop` (catalogue), `/shop/[slug]` (brief detail), `/shop/[slug]/checkout` (buyer email, consents, hosted-checkout handoff), `/shop/order/confirmation`, `/shop/order/pending`, `/shop/order/failed` (failed, cancelled and expired checkout), `/shop/order/resend`. `/shop/demo-checkout` and `/api/shop/demo-file` exist only for the development demo and return 404 everywhere else. There are no subscriptions or bundles.
- **Data:** `src/shop/types.ts` (`Product`, `ShopConfig`, `DeliveryPolicy`, `Order`, provider interfaces). `src/shop/config.ts` is an **empty draft: no briefs, prices, currency, licence/refund terms, payment gateway or storage provider have been supplied**. Products may later come from the client's Sanity project (`src/shop/sanity.ts`); orders, buyers and files never do.
- **Draft products are never sold or shown:** `productState()` returns `hidden` for drafts and previews in every production mode. A product is purchasable only if fully valid (published, approved EN/AR, real price, private file reference, client-approved licence and refund terms) AND the shop is live. Until then the shop shows "Not available yet" (approved products may be read but not bought).
- **Live** requires a valid approved shop config plus installed, matching `ShopPaymentProvider`, `FileStorageProvider` and `OrderRepository` adapters (`src/shop/providers.ts`, currently empty). Live checkout creation is intentionally not enabled in this stage.
- **Secure delivery (design):** paid files live in the client's PRIVATE storage and are never in `public/` or exposed as permanent URLs (the product holds only an opaque `file.key`, never sent to the browser). The confirmation page verifies payment server-side, the order store says which product it bought, then each click asks the server for a fresh short-lived signed link (`issueDownloadLink` in `src/shop/flow.ts`), enforcing a per-order limit. A return URL alone never shows "confirmed".
- **Demo:** `src/shop/demo.ts` (preview products with `XXX` prices, simulated checkout, HMAC-signed 15-second placeholder download) loads only with `NODE_ENV=development` and `SHOP_DEMO=1`; labelled on every screen, flagged `isDemo`, and not bundled into production.
- **Privacy:** buyer details stay in the browser tab; server actions carry only a product id, an opaque session id and a locale. Required purchase-communications consent is separate from OPTIONAL marketing consent (never pre-ticked). Nothing is sent to a CRM, newsletter or analytics provider.
- **Tests:** `npm run test:shop`.

## Enquiry, newsletter and legal shells
Routes (each in `/en` and `/ar`): `/contact` (3-step enquiry: About you → Your enquiry → Review), `/privacy` and `/terms` (shells). The newsletter signup is a reusable component (`NewsletterSignup`) placed in the footer and at the end of the Insights page.
- **No provider has been selected.** `src/contact/providers.ts` registers no CRM and no newsletter adapter; `CrmProvider` / `NewsletterProvider` in `src/contact/types.ts` are interfaces only. No field mapping, provider or credentials are invented. Until the contact configuration validates (approved status, approval record, approved EN/AR review, approved privacy notice, consent wording and version, installed matching provider), **both channels are unavailable**: `/contact` shows "Online enquiries are not open yet", the footer signup is hidden and the Insights block shows a short notice. No form exists, so nothing can be entered.
- **Channels are independent:** enquiry and newsletter each have their own consent (never pre-checked, never implied by the other), validation and provider.
- **Demo:** `src/contact/demo.ts` loads only with `NODE_ENV=development` and `CONTACT_DEMO=1`. It is **client-side only**: nothing is sent to the server, stored or logged, and the UI says "nothing was sent". Not bundled into production.
- **Privacy by design:** submissions are not stored in files, browser storage or a database; personal data, form contents and email addresses are never logged; provider errors are never echoed. A unit test scans the contact source for logging, storage and network calls. Server actions re-validate everything and include a honeypot.
- **Legal:** consent sentences in the UI are DRAFT wording with a visible marker, requiring client/legal review. Privacy and Terms pages contain only headings marked "pending review by Growth Blueprint's legal adviser"; no legal wording is invented and no compliance is claimed. No analytics or tracking exists, so no cookie preference interface was built; whether one is needed is a legal determination.
- **Tests:** `npm run test:contact`.

## Technical SEO, analytics and Google Business Profile handover
- **One metadata path:** every page builds its metadata with `buildMetadata()` (`src/seo/metadata.ts`): unique title and description from the editable content (service, industry and article items also accept an optional `seo: { title, description }` override), self-referencing canonical, hreflang `en` / `ar` plus `x-default` (the English page), Open Graph and Twitter. Social image: none is emitted until approved imagery exists (`src/seo/site.ts`).
- **Indexing is off by default.** A deployment is indexable only with `ALLOW_INDEXING=1`, a public https `SITE_URL`, `NODE_ENV=production` and no hosting preview flag (`src/seo/indexing.ts`). Otherwise every page is `noindex, nofollow` (meta and `X-Robots-Tag`), `robots.txt` is `Disallow: /` and `sitemap.xml` is empty. Because these files are generated at build time, set the variables when building the live site. Staging should also use hosting-level access protection.
- **Page-level rules** (`src/seo/state.ts`, `src/seo/pages.ts`): the sitemap and the page metadata share the same rules. Home, services, industries, journeys, about, approach, insights and published articles are indexable. Booking, scorecard, contact and shop pages are indexable only when the feature is live; "opening soon", unavailable and demo states are not. Booking steps, scorecard assessment/results, checkout, order pages and demo pages are never indexable. Privacy and Terms stay out of search until the legal text is approved in both languages. Draft articles and preview products are excluded.
- **Structured data** (`src/seo/jsonld.ts`, `src/seo/business.ts`): `Organization` (name and URL only), `WebSite`, `BreadcrumbList`, and `Article` for published articles with a confirmed date. No ratings, reviews, address, phone, credentials or `LocalBusiness` markup exists, because none is confirmed. Add confirmed details in `src/seo/business.ts`.
- **Analytics:** provider-neutral and **off** (`src/analytics/`, `docs/analytics-handover.md`). No tracking script exists; four privacy-safe event hooks are wired and stay inactive until a provider is selected and the consent requirement is defined and implemented.
- **Google Business Profile:** `docs/google-business-profile-handover.md` lists what the client must provide. The profile has not been accessed or changed.
- **Tests:** `npm run test:seo`, `npm run test:analytics`.
