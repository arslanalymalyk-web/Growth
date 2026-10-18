import { getContactUi } from "@/content";
import type { Locale } from "@/i18n/config";
import { localizeContact } from "@/contact/localize.ts";
import { getContactRuntime } from "@/contact/load.ts";
import { Section } from "../ui/Section";
import { DemoBanner } from "../scorecard/DemoBanner";
import { NewsletterSignup } from "./NewsletterSignup";

/** Newsletter signup block for content pages (Insights). Server wrapper: only the mode and approved wording reach the client. */
export async function NewsletterSection({ locale }: { locale: Locale }) {
  const rt = await getContactRuntime();
  const ui = getContactUi(locale);
  const m = rt.newsletter;
  const consentText = localizeContact(m.config, locale).terms.newsletterConsent;
  return (
    <Section tone="ivory-deep">
      {m.mode === "demo" && <div className="mb-6"><DemoBanner text={ui.demo.banner} /></div>}
      <NewsletterSignup mode={m.mode} ui={ui} locale={locale} consentText={consentText} variant="section" />
    </Section>
  );
}
