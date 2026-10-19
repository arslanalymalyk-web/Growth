# Final critical review

Scope: the whole site as it stands (134 pages, English and Arabic), the new paid sessions, the testimonials, the imagery, the Industries rewrite, and everything before them.
Method: tests run, pages screenshotted at desktop and phone width in both languages, an automated accessibility audit, code read end to end. Where I could not verify something, it says so.

## 1. Verdict, as a sceptical buyer

If I were a Fortune 500 CEO shortlisting an adviser for a Saudi entry, this site now **explains the firm clearly and removes friction** (free consultation, a priced session I can book and pay for, a scorecard, briefs, bilingual, fast). It does **not yet prove the firm is who it says it is.** The gap is evidence, not design:

| Dimension | State | Blocking for launch? |
|---|---|---|
| Clarity of offer | Strong: four services plus advisory sessions, 13 industries as planning questions, how-we-work page | No |
| Proof (clients, results, people) | **Weak**: 3 client quotes with no named person, no case studies, team shown as initials | **Yes** |
| Imagery | Crisp, on-brand illustration; honest, but not evidence | Not blocking; replace over time (see `IMAGE_BRIEF.md`) |
| Booking and payment | Built and tested in simulated mode; **real card payment untested** | **Yes** until tested in the provider sandbox |
| Compliance | PDPL structure, consent log, retention tooling, ZATCA phase-1 invoice QR; **legal review pending** | **Yes** (counsel) |
| Arabic | Complete, consistent, **not native-reviewed** | **Yes** for an Arabic-first audience |
| Accessibility | axe: 0 violations on 26 pages x 2 languages x 2 viewports; 396 items flagged "needs a manual check" | No, but do the manual pass |
| Performance | Light (home HTML 52 KB, CSS 116 KB, JS 41 KB, fonts self-hosted) but not measured with Lighthouse here | No |
| Operations | Single Node process, JSONL files, in-memory limits | Fine to launch small; see 6 |

## 2. Imagery: the decision
**Real photography of real Saudi places and people. Not AI "photoreal". Keep the illustrations as an honest fallback.** Status: 7 licensed photographs are now live and credited (4 Saudi scenes, 3 illustrative industry photos); the rest of the site still uses illustration. See `IMAGE_BRIEF.md`. Reasoning, shot list, licence rules and the no-code swap tool are in `IMAGE_BRIEF.md`. The single highest-value image upgrade is real team photographs.

## 3. Paid advisory sessions: what is real and what is not
Built and tested (17 server tests, browser journeys in English and Arabic): weekly slot grid (Sunday to Thursday, 24-hour lead, blackout dates), slot hold during payment, server-set price and VAT, bundle of three with credits and a 120-day window, free reschedule up to 24 hours before, calendar file, invoice with ZATCA phase-1 QR, consent logging (terms, privacy, marketing separate), CRM event, double-booking protection.

Not done, or unverified. Each of these needs a decision or an account:
1. **Real card payment.** The hosted-payment adapter follows the Moyasar invoice API from documentation, tested only against a mock. Run it in the provider's sandbox before launch (amounts in halalas, success and back URLs, callback, refunds, 3-D Secure). Card numbers never touch the server, by design.
2. **Prices are placeholders** (SAR 1,500 single, SAR 3,900 bundle, before VAT). Set `SESSION_PRICE_SINGLE` and `SESSION_PRICE_BUNDLE`.
3. **Availability is a fixed grid, not your calendar.** It will happily offer a slot you are already in a meeting for. Use `SESSION_BLACKOUT_DATES` and keep the grid honest, or connect Google or Outlook free/busy. Until then someone must watch the bookings (`/admin`).
4. **No video link is generated.** Set `MEETING_URL` (a standing room) or send a link manually; otherwise the email says one will follow.
5. **No reminder emails and no self-serve cancellation or refund.** Reschedule is self-serve; cancellations and refunds are handled by hand through the provider dashboard and the written terms. Decide the policy, then automate.
6. **Terms are a draft policy**: free reschedule up to 24 hours, refund if cancelled earlier, bundle valid 120 days. Confirm with the firm and counsel.
7. **Emails need a provider** (`MAIL_PROVIDER`), otherwise confirmations sit in the outbox.
8. **The single-file HTML edition runs sessions in a local demonstration**, as it has no server.

## 4. Testimonials
Three real quotes, shown as published by the firm. I did not invent more, because made-up client quotes are fake reviews. The slider is ready for twelve (3-second advance, pause control, hides itself when there is nothing to slide). `TESTIMONIALS_KIT.md` has the request emails in both languages and how to add each quote. Until named signatories are added, the three are weaker proof than they look.

## 5. Content, structure and claims
- **Consistent now**: four services plus sessions, "founded 2024, led by a 25-year practitioner" story, free 30-minute consultation everywhere.
- **Industries**: 13 listed as planning questions, not a track record, with "starting points, not licensing checklists". The firm has not said it works in all 13: remove any it does not want to claim.
- **Regulatory articles** (investment licence, Regional HQ, Saudisation, zakat/VAT) are general and dated, labelled "editorial draft" until a lawyer or accountant signs them off. Rules change, so assign someone to review them each quarter.
- **Missing proof content**: named case studies, a founder story with a photograph, partner and press mentions, a track-record line with real numbers. None can be written without the firm's facts.
- **Conversion**: the home page now offers four ways to start. That is helpful for an exploring reader but dilutes the primary action. Watch the analytics; if most visitors bounce, lead with the free consultation and the scorecard only.

## 6. Technical and operational risks
- **Data**: JSONL files, one process, in-memory rate limits. Fine for hundreds of bookings a month. Back up `data/` daily (it holds personal data), put it behind HTTPS, and plan a move to a database (SQLite or Postgres) before volume grows. Rate limits reset on restart and need `TRUST_PROXY=1` behind a proxy.
- **Security**: no runtime dependencies; HMAC-signed single-use download tokens; order keys in the URL fragment and stored hashed; CSP with script hashes; Origin check; admin console behind a token (use a long random value, HTTPS only). Not done: a penetration test, WAF, CAPTCHA enabled by default (Turnstile is built but needs your keys).
- **Payments and tax**: ZATCA phase 2 (XML, cryptographic stamp, clearance) is not implemented and may be mandatory for your wave. Ask your accountant.
- **Hosting and data residency**: undecided. Personal data of Saudi residents may have cross-border rules; finish section 6 of the Privacy Notice once the host is chosen.
- **Performance**: heroes are 2200 px wide for all screens. A responsive `srcset` (800, 1400, 2200) would cut phone data use noticeably. CSS and JS are not minified. Run Lighthouse on real devices.
- **Search**: set `SITE_URL` at build to enable canonical tags, sitemap and structured data; submit the sitemap to Google and Bing. Build keyword landing pages only for things the firm can prove it does.
- **Monitoring**: add uptime monitoring and error alerts; `/api/health` is ready.

## 7. Accessibility
Automated audit (axe-core, WCAG 2.1 A and AA): **0 violations** after fixing 5 issues it found (contrast on four gold elements, unnamed progress bars). Not covered by automation, and still needed: a screen-reader pass in Arabic and English (VoiceOver and NVDA), keyboard-only booking, high-zoom and reduced-motion checks, and a manual look at the 292 contrast and 104 in-text-link items axe could not settle by itself (`node scripts/a11y.mjs`).

## 8. What I would do next, in order
1. Get 6 to 10 real client quotes with named signatories (`TESTIMONIALS_KIT.md`).
2. Commission the team photographs and three hero scenes (`IMAGE_BRIEF.md`).
3. Test the payment adapter in the provider sandbox; confirm prices and the session terms; connect the email provider.
4. Counsel reviews Privacy Notice, Terms (including sessions), cookie policy and the regulatory articles; a native Arabic editor reviews everything.
5. Connect availability to the real calendar, add reminder emails and a cancellation flow.
6. Build with `SITE_URL`, deploy over HTTPS, add backups and monitoring, then run Lighthouse and a screen-reader pass.
7. Publish two real case studies and a founder story. This is what turns "clear" into "credible".

## 9. Test evidence
17 server tests (including sessions, provider mock, admin, mail, captcha), 43 browser checks (scorecard, shop, sessions in both languages, newsletter, enquiry, privacy), link check (7,300+ references, 0 broken), axe audit (0 violations), 36 screenshot baselines, single-file edition smoke test.
