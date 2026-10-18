import type { Answers, LBand, LQuestion, LocalizedScorecard } from "./types.ts";

export interface SectionScore { sectionId: string; percent: number | null; bandId: string | null }
export interface ScoreResult { overallPercent: number | null; bandId: string | null; sections: SectionScore[] }

function questionPoints(q: LQuestion, a: Answers[string] | undefined): { got: number; max: number } | null {
  if (q.type === "text" || !q.scored) return null;
  if (q.type === "single") {
    const max = Math.max(...q.options.map((o) => o.points ?? 0));
    const got = q.options.find((o) => o.id === a)?.points ?? 0;
    return { got, max };
  }
  if (q.type === "multiple") {
    const max = q.options.reduce((s, o) => s + Math.max(o.points ?? 0, 0), 0);
    const picked = Array.isArray(a) ? a : [];
    const got = q.options.filter((o) => picked.includes(o.id)).reduce((s, o) => s + (o.points ?? 0), 0);
    return { got, max };
  }
  const steps = q.scale.max - q.scale.min;
  const got = typeof a === "number" ? (a - q.scale.min) * q.scale.pointsPerStep : 0;
  return { got, max: steps * q.scale.pointsPerStep };
}

/** Band lookup: min inclusive, max exclusive (the last band also includes 100). */
export function bandFor(percent: number, bands: LBand[]): string | null {
  const sorted = [...bands].sort((a, b) => a.min - b.min);
  const hit = sorted.find((b, i) => percent >= b.min && (percent < b.max || (i === sorted.length - 1 && percent <= b.max)));
  return hit?.id ?? null;
}

/**
 * Weighted percentage scoring driven entirely by the (client-approved) configuration. Returns nulls, never a made-up
 * number, when nothing is scored.
 */
export function computeScore(sc: LocalizedScorecard, answers: Answers): ScoreResult {
  const qw = sc.scoring.questionWeights ?? {};
  const sections: SectionScore[] = sc.sections.map((s) => {
    let got = 0;
    let max = 0;
    for (const q of sc.questions.filter((x) => x.sectionId === s.id)) {
      const p = questionPoints(q, answers[q.id]);
      if (!p) continue;
      const w = qw[q.id] ?? 1;
      got += p.got * w;
      max += p.max * w;
    }
    const percent = max > 0 ? (got / max) * 100 : null;
    return { sectionId: s.id, percent, bandId: percent === null ? null : bandFor(percent, sc.bands) };
  });
  let num = 0;
  let den = 0;
  for (const s of sections) {
    if (s.percent === null) continue;
    const w = sc.scoring.sectionWeights[s.sectionId] ?? 0;
    num += s.percent * w;
    den += w;
  }
  const overallPercent = den > 0 ? num / den : null;
  return { overallPercent, bandId: overallPercent === null ? null : bandFor(overallPercent, sc.bands), sections };
}
