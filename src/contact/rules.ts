import type { EnquiryField, LEnquiryField } from "./types.ts";

// ---- Field and consent validation. Used by the browser for feedback AND by the server (never trust the client). ----
export type FieldErrorCode = "required" | "invalid" | "too-short" | "too-long";
export interface FieldError { fieldId: string; code: FieldErrorCode }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const EMAIL_MAX = 254;
/** Single-line values must not contain line breaks or control characters (guards against header/field injection). */
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const LINEBREAK = /[\r\n\u2028\u2029]/;

export const isValidEmail = (v: string): boolean => v.length <= EMAIL_MAX && EMAIL.test(v) && !LINEBREAK.test(v) && !CONTROL.test(v);

/** Valid "topic" values: a service slug or "general". The slug list is passed in (it comes from the content catalogue). */
export const TOPIC_GENERAL = "general";

export function checkEnquiry(fields: (EnquiryField | LEnquiryField)[], values: Record<string, string>, topics: string[]): FieldError[] {
  const errors: FieldError[] = [];
  for (const f of fields) {
    const raw = typeof values[f.id] === "string" ? values[f.id] : "";
    const v = raw.trim();
    if (!v) { if (f.required) errors.push({ fieldId: f.id, code: "required" }); continue; }
    if (raw.length > f.maxLength) { errors.push({ fieldId: f.id, code: "too-long" }); continue; }
    if (f.minLength && v.length < f.minLength) { errors.push({ fieldId: f.id, code: "too-short" }); continue; }
    if (CONTROL.test(raw) || (f.type !== "textarea" && LINEBREAK.test(raw))) { errors.push({ fieldId: f.id, code: "invalid" }); continue; }
    if (f.type === "email" && !isValidEmail(v)) errors.push({ fieldId: f.id, code: "invalid" });
    else if (f.type === "topic" && v !== TOPIC_GENERAL && !topics.includes(v)) errors.push({ fieldId: f.id, code: "invalid" });
  }
  return errors;
}

export const checkSubscriberEmail = (email: string): FieldErrorCode | null => {
  const t = email.trim();
  if (!t) return "required";
  if (email.length > EMAIL_MAX) return "too-long";
  return isValidEmail(t) ? null : "invalid";
};

/** The fields on a given step. */
export const fieldsOnStep = <T extends { step: string }>(fields: T[], step: string): T[] => fields.filter((f) => f.step === step);
