# Visual reference map

Source: `Growth_Upload.zip` + `.z01` + `.z02` + `.z03` (a split zip that contains one file, `Growth.rar`, 90 MB, RAR5). Extracted to `reference-assets/growth-blueprint/` (git-ignored, outside `public/`, never served). Nothing from the archive is displayed as a page; screenshots are reference only.

**Inaccessible:** `Saudi Partnerships & Commercial Development Page.png` failed the archive's block checksum (corrupt in the upload) and could not be read. The other 46 images extracted and open correctly. Please re-send that one file if it matters.

## Standalone photography found (the only usable assets)
| File | Used as | Where |
|---|---|---|
| `Saudi Financial District at Blue Hour.png` (1024x1536) | `public/images/skyline-dusk.webp` | Home hero (full-bleed, navy scrim) |
| `Saudi business landscapes and innovation.png` (2172x724, a 3x2 photo collage) | six tiles cropped to `public/images/*.webp` (one use each) | district-skyline: Real Estate; hospitality-lobby: Hospitality; manufacturing-floor: Industry & Manufacturing; port-logistics: Logistics & Supply Chain; engineering-workspace: Technology & Digital; business-meeting: Contact page |

Every other image is a full-page mock-up or a multi-screen board with the photography baked in, so it was not cropped or reused. Industries without a supplied photo (FMCG, Healthcare, Construction, Retail, Professional Services, Tourism) keep the labelled "Approved photography pending" placeholder. Provenance and licence of the supplied photos (they look AI-generated or stock) must be confirmed by the client.

## Screens to routes
| Reference screen(s) | Route / section |
|---|---|
| Growth Blueprint Advisory Homepage; Saudi business growth advisory homepage; Saudi growth blueprint landing page | `/en` home |
| Growth Blueprint Arabic homepage | `/ar` home (RTL) |
| Entering Saudi Arabia advisory landing page | `/entering-saudi-arabia` |
| Growing in Saudi Arabia (in the Saudi journey boards, Saudi growth blueprint landing page) | `/growing-in-saudi-arabia` |
| Services Overview; nine-screen services board | `/services` |
| Formation & Establishment service page | `/services/business-setup-support` (layout pattern) |
| Governance, Finance & Compliance Coordination | no matching service in the project; nearest is `/services/regulatory-licensing-support` (conflict, see below) |
| Saudi market entry strategy page; Operations Support; HR, Talent & Executive Mobility; Brand, Marketing & Digital Growth; Partner Evaluation | `/services/[slug]` detail pattern |
| Industries overview; industries website board | `/industries` |
| FMCG; Healthcare; Industry & Manufacturing; Professional & Business Services; Retail & E-commerce; Construction & Engineering; Hospitality; Logistics; Real estate; Technology & Digital; Tourism & Leisure (and "Technology & Automation") | `/industries/[slug]` detail pattern |
| Our Approach | `/our-approach` |
| About Us | `/about` |
| Insights advisory page; Market Entry: Seven Essential Questions; Market Positioning and Pricing Blueprint | `/insights` and article page pattern |
| Market Readiness Checklist | `/readiness-scorecard` (intro) |
| Book a Meeting; Consultation Flow Mockups | `/book-consultation` ("Live scheduling coming soon" matches the opening-soon state) and `/contact` |
| Enquiry 1 to 5 screens; Opportunity enquiry; Enquiry Review | `/contact` multi-step enquiry |
| Demo enquiry confirmation | the contact form's labelled demo confirmation |
| Saudi Growth Blueprint: Your Business; Consultancy Objectives | `/contact` steps (reference has more steps than the project) |
| Saudi journey mockups; market advisory showcase | boards (overview only) |

## Visual changes made
- Home hero: full-bleed photograph with navy scrim, gold rule under the title (all pages), eyebrow labels with a trailing gold rule (follows RTL).
- Page heroes: taller, subtle geometric lattice, gold rule; photo option for later.
- Industry cards, the home industries strip and industry heroes show the supplied photographs where they exist.
- Approach steps: gold numbered circles joined by a line (mirrors in Arabic).
- Sector challenges: borderless columns with thin dividers; closing "Book a consultation" bands are navy with the lattice.
- Footer: line-art skyline strip above a gold rule.
- Contact: navy section with the form on an ivory card, the supplied meeting photo and links beside it.
- Focus ring: two-tone (navy and gold) so it meets 3:1 on both light and dark sections.

## Copy conflicts and decisions for the client (reference copy NOT used)
- Footer and contact mock-ups show **an email address (enquiries@/info@growthblueprint.sa), a Riyadh or Jeddah address, "Our Office" and LinkedIn/X/YouTube links**. The mock-ups disagree (Riyadh vs Jeddah) and none is confirmed, so none is shown.
- About mock-up says "over 20 years of experience". Not confirmed; omitted.
- Enquiry mock-ups collect phone number and have five steps; the project's minimal three-step form does not collect phone. Confirm fields.
- Service mock-ups use service names ("Governance, Finance & Compliance Coordination", "Visa & Immigration", "ESG Advisory") that are not in the confirmed catalogue; the confirmed eight services are kept.
- Mock-up sections with no confirmed content (FAQs, scope lists, deliverables, process stages, "illustrative" outputs, testimonials-style quotes, "A Brighter Everyday" shop signage) were not invented.
- Mock-ups show a Saudi-flag factory scene and people who may be recognisable. Confirm image rights before use.

## Photography cropped from the mock-ups (visual-fidelity pass)
To make the site read like the supplied designs, clean photograph regions were cropped from the mock-up screens (never the screens themselves) into `public/images/` and upscaled slightly: `fmcg`, `healthcare`, `construction`, `retail`, `professional` (industry-page heroes), `fmcg-overview` (dates and coffee-pot still life), `founder` (portrait, home mock-up), `insight1-3` (home insight thumbnails) and `desert` (resource-band backdrop). They are low resolution (about 400 px wide in the source) and show people who may be recognisable; they look AI-generated. Treat them as visual stand-ins: **replace with licensed, full-resolution photography and confirm image rights before launch.** Tourism & Leisure reuses `desert`; the Tourism mock-up was not among the files that extracted.
