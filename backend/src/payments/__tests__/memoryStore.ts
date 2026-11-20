import type {
  NewOrder,
  NewPaymentEvent,
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
  updated_at: string;
}

export interface StoredEvent extends NewPaymentEvent {
  id: number;
  hash_valid: boolean | null;
  reply: string | null;
}

/**
 * PaymentStore en memoire pour les tests (aucun acces Supabase).
 * `fail.*` force une erreur base sur l'operation correspondante.
 */
export class MemoryPaymentStore implements PaymentStore {
  readonly prices = new Map<string, { amount: number; active: boolean }>();
  readonly orders = new Map<string, StoredOrder>();
  readonly events: StoredEvent[] = [];
  readonly fail = {
    getActivePrice: false,
    insertOrder: false,
    findOrderByOid: false,
    insertEvent: false,
  };
  /** Nombre de prochains insertOrder a rejeter comme oid en doublon. */
  duplicateOidsToSimulate = 0;

  async getActivePrice(formationSlug: string): Promise<number | null> {
    if (this.fail.getActivePrice) {
      throw new Error("simulated db error");
    }
    const price = this.prices.get(formationSlug);
    return price?.active ? price.amount : null;
  }

  async insertOrder(order: NewOrder): Promise<"inserted" | "duplicate_oid"> {
    if (this.fail.insertOrder) {
      throw new Error("simulated db error");
    }
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
      updated_at: order.cgv_accepted_at,
    });
    return "inserted";
  }

  async findOrderByOid(oid: string): Promise<OrderRecord | null> {
    if (this.fail.findOrderByOid) {
      throw new Error("simulated db error");
    }
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
}
