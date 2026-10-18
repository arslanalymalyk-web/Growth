"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { checkSelection, sessionsToSchedule, type ReturnState } from "@/booking/rules.ts";
import { bookingStore } from "@/booking/store.ts";
import type { LocalizedBooking } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { Container } from "../ui/Section";
import { BookingSummary } from "./BookingSummary";
import { useBooking } from "./useBooking";

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;

const tone: Record<ReturnState, { box: string; icon: string; mark: string }> = {
  confirmed: { box: "border-gold-500", icon: "text-gold-700", mark: "✓" },
  pending: { box: "border-gold-700", icon: "text-gold-700", mark: "…" },
  cancelled: { box: "border-ivory-300", icon: "text-ink-muted", mark: "–" },
  error: { box: "border-alert-700", icon: "text-alert-700", mark: "!" },
  unverified: { box: "border-ivory-300", icon: "text-ink-muted", mark: "?" },
};

/** Confirmation / pending / cancelled / error / unverified. "confirmed" is only ever passed after server-side provider verification. */
export function StatusView({ state, bk, ui, locale, isDemo }: { state: ReturnState; bk: LocalizedBooking; ui: BookingUi; locale: Locale; isDemo: boolean }) {
  const router = useRouter();
  const sel = useBooking();
  const s = ui.status;
  const copy = s[state];
  const t = tone[state];
  const pkg = bk.packages.find((p) => p.id === sel.packageId);
  const hasSelection = Boolean(pkg && checkSelection(sessionsToSchedule(pkg, bk.bundlePolicy), sel.slots).length === 0);
  const canRetry = hasSelection && (state === "cancelled" || state === "error" || state === "pending");

  return (
    <Container className="py-10 sm:py-14">
      <div role={state === "error" ? "alert" : "status"} className={`max-w-3xl border-2 bg-ivory-50 p-6 sm:p-10 ${t.box}`}>
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className={`flex size-12 shrink-0 items-center justify-center border-2 border-current text-2xl font-bold ${t.icon}`}>{t.mark}</span>
          <div>
            <h2 className="text-3xl text-navy-900 sm:text-4xl">{copy.title}</h2>
            <p className="mt-3 text-lg text-ink-muted">{copy.body}</p>
            {isDemo && <p className="mt-3 border-s-2 border-gold-700 ps-3 text-sm font-medium text-gold-700">{s.demoNote}</p>}
          </div>
        </div>
      </div>

      {hasSelection && pkg && (state === "confirmed" || canRetry) && (
        <section aria-labelledby="status-summary" className="mt-10 max-w-3xl">
          <h3 id="status-summary" className="mb-4 text-2xl text-navy-900">{s.summary}</h3>
          <BookingSummary ui={ui} locale={locale} pkg={pkg} slots={sel.slots} isDemo={isDemo} />
        </section>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {canRetry && <button type="button" className={btnPrimary} onClick={() => router.push(routes.bookingStep(locale, "checkout"))}>{s.tryAgain}</button>}
        {state === "confirmed" ? (
          <button type="button" className={btnPrimary} onClick={() => { bookingStore.reset(); router.push(routes.home(locale)); }}>{s.done}</button>
        ) : (
          <>
            <button type="button" className={canRetry ? btnOutline : btnPrimary} onClick={() => { bookingStore.reset(); router.push(routes.booking(locale)); }}>{s.startAgain}</button>
            <Link href={routes.home(locale)} className={btnOutline}>{s.home}</Link>
          </>
        )}
      </div>
    </Container>
  );
}
