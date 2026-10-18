"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, formatDay, formatDayLong, formatMonthTitle, monthGrid, monthKey, type MonthRef, weekdayHeadings } from "@/booking/calendar.ts";
import type { Slot } from "@/booking/types.ts";
import type { BookingUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { fill } from "@/i18n/format";
import { ArrowIcon } from "../ui/Icons";

interface Props {
  month: MonthRef;
  weekStartsOn: 0 | 1 | 6;
  slotsByDay: Record<string, Slot[]>;
  selectedDay: string | null;
  today: string;
  loading: boolean;
  locale: Locale;
  ui: BookingUi["schedule"];
  canPrev: boolean;
  onSelectDay: (key: string) => void;
  onMonth: (delta: number) => void;
}

const nav = "inline-flex size-11 items-center justify-center border border-ivory-300 bg-ivory-50 text-navy-900 hover:border-gold-500 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Month calendar following the ARIA grid pattern: one tab stop (roving tabindex), arrow keys move by day/week (mirrored
 * in RTL), Home/End go to the week start/end, PageUp/PageDown change month. Days without times stay focusable but are
 * announced as unavailable.
 */
export function CalendarPicker({ month, weekStartsOn, slotsByDay, selectedDay, today, loading, locale, ui, canPrev, onSelectDay, onMonth }: Props) {
  const weeks = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const heads = useMemo(() => weekdayHeadings(weekStartsOn, locale), [weekStartsOn, locale]);
  const inMonth = useMemo(() => weeks.flat().filter((c) => c.inMonth).map((c) => c.key), [weeks]);
  const firstAvailable = inMonth.find((k) => slotsByDay[k]?.length);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const moved = useRef(false);
  const rtl = locale === "ar";
  const title = formatMonthTitle(month, locale);
  const activeKey = focusKey && inMonth.includes(focusKey) ? focusKey : selectedDay && inMonth.includes(selectedDay) ? selectedDay : (firstAvailable ?? inMonth[0]);

  useEffect(() => {
    if (!moved.current || !focusKey) return;
    moved.current = false;
    document.querySelector<HTMLButtonElement>(`[data-day="${focusKey}"]`)?.focus();
  }, [focusKey, month]);

  const go = (key: string) => { if (inMonth.includes(key)) { moved.current = true; setFocusKey(key); } };
  const onKeyDown = (e: React.KeyboardEvent, key: string) => {
    const row = weeks.find((w) => w.some((c) => c.key === key))!.filter((c) => c.inMonth);
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); go(addDays(key, rtl ? -1 : 1)); break;
      case "ArrowLeft": e.preventDefault(); go(addDays(key, rtl ? 1 : -1)); break;
      case "ArrowDown": e.preventDefault(); go(addDays(key, 7)); break;
      case "ArrowUp": e.preventDefault(); go(addDays(key, -7)); break;
      case "Home": e.preventDefault(); go(row[0].key); break;
      case "End": e.preventDefault(); go(row[row.length - 1].key); break;
      case "PageDown": e.preventDefault(); onMonth(1); break;
      case "PageUp": if (canPrev) { e.preventDefault(); onMonth(-1); } break;
    }
  };

  return (
    <div aria-busy={loading} className="border border-ivory-300 bg-ivory-50 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className={nav} onClick={() => onMonth(-1)} disabled={!canPrev} aria-label={ui.prevMonth}><ArrowIcon className="size-5 rotate-180" /></button>
        <h3 id={`cal-${monthKey(month)}`} className="text-center font-display text-2xl text-navy-900" aria-live="polite">{title}</h3>
        <button type="button" className={nav} onClick={() => onMonth(1)} aria-label={ui.nextMonth}><ArrowIcon className="size-5" /></button>
      </div>
      <table role="grid" aria-labelledby={`cal-${monthKey(month)}`} className="mt-4 w-full table-fixed border-separate border-spacing-1">
        <thead>
          <tr>
            {heads.map((h) => <th key={h.long} scope="col" abbr={h.long} className="pb-1 text-center text-xs font-semibold text-ink-muted"><span aria-hidden="true" className="sm:hidden">{h.narrow}</span><span aria-hidden="true" className="hidden sm:inline">{h.short}</span><span className="sr-only">{h.long}</span></th>)}
          </tr>
        </thead>
        <tbody>
          {weeks.map((w, wi) => (
            <tr key={wi}>
              {w.map((cell) => {
                if (!cell.inMonth) return <td key={cell.key} role="gridcell" aria-hidden="true" />;
                const n = slotsByDay[cell.key]?.length ?? 0;
                const isToday = cell.key === today;
                const selected = cell.key === selectedDay;
                const label = `${formatDayLong(cell.key, locale)}${isToday ? `, ${ui.today}` : ""}, ${n ? fill(ui.timesAvailable, { n }) : ui.unavailableDay}`;
                return (
                  <td key={cell.key} role="gridcell" className="p-0 text-center">
                    <button
                      type="button"
                      data-day={cell.key}
                      tabIndex={cell.key === activeKey ? 0 : -1}
                      aria-label={label}
                      aria-pressed={selected}
                      aria-disabled={n === 0 || loading ? true : undefined}
                      onKeyDown={(e) => onKeyDown(e, cell.key)}
                      onClick={() => { setFocusKey(cell.key); if (n > 0 && !loading) onSelectDay(cell.key); }}
                      className={`flex min-h-11 w-full items-center justify-center border text-base transition-colors ${selected ? "border-navy-900 bg-navy-900 font-semibold text-ivory-50" : n > 0 && !loading ? "border-gold-500 bg-ivory-50 font-semibold text-navy-900 hover:bg-ivory-200" : "cursor-not-allowed border-transparent text-ink-muted/70"} ${isToday && !selected ? "underline decoration-gold-500 decoration-2 underline-offset-4" : ""}`}
                    >
                      {formatDay(cell.day, locale)}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
