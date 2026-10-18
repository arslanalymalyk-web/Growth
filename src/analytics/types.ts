import type { Locale } from "../i18n/config.ts";

/** The complete list of events the site may ever send. Adding one is a deliberate, reviewed change. */
export const analyticsEvents = ["scorecard_start", "scorecard_complete", "booking_cta_click", "shop_cta_click"] as const;
export type AnalyticsEventName = (typeof analyticsEvents)[number];

/** Deliberately tiny: which event, in which language, on which page path. No form values, emails, ids, queries or scores. */
export interface AnalyticsEvent { name: AnalyticsEventName; locale: Locale; page: string }

/**
 * Whether consent is needed before analytics may run. Set by the client WITH their legal adviser; this project makes no
 * legal determination. `null` = not yet defined, which keeps analytics OFF.
 */
export type ConsentPolicy = "opt-in" | "not-required";
export type ConsentState = "unknown" | "granted" | "denied";

/**
 * Adapter for the analytics tool the client chooses. Installed in providers.ts only after selection. Its `send` is called
 * ONLY when the gate in core.ts passes, with an already-sanitised event. The adapter owns loading its own script.
 */
export interface AnalyticsProvider { id: string; send(event: AnalyticsEvent): void }
