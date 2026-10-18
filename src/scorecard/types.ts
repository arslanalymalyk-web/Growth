// Scorecard configuration model. Pure types: no framework imports (tests run this code directly under Node).
// The client has NOT supplied questions, scoring rules, result bands or report text. Nothing here may be invented.

/** Every client-facing string is provided in both languages. */
export interface L { en: string; ar: string }
export type Locale = "en" | "ar";
export type ReviewState = "draft" | "needs-professional-review" | "approved";

export interface Section { id: string; title: L; intro?: L }
export interface Option { id: string; label: L; /** Points awarded when the question is scored. */ points?: number }

interface QuestionBase { id: string; sectionId: string; prompt: L; help?: L; required: boolean }
export interface SingleQuestion extends QuestionBase { type: "single"; scored: boolean; options: Option[] }
export interface MultipleQuestion extends QuestionBase { type: "multiple"; scored: boolean; options: Option[] }
export interface ScaleQuestion extends QuestionBase {
  type: "scale";
  scored: boolean;
  /** Integer scale, e.g. 1 to 5. Points = (value - min) * pointsPerStep. */
  scale: { min: number; max: number; minLabel: L; maxLabel: L; pointsPerStep: number };
}
export interface TextQuestion extends QuestionBase { type: "text"; maxLength: number; placeholder?: L }
export type Question = SingleQuestion | MultipleQuestion | ScaleQuestion | TextQuestion;
export type QuestionType = Question["type"];

export interface ScoringRules {
  method: "weighted-percentage";
  /** Weight of each section in the overall score. Must cover every section. */
  sectionWeights: Record<string, number>;
  /** Optional per-question weights (default 1). */
  questionWeights?: Record<string, number>;
}

/** Result band over the overall percentage. min is inclusive; max is exclusive except for the last band (100 inclusive). */
export interface Band { id: string; min: number; max: number; title: L; summary: L }

export interface ReportContent {
  title: L;
  intro: L;
  overallByBand: Record<string, { headline: L; body: L; nextSteps: L[] }>;
  /** sectionByBand[sectionId][bandId] */
  sectionByBand: Record<string, Record<string, L>>;
  closing: L;
}

export interface ScorecardConfig {
  id: string;
  version: string;
  /** "approved" only when the client has signed off questions, scoring, bands, report and consent text. */
  status: "draft" | "approved";
  /** True only for the development-only demo fixture. A demo fixture can never be live. */
  isDemo: boolean;
  review: { en: ReviewState; ar: ReviewState };
  approval: { approvedBy: string; approvedAt: string } | null;
  estimatedMinutes: number;
  sections: Section[];
  questions: Question[];
  scoring: ScoringRules;
  bands: Band[];
  report: ReportContent;
  /** Client-reviewed consent wording. null = approval-needed placeholder is shown instead. */
  consent: { processing: L | null; newsletter: L | null };
}

// ---- Answers ---------------------------------------------------------------------------------------------
export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue>;

// ---- Single-language view used by the UI ---------------------------------------------------------------
export interface LSection { id: string; title: string; intro?: string }
export interface LOption { id: string; label: string; points?: number }
interface LBase { id: string; sectionId: string; prompt: string; help?: string; required: boolean }
export type LQuestion =
  | (LBase & { type: "single"; scored: boolean; options: LOption[] })
  | (LBase & { type: "multiple"; scored: boolean; options: LOption[] })
  | (LBase & { type: "scale"; scored: boolean; scale: { min: number; max: number; minLabel: string; maxLabel: string; pointsPerStep: number } })
  | (LBase & { type: "text"; maxLength: number; placeholder?: string });
export interface LBand { id: string; min: number; max: number; title: string; summary: string }
export interface LReport {
  title: string;
  intro: string;
  overallByBand: Record<string, { headline: string; body: string; nextSteps: string[] }>;
  sectionByBand: Record<string, Record<string, string>>;
  closing: string;
}
export interface LocalizedScorecard {
  id: string;
  isDemo: boolean;
  estimatedMinutes: number;
  sections: LSection[];
  questions: LQuestion[];
  scoring: ScoringRules;
  bands: LBand[];
  report: LReport;
  consent: { processing: string | null; newsletter: string | null };
}

export type ScorecardMode = "live" | "demo" | "opening-soon";
export interface ValidationIssue { code: string; message: string }
