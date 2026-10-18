# Client sign-off checklist

The single list of what Growth Blueprint Advisory must decide, supply or approve. Tick an item when it is signed off. Detail on what the code already supports, what is inactive, and where each value goes lives in `docs/integration-implementation-plan.md` (section numbers in brackets). Launch operations are in `docs/launch-checklist.md`.

All accounts must be created and owned by Growth Blueprint Advisory; the developer gets delegated access only. Never send credentials by chat or email: they go into the hosting secret store or the company's password manager. Wording that is legal in nature must come from the client's legal adviser; the website makes no compliance claims.

## 1. Launch blockers (needed before the site goes public)
- [ ] **B1** Domain registrar and DNS access; a company-owned hosting account that can run a Node server; preferred hosting platform. [9]
- [ ] **B2** Approved English copy for every page, and professionally reviewed Arabic copy, replacing the sample text, "Sample" badges and placeholders. [1]
- [ ] **B3** Decision: edit content through a CMS at launch (then a company-owned Sanity project/dataset, editor accounts and publishers) or in code first. [1]
- [ ] **B4** Confirmed business details to publish (trading name, address or "service area only", public phone and email, hours, social links) and **one working way to contact the firm**: an enquiry email/phone, or a live CRM form (C1 to C4). Until then visitors cannot reach the firm online. [6, 10]
- [ ] **B5** Privacy notice and Terms of use approved by the client's legal adviser in English and Arabic. [11]
- [ ] **B6** Logo, favicon, 1200x630 social share image, and photography with confirmed licences (including the six photographs supplied in the reference archive and who owns the rights). [1]
- [ ] **B7** Named recipient for uptime/error alerts and the monthly care report; uptime and error tools they own. [9]
- [ ] **B8** Which features open at launch. Default: scorecard, booking, payment, shop, enquiry form, newsletter and analytics all stay "opening soon" or off, so only the items in section 1 are needed. Any feature you open at launch moves its section 2 items into blockers.

## 2. Needed before each feature may open (the site can launch without them)
**Saudi Readiness Scorecard** [2]
- [ ] **S1** Questions, answer options, sections, weights, scoring rules.
- [ ] **S2** Result bands and thresholds; report text per band and section (EN + AR, reviewed).
- [ ] **S3** Report delivery: on screen only, or also emailed/saved (needs provider and privacy text).
- [ ] **S4** Consent wording with version id (separate from newsletter) and an approval record.
- [ ] **S5** Where questions live: reviewed code file, or the CMS (not yet built).

**Booking and calendar** [3]
- [ ] **K1** Session length, working days/hours, buffers, notice period, meeting method and link.
- [ ] **K2** Calendar platform and account.
- [ ] **K3** Details to collect when booking (currently name, email, optional notes).
- [ ] **K4** Source and sender of confirmation/reminder emails.
- [ ] **K5** Three-session bundle rules (validity, how sessions 2 and 3 are scheduled, expiry, unused sessions).
- [ ] **K6** Booking terms and processing-consent wording (legal-approved, EN + AR).

**Payment (sessions and bundles)** [4]
- [ ] **Y1** Gateway and merchant account, payment methods wanted, test-mode access.
- [ ] **Y2** Prices, currency, VAT/tax display.
- [ ] **Y3** Cancellation and refund terms (legal-approved, EN + AR); receipts/invoices source.

**Sector brief shop** [5]
- [ ] **P1** Product list: title, summary, sector, price, currency, file format/size/pages/languages, preview image (EN + AR).
- [ ] **P2** Licence and refund terms (legal-approved); optional marketing-consent wording.
- [ ] **P3** Private file storage account and file location, order store choice, download link lifetime and per-order limit, who sends purchase and resend emails. Gateway: Y1.

**CRM enquiries** [6]
- [ ] **C1** CRM and account.
- [ ] **C2** Confirmed enquiry fields (design references also show phone and a five-step flow) and the mapping to CRM fields.
- [ ] **C3** Who is notified, response-time promise, and the anti-spam/rate-limit approach.
- [ ] **C4** Enquiry consent wording with version id (legal-approved, EN + AR).

**Newsletter** [7]
- [ ] **N1** Platform, account and list.
- [ ] **N2** Single or double opt-in; sender name and address.
- [ ] **N3** Consent wording with version id (legal-approved, EN + AR).

**Analytics and consent** [8]
- [ ] **A1** Analytics tool and account.
- [ ] **A2** Whether consent is required (legal adviser's decision) and, if so, approved bilingual consent text and how the choice is remembered.
- [ ] **A3** Retention and IP-handling settings; privacy wording naming the tool.

## 3. Can wait until after launch
- [ ] **G1** Owner/Manager access to the Google Business Profile for review (checklist: `docs/google-business-profile-handover.md`). The profile has not been accessed. [10]
- [ ] **G2** Approved profile category, EN/AR description and imagery with rights. [10]
- [ ] **L1** Review of Arabic wording on secondary pages already live, if Arabic was signed off in stages. [1]
- [ ] **L2** Search Console property owned by the company; submit the sitemap after launch. [9]
- [ ] **L3** Anything section 2 that was left "opening soon" at launch.
