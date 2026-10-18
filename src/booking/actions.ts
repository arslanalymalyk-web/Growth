"use server";

import { getBookingRuntime } from "./load.ts";
import type { Locale, ProviderError, Slot } from "./types.ts";

/**
 * Server actions. They carry NO personal data: only a package id, a date range and a locale. Personal details never
 * leave the browser in this stage.
 */
export type ActionResult<T> = { ok: true; value: T } | { ok: false; error: ProviderError };
const fail = (code: ProviderError["code"], message: string): { ok: false; error: ProviderError } => ({ ok: false, error: { code, message } });
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export async function fetchAvailability(input: { packageId: string; fromDate: string; toDate: string }): Promise<ActionResult<Slot[]>> {
  const rt = await getBookingRuntime();
  if (rt.mode === "opening-soon" || !rt.config || !rt.providers.calendar) return fail("unavailable", "Booking is not available.");
  const ok = typeof input?.packageId === "string" && rt.config.packages.some((p) => p.id === input.packageId) && DATE.test(input.fromDate) && DATE.test(input.toDate) &&
    input.fromDate <= input.toDate && (Date.parse(input.toDate) - Date.parse(input.fromDate)) / 86_400_000 <= 62;
  if (!ok) return fail("invalid-request", "Invalid availability request.");
  return rt.providers.calendar.getAvailability({ packageId: input.packageId, fromDate: input.fromDate, toDate: input.toDate, timeZone: "Asia/Riyadh" });
}

/**
 * Prepares the handoff to the provider's hosted checkout. In this stage it can only run in the development demo, where
 * it returns the URL of the simulator page and sends NO personal data (placeholder customer values are used).
 * A live checkout (reserving slots and creating the provider session with the visitor's details) must be added only
 * after the client has approved the providers and the personal-data processing, so it intentionally returns "not-enabled".
 */
export async function prepareCheckoutHandoff(input: { packageId: string; locale: Locale }): Promise<ActionResult<{ checkoutUrl: string }>> {
  const rt = await getBookingRuntime();
  if (rt.mode === "opening-soon" || !rt.config || !rt.providers.payment) return fail("unavailable", "Booking is not available.");
  if (rt.mode !== "demo") return fail("not-enabled", "Live checkout is not enabled in this stage.");
  if (!rt.config.packages.some((p) => p.id === input?.packageId) || (input.locale !== "en" && input.locale !== "ar")) return fail("invalid-request", "Invalid request.");
  const r = await rt.providers.payment.createCheckoutSession({
    packageId: input.packageId,
    reservationId: "demo-reservation",
    returnUrls: { success: "", pending: "", cancelled: "", error: "" },
    locale: input.locale,
    customer: { name: "Demo placeholder", email: "demo@example.invalid" },
  });
  return r.ok ? { ok: true, value: { checkoutUrl: r.value.checkoutUrl } } : r;
}
