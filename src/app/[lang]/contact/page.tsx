import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContactUnavailable } from "@/components/contact/ContactUnavailable";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { DemoBanner } from "@/components/scorecard/DemoBanner";
import { PageHero } from "@/components/ui/PageHero";
import { SitePhoto } from "@/components/ui/SitePhoto";
import { Container } from "@/components/ui/Section";
import { getContactUi, getServicesContent, getUi } from "@/content";
import { getContactRuntime } from "@/contact/load.ts";
import { localizeContact } from "@/contact/localize.ts";
import { hasLocale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import Link from "next/link";
import { buildMetadata } from "@/seo/metadata.ts";
import { featureIndexing } from "@/seo/state.ts";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const ui = getContactUi(lang);
  const index = (await featureIndexing()).contact;
  return buildMetadata({ locale: lang, path: "/contact", title: ui.meta.title, description: ui.meta.description, index });
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const ui = getUi(lang);
  const cui = getContactUi(lang);
  const rt = await getContactRuntime();
  const m = rt.enquiry;
  const local = localizeContact(m.config, lang);
  const { data: services } = await getServicesContent(lang);
  const topics = services.items.map((s) => ({ id: s.id, label: s.title }));
  return (
    <>
      <PageHero
        ui={ui}
        review={cui.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(lang) }, { label: cui.crumb }]}
        eyebrow={cui.hero.eyebrow}
        title={cui.hero.title}
        intro={cui.hero.intro}
      />
      {m.mode === "demo" && <DemoBanner text={cui.demo.banner} />}
      {m.mode === "unavailable" ? (
        <ContactUnavailable ui={cui} locale={lang} issues={m.issues} />
      ) : (
        <section className="relative isolate overflow-hidden bg-navy-900 py-12 sm:py-16 lg:py-20">
          <div aria-hidden="true" className="lattice absolute inset-0 -z-10 opacity-70" />
          <Container className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div className="bg-ivory-50 p-5 text-ink sm:p-8 lg:p-10">
              <EnquiryForm
                fields={local.fields}
                topics={topics}
                consentText={local.terms.enquiryConsent}
                topicsForValidation={rt.topics}
                ui={cui}
                locale={lang}
                mode={m.mode}
                embedded
              />
            </div>
            <aside aria-labelledby="contact-side-title" className="space-y-6">
              <div className="relative aspect-[2/1] overflow-hidden border border-ivory-50/15">
                <SitePhoto id="businessMeeting" locale={lang} fill sizes="(min-width: 1024px) 28rem, 100vw" />
              </div>
              <div className="border border-ivory-50/15 p-6">
                <h2 id="contact-side-title" className="text-xl text-ivory-50">{cui.side.title}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {cui.side.items.map((i) => (
                    <li key={i.target}><Link href={routes[i.target === "booking" ? "booking" : i.target === "scorecard" ? "scorecard" : "entering"](lang)} className="inline-flex min-h-11 items-center font-medium text-gold-300 underline underline-offset-4 hover:text-ivory-50">{i.label}</Link></li>
                  ))}
                </ul>
              </div>
            </aside>
          </Container>
        </section>
      )}
    </>
  );
}
