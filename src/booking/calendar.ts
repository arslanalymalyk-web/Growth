import { DISPLAY_TIME_ZONE, type Locale, type Slot } from "./types.ts";

const TZ = DISPLAY_TIME_ZONE;
/** Arabic uses the Gregorian calendar explicitly (ar-SA defaults to Hijri) and Latin digits, matching the rest of the Arabic site. */
const tag = (l: Locale) => (l === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB");
const DAY_MS = 86_400_000;

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
/** YYYY-MM-DD of an instant in the display time zone (Asia/Riyadh). */
export const dayKey = (iso: string | Date): string => dayFmt.format(typeof iso === "string" ? new Date(iso) : iso);

/** Calendar dates are handled as UTC midnights representing a calendar date; no local-zone arithmetic. */
const toUtc = (key: string): Date => new Date(`${key}T00:00:00Z`);
const toKey = (d: Date): string => d.toISOString().slice(0, 10);
export const addDays = (key: string, n: number): string => toKey(new Date(toUtc(key).getTime() + n * DAY_MS));

export interface MonthRef { year: number; month: number } // month: 0 to 11
export const monthOf = (key: string): MonthRef => ({ year: Number(key.slice(0, 4)), month: Number(key.slice(5, 7)) - 1 });
export const addMonths = (m: MonthRef, delta: number): MonthRef => {
  const t = m.year * 12 + m.month + delta;
  return { year: Math.floor(t / 12), month: ((t % 12) + 12) % 12 };
};
export const monthKey = (m: MonthRef): string => `${m.year}-${String(m.month + 1).padStart(2, "0")}`;
export const monthRange = (m: MonthRef): { from: string; to: string } => {
  const from = `${monthKey(m)}-01`;
  const next = addMonths(m, 1);
  return { from, to: addDays(`${monthKey(next)}-01`, -1) };
};

export interface Cell { key: string; day: number; inMonth: boolean }
/** Weeks of a month grid, starting on `weekStartsOn` (0 = Sunday). Always full weeks. */
export function monthGrid(m: MonthRef, weekStartsOn: 0 | 1 | 6): Cell[][] {
  const first = `${monthKey(m)}-01`;
  const offset = (toUtc(first).getUTCDay() - weekStartsOn + 7) % 7;
  const { to } = monthRange(m);
  const lastOffset = (weekStartsOn + 6 - toUtc(to).getUTCDay() + 7) % 7; // days needed to finish the final week
  const start = addDays(first, -offset);
  const total = offset + (Number(to.slice(8)) ) + lastOffset;
  const weeks: Cell[][] = [];
  for (let w = 0; w < total / 7; w++) {
    weeks.push(Array.from({ length: 7 }, (_, i) => {
      const key = addDays(start, w * 7 + i);
      return { key, day: Number(key.slice(8)), inMonth: key.startsWith(monthKey(m)) };
    }));
  }
  return weeks;
}

export function groupSlotsByDay(slots: Slot[]): Record<string, Slot[]> {
  const out: Record<string, Slot[]> = {};
  for (const s of [...slots].sort((a, b) => a.startsAt.localeCompare(b.startsAt))) (out[dayKey(s.startsAt)] ??= []).push(s);
  return out;
}

export const formatTime = (iso: string, l: Locale): string => new Intl.DateTimeFormat(tag(l), { timeZone: TZ, hour: "numeric", minute: "2-digit" }).format(new Date(iso));
export const formatDayLong = (key: string, l: Locale): string => new Intl.DateTimeFormat(tag(l), { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(toUtc(key));
export const formatDayShort = (key: string, l: Locale): string => new Intl.DateTimeFormat(tag(l), { timeZone: "UTC", day: "numeric", month: "short" }).format(toUtc(key));
export const formatMonthTitle = (m: MonthRef, l: Locale): string => new Intl.DateTimeFormat(tag(l), { timeZone: "UTC", month: "long", year: "numeric" }).format(toUtc(`${monthKey(m)}-01`));
export const formatDateTime = (iso: string, l: Locale): string => `${formatDayLong(dayKey(iso), l)}${l === "ar" ? "، " : ", "}${formatTime(iso, l)}`;
export const formatDay = (n: number, l: Locale): string => new Intl.NumberFormat(tag(l)).format(n);

/** Weekday headings in grid order. */
export function weekdayHeadings(weekStartsOn: 0 | 1 | 6, l: Locale): { narrow: string; short: string; long: string }[] {
  // 2023-01-01 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => {
    const key = addDays("2023-01-01", (weekStartsOn + i) % 7);
    const f = (weekday: "narrow" | "short" | "long") => new Intl.DateTimeFormat(tag(l), { timeZone: "UTC", weekday }).format(toUtc(key));
    return { narrow: f("narrow"), short: f("short"), long: f("long") };
  });
}

/** e.g. "Asia/Riyadh (GMT+3)". The offset is read from the platform time zone database, not hard-coded. */
export function timeZoneLabel(l: Locale, at: Date = new Date()): string {
  const part = new Intl.DateTimeFormat(tag(l), { timeZone: TZ, timeZoneName: "short" }).formatToParts(at).find((p) => p.type === "timeZoneName");
  return `${TZ} (${part?.value ?? ""})`.replace(" ()", "");
}
