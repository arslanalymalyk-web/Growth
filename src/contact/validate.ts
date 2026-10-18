import type { Channel, ContactConfig, L, ValidationIssue } from "./types.ts";

const hasText = (l: L | undefined | null): l is L => Boolean(l && l.en?.trim() && l.ar?.trim());

/**
 * A channel (enquiry or newsletter) may collect personal data in production ONLY when this returns no issues AND its
 * provider adapter is installed (see mode.ts). It requires approval records, approved EN/AR review, an approved privacy
 * notice, client/legal-approved consent wording with a version id, and a configured provider id.
 */
export function validateContactChannel(c: ContactConfig, channel: Channel): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });

  if (c.isDemo) add("demo-fixture", "Demo fixtures can never be activated for real submissions.");
  if (c.status !== "approved") add("not-approved", `Configuration status is "${c.status}"; it must be "approved".`);
  if (!c.approval?.approvedBy?.trim() || !c.approval?.approvedAt?.trim()) add("no-approval-record", "Missing approval record (approvedBy, approvedAt).");
  if (c.review.en !== "approved") add("review-not-approved", "English wording is not marked approved.");
  if (c.review.ar !== "approved") add("review-not-approved", "Arabic wording has not been professionally reviewed and approved.");
  if (c.privacyNotice !== "approved") add("privacy-notice-pending", "The privacy notice has not been approved by the client's legal adviser.");
  if (!c.terms.version?.trim()) add("consent-version-missing", "Approved consent wording needs a version identifier.");

  if (channel === "enquiry") {
    if (!hasText(c.terms.enquiryConsent)) add("consent-missing", "Approved enquiry-processing consent wording is missing (English and Arabic).");
    if (!c.providers.crm) add("crm-provider-missing", "No CRM has been selected and set up by the client.");
    const ids = new Set<string>();
    for (const f of c.fields) {
      if (ids.has(f.id)) add("duplicate-id", `Duplicate field id "${f.id}".`);
      ids.add(f.id);
      if (!hasText(f.label)) add("text-missing-translation", `Field "${f.id}" label needs English and Arabic text.`);
      if (!(Number.isInteger(f.maxLength) && f.maxLength > 0)) add("bad-field", `Field "${f.id}" needs maxLength > 0.`);
    }
    if (!c.fields.some((f) => f.id === "email" && f.required)) add("fields-missing", "A required email field is needed to respond.");
    if (!c.fields.some((f) => f.id === "message" && f.required)) add("fields-missing", "A required message field is needed.");
    if (!c.fields.some((f) => f.id === "fullName" && f.required)) add("fields-missing", "A required name field is needed.");
  } else {
    if (!hasText(c.terms.newsletterConsent)) add("consent-missing", "Approved newsletter-subscription consent wording is missing (English and Arabic).");
    if (!c.providers.newsletter) add("newsletter-provider-missing", "No newsletter platform has been selected and set up by the client.");
  }
  return issues;
}
