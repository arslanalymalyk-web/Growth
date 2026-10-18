import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBanner } from "@/components/scorecard/DemoBanner";
import { Container, Section } from "@/components/ui/Section";
import { getBookingRuntime } from "@/booking/load.ts";
import { hasLocale } from "@/i18n/config";
import { routes } from "@/i18n/routes";

export const metadata: Metadata = { title: "Simulated checkout", robots: { index: false, follow: false } };

/**
 * Development-only stand-in for a payment provider's hosted checkout page. It 404s everywhere except the dev demo,
 * has no card fields, and takes no payment.
 */
export default async function Page({ params }: PageProps<"/[lang]/book-consultation/demo-checkout">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const rt = await getBookingRuntime();
  if (rt.mode !== "demo" || !rt.demoCopy) notFound();
  const c = rt.demoCopy[lang];
  const go = (step: "confirmation" | "pending" | "cancelled" | "error", id: string) => `${routes.bookingStep(lang, step)}?session=${id}`;
  const outcomes = [
    { href: go("confirmation", "demo_paid_1"), label: c.outcomes.paid, primary: true },
    { href: go("pending", "demo_pending_1"), label: c.outcomes.pending },
    { href: go("cancelled", "demo_cancelled_1"), label: c.outcomes.cancelled },
    { href: go("error", "demo_failed_1"), label: c.outcomes.failed },
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
