// Sector-brief shop model, delivery design and provider interfaces. Pure types: no framework imports (tests run this code
// under Node). The client has NOT supplied any brief, description, price, currency, licence terms, refund policy, payment
// gateway or file-storage provider. Nothing here may invent them, and no real order or download is possible in this stage.
import type { L, Locale, Money, PaymentStatus, ProviderError, Result, ReviewState, ValidationIssue } from "../booking/types.ts";

export type { L, Locale, Money, PaymentStatus, ProviderError, Result, ReviewState, ValidationIssue };

export type FileFormat = "pdf" | "epub" | "docx" | "xlsx" | "pptx" | "zip";
export const FILE_EXTENSIONS: Record<FileFormat, string> = { pdf: "pdf", epub: "epub", docx: "docx", xlsx: "xlsx", pptx: "pptx", zip: "zip" };

/** "draft" = never shown or sold. "published" = approved for sale (subject to every other rule). */
export type PublicationStatus = "draft" | "published";

/**
 * Metadata of the PRIVATE paid file. `key` is an opaque object key in the client's private storage: never a URL, never a
 * path under public/, and never sent to the browser. Buyers only ever receive short-lived signed links.
 */
export interface ProductFile {
  key: string;
  format: FileFormat;
  sizeBytes: number;
  pages?: number;
  /** Languages the brief is written in. Only shown if the client supplies it. */
  languages?: Locale[];
}

export interface Product {
  /** URL slug. */
  id: string;
  status: PublicationStatus;
  /** True only for development layout fixtures. A preview can never be shown or sold outside the development demo. */
  isPreview: boolean;
  /** One of the existing industry slugs (src/content/catalog.ts), or null if the brief is not sector-specific. */
  sectorId: string | null;
  title: L;
  summary: L;
  /** Full description. Blank lines separate paragraphs. */
  description: L;
  /** null until the client supplies a price: the UI then shows "price to be confirmed". */
  price: Money | null;
  /** null = an approved-image placeholder is shown. */
  previewImage: { url: string; alt: L } | null;
  file: ProductFile | null;
  /** Client-approved wording. null = an "approval needed" placeholder is shown; never invented. */
  licence: L | null;
  refund: L | null;
  review: { en: ReviewState; ar: ReviewState };
  approval: { approvedBy: string; approvedAt: string } | null;
  publishedAt: string | null;
}

export interface DeliveryPolicy {
  /** Fixed design: order-validated server-side issuance of short-lived signed links. Paid files are never public. */
  method: "signed-link";
  /** How long a signed link works. null until the client decides; must be short (see MAX_LINK_SECONDS). */
  linkValiditySeconds: number | null;
  /** Download limit per order. null until the client decides. */
  maxDownloadsPerOrder: number | null;
}
/** Upper bound for "short-lived": one hour. */
export const MAX_LINK_SECONDS = 3600;

export interface ShopTerms {
  /** Client-approved wording (English and Arabic). null = placeholder shown; blocks activation. */
  purchaseTerms: L | null;
  /** Required notice/consent for purchase-related emails (order confirmation, download link). Separate from marketing. */
  purchaseCommunications: L | null;
  /** OPTIONAL marketing consent. Always separate from purchase communications and never pre-ticked. */
  marketingConsent: L | null;
  privacy: L | null;
}

export interface ShopConfig {
  id: string;
  version: string;
  status: "draft" | "approved";
  /** True only for the development-only demo fixture; it can never be live. */
  isDemo: boolean;
  review: { en: ReviewState; ar: ReviewState };
  approval: { approvedBy: string; approvedAt: string } | null;
  products: Product[];
  delivery: DeliveryPolicy;
  terms: ShopTerms;
  /** Ids of the approved, client-owned providers. null until accounts exist. */
  providers: { payment: string | null; storage: string | null; orders: string | null };
}

// ---- Orders ------------------------------------------------------------------------------------------------
export type OrderStatus = "pending-payment" | "paid" | "failed" | "cancelled" | "expired" | "refunded";
/**
 * Server-side order record (future). Holds the minimum needed to validate a download: it is never sent to a CRM,
 * newsletter or analytics provider in this stage, and no order is recorded at all until providers are approved.
 */
export interface Order {
  orderRef: string;
  productId: string;
  status: OrderStatus;
  createdAt: string;
  paidAt?: string;
  buyerEmail: string;
  marketingConsent: boolean; // kept separate from purchase communications
  downloadsUsed: number;
}

// ---- Provider interfaces (server-side only) ---------------------------------------------------------------
export interface ProductCheckoutRequest {
  productId: string;
  orderRef: string;
  /** Absolute return URLs on this site. */
  returnUrls: { success: string; pending: string; failed: string };
  locale: Locale;
  customer: { email: string };
}

/**
 * Hosted-checkout gateway for products (the same gateway as the booking PaymentProvider can implement both). The site
 * NEVER renders or stores card fields: createCheckoutSession returns a URL on the provider's hosted page, and the result
 * is always verified server-side with getCheckoutStatus (never trusted from the return URL).
 */
export interface ShopPaymentProvider {
  readonly id: string;
  createCheckoutSession(req: ProductCheckoutRequest): Promise<Result<{ sessionId: string; checkoutUrl: string; expiresAt?: string }>>;
  getCheckoutStatus(sessionId: string): Promise<Result<PaymentStatus>>;
}

/** Client-owned PRIVATE object storage. Files are never public; links are signed, short-lived and generated per request. */
export interface FileStorageProvider {
  readonly id: string;
  createSignedDownload(req: { fileKey: string; expiresInSeconds: number; filename: string; orderRef: string }): Promise<Result<{ url: string; expiresAt: string }>>;
}

/** Order persistence (client-owned). Validates which product a verified payment session bought, and enforces download limits. */
export interface OrderRepository {
  readonly id: string;
  getBySession(sessionId: string): Promise<Result<{ orderRef: string; productId: string; downloadsUsed: number } | null>>;
  recordDownload(orderRef: string): Promise<Result<void>>;
}

export interface ShopProviders { payment: ShopPaymentProvider | null; storage: FileStorageProvider | null; orders: OrderRepository | null }

export type ShopMode = "live" | "demo" | "unavailable";
/** What a product page/card may offer. */
export type ProductState = "purchasable" | "preview" | "unavailable" | "hidden";

// ---- Single-language view used by the UI (never contains the private file key) ----------------------------
export interface LProduct {
  id: string;
  state: Exclude<ProductState, "hidden">;
  isPreview: boolean;
  sectorId: string | null;
  title: string;
  summary: string;
  description: string;
  price: Money | null;
  previewImage: { url: string; alt: string } | null;
  file: { format: FileFormat; sizeBytes: number; pages?: number; languages?: Locale[] } | null;
  licence: string | null;
  refund: string | null;
}
export interface LocalizedShop {
  isDemo: boolean;
  products: LProduct[];
  delivery: { method: "signed-link"; linkValiditySeconds: number | null };
  terms: { purchaseTerms: string | null; purchaseCommunications: string | null; marketingConsent: string | null; privacy: string | null };
}
