import type { AnswerValue, Answers, LQuestion } from "./types.ts";

export type AnswerErrorCode = "required" | "invalid" | "too-long";
export interface AnswerError { questionId: string; code: AnswerErrorCode }

const isEmpty = (q: LQuestion, v: AnswerValue | undefined): boolean => {
  if (v === undefined || v === null) return true;
  if (q.type === "multiple") return !Array.isArray(v) || v.length === 0;
  if (q.type === "text") return typeof v !== "string" || v.trim() === "";
  return v === "";
};

/** Returns an error code, or null when the answer is acceptable. Optional questions may be left empty. */
export function checkAnswer(q: LQuestion, v: AnswerValue | undefined): AnswerErrorCode | null {
  if (isEmpty(q, v)) return q.required ? "required" : null;
  switch (q.type) {
    case "single":
      return typeof v === "string" && q.options.some((o) => o.id === v) ? null : "invalid";
    case "multiple":
      return Array.isArray(v) && v.every((id) => q.options.some((o) => o.id === id)) && new Set(v).size === v.length ? null : "invalid";
    case "scale":
      return typeof v === "number" && Number.isInteger(v) && v >= q.scale.min && v <= q.scale.max ? null : "invalid";
    case "text":
      if (typeof v !== "string") return "invalid";
      return v.length > q.maxLength ? "too-long" : null;
  }
}

export function checkAnswers(questions: LQuestion[], answers: Answers): AnswerError[] {
  const errors: AnswerError[] = [];
  for (const q of questions) {
    const code = checkAnswer(q, answers[q.id]);
    if (code) errors.push({ questionId: q.id, code });
  }
  return errors;
}
