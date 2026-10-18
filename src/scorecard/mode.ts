import { validateScorecard } from "./validate.ts";
import type { ScorecardConfig, ScorecardMode, ValidationIssue } from "./types.ts";

export interface ModeInput {
  nodeEnv: string | undefined;
  demoFlag: string | undefined;
  /** The real, client-owned configuration (draft until approved). */
  real: ScorecardConfig;
  /** The demo fixture. Only ever loaded in development; null elsewhere. */
  demo: ScorecardConfig | null;
}
export interface ModeResult { mode: ScorecardMode; config: ScorecardConfig | null; issues: ValidationIssue[] }

/**
 * Decides what the public site shows:
 *  - "live": ONLY a fully valid, approved, non-demo configuration.
 *  - "demo": only when NODE_ENV === "development" AND SCORECARD_DEMO === "1" (never in production).
 *  - "opening-soon": everything else, including any incomplete draft.
 */
export function resolveMode({ nodeEnv, demoFlag, real, demo }: ModeInput): ModeResult {
  const issues = validateScorecard(real);
  if (issues.length === 0) return { mode: "live", config: real, issues };
  if (nodeEnv === "development" && demoFlag === "1" && demo && demo.isDemo) return { mode: "demo", config: demo, issues };
  return { mode: "opening-soon", config: null, issues };
}
