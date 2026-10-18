"use client";

import Link from "next/link";
import { useState } from "react";
import { fill } from "@/i18n/format";
import { ArrowIcon } from "../ui/Icons";
import { ImagePlaceholder } from "../ui/ImagePlaceholder";

export interface ProductCardData {
  id: string;
  href: string;
  title: string;
  summary: string;
  sectorId: string | null;
  sectorLabel: string | null;
  formatId: string | null;
  formatLabel: string | null;
  sizeLabel: string | null;
  priceLabel: string | null;
  priceNote: string | null;
  image: { url: string; alt: string } | null;
  badge: string | null; // "Preview product" or "Not available yet"
  badgeTone: "preview" | "unavailable" | null;
}
interface Facet { id: string; label: string }
interface Props {
  cards: ProductCardData[];
  sectors: Facet[]; // empty = the data does not support a sector filter
  formats: Facet[]; // empty = the data does not support a format filter
  labels: { filters: string; sector: string; format: string; all: string; count: string; countOne: string; noMatch: string; clear: string; view: string; priceTbc: string; imagePending: string };
}

const chip = (on: boolean) => `min-h-11 border px-4 text-sm font-semibold transition-colors ${on ? "border-navy-900 bg-navy-900 text-ivory-50" : "border-ivory-300 bg-ivory-50 text-navy-900 hover:border-gold-500"}`;

/** Catalogue with filters that appear ONLY when the product data supports them (a facet needs two or more values). */
export function ShopBrowser({ cards, sectors, formats, labels }: Props) {
  const [sector, setSector] = useState("all");
  const [format, setFormat] = useState("all");
  const shown = cards.filter((c) => (sector === "all" || c.sectorId === sector) && (format === "all" || c.formatId === format));
  const filtered = sector !== "all" || format !== "all";

  const group = (name: string, items: Facet[], value: string, set: (v: string) => void) => (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold text-navy-900">{name}</legend>
      <div className="flex flex-wrap gap-2">
        {[{ id: "all", label: labels.all }, ...items].map((f) => (
          <button key={f.id} type="button" aria-pressed={value === f.id} onClick={() => set(f.id)} className={chip(value === f.id)}>{f.label}</button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div>
      {(sectors.length > 0 || formats.length > 0) && (
        <div role="group" aria-label={labels.filters} className="flex flex-col gap-5 border-b border-ivory-300 pb-6">
          {sectors.length > 0 && group(labels.sector, sectors, sector, setSector)}
          {formats.length > 0 && group(labels.format, formats, format, setFormat)}
        </div>
      )}
      <p role="status" aria-live="polite" className="mt-4 text-sm text-ink-muted">{shown.length === 1 ? labels.countOne : fill(labels.count, { n: shown.length })}</p>

      {shown.length > 0 ? (
        <ul className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.id} className="group relative flex flex-col border border-ivory-300 bg-ivory-50 transition-colors hover:border-gold-500">
              {c.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote CMS image host not configured yet
                <img src={c.image.url} alt={c.image.alt} className="aspect-[16/10] w-full object-cover" />
              ) : (
                <ImagePlaceholder label={labels.imagePending} className="aspect-[16/10]" />
              )}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  {c.sectorLabel && <span className="eyebrow text-gold-700">{c.sectorLabel}</span>}
                  {c.badge && <span className={`border px-1.5 py-0.5 font-semibold ${c.badgeTone === "preview" ? "border-gold-700 text-gold-700" : "border-ink-muted text-ink-muted"}`}>{c.badge}</span>}
                </div>
                <h3 className="mt-2 text-xl text-navy-900 sm:text-2xl"><Link href={c.href} className="after:absolute after:inset-0 group-hover:text-gold-700">{c.title}</Link></h3>
                <p className="mt-2 flex-1 text-sm text-ink-muted">{c.summary}</p>
                <p className="mt-4 text-sm text-ink">{[c.formatLabel, c.sizeLabel].filter(Boolean).join(" · ")}</p>
                <p className="mt-1 text-lg font-semibold text-navy-900">{c.priceLabel ? <span dir="ltr" className="inline-block">{c.priceLabel}</span> : labels.priceTbc}</p>
                {c.priceNote && <p className="mt-1 border-s-2 border-gold-700 ps-2 text-xs font-medium text-gold-700">{c.priceNote}</p>}
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-700" aria-hidden="true">{labels.view} <ArrowIcon /></span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 max-w-xl border border-dashed border-ivory-300 p-6">
          <p className="text-ink-muted">{labels.noMatch}</p>
          {filtered && <button type="button" className="mt-4 min-h-11 border border-navy-900 px-5 text-sm font-semibold text-navy-900 hover:bg-navy-900 hover:text-ivory-50" onClick={() => { setSector("all"); setFormat("all"); }}>{labels.clear}</button>}
        </div>
      )}
    </div>
  );
}
