"use client";

import { useState } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { neutralActionButtonClass } from "./dashboard-utils";

export function DashboardTreatNoteModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  const trimmedNote = note.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-wl-border bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Note de traitement"
      >
        <div className="flex items-center justify-between border-b border-wl-border p-5">
          <h3 className="text-lg font-semibold text-wl-text">
            Marquer comme traité
          </h3>
          <button
            type="button"
            className="rounded-lg p-2 text-wl-text-secondary transition-colors hover:bg-wl-gray-light"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5">
          <label
            htmlFor="treat-note"
            className="mb-1.5 block text-xs text-wl-text-tertiary"
          >
            Note (obligatoire)
          </label>
          <textarea
            id="treat-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            autoFocus
            placeholder="Precisez le contexte du traitement..."
            className="w-full rounded-md border border-wl-border bg-white p-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20"
          />
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-wl-border p-5">
          <Button
            variant="outline"
            className={neutralActionButtonClass}
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            className="bg-wl-blue text-white hover:bg-wl-blue-dark disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!trimmedNote}
            onClick={() => onConfirm(trimmedNote)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirmer
          </Button>
        </div>
      </div>
    </div>
  );
}
