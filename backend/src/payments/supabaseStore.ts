import { CODE_COLUMNS, PRODUCT_COLUMNS, toCode, toProduct } from "../commerce/rows";
import { supabase } from "../lib/supabaseClient";
import {
  PaymentStoreError,
  type OrderDetails,
  type OrderRecord,
  type PaymentStore,
} from "./store";

type DbError = { code?: string; message?: string };

const ORDER_COLUMNS =
  "oid, formation_slug, amount_mad, status, paid_at, cmi_trans_id, code_id";

/** E-mails de commande payee uniquement (donnees client comprises). */
const ORDER_DETAILS_COLUMNS =
  "oid, formation_slug, status, amount_mad, list_amount_mad, discount_mad, code_id, " +
  "customer_name, customer_email, customer_phone, access_available_at, " +
  "paid_at, cmi_trans_id, cmi_auth_code";

/** Essais de la mise a jour optimiste de used_count (concurrence). */
const CONSUME_ATTEMPTS = 3;

function fail(operation: string, error: DbError): never {
  throw new PaymentStoreError(operation, error.code, error.message);
}

/** Journalise code + message uniquement (jamais `details` ni payload). */
function logDbError(operation: string, error: unknown): void {
  const { code, message } = (error ?? {}) as DbError;
  console.error(`[payments] ${operation} failed: ${code || "no-code"} ${message ?? ""}`);
}

export const supabasePaymentStore: PaymentStore = {
  async getProduct(formationSlug) {
    const { data, error } = await supabase
      .from("formation_prices")
      .select(PRODUCT_COLUMNS)
      .eq("formation_slug", formationSlug)
      .maybeSingle();

    if (error) {
      fail("formation_prices.select", error);
    }
    if (!data) {
      return null;
    }

    const product = toProduct(data);
    return Number.isFinite(product.amount_mad) && product.amount_mad > 0 ? product : null;
  },

  async findCodeByCode(code) {
    const { data, error } = await supabase
      .from("codes")
      .select(CODE_COLUMNS)
      .eq("code", code)
      .maybeSingle();

    if (error) {
      fail("codes.select", error);
    }
    return data ? toCode(data) : null;
  },

  // PostgREST ne sait pas faire "used_count = used_count + 1" : mise a jour
  // optimiste (WHERE used_count = valeur lue), reessayee en cas de course.
  async consumeCode(codeId) {
    for (let attempt = 0; attempt < CONSUME_ATTEMPTS; attempt += 1) {
      const { data: current, error: readError } = await supabase
        .from("codes")
        .select("used_count, max_uses")
        .eq("id", codeId)
        .maybeSingle();

      if (readError) {
        fail("codes.select", readError);
      }
      if (!current || Number(current.used_count) >= Number(current.max_uses)) {
        return false;
      }

      const usedCount = Number(current.used_count);
      const { data: updated, error: updateError } = await supabase
        .from("codes")
        .update({ used_count: usedCount + 1 })
        .eq("id", codeId)
        .eq("used_count", usedCount)
        .select("id");

      if (updateError) {
        fail("codes.update", updateError);
      }
      if ((updated?.length ?? 0) > 0) {
        return true;
      }
    }
    return false;
  },

  async expirePendingOrders(cutoff, now) {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "FAILED", updated_at: now })
      .eq("status", "PENDING")
      .lt("created_at", cutoff)
      .select("oid");

    if (error) {
      fail("orders.expire", error);
    }
    return data?.length ?? 0;
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

  async findOrderDetails(oid) {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_DETAILS_COLUMNS)
      .eq("oid", oid)
      .maybeSingle();

    if (error) {
      fail("orders.select details", error);
    }
    if (!data) {
      return null;
    }

    const row = data as unknown as Record<string, unknown>;
    return {
      ...(row as unknown as OrderDetails),
      amount_mad: Number(row.amount_mad),
      list_amount_mad: row.list_amount_mad === null ? null : Number(row.list_amount_mad),
      discount_mad: Number(row.discount_mad),
    };
  },

  async findCodeById(id) {
    const { data, error } = await supabase
      .from("codes")
      .select(CODE_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      fail("codes.select", error);
    }
    return data ? toCode(data) : null;
  },

  async markOrderEmailSent(oid, column, at) {
    const { error } = await supabase
      .from("orders")
      .update({ [column]: at })
      .eq("oid", oid)
      .is(column, null);

    if (error) {
      fail("orders.update email", error);
    }
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
