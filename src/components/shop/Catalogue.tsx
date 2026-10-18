import { catalogueFacets, formatFileSize } from "@/shop/rules.ts";
import { formatPrice } from "@/booking/rules.ts";
import { routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { Section } from "../ui/Section";
import type { HomeContent } from "@/content/types";
import { ShopBrowser, type ProductCardData } from "./ShopBrowser";
import { ShopUnavailable } from "./ShopUnavailable";
import type { ShopCtx } from "./ShopFrame";
import type { ValidationIssue } from "@/shop/types.ts";

/** Catalogue view. With no approved products it shows the unavailable/empty state, never placeholder products. */
export function Catalogue({ ctx, home, issues }: { ctx: ShopCtx; home: HomeContent; issues: ValidationIssue[] }) {
  const { shop, ui, locale, sectorTitles } = ctx;
  if (shop.products.length === 0) {
    return ctx.mode === "unavailable" ? <ShopUnavailable ui={ui} locale={locale} issues={issues} /> : (
      <Section tone="ivory" labelledBy="shop-empty"><h2 id="shop-empty" className="text-2xl text-navy-900">{ui.catalogue.title}</h2><p className="mt-4 max-w-xl border border-dashed border-ivory-300 p-6 text-ink-muted">{ui.catalogue.empty}</p></Section>
    );
  }
  const facets = catalogueFacets(shop.products);
  const cards: ProductCardData[] = shop.products.map((p) => {
    const price = formatPrice(p.price, locale);
    return {
      id: p.id, href: routes.product(locale, p.id), title: p.title, summary: p.summary,
      sectorId: p.sectorId, sectorLabel: p.sectorId ? sectorTitles[p.sectorId] ?? null : null,
      formatId: p.file?.format ?? null, formatLabel: p.file ? ui.formats[p.file.format] : null,
      sizeLabel: p.file ? formatFileSize(p.file.sizeBytes, locale) : null,
      priceLabel: price, priceNote: price && p.isPreview ? ui.demo.price : null,
      image: p.previewImage,
      badge: p.state === "preview" ? ui.previewBadge : p.state === "unavailable" ? ui.unavailable.badge : null,
      badgeTone: p.state === "preview" ? "preview" : p.state === "unavailable" ? "unavailable" : null,
    };
  });
  return (
    <>
      <Section tone="ivory" labelledBy="catalogue-title">
        <h2 id="catalogue-title" className="mb-8 text-3xl text-navy-900">{ui.catalogue.title}</h2>
        <ShopBrowser
          cards={cards}
          sectors={facets.sectors.map((id) => ({ id, label: sectorTitles[id] ?? id }))}
          formats={facets.formats.map((id) => ({ id, label: ui.formats[id] }))}
          labels={ui.catalogue}
        />
      </Section>
      <ConsultationBand content={home} ui={ctx.siteUi} locale={locale} />
    </>
  );
}

