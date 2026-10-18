"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { submitEnquiry } from "@/contact/actions.ts";
import { checkEnquiry, fieldsOnStep, TOPIC_GENERAL, type FieldError } from "@/contact/rules.ts";
import type { EnquiryStep, LEnquiryField } from "@/contact/types.ts";
import type { ContactUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import { ErrorSummary, type ErrorItem } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";

type StepId = EnquiryStep | "review";
type Phase = "form" | "sending" | "sent" | "demo-sent" | "failed";
const ORDER: StepId[] = ["about", "enquiry", "review"];

interface Props {
  fields: LEnquiryField[];
  topics: { id: string; label: string }[];
  /** Approved consent wording, or null: a visibly marked DRAFT wording is shown instead. */
  consentText: string | null;
  topicsForValidation: string[];
  ui: ContactUi;
  locale: Locale;
  /** "demo" is a client-only preview: nothing is sent to any server. */
  mode: "live" | "demo";
  /** Render without its own page container (used inside the contact page card). */
  embedded?: boolean;
}

function FormShell({ embedded, children }: { embedded: boolean; children: React.ReactNode }) {
  return embedded ? <div>{children}</div> : <Container className="py-10 sm:py-14">{children}</Container>;
}

const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
const input = "mt-2 block min-h-12 w-full border border-ivory-300 bg-ivory-50 px-3 py-2 text-base text-ink";

/**
 * Three-step enquiry: About you, Your enquiry, Review. Collects only what is needed to respond. In "live" mode (approved
 * config + installed CRM) it calls the server action; in "demo" mode it is a CLIENT-ONLY preview that sends, stores and logs
 * nothing and says so. Entered details are cleared from memory once sent.
 */
export function EnquiryForm({ fields, topics, consentText, topicsForValidation, ui, locale, mode, embedded = false }: Props) {
  const [step, setStep] = useState<StepId>("about");
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false); // never pre-checked
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [consentError, setConsentError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusHeading = useRef(false);

  useEffect(() => {
    if (focusHeading.current) { focusHeading.current = false; headingRef.current?.focus(); }
  }, [step, phase]);
  useEffect(() => { if (phase === "sent" || phase === "demo-sent" || phase === "failed") resultRef.current?.focus(); }, [phase]);

  const idx = ORDER.indexOf(step);
  const labelOf = (id: string) => ui.fieldLabels[id as keyof typeof ui.fieldLabels] ?? id;
  const msg = (e: FieldError) => (e.code === "required" ? ui.errors.required : e.code === "too-short" ? ui.errors.tooShort : e.code === "too-long" ? ui.errors.tooLong : ui.errors.invalid);
  const errFor = (id: string) => errors.find((e) => e.fieldId === id);
  const goto = (s: StepId) => { focusHeading.current = true; setErrors([]); setConsentError(false); setStep(s); };

  const items: ErrorItem[] = [
    ...errors.map((e) => ({ key: e.fieldId, text: `${labelOf(e.fieldId)}: ${msg(e)}`, onSelect: () => document.getElementById(`enq-${e.fieldId}`)?.focus() })),
    ...(consentError ? [{ key: "consent", text: ui.errors.consent, onSelect: () => document.getElementById("enq-consent")?.focus() }] : []),
  ];

  const onContinue = () => {
    const stepFields = fieldsOnStep(fields, step);
    const errs = checkEnquiry(stepFields, values, topicsForValidation);
    setErrors(errs); setAttempt((n) => n + 1);
    if (errs.length === 0) goto(ORDER[idx + 1]);
  };

  const onSend = async () => {
    const errs = checkEnquiry(fields, values, topicsForValidation);
    setErrors(errs); setConsentError(!consent); setAttempt((n) => n + 1);
    if (errs.length) { goto(errs[0] && fields.find((f) => f.id === errs[0].fieldId)?.step === "enquiry" ? "enquiry" : "about"); setErrors(errs); return; }
    if (!consent) return;
    setPhase("sending");
    if (mode === "demo") { // client-only preview: no network request, nothing stored or logged
      window.setTimeout(() => { setValues({}); setConsent(false); setPhase("demo-sent"); }, 700);
      return;
    }
    try {
      const r = await submitEnquiry({ values, locale, consent, hp });
      if (r.ok) { setValues({}); setConsent(false); setPhase("sent"); return; }
      if (r.code === "invalid" && r.fieldErrors?.length) { setErrors(r.fieldErrors); focusHeading.current = true; setStep(fields.find((f) => f.id === r.fieldErrors![0].fieldId)?.step === "enquiry" ? "enquiry" : "about"); setPhase("form"); setAttempt((n) => n + 1); return; }
      setPhase("failed");
    } catch {
      setPhase("failed");
    }
  };

  const restart = () => { setValues({}); setConsent(false); setErrors([]); setConsentError(false); focusHeading.current = true; setStep("about"); setPhase("form"); };

  if (phase === "sent" || phase === "demo-sent") {
    const demo = phase === "demo-sent";
    const c = demo ? ui.demoSuccess : ui.success;
    return (
      <FormShell embedded={embedded}>
        <div ref={resultRef} tabIndex={-1} role="status" className="max-w-3xl border-2 border-gold-500 bg-ivory-50 p-6 outline-none sm:p-10">
          <div className="flex items-start gap-4">
            <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center border-2 border-gold-700 text-2xl font-bold text-gold-700">{demo ? "i" : "✓"}</span>
            <div>
              <h2 className="text-3xl text-navy-900 sm:text-4xl">{c.title}</h2>
              <p className="mt-3 text-lg text-ink-muted">{c.body}</p>
              {demo && <p className="mt-3 border-s-2 border-gold-700 ps-3 text-sm font-medium text-gold-700">{ui.demo.sent}</p>}
            </div>
          </div>
          <button type="button" className={`${btnOutline} mt-8`} onClick={restart}>{ui.buttons.newEnquiry}</button>
        </div>
      </FormShell>
    );
  }

  const stepFields = step === "review" ? [] : fieldsOnStep(fields, step);
  const sending = phase === "sending";
  const text = step === "review" ? ui.steps.review : ui.steps[step];

  const renderField = (f: LEnquiryField) => {
    const err = errFor(f.id);
    const value = values[f.id] ?? "";
    const describedBy = [f.help ? `enq-${f.id}-help` : "", err ? `enq-${f.id}-error` : "", f.type === "textarea" ? `enq-${f.id}-count` : ""].filter(Boolean).join(" ") || undefined;
    const common = {
      id: `enq-${f.id}`, name: f.id, value, "aria-required": f.required, "aria-invalid": err ? true : undefined, "aria-describedby": describedBy,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { setValues((v) => ({ ...v, [f.id]: e.target.value })); if (err) setErrors((es) => es.filter((x) => x.fieldId !== f.id)); },
    };
    return (
      <div key={f.id}>
        <label htmlFor={`enq-${f.id}`} className="block text-lg font-medium text-navy-900">
          {labelOf(f.id)}
          <span className={`ms-2 inline-block border px-1.5 py-0.5 align-middle text-xs font-semibold ${f.required ? "border-navy-900 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>{f.required ? ui.labels.required : ui.labels.optional}</span>
        </label>
        {f.help && <p id={`enq-${f.id}-help`} className="mt-1 text-sm text-ink-muted">{f.help}</p>}
        {f.type === "textarea" ? (
          <textarea {...common} rows={6} autoComplete={f.autocomplete} className={`${input} min-h-36`} />
        ) : f.type === "topic" ? (
          <select {...common} className={input}>
            <option value="">{ui.labels.topicPlaceholder}</option>
            <option value={TOPIC_GENERAL}>{ui.labels.topicGeneral}</option>
            {topics.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        ) : (
          <input {...common} type={f.type} autoComplete={f.autocomplete} dir={f.type === "email" ? "ltr" : undefined} className={input} />
        )}
        {f.type === "textarea" && <p id={`enq-${f.id}-count`} className={`mt-1 text-xs ${value.length > f.maxLength ? "font-semibold text-alert-700" : "text-ink-muted"}`}>{fill(ui.labels.count, { n: value.length, max: f.maxLength })}</p>}
        {err && <p id={`enq-${f.id}-error`} className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{msg(err)}</p>}
      </div>
    );
  };

  return (
    <FormShell embedded={embedded}>
      {mode === "demo" && <p role="note" className="mb-6 border border-dashed border-gold-700 bg-gold-300/30 p-3 text-sm font-semibold text-navy-950">{ui.demo.banner}</p>}
      <nav aria-label={ui.progress.label} className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold text-navy-900">{fill(ui.progress.stepOf, { current: idx + 1, total: ORDER.length, name: ui.progress.steps[step] })}</p>
        <div role="progressbar" aria-label={ui.progress.label} aria-valuemin={1} aria-valuemax={ORDER.length} aria-valuenow={idx + 1} aria-valuetext={ui.progress.steps[step]} className="mt-3 h-2 bg-ivory-300">
          <div className="h-full bg-gold-500" style={{ width: `${((idx + 1) / ORDER.length) * 100}%` }} />
        </div>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs">
          {ORDER.map((s, i) => (
            <li key={s} aria-current={i === idx ? "step" : undefined} className={`flex min-h-8 items-center gap-2 border px-2 ${i === idx ? "border-navy-900 bg-navy-900 text-ivory-50" : i < idx ? "border-gold-500 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>
              <span aria-hidden="true">{i + 1}</span><span className="hidden sm:inline">{ui.progress.steps[s]}</span><span className="sr-only sm:hidden">{ui.progress.steps[s]}</span>
            </li>
          ))}
        </ol>
      </nav>

      {phase === "failed" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="mb-8 max-w-3xl border-2 border-alert-700 bg-alert-100 p-5 outline-none">
          <h2 className="text-xl font-semibold text-alert-700">{ui.failure.title}</h2>
          <p className="mt-1 text-ink">{ui.failure.body}</p>
        </div>
      )}
      <div className="max-w-3xl"><ErrorSummary title={ui.errors.title} hint={ui.errors.hint} items={items} attempt={attempt} /></div>

      <form noValidate aria-labelledby="enquiry-step-title" className="max-w-3xl" onSubmit={(e) => { e.preventDefault(); if (step === "review") void onSend(); else onContinue(); }}>
        <h2 id="enquiry-step-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{text.title}</h2>
        <p className="mt-2 text-ink-muted">{text.intro}</p>

        {step !== "review" && <div className="mt-8 space-y-6">{stepFields.map(renderField)}</div>}

        {step === "review" && (
          <>
            <dl className="mt-8 divide-y divide-ivory-300 border border-ivory-300 bg-ivory-50 px-5">
              {fields.map((f) => {
                const raw = (values[f.id] ?? "").trim();
                const shown = f.type === "topic" && raw ? (raw === TOPIC_GENERAL ? ui.labels.topicGeneral : topics.find((t) => t.id === raw)?.label ?? raw) : raw;
                return (
                  <div key={f.id} className="py-4">
                    <dt className="flex items-center justify-between gap-3 text-sm text-ink-muted">
                      <span>{labelOf(f.id)}</span>
                      <button type="button" onClick={() => goto(f.step)} className="min-h-11 px-1 font-semibold text-gold-700 underline hover:text-navy-900">{ui.labels.edit}<span className="sr-only"> {labelOf(f.id)}</span></button>
                    </dt>
                    <dd className={`mt-1 whitespace-pre-line break-words ${shown ? "text-navy-900" : "italic text-ink-muted"}`} dir={f.type === "email" && shown ? "ltr" : undefined}>{shown || ui.labels.notProvided}</dd>
                  </div>
                );
              })}
            </dl>

            <fieldset className="mt-8 border border-ivory-300 bg-ivory-50 p-5">
              <legend className="px-2 text-xl text-navy-900">{ui.consent.title}</legend>
              <label className="flex min-h-12 cursor-pointer items-start gap-3 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400">
                <input id="enq-consent" type="checkbox" checked={consent} aria-required="true" aria-invalid={consentError || undefined} aria-describedby={`enq-consent-note${consentError ? " enq-consent-error" : ""}`}
                  onChange={(e) => { setConsent(e.target.checked); if (e.target.checked) setConsentError(false); }} className="mt-1 size-5 shrink-0 accent-navy-900" />
                <span><span className="me-2 border border-navy-900 px-1.5 py-0.5 text-xs font-semibold text-navy-900">{ui.labels.required}</span>{consentText ?? ui.consent.enquiryDraft}</span>
              </label>
              {!consentText && <p className="mt-2 border-s-2 border-gold-700 ps-2 text-sm font-medium text-gold-700">{ui.consent.draftMarker}</p>}
              {consentError && <p id="enq-consent-error" className="mt-2 border-s-4 border-alert-700 bg-alert-100 p-2 text-sm font-medium text-alert-700">{ui.errors.consent}</p>}
              <p id="enq-consent-note" className="mt-3 text-sm text-ink-muted">{ui.consent.separateNote}</p>
              <p className="mt-2 text-sm"><Link href={routes.privacy(locale)} className="inline-flex min-h-11 items-center font-semibold text-gold-700 underline hover:text-navy-900">{ui.consent.privacyLink}</Link></p>
            </fieldset>
            {/* Honeypot: invisible and inert for people and assistive technology; bots that fill it are rejected. */}
            <div aria-hidden="true" inert className="absolute -start-[9999px] top-0 h-0 w-0 overflow-hidden">
              <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
            </div>
          </>
        )}

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          {idx > 0 ? <button type="button" className={btnOutline} onClick={() => goto(ORDER[idx - 1])} disabled={sending}>{ui.buttons.back}</button> : <span />}
          <button type="submit" className={btnPrimary} disabled={sending} aria-busy={sending}>
            {step === "review" ? (sending ? ui.buttons.sending : phase === "failed" ? ui.buttons.retry : mode === "demo" ? ui.buttons.sendDemo : ui.buttons.send) : ui.buttons.continue}
          </button>
        </div>
        {sending && <p role="status" className="mt-4 flex items-center gap-3 text-navy-900"><span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />{ui.buttons.sending}</p>}
      </form>
    </FormShell>
  );
}
