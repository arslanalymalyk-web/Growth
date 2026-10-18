import type { L, ScorecardConfig, ValidationIssue } from "./types.ts";

const hasText = (l: L | undefined | null): l is L => Boolean(l && l.en?.trim() && l.ar?.trim());

/**
 * A scorecard may be activated for production ONLY when this returns no issues.
 * It requires approval records, approved English and Arabic review, complete questions, scoring rules, contiguous result
 * bands over 0 to 100, complete report text for every band and section, and client-reviewed consent wording.
 */
export function validateScorecard(c: ScorecardConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });

  if (c.isDemo) add("demo-fixture", "Demo fixtures can never be activated as a live assessment.");
  if (c.status !== "approved") add("not-approved", `Configuration status is "${c.status}"; it must be "approved".`);
  if (!c.approval?.approvedBy?.trim() || !c.approval?.approvedAt?.trim()) add("no-approval-record", "Missing approval record (approvedBy, approvedAt).");
  if (c.review.en !== "approved") add("review-not-approved", "English content is not marked approved.");
  if (c.review.ar !== "approved") add("review-not-approved", "Arabic content has not been professionally reviewed and approved.");
  if (!(c.estimatedMinutes > 0)) add("bad-estimate", "estimatedMinutes must be greater than 0.");

  // Sections
  if (c.sections.length === 0) add("no-sections", "No sections defined.");
  const sectionIds = new Set<string>();
  for (const s of c.sections) {
    if (sectionIds.has(s.id)) add("duplicate-id", `Duplicate section id "${s.id}".`);
    sectionIds.add(s.id);
    if (!hasText(s.title)) add("text-missing-translation", `Section "${s.id}" title needs English and Arabic text.`);
    if (s.intro && !hasText(s.intro)) add("text-missing-translation", `Section "${s.id}" intro needs English and Arabic text.`);
  }

  // Questions
  if (c.questions.length === 0) add("no-questions", "No questions defined.");
  const questionIds = new Set<string>();
  for (const q of c.questions) {
    if (questionIds.has(q.id)) add("duplicate-id", `Duplicate question id "${q.id}".`);
    questionIds.add(q.id);
    if (!sectionIds.has(q.sectionId)) add("unknown-section", `Question "${q.id}" references unknown section "${q.sectionId}".`);
    if (!hasText(q.prompt)) add("text-missing-translation", `Question "${q.id}" prompt needs English and Arabic text.`);
    if (q.help && !hasText(q.help)) add("text-missing-translation", `Question "${q.id}" help needs English and Arabic text.`);
    if (q.type === "single" || q.type === "multiple") {
      if (q.options.length < 2) add("options-missing", `Question "${q.id}" needs at least two options.`);
      const optIds = new Set<string>();
      for (const o of q.options) {
        if (optIds.has(o.id)) add("duplicate-id", `Duplicate option id "${o.id}" in "${q.id}".`);
        optIds.add(o.id);
        if (!hasText(o.label)) add("text-missing-translation", `Option "${o.id}" of "${q.id}" needs English and Arabic text.`);
        if (q.scored && typeof o.points !== "number") add("points-missing", `Scored question "${q.id}" option "${o.id}" has no points.`);
      }
    }
    if (q.type === "scale") {
      const { min, max, pointsPerStep } = q.scale;
      if (!(Number.isInteger(min) && Number.isInteger(max) && max > min)) add("bad-scale", `Question "${q.id}" needs integer min < max.`);
      if (q.scored && !(pointsPerStep > 0)) add("bad-scale", `Scored scale "${q.id}" needs pointsPerStep > 0.`);
      if (!hasText(q.scale.minLabel) || !hasText(q.scale.maxLabel)) add("text-missing-translation", `Scale "${q.id}" labels need English and Arabic text.`);
    }
    if (q.type === "text" && !(q.maxLength > 0)) add("bad-scale", `Text question "${q.id}" needs maxLength > 0.`);
  }
  for (const s of c.sections) if (!c.questions.some((q) => q.sectionId === s.id)) add("section-empty", `Section "${s.id}" has no questions.`);

  // Scoring
  const scored = c.questions.filter((q) => q.type !== "text" && q.scored);
  if (scored.length === 0) add("no-scoring", "No scored questions; scoring rules cannot produce a result.");
  for (const s of c.sections) {
    const w = c.scoring.sectionWeights[s.id];
    if (!(typeof w === "number" && w > 0)) add("scoring-weights", `Section "${s.id}" needs a positive weight in scoring.sectionWeights.`);
  }
  for (const id of Object.keys(c.scoring.sectionWeights)) if (!sectionIds.has(id)) add("scoring-weights", `Weight given for unknown section "${id}".`);
  for (const [id, w] of Object.entries(c.scoring.questionWeights ?? {})) {
    if (!questionIds.has(id) || !(w > 0)) add("scoring-weights", `Invalid question weight for "${id}".`);
  }

  // Bands: sorted, contiguous, covering 0 to 100
  if (c.bands.length === 0) add("no-bands", "No result bands defined.");
  else {
    const bands = [...c.bands].sort((a, b) => a.min - b.min);
    if (bands[0].min !== 0) add("bands-gap", "Bands must start at 0.");
    if (bands[bands.length - 1].max !== 100) add("bands-gap", "Bands must end at 100.");
    bands.forEach((b, i) => {
      if (!(b.max > b.min)) add("bands-gap", `Band "${b.id}" must have max > min.`);
      if (i > 0 && b.min !== bands[i - 1].max) add("bands-gap", `Band "${b.id}" is not contiguous with the previous band.`);
      if (!hasText(b.title) || !hasText(b.summary)) add("text-missing-translation", `Band "${b.id}" title and summary need English and Arabic text.`);
    });
  }
  if (new Set(c.bands.map((b) => b.id)).size !== c.bands.length) add("duplicate-id", "Duplicate band ids.");

  // Report content
  const r = c.report;
  if (!hasText(r.title) || !hasText(r.intro) || !hasText(r.closing)) add("report-missing", "Report title, intro and closing need English and Arabic text.");
  for (const b of c.bands) {
    const o = r.overallByBand[b.id];
    if (!o || !hasText(o.headline) || !hasText(o.body) || o.nextSteps.length === 0 || !o.nextSteps.every(hasText)) {
      add("report-missing", `Report text missing for band "${b.id}" (headline, body, next steps).`);
    }
    for (const s of c.sections) if (!hasText(r.sectionByBand[s.id]?.[b.id])) add("report-missing", `Report text missing for section "${s.id}" in band "${b.id}".`);
  }

  // Consent
  if (!hasText(c.consent.processing)) add("consent-missing", "Client-reviewed assessment-processing consent wording is missing.");
  if (!hasText(c.consent.newsletter)) add("consent-missing", "Client-reviewed optional newsletter consent wording is missing.");

  return issues;
}

export const isLiveReady = (c: ScorecardConfig): boolean => validateScorecard(c).length === 0;
