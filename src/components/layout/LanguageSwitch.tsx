"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { localeMeta, locales, type Locale } from "@/i18n/config";
import { pathInLocale } from "@/i18n/routes";

interface Props {
  locale: Locale;
  label: string;
  className?: string;
  /** Insight slugs that exist in every language (so article pages keep their page when switching). */
  articleSlugs?: string[];
}

/** Switches language while staying on the equivalent page (and section) when a translation exists. */
export function LanguageSwitch({ locale, label, className = "", articleSlugs = [] }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav aria-label={label} className={`flex items-center gap-1 text-sm ${className}`}>
      {locales.map((code, i) => {
        const current = code === locale;
        const href = pathInLocale(pathname, code, articleSlugs);
        return (
          <span key={code} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true" className="text-navy-300/60">|</span>}
            {current ? (
              <span aria-current="true" className="px-1.5 py-1 font-semibold text-ivory-50">{code === "en" ? "EN" : "AR"}</span>
            ) : (
              <Link
                href={href}
                lang={code}
                hrefLang={code}
                aria-label={localeMeta[code].name}
                className="px-1.5 py-1 text-navy-300 hover:text-ivory-50"
                onClick={(e) => {
                  const hash = window.location.hash;
                  if (hash) { e.preventDefault(); router.push(`${href}${hash}`); }
                }}
              >
                {code === "en" ? "EN" : "AR"}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
