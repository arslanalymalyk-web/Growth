import { realScorecard } from "./config.ts";
import { resolveMode, type ModeResult } from "./mode.ts";
import type { ScorecardConfig } from "./types.ts";

/**
 * Server-side loader. The demo fixture is imported ONLY when NODE_ENV === "development"; the check is inlined at build
 * time, so the fixture is dead-code-eliminated from production bundles.
 */
export async function getScorecard(): Promise<ModeResult> {
  let demo: ScorecardConfig | null = null;
  if (process.env.NODE_ENV === "development") {
    demo = (await import("./demo.ts")).demoScorecard;
  }
  return resolveMode({ nodeEnv: process.env.NODE_ENV, demoFlag: process.env.SCORECARD_DEMO, real: realScorecard, demo });
}
