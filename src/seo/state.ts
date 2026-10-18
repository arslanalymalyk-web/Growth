import { getBookingRuntime } from "@/booking/load.ts";
import { getContactRuntime } from "@/contact/load.ts";
import { getScorecard } from "@/scorecard/load.ts";
import { getShopRuntime } from "@/shop/load.ts";
import { getLegalUi } from "@/content";

/**
 * Page-level indexability for pages whose content depends on configuration. A page is indexable only when its feature is
 * LIVE (approved config + installed providers). "Opening soon", unavailable and demo states are never indexable, and
 * neither are legal pages until their text is approved. Metadata and the sitemap both read this, so they cannot disagree.
 */
export interface FeatureIndexing { booking: boolean; scorecard: boolean; contact: boolean; shop: boolean; privacy: boolean; terms: boolean }

export async function featureIndexing(): Promise<FeatureIndexing> {
  const [booking, scorecard, contact, shop] = await Promise.all([getBookingRuntime(), getScorecard(), getContactRuntime(), getShopRuntime()]);
  const legal = getLegalUi("en");
  const legalAr = getLegalUi("ar");
  return {
    booking: booking.mode === "live",
    scorecard: scorecard.mode === "live",
    contact: contact.enquiry.mode === "live",
    shop: shop.mode === "live",
    // Placeholder legal shells stay out of search until BOTH languages are approved by the legal adviser.
    privacy: legal.privacy.review === "approved" && legalAr.privacy.review === "approved",
    terms: legal.terms.review === "approved" && legalAr.terms.review === "approved",
  };
}
