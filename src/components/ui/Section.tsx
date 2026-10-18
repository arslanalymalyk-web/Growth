type Tone = "ivory" | "ivory-deep" | "white" | "navy";

const tones: Record<Tone, string> = {
  ivory: "bg-ivory-100 text-ink",
  "ivory-deep": "bg-ivory-200 text-ink",
  white: "bg-ivory-50 text-ink",
  navy: "bg-navy-900 text-ivory-50",
};

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-5 sm:px-8 lg:px-10 ${className}`}>{children}</div>;
}

interface SectionProps {
  id?: string;
  tone?: Tone;
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, tone = "ivory", labelledBy, className = "", children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} py-16 sm:py-20 lg:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

interface HeadingProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Eyebrow + serif title + optional intro. Aligns to the inline start in both directions. */
export function SectionHeading({ id, eyebrow, title, intro, tone = "light", className = "" }: HeadingProps) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${className}`}>
      {eyebrow ? <p className={`eyebrow eyebrow-line ${dark ? "text-gold-400" : "text-gold-700"}`}>{eyebrow}</p> : null}
      <h2 id={id} className={`${eyebrow ? "mt-3 " : ""}text-3xl sm:text-4xl lg:text-[2.6rem] ${dark ? "text-ivory-50" : "text-navy-900"}`}>{title}</h2>
      {intro ? <p className={`mt-4 text-base sm:text-lg ${dark ? "text-navy-300" : "text-ink-muted"}`}>{intro}</p> : null}
    </div>
  );
}
