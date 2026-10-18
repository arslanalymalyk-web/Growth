import type { ScorecardConfig } from "./types.ts";

/**
 * DEVELOPMENT-ONLY DEMO FIXTURE (marker: __SCORECARD_DEMO_FIXTURE__).
 * Exists only to test layout, validation, navigation and RTL. Every string is labelled as demo/sample text; none of it is
 * real readiness content, scoring or advice. It is loaded only when NODE_ENV === "development" and SCORECARD_DEMO=1,
 * is flagged isDemo (so validateScorecard() always rejects it for live use), and is excluded from production bundles.
 */
const d = (en: string, ar: string) => ({ en, ar });

export const demoScorecard: ScorecardConfig = {
  id: "__SCORECARD_DEMO_FIXTURE__",
  version: "demo",
  status: "draft",
  isDemo: true,
  review: { en: "draft", ar: "needs-professional-review" },
  approval: null,
  estimatedMinutes: 10,
  sections: [
    { id: "demo-a", title: d("Demo section A", "قسم تجريبي أ"), intro: d("Sample section used for layout testing only.", "قسم نموذجي يُستخدم لاختبار التصميم فقط.") },
    { id: "demo-b", title: d("Demo section B", "قسم تجريبي ب") },
    { id: "demo-c", title: d("Demo section C", "قسم تجريبي ج"), intro: d("Contains an optional free-text question.", "يتضمن سؤالًا نصيًا اختياريًا.") },
  ],
  questions: [
    {
      id: "demo-q1", sectionId: "demo-a", type: "single", required: true, scored: true,
      prompt: d("Demo question 1 (single choice): choose any option.", "سؤال تجريبي 1 (اختيار واحد): اختر أي خيار."),
      help: d("Sample help text. These options carry arbitrary demo points.", "نص مساعدة نموذجي. تحمل هذه الخيارات نقاطًا تجريبية عشوائية."),
      options: [
        { id: "a", label: d("Demo option A", "الخيار التجريبي أ"), points: 0 },
        { id: "b", label: d("Demo option B", "الخيار التجريبي ب"), points: 1 },
        { id: "c", label: d("Demo option C", "الخيار التجريبي ج"), points: 2 },
      ],
    },
    {
      id: "demo-q2", sectionId: "demo-a", type: "multiple", required: true, scored: true,
      prompt: d("Demo question 2 (multiple choice): select all that apply.", "سؤال تجريبي 2 (اختيار متعدد): اختر كل ما ينطبق."),
      options: [
        { id: "a", label: d("Demo choice one", "الاختيار التجريبي الأول"), points: 1 },
        { id: "b", label: d("Demo choice two", "الاختيار التجريبي الثاني"), points: 1 },
        { id: "c", label: d("Demo choice three", "الاختيار التجريبي الثالث"), points: 1 },
      ],
    },
    {
      id: "demo-q3", sectionId: "demo-b", type: "scale", required: true, scored: true,
      prompt: d("Demo question 3 (scale): pick a number.", "سؤال تجريبي 3 (مقياس): اختر رقمًا."),
      scale: { min: 1, max: 5, minLabel: d("Demo low", "منخفض تجريبي"), maxLabel: d("Demo high", "مرتفع تجريبي"), pointsPerStep: 1 },
    },
    {
      id: "demo-q4", sectionId: "demo-b", type: "single", required: false, scored: true,
      prompt: d("Demo question 4 (optional single choice).", "سؤال تجريبي 4 (اختيار واحد اختياري)."),
      options: [
        { id: "yes", label: d("Demo yes", "نعم تجريبي"), points: 1 },
        { id: "no", label: d("Demo no", "لا تجريبي"), points: 0 },
      ],
    },
    {
      id: "demo-q5", sectionId: "demo-c", type: "text", required: false, maxLength: 200,
      prompt: d("Demo question 5 (optional text, not scored).", "سؤال تجريبي 5 (نص اختياري، غير محتسب)."),
      placeholder: d("Demo placeholder text", "نص تجريبي"),
    },
    {
      id: "demo-q6", sectionId: "demo-c", type: "single", required: true, scored: true,
      prompt: d("Demo question 6 (required single choice).", "سؤال تجريبي 6 (اختيار واحد مطلوب)."),
      options: [
        { id: "x", label: d("Demo X", "تجريبي س"), points: 0 },
        { id: "y", label: d("Demo Y", "تجريبي ص"), points: 3 },
      ],
    },
  ],
  scoring: { method: "weighted-percentage", sectionWeights: { "demo-a": 1, "demo-b": 1, "demo-c": 1 } },
  bands: [
    { id: "demo-band-1", min: 0, max: 40, title: d("Demo band 1", "النطاق التجريبي 1"), summary: d("Demo summary: this is not a real readiness band.", "ملخص تجريبي: هذا ليس نطاق جاهزية حقيقيًا.") },
    { id: "demo-band-2", min: 40, max: 70, title: d("Demo band 2", "النطاق التجريبي 2"), summary: d("Demo summary: this is not a real readiness band.", "ملخص تجريبي: هذا ليس نطاق جاهزية حقيقيًا.") },
    { id: "demo-band-3", min: 70, max: 100, title: d("Demo band 3", "النطاق التجريبي 3"), summary: d("Demo summary: this is not a real readiness band.", "ملخص تجريبي: هذا ليس نطاق جاهزية حقيقيًا.") },
  ],
  report: {
    title: d("Demo report layout", "تخطيط تقرير تجريبي"),
    intro: d("Demo text. A real, client-approved report would appear here.", "نص تجريبي. سيظهر هنا تقرير حقيقي يعتمده العميل."),
    overallByBand: Object.fromEntries(
      [1, 2, 3].map((n) => [
        `demo-band-${n}`,
        {
          headline: d(`Demo headline for band ${n}`, `عنوان تجريبي للنطاق ${n}`),
          body: d("Demo paragraph for layout testing. It is not advice.", "فقرة تجريبية لاختبار التصميم. وهي ليست مشورة."),
          nextSteps: [d("Demo next step one", "خطوة تالية تجريبية أولى"), d("Demo next step two", "خطوة تالية تجريبية ثانية")],
        },
      ]),
    ),
    sectionByBand: Object.fromEntries(
      ["demo-a", "demo-b", "demo-c"].map((s) => [s, Object.fromEntries([1, 2, 3].map((n) => [`demo-band-${n}`, d("Demo section note.", "ملاحظة قسم تجريبية.")]))]),
    ),
    closing: d("Demo closing text.", "نص ختامي تجريبي."),
  },
  // null on purpose: renders the "approval needed" consent placeholders so they can be reviewed.
  consent: { processing: null, newsletter: null },
};
