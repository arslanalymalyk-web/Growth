import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/scorecard/DemoBanner";
import { Container, Section } from "@/components/ui/Section";
import { hasLocale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { getShopRuntime } from "@/shop/load.ts";
import { productState } from "@/shop/rules.ts";

export const metadata: Metadata = { title: "Simulated checkout", robots: { index: false, follow: false } };

/**
 * Development-only stand-in for a payment provider's hosted checkout page. It 404s everywhere except the dev demo, has no
 * card fields, takes no payment and records no order.
 */
export default async function Page({ params, searchParams }: PageProps<"/[lang]/shop/demo-checkout">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const rt = await getShopRuntime();
  if (rt.mode !== "demo" || !rt.demo) notFound();
  const raw = (await searchParams).product;
  const id = Array.isArray(raw) ? raw[0] : raw;
  const product = rt.config.products.find((p) => p.id === id);
  if (!product || productState(product, rt.mode, rt.sectorSlugs) === "hidden") notFound();
  const c = rt.demo.copy[lang];
  const go = (step: "confirmation" | "pending" | "failed", outcome: string) => `${routes.shopOrder(lang, step)}?session=demo_${outcome}_${product.id}`;
  const outcomes = [
    { href: go("confirmation", "paid"), label: c.outcomes.paid, primary: true },
    { href: go("pending", "pending"), label: c.outcomes.pending },
    { href: go("failed", "failed"), label: c.outcomes.failed },
    { href: go("failed", "cancelled"), label: c.outcomes.cancelled },
    { href: go("failed", "expired"), label: c.outcomes.expired },
  ];
  return (
    <>
      <DemoBanner text={c.banner} />
      <Section tone="ivory" labelledBy="demo-checkout-title">
        <Container>
          <div className="max-w-2xl border border-gold-500 bg-ivory-50 p-6 sm:p-10">
            <h1 id="demo-checkout-title" className="text-3xl text-navy-900 sm:text-4xl">{c.title}</h1>
            <p className="mt-4 text-ink-muted">{c.body}</p>
            <p className="mt-6 font-medium text-navy-900">{c.prompt}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {outcomes.map((o) => (
                <li key={o.href}>
                  <Link href={o.href} className={`inline-flex min-h-12 w-full items-center justify-center px-6 py-3 text-sm font-semibold sm:w-auto ${o.primary ? "bg-gold-400 text-navy-950 hover:bg-gold-300" : "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50"}`}>{o.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
