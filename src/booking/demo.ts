import { addDays, dayKey } from "./calendar.ts";
import type { AvailabilityQuery, BookingConfig, CalendarProvider, CheckoutRequest, PaymentProvider, PaymentStatus, Result, Slot } from "./types.ts";

/**
 * DEVELOPMENT-ONLY DEMO FIXTURE (marker: __BOOKING_DEMO_FIXTURE__).
 * Lets the journey be previewed end to end. EVERYTHING here is fake: the prices use the non-currency code "XXX", the
 * availability is generated, and the "hosted checkout" is a simulator page. No booking or payment is ever made.
 * Loaded only when NODE_ENV === "development" and BOOKING_DEMO=1, flagged isDemo (always rejected for live use), and
 * excluded from production bundles.
 */
const d = (en: string, ar: string) => ({ en, ar });
const DEMO_DURATION = 45;

export const demoBooking: BookingConfig = {
  id: "__BOOKING_DEMO_FIXTURE__",
  version: "demo",
  status: "draft",
  isDemo: true,
  review: { en: "draft", ar: "needs-professional-review" },
  approval: null,
  timeZone: "Asia/Riyadh",
  weekStartsOn: 0,
  bundlePolicy: "select-all-now",
  packages: [
    { id: "single", kind: "single", sessions: 1, name: d("One consultation session", "جلسة استشارية واحدة"), summary: d("Demo package: a single session.", "حزمة تجريبية: جلسة واحدة."), price: { amountMinor: 100000, currency: "XXX" }, durationMinutes: DEMO_DURATION },
    { id: "bundle", kind: "bundle", sessions: 3, name: d("Three-session bundle", "حزمة من ثلاث جلسات"), summary: d("Demo package: three sessions.", "حزمة تجريبية: ثلاث جلسات."), price: { amountMinor: 250000, currency: "XXX" }, durationMinutes: DEMO_DURATION },
  ],
  fields: [
    { id: "fullName", type: "text", required: true, label: d("Full name", "الاسم الكامل"), maxLength: 120, autocomplete: "name", appliesTo: ["single", "bundle"] },
    { id: "email", type: "email", required: true, label: d("Email address", "البريد الإلكتروني"), help: d("Demo only: nothing is sent.", "للعرض التجريبي فقط: لا يُرسل أي شيء."), maxLength: 160, autocomplete: "email", appliesTo: ["single", "bundle"] },
    { id: "notes", type: "textarea", required: false, label: d("What would you like to discuss? (optional)", "ما الذي تودّ مناقشته؟ (اختياري)"), maxLength: 300, appliesTo: ["single", "bundle"] },
  ],
  // null on purpose: renders the "approval needed" placeholders so they can be reviewed.
  terms: { cancellation: null, refund: null, booking: null, privacy: null, processingConsent: null },
  providers: { calendar: "demo-calendar", payment: "demo-payment" },
  enquiryEmail: null,
};

// ---- Fake calendar -----------------------------------------------------------------------------------------
const START_TIMES_UTC = [[7, 0], [8, 30], [11, 0], [12, 30]]; // = 10:00, 11:30, 14:00, 15:30 in Asia/Riyadh (UTC+3)
const failedOnce = new Set<string>();
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const demoCalendar: CalendarProvider = {
  id: "demo-calendar",
  async getAvailability(q: AvailabilityQuery): Promise<Result<Slot[]>> {
    await sleep(350);
    // Preview the retry state: the first request for the month two months ahead fails once.
    const twoAhead = addDays(dayKey(new Date()), 62).slice(0, 7);
    if (q.fromDate.slice(0, 7) === twoAhead && !failedOnce.has(q.fromDate)) {
      failedOnce.add(q.fromDate);
      return { ok: false, error: { code: "provider-error", message: "Demo: simulated calendar failure (retry to continue)." } };
    }
    const earliest = addDays(dayKey(new Date()), 2);
    const slots: Slot[] = [];
    for (let key = q.fromDate; key <= q.toDate; key = addDays(key, 1)) {
      const dow = new Date(`${key}T00:00:00Z`).getUTCDay();
      if (key < earliest || dow === 5 || dow === 6 || hash(key) % 4 === 0) continue; // fake: weekdays only, some days empty
      for (const [h, m] of START_TIMES_UTC) {
        const start = new Date(`${key}T00:00:00Z`);
        start.setUTCHours(h, m);
        const end = new Date(start.getTime() + DEMO_DURATION * 60_000);
        slots.push({ id: `demo-${key}-${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}`, startsAt: start.toISOString(), endsAt: end.toISOString() });
      }
    }
    return { ok: true, value: slots };
  },
  async reserveSlots() { return { ok: true, value: { reservationId: "demo-reservation" } }; },
  async confirmBooking() { return { ok: true, value: { bookingRef: "DEMO-REF" } }; },
  async cancelBooking() { return { ok: true, value: undefined }; },
};

// ---- Fake hosted checkout ----------------------------------------------------------------------------------
/** The demo "provider" encodes the simulated outcome in the session id (demo_<outcome>_<n>). */
export const demoPayment: PaymentProvider = {
  id: "demo-payment",
  async createCheckoutSession(req: CheckoutRequest) {
    await sleep(1200); // simulated provider latency, so the loading and cancel states can be previewed
    return { ok: true as const, value: { sessionId: "demo_session", checkoutUrl: `/${req.locale}/book-consultation/demo-checkout` } };
  },
  async getCheckoutStatus(sessionId: string): Promise<Result<PaymentStatus>> {
    const m = /^demo_(paid|pending|cancelled|expired|failed)_/.exec(sessionId);
    return { ok: true, value: (m?.[1] as PaymentStatus | undefined) ?? "unknown" };
  },
};

/** Copy for the simulator page that stands in for the provider's hosted checkout. */
export const demoCheckoutCopy = {
  en: {
    banner: "DEMO MODE: this page simulates a payment provider's hosted checkout. No payment is taken and no booking is made.",
    title: "Simulated hosted checkout",
    body: "A real provider's page would appear here, on the provider's own secure domain. It is the only place payment details would ever be entered. This site has no card fields.",
    prompt: "Choose an outcome to preview:",
    outcomes: { paid: "Simulate successful payment", pending: "Simulate payment pending", cancelled: "Cancel checkout", failed: "Simulate an error" },
  },
  ar: {
    banner: "وضع تجريبي: تحاكي هذه الصفحة صفحة الدفع المستضافة لدى مزوّد الدفع. لا يُسحب أي مبلغ ولا يُجرى أي حجز.",
    title: "صفحة دفع مستضافة (محاكاة)",
    body: "ستظهر هنا صفحة المزوّد الحقيقي على نطاقه الآمن الخاص، وهي المكان الوحيد الذي تُدخل فيه بيانات الدفع. لا يحتوي هذا الموقع على أي حقول لبطاقات الدفع.",
    prompt: "اختر نتيجة لمعاينتها:",
    outcomes: { paid: "محاكاة دفع ناجح", pending: "محاكاة دفع قيد المعالجة", cancelled: "إلغاء الدفع", failed: "محاكاة حدوث خطأ" },
  },
};
