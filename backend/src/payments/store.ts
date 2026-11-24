/**
 * Acces base de donnees du paiement CMI (tables formation_prices, orders,
 * payment_events, codes). Interface separee de son implementation Supabase
 * pour que les endpoints puissent etre testes sans toucher a la base.
 */

import type { CodeRecord, ProductRecord } from "../commerce/types";

export type OrderStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";
export type AccessChoice = "immediate" | "after_withdrawal";
export type PaymentEventSource = "callback" | "return";

export interface NewOrder {
  oid: string;
  formation_slug: string;
  /** Montant reellement debite (= list_amount_mad - discount_mad). */
  amount_mad: number;
  list_amount_mad: number;
  discount_mad: number;
  /** Code utilise (consomme seulement au passage en PAID). */
  code_id: string | null;
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
  code_id: string | null;
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
  /** Produit (actif ou non), ou null si le slug est inconnu. */
  getProduct(formationSlug: string): Promise<ProductRecord | null>;
  /** Code par sa valeur canonique "WL-XXXX-XXXX", ou null. */
  findCodeByCode(code: string): Promise<CodeRecord | null>;
  /**
   * used_count + 1 si used_count < max_uses (mise a jour conditionnelle).
   * Retourne false si le code est deja epuise (ou introuvable).
   */
  consumeCode(codeId: string): Promise<boolean>;
  /**
   * PENDING cree avant `cutoff` -> FAILED (updated_at = `now`).
   * Retourne le nombre de commandes expirees.
   */
  expirePendingOrders(cutoff: string, now: string): Promise<number>;
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
