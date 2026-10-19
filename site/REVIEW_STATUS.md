# Review status: what was fixed, and what only the firm can finish

Maps every item of `CRITICAL_REVIEW_V2.md` to its status.
**Fixed** = done and tested. **Fixed, confirm** = done, but it states something the firm must confirm is true. **Needs you** = cannot be done from code (a fact, a permission, a contract, an account or a person).

## 1. Services and sectors versus the real firm
| Item | Status |
|---|---|
| Eight invented services | **Fixed.** The site now has the firm's own four: Market Intelligence, Market Entry Guidance, Strategic Introductions, Cultural & Business Advisory. Bullets follow the live site. Old pages are gone; internal links, scorecard links and the footer were remapped. |
| Eleven sectors | **Fixed, confirm.** Eight sectors remain (those with a sector brief). Real estate, manufacturing and healthcare are shown as "core" because the firm's clients and specialists are there. Confirm the other five. |
| Service claims beyond advisory (HR, operations, technology, "we run it") | **Fixed.** Removed from the Approach page, both journey pages, every sector page and the service pages. Method is now Assess, Plan, Prepare, Connect, Grow. |
| Invented durations ("four to eight weeks") | **Fixed.** None remain. The FAQ and fee page say plainly that timing and fees depend on the case. |

## 2. One consistent story
| Item | Status |
|---|---|
| "Small founder-led" versus a five-person bench; 2024 versus 25+ years | **Fixed, confirm.** Home and About now say: founded 2024 in Jeddah, led by Faisal Halawani (25+ years in multinational business), with specialists in law, branding, real estate and PR. The "25+" is labelled as leadership experience. Confirm how the specialists relate to the firm (partners, associates, per-project). |
| Hero | **Fixed.** Now the firm's own line: *Clarity, Confidence & Connections for Growth in Saudi Arabia* (Arabic: وضوح وثقة وعلاقات...). |
| Free 30-minute consultation | **Fixed.** Every button, the booking page and the new How we work page say "free 30-minute consultation". |

## 3. Social proof
| Item | Status |
|---|---|
| Quotes without names, dates or permission | **Needs you.** The page shows the three quotes as published by the firm and says so. Get written permission and a named signatory for each, then add `who` and `date` fields in `src/firm.mjs`. |
| Case studies | **Needs you.** None invented. Add real ones to `src/articles2.mjs` (same shape as an article). |

## 4. Claims needing paperwork
| Item | Status |
|---|---|
| Licence #970146 scope | **Needs you.** Add what it licenses and, if available, a link to the official register (`FIRM.licenceBody` in `src/firm.mjs`). |
| Association membership | **Needs you.** Add a membership number or link. |
| Commercial registration and VAT numbers | **Fixed (wiring).** Set `SELLER_CR_NO` and `SELLER_VAT_NO`; the invoice, QR and privacy notice use them. **Needs you** for the numbers. |
| Privacy notice | **Fixed, confirm.** Added a named responsible person (the Managing Director, until a data-protection lead is appointed), an SDAIA registration placeholder, concrete retention periods, and a refund section in the Terms. Version bumped to `privacy-2026-2`. **Needs you:** Saudi counsel's review and sign-off, the list of real providers, and the countries data is processed in. |

## 5. Logo
| Item | Status |
|---|---|
| Bars feel generic | **Fixed (option).** `brand/mark-alt-steps.svg`: the bars become one rising step line. The original remains the default. Choose one. |
| Small-size fidelity | **Fixed.** `mark-small.svg` and `favicon-small.svg` (thicker strokes, no node or rule). The site favicon uses it. |
| Arabic lockup, print colour | **Fixed (guidance).** Approximate Pantone and CMYK values and usage rules are on the brand sheet. **Needs you:** a native Arabic designer's check, a printed proof, and a SAIP trademark search (classes 35, 36, 41). |

## 6. Shop and compliance
| Item | Status |
|---|---|
| Invoice not ZATCA-shaped | **Fixed (phase 1).** Sequential invoice numbers, Arabic and English headings, seller details, and a phase-1 QR that decodes correctly with an independent reader. **Not done:** phase 2 (XML, cryptographic stamp, clearance/reporting). That needs ZATCA onboarding and a certified solution. |
| Refund and cancellation terms | **Fixed, confirm.** A "Cancellations and refunds" section (14 days if not downloaded; fix or refund if faulty). It is a business decision: confirm or change it. |
| Real payments | **Needs you.** Requires your merchant account with a Saudi provider. The checkout stays clearly simulated until then. |
| Prices and the product line | **Needs you.** The eight briefs and SAR prices are placeholders (one place: `src/shop.mjs`). The live site sells no briefs. Confirm, repurpose as free lead magnets, or remove the shop. |
| Briefs are templates | **Needs you.** Researched figures and sources must be added by an analyst before anything is sold as intelligence. |
| Email delivery | **Fixed (adapter).** Resend or a generic webhook, with logging. **Needs you:** an account, a verified sending domain and the keys. |

## 7. Forms, CRM, privacy tooling
| Item | Status |
|---|---|
| Real CRM | **Fixed (interface), needs you for the choice.** The signed webhook works with any CRM or automation tool. Point it at yours. |
| Spam protection | **Fixed.** Optional Cloudflare Turnstile (build and server keys). Honeypot and limits stay. |
| Admin view | **Fixed.** `/admin` (token) with tables, CSV export (spreadsheet-formula safe) and privacy-request status. |
| Erasure, retention | **Fixed.** `scripts/retention.mjs` (dry run by default), erase one person, scheduled purge of old leads and logs. Orders are never touched. **Needs you:** agree periods with counsel and schedule it. |
| Data residency | **Needs you.** Decide where to host; if outside the Kingdom, finish section 6 of the Privacy Notice. |
| Analytics and consent | **Fixed.** Plausible loads only after the visitor accepts, and only when `ANALYTICS_DOMAIN` is set. |

## 8. Content gaps
| Item | Status |
|---|---|
| How engagements work, and what they cost | **Fixed, confirm.** New page `/how-we-work/`: four steps, what is and is not included, and a fee approach (scoped and agreed in writing). It gives no price because none was supplied. Confirm the fee model. |
| Team depth | **Fixed (structure).** New `/team/` with full bios and JSON-LD. **Needs you:** headshots (drop files in `assets/team/`, set `photo` in `src/firm.mjs`). |
| Investor FAQ | **Fixed.** New `/faq/`, nine answers, with FAQ structured data. |
| Regulatory explainers | **Fixed, confirm.** Four new, dated articles (investment licence, Regional HQ programme, Saudisation and Nitaqat, zakat/tax/VAT). General information only, and each says rules change. **Needs you:** a lawyer or accountant to review before they are published as the firm's view. |
| Events and roadshows | **Needs you.** Roadshows are listed under Strategic Introductions; there is no past-events content to show. |
| Partners and press | **Needs you.** Names and logos need permission. `/work-with-us/` invites partners. |
| Careers or partner page | **Fixed.** `/work-with-us/`. |

## 9. Arabic
| Item | Status |
|---|---|
| Native review | **Needs you.** `AR_GLOSSARY.md` prepares the reviewer: register, names to confirm, terminology choices, first things to check. |
| Digits | **Fixed.** Western digits throughout (there was a mix). |
| Arabic edition of the briefs | **Needs you.** Still a one-page Arabic summary per brief. |

## 10. SEO and technical
| Item | Status |
|---|---|
| robots.txt blocks everything | **Fixed.** It still blocks while `SITE_URL` is unset (safe default); building with `SITE_URL` allows crawling, hides `/api`, `/download`, `/admin`, and adds `sitemap.xml`. |
| Canonical, hreflang (empty href bug), Open Graph URL, Twitter card | **Fixed.** Correct and absolute when `SITE_URL` is set; `x-default` added. |
| Structured data | **Fixed.** Organization (Jeddah, hours, LinkedIn), Person, FAQPage, Article. Product data is deliberately not added until payments are live. |
| noindex on transactional pages | **Fixed.** Basket, checkout, order, scorecard steps and results, confirmations. |
| Fonts from Google | **Fixed.** Self-hosted WOFF2 subsets (Latin and Arabic), preloaded; the CSP no longer allows Google. |
| Link integrity and titles | **Fixed.** `scripts/check-links.mjs`: about 6,100 references, all pages have a title, description and h1. Found and fixed one broken anchor and two missing headings. |
| Visual regression | **Fixed.** `scripts/visual.mjs` with 28 baselines (7 pages, EN and AR, desktop and phone). |
| Image sharpness | **Fixed.** All 87 images were low-resolution crops from the mock-ups. They are now original vector artwork rendered at 2 to 3 times the display size (Riyadh skyline, The Line, Diriyah, AlUla, Red Sea, renewables, industry, health, logistics). It is illustration, not photography: stock sites are not reachable from the build environment, and I cannot create photographs. |
| Real photography | **Needs you.** Replace any file in `assets/img/` (same name) with licensed photography whenever you have it. |
| Screen-reader test in Arabic, low-end phone test | **Needs you** (a person with the devices). |
| Hosting | **Needs you.** Node host with `server.mjs` (shop, forms, admin) or static hosting plus functions. |

## Things I noticed while fixing
- Tests: 13 server tests, the browser journeys, link check and visual baselines all pass.
- The footer note now says "Prototype build: payments are simulated and some sample content is illustrative", which should be removed once payments are live and content is signed off.
- The article list labels every article "Editorial draft: pending firm review". Remove that label (`INSIGHTS_PAGE.sample`) when the firm has approved the text.

## Round 3 changes
- **Testimonials:** a slider with previous, next and pause controls, reading in the page direction (left to right in English, right to left in Arabic). It holds 12 slots: the 3 real quotes plus 9 cards clearly marked "Sample". I did not invent client quotes. Replace each sample card in `src/firm.mjs`, or build with `TESTIMONIAL_SAMPLES=0` to publish only real ones.
- **Dead space:** section, hero, banner, footer and form padding reduced across the site.
- **Images:** see above.
