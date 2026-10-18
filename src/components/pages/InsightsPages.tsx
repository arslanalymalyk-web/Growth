import Link from "next/link";
import type { Article, HomeContent, InsightsContent, UiStrings } from "@/content/types";
import type { Locale } from "@/i18n/config";
import { formatDate } from "@/i18n/format";
import { hrefFor, routes } from "@/i18n/routes";
import { ConsultationBand } from "../home/HomeSections";
import { CtaBand } from "../ui/CtaBand";
import { ArrowIcon } from "../ui/Icons";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";
import { PageHero } from "../ui/PageHero";
import { Section, SectionHeading } from "../ui/Section";
import { InsightsBrowser, type InsightCardData } from "./InsightsBrowser";

interface Common { ui: UiStrings; locale: Locale; insights: InsightsContent; home: HomeContent }

const insightsLabel = (ui: UiStrings) => ui.nav.find((n) => n.id === "insights")!.label;
const categoryLabel = (c: InsightsContent, id: string) => c.categories.find((x) => x.id === id)?.label ?? "";
const dateLabel = (a: Article, c: InsightsContent, locale: Locale) => (a.publishDate ? formatDate(a.publishDate, locale) : c.labels.dateTbc);

export function InsightsListing({ ui, locale, insights, home, after }: Common & { after?: React.ReactNode }) {
  const cards: InsightCardData[] = insights.articles.map((a) => ({
    id: a.id,
    href: routes.insight(locale, a.id),
    title: a.title,
    excerpt: a.excerpt,
    categoryId: a.categoryId,
    categoryLabel: categoryLabel(insights, a.categoryId),
    dateLabel: dateLabel(a, insights, locale),
    draft: a.status === "draft-preview",
  }));
  return (
    <>
      <PageHero
        ui={ui}
        review={insights.review}
        crumbs={[{ label: ui.nav[0].label, href: routes.home(locale) }, { label: insightsLabel(ui) }]}
        eyebrow={insights.hero.eyebrow}
        title={insights.hero.title}
        intro={insights.hero.intro}
      />
      <Section tone="ivory">
        <h2 id="insights-list-title" className="sr-only">{insights.hero.title}</h2>
        {cards.length ? (
          <InsightsBrowser cards={cards} categories={insights.categories} labels={insights.labels} imageLabel={ui.imagePending} />
        ) : (
          <p className="max-w-xl border border-dashed border-ivory-300 p-6 text-lg text-ink-muted">{insights.labels.empty}</p>
        )}
      </Section>
      {after}
      <ConsultationBand content={home} ui={ui} locale={locale} />
    </>
  );
}

export function ArticlePage({ ui, locale, insights, article }: Omit<Common, "home"> & { article: Article }) {
  const { labels } = insights;
  const related = article.relatedIds.map((id) => insights.articles.find((a) => a.id === id)).filter((a): a is Article => Boolean(a && a.id !== article.id));
  const draft = article.status === "draft-preview";
  return (
    <>
      <PageHero
        ui={ui}
        review={article.review}
        crumbs={[
          { label: ui.nav[0].label, href: routes.home(locale) },
          { label: insightsLabel(ui), href: routes.insights(locale) },
          { label: article.title },
        ]}
        eyebrow={categoryLabel(insights, article.categoryId)}
        title={article.title}
        intro={article.excerpt}
        meta={
          <>
            {draft && <span className="border border-gold-400 px-2 py-0.5 text-xs font-semibold text-gold-300">{labels.draftPreview}</span>}
            <span>{labels.by} {article.author.name}{article.author.role ? `, ${article.author.role}` : ""}</span>
            {article.publishDate ? <time dateTime={article.publishDate}>{formatDate(article.publishDate, locale)}</time> : <span>{labels.dateTbc}</span>}
          </>
        }
      />

      <Section labelledBy="article-body-title" tone="ivory">
        <h2 id="article-body-title" className="sr-only">{article.title}</h2>
        {article.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CMS image host not configured yet
          <img src={article.heroImage.url} alt={article.heroImage.alt} className="aspect-[21/9] w-full object-cover" />
        ) : (
          <ImagePlaceholder label={ui.imagePending} className="aspect-[16/9] w-full sm:aspect-[21/9]" />
        )}
        <div className="mx-auto mt-10 max-w-3xl space-y-5 text-lg leading-relaxed text-ink">
          {article.body.map((block, i) => {
            if (block.type === "heading") return <h3 key={i} className="pt-4 text-3xl text-navy-900">{block.text}</h3>;
            if (block.type === "list") {
              return (
                <ul key={i} className="list-disc space-y-2 ps-6 marker:text-gold-500">
                  {block.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
              );
            }
            return <p key={i}>{block.text}</p>;
          })}
        </div>
        <p className="mx-auto mt-10 max-w-3xl">
          <Link href={routes.insights(locale)} className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-navy-900">
            <ArrowIcon className="size-4 rotate-180" /> {labels.back}
          </Link>
        </p>
      </Section>

      {related.length > 0 && (
        <Section labelledBy="related-articles-title" tone="ivory-deep">
          <SectionHeading id="related-articles-title" eyebrow="" title={labels.related} />
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {related.map((a) => (
              <li key={a.id} className="group relative border border-ivory-300 bg-ivory-50 p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="eyebrow text-gold-700">{categoryLabel(insights, a.categoryId)}</span>
                  {a.status === "draft-preview" && <span className="border border-gold-700 px-1.5 py-0.5 font-semibold text-gold-700">{labels.draftPreview}</span>}
                </div>
                <h3 className="mt-2 text-xl text-navy-900"><Link href={routes.insight(locale, a.id)} className="after:absolute after:inset-0 group-hover:text-gold-700">{a.title}</Link></h3>
                <p className="mt-2 text-sm text-ink-muted">{a.excerpt}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        id="next-step-title"
        title={article.nextStep.title}
        body={article.nextStep.body}
        primary={{ label: article.nextStep.cta.label, href: hrefFor(locale, article.nextStep.cta.target) }}
        secondary={{ label: ui.bookConsultation, href: routes.booking(locale) }}
      />
    </>
  );
}
