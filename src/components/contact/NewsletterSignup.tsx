"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { subscribeNewsletter } from "@/contact/actions.ts";
import { checkSubscriberEmail } from "@/contact/rules.ts";
import type { ContactUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";

type Phase = "form" | "sending" | "subscribed" | "pending" | "demo" | "failed";
interface Props {
  mode: "live" | "demo" | "unavailable";
  ui: ContactUi;
  locale: Locale;
  /** Approved wording, or null: a visibly marked DRAFT wording is shown instead. */
  consentText: string | null;
  variant: "footer" | "section";
}

/**
 * Reusable newsletter signup. Its consent checkbox is separate from, and never implied by, any enquiry consent, and is
 * never pre-checked. "live" calls the server action (approved config + installed provider); "demo" is a CLIENT-ONLY preview
 * that sends nothing; "unavailable" shows nothing in the footer and a short notice elsewhere (no data can be entered).
 */
export function NewsletterSignup({ mode, ui, locale, consentText, variant }: Props) {
  const n = ui.newsletter;
  const uid = useId();
  const id = (s: string) => `${uid}-${s}`;
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false); // never pre-checked
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});
  const [phase, setPhase] = useState<Phase>("form");
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const dark = variant === "footer";

  if (mode === "unavailable") {
    return dark ? null : <p className="max-w-xl border border-dashed border-ivory-300 p-4 text-sm text-ink-muted">{n.unavailable}</p>;
  }

  const submit = async () => {
    const e = checkSubscriberEmail(email);
    const emailMsg = e === "required" ? n.errors.emailRequired : e === "too-long" ? n.errors.emailTooLong : e ? n.errors.emailInvalid : undefined;
    const consentMsg = consent ? undefined : n.errors.consent;
    setErrors({ email: emailMsg, consent: consentMsg });
    if (emailMsg) { emailRef.current?.focus(); return; }
    if (consentMsg) { consentRef.current?.focus(); return; }
    setPhase("sending");
    if (mode === "demo") { // client-only preview: no network request, nothing stored or logged
      window.setTimeout(() => { setEmail(""); setConsent(false); setPhase("demo"); }, 600);
      return;
    }
    try {
      const r = await subscribeNewsletter({ email, locale, consent, hp });
      if (r.ok) { setEmail(""); setConsent(false); setPhase(r.value.status === "pending-confirmation" ? "pending" : "subscribed"); return; }
      setPhase("failed");
    } catch {
      setPhase("failed");
    }
  };

  const text = dark ? "text-ivory-50" : "text-navy-900";
  const muted = dark ? "text-navy-300" : "text-ink-muted";
  const field = dark ? "border-ivory-50/30 bg-navy-900 text-ivory-50 placeholder:text-navy-300" : "border-ivory-300 bg-ivory-50 text-ink";
  const errCls = dark ? "border-s-4 border-gold-300 bg-navy-900 p-2 text-sm font-medium text-gold-300" : "border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700";
  const Wrapper = variant === "section" ? "section" : "div";
  const done = phase === "subscribed" || phase === "pending" || phase === "demo";

  return (
    // Only the in-page block is a labelled region; the footer copy is a plain div so landmark names stay unique.
    <Wrapper {...(variant === "section" ? { "aria-labelledby": id("title") } : {})} className={variant === "section" ? "max-w-2xl border border-gold-500 bg-ivory-50 p-6 sm:p-8" : ""}>
      <h2 id={id("title")} className={`${dark ? "eyebrow text-gold-400" : "text-2xl"} ${dark ? "" : text}`}>{n.title}</h2>
      <p className={`mt-2 text-sm ${muted}`}>{n.intro}</p>

      {mode === "demo" && <p role="note" className={`mt-3 border border-dashed p-2 text-xs font-semibold ${dark ? "border-gold-400 text-gold-300" : "border-gold-700 bg-gold-300/30 text-navy-950"}`}>{ui.demo.banner}</p>}

      {done ? (
        <p role="status" className={`mt-4 border-s-4 p-3 text-sm font-medium ${dark ? "border-gold-400 text-ivory-50" : "border-gold-700 bg-ivory-200 text-navy-950"}`}>
          {phase === "subscribed" ? n.subscribed : phase === "pending" ? n.pending : n.demoSuccess}
        </p>
      ) : (
        <form noValidate className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          <div>
            <label htmlFor={id("email")} className={`block text-sm font-medium ${text}`}>{n.email}</label>
            <input ref={emailRef} id={id("email")} name="email" type="email" dir="ltr" autoComplete="email" value={email} aria-required="true" aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? id("email-error") : undefined}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((x) => ({ ...x, email: undefined })); }} className={`mt-1 block min-h-12 w-full border px-3 py-2 text-base ${field}`} />
            {errors.email && <p id={id("email-error")} className={`mt-2 ${errCls}`}>{errors.email}</p>}
          </div>
          <div>
            <label className="flex min-h-12 cursor-pointer items-start gap-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400">
              <input ref={consentRef} id={id("consent")} type="checkbox" checked={consent} aria-required="true" aria-invalid={errors.consent ? true : undefined} aria-describedby={errors.consent ? id("consent-error") : undefined}
                onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setErrors((x) => ({ ...x, consent: undefined })); }} className="mt-1 size-5 shrink-0 accent-gold-400" />
              <span className={`text-sm ${dark ? "text-ivory-50/90" : "text-ink"}`}>{consentText ?? n.consentDraft}</span>
            </label>
            {!consentText && <p className={`mt-1 border-s-2 ps-2 text-xs font-medium ${dark ? "border-gold-400 text-gold-300" : "border-gold-700 text-gold-700"}`}>{n.draftMarker}</p>}
            {errors.consent && <p id={id("consent-error")} className={`mt-2 ${errCls}`}>{errors.consent}</p>}
            <p className="mt-1"><Link href={routes.privacy(locale)} className={`inline-flex min-h-11 items-center text-xs font-semibold underline ${dark ? "text-gold-300 hover:text-ivory-50" : "text-gold-700 hover:text-navy-900"}`}>{n.privacyLink}</Link></p>
          </div>
          {/* Honeypot: invisible and inert for people and assistive technology; bots that fill it are rejected. */}
          <div aria-hidden="true" inert className="absolute -start-[9999px] top-0 h-0 w-0 overflow-hidden"><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label></div>
          {phase === "failed" && <p role="alert" className={errCls}>{n.failed}</p>}
          <button type="submit" disabled={phase === "sending"} aria-busy={phase === "sending"} className="inline-flex min-h-12 items-center justify-center bg-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-300 disabled:opacity-60">
            {phase === "sending" ? n.sending : phase === "failed" ? n.retry : n.submit}
          </button>
        </form>
      )}
    </Wrapper>
  );
}
