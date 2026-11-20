"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock, Loader2, SearchCheck } from "lucide-react";
import { formationLabelForSlug } from "@/data/payment";
import {
  fetchOrderStatus,
  getPaymentsApiBaseUrl,
  parseOrderRef,
  type OrderStatus,
} from "@/lib/api/payments";
import { formatAmountMad, formatPaidDate } from "@/lib/payments/format";
import {
  OrderRefLine,
  PaymentContactLine,
  PaymentResultHeader,
  PaymentResultShell,
  PaymentResultText,
} from "./PaymentResult";

/** Interrogation de order-status : toutes les 5 s, pendant 2 min au plus. */
const POLL_INTERVAL_MS = 5_000;
const POLL_DURATION_MS = 2 * 60_000;

type View =
  | { kind: "checking" } // succes : première vérification en cours
  | { kind: "unverified" } // succes : vérification impossible
  | { kind: "pending" }
  | { kind: "timeout" }
  | { kind: "paid"; order: OrderStatus };

/**
 * Contenu de /paiement/succes/ et /paiement/en-attente/. « Paiement
 * confirmé » n'est affiché QUE si order-status renvoie PAID.
 *
 * - succes : une vérification ; PAID -> confirmé ; autre statut -> contenu
 *   « en attente » (avec interrogation) ; échec de la requête -> « Nous
 *   vérifions votre paiement ».
 * - en-attente : interrogation immédiate ; les échecs de requête sont
 *   retentés jusqu'à la fin des 2 min.
 */
export function PaymentConfirmation({ mode }: { mode: "succes" | "en-attente" }) {
  // Seul `ref` est lu dans l'URL.
  const orderRef = parseOrderRef(useSearchParams().get("ref"));
  const baseUrl = getPaymentsApiBaseUrl();
  const canCheck = Boolean(orderRef && baseUrl);

  const [view, setView] = useState<View>(() =>
    !canCheck
      ? { kind: "unverified" }
      : mode === "succes"
        ? { kind: "checking" }
        : { kind: "pending" },
  );

  useEffect(() => {
    if (!orderRef || !baseUrl) {
      setView({ kind: "unverified" });
      return;
    }
    // Nouvelle référence : rien de l'ancienne commande ne reste affiché.
    setView(mode === "succes" ? { kind: "checking" } : { kind: "pending" });

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const controller = new AbortController();
    const startedAt = Date.now();

    const check = async (polling: boolean) => {
      let order: OrderStatus | null = null;
      try {
        order = await fetchOrderStatus(baseUrl, orderRef, controller.signal);
      } catch {
        order = null;
      }
      if (cancelled) return;

      if (order?.status === "PAID") {
        setView({ kind: "paid", order });
        return;
      }
      if (!order && !polling) {
        setView({ kind: "unverified" });
        return;
      }
      if (Date.now() - startedAt >= POLL_DURATION_MS) {
        setView({ kind: "timeout" });
        return;
      }
      setView({ kind: "pending" });
      timer = setTimeout(() => void check(true), POLL_INTERVAL_MS);
    };

    void check(mode === "en-attente");

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [orderRef, baseUrl, mode]);

  return (
    <PaymentResultShell>
      <ConfirmationContent view={view} orderRef={orderRef} />
    </PaymentResultShell>
  );
}

function ConfirmationContent({
  view,
  orderRef,
}: {
  view: View;
  orderRef: string | null;
}) {
  switch (view.kind) {
    case "paid":
      return <PaidContent order={view.order} orderRef={orderRef} />;

    case "pending":
      return (
        <>
          <PaymentResultHeader
            tone="info"
            icon={Loader2}
            spin
            title="Paiement en cours de confirmation"
          />
          <PaymentResultText>Cette page se met à jour automatiquement.</PaymentResultText>
          <OrderRefLine orderRef={orderRef} />
          <PaymentContactLine />
        </>
      );

    case "timeout":
      return (
        <>
          <PaymentResultHeader
            tone="warning"
            icon={Clock}
            title="Paiement en cours de confirmation"
          />
          <PaymentResultText>
            La confirmation prend plus de temps que prévu. Ne refaites pas le
            paiement : contactez-nous avec votre référence de commande.
          </PaymentResultText>
          <OrderRefLine orderRef={orderRef} />
          <PaymentContactLine />
        </>
      );

    case "checking":
      return (
        <>
          <PaymentResultHeader
            tone="info"
            icon={Loader2}
            spin
            title="Nous vérifions votre paiement"
          />
          <OrderRefLine orderRef={orderRef} />
        </>
      );

    case "unverified":
      return (
        <>
          <PaymentResultHeader
            tone="info"
            icon={SearchCheck}
            title="Nous vérifions votre paiement"
          />
          <OrderRefLine orderRef={orderRef} />
          <PaymentContactLine />
        </>
      );
  }
}

function PaidContent({
  order,
  orderRef,
}: {
  order: OrderStatus;
  orderRef: string | null;
}) {
  const paidDate = order.paid_at ? formatPaidDate(order.paid_at) : null;

  return (
    <>
      <PaymentResultHeader tone="success" icon={CheckCircle2} title="Paiement confirmé" />

      <dl className="mx-auto mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-wl-border bg-wl-gray-light px-5 py-4 text-sm">
        <dt className="text-wl-text-secondary">Formation</dt>
        <dd className="font-medium text-wl-text">
          {formationLabelForSlug(order.formation_slug)}
        </dd>
        <dt className="text-wl-text-secondary">Montant</dt>
        <dd className="font-semibold text-wl-text">{formatAmountMad(order.amount_mad)}</dd>
        {paidDate && (
          <>
            <dt className="text-wl-text-secondary">Date du paiement</dt>
            <dd className="font-medium text-wl-text">{paidDate}</dd>
          </>
        )}
      </dl>

      <OrderRefLine orderRef={orderRef} />
      <PaymentResultText>
        Notre équipe vous contactera pour l'ouverture de votre accès, selon
        l'option choisie lors de votre commande. Conservez votre référence de
        commande.
      </PaymentResultText>
      <PaymentContactLine />
    </>
  );
}
