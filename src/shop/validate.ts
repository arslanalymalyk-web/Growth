import { MAX_LINK_SECONDS, type L, type Product, type ShopConfig, type ValidationIssue } from "./types.ts";

const hasText = (l: L | undefined | null): l is L => Boolean(l && l.en?.trim() && l.ar?.trim());
const posInt = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n > 0;
/** Opaque private object key: letters, digits and . _ - /, no URL scheme, no leading slash, no traversal. */
const KEY = /^[A-Za-z0-9][A-Za-z0-9._\-/]*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
/** Path segments used by fixed shop routes; a product with one of these slugs would be shadowed. */
export const RESERVED_SLUGS = ["order", "demo-checkout"];

/**
 * A product may be sold ONLY when this returns no issues: published, not a preview, fully approved in both languages,
 * with a real price, complete bilingual copy, a private file reference, and client-approved licence and refund terms.
 */
export function validateProduct(p: Product, sectorSlugs: string[] = []): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });
  const id = `Product "${p.id}"`;

  if (p.isPreview) add("preview-fixture", `${id} is a development preview and can never be sold.`);
  if (p.status !== "published") add("not-published", `${id} is "${p.status}"; it must be "published".`);
  if (!SLUG.test(p.id) || RESERVED_SLUGS.includes(p.id)) add("bad-slug", `${id} needs a lowercase-hyphen slug that is not reserved (${RESERVED_SLUGS.join(", ")}).`);
  if (!p.approval?.approvedBy?.trim() || !p.approval?.approvedAt?.trim()) add("no-approval-record", `${id} has no approval record.`);
  if (p.review.en !== "approved") add("review-not-approved", `${id}: English copy is not approved.`);
  if (p.review.ar !== "approved") add("review-not-approved", `${id}: Arabic copy has not been professionally reviewed and approved.`);
  if (!hasText(p.title) || !hasText(p.summary) || !hasText(p.description)) add("text-missing-translation", `${id} title, summary and description need English and Arabic text.`);
  if (p.sectorId !== null && sectorSlugs.length > 0 && !sectorSlugs.includes(p.sectorId)) add("unknown-sector", `${id} references unknown sector "${p.sectorId}".`);

  if (p.price === null) add("price-missing", `${id} has no client-supplied price.`);
  else if (!posInt(p.price.amountMinor) || !/^[A-Z]{3}$/.test(p.price.currency)) add("price-invalid", `${id} price needs a positive integer in minor units and an ISO currency code.`);

  if (!p.file) add("file-missing", `${id} has no file reference.`);
  else {
    if (!KEY.test(p.file.key) || p.file.key.includes("..") || p.file.key.includes("//")) add("file-key-invalid", `${id} file key must be an opaque private storage key, never a URL or path.`);
    if (!posInt(p.file.sizeBytes)) add("file-size-missing", `${id} needs the file size in bytes.`);
  }
  if (p.previewImage && (!hasText(p.previewImage.alt) || !p.previewImage.url.startsWith("https://"))) add("preview-image-invalid", `${id} preview image needs an https URL and English and Arabic alt text.`);
  if (!hasText(p.licence)) add("licence-missing", `${id} has no client-approved licence terms.`);
  if (!hasText(p.refund)) add("refund-missing", `${id} has no client-approved refund terms.`);
  return issues;
}

/** Shop-level rules (everything except individual products). The shop may go live only when this is clean AND providers are installed. */
export function validateShopConfig(c: ShopConfig): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (code: string, message: string) => issues.push({ code, message });

  if (c.isDemo) add("demo-fixture", "Demo fixtures can never be activated as a live shop.");
  if (c.status !== "approved") add("not-approved", `Configuration status is "${c.status}"; it must be "approved".`);
  if (!c.approval?.approvedBy?.trim() || !c.approval?.approvedAt?.trim()) add("no-approval-record", "Missing approval record (approvedBy, approvedAt).");
  if (c.review.en !== "approved") add("review-not-approved", "English content is not marked approved.");
  if (c.review.ar !== "approved") add("review-not-approved", "Arabic content has not been professionally reviewed and approved.");

  const v = c.delivery.linkValiditySeconds;
  if (v === null) add("delivery-validity-missing", "Client has not decided how long a signed download link stays valid.");
  else if (!posInt(v) || v > MAX_LINK_SECONDS) add("delivery-validity-invalid", `Signed links must be short-lived: 1 to ${MAX_LINK_SECONDS} seconds.`);
  if (!posInt(c.delivery.maxDownloadsPerOrder)) add("delivery-limit-missing", "Client has not decided the download limit per order.");

  for (const key of ["purchaseTerms", "purchaseCommunications", "marketingConsent", "privacy"] as const) {
    if (!hasText(c.terms[key])) add("terms-missing", `Client-approved "${key}" wording is missing (English and Arabic).`);
  }
  if (!c.providers.payment) add("payment-provider-missing", "No approved, client-owned payment gateway is configured.");
  if (!c.providers.storage) add("storage-provider-missing", "No approved, client-owned private file storage is configured.");
  if (!c.providers.orders) add("order-store-missing", "No client-owned order store is configured.");
  const ids = new Set<string>();
  for (const p of c.products) { if (ids.has(p.id)) add("duplicate-id", `Duplicate product id "${p.id}".`); ids.add(p.id); }
  return issues;
}
