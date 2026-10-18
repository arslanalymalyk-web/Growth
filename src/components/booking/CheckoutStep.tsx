"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { prepareCheckoutHandoff } from "@/booking/actions.ts";
import { checkDetails, checkSelection, fieldsFor, sessionsToSchedule } from "@/booking/rules.ts";
import { bookingStore } from "@/booking/store.ts";
import type { LField, LocalizedBooking } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ErrorSummary } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";
import { BookingSummary } from "./BookingSummary";
import { StepGuard } from "./StepGuard";
import { focusHeadingAfterNavigation, markNavigated, useBooking } from "./useBooking";

type Handoff = "idle" | "preparing" | "error" | "not-enabled" | "cancelled";
const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
/** Only same-site paths or https URLs may be used as a checkout destination (never javascript:/data: etc.). */
const safeDestination = (u: string) => u.startsWith("/") && !u.startsWith("//") || /^https:\/\//i.test(u);

export function CheckoutStep({ bk, ui, locale, isDemo }: { bk: LocalizedBooking; ui: BookingUi; locale: Locale; isDemo: boolean }) {
  const router = useRouter();
  const state = useBooking();
  const c = ui.checkout;
  const [handoff, setHandoff] = useState<Handoff>("idle");
  const [termsError, setTermsError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const token = useRef(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => focusHeadingAfterNavigation(headingRef), []);

  const pkg = bk.packages.find((p) => p.id === state.packageId);
  const ready = pkg
    ? checkSelection(sessionsToSchedule(pkg, bk.bundlePolicy), state.slots).length === 0 &&
      checkDetails(fieldsFor<LField>(bk.fields, pkg.kind), state.details).length === 0 && state.consentProcessing
    : false;
  if (!pkg || !ready) return <StepGuard ui={ui} locale={locale} />;

  const terms: { key: "cancellation" | "refund" | "booking" | "privacy"; title: string }[] = [
    { key: "booking", title: c.booking }, { key: "cancellation", title: c.cancellation }, { key: "refund", title: c.refund }, { key: "privacy", title: c.privacy },
  ];

  const start = async () => {
    if (!state.acceptedTerms) { setTermsError(true); setAttempt((n) => n + 1); return; }
    setTermsError(false);
    const mine = ++token.current;
    setHandoff("preparing");
    try {
      const r = await prepareCheckoutHandoff({ packageId: pkg.id, locale });
      if (mine !== token.current) return; // cancelled while waiting
      if (!r.ok) { setHandoff(r.error.code === "not-enabled" ? "not-enabled" : "error"); return; }
      if (!safeDestination(r.value.checkoutUrl)) { setHandoff("error"); return; }
      markNavigated();
      if (r.value.checkoutUrl.startsWith("/")) router.push(r.value.checkoutUrl); // same-site (demo simulator)
      else window.location.assign(r.value.checkoutUrl); // provider's hosted checkout page
    } catch {
      if (mine === token.current) setHandoff("error");
    }
  };

  const busy = handoff === "preparing";
  return (
    <Container className="py-10 sm:py-14">
      <h2 id="checkout-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{c.title}</h2>
      <p className="mt-2 text-ink-muted">{c.intro}</p>
      <div className="mt-8"><ErrorSummary title={c.errorsTitle} attempt={attempt} items={termsError ? [{ key: "terms", text: c.acceptError, onSelect: () => document.getElementById("accept-terms")?.focus() }] : []} /></div>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <section aria-labelledby="summary-title">
          <h3 id="summary-title" className="mb-4 text-2xl text-navy-900">{c.summary}</h3>
          <BookingSummary ui={ui} locale={locale} pkg={pkg} slots={state.slots} isDemo={isDemo}>
            <div className="py-4">
              <dt className="flex items-center justify-between text-sm text-ink-muted"><span>{c.yourDetails}</span>
                <button type="button" onClick={() => { markNavigated(); router.push(routes.bookingStep(locale, "details")); }} className="min-h-11 px-1 font-semibold text-gold-700 underline hover:text-navy-900">{c.edit}<span className="sr-only"> {c.yourDetails}</span></button>
              </dt>
              <dd className="mt-1 text-navy-900"><span className="text-sm text-ink-muted">{c.name}: </span>{state.details.fullName}</dd>
              <dd className="mt-1 text-navy-900"><span className="text-sm text-ink-muted">{c.email}: </span><span dir="ltr" className="inline-block">{state.details.email}</span></dd>
            </div>
          </BookingSummary>
          <p className="mt-3 text-sm text-ink-muted">{c.localNote}</p>
        </section>

        <section aria-labelledby="terms-title">
          <h3 id="terms-title" className="mb-4 text-2xl text-navy-900">{c.termsTitle}</h3>
          <div className="divide-y divide-ivory-300 border border-ivory-300 bg-ivory-50">
            {terms.map((t) => (
              <details key={t.key} className="group p-4">
                <summary className="flex min-h-11 cursor-pointer items-center font-medium text-navy-900">{t.title}</summary>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{bk.terms[t.key] ?? c.termsPending}</p>
              </details>
            ))}
          </div>

          <label className="mt-6 flex min-h-12 cursor-pointer items-start gap-3 border border-ivory-300 bg-ivory-50 p-4 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400">
            <input id="accept-terms" type="checkbox" checked={state.acceptedTerms} aria-required="true" aria-invalid={termsError || undefined} aria-describedby={termsError ? "terms-error" : undefined}
              onChange={(e) => { bookingStore.setAcceptedTerms(e.target.checked); if (e.target.checked) setTermsError(false); }} className="mt-1 size-5 shrink-0 accent-navy-900" />
            <span>{bk.terms.booking && bk.terms.cancellation && bk.terms.refund ? c.accept : c.acceptPlaceholder}</span>
          </label>
          {termsError && <p id="terms-error" className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{c.acceptError}</p>}

          <div className="mt-6 space-y-1 border-s-2 border-gold-500 ps-3 text-sm text-ink-muted">
            <p>{c.hosted}</p>
            <p className="font-medium text-navy-900">{c.noCard}</p>
          </div>

          <div className="mt-6" aria-live="polite">
            {busy && <p role="status" className="mb-3 flex items-center gap-3 text-navy-900"><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />{c.preparing}</p>}
            {handoff === "error" && <p role="alert" className="mb-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{c.handoffError}</p>}
            {handoff === "not-enabled" && <p role="alert" className="mb-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{c.notEnabled}</p>}
            {handoff === "cancelled" && <p role="status" className="mb-3 border-s-4 border-gold-700 bg-ivory-200 p-3 text-sm font-medium text-navy-950">{c.cancelledPreparing}</p>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button type="button" className={btnPrimary} disabled={busy} aria-busy={busy} onClick={() => void start()}>
              {handoff === "error" || handoff === "cancelled" ? c.retry : c.continue}
            </button>
            {busy && <button type="button" className={btnOutline} onClick={() => { token.current++; setHandoff("cancelled"); }}>{c.cancelPreparing}</button>}
          </div>
        </section>
      </div>

      <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" className={btnOutline} onClick={() => { markNavigated(); router.push(routes.bookingStep(locale, "details")); }}>{c.back}</button>
        <button type="button" className={btnOutline} onClick={() => { bookingStore.reset(); markNavigated(); router.push(routes.booking(locale)); }}>{c.startOver}</button>
      </div>
    </Container>
  );
}
