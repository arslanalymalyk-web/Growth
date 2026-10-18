import type { Locale } from "@/i18n/config";

/**
 * Photography supplied by the client in the visual-reference archive (standalone images only; screenshots of mock-up pages
 * are never used). Each image is used in ONE place. Provenance, licence and whether the images are AI-generated or stock must
 * be confirmed by the client before launch (see docs/reference-map.md). Alt text is descriptive; Arabic is draft copy.
 */
export interface Photo { src: string; width: number; height: number; alt: Record<Locale, string> }

export const photos = {
  skylineDusk: { src: "/images/skyline-dusk.webp", width: 1024, height: 1536, alt: { en: "Towers of a modern city district at sunset", ar: "أبراج حي حديث في المدينة وقت الغروب" } },
  districtSkyline: { src: "/images/district-skyline.webp", width: 724, height: 362, alt: { en: "Modern towers rising above a palm-lined district", ar: "أبراج حديثة تعلو حيًا تصطف فيه أشجار النخيل" } },
  businessMeeting: { src: "/images/business-meeting.webp", width: 724, height: 362, alt: { en: "Colleagues in a meeting around a table", ar: "زملاء في اجتماع حول طاولة" } },
  manufacturingFloor: { src: "/images/manufacturing-floor.webp", width: 724, height: 362, alt: { en: "A worker at a control panel on a factory production line", ar: "عامل أمام لوحة تحكم على خط إنتاج في مصنع" } },
  portLogistics: { src: "/images/port-logistics.webp", width: 724, height: 362, alt: { en: "Cranes and container ship at a port at dusk", ar: "رافعات وسفينة حاويات في ميناء عند الغروب" } },
  hospitalityLobby: { src: "/images/hospitality-lobby.webp", width: 724, height: 362, alt: { en: "A warmly lit hotel-style lobby with lounge seating", ar: "ردهة بإضاءة دافئة على طراز الفنادق مع مقاعد استراحة" } },
  engineeringWorkspace: { src: "/images/engineering-workspace.webp", width: 724, height: 362, alt: { en: "Engineers working at computers in a technical workspace", ar: "مهندسون يعملون على أجهزة حاسوب في مساحة عمل تقنية" } },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

/** Industries that have a supplied photograph. Others keep the labelled placeholder until the client provides one. */
const industryPhotos: Record<string, PhotoId> = {
  "real-estate": "districtSkyline",
  hospitality: "hospitalityLobby",
  "industry-manufacturing": "manufacturingFloor",
  "logistics-supply-chain": "portLogistics",
  "technology-digital-businesses": "engineeringWorkspace",
};
export const industryPhotoId = (industryId: string): PhotoId | null => industryPhotos[industryId] ?? null;
