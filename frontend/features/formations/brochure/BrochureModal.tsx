"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { BrochureRequestForm } from "./BrochureRequestForm";

type BrochureModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formationSlug: string;
  formationTitle: string;
};

/**
 * Modale Radix (focus trap, Echap, clic sur l'overlay). Le formulaire est
 * demonte a la fermeture : une reouverture repart d'un formulaire vierge.
 */
export function BrochureModal({
  open,
  onOpenChange,
  formationSlug,
  formationTitle,
}: BrochureModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-wl-blue-dark/60 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 top-0 z-50 overflow-y-auto p-0 text-left outline-none sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:p-4">
          <Dialog.Title className="sr-only">Télécharger la brochure</Dialog.Title>
          <Dialog.Description className="sr-only">
            {formationTitle}
          </Dialog.Description>

          <div className="relative min-h-full bg-white sm:min-h-0 sm:rounded-3xl">
            <Dialog.Close
              className="absolute right-3 top-3 z-10 rounded-lg p-2 text-wl-text-secondary transition-colors hover:bg-wl-blue-tint hover:text-wl-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wl-orange"
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
            <BrochureRequestForm
              formationSlug={formationSlug}
              formationTitle={formationTitle}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
