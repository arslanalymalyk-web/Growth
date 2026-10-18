import type { ConsentState } from "./types.ts";

/**
 * In-memory consent state for the current page view. Starts "unknown" (= not granted). It is NOT persisted here: remembering
 * a choice is the job of the consent interface the client approves (none exists, because no tracking exists yet). That
 * interface must call setAnalyticsConsent(). Until it does, nothing is sent.
 */
let state: ConsentState = "unknown";
export const getAnalyticsConsent = (): ConsentState => state;
export function setAnalyticsConsent(next: ConsentState): void { state = next; }
