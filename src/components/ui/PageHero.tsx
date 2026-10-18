import type { ReviewStatus, UiStrings } from "@/content/types";
import type { PhotoId } from "@/content/photos";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Container } from "./Section";
import { SitePhoto } from "./SitePhoto";

/** Shows a small notice while copy is not yet approved. Never shown for approved content. */
export function DraftNotice({ review, ui }: { review: ReviewStatus; ui: UiStrings }) {
  if (review === "approved") return null;
  return (
    <p className="mt-6 inline-block border border-gold-400/60 px-3 py-1.5 text-xs text-gold-300">
      {review === "needs-professional-review" ? ui.review.needsReview : ui.review.draft}
    </p>
  );
}

interface Props {
  ui: UiStrings;
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  tagline?: string;
  intro: string;
  review: ReviewStatus;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  meta?: React.ReactNode;
  /** Optional full-bleed photograph behind the hero (decorative; text stays on a navy scrim). */
  photo?: { id: PhotoId; position?: string };
}

export function PageHero({ ui, crumbs, eyebrow, title, tagline, intro, review, actions, aside, meta, photo }: Props) {
  return (
    <section aria-labelledby="page-title" className="relative isolate overflow-hidden bg-navy-900 text-ivory-50">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgb(184_148_77/0.22),transparent_55%),linear-gradient(160deg,var(--color-navy-800),var(--color-navy-950))]" />
      {photo ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <SitePhoto id={photo.id} fill decorative priority sizes="100vw" position={photo.position} />
          <div className="hero-scrim absolute inset-0" />
        </div>
      ) : (
        <div aria-hidden="true" className="lattice absolute inset-0 -z-10 opacity-80 [mask-image:linear-gradient(90deg,transparent,black_70%)] rtl:[mask-image:linear-gradient(270deg,transparent,black_70%)]" />
      )}
      <Container className={`py-10 sm:py-14 lg:min-h-[22rem] lg:py-20 ${aside ? "grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]" : "flex flex-col justify-center"}`}>
        <div>
          <Breadcrumbs items={crumbs} label={ui.breadcrumbLabel} />
          <p className="eyebrow eyebrow-line mt-8 text-gold-400">{eyebrow}</p>
          <h1 id="page-title" className="mt-3 text-4xl text-ivory-50 sm:text-5xl lg:text-6xl">{title}</h1>
          <span aria-hidden="true" className="gold-rule" />
          {tagline ? <p className="mt-4 font-display text-xl text-gold-300 sm:text-2xl">{tagline}</p> : null}
          <p className="mt-5 max-w-2xl text-base text-ivory-50/85 sm:text-lg">{intro}</p>
          {meta ? <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-navy-300">{meta}</div> : null}
          {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
          <DraftNotice review={review} ui={ui} />
        </div>
        {aside}
      </Container>
    </section>
  );
}
