import type { ScorecardConfig } from "./types.ts";

/**
 * THE REAL SAUDI READINESS SCORECARD CONFIGURATION: DRAFT / EMPTY.
 *
 * The client has not supplied questions, scoring rules, result bands, report content or reviewed consent wording.
 * Do not invent them. When the client supplies approved material:
 *   1. fill in the sections, questions, scoring, bands, report and consent below (English and Arabic),
 *   2. set review.en / review.ar to "approved" after professional review,
 *   3. record approval, then set status to "approved".
 * The scorecard stays "opening soon" until validateScorecard() reports no issues (see validate.ts).
 */
export const realScorecard: ScorecardConfig = {
  id: "saudi-readiness-scorecard",
  version: "0.0.0-draft",
  status: "draft",
  isDemo: false,
  review: { en: "draft", ar: "draft" },
  approval: null,
  estimatedMinutes: 10, // from the brief ("about 10 minutes"); confirm once real questions exist
  sections: [],
  questions: [],
  scoring: { method: "weighted-percentage", sectionWeights: {} },
  bands: [],
  report: { title: { en: "", ar: "" }, intro: { en: "", ar: "" }, overallByBand: {}, sectionByBand: {}, closing: { en: "", ar: "" } },
  consent: { processing: null, newsletter: null },
};
