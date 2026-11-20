/**
 * Acces base de donnees du paiement CMI (tables formation_prices, orders,
 * payment_events). Interface separee de son implementation Supabase pour
 * que les endpoints puissent etre testes sans toucher a la base.
 */

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";
export type AccessChoice = "immediate" | "after_withdrawal";
export type PaymentEventSource = "callback" | "return";

export interface NewOrder {
  oid: string;
  formation_slug: string;
  amount_mad: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  cgv_accepted_at: string;
  cgv_version: string;
  access_choice: AccessChoice;
}

/** Colonnes lues par les endpoints : aucune donnee client. */
export interface OrderRecord {
  oid: string;
  formation_slug: string;
  amount_mad: number;
  status: OrderStatus;
  access_choice: AccessChoice;
  paid_at: string | null;
  /** TransId CMI du paiement capture (detection des doubles approbations). */
  cmi_trans_id: string | null;
}

export interface PaidUpdate {
  paid_at: string;
  access_available_at: string;
  cmi_trans_id: string | null;
  cmi_auth_code: string | null;
  cmi_proc_return_code: string;
}

export interface NewPaymentEvent {
  oid: string | null;
  source: PaymentEventSource;
  proc_return_code: string | null;
  response: string | null;
  trans_id: string | null;
  payload: Record<string, unknown>;
}

export interface PaymentEventOutcome {
  hash_valid: boolean | null;
  reply: string;
}

export interface PaymentStore {
  /** Prix actif en MAD, ou null si le slug est inconnu ou inactif. */
  getActivePrice(formationSlug: string): Promise<number | null>;
  /** "duplicate_oid" si l'oid existe deja (violation UNIQUE). */
  insertOrder(order: NewOrder): Promise<"inserted" | "duplicate_oid">;
  findOrderByOid(oid: string): Promise<OrderRecord | null>;
  /**
   * Passage conditionnel PENDING -> PAID (WHERE status = 'PENDING').
   * Retourne false si aucune ligne PENDING n'a ete mise a jour.
   */
  markOrderPaid(oid: string, update: PaidUpdate): Promise<boolean>;
  /** Ne leve jamais : retourne null si l'insertion echoue. */
  insertEvent(event: NewPaymentEvent): Promise<number | null>;
  /** Ne leve jamais. */
  updateEvent(id: number, outcome: PaymentEventOutcome): Promise<void>;
}

/**
 * Erreur base de donnees. Le message ne contient que l'operation, le code
 * et le message PostgREST — jamais `details` (qui peut contenir la ligne).
 */
export class PaymentStoreError extends Error {
  constructor(operation: string, code: string | undefined, message: string | undefined) {
    super(`${operation}: ${code || "no-code"} ${message ?? ""}`.trim());
    this.name = "PaymentStoreError";
  }
}
