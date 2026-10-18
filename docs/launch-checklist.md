# Launch checklist (operations and verification)

What the client must decide, supply or approve is tracked **only** in `docs/client-inputs.md` (blockers B1 to B8, then per-feature items). Technical detail per integration is in `docs/integration-implementation-plan.md`. This checklist covers the steps to run once those are signed off.

## Ownership (confirm before launch)
- [ ] Domain, hosting, repository organisation, Sanity project and every provider account listed in the sign-off checklist are in Growth Blueprint Advisory's name; the developer has team-member access only (B1, B3).
- [ ] Credentials sit in the hosting secret store or the company password manager; nothing is committed or sent by chat/email.

## Environment and build
- [ ] `SITE_URL` is the real https origin (build time).
- [ ] No `*_DEMO` variable is set in production; `SHOW_DRAFT_PREVIEWS` is unset.
- [ ] `npm run check` passes on the exact commit being deployed.
- [ ] Staging is access-protected and `ALLOW_INDEXING` is **not** set there.
- [ ] Set `ALLOW_INDEXING=1` on the production build only after B2, B5 and B6 are done. Then confirm `/robots.txt` allows crawling, `/sitemap.xml` lists pages and pages send no `X-Robots-Tag: noindex`.
- [ ] HTTPS is active; `www`/apex redirect decided.

## Content and features
- [ ] Every page shows CMS or approved text, not sample text (no "Sample" badges, no "Approved photography pending" where photos were supplied).
- [ ] Each feature that stays closed (B8) shows its honest "opening soon / not available" state and collects nothing; spot-check scorecard, booking, shop, enquiry form and newsletter in both languages.
- [ ] For each feature opened at launch: run a provider test-mode transaction end to end (booking and refund, product purchase and signed download, enquiry reaching the CRM, newsletter confirmation) and confirm nothing says "sent/confirmed" unless it really was.
- [ ] Only confirmed business details appear in `src/seo/business.ts` and on the page.

## Final pass
- [ ] Click every header, footer, CTA and language-switch link on desktop and phone, English and Arabic; keyboard-only walk-through of home, contact, one service page and one industry page.
- [ ] Check an unknown URL (bilingual 404), `/favicon.ico` (needs B6), and the sitemap in Search Console after launch (L2).
- [ ] Rollback plan: the previous deployment can be redeployed; CMS content is exported.
- [ ] Monitoring is live and the named recipient (B7) gets the monthly report (`docs/monthly-care-report-template.md`).
