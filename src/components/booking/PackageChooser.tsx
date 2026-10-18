"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/booking/rules.ts";
import { bookingStore } from "@/booking/store.ts";
import type { LocalizedBooking } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import { ErrorSummary } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";
import { markNavigated, useBooking } from "./useBooking";

const btnPrimary = "inline-flex min-h-12 items-center justify-center bg-gold-400 px-6 py-3 text-sm font-semibold tracking-wide text-navy-950 transition-colors hover:bg-gold-300";

export function PackageChooser({ bk, ui, locale, isDemo }: { bk: LocalizedBooking; ui: BookingUi; locale: Locale; isDemo: boolean }) {
  const router = useRouter();
  const state = useBooking();
  const [attempt, setAttempt] = useState(0);
  const selected = bk.packages.find((p) => p.id === state.packageId)?.id ?? null;
  const c = ui.choose;
  const legendRef = useRef<HTMLLegendElement>(null);
  useEffect(() => { /* keep for symmetry with other steps: no auto-focus on the first step */ }, []);

  const onContinue = () => {
    if (!selected) { setAttempt((n) => n + 1); return; }
    markNavigated();
    router.push(routes.bookingStep(locale, "schedule"));
  };

  return (
    <Container className="py-10 sm:py-14">
      <ErrorSummary
        title={ui.schedule.errors.title}
        attempt={attempt}
        items={attempt > 0 && !selected ? [{ key: "pkg", text: c.error, onSelect: () => document.querySelector<HTMLInputElement>('input[name="package"]')?.focus() }] : []}
      />
      <form noValidate onSubmit={(e) => { e.preventDefault(); onContinue(); }}>
        <fieldset aria-describedby="choose-note">
          <legend ref={legendRef} className="text-3xl text-navy-900 sm:text-4xl">{c.title}</legend>
          <p className="mt-2 text-ink-muted">{c.intro}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {bk.packages.map((p) => {
              const price = formatPrice(p.price, locale);
              const on = selected === p.id;
              return (
                <label key={p.id} className="flex cursor-pointer flex-col border border-ivory-300 bg-ivory-50 p-6 transition-colors hover:border-gold-500 has-[:checked]:border-navy-900 has-[:checked]:bg-ivory-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-400">
                  <span className="flex items-start gap-3">
                    <input type="radio" name="package" value={p.id} checked={on} onChange={() => bookingStore.selectPackage(p.id)} className="mt-1.5 size-5 shrink-0 accent-navy-900" />
                    <span>
                      <span className="block font-display text-2xl text-navy-900">{p.name}</span>
                      <span className="mt-1 block text-sm text-ink-muted">{p.summary}</span>
                    </span>
                  </span>
                  <span className="mt-5 block space-y-1 border-t border-ivory-300 pt-4 text-sm">
                    <span className="block font-medium text-navy-900">{p.sessions === 1 ? c.singleSession : fill(c.sessions, { n: p.sessions })}</span>
                    <span className="block text-ink">{p.durationMinutes ? fill(c.duration, { n: p.durationMinutes }) : c.durationTbc}{p.durationMinutes && isDemo ? ` (${ui.demo.duration})` : ""}</span>
                    <span className="block text-lg font-semibold text-navy-900">{price ? <span dir="ltr" className="inline-block">{price}</span> : c.priceTbc}</span>
                    {price && isDemo && <span className="block border-s-2 border-gold-700 ps-2 text-xs font-medium text-gold-700">{ui.demo.price}</span>}
                  </span>
                  <span className="mt-4 text-xs font-semibold text-gold-700" aria-hidden="true">{on ? c.selected : c.select}</span>
                </label>
              );
            })}
          </div>
          <p id="choose-note" className="mt-5 text-sm text-ink-muted">{c.noReserve}</p>
        </fieldset>
        <div className="mt-10 flex justify-end"><button type="submit" className={btnPrimary}>{c.continue}</button></div>
      </form>
    </Container>
  );
}
