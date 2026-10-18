# Growth Blueprint: website, scorecard, briefs shop and server

A bilingual (English `/en`, Arabic `/ar`, right-to-left), mobile-first website with:

- a cinematic home-page hero (a blueprint skyline draws itself, then the photograph is revealed)
- the **Saudi Readiness Scorecard**: a 10-minute, 24-statement diagnostic with a tailored, printable report
- an online **shop for sector briefs** with signed, expiring, count-limited downloads
- **newsletter sign-up** (explicit consent, double opt-in) and **form-to-CRM** forwarding (webhook, HMAC-signed, retried)
- a bilingual **Privacy Notice** structured around Saudi Arabia's Personal Data Protection Law (PDPL), with a rights-request form
- 55 pages per language, all copy written in a plain, human voice (`CONTENT-EN.md`, `CONTENT-AR.md`) and a critical review (`CONTENT_REVIEW.md`)

No runtime dependencies. Node 20 or newer.

## Run it

```bash
node build.mjs            # generates dist/ (116 pages)
node server.mjs           # http://127.0.0.1:3000  (site + API + shop)
```

Or open `dist/index.html` directly. In that **static** mode everything reads and works, forms fall back to a clearly labelled demonstration mode, and the shop cannot take orders (there is no server to take them).

## What the server does

| Endpoint | Purpose |
|---|---|
| `POST /api/newsletter` | Sign-up. Requires `consent: true`. Creates a *pending* subscriber and a signed confirmation link (double opt-in). The response is identical whether or not the address is known. |
| `GET /api/newsletter/confirm?t=` / `unsubscribe?t=` | Signed links; confirm and withdraw are logged as consent events. |
| `POST /api/lead` | Enquiry, booking and scorecard-report requests. Requires processing consent; marketing consent is recorded separately and defaults to off. |
| `POST /api/privacy/request` | Access, copy, correction, deletion, withdrawal, objection. Logged with a 30-day target date. |
| `POST /api/shop/checkout` | Creates an order. The **server** sets prices and VAT; the client's numbers are ignored. |
| `GET /api/shop/order`, `POST /api/shop/download-link`, `GET /download/:token` | Order view and secure download. |
| `GET /api/shop/invoice` | A *simulated* tax invoice. |
| `GET /api/health` | Status (no secrets). |

### Secure download, in plain terms
- Briefs live in `private/briefs/`, outside the web root. They are never linked and never served as static files.
- The order page URL carries an access key in the **fragment** (`#k=...`), which browsers never send to servers or in referrers. The server stores only its hash.
- Each click asks for a link: an HMAC-signed token bound to the order and item, valid for `DOWNLOAD_TTL_SECONDS` (default 10 minutes), **single use**, and counted against a per-item limit (`DOWNLOAD_MAX`, default 5).
- A tampered, expired, reused or over-limit link returns 403. These cases are covered by tests.

### Form-to-CRM
Set `CRM_WEBHOOK_URL` (a CRM, Zapier, Make, n8n or your own endpoint). Each event is POSTed as JSON:

```json
{ "id": "GBA-261018-1A2B3C", "event": "lead.enquiry", "occurredAt": "2026-10-18T09:30:00Z", "lang": "en", "source": "enquiry",
  "contact": { "name": "...", "email": "...", "company": "...", "phone": "...", "role": "..." },
  "data": { "interest": "...", "sector": "...", "objectives": "...", "timeline": "...", "message": "..." },
  "consents": { "processing": { "given": true, "version": "privacy-2026-1", "ts": "..." }, "marketing": { "given": false, "version": "marketing-2026-1", "ts": "..." } },
  "meta": { "ipHash": "...", "ua": "..." } }
```
Events: `lead.enquiry`, `lead.booking`, `lead.scorecard`, `newsletter.confirmed`, `newsletter.unsubscribed`, `order.paid`, `privacy.request`. Headers: `X-GBA-Event`, `X-GBA-Delivery` (idempotency key), and, if `CRM_WEBHOOK_SECRET` is set, `X-GBA-Signature: sha256=<hmac of the raw body>`. Failed deliveries are retried (1 s, 3 s, 9 s) and then kept in `data/crm-outbox.jsonl`; with no webhook configured, events queue there so nothing is lost.

### Consent and records
Every consent or withdrawal is appended to `data/consents.jsonl` with the consent type, **text version**, time, language, source and a salted **hash** of the IP and of the email (the log holds no raw address). Marketing consent is never pre-ticked and is always separate from the consent needed to answer an enquiry. Wording versions live in `server.mjs` (`VERSIONS`) and `src/legal.mjs`.

## Configuration (environment variables)

| Variable | Default | Notes |
|---|---|---|
| `PORT`, `HOST` | `3000`, `127.0.0.1` | Put it behind a TLS proxy; set `TRUST_PROXY=1` there. |
| `PUBLIC_BASE_URL` | request host | Used in emailed links. Set to your `https://` origin in production (also enables HSTS). |
| `DATA_DIR` | `./data` | Append-only JSONL files. Back this up; it holds personal data. Git-ignored. |
| `DOWNLOAD_SIGNING_SECRET` | random, kept in `data/.secret` | Set explicitly in production. |
| `DOWNLOAD_TTL_SECONDS`, `DOWNLOAD_MAX` | `600`, `5` | |
| `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_SECRET` | unset | See above. |
| `DEMO_PAYMENTS` | `1` unless `NODE_ENV=production` | **Simulated** payments. In production with `DEMO_PAYMENTS=0` the checkout returns 501 until a real provider is added. |
| `SELLER_VAT_NO` | placeholder | Printed on the simulated invoice. |

## What is simulated, and what to plug in

| Area | Today | To go live |
|---|---|---|
| **Payment** | Simulated, no card is charged. | Add a gateway adapter (for example a Saudi provider supporting mada, Apple Pay and cards), verify payment **server-side** (webhook or status call) before marking an order paid, then keep the rest unchanged. |
| **Email** | Written to `data/mail-outbox.jsonl`. Nothing is sent. The UI says so. | Implement `sendMail()` in `server.mjs` with an SMTP or email-API provider; add bilingual templates. |
| **Invoices** | A simple simulated page. | Compliant e-invoicing with the tax authority's system. |
| **Booking** | A request form; "online booking is coming". | Connect a scheduling tool. |
| **CMS** | Content is in `src/*.mjs`. | Move to a CMS if non-developers will edit. |
| **Photography** | Cropped from the design mock-ups (low resolution; AI-looking). | Replace with licensed images in `assets/img/` (same file names). |

## Tests

```bash
node --test scripts/server.test.mjs      # 9 server tests: consent, tokens, limits, CRM signing and retry, path traversal, rate limiting
PORT=3300 DATA_DIR=/tmp/gba node server.mjs &
DATA_DIR=/tmp/gba node scripts/e2e.mjs http://127.0.0.1:3300     # browser journeys; needs Playwright + Chromium
```
The end-to-end suite drives the scorecard (English and Arabic), basket to checkout to download (verifying the PDF), newsletter double opt-in, enquiry and booking to the CRM queue, and the privacy request, and fails on any console error or Content-Security-Policy violation.

## Regenerating things

```bash
node scripts/make-briefs.mjs        # rebuilds private/briefs/*.pdf from src/briefs.mjs (needs Playwright + Chromium)
node scripts/export-content.mjs     # rewrites CONTENT-EN.md / CONTENT-AR.md from the built pages
```

## Structure

`src/` content and templates (`pages`, `services`, `industries`, `scorecard`, `shop`, `briefs`, `legal`, `views`, `views2`, `render`) · `assets/` CSS, JS, images · `server.mjs` · `build.mjs` · `dist/` generated site · `private/briefs/` the PDFs sold in the shop (never public) · `scripts/` tests and generators · `CONTENT_REVIEW.md`.

## Before this goes public

1. Replace placeholders: commercial registration and VAT numbers, address, phone, privacy contact, data-protection contact (`[square brackets]` in `src/legal.mjs`, and `src/ui.mjs`).
2. Have Saudi counsel review the Privacy Notice, Terms, Cookie Policy and the brief licence.
3. Have a native Arabic copywriter review the Arabic.
4. Replace the photography.
5. Connect payments, email, CRM and calendar. Remove the demonstration notes.
6. Change `dist/robots.txt` (currently blocks all crawlers) and add `sitemap.xml`.
7. Run an accessibility audit and a performance check on mid-range phones.
