import { getBookingRuntime } from "@/booking/load.ts";
import { deriveReturnState, type ReturnRoute } from "@/booking/rules.ts";
import type { PaymentStatus } from "@/booking/types.ts";
import { StatusView } from "./StatusView";
import { BookingPage } from "./BookingPage";

type Search = Promise<{ session?: string | string[] }>;

/**
 * Shared by the four return routes. The payment result is verified server-side with the provider (getCheckoutStatus);
 * the URL alone can never produce "confirmed". `searchParams` is only awaited when booking is live/demo, so the
 * opening-soon build stays static.
 */
export async function StatusPage({ lang, route, searchParams }: { lang: string; route: ReturnRoute; searchParams: Search }) {
  const rt = await getBookingRuntime();
  let status: PaymentStatus | "no-session" = "no-session";
  if (rt.mode !== "opening-soon" && rt.providers.payment) {
    const raw = (await searchParams).session;
    const session = Array.isArray(raw) ? raw[0] : raw;
    if (session && session.length <= 200) {
      const r = await rt.providers.payment.getCheckoutStatus(session);
      status = r.ok ? r.value : "unknown";
    }
  }
  const state = deriveReturnState(route, status);
  return (
    <BookingPage
      lang={lang}
      step={null}
      title={(u) => u.status[state].title}
      view={(bk, ui, locale, isDemo) => <StatusView state={state} bk={bk} ui={ui} locale={locale} isDemo={isDemo} />}
    />
  );
}
