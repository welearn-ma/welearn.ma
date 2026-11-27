/**
 * Endpoints de paiement CMI (backend/src/payments/router.ts).
 */

/** URL de base de l'API (NEXT_PUBLIC_API_URL, figée au build), sans slash final. */
export function getPaymentsApiBaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || null;
}

/**
 * Cible du POST natif (formulaire HTML, pas de fetch) du formulaire de
 * paiement. Le backend répond par la page d'auto-soumission vers le CMI, ou
 * par une redirection 302 vers /paiement/echec/?reason=…
 */
export function cmiInitUrl(baseUrl: string): string {
  return `${baseUrl}/api/payments/cmi/init`;
}

// --- Catalogue et codes (backend/src/payments/catalog.ts) --------------------

const PRODUCT_SLUG_REGEX = /^[a-z0-9-]{1,100}$/;

/** Slug de produit lu dans l'URL : null si absent ou mal formé. */
export function parseProductSlug(value: string | null): string | null {
  const slug = value?.trim() ?? "";
  return PRODUCT_SLUG_REGEX.test(slug) ? slug : null;
}

/**
 * Promotion en cours, évaluée par le backend à chaque appel (heure du
 * serveur) : rien n'est figé dans le site statique.
 */
export type PublicPromotion = {
  label: string;
  percent_off: number;
  /** Instant ISO de fin, EXCLU (ex. 01/12/2026 00:00 Casablanca). */
  ends_at: string;
};

export type ProductInfo = {
  slug: string;
  label: string;
  /** Montant à payer sans code (promotion en cours comprise). */
  amount_mad: number;
  /** Prix catalogue. */
  list_amount_mad: number;
  discount_mad: number;
  requires_student_code: boolean;
  promotion: PublicPromotion | null;
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parsePromotion(value: unknown): PublicPromotion | null {
  if (!value || typeof value !== "object") return null;
  const o = value as Record<string, unknown>;
  if (
    typeof o.label !== "string" ||
    !o.label.trim() ||
    !isFiniteNumber(o.percent_off) ||
    typeof o.ends_at !== "string" ||
    Number.isNaN(new Date(o.ends_at).getTime())
  ) {
    return null;
  }
  return { label: o.label, percent_off: o.percent_off, ends_at: o.ends_at };
}

/**
 * GET /api/payments/products/:slug — null si le produit est inconnu ou
 * inactif (404). Lève une erreur sur toute autre réponse. Un backend sans
 * promotions (ancien déploiement) est lu comme « prix catalogue, aucune
 * promotion ».
 */
export async function fetchProduct(
  baseUrl: string,
  slug: string,
  signal?: AbortSignal,
): Promise<ProductInfo | null> {
  const response = await fetch(
    `${baseUrl}/api/payments/products/${encodeURIComponent(slug)}`,
    { cache: "no-store", signal },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`products ${response.status}`);
  const body = (await response.json()) as Record<string, unknown>;
  if (
    body.slug !== slug ||
    typeof body.label !== "string" ||
    !isFiniteNumber(body.amount_mad) ||
    typeof body.requires_student_code !== "boolean"
  ) {
    throw new Error("products: invalid body");
  }
  const amount = body.amount_mad;
  const list = isFiniteNumber(body.list_amount_mad) ? body.list_amount_mad : amount;
  const discount = isFiniteNumber(body.discount_mad) ? body.discount_mad : 0;
  return {
    slug,
    label: body.label,
    amount_mad: amount,
    list_amount_mad: list,
    discount_mad: discount,
    requires_student_code: body.requires_student_code,
    promotion: discount > 0 ? parsePromotion(body.promotion) : null,
  };
}

export type CodeCheckResult =
  | {
      status: "valid";
      amount_mad: number;
      list_amount_mad: number;
      discount_mad: number;
      promotion: PublicPromotion | null;
    }
  /** Code de réduction valide, mais une promotion est en cours (non cumulables). */
  | { status: "not_cumulative" }
  | { status: "invalid" }
  | { status: "rate_limited" }
  | { status: "error" };

/**
 * POST /api/payments/codes/check — montants calculés par le backend, « non
 * cumulable » (promotion en cours), ou « invalide » sans motif. Ne lève
 * jamais.
 */
export async function checkPaymentCode(
  baseUrl: string,
  input: { product: string; code: string; email: string },
): Promise<CodeCheckResult> {
  try {
    const response = await fetch(`${baseUrl}/api/payments/codes/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      cache: "no-store",
    });
    if (response.status === 429) return { status: "rate_limited" };
    if (!response.ok) return { status: "error" };
    const body = (await response.json()) as Record<string, unknown>;
    if (
      body.valid === true &&
      typeof body.amount_mad === "number" &&
      typeof body.list_amount_mad === "number" &&
      typeof body.discount_mad === "number"
    ) {
      return {
        status: "valid",
        amount_mad: body.amount_mad,
        list_amount_mad: body.list_amount_mad,
        discount_mad: body.discount_mad,
        promotion: parsePromotion(body.promotion),
      };
    }
    if (body.valid === false && body.reason === "not_cumulative") {
      return { status: "not_cumulative" };
    }
    return { status: "invalid" };
  } catch {
    return { status: "error" };
  }
}

/** Même règle que ORDER_REF_REGEX — backend/src/controllers/paymentController.ts */
const ORDER_REF_REGEX = /^[A-Za-z0-9]{1,64}$/;

/** Référence de commande lue dans l'URL : null si absente ou mal formée. */
export function parseOrderRef(value: string | null): string | null {
  const ref = value?.trim() ?? "";
  return ORDER_REF_REGEX.test(ref) ? ref : null;
}

export type OrderStatus = {
  ref: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED";
  formation_slug: string;
  amount_mad: number;
  paid_at: string | null;
};

const ORDER_STATUSES: ReadonlyArray<OrderStatus["status"]> = [
  "PENDING",
  "PAID",
  "FAILED",
  "CANCELLED",
];
const REQUEST_TIMEOUT_MS = 10_000;

function isOrderStatus(value: unknown, ref: string): value is OrderStatus {
  if (!value || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    o.ref === ref &&
    ORDER_STATUSES.includes(o.status as OrderStatus["status"]) &&
    typeof o.formation_slug === "string" &&
    typeof o.amount_mad === "number" &&
    Number.isFinite(o.amount_mad) &&
    (o.paid_at === null || typeof o.paid_at === "string")
  );
}

/**
 * GET /api/payments/order-status?ref=… Lève une erreur sur toute réponse
 * autre qu'un 200 bien formé (réseau, CORS, 400, 404, 500, 503, délai).
 */
export async function fetchOrderStatus(
  baseUrl: string,
  ref: string,
  signal: AbortSignal,
): Promise<OrderStatus> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  const timer = setTimeout(abort, REQUEST_TIMEOUT_MS);
  signal.addEventListener("abort", abort);
  try {
    const response = await fetch(
      `${baseUrl}/api/payments/order-status?ref=${encodeURIComponent(ref)}`,
      { cache: "no-store", signal: controller.signal },
    );
    if (!response.ok) throw new Error(`order-status ${response.status}`);
    const body: unknown = await response.json();
    if (!isOrderStatus(body, ref)) throw new Error("order-status: invalid body");
    return body;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener("abort", abort);
  }
}
