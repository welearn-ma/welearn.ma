"use client";

import { useState, type ReactNode } from "react";
import { BrochureModal } from "./BrochureModal";

type BrochureCtaProps = {
  formationSlug: string;
  formationTitle: string;
  label?: string;
  className?: string;
  /** Contenu optionnel avant le libelle (ex. icone). */
  icon?: ReactNode;
};

export function BrochureCta({
  formationSlug,
  formationTitle,
  label = "Télécharger la brochure",
  className,
  icon,
}: BrochureCtaProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        aria-haspopup="dialog"
      >
        {icon}
        {label}
      </button>
      <BrochureModal
        open={open}
        onOpenChange={setOpen}
        formationSlug={formationSlug}
        formationTitle={formationTitle}
      />
    </>
  );
}
