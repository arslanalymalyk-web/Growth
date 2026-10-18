// Run with: npm run test:scorecard (Node's built-in test runner; no extra dependencies).
import assert from "node:assert/strict";
import { test } from "node:test";
import { checkAnswer, checkAnswers } from "../src/scorecard/answers.ts";
import { realScorecard } from "../src/scorecard/config.ts";
import { demoScorecard } from "../src/scorecard/demo.ts";
import { localizeScorecard } from "../src/scorecard/localize.ts";
import { resolveMode } from "../src/scorecard/mode.ts";
import { bandFor, computeScore } from "../src/scorecard/scoring.ts";
import type { ScorecardConfig } from "../src/scorecard/types.ts";
import { isLiveReady, validateScorecard } from "../src/scorecard/validate.ts";

const clone = <T,>(v: T): T => structuredClone(v);
const codes = (c: ScorecardConfig) => new Set(validateScorecard(c).map((i) => i.code));

/** A structurally complete config made ONLY for tests, to prove the validator can pass. Never shipped. */
function approvedTestConfig(): ScorecardConfig {
  const c = clone(demoScorecard);
  c.id = "test-only";
  c.isDemo = false;
  c.status = "approved";
  c.review = { en: "approved", ar: "approved" };
  c.approval = { approvedBy: "Test Approver", approvedAt: "2000-01-01" };
  c.consent = { processing: { en: "p", ar: "p" }, newsletter: { en: "n", ar: "n" } };
  return c;
}

test("the real configuration is a draft and is NOT live-ready", () => {
  assert.equal(realScorecard.status, "draft");
  assert.equal(isLiveReady(realScorecard), false);
  const c = codes(realScorecard);
  for (const code of ["not-approved", "no-approval-record", "review-not-approved", "no-sections", "no-questions", "no-bands", "report-missing", "consent-missing", "no-scoring"]) {
    assert.ok(c.has(code), `expected issue ${code}`);
  }
});

test("the demo fixture can never be live-ready", () => {
  assert.equal(isLiveReady(demoScorecard), false);
  assert.ok(codes(demoScorecard).has("demo-fixture"));
});

test("a complete, approved, non-demo configuration passes (validator can succeed)", () => {
  assert.deepEqual(validateScorecard(approvedTestConfig()), []);
});

test("each missing approval ingredient blocks activation", () => {
  const cases: [string, (c: ScorecardConfig) => void, string][] = [
    ["status draft", (c) => { c.status = "draft"; }, "not-approved"],
    ["no approval record", (c) => { c.approval = null; }, "no-approval-record"],
    ["arabic not approved", (c) => { c.review.ar = "needs-professional-review"; }, "review-not-approved"],
    ["no questions", (c) => { c.questions = []; }, "no-questions"],
    ["unknown section", (c) => { c.questions[0].sectionId = "nope"; }, "unknown-section"],
    ["missing arabic text", (c) => { c.questions[0].prompt.ar = ""; }, "text-missing-translation"],
    ["option without points", (c) => { if (c.questions[0].type === "single") delete c.questions[0].options[0].points; }, "points-missing"],
    ["missing section weight", (c) => { delete c.scoring.sectionWeights["demo-a"]; }, "scoring-weights"],
    ["band gap", (c) => { c.bands[1].min = 45; }, "bands-gap"],
    ["bands not reaching 100", (c) => { c.bands[2].max = 90; }, "bands-gap"],
    ["no bands", (c) => { c.bands = []; }, "no-bands"],
    ["missing report band", (c) => { delete c.report.overallByBand["demo-band-2"]; }, "report-missing"],
    ["missing section report text", (c) => { delete c.report.sectionByBand["demo-b"]["demo-band-1"]; }, "report-missing"],
    ["missing processing consent", (c) => { c.consent.processing = null; }, "consent-missing"],
    ["missing newsletter consent", (c) => { c.consent.newsletter = null; }, "consent-missing"],
    ["demo flag", (c) => { c.isDemo = true; }, "demo-fixture"],
  ];
  for (const [name, mutate, code] of cases) {
    const c = approvedTestConfig();
    mutate(c);
    assert.ok(codes(c).has(code), `${name}: expected ${code}, got ${[...codes(c)].join(",")}`);
    assert.equal(isLiveReady(c), false, name);
  }
});

test("mode resolution: draft never goes live; demo only in development with the flag", () => {
  const base = { real: realScorecard, demo: demoScorecard };
  assert.equal(resolveMode({ ...base, nodeEnv: "production", demoFlag: undefined }).mode, "opening-soon");
  assert.equal(resolveMode({ ...base, nodeEnv: "production", demoFlag: "1" }).mode, "opening-soon");
  assert.equal(resolveMode({ ...base, nodeEnv: "test", demoFlag: "1" }).mode, "opening-soon");
  assert.equal(resolveMode({ ...base, nodeEnv: "development", demoFlag: undefined }).mode, "opening-soon");
  assert.equal(resolveMode({ ...base, nodeEnv: "development", demoFlag: "0" }).mode, "opening-soon");
  const dev = resolveMode({ ...base, nodeEnv: "development", demoFlag: "1" });
  assert.equal(dev.mode, "demo");
  assert.equal(dev.config?.isDemo, true);
  // an invalid "real" config with demo = null stays closed even in development
  assert.equal(resolveMode({ real: realScorecard, demo: null, nodeEnv: "development", demoFlag: "1" }).mode, "opening-soon");
  // a demo-flagged config passed as "real" is never live
  assert.notEqual(resolveMode({ real: demoScorecard, demo: null, nodeEnv: "production", demoFlag: "1" }).mode, "live");
  // only a fully valid approved config is live, in any environment
  assert.equal(resolveMode({ real: approvedTestConfig(), demo: null, nodeEnv: "production", demoFlag: undefined }).mode, "live");
});

test("answer validation: required, invalid and length rules", () => {
  const sc = localizeScorecard(demoScorecard, "en");
  const q = (id: string) => sc.questions.find((x) => x.id === id)!;
  assert.equal(checkAnswer(q("demo-q1"), undefined), "required");
  assert.equal(checkAnswer(q("demo-q1"), "zzz"), "invalid");
  assert.equal(checkAnswer(q("demo-q1"), "b"), null);
  assert.equal(checkAnswer(q("demo-q2"), []), "required");
  assert.equal(checkAnswer(q("demo-q2"), ["a", "zzz"]), "invalid");
  assert.equal(checkAnswer(q("demo-q2"), ["a", "a"]), "invalid");
  assert.equal(checkAnswer(q("demo-q2"), ["a", "c"]), null);
  assert.equal(checkAnswer(q("demo-q3"), 0), "invalid");
  assert.equal(checkAnswer(q("demo-q3"), 6), "invalid");
  assert.equal(checkAnswer(q("demo-q3"), 2.5), "invalid");
  assert.equal(checkAnswer(q("demo-q3"), 5), null);
  assert.equal(checkAnswer(q("demo-q4"), undefined), null, "optional may be empty");
  assert.equal(checkAnswer(q("demo-q5"), "x".repeat(201)), "too-long");
  assert.equal(checkAnswer(q("demo-q5"), "   "), null, "optional blank text is fine");
  const errors = checkAnswers(sc.questions, {});
  assert.deepEqual(errors.map((e) => e.questionId), ["demo-q1", "demo-q2", "demo-q3", "demo-q6"]);
});

test("scoring uses only configured points and returns null (not a made-up number) when nothing is scored", () => {
  const sc = localizeScorecard(demoScorecard, "en");
  const best = computeScore(sc, { "demo-q1": "c", "demo-q2": ["a", "b", "c"], "demo-q3": 5, "demo-q4": "yes", "demo-q6": "y" });
  assert.equal(best.overallPercent, 100);
  assert.equal(best.bandId, "demo-band-3");
  const worst = computeScore(sc, { "demo-q1": "a", "demo-q2": ["a"], "demo-q3": 1, "demo-q4": "no", "demo-q6": "x" });
  assert.ok(worst.overallPercent! < 40);
  assert.equal(worst.bandId, "demo-band-1");
  const none = computeScore(localizeScorecard({ ...demoScorecard, questions: demoScorecard.questions.filter((q) => q.type === "text") }, "en"), {});
  assert.equal(none.overallPercent, null);
  assert.equal(none.bandId, null);
  assert.equal(bandFor(40, sc.bands), "demo-band-2");
  assert.equal(bandFor(100, sc.bands), "demo-band-3");
  assert.equal(bandFor(39.99, sc.bands), "demo-band-1");
});

test("every configurable string exists in both languages for the demo fixture", () => {
  const en = localizeScorecard(demoScorecard, "en");
  const ar = localizeScorecard(demoScorecard, "ar");
  assert.equal(en.questions.length, ar.questions.length);
  for (const q of ar.questions) assert.ok(q.prompt.trim());
  assert.notEqual(en.questions[0].prompt, ar.questions[0].prompt);
});
