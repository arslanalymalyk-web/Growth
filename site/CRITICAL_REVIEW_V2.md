# Growth Blueprint: critical review (round 2)

Scope: the site as built (116 pages, EN/AR), the new logo suite, and the facts taken from getgrowthblueprint.com.
Method: I re-read the built copy, the data files and the code. Nothing here is guessed from the mockups. Where I could not verify something, I say so.

Severity: **P0** fix before any public launch · **P1** fix in the first sprint · **P2** worth doing · **P3** nice to have.

---

## 1. The biggest problem: the new site promises more than the real firm says it does (P0)

The live site describes **four** services: Market Intelligence, Market Entry Guidance, Strategic Introductions, Cultural & Business Advisory. The site I built lists **eight**:

| Built service | Does the live site support it? |
|---|---|
| Market Strategy & Entry | Yes (Market Intelligence + Entry Guidance) |
| Formation & Establishment | Partly ("business setup pathways") |
| Partnerships & Commercial Development | Yes (Strategic Introductions) |
| HR, Talent & Executive Mobility | **No** |
| Operations & Business Support | **No** |
| Governance, Finance & Compliance Coordination | **No**, only "legal, accounting & sector experts" in the network |
| Brand, Marketing & Digital Growth | Partly (a branding expert is on the team) |
| Technology & Automation | **No** |

The industries list has the same issue: 11 sectors, while the live site names healthcare, manufacturing and real estate through its clients and team, and little else.

**Why it matters.** A regulator, a competitor or an unhappy client can read this as advertising services the firm does not deliver. Under Saudi commercial advertising rules and ordinary consumer law, that is a real exposure. It also contradicts the "no invented claims" rule I held to everywhere else.

**Fix.** Ask Faisal which services are core, which are delivered through partners, and which are aspirational. Then either cut the site to what is true, or label the partner-delivered ones ("delivered with our network of …"). Until then, treat the eight-service structure as a draft.

## 2. Two voices on one site: "small founder-led firm" versus a five-person expert bench (P0)

- Several pages say "a small, founder-led firm", "the person whose name is on the door", "you will not be handed to a junior team".
- The new Team section shows five partners from five different organisations (Hatim Shetifi Office, Saudi Aim, Shetifi Real Estate…).
- The firm was founded in 2024, but the headline says "25+ years". I labelled it "years of leadership experience", which is true to the bios, but a visitor will still read it as firm age.

**Fix.** Pick one story and say it plainly: *"A new Jeddah advisory (2024) led by a managing director with 25+ years in multinationals, backed by a bench of independent specialists."* That is more honest and more persuasive than "small and founder-led". Rewrite the About founder block and the home founder band to match. Also state how the specialists relate to the firm (partners? associates? paid per project?). Visitors will wonder, and the answer is a trust signal.

## 3. Social proof is thin and unverifiable (P0 to P1)

- The three quotes have **no person's name, title, date or logo**, only a company name. The live site says "Real results from real businesses", but nothing here lets a visitor check that.
- I have no evidence the clients agreed to be quoted on a new site. Get written permission, and ideally a named signatory.
- There are no case studies. For a market-entry advisory, "what changed for the client" (months to licence, structure chosen, mistakes avoided) is the strongest content you can publish.
- Nothing shows outcomes. Even one anonymised metric per client ("incorporated in X weeks") would lift credibility.

## 4. Claims that need paperwork before launch (P0)

- **Licence #970146 "by MHRSD".** Add what it actually licenses (a licence number alone means little). Make the number a link or a screenshot to the official register if one exists. A claim of being "licensed" with no scope can mislead.
- **"Member of the Saudi Management Consultants Association"**: confirm and add the membership number or link.
- **"Aligned with Vision 2030"**: this is a marketing phrase, not an accreditation. Keep it, but never in the same line as "licensed", so it cannot read as government endorsement. Check the rules on using the Vision 2030 name and logo (I did not use the logo).
- **Commercial registration number**, VAT number and national address are missing from the footer and legal pages. Saudi e-commerce rules expect them on a site that sells things (see section 6).
- **Privacy notice** is a draft. It names "faisal@…" as the privacy contact, which is workable but not ideal. It needs a named data-protection lead, the registration position with SDAIA, a transfer-abroad section matched to your actual vendors, and a lawyer's sign-off. I am not a lawyer and the text says so.

## 5. The logo: strengths, weaknesses, and what to do next (P2)

**Strengths:** distinctive silhouette (an arch-shaped G, uncommon in the category), works in one colour, scales down to 24 px, reads as Saudi without using a cliché such as a palm or sword, outlined type.

**Weaknesses I would raise with a client:**
1. **The bars are a familiar "growth chart" trope.** The arch carries the originality; the bars are the safe part. A bolder option is a rising stair-step cut into the arch itself.
2. **Small-size fidelity.** At 24 px the gold diamond and the drafting rule disappear. The favicon still reads, but I recommend a simplified 16 px mark (arch + three bars only).
3. **The G is implied, not obvious.** Some viewers will see "a doorway with a chart". That may be fine, but test it with five people who do not know the name.
4. **The gold gradient is the weak point for print.** There is a flat-gold version via the mono files; define a Pantone and a foil spec before printing letterheads.
5. **Arabic lock-up is a translation of the English hierarchy.** A native Arabic designer should check the proportions, the baseline and whether the name should lead in Arabic contexts.
6. **No trademark search yet.** Check the Saudi Authority for Intellectual Property (SAIP) classes 35, 36 and 41 before spending on signage.

## 6. Commerce and compliance gaps in the shop (P0 if you keep the shop)

- **Payments are simulated.** No real gateway (Mada, Apple Pay, cards via HyperPay/Moyasar/Tap, etc.). A shop that cannot take payment is a demo.
- **VAT invoices** are generated, but a Saudi tax invoice needs ZATCA e-invoicing fields (QR, phase-1 or phase-2 requirements). The current one is not compliant.
- **Prices (750–950 SAR) are my placeholders.** I made up the product line (eight sector briefs) to fulfil the brief. The live site does not sell any. Confirm the products, the real content, the pricing and the licence terms with Faisal, or remove the shop.
- **The briefs themselves are templates.** They are 11 pages of structured, qualitative content with no sourced market data. Do not sell them as intelligence until a real analyst fills in researched numbers, sources and dates.
- **Refund and cancellation terms** for digital goods are missing. Saudi consumer rules expect them to be stated.
- **Email delivery** is an outbox file. Receipts and download links will not reach customers until you connect a mail provider.

## 7. Forms, CRM and privacy: good foundations, real gaps (P1)

Done well: consent captured with the exact wording version, honeypot, double opt-in, signed webhook with retries, 30-day privacy request clock.

Missing or weak:
- **No real CRM is connected.** The webhook is off by default. Pick the CRM (HubSpot, Zoho, Salesforce, Odoo) and map fields; I can build the adapter once chosen.
- **No email-sending provider**, so double opt-in confirmations cannot be delivered.
- **No spam protection beyond a honeypot** (no CAPTCHA/Turnstile). Expect form spam once the site is public.
- **No admin view.** Leads and consents live in JSONL files. Someone will need a simple dashboard or CRM view, plus export and deletion tooling for privacy requests.
- **Data residency.** If the server runs outside the Kingdom, PDPL cross-border transfer rules apply to Saudi residents' data. Decide where to host and say so in the notice.
- **Cookie banner** works, but analytics are not wired, so the consent choice currently controls nothing measurable.
- **Retention schedule** is described in words but not enforced by any job.

## 8. Content gaps (P1)

What a prospective investor expects and the site does not yet provide:
1. **A clear "how engagements work and what they cost"** page: typical scope, duration, fee model (fixed, retainer, success-linked), and what is not included. Right now the call to action is only "book a consultation".
2. **Founder and team depth:** photographs, LinkedIn links, languages spoken, previous employers. The cards show initials only.
3. **Case studies** (see section 3).
4. **The 30-minute consultation:** the live site promises a *free* 30-minute consultation. My copy mostly says "Book a Consultation" and in places "meeting". Make the offer identical and explicit everywhere (free, 30 minutes, online or in person, what you get).
5. **Regulatory explainers that are actually current:** MISA licensing, Regional HQ programme, Special Economic Zones, localisation (Saudisation/Nitaqat), commercial registration, zakat/VAT. Each is a high-intent search topic. They must be dated and reviewed by counsel each quarter, or removed.
6. **Events and roadshows.** The live site mentions "business roadshows" under Strategic Introductions; there is no page showing past or upcoming ones.
7. **FAQ for investors** specific to entry (timelines, ownership caps by sector, minimum capital). The current FAQs are generic.
8. **Press, partners and logos** (law firm, accounting firm, banks). The live site claims "Legal, accounting & sector experts": name them, with permission.
9. **Careers/partner-with-us** page, for the specialist bench model.
10. **Hero line.** The live site's strapline, *Clarity, Confidence & Connections*, is a strong, ownable idea and is also the mission. The built hero uses a different line ("Your Growth Blueprint for Saudi Arabia"). I would promote the original to the hero or the tagline, and make it the structure of the services section.

## 9. Arabic quality (P0 for an Arabic-first audience)

- All Arabic is machine-assisted by me and has **not been reviewed by a native editor**. Tone, register (formal Gulf business Arabic), terminology (e.g. *تأسيس*, *ترخيص*, *توطين*) and punctuation need a professional pass.
- Check names: personal names are transliterated by me (فيصل حلواني، حاتم شطيفي…). Ask each person how they write their name in Arabic.
- The Arabic page should not be a mirror of the English. Faisal's audience in Saudi will also include Saudi partners and officials: consider Arabic-first copy for some pages.
- Arabic numerals: choose Western (0–9) or Eastern (٠–٩) digits and keep them consistent. The site currently uses Western.
- The Arabic PDFs of the briefs are one-page summaries only; a fully Arabic edition is a clear gap.

## 10. SEO, performance and technical gaps (P1 to P2)

- **robots.txt blocks everything** (intended for the demo). Flip it, and add a sitemap.xml, before launch.
- **No canonical tags** and no structured data (Organization, LocalBusiness with the Jeddah address, Person, FAQ, Article, Product). Add JSON-LD.
- **hreflang is incomplete.** The current-language alternate has an empty `href`. It should point at itself.
- **Open Graph and Twitter cards** use one generic image; per-page images and descriptions would improve sharing.
- **Images are low-resolution crops from the mockups.** They look fine on a laptop but soft on large or retina screens. Commission real photography (Jeddah and Riyadh, the team, the office) and licensed or original skyline imagery.
- **Fonts load from Google Fonts**; for a Saudi audience and PDPL/privacy posture, self-host them.
- **No analytics, consent-gated** (Plausible or GA4 via consent). No uptime or error monitoring.
- **No accessibility audit by a person.** The automated checks pass, but I have not tested with a screen reader in Arabic. The hero animation respects reduced motion; the stroke animation and parallax should also be tested on low-end phones.
- **Hosting.** The static `dist/` cannot take shop orders or forms. Decide: a Node host (with the included server), or static hosting plus serverless functions.
- **Test coverage** is good for the server and the main journeys, but there is no visual regression test and no real-device test.

## 11. Things I deliberately did not invent (so you know where the holes are)

Client logos, case-study outcomes, awards, press mentions, certifications, social accounts other than the LinkedIn page you gave, a phone number for WhatsApp, a bank or tax identity, and any statistic about the Saudi market. Every one of those is a gap a visitor will notice.

## 12. Competitive context

Peers in this space typically show: named partners with photos, dated market reports (free summaries as lead magnets), a short engagement framework, and a visible regional presence (Riyadh plus one more city). The firm's differentiators are real (practitioner-led, legal and sector network, bilingual, 2024-fresh and flexible), but the site must **prove** them rather than state them. The Readiness Scorecard is the best lead magnet in the build; the briefs shop is the riskiest, because it is the piece the firm did not ask for in its live site.

---

## Priority list

**Before launch (P0)**
1. Reconcile services and sectors with what the firm really delivers (section 1).
2. Resolve the "small founder-led" versus "expert bench" story and the 2024 / 25+ years message (section 2).
3. Get permission and named attribution for the three client quotes (section 3).
4. Supply the licence scope, association membership proof, CR and VAT numbers (section 4).
5. Native Arabic edit and Arabic name confirmation (section 9).
6. Legal review of the privacy notice, terms, cookie policy and shop terms (sections 4 and 6).
7. Decide on the shop: confirm products and pricing, connect a real payment provider and ZATCA-compliant invoicing, or remove it (section 6).

**First sprint (P1)**
8. Connect a real CRM and an email provider (section 7).
9. Add a "how we work and what it costs" page and the free 30-minute consultation offer everywhere (section 8).
10. Real photography and team headshots (sections 5, 8, 10).
11. Case studies, even two short ones.
12. SEO foundations: sitemap, canonicals, hreflang fix, JSON-LD, self-hosted fonts (section 10).

**Later (P2/P3)**
13. Simplified small-size mark, Pantone/foil spec, trademark search (section 5).
14. Dated regulatory explainer series, events page, careers page (section 8).
15. Arabic edition of the briefs; admin view for leads and privacy requests (sections 7, 9).
