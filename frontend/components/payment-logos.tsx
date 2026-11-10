"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Moyens de paiement affichés. Le rendu dérive uniquement de ce tableau :
 * ajouter ou retirer une entrée suffit. Les fichiers vivent dans public/payment/.
 */
const PAYMENT_METHODS = [
  { id: "visa", label: "Visa", src: "/payment/visa.jpg" },
  { id: "mastercard", label: "Mastercard", src: "/payment/mastercard.webp" },
  { id: "cmi", label: "CMI", src: "/payment/cmi.png" },
];

type PaymentMethod = (typeof PAYMENT_METHODS)[number];
type Size = "sm" | "md";
type Variant = "light" | "dark";

type PaymentLogosProps = {
  size?: Size;
  showSecureNote?: boolean;
  variant?: Variant;
  className?: string;
};

const boxSize: Record<Size, string> = {
  sm: "h-8 min-w-12 px-2 py-1.5",
  md: "h-10 min-w-14 px-2.5 py-2",
};

const logoMaxWidth: Record<Size, string> = {
  sm: "max-w-16",
  md: "max-w-20",
};

/** Pastille blanche : garde les marques lisibles, y compris sur le fond sombre du footer. */
const logoBox: Record<Variant, string> = {
  light: "bg-white border border-wl-border",
  dark: "bg-white",
};

const fallbackBox: Record<Variant, string> = {
  light: "border border-wl-border text-wl-text-secondary",
  dark: "border border-white/20 text-white/70",
};

const noteText: Record<Variant, string> = {
  light: "text-wl-text-secondary",
  dark: "text-white/50",
};

function PaymentLogo({
  method,
  size,
  variant,
}: {
  method: PaymentMethod;
  size: Size;
  variant: Variant;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // En export statique, l'image peut échouer avant l'hydratation : onError ne
  // se déclenche alors jamais. On vérifie donc l'état réel au montage.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md text-xs font-medium",
          boxSize[size],
          fallbackBox[variant],
        )}
      >
        {method.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        boxSize[size],
        logoBox[variant],
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- export statique, images non optimisées */}
      <img
        ref={imgRef}
        src={method.src}
        alt={method.label}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-auto object-contain", logoMaxWidth[size])}
      />
    </span>
  );
}

export function PaymentLogos({
  size = "md",
  showSecureNote = false,
  variant = "light",
  className,
}: PaymentLogosProps) {
  return (
    <div
      role="group"
      aria-label="Moyens de paiement acceptés"
      className={cn("flex flex-col items-center gap-2", className)}
    >
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {PAYMENT_METHODS.map((method) => (
          <li key={method.id}>
            <PaymentLogo method={method} size={size} variant={variant} />
          </li>
        ))}
      </ul>
      {showSecureNote && (
        <p
          className={cn(
            "flex items-center gap-1.5 text-xs",
            noteText[variant],
          )}
        >
          <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Paiement 100% sécurisé par CMI — 3D Secure
        </p>
      )}
    </div>
  );
}
