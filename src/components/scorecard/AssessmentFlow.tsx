"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ScorecardUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import { checkAnswers, type AnswerError } from "@/scorecard/answers.ts";
import { scorecardStore } from "@/scorecard/store.ts";
import type { AnswerValue, LQuestion, LocalizedScorecard } from "@/scorecard/types.ts";
import { Container } from "../ui/Section";
import { QuestionField } from "./QuestionField";
import { useScorecard } from "./useScorecard";

interface Props { sc: LocalizedScorecard; ui: ScorecardUi; locale: Locale }

const listFormat = (locale: Locale) => (locale === "ar" ? "، " : ", ");

function answerText(q: LQuestion, v: AnswerValue | undefined, locale: Locale): string | null {
  if (v === undefined || v === "" || (Array.isArray(v) && v.length === 0)) return null;
  if (q.type === "single") return q.options.find((o) => o.id === v)?.label ?? null;
  if (q.type === "multiple") return (v as string[]).map((id) => q.options.find((o) => o.id === id)?.label ?? id).join(listFormat(locale));
  if (q.type === "scale") return `${v} / ${q.scale.max}`;
  return String(v);
}

export function AssessmentFlow({ sc, ui, locale }: Props) {
  const router = useRouter();
  const state = useScorecard();
  const a = ui.assessment;
  const total = sc.sections.length;
  const step = Math.min(state.step, total); // index `total` is the review step
  const onReview = step === total;

  const [errors, setErrors] = useState<AnswerError[]>([]);
  const [consentError, setConsentError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pendingFocus = useRef<string | null>(null);
  const first = useRef(true);

  // Move focus to the step heading after navigating between steps (not on first paint).
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (pendingFocus.current) {
      const el = document.querySelector<HTMLElement>(`[data-q="${pendingFocus.current}"] input, [data-q="${pendingFocus.current}"] textarea`);
      pendingFocus.current = null;
      if (el) { el.focus(); return; }
    }
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  // Move focus to the error summary when a validation attempt fails.
  useEffect(() => { if (attempt > 0) summaryRef.current?.focus(); }, [attempt]);

  const sectionQuestions = (i: number) => sc.questions.filter((q) => q.sectionId === sc.sections[i]?.id);
  const goto = (i: number, focusQuestion?: string) => {
    setErrors([]); setConsentError(false);
    pendingFocus.current = focusQuestion ?? null;
    scorecardStore.setStep(i);
  };

  const messageFor = (e: AnswerError): string => {
    const q = sc.questions.find((x) => x.id === e.questionId)!;
    if (e.code === "required") return q.type === "multiple" ? a.errors.requiredMulti : q.type === "text" ? a.errors.requiredText : a.errors.required;
    return e.code === "too-long" ? a.errors.tooLong : a.errors.invalid;
  };
  const errorFor = (id: string) => { const e = errors.find((x) => x.questionId === id); return e ? messageFor(e) : null; };

  const onContinue = () => {
    const errs = checkAnswers(sectionQuestions(step), state.answers);
    if (errs.length) { setErrors(errs); setAttempt((n) => n + 1); return; }
    goto(step + 1);
  };

  const onComplete = () => {
    const errs = checkAnswers(sc.questions, state.answers);
    const consentMissing = !state.consent.processing;
    if (errs.length || consentMissing) { setErrors(errs); setConsentError(consentMissing); setAttempt((n) => n + 1); return; }
    scorecardStore.complete();
    router.push(routes.scorecardResults(locale));
  };

  const progressText = onReview ? a.reviewStep : fill(a.sectionOf, { current: step + 1, total });
  const section = sc.sections[step];
  const questions = onReview ? [] : sectionQuestions(step);
  const firstIndex = onReview ? 0 : sc.questions.filter((q) => sc.sections.findIndex((s) => s.id === q.sectionId) < step).length;

  const summary = (errors.length > 0 || consentError) && (
    <div ref={summaryRef} role="alert" tabIndex={-1} className="mb-8 border-2 border-alert-700 bg-alert-100 p-5" id="error-summary">
      <h2 className="text-xl font-semibold text-alert-700">{a.errors.summaryTitle}</h2>
      <p className="mt-1 text-sm text-ink">{onReview && errors.length ? a.errors.fixAnswers : a.errors.summaryHint}</p>
      <ul className="mt-3 list-disc space-y-2 ps-5">
        {errors.map((e) => {
          const q = sc.questions.find((x) => x.id === e.questionId)!;
          const qi = sc.sections.findIndex((s) => s.id === q.sectionId);
          return (
            <li key={e.questionId}>
              {onReview ? (
                <button type="button" className="text-start font-medium text-alert-700 underline" onClick={() => goto(qi, q.id)}>{q.prompt}: {messageFor(e)}</button>
              ) : (
                <a href={`#q-${q.id}`} className="font-medium text-alert-700 underline" onClick={(ev) => { ev.preventDefault(); document.querySelector<HTMLElement>(`[data-q="${q.id}"] input, [data-q="${q.id}"] textarea`)?.focus(); }}>{q.prompt}: {messageFor(e)}</a>
              )}
            </li>
          );
        })}
        {consentError && onReview && (
          <li><a href="#consent-processing" className="font-medium text-alert-700 underline" onClick={(ev) => { ev.preventDefault(); document.getElementById("consent-processing")?.focus(); }}>{a.errors.consentRequired}</a></li>
        )}
      </ul>
    </div>
  );

  return (
    <Container className="py-10 sm:py-14">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold text-navy-900" id="progress-label">{a.progressLabel}: {progressText}</p>
          <p className="text-sm text-ink-muted">{fill(a.time, { n: sc.estimatedMinutes })}</p>
        </div>
        <div role="progressbar" aria-labelledby="progress-label" aria-valuemin={1} aria-valuemax={total + 1} aria-valuenow={step + 1} aria-valuetext={progressText} className="mt-3 h-2 bg-ivory-300">
          <div className="h-full bg-gold-500 transition-all" style={{ width: `${((step + 1) / (total + 1)) * 100}%` }} />
        </div>
        <ol className="mt-4 flex flex-wrap gap-2 text-xs" aria-label={a.progressLabel}>
          {[...sc.sections.map((s) => s.title), a.reviewStep].map((title, i) => (
            <li key={i} aria-current={i === step ? "step" : undefined} className={`flex min-h-8 items-center gap-2 border px-2 ${i === step ? "border-navy-900 bg-navy-900 text-ivory-50" : i < step ? "border-gold-500 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>
              <span aria-hidden="true">{i + 1}</span><span className="hidden sm:inline">{title}</span><span className="sr-only sm:hidden">{title}</span>
            </li>
          ))}
        </ol>
      </div>

      {step === 0 && !onReview && (
        <section aria-labelledby="instructions-title" className="mb-8 border border-gold-500 bg-ivory-50 p-5 sm:p-6">
          <h2 id="instructions-title" className="text-xl text-navy-900">{a.instructionsTitle}</h2>
          <p className="mt-1 text-sm font-medium text-gold-700">{fill(a.time, { n: sc.estimatedMinutes })}</p>
          <ul className="mt-3 list-disc space-y-1 ps-5 text-ink-muted">{a.instructions.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="mt-3 text-sm text-ink-muted">{a.review.localNote}</p>
        </section>
      )}

      {summary}

      {!onReview && section && (
        <form noValidate onSubmit={(e) => { e.preventDefault(); onContinue(); }} aria-labelledby="step-title">
          <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{section.title}</h2>
          {section.intro && <p className="mt-2 text-ink-muted">{section.intro}</p>}
          <div className="mt-8 space-y-10">
            {questions.map((q, i) => (
              <QuestionField
                key={q.id}
                q={q}
                index={firstIndex + i + 1}
                value={state.answers[q.id]}
                error={errorFor(q.id)}
                ui={a}
                onChange={(v) => { scorecardStore.setAnswer(q.id, v); if (errors.length) setErrors((es) => es.filter((e) => e.questionId !== q.id)); }}
              />
            ))}
          </div>
          <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            {step === 0 ? (
              <Link href={routes.scorecard(locale)} className={btnOutline}>{a.back}</Link>
            ) : (
              <button type="button" className={btnOutline} onClick={() => goto(step - 1)}>{a.back}</button>
            )}
            <button type="submit" className={btnPrimary}>{step === total - 1 ? a.reviewAnswers : a.continue}</button>
          </div>
        </form>
      )}

      {onReview && (
        <form noValidate onSubmit={(e) => { e.preventDefault(); onComplete(); }} aria-labelledby="step-title">
          <h2 id="step-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{a.review.title}</h2>
          <p className="mt-2 text-ink-muted">{a.review.intro}</p>
          <div className="mt-8 space-y-8">
            {sc.sections.map((s, si) => (
              <section key={s.id} aria-labelledby={`review-${s.id}`} className="border border-ivory-300 bg-ivory-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 id={`review-${s.id}`} className="text-2xl text-navy-900">{s.title}</h3>
                  <button type="button" onClick={() => goto(si)} className="min-h-11 shrink-0 px-2 text-sm font-semibold text-gold-700 underline hover:text-navy-900">
                    {a.review.change}<span className="sr-only"> {s.title}</span>
                  </button>
                </div>
                <dl className="mt-3 divide-y divide-ivory-300">
                  {sc.questions.filter((q) => q.sectionId === s.id).map((q) => {
                    const t = answerText(q, state.answers[q.id], locale);
                    const bad = errors.some((e) => e.questionId === q.id);
                    return (
                      <div key={q.id} className="py-3">
                        <dt className="text-sm text-ink-muted">{q.prompt}</dt>
                        <dd className={`mt-1 ${t ? "text-ink" : bad ? "font-semibold text-alert-700" : "italic text-ink-muted"}`}>{t ?? a.review.notAnswered}</dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            ))}
          </div>

          <fieldset className="mt-10 border border-ivory-300 bg-ivory-50 p-5">
            <legend className="px-2 text-xl text-navy-900">{a.review.consentTitle}</legend>
            <div className="space-y-4">
              <label className={card}>
                <input id="consent-processing" type="checkbox" checked={state.consent.processing} aria-required="true" aria-invalid={consentError || undefined} aria-describedby={consentError ? "consent-error" : undefined} onChange={(e) => { scorecardStore.setConsent("processing", e.target.checked); if (e.target.checked) setConsentError(false); }} className="mt-0.5 size-5 shrink-0 accent-navy-900" />
                <span><span className="me-2 border border-navy-900 px-1.5 py-0.5 text-xs font-semibold text-navy-900">{a.review.processingLabel}</span>{sc.consent.processing ?? a.review.processingPlaceholder}</span>
              </label>
              {consentError && <p id="consent-error" className="border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">{a.errors.consentRequired}</p>}
              <label className={card}>
                <input id="consent-newsletter" type="checkbox" checked={state.consent.newsletter} onChange={(e) => scorecardStore.setConsent("newsletter", e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-navy-900" />
                <span><span className="me-2 border border-ivory-300 px-1.5 py-0.5 text-xs font-semibold text-ink-muted">{a.review.newsletterLabel}</span>{sc.consent.newsletter ?? a.review.newsletterPlaceholder}</span>
              </label>
            </div>
            <p className="mt-4 text-sm text-ink-muted">{a.review.privacyPending}</p>
          </fieldset>

          <p className="mt-4 text-sm text-ink-muted">{a.review.localNote}</p>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button type="button" className={btnOutline} onClick={() => goto(total - 1)}>{a.back}</button>
            <button type="submit" className={btnPrimary}>{a.review.complete}</button>
          </div>
        </form>
      )}
    </Container>
  );
}

const btnBase = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btnBase} bg-gold-400 text-navy-950 hover:bg-gold-300`;
const btnOutline = `${btnBase} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;
const card = "flex min-h-12 cursor-pointer items-start gap-3 border border-ivory-300 bg-ivory-50 p-4 hover:border-gold-500 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400";
