"use client";

import { useEffect, useRef } from "react";

export interface ErrorItem { key: string; text: string; onSelect?: () => void }

/** Error summary (WCAG-friendly): takes focus when `attempt` changes, and each item moves focus to its field. */
export function ErrorSummary({ title, hint, items, attempt, id = "error-summary" }: { title: string; hint?: string; items: ErrorItem[]; attempt: number; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (attempt > 0) ref.current?.focus(); }, [attempt]);
  if (items.length === 0) return null;
  return (
    <div ref={ref} role="alert" tabIndex={-1} id={id} className="mb-8 border-2 border-alert-700 bg-alert-100 p-5">
      <h2 className="text-xl font-semibold text-alert-700">{title}</h2>
      {hint && <p className="mt-1 text-sm text-ink">{hint}</p>}
      <ul className="mt-3 list-disc space-y-2 ps-5">
        {items.map((it) => (
          <li key={it.key}>
            {it.onSelect ? (
              <button type="button" className="inline-flex min-h-11 items-center text-start font-medium text-alert-700 underline" onClick={it.onSelect}>{it.text}</button>
            ) : (
              <span className="font-medium text-alert-700">{it.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
