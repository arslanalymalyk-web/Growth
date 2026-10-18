interface Props {
  label: string;
  className?: string;
  tone?: "light" | "dark";
}

/** Visible stand-in for approved photography. Replace with a CMS image once the client supplies one. */
export function ImagePlaceholder({ label, className = "", tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex items-end overflow-hidden ${dark ? "bg-navy-800 placeholder-pattern-dark" : "bg-ivory-300 placeholder-pattern"} ${className}`}
    >
      <span className={`m-3 px-2.5 py-1 text-xs font-medium ${dark ? "bg-navy-950/70 text-navy-300" : "bg-ivory-50/90 text-ink-muted"}`}>
        {label}
      </span>
    </div>
  );
}
