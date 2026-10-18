# Analytics: status and what is needed to switch it on

Status: **off.** No analytics provider has been selected, no consent requirement has been defined, and no tracking script, cookie or request exists anywhere in the site.

## What exists
`src/analytics/` is a provider-neutral integration point:
- `types.ts`: the only four events the site may send (`scorecard_start`, `scorecard_complete`, `booking_cta_click`, `shop_cta_click`) and the `AnalyticsProvider` interface. An event contains **only** the event name, the language and the page path without language, query or hash.
- `config.ts`: `providerId` and `consentPolicy`, both `null`.
- `providers.ts`: `installedAnalyticsProvider = null`.
- `core.ts`: the gate. `track()` does nothing unless a provider is selected and installed **and** a consent policy is defined **and**, if consent is required, it has been granted. Events before consent are dropped (never queued or replayed). Unknown events and anything that looks like personal data are discarded.
- `consent.ts`: in-memory consent state (`unknown` by default).
- Hooks: `ButtonLink` marks links to booking, the scorecard assessment and the shop with `data-track`; one delegated listener (`AnalyticsEvents`) and `TrackOnMount` (scorecard results) call `track()`. They never read link text, form values, answers or results. Newsletter, enquiry, booking-details and checkout forms have **no** analytics hooks.

## What the client must decide or provide
1. **Provider** and an account owned by the client. Then implement the adapter in `providers.ts` and set `analyticsConfig.providerId`. The adapter loads its own script lazily, only from `send`.
2. **Consent requirement**, decided with the client's legal adviser (this project makes no legal determination). Set `analyticsConfig.consentPolicy` to `"opt-in"` or `"not-required"`.
3. If consent is required: an approved, bilingual (EN/AR, RTL) cookie/consent interface that calls `setAnalyticsConsent("granted" | "denied")`, remembers the choice in an approved way, and lets people change it. It is not built, because nothing sets cookies yet.
4. Privacy notice wording that describes the chosen tool (pending legal review; see `/privacy` shell).
5. Provider settings that avoid personal data (no IP-based profiling or user-level IDs unless approved), plus the data-retention period.

Until 1 and 2 are done, analytics stays off even if code calls `track()`.
