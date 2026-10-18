import type { L, LocalizedScorecard, LQuestion, Locale, Question, ScorecardConfig } from "./types.ts";

const t = (l: L, locale: Locale): string => l[locale];
const opt = <T extends { label?: L }>(l: T | undefined, locale: Locale) => (l?.label ? t(l.label, locale) : "");

function question(q: Question, locale: Locale): LQuestion {
  const base = { id: q.id, sectionId: q.sectionId, prompt: t(q.prompt, locale), help: q.help ? t(q.help, locale) : undefined, required: q.required };
  switch (q.type) {
    case "single":
    case "multiple":
      return { ...base, type: q.type, scored: q.scored, options: q.options.map((o) => ({ id: o.id, label: opt(o, locale), points: o.points })) };
    case "scale":
      return { ...base, type: "scale", scored: q.scored, scale: { ...q.scale, minLabel: t(q.scale.minLabel, locale), maxLabel: t(q.scale.maxLabel, locale) } };
    case "text":
      return { ...base, type: "text", maxLength: q.maxLength, placeholder: q.placeholder ? t(q.placeholder, locale) : undefined };
  }
}

/** Resolves a bilingual configuration to one language for the UI. */
export function localizeScorecard(c: ScorecardConfig, locale: Locale): LocalizedScorecard {
  return {
    id: c.id,
    isDemo: c.isDemo,
    estimatedMinutes: c.estimatedMinutes,
    sections: c.sections.map((s) => ({ id: s.id, title: t(s.title, locale), intro: s.intro ? t(s.intro, locale) : undefined })),
    questions: c.questions.map((q) => question(q, locale)),
    scoring: c.scoring,
    bands: c.bands.map((b) => ({ id: b.id, min: b.min, max: b.max, title: t(b.title, locale), summary: t(b.summary, locale) })),
    report: {
      title: t(c.report.title, locale),
      intro: t(c.report.intro, locale),
      overallByBand: Object.fromEntries(
        Object.entries(c.report.overallByBand).map(([id, o]) => [id, { headline: t(o.headline, locale), body: t(o.body, locale), nextSteps: o.nextSteps.map((n) => t(n, locale)) }]),
      ),
      sectionByBand: Object.fromEntries(Object.entries(c.report.sectionByBand).map(([sid, m]) => [sid, Object.fromEntries(Object.entries(m).map(([bid, l]) => [bid, t(l, locale)]))])),
      closing: t(c.report.closing, locale),
    },
    consent: { processing: c.consent.processing ? t(c.consent.processing, locale) : null, newsletter: c.consent.newsletter ? t(c.consent.newsletter, locale) : null },
  };
}
