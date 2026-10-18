import type { ConsentPolicy } from "./types.ts";

/**
 * Analytics configuration. NOTHING is confirmed: no provider has been chosen and no consent requirement has been defined,
 * so analytics is OFF. To enable (all three are required, see docs/analytics-handover.md):
 *  1. The client selects a provider and owns the account. Set `providerId` and install its adapter in providers.ts.
 *  2. The client and their legal adviser define the consent requirement. Set `consentPolicy`. For "opt-in" a consent
 *     interface must call setAnalyticsConsent("granted") (src/analytics/consent.ts) before anything is sent.
 *  3. Credentials/ids live in server-side or public build variables owned by the client (never committed).
 */
export const analyticsConfig: { providerId: string | null; consentPolicy: ConsentPolicy | null } = {
  providerId: null,
  consentPolicy: null,
};
