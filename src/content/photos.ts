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
  fmcgShopper: { src: "/images/fmcg.webp", width: 630, height: 462, alt: { en: "A shopper choosing products in a well-stocked Saudi supermarket", ar: "متسوقة تختار منتجات في سوبرماركت سعودي مجهّز جيدًا" } },
  healthcareLab: { src: "/images/healthcare.webp", width: 638, height: 394, alt: { en: "A scientist using a microscope in a laboratory with a city skyline behind", ar: "عالمة تستخدم مجهرًا في مختبر وخلفها أفق المدينة" } },
  constructionSite: { src: "/images/construction.webp", width: 628, height: 438, alt: { en: "Two engineers reviewing a construction site at sunset", ar: "مهندسان يراجعان موقع بناء عند الغروب" } },
  retailArcade: { src: "/images/retail.webp", width: 637, height: 484, alt: { en: "Shoppers walking through a lit retail district in the evening", ar: "متسوقون يسيرون في منطقة تجارية مضاءة مساءً" } },
  professionalMeeting: { src: "/images/professional.webp", width: 634, height: 469, alt: { en: "A business meeting in an office overlooking the skyline", ar: "اجتماع عمل في مكتب يطل على أفق المدينة" } },
  heritageDates: { src: "/images/fmcg-overview.webp", width: 540, height: 326, alt: { en: "Dates, Arabic coffee pot and a heritage fort", ar: "تمور ودلّة قهوة عربية وقلعة تراثية" } },
  founderPortrait: { src: "/images/founder.webp", width: 669, height: 358, alt: { en: "A Saudi business leader looking over the city skyline", ar: "قائد أعمال سعودي يتأمل أفق المدينة" } },
  insightSkyline: { src: "/images/insight1.webp", width: 639, height: 237, alt: { en: "City skyline at dusk", ar: "أفق المدينة عند الغسق" } },
  insightPavilion: { src: "/images/insight2.webp", width: 633, height: 237, alt: { en: "A modern pavilion canopy against a blue sky", ar: "مظلة مبنى حديث على خلفية سماء زرقاء" } },
  insightHeritage: { src: "/images/insight3.webp", width: 639, height: 237, alt: { en: "Palm trees and historic mud-brick architecture", ar: "نخيل وعمارة طينية تاريخية" } },
  desertRocks: { src: "/images/desert.webp", width: 723, height: 300, alt: { en: "Desert rock formations at sunset", ar: "تشكيلات صخرية صحراوية عند الغروب" } },
} satisfies Record<string, Photo>;

export type PhotoId = keyof typeof photos;

/** Industries that have a supplied photograph. Others keep the labelled placeholder until the client provides one. */
const industryPhotos: Record<string, PhotoId> = {
  "real-estate": "districtSkyline",
  hospitality: "hospitalityLobby",
  "industry-manufacturing": "manufacturingFloor",
  "logistics-supply-chain": "portLogistics",
  "technology-digital-businesses": "engineeringWorkspace",
  "fmcg-consumer-brands": "fmcgShopper",
  "healthcare-life-sciences": "healthcareLab",
  "construction-engineering": "constructionSite",
  "retail-ecommerce": "retailArcade",
  "professional-business-services": "professionalMeeting",
  "tourism-leisure": "desertRocks",
};
export const industryPhotoId = (industryId: string): PhotoId | null => industryPhotos[industryId] ?? null;

/** Photographs for the home-page insight cards, keyed by the home content item id. */
const insightPhotos: Record<string, PhotoId> = { "market-entry": "insightSkyline", "real-estate": "insightPavilion", hospitality: "insightHeritage" };
export const insightPhotoId = (id: string): PhotoId | null => insightPhotos[id] ?? null;
