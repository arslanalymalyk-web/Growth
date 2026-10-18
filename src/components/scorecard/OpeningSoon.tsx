import type { ScorecardUi } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { ValidationIssue } from "@/scorecard/types.ts";
import { routes } from "@/i18n/routes";
import { ButtonLink } from "../ui/Button";
import { Section } from "../ui/Section";

/** "Opening soon" state. Collects no personal information: only links to the consultation journey. */
export function OpeningSoon({ ui, locale, issues }: { ui: ScorecardUi; locale: Locale; issues?: ValidationIssue[] }) {
  const c = ui.openingSoon;
  return (
    <Section tone="ivory" labelledBy="opening-soon-title">
      <div className="max-w-3xl border border-gold-500 bg-ivory-50 p-6 sm:p-10">
        <p className="inline-block border border-gold-700 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-gold-700">{c.badge}</p>
        <h2 id="opening-soon-title" className="mt-5 text-3xl text-navy-900 sm:text-4xl">{c.title}</h2>
        <p className="mt-4 text-lg text-ink-muted">{c.body}</p>
        <p className="mt-3 text-sm font-medium text-navy-900">{c.note}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={routes.booking(locale)}>{c.primaryCta}</ButtonLink>
          <ButtonLink href={routes.entering(locale)} variant="outline">{c.secondaryCta}</ButtonLink>
        </div>
      </div>
      {process.env.NODE_ENV !== "production" && issues && issues.length > 0 && (
        <details className="mt-8 max-w-3xl border border-dashed border-ivory-300 p-4 text-sm text-ink-muted" dir="ltr" lang="en">
          <summary className="cursor-pointer font-semibold text-navy-900">Developer only: why the scorecard is not live ({issues.length} issues)</summary>
          <ul className="mt-3 list-disc space-y-1 ps-5">
            {issues.map((i, n) => <li key={n}><code>{i.code}</code>: {i.message}</li>)}
          </ul>
          <p className="mt-3">Set SCORECARD_DEMO=1 with `npm run dev` to preview the clearly labelled demo fixture.</p>
        </details>
      )}
    </Section>
  );
}

