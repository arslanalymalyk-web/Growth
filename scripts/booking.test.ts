// Run with: npm run test:booking (Node's built-in test runner; no extra dependencies).
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { fetchAvailability, prepareCheckoutHandoff } from "../src/booking/actions.ts";
import { addDays, addMonths, dayKey, groupSlotsByDay, monthGrid, monthOf, monthRange, timeZoneLabel } from "../src/booking/calendar.ts";
import { realBooking } from "../src/booking/config.ts";
import { demoBooking, demoCalendar, demoPayment } from "../src/booking/demo.ts";
import { localizeBooking } from "../src/booking/localize.ts";
import { resolveBookingMode } from "../src/booking/mode.ts";
import { installedProviders } from "../src/booking/providers.ts";
import { checkDetails, checkSelection, deriveReturnState, fieldsFor, formatPrice, sessionsToSchedule } from "../src/booking/rules.ts";
import type { BookingConfig, BookingProviders } from "../src/booking/types.ts";
import { validateBookingConfig } from "../src/booking/validate.ts";

const clone = <T,>(v: T): T => structuredClone(v);
const codes = (c: BookingConfig) => new Set(validateBookingConfig(c).map((i) => i.code));
const txt = { en: "x", ar: "x" };

/** Complete config made ONLY for tests, to prove the validator and mode resolver can succeed. Never shipped. */
function approvedTestConfig(): BookingConfig {
  const c = clone(demoBooking);
  c.id = "test-only"; c.isDemo = false; c.status = "approved";
  c.review = { en: "approved", ar: "approved" };
  c.approval = { approvedBy: "Test Approver", approvedAt: "2000-01-01" };
  c.terms = { cancellation: txt, refund: txt, booking: txt, privacy: txt, processingConsent: txt };
  c.providers = { calendar: "test-cal", payment: "test-pay" };
  return c;
}
const stubProviders = (cal = "test-cal", pay = "test-pay"): BookingProviders => ({
  calendar: { ...demoCalendar, id: cal },
  payment: { ...demoPayment, id: pay },
});

test("the real configuration is a draft with no prices, durations, terms or providers", () => {
  assert.equal(realBooking.status, "draft");
  assert.equal(realBooking.packages.every((p) => p.price === null && p.durationMinutes === null), true);
  const c = codes(realBooking);
  for (const code of ["not-approved", "no-approval-record", "review-not-approved", "price-missing", "duration-missing", "bundle-policy-missing", "terms-missing", "calendar-provider-missing", "payment-provider-missing"]) {
    assert.ok(c.has(code), `expected ${code}`);
  }
  assert.deepEqual(installedProviders, { calendar: null, payment: null });
});

test("the demo fixture can never be live, even with providers installed", () => {
  assert.ok(codes(demoBooking).has("demo-fixture"));
  const r = resolveBookingMode({ nodeEnv: "production", demoFlag: "1", real: demoBooking, providers: stubProviders("demo-calendar", "demo-payment"), demo: null });
  assert.notEqual(r.mode, "live");
});

test("a complete approved config WITH matching providers is live; anything less is not", () => {
  const base = { nodeEnv: "production", demoFlag: undefined, demo: null } as const;
  assert.deepEqual(validateBookingConfig(approvedTestConfig()), []);
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: stubProviders() }).mode, "live");
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: { calendar: null, payment: null } }).mode, "opening-soon");
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: { ...stubProviders(), payment: null } }).mode, "opening-soon");
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: { ...stubProviders(), calendar: null } }).mode, "opening-soon");
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: stubProviders("other", "test-pay") }).mode, "opening-soon");
  assert.equal(resolveBookingMode({ ...base, real: approvedTestConfig(), providers: stubProviders("test-cal", "other") }).mode, "opening-soon");
});

test("each missing approval ingredient blocks activation", () => {
  const cases: [string, (c: BookingConfig) => void, string][] = [
    ["draft status", (c) => { c.status = "draft"; }, "not-approved"],
    ["no approval record", (c) => { c.approval = null; }, "no-approval-record"],
    ["arabic unreviewed", (c) => { c.review.ar = "needs-professional-review"; }, "review-not-approved"],
    ["no price", (c) => { c.packages[0].price = null; }, "price-missing"],
    ["float price", (c) => { c.packages[1].price = { amountMinor: 10.5, currency: "SAR" }; }, "price-invalid"],
    ["bad currency", (c) => { c.packages[1].price = { amountMinor: 1000, currency: "sar" }; }, "price-invalid"],
    ["no duration", (c) => { c.packages[0].durationMinutes = null; }, "duration-missing"],
    ["bundle with 1 session", (c) => { c.packages[1].sessions = 1; }, "bad-sessions"],
    ["no bundle package", (c) => { c.packages = c.packages.filter((p) => p.kind !== "bundle"); }, "package-missing"],
    ["undecided bundle policy", (c) => { c.bundlePolicy = null; }, "bundle-policy-missing"],
    ["missing cancellation terms", (c) => { c.terms.cancellation = null; }, "terms-missing"],
    ["missing refund terms", (c) => { c.terms.refund = null; }, "terms-missing"],
    ["terms missing arabic", (c) => { c.terms.booking = { en: "x", ar: "" }; }, "terms-missing"],
    ["no email field", (c) => { c.fields = c.fields.filter((f) => f.type !== "email"); }, "fields-missing"],
    ["no calendar provider", (c) => { c.providers.calendar = null; }, "calendar-provider-missing"],
    ["no payment provider", (c) => { c.providers.payment = null; }, "payment-provider-missing"],
    ["wrong time zone", (c) => { (c as { timeZone: string }).timeZone = "UTC"; }, "bad-time-zone"],
  ];
  for (const [name, mutate, code] of cases) {
    const c = approvedTestConfig();
    mutate(c);
    assert.ok(codes(c).has(code), `${name}: expected ${code}, got ${[...codes(c)].join(",")}`);
  }
});

test("demo mode only in development with BOOKING_DEMO=1; never in production", () => {
  const base = { real: realBooking, providers: installedProviders, demo: demoBooking };
  for (const [nodeEnv, flag] of [["production", undefined], ["production", "1"], ["test", "1"], [undefined, "1"], ["development", undefined], ["development", "0"]] as const) {
    assert.equal(resolveBookingMode({ ...base, nodeEnv, demoFlag: flag }).mode, "opening-soon", `${nodeEnv}/${flag}`);
  }
  assert.equal(resolveBookingMode({ ...base, nodeEnv: "development", demoFlag: "1" }).mode, "demo");
  assert.equal(resolveBookingMode({ ...base, demo: null, nodeEnv: "development", demoFlag: "1" }).mode, "opening-soon");
});

test("Asia/Riyadh day boundaries and month grids", () => {
  // 21:30 UTC on 1 Jan is 00:30 on 2 Jan in Riyadh (UTC+3).
  assert.equal(dayKey("2025-01-01T21:30:00Z"), "2025-01-02");
  assert.equal(dayKey("2025-01-01T20:59:00Z"), "2025-01-01");
  assert.equal(addDays("2025-01-31", 1), "2025-02-01");
  assert.deepEqual(addMonths({ year: 2025, month: 11 }, 1), { year: 2026, month: 0 });
  assert.deepEqual(addMonths({ year: 2025, month: 0 }, -1), { year: 2024, month: 11 });
  assert.deepEqual(monthRange({ year: 2024, month: 1 }), { from: "2024-02-01", to: "2024-02-29" });
  for (const ws of [0, 1, 6] as const) {
    const g = monthGrid({ year: 2025, month: 0 }, ws);
    assert.ok(g.every((w) => w.length === 7), `full weeks (ws=${ws})`);
    assert.equal(g.flat().filter((c) => c.inMonth).length, 31);
    assert.equal(new Date(`${g[0][0].key}T00:00:00Z`).getUTCDay(), ws, "first column is the configured week start");
  }
  assert.equal(monthGrid({ year: 2025, month: 0 }, 0)[0][3].key, "2025-01-01"); // Wed is the 4th column from Sunday
  const grouped = groupSlotsByDay([
    { id: "b", startsAt: "2025-01-01T21:30:00Z", endsAt: "2025-01-01T22:15:00Z" },
    { id: "a", startsAt: "2025-01-01T07:00:00Z", endsAt: "2025-01-01T07:45:00Z" },
  ]);
  assert.deepEqual(Object.keys(grouped), ["2025-01-01", "2025-01-02"]);
  assert.match(timeZoneLabel("en"), /^Asia\/Riyadh \(GMT\+3\)$/);
  assert.ok(monthOf("2025-03-09").month === 2);
});

test("selection rules: count, distinct, chronological, non-overlapping", () => {
  const s = (id: string, a: string, b: string) => ({ id, startsAt: a, endsAt: b });
  const one = s("1", "2025-02-02T07:00:00Z", "2025-02-02T07:45:00Z");
  const two = s("2", "2025-02-09T07:00:00Z", "2025-02-09T07:45:00Z");
  assert.deepEqual(checkSelection(1, [one]), []);
  assert.deepEqual(checkSelection(3, [one, two]).map((e) => `${e.index}:${e.code}`), ["2:missing"]);
  assert.deepEqual(checkSelection(2, [one, one]).map((e) => e.code), ["duplicate"]);
  assert.deepEqual(checkSelection(2, [two, one]).map((e) => e.code), ["order"]);
  assert.deepEqual(checkSelection(2, [one, s("3", "2025-02-02T07:30:00Z", "2025-02-02T08:15:00Z")]).map((e) => e.code), ["order"]);
  const bundle = { kind: "bundle", sessions: 3 } as const;
  assert.equal(sessionsToSchedule(bundle, "select-all-now"), 3);
  assert.equal(sessionsToSchedule(bundle, "select-first-now"), 1);
  assert.equal(sessionsToSchedule({ kind: "single", sessions: 1 }, "select-all-now"), 1);
});

test("details validation: only needed fields, required/invalid/too-long", () => {
  const fields = localizeBooking(demoBooking, "en").fields;
  assert.deepEqual(fieldsFor(fields, "single").map((f) => f.id), ["fullName", "email", "notes"]);
  assert.deepEqual(checkDetails(fields, {}).map((e) => `${e.fieldId}:${e.code}`), ["fullName:required", "email:required"]);
  assert.deepEqual(checkDetails(fields, { fullName: "  ", email: "a@b.co" }).map((e) => e.fieldId), ["fullName"]);
  assert.deepEqual(checkDetails(fields, { fullName: "A", email: "nope" }).map((e) => `${e.fieldId}:${e.code}`), ["email:invalid"]);
  assert.deepEqual(checkDetails(fields, { fullName: "A", email: "a@b.co", notes: "x".repeat(301) }).map((e) => e.code), ["too-long"]);
  assert.deepEqual(checkDetails(fields, { fullName: "A", email: "a@b.co" }), []);
  assert.ok(!fields.some((f) => /card|cvv|cvc|iban/i.test(f.id)), "no payment fields in details");
});

test("prices: null stays null (never invented); amounts format from minor units", () => {
  assert.equal(formatPrice(null, "en"), null);
  assert.equal(formatPrice(null, "ar"), null);
  assert.match(formatPrice({ amountMinor: 100000, currency: "XXX" }, "en")!, /XXX.*1,000\.00/);
});

test("return state: confirmation is NEVER shown without provider-verified payment", () => {
  for (const route of ["confirmation", "pending", "cancelled", "error"] as const) {
    assert.equal(deriveReturnState(route, "paid"), "confirmed");
    assert.equal(deriveReturnState(route, "pending"), "pending");
    assert.equal(deriveReturnState(route, "cancelled"), "cancelled");
    assert.equal(deriveReturnState(route, "expired"), "cancelled");
    assert.equal(deriveReturnState(route, "failed"), "error");
  }
  assert.equal(deriveReturnState("confirmation", "no-session"), "unverified");
  assert.equal(deriveReturnState("confirmation", "unknown"), "unverified");
  assert.equal(deriveReturnState("pending", "no-session"), "pending");
  assert.equal(deriveReturnState("cancelled", "unknown"), "cancelled");
  assert.equal(deriveReturnState("error", "no-session"), "error");
});

test("demo providers: slots are generated in Riyadh time; outcomes are decoded from the session id", async () => {
  const from = addDays(dayKey(new Date()), 1);
  const r = await demoCalendar.getAvailability({ packageId: "single", fromDate: from, toDate: addDays(from, 20), timeZone: "Asia/Riyadh" });
  assert.ok(r.ok && r.value.length > 0);
  if (r.ok) {
    for (const s of r.value) {
      assert.ok(s.endsAt > s.startsAt);
      const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Riyadh", hour: "numeric", hour12: false }).format(new Date(s.startsAt)));
      assert.ok([10, 11, 14, 15].includes(hour), `unexpected Riyadh hour ${hour}`);
    }
  }
  for (const o of ["paid", "pending", "cancelled", "expired", "failed"] as const) {
    const s = await demoPayment.getCheckoutStatus(`demo_${o}_1`);
    assert.deepEqual(s, { ok: true, value: o });
  }
  assert.deepEqual(await demoPayment.getCheckoutStatus("whatever"), { ok: true, value: "unknown" });
});

test("server actions refuse outside the development demo and carry no personal data", async () => {
  const env = { NODE_ENV: process.env.NODE_ENV, BOOKING_DEMO: process.env.BOOKING_DEMO };
  const set = (k: "NODE_ENV" | "BOOKING_DEMO", v: string | undefined) => { if (v === undefined) delete process.env[k]; else (process.env as Record<string, string>)[k] = v; };
  try {
    set("NODE_ENV", "production"); set("BOOKING_DEMO", "1");
    const q = { packageId: "single", fromDate: "2030-01-01", toDate: "2030-01-31" };
    assert.deepEqual(await fetchAvailability(q), { ok: false, error: { code: "unavailable", message: "Booking is not available." } });
    assert.equal((await prepareCheckoutHandoff({ packageId: "single", locale: "en" })).ok, false);

    set("NODE_ENV", "development"); set("BOOKING_DEMO", "1");
    assert.equal((await fetchAvailability({ ...q, packageId: "nope" })).ok, false, "unknown package rejected");
    assert.equal((await fetchAvailability({ ...q, fromDate: "bad" })).ok, false, "bad date rejected");
    assert.equal((await fetchAvailability({ packageId: "single", fromDate: "2030-01-01", toDate: "2031-01-01" })).ok, false, "range > 62 days rejected");
    const h = await prepareCheckoutHandoff({ packageId: "single", locale: "ar" });
    assert.ok(h.ok && h.value.checkoutUrl === "/ar/book-consultation/demo-checkout");
    assert.equal((await prepareCheckoutHandoff({ packageId: "zzz", locale: "en" })).ok, false);
  } finally { set("NODE_ENV", env.NODE_ENV); set("BOOKING_DEMO", env.BOOKING_DEMO); }
});

test("no raw card fields anywhere in the source (payment must use a hosted checkout)", () => {
  const banned = /cc-number|cc-csc|cc-exp|cardnumber|card[-_ ]?number|\bcvv\b|\bcvc\b|security code|autocomplete=["']cc-|name=["'](card|cc)/i;
  const hits: string[] = [];
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(f) && banned.test(readFileSync(p, "utf8"))) hits.push(p);
    }
  };
  walk("src");
  assert.deepEqual(hits, []);
});
