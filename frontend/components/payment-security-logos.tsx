"use client";

import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { paymentLive } from "@/config/site";

/**
 * Logos de sécurité obligatoires du kit CMI. Le rendu dérive uniquement de ce
 * tableau. Les fichiers vivent dans public/payment/ (copiés tels quels depuis
 * la charte CMI, ne pas les remplacer par d'autres versions).
 */
const SECURITY_LOGOS = [
  { id: "cmi", label: "CMI", src: "/payment/cmi-logo.png" },
  {
    id: "verified-by-visa",
    label: "Verified by Visa",
    src: "/payment/verified-by-visa.png",
  },
  {
    id: "mastercard-securecode",
    label: "Mastercard SecureCode",
    src: "/payment/mastercard-securecode.png",
  },
];

type SecurityLogo = (typeof SECURITY_LOGOS)[number];
type Size = "sm" | "md";
type Variant = "light" | "dark";

type PaymentSecurityLogosProps = {
  size?: Size;
  variant?: Variant;
  className?: string;
  /**
   * Affiche la mention « Paiement 100% sécurisé par CMI — 3D Secure ».
   * Par défaut : `paymentLive`. Forcé à `true` uniquement sur la page de test
   * cachée /paiement/test/ (certification CMI) ; le footer ne le passe pas.
   */
  showSecureNote?: boolean;
};

// Logo ≈ 28px (sm) / 36px (md) de haut : pastille 32px / 40px, padding vertical 2px.
const boxSize: Record<Size, string> = {
  sm: "h-8 min-w-12 px-2 py-0.5",
  md: "h-10 min-w-14 px-2.5 py-0.5",
};

// Assez large pour les logos les plus allongés (≈ 2,3:1) sans réduire leur hauteur.
const logoMaxWidth: Record<Size, string> = {
  sm: "max-w-20",
  md: "max-w-24",
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

function SecurityLogoItem({
  logo,
  size,
  variant,
}: {
  logo: SecurityLogo;
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
        {logo.label}
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
        src={logo.src}
        alt={logo.label}
        loading="lazy"
        onError={() => setFailed(true)}
        className={cn("h-full w-auto object-contain", logoMaxWidth[size])}
      />
    </span>
  );
}

export function PaymentSecurityLogos({
  size = "md",
  variant = "light",
  className,
  showSecureNote = paymentLive,
}: PaymentSecurityLogosProps) {
  return (
    <div
      role="group"
      aria-label="Logos de sécurité du paiement"
      className={cn("flex flex-col items-center gap-2", className)}
    >
      <ul className="flex flex-wrap items-center justify-center gap-2">
        {SECURITY_LOGOS.map((logo) => (
          <li key={logo.id}>
            <SecurityLogoItem logo={logo} size={size} variant={variant} />
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
