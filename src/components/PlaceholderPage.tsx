import type { UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { routes } from "@/i18n/routes";
import { ButtonLink } from "./ui/Button";
import { Section } from "./ui/Section";

/** Honest "not available yet" page for journeys built in later stages. It has no form and collects nothing. */
export function PlaceholderPage({ ui, locale, kind }: { ui: UiStrings; locale: Locale; kind: "booking" | "scorecard" }) {
  const copy = ui.placeholder[kind];
  return (
    <Section tone="ivory" labelledBy="placeholder-title" className="min-h-[55vh]">
      <p className="inline-block border border-gold-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-700">{ui.placeholder.badge}</p>
      <h1 id="placeholder-title" className="mt-5 max-w-2xl text-4xl text-navy-900 sm:text-5xl">{copy.title}</h1>
      <p className="mt-5 max-w-xl text-lg text-ink-muted">{copy.body}</p>
      <div className="mt-9">
        <ButtonLink href={routes.home(locale)} variant="outline">{ui.placeholder.backHome}</ButtonLink>
      </div>
    </Section>
  );
}
