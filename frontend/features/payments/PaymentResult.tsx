import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { legalEntity } from "@/data/legal";
import { cn } from "@/lib/utils";

/** Éléments communs des pages /paiement/{succes,en-attente,echec}/. */

type Tone = "success" | "info" | "warning" | "error";

const toneIcon: Record<Tone, string> = {
  success: "bg-wl-success-tint text-wl-success",
  info: "bg-wl-blue-tint text-wl-blue",
  warning: "bg-wl-orange-tint text-wl-orange",
  error: "bg-red-50 text-red-600",
};

const linkClass =
  "text-wl-blue underline underline-offset-2 hover:no-underline";

export function PaymentResultShell({ children }: { children: ReactNode }) {
  return (
    <section className="bg-wl-gray-light py-10 sm:py-14">
      <div className="mx-auto max-w-2xl px-4">
        <div
          aria-live="polite"
          className="rounded-3xl border border-wl-border bg-white px-5 py-8 shadow-[0_20px_60px_-40px_rgba(13,61,110,0.55)] sm:px-8 sm:py-10"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function PaymentResultHeader({
  tone,
  icon: Icon,
  spin = false,
  title,
}: {
  tone: Tone;
  icon: LucideIcon;
  spin?: boolean;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          toneIcon[tone],
        )}
      >
        <Icon className={cn("h-7 w-7", spin && "animate-spin")} aria-hidden="true" />
      </span>
      <h1 className="mt-4 text-xl font-semibold text-wl-text sm:text-2xl">
        {title}
      </h1>
    </div>
  );
}

export function PaymentResultText({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 text-center text-sm leading-relaxed text-wl-text-secondary sm:text-base">
      {children}
    </p>
  );
}

export function OrderRefLine({ orderRef }: { orderRef: string | null }) {
  if (!orderRef) return null;
  return (
    <p className="mt-5 text-center text-sm text-wl-text">
      Référence de commande :{" "}
      <span className="font-mono font-semibold tracking-wide">{orderRef}</span>
    </p>
  );
}

export function PaymentContactLine() {
  return (
    <p className="mt-6 border-t border-wl-border pt-5 text-center text-xs leading-relaxed text-wl-text-secondary sm:text-sm">
      Contact :{" "}
      <a href={`mailto:${legalEntity.email}`} className={linkClass}>
        {legalEntity.email}
      </a>{" "}
      ·{" "}
      <a href={legalEntity.phoneHref} className={cn(linkClass, "whitespace-nowrap")}>
        {legalEntity.phone}
      </a>
    </p>
  );
}

/** Rendu statique (avant lecture de l'URL côté client) : aucun message. */
export function PaymentResultFallback() {
  return (
    <PaymentResultShell>
      <div className="flex justify-center py-10">
        <Loader2 className="h-7 w-7 animate-spin text-wl-blue" aria-hidden="true" />
        <span className="sr-only">Chargement…</span>
      </div>
    </PaymentResultShell>
  );
}
