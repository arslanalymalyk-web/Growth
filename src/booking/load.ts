import { realBooking } from "./config.ts";
import { resolveBookingMode, type BookingModeResult } from "./mode.ts";
import { installedProviders } from "./providers.ts";
import type { BookingConfig, BookingProviders } from "./types.ts";

export interface BookingRuntime extends BookingModeResult {
  /** Server-only. NEVER pass to client components. */
  providers: BookingProviders;
  demoCopy: typeof import("./demo.ts").demoCheckoutCopy | null;
}

/**
 * Server-side loader. The demo fixture (fake calendar and checkout) is imported ONLY when NODE_ENV === "development";
 * the check is inlined at build time, so it is dead-code-eliminated from production bundles.
 */
export async function getBookingRuntime(): Promise<BookingRuntime> {
  let demo: BookingConfig | null = null;
  let providers: BookingProviders = installedProviders;
  let demoCopy: BookingRuntime["demoCopy"] = null;
  let demoProviders: BookingProviders | null = null;
  if (process.env.NODE_ENV === "development") {
    const m = await import("./demo.ts");
    demo = m.demoBooking;
    demoCopy = m.demoCheckoutCopy;
    demoProviders = { calendar: m.demoCalendar, payment: m.demoPayment };
  }
  const result = resolveBookingMode({ nodeEnv: process.env.NODE_ENV, demoFlag: process.env.BOOKING_DEMO, real: realBooking, providers: installedProviders, demo });
  if (result.mode === "demo" && demoProviders) providers = demoProviders;
  return { ...result, providers, demoCopy: result.mode === "demo" ? demoCopy : null };
}
