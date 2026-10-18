import type { Locale } from "@/i18n/config";

/** Icon keys are plain strings so editors can choose them in Sanity. */
export type IconName =
  | "search" | "document" | "network" | "gear" | "users" | "chart" | "leaf" | "nodes" | "door" | "check" | "person" | "chat" | "flag";

export interface PathwayItem { id: string; icon: IconName; title: string; body: string; linkLabel: string }
export interface ServiceItem { id: string; icon: IconName; title: string; description: string }
export interface IndustryItem { id: string; title: string }
export interface ApproachStep { id: string; icon: IconName; title: string; description: string }
export interface InsightItem { id: string; title: string; excerpt: string; isSample?: boolean }

export interface HomeContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; headline: string; subheadline: string; primaryCtaLabel: string; secondaryCtaLabel: string };
  pathways: PathwayItem[];
  services: { eyebrow: string; title: string; intro: string; items: ServiceItem[] };
  industries: { eyebrow: string; title: string; intro: string; items: IndustryItem[] };
  approach: { eyebrow: string; title: string; intro: string; steps: ApproachStep[] };
  founder: { eyebrow: string; title: string; body: string };
  insights: { eyebrow: string; title: string; intro: string; items: InsightItem[] };
  scorecard: { eyebrow: string; title: string; body: string; ctaLabel: string };
  consultation: { eyebrow: string; title: string; body: string; ctaLabel: string };
}

/** A nav entry points to a page (`path`) or a homepage section (`anchor`); empty for both means the homepage. */
export interface NavItem { id: string; label: string; path?: string; anchor?: string }

/** Interface strings shared across pages (navigation, footer, accessibility labels, placeholders). */
export interface UiStrings {
  brandName: string;
  brandDescriptor: string;
  skipToContent: string;
  nav: NavItem[];
  navLabel: string;
  menuOpen: string;
  menuClose: string;
  languageLabel: string;
  /** Distinct accessible name for the footer language switch (landmarks must be uniquely labelled). */
  languageLabelFooter: string;
  bookConsultation: string;
  takeScorecard: string;
  imagePending: string;
  sampleBadge: string;
  breadcrumbLabel: string;
  learnMore: string;
  viewAllServices: string;
  viewAllIndustries: string;
  review: { draft: string; needsReview: string };
  viewAllInsights: string;
  ourStory: string;
  exploreApproach: string;
  /** Journey pages linked from the footer (routes that exist). */
  journeyNav: NavItem[];
  footer: { tagline: string; navigation: string; journeys: string; getInTouch: string; rights: string; contact: string; legalLabel: string; privacy: string; terms: string };
  placeholder: {
    badge: string;
    backHome: string;
    booking: { title: string; body: string };
    scorecard: { title: string; body: string };
  };
}

/** Editorial status of a piece of copy. Everything written in this build is "draft"; Arabic is "needs-professional-review". */
export type ReviewStatus = "approved" | "draft" | "needs-professional-review";

export interface ServiceCopy {
  id: string; // matches catalog id / URL slug
  review: ReviewStatus;
  /** Optional editable search/social overrides. Falls back to the page copy. */
  seo?: { title?: string; description?: string };
  title: string;
  summary: string;
  intro: string;
  audience: string[];
  topics: string[];
  outputs: string[];
}

export interface ServicesContent {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  groups: Record<"enter" | "grow", { title: string; intro: string }>;
  journey: { eyebrow: string; title: string; intro: string };
  labels: { audience: string; topics: string; outputs: string; outputsNote: string; related: string; allServices: string };
  items: ServiceCopy[];
}

export interface IndustryCopy {
  id: string; // matches catalog id / URL slug
  review: ReviewStatus;
  /** Optional editable search/social overrides. Falls back to the page copy. */
  seo?: { title?: string; description?: string };
  title: string;
  tagline: string;
  intro: string;
  context: string;
  challenges: string[];
  help: string[];
  outputs: string[];
  questions: string[];
  /** Related insight articles. Empty until the client publishes articles. */
  insights: { id: string; title: string; excerpt: string }[];
}

export interface IndustriesContent {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  gridTitle: string;
  labels: {
    context: string; challenges: string; help: string; outputs: string; outputsNote: string;
    questions: string; insights: string; insightsEmpty: string; allIndustries: string;
  };
  items: IndustryCopy[];
}

export type ContentSource = "sample" | "sanity";
export interface Loaded<T> { data: T; source: ContentSource; locale: Locale }

// ---- Stage 3 pages: about, approach, journeys, insights ------------------------------------------------

/** Where a link points. Resolved to a locale-aware URL by `hrefFor` in i18n/routes.ts. */
export type LinkTarget =
  | { kind: "booking" | "scorecard" | "services" | "industries" | "entering" | "growing" | "approach" | "about" | "insights" }
  | { kind: "service" | "industry" | "insight"; slug: string };
export interface LabelledLink { label: string; target: LinkTarget }

/** Internal notes for editors (never rendered): claims that need client confirmation before launch. */
export interface Editorial { review: ReviewStatus; editorialNotes: string[] }

export interface AboutContent extends Editorial {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  founder: { eyebrow: string; title: string; paragraphs: string[] };
  principles: { eyebrow: string; title: string; intro: string; items: { id: string; icon: IconName; title: string; body: string }[] };
  specialists: { eyebrow: string; title: string; paragraphs: string[] };
}

export interface ApproachContent extends Editorial {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  intro: { eyebrow: string; title: string; body: string };
  labels: { step: string; points: string; gate: string; keyOutput: string };
  steps: { id: string; icon: IconName; title: string; summary: string; points: string[] }[];
  /** gates[i] is the decision gate that follows steps[i]. */
  gates: { id: string; title: string; body: string; keyOutput: string }[];
  services: { eyebrow: string; title: string; intro: string; links: LabelledLink[] };
  scope: { title: string; body: string };
}

export interface JourneyStage {
  id: string;
  icon: IconName;
  title: string;
  summary: string;
  points: string[];
  links: LabelledLink[];
}
export interface JourneyContent extends Editorial {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  audience: { title: string; items: string[] };
  stagesHeading: { eyebrow: string; title: string; intro: string };
  labels: { stage: string; points: string };
  stages: JourneyStage[];
  scope: { title: string; body: string };
  related: { title: string; serviceIds: string[] };
  cta: { eyebrow: string; title: string; body: string; ctaLabel: string };
}
export type JourneyId = "entering" | "growing";

export type ArticleStatus = "published" | "draft-preview";
/** Simple typed blocks. Map from Portable Text when Sanity is connected. */
export type ArticleBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export interface Article {
  id: string; // URL slug, identical in every language
  /** Optional editable search/social overrides. Falls back to the page copy. */
  seo?: { title?: string; description?: string };
  status: ArticleStatus; // "draft-preview" entries are hidden in production unless explicitly published
  review: ReviewStatus;
  categoryId: string;
  title: string;
  excerpt: string;
  author: { name: string; role?: string };
  publishDate: string | null; // ISO date (YYYY-MM-DD)
  heroImage: { url: string; alt: string } | null; // null = approved-photography placeholder
  body: ArticleBlock[];
  relatedIds: string[];
  nextStep: { title: string; body: string; cta: LabelledLink };
}

export interface InsightsContent extends Editorial {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  categories: { id: string; label: string }[];
  labels: {
    all: string; filterLabel: string; draftPreview: string; dateTbc: string; by: string; read: string;
    related: string; back: string; empty: string; noneInCategory: string;
  };
  articles: Article[];
}

// ---- Readiness scorecard interface copy (not assessment content) --------------------------------------
/** Strings contain {n}/{current}/{total} placeholders replaced by `fill()`; functions are not serialisable to client components. */
export interface ScorecardUi {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  openingSoon: { badge: string; title: string; body: string; note: string; primaryCta: string; secondaryCta: string };
  overview: { title: string; items: { title: string; body: string }[] };
  before: { title: string; items: string[]; startCta: string };
  consentBox: { title: string; processing: string; newsletter: string; privacy: string };
  demo: { banner: string; resultBanner: string };
  assessment: {
    title: string; instructionsTitle: string; instructions: string[]; time: string;
    progressLabel: string; sectionOf: string; reviewStep: string; back: string; continue: string; reviewAnswers: string;
    required: string; optional: string; charsLeft: string; textLabel: string; answerLabel: string;
    errors: { summaryTitle: string; summaryHint: string; required: string; requiredMulti: string; requiredText: string; invalid: string; tooLong: string; consentRequired: string; fixAnswers: string };
    review: {
      title: string; intro: string; change: string; notAnswered: string; consentTitle: string;
      processingLabel: string; newsletterLabel: string; processingPlaceholder: string; newsletterPlaceholder: string;
      privacyPending: string; complete: string; localNote: string;
    };
  };
  results: {
    title: string; none: { title: string; body: string; cta: string };
    overall: string; scoreLabel: string; sections: string; nextSteps: string;
    cta: { title: string; body: string; label: string };
    startOver: string; editAnswers: string; localNote: string;
  };
}

// ---- Consultation booking interface copy (not business terms) ---------------------------------------------
/** Placeholders like {n}/{tz}/{date} are replaced by `fill()`. Legal/cancellation/refund wording is NOT here: it comes from the client-approved booking configuration. */
export interface BookingUi {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  progress: { label: string; stepOf: string; steps: { package: string; schedule: string; details: string; checkout: string } };
  demo: { banner: string; price: string; duration: string };
  openingSoon: { badge: string; title: string; body: string; noSlot: string; enquiryCta: string; enquiryPending: string; secondaryCta: string; scorecardCta: string };
  choose: {
    title: string; intro: string; sessions: string; singleSession: string; select: string; selected: string; priceTbc: string; durationTbc: string;
    duration: string; noReserve: string; continue: string; error: string;
  };
  schedule: {
    title: string; intro: string; tz: string; sessionOf: string; firstOnly: string; chooseFor: string; change: string; choose: string; notSelected: string;
    prevMonth: string; nextMonth: string; calendar: string; loading: string; loadError: string; retry: string; noDays: string; pickDay: string;
    times: string; noTimes: string; times24: string; selectedAnnounce: string; nowChoosing: string; unavailableDay: string; timesAvailable: string; today: string;
    errors: { title: string; hint: string; missing: string; duplicate: string; order: string };
    continue: string; back: string;
  };
  details: {
    title: string; intro: string; collect: string; required: string; optional: string; consentTitle: string; consentPlaceholder: string; privacyPending: string; localNote: string;
    errors: { title: string; hint: string; required: string; invalid: string; tooLong: string; consent: string };
    continue: string; back: string;
  };
  checkout: {
    title: string; intro: string; summary: string; package: string; price: string; priceTbc: string; sessions: string; session: string; timeZone: string;
    yourDetails: string; name: string; email: string; edit: string;
    termsTitle: string; termsPending: string; cancellation: string; refund: string; booking: string; privacy: string;
    accept: string; acceptPlaceholder: string; acceptError: string; errorsTitle: string;
    hosted: string; noCard: string; continue: string; preparing: string; cancelPreparing: string; cancelledPreparing: string;
    handoffError: string; notEnabled: string; retry: string; startOver: string; back: string; localNote: string;
  };
  guard: { title: string; body: string; cta: string };
  status: {
    confirmed: { title: string; body: string };
    pending: { title: string; body: string };
    cancelled: { title: string; body: string };
    error: { title: string; body: string };
    unverified: { title: string; body: string };
    /** Neutral document title: the real state is only known after server-side verification, so a title must not claim one. */
    pageTitle: string;
    tryAgain: string; startAgain: string; home: string; done: string; summary: string; demoNote: string;
  };
}

// ---- Sector-brief shop interface copy (not product content or business terms) ------------------------------
/** Placeholders like {n}/{s}/{format}/{size} are replaced by `fill()`. Licence, refund and consent wording is NOT here: it comes from client-approved product/shop data. */
export interface ShopUi {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  crumb: string;
  demo: { banner: string; price: string; file: string };
  previewBadge: string;
  unavailable: { badge: string; title: string; body: string; note: string; consultCta: string; industriesCta: string };
  formats: Record<"pdf" | "epub" | "docx" | "xlsx" | "pptx" | "zip", string>;
  catalogue: { title: string; filters: string; sector: string; format: string; all: string; count: string; countOne: string; empty: string; noMatch: string; clear: string; view: string; priceTbc: string; imagePending: string };
  product: {
    about: string; details: string; format: string; size: string; pages: string; language: string; languages: { en: string; ar: string }; sector: string;
    delivery: string; deliveryValue: string; validity: string; validityTbc: string; price: string; priceTbc: string; terms: string; licence: string; refund: string; termsPending: string;
    buy: string; buyUnavailable: string; buyUnavailableNote: string; back: string; sectorLink: string; previewNote: string; consult: string;
  };
  checkout: {
    title: string; intro: string; summary: string; brief: string; price: string; priceTbc: string; format: string; delivery: string; deliveryValue: string;
    email: string; emailHelp: string; consentTitle: string; required: string; optional: string;
    termsAccept: string; termsPlaceholder: string; commsPlaceholder: string; marketingPlaceholder: string; privacyPending: string;
    hosted: string; noCard: string; continue: string; preparing: string; cancel: string; cancelledNote: string; handoffError: string; notEnabled: string; retry: string; back: string; localNote: string;
    errors: { title: string; hint: string; emailRequired: string; emailInvalid: string; emailTooLong: string; terms: string; comms: string };
  };
  order: {
    confirmed: { title: string; body: string }; pending: { title: string; body: string }; failed: { title: string; body: string };
    cancelled: { title: string; body: string }; checkoutExpired: { title: string; body: string }; unverified: { title: string; body: string };
    pageTitle: string; summary: string; tryAgain: string; backToShop: string; home: string; demoNote: string;
  };
  download: {
    title: string; intro: string; file: string; get: string; preparing: string; ready: string; open: string; expiresIn: string; resendLink: string; note: string;
    expired: { title: string; body: string }; getNew: string;
    errors: { generic: string; notPaid: string; limit: string; unavailable: string; retry: string };
  };
  resend: {
    title: string; intro: string; email: string; order: string; orderHelp: string; submit: string; sending: string;
    errors: { title: string; hint: string; emailRequired: string; emailInvalid: string; orderRequired: string };
    resultTitle: string; neutral: string; demoNote: string; notEnabled: string; back: string;
  };
}

// ---- Enquiry, newsletter and legal-page interface copy -----------------------------------------------------
/** Placeholders like {n}/{current}/{total}/{name}/{max} are replaced by `fill()`. Consent wording here is DRAFT text, shown with a visible marker; approved wording comes from the contact configuration. */
export interface ContactUi {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  crumb: string;
  demo: { banner: string; sent: string };
  unavailable: { badge: string; title: string; body: string; note: string; bookCta: string; scorecardCta: string };
  progress: { label: string; stepOf: string; steps: { about: string; enquiry: string; review: string } };
  steps: { about: { title: string; intro: string }; enquiry: { title: string; intro: string }; review: { title: string; intro: string } };
  labels: { required: string; optional: string; topicGeneral: string; topicPlaceholder: string; count: string; notProvided: string; edit: string; summary: string };
  fieldLabels: { fullName: string; email: string; organisation: string; topic: string; message: string };
  consent: { title: string; enquiryDraft: string; draftMarker: string; privacyLink: string; separateNote: string };
  errors: { title: string; hint: string; required: string; invalid: string; tooShort: string; tooLong: string; consent: string; failed: string; unavailable: string };
  buttons: { continue: string; back: string; send: string; sendDemo: string; sending: string; retry: string; newEnquiry: string };
  success: { title: string; body: string };
  demoSuccess: { title: string; body: string };
  failure: { title: string; body: string };
  side: { title: string; items: { label: string; target: "booking" | "scorecard" | "entering" }[] };
  newsletter: {
    title: string; intro: string; email: string; consentDraft: string; draftMarker: string; privacyLink: string; submit: string; sending: string;
    subscribed: string; pending: string; demoSuccess: string; failed: string; retry: string; unavailable: string;
    errors: { title: string; emailRequired: string; emailInvalid: string; emailTooLong: string; consent: string };
  };
}

export interface LegalSection { id: string; title: string }
export interface LegalPageUi {
  review: ReviewStatus;
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; intro: string };
  crumb: string;
  status: { badge: string; title: string; body: string };
  outline: { title: string; note: string; pending: string; sections: LegalSection[] };
  related: { label: string; target: "privacy" | "terms" }[];
  contact: { title: string; body: string; cta: string };
}
export interface LegalUi { privacy: LegalPageUi; terms: LegalPageUi }
