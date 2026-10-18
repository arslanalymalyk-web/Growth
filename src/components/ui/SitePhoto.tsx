import Image from "next/image";
import { photos, type PhotoId } from "@/content/photos";
import type { Locale } from "@/i18n/config";

/** Optimised, responsive photograph from the supplied set. `fill` mode covers its (relatively positioned) parent. */
export function SitePhoto({ id, locale = "en", className = "", sizes, priority = false, fill = false, decorative = false, position }: {
  id: PhotoId; locale?: Locale; className?: string; sizes: string; priority?: boolean; fill?: boolean; decorative?: boolean; position?: string;
}) {
  const p = photos[id];
  const alt = decorative ? "" : p.alt[locale];
  const style = position ? { objectPosition: position } : undefined;
  return fill
    ? <Image src={p.src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} style={style} />
    : <Image src={p.src} alt={alt} width={p.width} height={p.height} sizes={sizes} priority={priority} className={`object-cover ${className}`} style={style} />;
}
