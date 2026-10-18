import Link from "next/link";
import type { IconName } from "@/content/types";
import { ArrowIcon, Icon } from "./Icons";
import type { PhotoId } from "@/content/photos";
import type { Locale } from "@/i18n/config";
import { ImagePlaceholder } from "./ImagePlaceholder";
import { SitePhoto } from "./SitePhoto";

/** Whole-card link (the title link stretches over the card). Used for services. */
export function ServiceCard({ href, icon, title, summary, learnMore }: { href: string; icon: IconName; title: string; summary: string; learnMore: string }) {
  return (
    <li className="group relative flex flex-col border border-ivory-300 bg-ivory-50 p-6 transition-colors hover:border-gold-500 sm:p-7">
      <span className="text-gold-500"><Icon name={icon} className="size-10" /></span>
      <h3 className="mt-5 text-xl text-navy-900">
        <Link href={href} className="after:absolute after:inset-0">{title}</Link>
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink-muted">{summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 group-hover:text-navy-900" aria-hidden="true">
        {learnMore} <ArrowIcon />
      </span>
    </li>
  );
}

/** Industry card with an image slot (placeholder until approved photography exists). */
export function IndustryCard({ href, title, tagline, imageLabel, learnMore, photoId, locale }: { href: string; title: string; tagline: string; imageLabel: string; learnMore: string; photoId?: PhotoId | null; locale?: Locale }) {
  return (
    <li className="group relative flex flex-col border border-ivory-300 bg-ivory-50 transition-colors hover:border-gold-500">
      {photoId ? (
        <div className="relative aspect-[16/9] overflow-hidden"><SitePhoto id={photoId} locale={locale} fill sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw" /></div>
      ) : (
        <ImagePlaceholder label={imageLabel} className="aspect-[16/9]" />
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-xl text-navy-900 sm:text-2xl">
          <Link href={href} className="after:absolute after:inset-0">{title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-sm text-ink-muted">{tagline}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700 group-hover:text-navy-900" aria-hidden="true">
          {learnMore} <ArrowIcon />
        </span>
      </div>
    </li>
  );
}
