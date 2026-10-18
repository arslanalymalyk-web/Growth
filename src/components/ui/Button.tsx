import Link from "next/link";
import { eventForHref } from "@/analytics/events.ts";
import { ArrowIcon } from "./Icons";

type Variant = "primary" | "outline" | "outline-light" | "ghost-gold";

const base =
  "inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide transition-colors min-h-12 text-center";
const variants: Record<Variant, string> = {
  primary: "bg-gold-400 text-navy-950 hover:bg-gold-300",
  outline: "border border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-ivory-50",
  "outline-light": "border border-ivory-50/70 text-ivory-50 hover:bg-ivory-50 hover:text-navy-900",
  "ghost-gold": "px-0 min-h-0 py-1 text-gold-700 hover:text-navy-900",
};

interface Props {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function ButtonLink({ href, variant = "primary", arrow = true, className = "", children }: Props) {
  return (
    <Link href={href} data-track={eventForHref(href) ?? undefined} className={`${base} ${variants[variant]} ${className}`}>
      <span>{children}</span>
      {arrow && <ArrowIcon />}
    </Link>
  );
}
