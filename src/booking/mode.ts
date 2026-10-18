import { validateBookingConfig } from "./validate.ts";
import type { BookingConfig, BookingMode, BookingProviders, ValidationIssue } from "./types.ts";

export interface BookingModeInput {
  nodeEnv: string | undefined;
  demoFlag: string | undefined;
  /** The real, client-owned configuration (draft until approved). */
  real: BookingConfig;
  /** Installed provider adapters (both null until the client has approved accounts). */
  providers: BookingProviders;
  /** The demo fixture. Only ever loaded in development; null elsewhere. */
  demo: BookingConfig | null;
}
export interface BookingModeResult { mode: BookingMode; config: BookingConfig | null; issues: ValidationIssue[] }

/**
 * What the public site shows:
 *  - "live": ONLY a valid, approved, non-demo configuration whose calendar AND payment providers are installed and
 *    match the configured provider ids.
 *  - "demo": only when NODE_ENV === "development" AND BOOKING_DEMO === "1" (never in production).
 *  - "opening-soon": everything else, including any incomplete draft or missing provider.
 */
export function resolveBookingMode({ nodeEnv, demoFlag, real, providers, demo }: BookingModeInput): BookingModeResult {
  const issues = validateBookingConfig(real);
  if (!providers.calendar) issues.push({ code: "calendar-provider-not-installed", message: "No calendar provider adapter is installed." });
  else if (providers.calendar.id !== real.providers.calendar) issues.push({ code: "calendar-provider-mismatch", message: "Installed calendar provider does not match the configured id." });
  if (!providers.payment) issues.push({ code: "payment-provider-not-installed", message: "No payment provider adapter is installed." });
  else if (providers.payment.id !== real.providers.payment) issues.push({ code: "payment-provider-mismatch", message: "Installed payment provider does not match the configured id." });

  if (issues.length === 0) return { mode: "live", config: real, issues };
  if (nodeEnv === "development" && demoFlag === "1" && demo && demo.isDemo) return { mode: "demo", config: demo, issues };
  return { mode: "opening-soon", config: null, issues };
}
