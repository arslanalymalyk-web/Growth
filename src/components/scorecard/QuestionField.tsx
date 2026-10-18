"use client";

import type { ScorecardUi } from "@/content/types";
import { fill } from "@/i18n/format";
import type { AnswerValue, LQuestion } from "@/scorecard/types.ts";

interface Props {
  q: LQuestion;
  index: number;
  value: AnswerValue | undefined;
  error: string | null;
  ui: ScorecardUi["assessment"];
  onChange: (value: AnswerValue | undefined) => void;
}

const card =
  "flex min-h-12 cursor-pointer items-start gap-3 border bg-ivory-50 p-4 transition-colors has-[:checked]:border-navy-900 has-[:checked]:bg-ivory-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400 border-ivory-300 hover:border-gold-500";

/** One question. Native radios/checkboxes/textarea for keyboard and screen-reader support; logical (RTL-safe) spacing. */
export function QuestionField({ q, index, value, error, ui, onChange }: Props) {
  const base = `q-${q.id}`;
  const helpId = q.help ? `${base}-help` : undefined;
  const errId = error ? `${base}-error` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;
  const tag = (
    <span className={`ms-2 inline-block border px-1.5 py-0.5 align-middle text-xs font-semibold ${q.required ? "border-navy-900 text-navy-900" : "border-ivory-300 text-ink-muted"}`}>
      {q.required ? ui.required : ui.optional}
    </span>
  );
  const prompt = (
    <>
      <span className="me-2 text-gold-700" aria-hidden="true">{index}.</span>{q.prompt}{tag}
    </>
  );
  const message = error ? (
    <p id={errId} className="mt-3 flex gap-2 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">
      <span aria-hidden="true">!</span><span>{error}</span>
    </p>
  ) : null;
  const help = q.help ? <p id={helpId} className="mt-2 text-sm text-ink-muted">{q.help}</p> : null;

  if (q.type === "text") {
    const text = typeof value === "string" ? value : "";
    const countId = `${base}-count`;
    return (
      <div data-q={q.id} id={base} className="scroll-mt-24">
        <label htmlFor={`${base}-field`} className="block text-xl font-medium text-navy-900">{prompt}</label>
        {help}
        <textarea
          id={`${base}-field`}
          rows={4}
          value={text}
          placeholder={q.placeholder}
          aria-required={q.required}
          aria-invalid={error ? true : undefined}
          aria-describedby={[describedBy, countId].filter(Boolean).join(" ")}
          onChange={(e) => onChange(e.target.value === "" ? undefined : e.target.value)}
          className="mt-3 block w-full border border-ivory-300 bg-ivory-50 p-3 text-base text-ink"
        />
        <p id={countId} className={`mt-1 text-xs ${text.length > q.maxLength ? "font-semibold text-alert-700" : "text-ink-muted"}`}>{fill(ui.charsLeft, { n: q.maxLength - text.length })}</p>
        {message}
      </div>
    );
  }

  if (q.type === "scale") {
    const values: number[] = [];
    for (let v = q.scale.min; v <= q.scale.max; v++) values.push(v);
    return (
      <fieldset data-q={q.id} id={base} aria-describedby={describedBy} className="scroll-mt-24">
        <legend className="text-xl font-medium text-navy-900">{prompt}</legend>
        {help}
        <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": values.length } as React.CSSProperties}>
          {values.map((v) => (
            <label key={v} className="relative">
              <input type="radio" name={base} value={v} checked={value === v} onChange={() => onChange(v)} className="peer sr-only" />
              <span className="flex min-h-12 cursor-pointer items-center justify-center border border-ivory-300 bg-ivory-50 text-lg font-semibold text-navy-900 transition-colors hover:border-gold-500 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-ivory-50 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-gold-400">{v}</span>
            </label>
          ))}
        </div>
        <div className="mt-2 flex justify-between gap-4 text-xs text-ink-muted">
          <span>{q.scale.min} = {q.scale.minLabel}</span>
          <span className="text-end">{q.scale.max} = {q.scale.maxLabel}</span>
        </div>
        {message}
      </fieldset>
    );
  }

  const multiple = q.type === "multiple";
  const selected = multiple ? (Array.isArray(value) ? value : []) : value;
  return (
    <fieldset data-q={q.id} id={base} aria-describedby={describedBy} className="scroll-mt-24">
      <legend className="text-xl font-medium text-navy-900">{prompt}</legend>
      {help}
      <div className="mt-4 grid gap-3">
        {q.options.map((o) => {
          const checked = multiple ? (selected as string[]).includes(o.id) : selected === o.id;
          return (
            <label key={o.id} className={card}>
              <input
                type={multiple ? "checkbox" : "radio"}
                name={base}
                value={o.id}
                checked={checked}
                onChange={() => {
                  if (!multiple) return onChange(o.id);
                  const cur = selected as string[];
                  const next = cur.includes(o.id) ? cur.filter((x) => x !== o.id) : [...cur, o.id];
                  onChange(next.length ? next : undefined);
                }}
                className="mt-0.5 size-5 shrink-0 accent-navy-900"
              />
              <span className="text-base text-ink">{o.label}</span>
            </label>
          );
        })}
      </div>
      {message}
    </fieldset>
  );
}
