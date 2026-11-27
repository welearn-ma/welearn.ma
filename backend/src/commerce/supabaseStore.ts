import { supabase } from "../lib/supabaseClient";
import { PaymentStoreError } from "../payments/store";
import { supabasePaymentStore } from "../payments/supabaseStore";
import type { PromotionWithProducts } from "./promotions";
import {
  CODE_COLUMNS,
  PRODUCT_COLUMNS,
  PROMOTION_COLUMNS,
  PROOF_COLUMNS,
  toCode,
  toProduct,
  toPromotion,
  toProof,
} from "./rows";
import type { AdminCommerceStore, StudentProofStore } from "./store";

type DbError = { code?: string; message?: string };

/** Listes admin : plafond de lignes renvoyees. */
const LIST_LIMIT = 500;

function fail(operation: string, error: DbError): never {
  throw new PaymentStoreError(operation, error.code, error.message);
}

/** Promotions (deja lues) + leurs produits, en une requete. */
async function withProducts(rows: unknown[]): Promise<PromotionWithProducts[]> {
  const promotions = rows.map(toPromotion);
  if (promotions.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("promotion_products")
    .select("promotion_id, product_slug")
    .in(
      "promotion_id",
      promotions.map((promotion) => promotion.id),
    );
  if (error) {
    fail("promotion_products.select", error);
  }
  return promotions.map((promotion) => ({
    ...promotion,
    product_slugs: (data ?? [])
      .filter((link) => String(link.promotion_id) === promotion.id)
      .map((link) => String(link.product_slug))
      .sort(),
  }));
}

export const supabaseCommerceStore: StudentProofStore & AdminCommerceStore = {
  async findStudentProductByPageSlug(pageSlug) {
    const { data, error } = await supabase
      .from("formation_prices")
      .select(PRODUCT_COLUMNS)
      .eq("page_slug", pageSlug)
      .eq("requires_student_code", true)
      .order("formation_slug")
      .limit(1);

    if (error) {
      fail("formation_prices.select", error);
    }
    return data?.length ? toProduct(data[0]) : null;
  },

  async listProducts() {
    const { data, error } = await supabase.from("formation_prices").select(PRODUCT_COLUMNS);
    if (error) {
      fail("formation_prices.select", error);
    }
    return (data ?? []).map(toProduct);
  },

  async insertStudentProof(proof) {
    const { error } = await supabase.from("student_proofs").insert(proof);
    if (error) {
      fail("student_proofs.insert", error);
    }
  },

  async listStudentProofs(status) {
    let query = supabase
      .from("student_proofs")
      .select(PROOF_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT);
    if (status) {
      query = query.eq("status", status);
    }
    const { data, error } = await query;
    if (error) {
      fail("student_proofs.select", error);
    }
    return (data ?? []).map(toProof);
  },

  async findStudentProof(id) {
    const { data, error } = await supabase
      .from("student_proofs")
      .select(PROOF_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) {
      fail("student_proofs.select", error);
    }
    return data ? toProof(data) : null;
  },

  async reviewStudentProof(id, review) {
    const { data, error } = await supabase
      .from("student_proofs")
      .update(review)
      .eq("id", id)
      .eq("status", "PENDING")
      .select("id");
    if (error) {
      fail("student_proofs.update", error);
    }
    return (data?.length ?? 0) > 0;
  },

  async reopenStudentProof(id) {
    const { error } = await supabase
      .from("student_proofs")
      .update({ status: "PENDING", reviewed_by: null, reviewed_at: null, rejection_reason: null })
      .eq("id", id)
      .eq("status", "APPROVED")
      .is("code_id", null);
    if (error) {
      fail("student_proofs.reopen", error);
    }
  },

  async linkStudentProofCode(id, codeId) {
    const { error } = await supabase
      .from("student_proofs")
      .update({ code_id: codeId })
      .eq("id", id);
    if (error) {
      fail("student_proofs.link", error);
    }
  },

  async insertCode(code) {
    const { data, error } = await supabase
      .from("codes")
      .insert(code)
      .select(CODE_COLUMNS)
      .single();
    if (error) {
      // Seule une collision sur la VALEUR du code est reessayable.
      if (error.code === "23505" && /codes_code_unique/.test(error.message ?? "")) {
        return "duplicate_code";
      }
      fail("codes.insert", error);
    }
    return toCode(data);
  },

  async listCodes(kind) {
    let query = supabase
      .from("codes")
      .select(CODE_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT);
    if (kind) {
      query = query.eq("kind", kind);
    }
    const { data, error } = await query;
    if (error) {
      fail("codes.select", error);
    }
    return (data ?? []).map(toCode);
  },

  async findCodesByIds(ids) {
    const { data, error } = await supabase.from("codes").select(CODE_COLUMNS).in("id", ids);
    if (error) {
      fail("codes.select", error);
    }
    return (data ?? []).map(toCode);
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

  async findActiveDiscountCode(email, now) {
    const { data, error } = await supabase
      .from("codes")
      .select(CODE_COLUMNS)
      .eq("kind", "discount")
      .eq("customer_email", email)
      .is("revoked_at", null)
      .gt("expires_at", now)
      .eq("used_count", 0)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      fail("codes.select", error);
    }
    return data?.length ? toCode(data[0]) : null;
  },

  async revokeCode(id, revokedAt) {
    const { data, error } = await supabase
      .from("codes")
      .update({ revoked_at: revokedAt })
      .eq("id", id)
      .is("revoked_at", null)
      .select("id");
    if (error) {
      fail("codes.revoke", error);
    }
    return (data?.length ?? 0) > 0;
  },

  async listPromotions() {
    const { data, error } = await supabase
      .from("promotions")
      .select(PROMOTION_COLUMNS)
      .order("starts_at", { ascending: false })
      .limit(LIST_LIMIT);
    if (error) {
      fail("promotions.select", error);
    }
    return withProducts(data ?? []);
  },

  async findPromotion(id) {
    const { data, error } = await supabase
      .from("promotions")
      .select(PROMOTION_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) {
      fail("promotions.select", error);
    }
    return data ? (await withProducts([data]))[0] : null;
  },

  async setPromotionActive(id, active, at) {
    const { data, error } = await supabase
      .from("promotions")
      .update({ active, updated_at: at })
      .eq("id", id)
      .eq("active", !active)
      .select("id");
    if (error) {
      fail("promotions.update", error);
    }
    return (data?.length ?? 0) > 0;
  },

  expirePendingOrders: supabasePaymentStore.expirePendingOrders,

  async logActivity(entry) {
    try {
      const { error } = await supabase.from("admin_activity_log").insert(entry);
      if (error) {
        console.error(
          `[admin] activity log insert failed: ${error.code || "no-code"} ${error.message ?? ""}`,
        );
      }
    } catch (error) {
      console.error(
        `[admin] activity log insert failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
    }
  },
};
