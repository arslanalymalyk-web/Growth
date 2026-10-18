"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowIcon } from "../ui/Icons";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export interface InsightCardData {
  id: string;
  href: string;
  title: string;
  excerpt: string;
  categoryId: string;
  categoryLabel: string;
  dateLabel: string;
  draft: boolean;
}

interface Props {
  cards: InsightCardData[];
  categories: { id: string; label: string }[];
  labels: { all: string; filterLabel: string; draftPreview: string; read: string; noneInCategory: string };
  imageLabel: string;
}

/** Category filter + article cards. Filtering is client-side so the page stays statically rendered. */
export function InsightsBrowser({ cards, categories, labels, imageLabel }: Props) {
  const [active, setActive] = useState<string>("all");
  const visible = active === "all" ? cards : cards.filter((c) => c.categoryId === active);
  const chips = [{ id: "all", label: labels.all }, ...categories];

  return (
    <div>
      <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(c.id)}
              className={`min-h-11 border px-4 text-sm font-semibold transition-colors ${on ? "border-navy-900 bg-navy-900 text-ivory-50" : "border-ivory-300 bg-ivory-50 text-navy-900 hover:border-gold-500"}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">{visible.length}</p>

      {visible.length ? (
        <ul className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => (
            <li key={c.id} className="group relative flex flex-col">
              <ImagePlaceholder label={imageLabel} className="aspect-[16/10]" />
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="eyebrow text-gold-700">{c.categoryLabel}</span>
                <span className="text-ink-muted">{c.dateLabel}</span>
                {c.draft && <span className="border border-gold-700 px-1.5 py-0.5 font-semibold text-gold-700">{labels.draftPreview}</span>}
              </div>
              <h3 className="mt-2 text-xl text-navy-900 sm:text-2xl">
                <Link href={c.href} className="after:absolute after:inset-0 group-hover:text-gold-700">{c.title}</Link>
              </h3>
              <p className="mt-2 flex-1 text-sm text-ink-muted">{c.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700" aria-hidden="true">{labels.read} <ArrowIcon /></span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 border border-dashed border-ivory-300 p-5 text-ink-muted">{labels.noneInCategory}</p>
      )}
    </div>
  );
}
