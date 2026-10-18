"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { checkEmail } from "@/shop/rules.ts";
import type { ShopUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ErrorSummary, type ErrorItem } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const input = "mt-2 block min-h-12 w-full border border-ivory-300 bg-ivory-50 px-3 py-2 text-base text-ink";

/**
 * Request a new download link. In this stage no email service exists: only the development demo shows a simulated result
 * (entirely client-side: no network request, nothing stored). The response is deliberately neutral so it can never reveal
 * whether an order exists.
 */
export function ResendForm({ ui, locale, isDemo }: { ui: ShopUi; locale: Locale; isDemo: boolean }) {
  const r = ui.resend;
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState("");
  const [errors, setErrors] = useState<{ email?: "required" | "invalid" | "too-long"; order?: boolean }>({});
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus({ preventScroll: true }); }, []);

  const emailMsg = errors.email === "required" ? r.errors.emailRequired : errors.email ? r.errors.emailInvalid : "";
  const items: ErrorItem[] = [
    ...(errors.email ? [{ key: "email", text: emailMsg, onSelect: () => document.getElementById("resend-email")?.focus() }] : []),
    ...(errors.order ? [{ key: "order", text: r.errors.orderRequired, onSelect: () => document.getElementById("resend-order")?.focus() }] : []),
  ];

  const submit = () => {
    const e = { email: checkEmail(email) ?? undefined, order: !order.trim() };
    setErrors({ email: e.email, order: e.order || undefined });
    if (e.email || e.order) { setAttempt((n) => n + 1); return; }
    setPhase("sending");
    window.setTimeout(() => setPhase("done"), 700); // simulated only: nothing is sent or stored
  };

  if (!isDemo) {
    return <Container className="py-10 sm:py-14"><p className="max-w-xl border border-dashed border-ivory-300 p-6 text-ink-muted">{r.notEnabled}</p></Container>;
  }
  const err = (id: string, text: string) => <p id={id} className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{text}</p>;

  return (
    <Container className="py-10 sm:py-14">
      <h2 id="resend-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{r.title}</h2>
      <p className="mt-2 max-w-2xl text-ink-muted">{r.intro}</p>

      {phase === "done" ? (
        <div role="status" className="mt-8 max-w-2xl border-2 border-gold-500 bg-ivory-50 p-6">
          <h3 className="text-2xl text-navy-900">{r.resultTitle}</h3>
          <p className="mt-2 text-ink-muted">{r.neutral}</p>
          <p className="mt-3 border-s-2 border-gold-700 ps-3 text-sm font-medium text-gold-700">{r.demoNote}</p>
          <p className="mt-6"><Link href={routes.shop(locale)} className={`${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`}>{r.back}</Link></p>
        </div>
      ) : (
        <>
          <div className="mt-8"><ErrorSummary title={r.errors.title} hint={r.errors.hint} items={items} attempt={attempt} /></div>
          <form noValidate aria-labelledby="resend-title" className="max-w-2xl space-y-6" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <div>
              <label htmlFor="resend-email" className="block text-lg font-medium text-navy-900">{r.email}</label>
              <input id="resend-email" type="email" dir="ltr" autoComplete="email" value={email} aria-required="true" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? "resend-email-error" : undefined}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }} className={input} />
              {errors.email && err("resend-email-error", emailMsg)}
            </div>
            <div>
              <label htmlFor="resend-order" className="block text-lg font-medium text-navy-900">{r.order}</label>
              <p id="resend-order-help" className="mt-1 text-sm text-ink-muted">{r.orderHelp}</p>
              <input id="resend-order" type="text" dir="ltr" autoComplete="off" value={order} aria-required="true" aria-invalid={errors.order ? true : undefined} aria-describedby={`resend-order-help${errors.order ? " resend-order-error" : ""}`}
                onChange={(e) => { setOrder(e.target.value); if (errors.order) setErrors((x) => ({ ...x, order: undefined })); }} className={input} />
              {errors.order && err("resend-order-error", r.errors.orderRequired)}
            </div>
            <button type="submit" disabled={phase === "sending"} aria-busy={phase === "sending"} className={`${btn} bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:opacity-60`}>{phase === "sending" ? r.sending : r.submit}</button>
          </form>
        </>
      )}
    </Container>
  );
}
