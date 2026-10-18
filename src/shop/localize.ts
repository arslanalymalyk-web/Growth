import { productState } from "./rules.ts";
import type { LocalizedShop, Locale, ShopConfig, ShopMode } from "./types.ts";

/** Resolves a bilingual configuration to one language. Hidden products are dropped; the private file key is never included. */
export function localizeShop(c: ShopConfig, mode: ShopMode, locale: Locale, sectorSlugs: string[] = []): LocalizedShop {
  const t = (l: { en: string; ar: string } | null): string | null => (l ? l[locale] : null);
  const products: LocalizedShop["products"] = [];
  for (const p of c.products) {
    const state = productState(p, mode, sectorSlugs);
    if (state === "hidden") continue;
    products.push({
      id: p.id, state, isPreview: p.isPreview, sectorId: p.sectorId,
      title: p.title[locale], summary: p.summary[locale], description: p.description[locale],
      price: p.price,
      previewImage: p.previewImage ? { url: p.previewImage.url, alt: p.previewImage.alt[locale] } : null,
      file: p.file ? { format: p.file.format, sizeBytes: p.file.sizeBytes, pages: p.file.pages, languages: p.file.languages } : null,
      licence: t(p.licence), refund: t(p.refund),
    });
  }
  return {
    isDemo: c.isDemo,
    products,
    delivery: { method: c.delivery.method, linkValiditySeconds: c.delivery.linkValiditySeconds },
    terms: { purchaseTerms: t(c.terms.purchaseTerms), purchaseCommunications: t(c.terms.purchaseCommunications), marketingConsent: t(c.terms.marketingConsent), privacy: t(c.terms.privacy) },
  };
}
