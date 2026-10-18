# Integration implementation plan

Planning document only. No provider has been chosen, no credentials exist, and nothing in this stage changes application behaviour. Every area below stays in its honest "opening soon / not available / inactive" state until the client decisions listed for it are made. Decision **B8** (which features open at launch) sets how much of this is needed before go-live; by default only the launch blockers in `docs/client-inputs.md` are.

- Sign-off checklist (prioritised, with IDs such as **B4**, **K2**): `docs/client-inputs.md`. This plan refers to those IDs instead of repeating them.
- Launch operations and verification: `docs/launch-checklist.md`. Current review result: `docs/launch-readiness-review.md`.
- Nothing here is legal advice. Wording, compliance questions (including any data-protection law) and cookie decisions belong to the client's legal adviser; the website makes no compliance claim.

## Status at a glance
| Area | Code ready for a provider? | Live today? | First thing needed |
|---|---|---|---|
| CMS and bilingual editing | Reader exists (read-only) | No (sample content) | B3 decision, Sanity project |
| Scorecard | Engine and gating exist | No (empty config) | S1 questions and scoring |
| Booking and calendar | Interfaces, UI, gating | No | K1 package facts, calendar choice |
| Payment (single and bundle) | Hosted-checkout interface | No | Y1 gateway choice |
| Shop and delivery | Interfaces, signed-link design | No | P1 products, Y1 gateway |
| CRM enquiries | Interface, flow, form | No | C1 CRM choice, B4 contact route |
| Newsletter | Interface, flow, form | No | N1 platform choice |
| Analytics and consent | Gate and 4 hooks | No | A1 provider, A2 consent decision |
| Domain, hosting, monitoring | Env switches, SEO gating | No | B1 domain and hosting |
| Google Business Profile | Handover checklist | Not accessed | G1 access, B4 details |
| Legal and consent wording | Shells and draft wording | No approved text | B5, B8 sign-off |

## Cross-cutting gaps to fill during implementation (not built yet)
1. **Transactional email.** There is no email interface. Booking confirmations, shop order confirmations and resend-download links, and any emailed scorecard report need either the provider's built-in emails or a client-chosen email service (decision **K4**, **P3**, **S3**). Add a server-only adapter interface when chosen.
2. **Payment result webhooks.** Payment status is verified by `getCheckoutStatus` when the visitor returns; no webhook route exists (`src/app/api/` has only the dev demo file). Add provider webhook routes (signature-checked) once the gateway is chosen.
3. **Live checkout creation.** `prepareCheckoutHandoff` (`src/booking/actions.ts`) and its shop counterpart (`src/shop/flow.ts`) deliberately return `not-enabled` outside the demo. Implement slot reservation, session creation and order creation after approvals.
4. **Shop order creation.** `OrderRepository` can read an order and record a download but has no "create order" method; extend it with the chosen store.
5. **Anti-spam and rate limiting.** Forms have a honeypot and server validation only. A client-approved rate-limit/CAPTCHA approach is needed before CRM and newsletter go live (**C3**).
6. **Consent interface.** None exists; build only if the legal adviser says analytics (or any other tracker) needs one (**A2**).
7. **Content-source guard.** Pages silently fall back to sample content when a CMS document is missing. Add a launch check or visible staging indicator so sample text cannot go live by accident.
8. **Production secrets handling.** Secrets only in the hosting platform's secret store; `.env.example` gets real variable names only when an adapter is written.

---

## 1. CMS and bilingual content editing
**Supports now:** `src/content/sanity.ts` reads published, public content (`useCdn`, no token, 5-minute revalidate) for document types `homePage`, `servicesPage`/`service`, `industriesPage`/`industry`, `aboutPage`, `approachPage`, `journeyPage`, `insightsPage`/`article`, and `product` (shop, `src/shop/sanity.ts`). One document per language; `review` status per document; optional `seo.title`/`seo.description` on services, industries and articles; draft articles hidden in production. Complete sample content in `src/content/sample/` is the fallback per page.
**Placeholder / inactive:** No Sanity project or schema exists (the schema is not in this repo). Not CMS-editable today (code only): navigation, footer and button text (`src/content/sample/ui.ts`), form and consent interface strings, scorecard and booking configuration, the Privacy/Terms shells (`legal.ts`), the 404 page. No editor preview (needs a read token and draft mode), no on-demand revalidation webhook.
**Needed from Growth Blueprint:** **B3** (use a CMS at launch or edit in code first), company-owned Sanity organisation/project/dataset, editor accounts and publishers, approved EN copy and professionally reviewed AR copy for every page (**B2**, **B3**), photography with licences (**B6**).
**Configuration points:** existing `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, `SHOW_DRAFT_PREVIEWS` (`.env.example`). New during implementation: a preview read token (server-only) and a revalidation secret, plus the Studio/schema in a separate client-owned project.

## 2. Saudi Readiness Scorecard
**Supports now:** typed model with single, multiple, scale and text questions; weighted-percentage scoring; result bands; tailored report text per band and section; validator that blocks activation unless everything is approved (`src/scorecard/validate.ts`); separate processing and newsletter consents (never pre-ticked); answers live only in browser memory; accessible assessment and results pages; completion hook for analytics.
**Placeholder / inactive:** `realScorecard` in `src/scorecard/config.ts` is an empty draft (no sections, questions, bands, report text, consent, approval record), so every scorecard route shows "opening soon". The labelled demo fixture loads only with `SCORECARD_DEMO=1` in development. Results are not saved or emailed; there is no lead capture.
**Needed from Growth Blueprint:** **S1** questions, options, sections, weights and scoring; **S2** bands and thresholds plus report text per band and section (EN + AR, reviewed); **S3** decision whether the report is only shown on screen, or also emailed/saved (that requires an email provider, CRM and privacy text); **S4** consent wording and approval record; **S5** decision on where questions live (reviewed code file, or Sanity: not built).
**Configuration points:** `src/scorecard/config.ts` (`realScorecard`, `status`, `approval`, `review`, `consent`). No environment variables. If results are to be sent, add an adapter and its server-only variables in `src/contact/providers.ts` style.

## 3. Booking and calendar availability
**Supports now:** single-session and three-session package model; booking journey pages (package, schedule, details, checkout, return states); `Asia/Riyadh` display; availability lookup through the server action `fetchAvailability` (no personal data sent); `CalendarProvider` interface (`getAvailability`, `reserveSlots`, `confirmBooking`, `cancelBooking`); validator that blocks "live" without approved terms, prices, durations and both providers.
**Placeholder / inactive:** `realBooking` (`src/booking/config.ts`) has package names only: no prices, durations, bundle policy, terms or approval; `installedProviders` is `{ calendar: null, payment: null }`; the page shows "Booking opening soon" (with a mailto only if `enquiryEmail` is supplied, currently `null`). Dev demo only via `BOOKING_DEMO=1`. Live reservation and confirmation are not implemented.
**Needed from Growth Blueprint:** **K1** session length, working days/hours, buffers, notice period, meeting method and link; **K2** calendar platform and an account they own; **K3** the details collected at booking (current minimum: name, email, optional notes); **K4** booking confirmation/reminder email source and sender; **K5** bundle rules (see section 4); **K6** booking terms and processing-consent wording (EN + AR, legal-approved); the confirmed enquiry address for the "opening soon" state (**B4**).
**Configuration points:** `src/booking/config.ts` (`providers.calendar`, `enquiryEmail`, `terms`, `approval`), `src/booking/providers.ts`, `src/booking/actions.ts`. New server-only calendar variables to be added to `.env.example` when the adapter is written (none exist).

## 4. Payment: single sessions and three-session bundles
**Supports now:** hosted-checkout-only design (the site never shows or stores card fields); `PaymentProvider` interface (`createCheckoutSession`, `getCheckoutStatus`); return states for confirmed, pending, cancelled and error; result always re-verified server-side, never trusted from the return URL; prices rendered from config only.
**Placeholder / inactive:** no gateway, no prices, currency or VAT treatment, no refund/cancellation terms, no bundle policy (`bundlePolicy: null`); live checkout intentionally returns `not-enabled`; no webhook route; the simulated checkout exists only in the dev demo.
**Needed from Growth Blueprint:** **Y1** gateway and a company-owned merchant account (including the payment methods they want to offer and test-mode access); **Y2** prices, currency, VAT/tax display; **Y3** cancellation and refund terms, approved by their legal adviser (EN + AR); **K5** bundle rules (validity period, how sessions 2 and 3 are scheduled, expiry, unused sessions); receipts/invoices source (with Y3).
**Configuration points:** `src/booking/config.ts` (`providers.payment`, `bundlePolicy`, `packages[].price`, `terms`), `src/booking/providers.ts`. New during implementation: gateway API key, webhook signing secret, API base URL (server-only), and a webhook route under `src/app/api/`.

## 5. Sector brief shop, payment and secure file delivery
**Supports now:** product, order and delivery model; catalogue, product, checkout and order-status pages; products from Sanity `product` documents; draft and preview products are never purchasable or listed in production; `ShopPaymentProvider`, `FileStorageProvider` (signed, short-lived downloads) and `OrderRepository` interfaces; per-order download limit; file keys never reach the browser; paid files are never placed in `public/`; no subscriptions or bundles.
**Placeholder / inactive:** `realShop` (`src/shop/config.ts`) has no products, prices, terms or approval; `installedShopProviders` is all `null`; live checkout returns `not-enabled`; no webhook, no order creation, no email for confirmations or resend links; the demo (`SHOP_DEMO=1`, dev only) uses fake prices and a placeholder download with a clearly labelled dev-only signing string.
**Needed from Growth Blueprint:** **P1** the product list (title, summary, sector, price, currency, format/size/pages/languages, preview image, EN + AR); **P2** licence and refund terms (legal-approved); **P3** private storage account and where the PDFs live, an order store/database choice, download link lifetime and per-order limit, and who sends purchase/resend emails; **Y1** the gateway (may be the same as booking); optional marketing-consent wording (separate, never pre-ticked).
**Configuration points:** `src/shop/config.ts`, `src/shop/providers.ts`, `src/shop/delivery.ts` (decide between the storage provider's own signed URLs, preferred by the design, and the repo's HMAC signing, which would need a new server-only secret). New variables for payment, storage and order store in `.env.example` when the adapters exist; `SHOP_DEMO` is dev-only.

## 6. CRM enquiry connection
**Supports now:** three-step enquiry form (about you, your enquiry, review) with validation, error summary and no pre-ticked consent; canonical `EnquiryRecord` with consent evidence (text version and time); `CrmProvider.createEnquiry` interface (the adapter owns any field mapping); server action `submitEnquiry` with re-validation, honeypot and generic errors; nothing is stored, logged or sent to the browser store; channels are gated independently.
**Placeholder / inactive:** no CRM chosen (`installedContactProviders.crm` is `null`); `realContact` (`src/contact/config.ts`) is a draft with no approved consent wording, version id, approval record or approved privacy notice, so `/contact` shows "Online enquiries are not open yet" and collects nothing. Dev demo (`CONTACT_DEMO=1`) is client-side only and sends nothing. No notification email, no rate limiting.
**Needed from Growth Blueprint:** **C1** CRM and a company-owned account; **C2** confirmed enquiry fields (the design references also show phone number and a five-step flow) and the mapping to CRM fields; **C3** who is notified, expected response time, and an anti-spam/rate-limit choice; **B4** a working contact route until the CRM is live; **C4** approved enquiry consent wording with a version id, and **B5** the approved privacy notice.
**Configuration points:** `src/contact/providers.ts`, `src/contact/config.ts` (`providers.crm`, `terms.enquiryConsent`, `terms.version`, `privacyNotice`, `status`, `approval`, `review`). Commented placeholders already in `.env.example`: `CRM_API_BASE_URL`, `CRM_API_KEY` (generic names; replace with the chosen provider's real requirements).

## 7. Newsletter provider and subscription handling
**Supports now:** reusable `NewsletterSignup` (footer and Insights page) with its own consent, separate from enquiry consent and never pre-ticked; canonical `SubscriptionRecord`; `NewsletterProvider.subscribe` returning `subscribed` or `pending-confirmation` (the provider's own confirmation email); server action `subscribeNewsletter`; hidden in the footer and replaced by a short notice on Insights while unavailable.
**Placeholder / inactive:** no platform chosen (`installedContactProviders.newsletter` is `null`); draft consent wording only; no approved text or version id. Unsubscribe and preference handling will be the platform's.
**Needed from Growth Blueprint:** **N1** platform and a company-owned account, with an audience/list; **N2** single or double opt-in, sender name and address; **N3** approved bilingual consent wording and version id (legal adviser); rate-limit choice **C3**.
**Configuration points:** `src/contact/providers.ts`, `src/contact/config.ts` (`providers.newsletter`, `terms.newsletterConsent`). Commented placeholders in `.env.example`: `NEWSLETTER_API_BASE_URL`, `NEWSLETTER_API_KEY`, `NEWSLETTER_LIST_ID` (generic names).

## 8. Analytics and consent behaviour
**Supports now:** provider-neutral gate (`src/analytics/core.ts`): nothing is sent unless a provider is installed, a consent policy is defined and, where consent is required, granted; events before consent are dropped, never queued; four privacy-safe events only (`scorecard_start`, `scorecard_complete`, `booking_cta_click`, `shop_cta_click`) carrying event name, language and page path; no form content, emails or ids; source-guard tests forbid trackers, storage and network calls in this code. See `docs/analytics-handover.md`.
**Placeholder / inactive:** no provider (`installedAnalyticsProvider = null`), `consentPolicy` is `null`, no consent interface, no cookie page, no script loaded anywhere.
**Needed from Growth Blueprint:** **A1** analytics tool and a company-owned account; **A2** whether consent is required (their legal adviser decides; this project makes no determination) and, if so, approved bilingual consent text and a remembered-choice behaviour; **A3** data settings (retention, IP handling) and privacy notice wording that names the tool.
**Configuration points:** `src/analytics/config.ts` (`providerId`, `consentPolicy`), `src/analytics/providers.ts`, `src/analytics/consent.ts` (consent UI must call `setAnalyticsConsent`). A public measurement id, if the tool uses one, would be the only non-secret value and needs a variable added to `.env.example` at that time; API secrets stay server-side.

## 9. Domain, hosting and monitoring
**Supports now:** `SITE_URL` drives canonical, hreflang, sitemap and robots; indexing is off by default and only turns on with `ALLOW_INDEXING=1`, an https public `SITE_URL`, a production build and no hosting preview flag; noindex meta and `X-Robots-Tag` otherwise; bilingual 404; server features need a Node runtime (server actions, proxy, API route), so a static-only host will not work.
**Placeholder / inactive:** no domain, hosting account, DNS, certificate, uptime monitor, error reporting or Search Console property; staging protection not set up.
**Needed from Growth Blueprint:** **B1** domain registrar and DNS access, a company-owned hosting account (the developer as team member), preferred hosting platform; **B7** a named recipient for monitoring alerts and the monthly care report, and choice of uptime/error tools they own; Search Console ownership (**post-launch**, **L2**).
**Configuration points:** `SITE_URL` and `ALLOW_INDEXING` (build-time), `next.config.ts` (headers), hosting platform secret store. Monitoring tool keys to be added when chosen.

## 10. Google Business Profile access and confirmed business details
**Supports now:** `docs/google-business-profile-handover.md` checklist; `src/seo/business.ts` holds only confirmed facts (just the brand name today) and feeds `Organization` structured data; no address, phone, email, hours, logo or social links are published anywhere.
**Placeholder / inactive:** the profile has not been accessed, created or changed; no confirmed address or phone.
**Needed from Growth Blueprint:** **B4** approved legal/trading name, address (or service-area-only decision), public phone and email, hours, social profile links; **G1** Owner/Manager access for the reviewer; **G2** approved category, description (EN/AR), imagery with rights.
**Configuration points:** `confirmedBusiness` in `src/seo/business.ts` (add only confirmed values); `realBooking.enquiryEmail` in `src/booking/config.ts` for the mailto fallback.

## 11. Approved English and Arabic privacy, terms and consent wording
**Supports now:** Privacy and Terms page shells in both languages that state "approved text pending legal review" and list topics only; draft consent sentences with a visible "draft, needs legal review" marker; every consent is recorded with a text version id; the sitemap and indexing keep Privacy/Terms out of search until both languages are marked approved (`src/seo/state.ts`); footer links labelled "(draft shell)".
**Placeholder / inactive:** no approved privacy notice, terms, cookie text, consent wording or version ids; Arabic is professionally unreviewed.
**Needed from Growth Blueprint:** **B5** privacy notice and terms of use, written or approved by their legal adviser in EN and AR (controller identity, data collected, purposes, processors, retention, rights, contact); each consent or terms text with a version id: **C4** (enquiry), **N3** (newsletter), **S4** (scorecard), **K6** and **Y3** (booking and refunds), **P2** (shop), **A2** (analytics, if needed). The adviser also decides the cookie question and any compliance statements.
**Configuration points:** `src/content/sample/legal.ts` (page text and `review` status, to be replaced or moved to Sanity), `src/content/sample/ui.ts` (footer label "(draft shell)"), `src/contact/config.ts` (`terms`, `privacyNotice: "approved"`, `status`, `approval`), `src/booking/config.ts` and `src/shop/config.ts` (`terms`), `src/scorecard/config.ts` (`consent`).

---

## Suggested implementation order (after sign-off)
1. Hosting, domain, `SITE_URL`, monitoring (B1, B7); replace sample content via CMS or code (B2, B3); legal pages (B5); brand assets (B6).
2. CRM enquiries (C1 to C4) and newsletter (N1 to N3), including the email gap and rate limiting.
3. Analytics and consent (A1 to A3), only after the consent decision.
4. Booking and payment together (K1 to K6, Y1 to Y3), including webhooks.
5. Scorecard (S1 to S5), then the shop (P1 to P3) reusing the gateway.
6. Google Business Profile review (G1, G2) in parallel once business details are confirmed.
