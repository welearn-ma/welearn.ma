import { randomUUID } from "crypto";
import type { AdminCommerceStore, ProofReview, StudentProofStore } from "../../commerce/store";
import type {
  CodeKind,
  CodeRecord,
  NewActivityEntry,
  NewCode,
  NewStudentProof,
  ProductRecord,
  ProofStatus,
  StudentProofRecord,
} from "../../commerce/types";
import type {
  NewOrder,
  NewPaymentEvent,
  OrderDetails,
  OrderEmailColumn,
  OrderRecord,
  OrderStatus,
  PaidUpdate,
  PaymentEventOutcome,
  PaymentStore,
} from "../store";

/** Ligne orders complete telle que la base la stockerait. */
export interface StoredOrder extends NewOrder {
  status: OrderStatus;
  access_available_at: string | null;
  cmi_trans_id: string | null;
  cmi_auth_code: string | null;
  cmi_proc_return_code: string | null;
  paid_at: string | null;
  confirmation_email_sent_at: string | null;
  team_notified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoredEvent extends NewPaymentEvent {
  id: number;
  hash_valid: boolean | null;
  reply: string | null;
}

function simulated(): never {
  throw new Error("simulated db error");
}

/**
 * Stores en memoire pour les tests (aucun acces Supabase) : paiements,
 * justificatifs, codes, journal d'activite. `fail.*` force une erreur base
 * sur l'operation correspondante.
 */
export class MemoryPaymentStore implements PaymentStore, StudentProofStore, AdminCommerceStore {
  readonly products = new Map<string, ProductRecord>();
  readonly orders = new Map<string, StoredOrder>();
  readonly events: StoredEvent[] = [];
  readonly codes = new Map<string, CodeRecord>();
  readonly proofs = new Map<string, StudentProofRecord>();
  readonly activity: NewActivityEntry[] = [];
  readonly fail = {
    getProduct: false,
    insertOrder: false,
    findOrderByOid: false,
    insertEvent: false,
    consumeCode: false,
    expirePendingOrders: false,
    insertStudentProof: false,
    insertCode: false,
    findOrderDetails: false,
    markOrderEmailSent: false,
  };
  /** Nombre de prochains insertOrder a rejeter comme oid en doublon. */
  duplicateOidsToSimulate = 0;
  /** Nombre de prochains insertCode a rejeter comme valeur de code en doublon. */
  duplicateCodesToSimulate = 0;

  // --- Aides de test ---------------------------------------------------------

  addProduct(product: Partial<ProductRecord> & { slug: string; amount_mad: number }): ProductRecord {
    const record: ProductRecord = {
      label: product.slug,
      active: true,
      page_slug: null,
      requires_student_code: false,
      ...product,
    };
    this.products.set(record.slug, record);
    return record;
  }

  addCode(code: Partial<CodeRecord> & Pick<CodeRecord, "code" | "kind" | "customer_email">): CodeRecord {
    const record: CodeRecord = {
      id: randomUUID(),
      percent_off: code.kind === "discount" ? 5 : null,
      product_slug: null,
      max_uses: 1,
      used_count: 0,
      expires_at: "2099-01-01T00:00:00.000Z",
      revoked_at: null,
      created_by: "admin@example.test",
      student_proof_id: null,
      created_at: "2026-11-01T00:00:00.000Z",
      ...code,
    };
    this.codes.set(record.id, record);
    return record;
  }

  addProof(proof: Partial<StudentProofRecord> & Pick<StudentProofRecord, "email" | "page_slug">): StudentProofRecord {
    const id = proof.id ?? randomUUID();
    const record: StudentProofRecord = {
      id,
      full_name: "Étudiant Test",
      phone: null,
      file_path: `${id}.pdf`,
      file_mime: "application/pdf",
      file_size: 1234,
      status: "PENDING",
      rejection_reason: null,
      reviewed_by: null,
      reviewed_at: null,
      code_id: null,
      created_at: "2026-11-20T09:00:00.000Z",
      ...proof,
    };
    this.proofs.set(id, record);
    return record;
  }

  codeByValue(value: string): CodeRecord | undefined {
    return [...this.codes.values()].find((code) => code.code === value);
  }

  // --- PaymentStore ------------------------------------------------------------

  async getProduct(formationSlug: string): Promise<ProductRecord | null> {
    if (this.fail.getProduct) simulated();
    const product = this.products.get(formationSlug);
    return product ? { ...product } : null;
  }

  async insertOrder(order: NewOrder): Promise<"inserted" | "duplicate_oid"> {
    if (this.fail.insertOrder) simulated();
    if (this.duplicateOidsToSimulate > 0 || this.orders.has(order.oid)) {
      this.duplicateOidsToSimulate = Math.max(0, this.duplicateOidsToSimulate - 1);
      return "duplicate_oid";
    }
    this.orders.set(order.oid, {
      ...order,
      status: "PENDING",
      access_available_at: null,
      cmi_trans_id: null,
      cmi_auth_code: null,
      cmi_proc_return_code: null,
      paid_at: null,
      confirmation_email_sent_at: null,
      team_notified_at: null,
      created_at: order.cgv_accepted_at,
      updated_at: order.cgv_accepted_at,
    });
    return "inserted";
  }

  async findOrderByOid(oid: string): Promise<OrderRecord | null> {
    if (this.fail.findOrderByOid) simulated();
    const order = this.orders.get(oid);
    if (!order) {
      return null;
    }
    return {
      oid: order.oid,
      formation_slug: order.formation_slug,
      amount_mad: order.amount_mad,
      status: order.status,
      access_choice: order.access_choice,
      paid_at: order.paid_at,
      cmi_trans_id: order.cmi_trans_id,
      code_id: order.code_id,
    };
  }

  async markOrderPaid(oid: string, update: PaidUpdate): Promise<boolean> {
    const order = this.orders.get(oid);
    if (!order || order.status !== "PENDING") {
      return false;
    }
    Object.assign(order, update, { status: "PAID", updated_at: update.paid_at });
    return true;
  }

  async findOrderDetails(oid: string): Promise<OrderDetails | null> {
    if (this.fail.findOrderDetails) simulated();
    const order = this.orders.get(oid);
    if (!order) {
      return null;
    }
    return {
      oid: order.oid,
      formation_slug: order.formation_slug,
      status: order.status,
      amount_mad: order.amount_mad,
      list_amount_mad: order.list_amount_mad,
      discount_mad: order.discount_mad,
      code_id: order.code_id,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      access_choice: order.access_choice,
      access_available_at: order.access_available_at,
      paid_at: order.paid_at,
      cmi_trans_id: order.cmi_trans_id,
      cmi_auth_code: order.cmi_auth_code,
    };
  }

  async markOrderEmailSent(oid: string, column: OrderEmailColumn, at: string): Promise<void> {
    if (this.fail.markOrderEmailSent) simulated();
    const order = this.orders.get(oid);
    if (order && order[column] === null) {
      order[column] = at;
    }
  }

  async insertEvent(event: NewPaymentEvent): Promise<number | null> {
    if (this.fail.insertEvent) {
      return null;
    }
    const id = this.events.length + 1;
    // Copie JSON, comme un passage en jsonb.
    const payload = JSON.parse(JSON.stringify(event.payload)) as Record<string, unknown>;
    this.events.push({ ...event, payload, id, hash_valid: null, reply: null });
    return id;
  }

  async updateEvent(id: number, outcome: PaymentEventOutcome): Promise<void> {
    const event = this.events.find((candidate) => candidate.id === id);
    if (event) {
      Object.assign(event, outcome);
    }
  }

  async findCodeByCode(code: string): Promise<CodeRecord | null> {
    const found = this.codeByValue(code);
    return found ? { ...found } : null;
  }

  async consumeCode(codeId: string): Promise<boolean> {
    if (this.fail.consumeCode) simulated();
    const code = this.codes.get(codeId);
    if (!code || code.used_count >= code.max_uses) {
      return false;
    }
    code.used_count += 1;
    return true;
  }

  async expirePendingOrders(cutoff: string, now: string): Promise<number> {
    if (this.fail.expirePendingOrders) simulated();
    let count = 0;
    for (const order of this.orders.values()) {
      if (order.status === "PENDING" && order.created_at < cutoff) {
        order.status = "FAILED";
        order.updated_at = now;
        count += 1;
      }
    }
    return count;
  }

  // --- StudentProofStore / AdminCommerceStore ----------------------------------

  async findStudentProductByPageSlug(pageSlug: string): Promise<ProductRecord | null> {
    const found = [...this.products.values()]
      .filter((product) => product.page_slug === pageSlug && product.requires_student_code)
      .sort((a, b) => a.slug.localeCompare(b.slug))[0];
    return found ? { ...found } : null;
  }

  async listProducts(): Promise<ProductRecord[]> {
    return [...this.products.values()].map((product) => ({ ...product }));
  }

  async insertStudentProof(proof: NewStudentProof): Promise<void> {
    if (this.fail.insertStudentProof) simulated();
    this.addProof({ ...proof, created_at: new Date().toISOString() });
  }

  async listStudentProofs(status: ProofStatus | null): Promise<StudentProofRecord[]> {
    return [...this.proofs.values()]
      .filter((proof) => !status || proof.status === status)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((proof) => ({ ...proof }));
  }

  async findStudentProof(id: string): Promise<StudentProofRecord | null> {
    const proof = this.proofs.get(id);
    return proof ? { ...proof } : null;
  }

  async reviewStudentProof(id: string, review: ProofReview): Promise<boolean> {
    const proof = this.proofs.get(id);
    if (!proof || proof.status !== "PENDING") {
      return false;
    }
    Object.assign(proof, review);
    return true;
  }

  async reopenStudentProof(id: string): Promise<void> {
    const proof = this.proofs.get(id);
    if (proof && proof.status === "APPROVED" && proof.code_id === null) {
      Object.assign(proof, {
        status: "PENDING",
        reviewed_by: null,
        reviewed_at: null,
        rejection_reason: null,
      });
    }
  }

  async linkStudentProofCode(id: string, codeId: string): Promise<void> {
    const proof = this.proofs.get(id);
    if (proof) {
      proof.code_id = codeId;
    }
  }

  async insertCode(code: NewCode): Promise<CodeRecord | "duplicate_code"> {
    if (this.fail.insertCode) simulated();
    if (this.duplicateCodesToSimulate > 0 || this.codeByValue(code.code)) {
      this.duplicateCodesToSimulate = Math.max(0, this.duplicateCodesToSimulate - 1);
      return "duplicate_code";
    }
    const record = this.addCode({ ...code, created_at: new Date().toISOString() });
    return { ...record };
  }

  async listCodes(kind: CodeKind | null): Promise<CodeRecord[]> {
    // Plus recents d'abord, comme l'implementation Supabase.
    return [...this.codes.values()]
      .filter((code) => !kind || code.kind === kind)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((code) => ({ ...code }));
  }

  async findCodesByIds(ids: string[]): Promise<CodeRecord[]> {
    return ids.flatMap((id) => (this.codes.has(id) ? [{ ...this.codes.get(id)! }] : []));
  }

  async findCodeById(id: string): Promise<CodeRecord | null> {
    const code = this.codes.get(id);
    return code ? { ...code } : null;
  }

  async findActiveDiscountCode(email: string, now: string): Promise<CodeRecord | null> {
    const found = [...this.codes.values()].find(
      (code) =>
        code.kind === "discount" &&
        code.customer_email === email &&
        code.revoked_at === null &&
        code.expires_at > now &&
        code.used_count === 0,
    );
    return found ? { ...found } : null;
  }

  async revokeCode(id: string, revokedAt: string): Promise<boolean> {
    const code = this.codes.get(id);
    if (!code || code.revoked_at) {
      return false;
    }
    code.revoked_at = revokedAt;
    return true;
  }

  async logActivity(entry: NewActivityEntry): Promise<void> {
    this.activity.push(entry);
  }
}
