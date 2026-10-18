import Link from "next/link";
import { formatPrice } from "@/booking/rules.ts";
import { formatDuration, formatFileSize } from "@/shop/rules.ts";
import type { LProduct } from "@/shop/types.ts";
import { fill } from "@/i18n/format";
import { routes } from "@/i18n/routes";
import type { HomeContent } from "@/content/types";
import { ConsultationBand } from "../home/HomeSections";
import { ButtonLink } from "../ui/Button";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { Section } from "../ui/Section";
import type { ShopCtx } from "./ShopFrame";

/** Product detail: price status, format, size, delivery method and licence/refund terms are shown before any purchase step. */
export function ProductDetail({ ctx, product, home }: { ctx: ShopCtx; product: LProduct; home: HomeContent }) {
  const { ui, locale, shop, sectorTitles } = ctx;
  const p = ui.product;
  const price = formatPrice(product.price, locale);
  const validity = shop.delivery.linkValiditySeconds ? formatDuration(shop.delivery.linkValiditySeconds, locale) : null;
  const paragraphs = product.description.split(/\n{2,}/).filter(Boolean);
  const sector = product.sectorId ? sectorTitles[product.sectorId] : null;
  const canBuy = product.state === "purchasable" || product.state === "preview";

  const row = (label: string, value: React.ReactNode) => (
    <div className="py-3"><dt className="text-sm text-ink-muted">{label}</dt><dd className="mt-1 text-navy-900">{value}</dd></div>
  );

  return (
    <>
      <Section tone="ivory" labelledBy="about-title">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div>
            {product.previewImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- remote CMS image host not configured yet
              <img src={product.previewImage.url} alt={product.previewImage.alt} className="mb-8 aspect-[16/10] w-full object-cover" />
            ) : (
              <ImagePlaceholder label={ui.catalogue.imagePending} className="mb-8 aspect-[16/10] w-full" />
            )}
            <h2 id="about-title" className="text-3xl text-navy-900">{p.about}</h2>
            <div className="mt-5 space-y-4 text-lg text-ink-muted">{paragraphs.map((t) => <p key={t}>{t}</p>)}</div>

            <h3 className="mt-10 text-2xl text-navy-900">{p.terms}</h3>
            <div className="mt-4 divide-y divide-ivory-300 border border-ivory-300 bg-ivory-50">
              {([["licence", p.licence], ["refund", p.refund]] as const).map(([key, title]) => (
                <details key={key} className="p-4">
                  <summary className="flex min-h-11 cursor-pointer items-center font-medium text-navy-900">{title}</summary>
                  <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{product[key] ?? p.termsPending}</p>
                </details>
              ))}
            </div>
          </div>

          <aside aria-labelledby="details-title" className="h-fit border border-gold-500 bg-ivory-50 p-6">
            <h2 id="details-title" className="text-2xl text-navy-900">{p.details}</h2>
            <dl className="mt-3 divide-y divide-ivory-300">
              {row(p.price, price ? (
                <>
                  <span dir="ltr" className="inline-block text-xl font-semibold">{price}</span>
                  {product.isPreview && <span className="mt-1 block border-s-2 border-gold-700 ps-2 text-xs font-medium text-gold-700">{ui.demo.price}</span>}
                </>
              ) : p.priceTbc)}
              {product.file && row(p.format, ui.formats[product.file.format])}
              {product.file && row(p.size, <span dir="ltr" className="inline-block">{formatFileSize(product.file.sizeBytes, locale)}</span>)}
              {product.file?.pages && row(p.pages, product.file.pages)}
              {product.file?.languages && row(p.language, product.file.languages.map((l) => p.languages[l]).join(locale === "ar" ? "، " : ", "))}
              {sector && row(p.sector, <Link href={routes.industry(locale, product.sectorId!)} className="inline-flex min-h-11 items-center underline hover:text-gold-700">{sector}</Link>)}
              {row(p.delivery, (
                <>
                  <span>{p.deliveryValue}</span>
                  <span className="mt-1 block text-sm text-ink-muted">{validity ? fill(p.validity, { duration: validity }) : p.validityTbc}</span>
                </>
              ))}
            </dl>
            {product.isPreview && <p className="mt-4 border-s-2 border-gold-700 ps-2 text-sm font-medium text-gold-700">{ui.demo.file}</p>}

            <div className="mt-6">
              {canBuy ? (
                <ButtonLink href={routes.productCheckout(locale, product.id)} className="w-full">{p.buy}</ButtonLink>
              ) : (
                <div className="border border-dashed border-ivory-300 p-4">
                  <p className="font-semibold text-navy-900">{p.buyUnavailable}</p>
                  <p className="mt-1 text-sm text-ink-muted">{p.buyUnavailableNote}</p>
                </div>
              )}
              {product.isPreview && <p className="mt-3 text-sm text-ink-muted">{p.previewNote}</p>}
            </div>
            <p className="mt-6"><Link href={routes.shop(locale)} className="inline-flex min-h-11 items-center text-sm font-semibold text-gold-700 underline hover:text-navy-900">{p.back}</Link></p>
          </aside>
        </div>
      </Section>
      <ConsultationBand content={home} ui={ctx.siteUi} locale={locale} />
    </>
  );
}
