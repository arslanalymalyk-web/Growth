# Google Business Profile: client handover checklist

Status: **not started. Nothing has been accessed, created, claimed, verified or changed on Google, and this project does not claim that a profile exists or is optimised.** This checklist lists what Growth Blueprint Advisory must provide so that a profile can be reviewed or updated by someone with the right access.

Rule for the website: business details appear on the site and in structured data (`src/seo/business.ts`) **only after the client confirms them in writing**, and they must match the profile exactly. Today only the brand name is confirmed; address, telephone, email, hours, logo and profile links are all empty.

## Access (client action)
- [ ] Confirm whether a Google Business Profile already exists (search result or link), or whether a new one should be created.
- [ ] Identify the current **Owner** account. The profile must be owned by a Google account the business controls (not an agency or former employee).
- [ ] Add the reviewing/maintaining person as a **Manager** (or Owner) from Business Profile settings, or provide the Owner's confirmation that they will make the edits themselves.
- [ ] Confirm who receives verification (postcode, call, video) and who is allowed to respond to Google and to reviews.

## Information to approve (client action)
| Item | What is needed | Confirmed? |
|---|---|---|
| Business name | Exact approved name, in English and, if wanted, Arabic. Must match real-world signage and the website (no keywords added). | [ ] |
| Primary category (and optional secondary) | Chosen from Google's category list; client decision. | [ ] |
| Business model | Storefront/office customers visit, or service-area business (no public address). Decides whether an address is shown. | [ ] |
| Address | Full address, if customers visit or if Google verification requires one. Say whether it may be shown publicly. | [ ] |
| Service area | Named cities/regions served, only if a service-area business. | [ ] |
| Contact details | Public phone number, public email (if any), and which language each is answered in. | [ ] |
| Website URL | The live production URL (the `SITE_URL` value) and the preferred landing page (e.g. `/en` or `/ar`). Optional: appointment link (`/en/book-consultation`) once booking is live. | [ ] |
| Opening hours | Regular hours, holiday hours, and whether the business is appointment-only. | [ ] |
| Business description | Approved text (up to 750 characters) in each language; must avoid unverified claims, and be approved by the client. | [ ] |
| Services / products | Only services the client confirms they offer, with approved wording. | [ ] |
| Imagery | Approved logo, cover photo and photos (the project has no approved photography yet) with usage rights confirmed. | [ ] |
| Attributes / languages spoken | Only those that are true and the client approves. | [ ] |
| Social/other profile links | Official URLs only (also used for `sameAs` structured data if approved). | [ ] |

## After the client supplies the above
1. A named person with Owner/Manager access reviews and edits the profile in Google. The website team does not edit it from this project.
2. Add the confirmed values to `src/seo/business.ts` so the website and structured data stay consistent (e.g. `address`, `telephone`, `sameAs`). Do not add anything unconfirmed.
3. Check that name, address and phone (if shown) are identical on the website, the profile and any directories.
4. Decide who monitors reviews, questions and messages. The website never displays or fabricates ratings or reviews.
