"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { checkDetails, checkSelection, fieldsFor, sessionsToSchedule, type DetailError } from "@/booking/rules.ts";
import { bookingStore } from "@/booking/store.ts";
import type { LField, LocalizedBooking } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ErrorSummary, type ErrorItem } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";
import { StepGuard } from "./StepGuard";
import { focusHeadingAfterNavigation, markNavigated, useBooking } from "./useBooking";

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
const input = "mt-2 block min-h-12 w-full border border-ivory-300 bg-ivory-50 px-3 py-2 text-base text-ink";

export function DetailsStep({ bk, ui, locale }: { bk: LocalizedBooking; ui: BookingUi; locale: Locale }) {
  const state = useBooking();
  const router = useRouter();
  const pkg = bk.packages.find((p) => p.id === state.packageId);
  const d = ui.details;
  const [errors, setErrors] = useState<DetailError[]>([]);
  const [consentError, setConsentError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => focusHeadingAfterNavigation(headingRef), []);

  const complete = pkg ? checkSelection(sessionsToSchedule(pkg, bk.bundlePolicy), state.slots).length === 0 : false;
  if (!pkg || !complete) return <StepGuard ui={ui} locale={locale} />;

  const fields = fieldsFor<LField>(bk.fields, pkg.kind);
  const msg = (e: DetailError) => (e.code === "required" ? d.errors.required : e.code === "invalid" ? d.errors.invalid : d.errors.tooLong);
  const focusField = (id: string) => document.getElementById(`f-${id}`)?.focus();

  const onSubmit = () => {
    const errs = checkDetails(fields, state.details);
    const noConsent = !state.consentProcessing;
    setErrors(errs); setConsentError(noConsent); setAttempt((n) => n + 1);
    if (errs.length || noConsent) return;
    markNavigated();
    router.push(routes.bookingStep(locale, "checkout"));
  };

  const items: ErrorItem[] = [
    ...errors.map((e) => ({ key: e.fieldId, text: `${fields.find((f) => f.id === e.fieldId)!.label}: ${msg(e)}`, onSelect: () => focusField(e.fieldId) })),
    ...(consentError ? [{ key: "consent", text: d.errors.consent, onSelect: () => document.getElementById("consent-processing")?.focus() }] : []),
  ];

  return (
    <Container className="py-10 sm:py-14">
      <h2 id="details-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{d.title}</h2>
      <p className="mt-2 text-ink-muted">{d.intro}</p>
      <p className="mt-2 text-sm text-ink-muted">{d.localNote}</p>
      <div className="mt-8"><ErrorSummary title={d.errors.title} hint={d.errors.hint} items={items} attempt={attempt} /></div>

      <form noValidate onSubmit={(e) => { e.preventDefault(); onSubmit(); }} aria-labelledby="details-title" className="max-w-2xl">
        <div className="space-y-6">
          {fields.map((f) => {
            const err = errors.find((e) => e.fieldId === f.id);
            const value = state.details[f.id] ?? "";
            const describedBy = [f.help ? `f-${f.id}-help` : "", err ? `f-${f.id}-error` : "", f.type === "textarea" ? `f-${f.id}-count` : ""].filter(Boolean).join(" ") || undefined;
            const common = {
              id: `f-${f.id}`, name: f.id, value, "aria-required": f.required, "aria-invalid": err ? true : undefined, "aria-describedby": describedBy, autoComplete: f.autocomplete,
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { bookingStore.setDetail(f.id, e.target.value); if (err) setErrors((es) => es.filter((x) => x.fieldId !== f.id)); },
            };
            return (
              <div key={f.id}>
                <label htmlFor={`f-${f.id}`} className="block text-lg font-medium text-navy-900">
                  {f.label}
                  <span className={`ms-2 inline-block border px-1.5 py-0.5 align-middle text-xs font-semibold ${f.required ? "border-navy-900 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>{f.required ? d.required : d.optional}</span>
                </label>
                {f.help && <p id={`f-${f.id}-help`} className="mt-1 text-sm text-ink-muted">{f.help}</p>}
                {f.type === "textarea" ? (
                  <textarea {...common} rows={4} className={`${input} min-h-28`} />
                ) : (
                  <input {...common} type={f.type} dir={f.type === "email" || f.type === "tel" ? "ltr" : undefined} className={input} />
                )}
                {f.type === "textarea" && <p id={`f-${f.id}-count`} className={`mt-1 text-xs ${value.length > f.maxLength ? "font-semibold text-alert-700" : "text-ink-muted"}`}>{value.length} / {f.maxLength}</p>}
                {err && <p id={`f-${f.id}-error`} className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{msg(err)}</p>}
              </div>
            );
          })}
        </div>

        <fieldset className="mt-10 border border-ivory-300 bg-ivory-50 p-5">
          <legend className="px-2 text-xl text-navy-900">{d.consentTitle}</legend>
          <label className="flex min-h-12 cursor-pointer items-start gap-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400">
            <input id="consent-processing" type="checkbox" checked={state.consentProcessing} aria-required="true" aria-invalid={consentError || undefined} aria-describedby={consentError ? "consent-error" : undefined}
              onChange={(e) => { bookingStore.setConsentProcessing(e.target.checked); if (e.target.checked) setConsentError(false); }} className="mt-1 size-5 shrink-0 accent-navy-900" />
            <span><span className="me-2 border border-navy-900 px-1.5 py-0.5 text-xs font-semibold text-navy-900">{d.required}</span>{bk.terms.processingConsent ?? d.consentPlaceholder}</span>
          </label>
          {consentError && <p id="consent-error" className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{d.errors.consent}</p>}
          <p className="mt-3 text-sm text-ink-muted">{bk.terms.privacy ?? d.privacyPending}</p>
        </fieldset>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button type="button" className={btnOutline} onClick={() => { markNavigated(); router.push(routes.bookingStep(locale, "schedule")); }}>{d.back}</button>
          <button type="submit" className={btnPrimary}>{d.continue}</button>
        </div>
      </form>
    </Container>
  );
}
