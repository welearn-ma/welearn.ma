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
