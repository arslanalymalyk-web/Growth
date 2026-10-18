import type { Locale } from "@/i18n/config";
import { industriesAr } from "./industries.ar";
import { industriesEn, type IndustryBody } from "./industries.en";
import type { IndustriesContent, IndustryCopy, ReviewStatus } from "../types";

// Related insights are empty on purpose: no articles have been supplied. Editors add them in the CMS.
const build = (review: ReviewStatus, rows: Record<string, IndustryBody>): IndustryCopy[] =>
  Object.entries(rows).map(([id, body]) => ({ id, review, insights: [], ...body }));

const shell = {
  en: {
    meta: { title: "Industries | Growth Blueprint Advisory", description: "Advisory for businesses across key sectors entering or growing in Saudi Arabia." },
    hero: { eyebrow: "Industries", title: "Sector focus for Saudi Arabia's next chapter", intro: "Practical advisory for organisations in key sectors that are entering, establishing or growing in Saudi Arabia." },
    gridTitle: "Our industry focus",
    labels: {
      context: "Sector context", challenges: "Sector challenges", help: "How we may help", outputs: "Possible engagement outputs",
      outputsNote: "Depending on the engagement, the work may include:", questions: "Readiness questions",
      insights: "Related insights", insightsEmpty: "No related insights have been published yet.", allIndustries: "All industries",
    },
  },
  ar: {
    meta: { title: "القطاعات | Growth Blueprint Advisory", description: "استشارات للشركات في القطاعات الرئيسية التي تدخل المملكة العربية السعودية أو تنمو فيها." },
    hero: { eyebrow: "القطاعات", title: "تركيز قطاعي للفصل القادم من مسيرة السعودية", intro: "استشارات عملية للمؤسسات في القطاعات الرئيسية التي تدخل المملكة العربية السعودية أو تؤسس حضورها أو تنمو فيها." },
    gridTitle: "تركيزنا القطاعي",
    labels: {
      context: "سياق القطاع", challenges: "تحديات القطاع", help: "كيف قد نساعد", outputs: "مخرجات محتملة للمهمة",
      outputsNote: "بحسب المهمة، قد يشمل العمل ما يلي:", questions: "أسئلة الجاهزية",
      insights: "رؤى ذات صلة", insightsEmpty: "لم تُنشر رؤى ذات صلة بعد.", allIndustries: "جميع القطاعات",
    },
  },
} as const;

export const sampleIndustries: Record<Locale, IndustriesContent> = {
  en: { review: "draft", ...shell.en, items: build("draft", industriesEn) },
  ar: { review: "needs-professional-review", ...shell.ar, items: build("needs-professional-review", industriesAr) },
};
