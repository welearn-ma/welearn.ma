import { supabase } from "../lib/supabaseClient";
import {
  PaymentStoreError,
  type OrderRecord,
  type PaymentStore,
} from "./store";

type DbError = { code?: string; message?: string };

const ORDER_COLUMNS =
  "oid, formation_slug, amount_mad, status, access_choice, paid_at, cmi_trans_id";

function fail(operation: string, error: DbError): never {
  throw new PaymentStoreError(operation, error.code, error.message);
}

/** Journalise code + message uniquement (jamais `details` ni payload). */
function logDbError(operation: string, error: unknown): void {
  const { code, message } = (error ?? {}) as DbError;
  console.error(`[payments] ${operation} failed: ${code || "no-code"} ${message ?? ""}`);
}

export const supabasePaymentStore: PaymentStore = {
  async getActivePrice(formationSlug) {
    const { data, error } = await supabase
      .from("formation_prices")
      .select("amount_mad")
      .eq("formation_slug", formationSlug)
      .eq("active", true)
      .maybeSingle();

    if (error) {
      fail("formation_prices.select", error);
    }
    if (!data) {
      return null;
    }

    const amount = Number(data.amount_mad);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  },

  async insertOrder(order) {
    const { error } = await supabase.from("orders").insert(order);

    if (!error) {
      return "inserted";
    }
    if (error.code === "23505") {
      return "duplicate_oid";
    }
    fail("orders.insert", error);
  },

  async findOrderByOid(oid) {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .eq("oid", oid)
      .maybeSingle();

    if (error) {
      fail("orders.select", error);
    }
    if (!data) {
      return null;
    }

    return { ...data, amount_mad: Number(data.amount_mad) } as OrderRecord;
  },

  async markOrderPaid(oid, update) {
    const { data, error } = await supabase
      .from("orders")
      .update({ ...update, status: "PAID", updated_at: update.paid_at })
      .eq("oid", oid)
      .eq("status", "PENDING")
      .select("oid");

    if (error) {
      fail("orders.update", error);
    }
    return (data?.length ?? 0) > 0;
  },

  async insertEvent(event) {
    try {
      const { data, error } = await supabase
        .from("payment_events")
        .insert(event)
        .select("id")
        .single();

      if (error || !data) {
        logDbError("payment_events.insert", error);
        return null;
      }
      return Number(data.id);
    } catch (error) {
      logDbError("payment_events.insert", error);
      return null;
    }
  },

  async updateEvent(id, outcome) {
    try {
      const { error } = await supabase
        .from("payment_events")
        .update(outcome)
        .eq("id", id);

      if (error) {
        logDbError("payment_events.update", error);
      }
    } catch (error) {
      logDbError("payment_events.update", error);
    }
  },
};
