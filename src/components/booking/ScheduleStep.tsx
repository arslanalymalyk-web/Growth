"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchAvailability } from "@/booking/actions.ts";
import { addMonths, dayKey, formatDateTime, formatDayLong, formatTime, groupSlotsByDay, monthKey, monthOf, monthRange, type MonthRef, timeZoneLabel } from "@/booking/calendar.ts";
import { checkSelection, sessionsToSchedule } from "@/booking/rules.ts";
import { bookingStore } from "@/booking/store.ts";
import type { LocalizedBooking, Slot } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import { ErrorSummary } from "../ui/ErrorSummary";
import { Container } from "../ui/Section";
import { CalendarPicker } from "./CalendarPicker";
import { StepGuard } from "./StepGuard";
import { focusHeadingAfterNavigation, markNavigated, useBooking } from "./useBooking";

type Month = { status: "loading" | "ok" | "error"; slots: Slot[] };
const btn = "inline-flex min-h-12 items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide transition-colors";
const btnPrimary = `${btn} bg-gold-400 text-navy-950 hover:bg-gold-300`;
const btnOutline = `${btn} border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50`;

export function ScheduleStep(props: { bk: LocalizedBooking; ui: BookingUi; locale: Locale }) {
  const state = useBooking();
  const pkg = props.bk.packages.find((p) => p.id === state.packageId);
  if (!pkg) return <StepGuard ui={props.ui} locale={props.locale} />;
  return <ScheduleInner key={pkg.id} {...props} pkgId={pkg.id} />;
}

function ScheduleInner({ bk, ui, locale, pkgId }: { bk: LocalizedBooking; ui: BookingUi; locale: Locale; pkgId: string }) {
  const router = useRouter();
  const state = useBooking();
  const s = ui.schedule;
  const pkg = bk.packages.find((p) => p.id === pkgId)!;
  const count = sessionsToSchedule(pkg, bk.bundlePolicy);
  const name = useCallback((i: number) => (count > 1 ? fill(s.sessionOf, { n: i + 1, total: count }) : fill(ui.checkout.session, { n: 1 })), [count, s.sessionOf, ui.checkout.session]);

  const [today, setToday] = useState<string | null>(null);
  const [month, setMonth] = useState<MonthRef | null>(null);
  const [avail, setAvail] = useState<Record<string, Month>>({});
  const [active, setActive] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [live, setLive] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const requested = useRef<Set<string>>(new Set());

  // Client-only "today" (display zone) avoids server/client date mismatch.
  useEffect(() => {
    const t = dayKey(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client initialisation
    setToday(t); setMonth(monthOf(t));
    return focusHeadingAfterNavigation(headingRef);
  }, []);

  const load = useCallback(async (m: MonthRef) => {
    const k = monthKey(m);
    requested.current.add(k);
    setAvail((a) => ({ ...a, [k]: { status: "loading", slots: [] } }));
    const { from, to } = monthRange(m);
    try {
      const r = await fetchAvailability({ packageId: pkgId, fromDate: from, toDate: to });
      setAvail((a) => ({ ...a, [k]: r.ok ? { status: "ok", slots: r.value } : { status: "error", slots: [] } }));
    } catch {
      setAvail((a) => ({ ...a, [k]: { status: "error", slots: [] } }));
    }
  }, [pkgId]);

  useEffect(() => {
    if (month && !requested.current.has(monthKey(month))) void load(month);
  }, [month, load]);

  const mk = month ? monthKey(month) : "";
  const cur = avail[mk];
  const byDay = useMemo(() => groupSlotsByDay(cur?.slots ?? []), [cur]);
  const daySlots = selectedDay ? byDay[selectedDay] ?? [] : [];
  const chosen = state.slots;
  const errs = useMemo(() => checkSelection(count, chosen), [count, chosen]);
  const messageFor = (e: { index: number; code: "missing" | "duplicate" | "order" }) => fill(s.errors[e.code], { session: name(e.index) });
  const liveErrors = errs.filter((e) => e.code !== "missing" || attempt > 0);
  const canPrev = month && today ? monthKey(month) > monthKey(monthOf(today)) : false;

  const pick = (slot: Slot) => {
    bookingStore.setSlot(active, slot);
    const when = formatDateTime(slot.startsAt, locale);
    const advance = active < count - 1 && !chosen[active + 1];
    setLive(`${fill(s.selectedAnnounce, { session: name(active), when })}${advance ? ` ${fill(s.nowChoosing, { session: name(active + 1) })}` : ""}`);
    if (advance) { setActive(active + 1); setSelectedDay(null); }
  };

  const onContinue = () => {
    setAttempt((n) => n + 1);
    if (checkSelection(count, chosen).length) return;
    markNavigated();
    router.push(routes.bookingStep(locale, "details"));
  };

  const focusSession = (i: number) => { setActive(i); setSelectedDay(null); document.getElementById("calendar-region")?.scrollIntoView({ block: "start" }); headingRef.current?.focus(); };

  return (
    <Container className="py-10 sm:py-14">
      <h2 id="schedule-title" ref={headingRef} tabIndex={-1} className="text-3xl text-navy-900 outline-none sm:text-4xl">{s.title}</h2>
      <p className="mt-2 text-ink-muted">{s.intro}</p>
      <p className="mt-2 text-sm font-medium text-navy-900">{fill(s.tz, { tz: `\u2068${timeZoneLabel(locale)}\u2069` })}</p>
      {bk.bundlePolicy === "select-first-now" && pkg.kind === "bundle" && <p className="mt-2 border-s-2 border-gold-500 ps-3 text-sm text-ink-muted">{fill(s.firstOnly, { n: pkg.sessions - 1 })}</p>}

      <div className="mt-8">
        <ErrorSummary
          title={s.errors.title}
          hint={s.errors.hint}
          attempt={attempt}
          items={attempt > 0 ? errs.map((e) => ({ key: `${e.index}-${e.code}`, text: messageFor(e), onSelect: () => focusSession(e.index) })) : []}
        />
      </div>

      <p className="sr-only" role="status" aria-live="polite">{live}</p>

      {count > 1 && (
        <ol aria-label={s.times24} className="mb-8 grid gap-3 md:grid-cols-3">
          {Array.from({ length: count }, (_, i) => {
            const sl = chosen[i];
            const rowErr = liveErrors.find((e) => e.index === i && e.code !== "missing");
            return (
              <li key={i} aria-current={i === active ? "true" : undefined} className={`flex flex-col gap-2 border p-4 ${i === active ? "border-navy-900 bg-ivory-200" : "border-ivory-300 bg-ivory-50"}`}>
                <span className="text-sm font-semibold text-navy-900">{name(i)}</span>
                <span className={sl ? "text-ink" : "italic text-ink-muted"}>{sl ? formatDateTime(sl.startsAt, locale) : s.notSelected}</span>
                {rowErr && <span className="text-sm font-medium text-alert-700">{messageFor(rowErr)}</span>}
                <button type="button" onClick={() => focusSession(i)} className="mt-1 min-h-11 self-start px-1 text-sm font-semibold text-gold-700 underline hover:text-navy-900">
                  {sl ? s.change : s.choose}<span className="sr-only"> {name(i)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
      {count === 1 && chosen[0] && <p className="mb-6 border-s-2 border-gold-500 ps-3 text-navy-900">{formatDateTime(chosen[0].startsAt, locale)}</p>}
      {count === 1 && liveErrors.filter((e) => e.code !== "missing").map((e) => <p key={e.code} className="mb-4 text-sm font-medium text-alert-700">{messageFor(e)}</p>)}

      <section id="calendar-region" aria-labelledby="calendar-heading" className="scroll-mt-24">
        <h3 id="calendar-heading" className="mb-4 text-2xl text-navy-900">{fill(s.chooseFor, { session: name(active) })}</h3>

        {!month || !today ? (
          <p role="status" className="border border-ivory-300 p-5 text-ink-muted">{s.loading}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <CalendarPicker
                month={month}
                weekStartsOn={bk.weekStartsOn}
                slotsByDay={byDay}
                selectedDay={selectedDay}
                today={today}
                loading={cur?.status === "loading" || !cur}
                locale={locale}
                ui={s}
                canPrev={canPrev}
                onSelectDay={setSelectedDay}
                onMonth={(d) => { setSelectedDay(null); setMonth((m) => addMonths(m!, d)); }}
              />
              {(cur?.status === "loading" || !cur) && <p role="status" className="mt-3 text-sm text-ink-muted">{s.loading}</p>}
              {cur?.status === "error" && (
                <div role="alert" className="mt-3 flex flex-wrap items-center gap-3 border-s-4 border-alert-700 bg-alert-100 p-3 text-sm font-medium text-alert-700">
                  <span>{s.loadError}</span>
                  <button type="button" onClick={() => void load(month)} className="min-h-11 border border-alert-700 px-4 text-alert-700 hover:bg-alert-700 hover:text-ivory-50">{s.retry}</button>
                </div>
              )}
              {cur?.status === "ok" && cur.slots.length === 0 && <p className="mt-3 text-sm text-ink-muted">{s.noDays}</p>}
            </div>

            <div>
              {selectedDay ? (
                <fieldset>
                  <legend className="text-xl text-navy-900">{fill(s.times, { date: formatDayLong(selectedDay, locale) })}</legend>
                  <p className="mt-1 text-xs text-ink-muted"><span dir="ltr" className="inline-block">{timeZoneLabel(locale)}</span></p>
                  {daySlots.length === 0 ? <p className="mt-3 text-ink-muted">{s.noTimes}</p> : (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {daySlots.map((sl) => {
                        const on = chosen[active]?.id === sl.id;
                        return (
                          <label key={sl.id} className="relative">
                            <input type="radio" name="slot" value={sl.id} checked={on} onChange={() => pick(sl)} className="peer sr-only" />
                            <span className="flex min-h-12 cursor-pointer items-center justify-center border border-ivory-300 bg-ivory-50 px-2 text-center text-base font-semibold text-navy-900 transition-colors hover:border-gold-500 peer-checked:border-navy-900 peer-checked:bg-navy-900 peer-checked:text-ivory-50 peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-gold-400">
                              <span dir="ltr">{formatTime(sl.startsAt, locale)}</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </fieldset>
              ) : (
                <p className="border border-dashed border-ivory-300 p-5 text-ink-muted">{s.pickDay}</p>
              )}
            </div>
          </div>
        )}
      </section>

      <div className="mt-12 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" className={btnOutline} onClick={() => { markNavigated(); router.push(routes.booking(locale)); }}>{s.back}</button>
        <button type="button" className={btnPrimary} onClick={onContinue}>{s.continue}</button>
      </div>
    </Container>
  );
}
