import { signDownload } from "./delivery.ts";
import type { FileFormat, FileStorageProvider, OrderRepository, Product, Result, ShopConfig, ShopPaymentProvider, PaymentStatus } from "./types.ts";

/**
 * DEVELOPMENT-ONLY DEMO FIXTURE (marker: __SHOP_DEMO_FIXTURE__).
 * Lets the shop be previewed end to end. EVERYTHING here is fake: the products are layout previews, prices use the
 * non-currency code "XXX", the "hosted checkout" is a simulator page, and the "download" is a labelled text placeholder.
 * No order is recorded and no real file exists. Loaded only when NODE_ENV === "development" and SHOP_DEMO=1, flagged
 * isDemo (always rejected for live use), and excluded from production bundles.
 */
const d = (en: string, ar: string) => ({ en, ar });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Not a secret: signs links that serve only a labelled placeholder, and only in the development demo. */
export const DEMO_SIGNING_SECRET = "demo-only-not-a-secret";

const preview = (id: string, sectorId: string, n: string, ar: string, format: FileFormat, sizeBytes: number, amountMinor: number, status: Product["status"] = "published"): Product => ({
  id, status, isPreview: true, sectorId,
  title: d(`PREVIEW: Sample brief ${n}`, `معاينة: موجز نموذجي ${ar}`),
  summary: d("Layout-test summary. This is not a real brief.", "ملخص لاختبار التصميم. هذا ليس موجزًا حقيقيًا."),
  description: d(
    "Layout-test description. This preview product exists only to review the shop layout.\n\nNo real brief, price or file exists, and nothing here can be bought.",
    "وصف لاختبار التصميم. هذا المنتج المعاينة موجود فقط لمراجعة تصميم المتجر.\n\nلا يوجد موجز أو سعر أو ملف حقيقي، ولا يمكن شراء أي شيء هنا.",
  ),
  price: { amountMinor, currency: "XXX" },
  previewImage: null,
  file: { key: `demo/${id}`, format, sizeBytes, pages: format === "pdf" ? 24 : undefined, languages: ["en", "ar"] },
  licence: null, // null on purpose: renders the "approval needed" placeholder
  refund: null,
  review: { en: "draft", ar: "needs-professional-review" },
  approval: null,
  publishedAt: null,
});

export const demoShop: ShopConfig = {
  id: "__SHOP_DEMO_FIXTURE__",
  version: "demo",
  status: "draft",
  isDemo: true,
  review: { en: "draft", ar: "needs-professional-review" },
  approval: null,
  products: [
    preview("preview-sample-a", "real-estate", "A", "أ", "pdf", 2_400_000, 15000),
    preview("preview-sample-b", "hospitality", "B", "ب", "pdf", 3_100_000, 15000),
    preview("preview-sample-c", "logistics-supply-chain", "C", "ج", "xlsx", 540_000, 22000),
    preview("preview-draft-d", "fmcg-consumer-brands", "D (draft)", "د (مسودة)", "pdf", 1_000_000, 9000, "draft"), // draft: hidden even in the demo
  ],
  delivery: { method: "signed-link", linkValiditySeconds: 15, maxDownloadsPerOrder: 3 }, // 15s so the expired-link state can be previewed
  terms: { purchaseTerms: null, purchaseCommunications: null, marketingConsent: null, privacy: null },
  providers: { payment: "demo-payment", storage: "demo-storage", orders: "demo-orders" },
};

// ---- Fake hosted checkout --------------------------------------------------------------------------------------
/** The demo "provider" encodes outcome and product in the session id: demo_<outcome>_<productId>. */
const SESSION = /^demo_(paid|pending|cancelled|expired|failed)_([a-z0-9-]+)$/;

export const demoPayment: ShopPaymentProvider = {
  id: "demo-payment",
  async createCheckoutSession(req) {
    await sleep(1200); // simulated provider latency, so the loading and cancel states can be previewed
    return { ok: true as const, value: { sessionId: "demo_session", checkoutUrl: `/${req.locale}/shop/demo-checkout?product=${encodeURIComponent(req.productId)}` } };
  },
  async getCheckoutStatus(sessionId: string): Promise<Result<PaymentStatus>> {
    const m = SESSION.exec(sessionId);
    return { ok: true, value: (m?.[1] as PaymentStatus | undefined) ?? "unknown" };
  },
};

export const demoStorage: FileStorageProvider = {
  id: "demo-storage",
  async createSignedDownload({ fileKey, expiresInSeconds, filename, orderRef }) {
    const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const sig = signDownload({ fileKey, orderRef, exp }, DEMO_SIGNING_SECRET);
    const q = new URLSearchParams({ key: fileKey, order: orderRef, exp: String(exp), name: filename, sig });
    return { ok: true as const, value: { url: `/api/shop/demo-file?${q}`, expiresAt: new Date(exp * 1000).toISOString() } };
  },
};

/** Nothing is persisted: the demo derives the "order" from the session id only. */
export const demoOrders: OrderRepository = {
  id: "demo-orders",
  async getBySession(sessionId: string) {
    const m = SESSION.exec(sessionId);
    return { ok: true as const, value: m ? { orderRef: `DEMO-${m[2]}`, productId: m[2], downloadsUsed: 0 } : null };
  },
  async recordDownload() { return { ok: true as const, value: undefined }; },
};

export const demoFileText = [
  "DEMO PREVIEW FILE: THIS IS NOT A REAL BRIEF.",
  "It is a placeholder served by the development demo to preview the secure-download flow.",
  "",
  "ملف معاينة تجريبي: هذا ليس موجزًا حقيقيًا.",
  "هو نص مؤقت تقدمه النسخة التجريبية للتطوير لمعاينة مسار التنزيل الآمن.",
  "",
].join("\n");

/** Copy for the simulator page that stands in for the provider's hosted checkout. */
export const demoCheckoutCopy = {
  en: {
    banner: "DEMO MODE: this page simulates a payment provider's hosted checkout. No payment is taken and no order is made.",
    title: "Simulated hosted checkout",
    body: "A real provider's page would appear here, on the provider's own secure domain. It is the only place payment details would ever be entered. This site has no card fields.",
    prompt: "Choose an outcome to preview:",
    outcomes: { paid: "Simulate successful payment", pending: "Simulate payment pending", failed: "Simulate failed payment", cancelled: "Cancel checkout", expired: "Simulate expired checkout" },
  },
  ar: {
    banner: "وضع تجريبي: تحاكي هذه الصفحة صفحة الدفع المستضافة لدى مزوّد الدفع. لا يُسحب أي مبلغ ولا يُنشأ أي طلب.",
    title: "صفحة دفع مستضافة (محاكاة)",
    body: "ستظهر هنا صفحة المزوّد الحقيقي على نطاقه الآمن الخاص، وهي المكان الوحيد الذي تُدخل فيه بيانات الدفع. لا يحتوي هذا الموقع على أي حقول لبطاقات الدفع.",
    prompt: "اختر نتيجة لمعاينتها:",
    outcomes: { paid: "محاكاة دفع ناجح", pending: "محاكاة دفع قيد المعالجة", failed: "محاكاة دفع فاشل", cancelled: "إلغاء الدفع", expired: "محاكاة انتهاء صلاحية الدفع" },
  },
};
