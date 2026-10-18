import { validateProduct } from "./validate.ts";
import type { FileFormat, LProduct, Locale, PaymentStatus, Product, ProductState, ShopMode } from "./types.ts";

/**
 * What a product may offer in each mode:
 *  - "demo" (development only): published preview fixtures are "preview"; everything else is hidden.
 *  - "live": a product is "purchasable" ONLY if fully valid and not a preview; everything else is hidden.
 *  - "unavailable" (providers/config not ready): approved, valid products are shown as "unavailable" (read-only);
 *    drafts, previews and anything invalid stay hidden.
 * Drafts and previews can therefore never be purchasable, or even visible, in production.
 */
export function productState(p: Product, mode: ShopMode, sectorSlugs: string[] = []): ProductState {
  if (mode === "demo") return p.isPreview && p.status === "published" ? "preview" : "hidden";
  if (p.isPreview || p.status !== "published") return "hidden";
  if (validateProduct(p, sectorSlugs).length > 0) return "hidden";
  return mode === "live" ? "purchasable" : "unavailable";
}

export function visibleProducts(products: Product[], mode: ShopMode, sectorSlugs: string[] = []): { product: Product; state: Exclude<ProductState, "hidden"> }[] {
  const out: { product: Product; state: Exclude<ProductState, "hidden"> }[] = [];
  for (const product of products) {
    const state = productState(product, mode, sectorSlugs);
    if (state !== "hidden") out.push({ product, state });
  }
  return out;
}

/** Filters are offered only when the data supports them: a facet needs at least two distinct values. */
export function catalogueFacets(products: Pick<LProduct, "sectorId" | "file">[]): { sectors: string[]; formats: FileFormat[] } {
  const sectors = [...new Set(products.map((p) => p.sectorId).filter((s): s is string => Boolean(s)))];
  const formats = [...new Set(products.map((p) => p.file?.format).filter((f): f is FileFormat => Boolean(f)))];
  return { sectors: sectors.length >= 2 ? sectors : [], formats: formats.length >= 2 ? formats : [] };
}

/** Decimal units (1 MB = 1,000,000 bytes), like most storage consoles. Arabic uses Latin digits to match the site. */
export function formatFileSize(bytes: number, locale: Locale): string {
  const unit = bytes >= 1e9 ? "gigabyte" : bytes >= 1e6 ? "megabyte" : "kilobyte";
  const value = bytes / (unit === "gigabyte" ? 1e9 : unit === "megabyte" ? 1e6 : 1e3);
  const tag = locale === "ar" ? "ar-SA-u-nu-latn" : "en-GB";
  return new Intl.NumberFormat(tag, { style: "unit", unit, unitDisplay: "short", maximumFractionDigits: 1 }).format(value);
}

// ---- Order return state -------------------------------------------------------------------------------------
export type OrderRoute = "confirmation" | "pending" | "failed";
export type OrderState = "confirmed" | "pending" | "failed" | "cancelled" | "checkout-expired" | "unverified";

/**
 * What an order-return page may show. "confirmed" (which reveals the secure-download panel) ONLY when the provider
 * verified payment server-side: never from the URL alone. Without a verified status the confirmation route shows
 * "unverified"; other routes show their own non-success state.
 */
export function deriveOrderState(route: OrderRoute, status: PaymentStatus | "no-session"): OrderState {
  if (status === "paid") return "confirmed";
  if (status === "pending") return "pending";
  if (status === "cancelled") return "cancelled";
  if (status === "failed") return "failed";
  if (status === "expired") return "checkout-expired";
  return route === "confirmation" ? "unverified" : route;
}

// ---- Buyer input --------------------------------------------------------------------------------------------
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export type BuyerErrorCode = "required" | "invalid" | "too-long";
export const checkEmail = (v: string): BuyerErrorCode | null => {
  const t = v.trim();
  if (!t) return "required";
  if (v.length > 160) return "too-long";
  return EMAIL.test(t) ? null : "invalid";
};

/** "15 seconds" / "10 minutes" with correct plural forms in English and Arabic (Latin digits, like the rest of the site). */
export function formatDuration(seconds: number, locale: Locale): string {
  const unit = seconds < 60 ? "second" : "minute";
  const value = unit === "second" ? seconds : Math.round(seconds / 60);
  const tag = locale === "ar" ? "ar-SA-u-nu-latn" : "en-GB";
  return new Intl.NumberFormat(tag, { style: "unit", unit, unitDisplay: "long" }).format(value);
}
