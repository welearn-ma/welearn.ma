"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_RETRY_PATH } from "@/data/payment";
import { parseOrderRef } from "@/lib/api/payments";
import {
  OrderRefLine,
  PaymentContactLine,
  PaymentResultHeader,
  PaymentResultShell,
  PaymentResultText,
} from "./PaymentResult";

/** Raisons envoyées par le backend (/init : ?reason=…). */
const REASON_MESSAGES = {
  invalid:
    "Certaines informations du formulaire sont invalides. Merci de vérifier vos informations et de réessayer.",
  name_latin: "Merci de saisir votre nom en caractères latins.",
  document:
    "Votre nom ou votre adresse e-mail contient un terme non accepté par la plateforme de paiement. Merci d'utiliser une autre adresse e-mail ou de nous contacter.",
  error:
    "Une erreur technique est survenue. Aucun montant n'a été débité. Merci de réessayer dans quelques minutes.",
  unavailable:
    "Le paiement en ligne est momentanément indisponible. Merci de réessayer plus tard ou de nous contacter.",
} as const;

/** Sans `reason` (paiement refusé ou annulé côté CMI), ou raison inconnue. */
const DEFAULT_MESSAGE =
  "Le paiement n'a pas abouti. Aucun montant n'a été débité. Pour connaître la raison d'un refus de carte, contactez votre banque.";

function messageForReason(reason: string | null): string {
  if (reason && Object.prototype.hasOwnProperty.call(REASON_MESSAGES, reason)) {
    return REASON_MESSAGES[reason as keyof typeof REASON_MESSAGES];
  }
  return DEFAULT_MESSAGE;
}

/** Contenu de /paiement/echec/. Seuls `ref` et `reason` sont lus dans l'URL. */
export function PaymentFailure() {
  const params = useSearchParams();
  const orderRef = parseOrderRef(params.get("ref"));
  const message = messageForReason(params.get("reason"));

  return (
    <PaymentResultShell>
      <PaymentResultHeader tone="error" icon={XCircle} title="Paiement non abouti" />
      <PaymentResultText>{message}</PaymentResultText>
      <OrderRefLine orderRef={orderRef} />
      <div className="mt-6 flex justify-center">
        <Button
          asChild
          className="h-11 w-full bg-wl-blue px-8 text-white transition-all duration-200 hover:bg-wl-blue-dark sm:w-auto"
        >
          <Link href={PAYMENT_RETRY_PATH}>Réessayer</Link>
        </Button>
      </div>
      <PaymentContactLine />
    </PaymentResultShell>
  );
}
