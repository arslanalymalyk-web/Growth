import Link from "next/link";
import { siteUrl } from "@/i18n/config";
import { breadcrumbJsonLd } from "@/seo/jsonld.ts";
import { JsonLd } from "../seo/JsonLd";
import { ChevronIcon } from "./Icons";

export interface Crumb { label: string; href?: string }

/** Logical breadcrumb trail; the separator flips in RTL and the last item is the current page. */
export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  const trail = breadcrumbJsonLd(siteUrl(), items.map((c, i) => ({ name: c.label, path: c.href && i < items.length - 1 ? c.href.split("#")[0] : undefined })));
  return (
    <>
    <JsonLd data={trail} />
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-navy-300">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-gold-300">{item.label}</Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-ivory-50" : undefined}>{item.label}</span>
              )}
              {!last && <ChevronIcon className="size-3.5 text-gold-400" />}
            </li>
          );
        })}
      </ol>
    </nav>
    </>
  );
}
