"use client";

import { useState, type ReactNode } from "react";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { neutralActionButtonClass } from "./dashboard-utils";

/**
 * Fenetre de confirmation (meme gabarit que DashboardTreatNoteModal).
 * Avec `textLabel`, un texte obligatoire est demande (ex. motif de refus).
 */
export function DashboardConfirmModal({
  title,
  children,
  confirmLabel,
  confirmClassName = "bg-wl-blue text-white hover:bg-wl-blue-dark",
  busy = false,
  textLabel,
  textPlaceholder,
  textMaxLength = 1000,
  onClose,
  onConfirm,
}: {
  title: string;
  children?: ReactNode;
  confirmLabel: string;
  confirmClassName?: string;
  busy?: boolean;
  textLabel?: string;
  textPlaceholder?: string;
  textMaxLength?: number;
  onClose: () => void;
  onConfirm: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const trimmed = text.trim();
  const needsText = Boolean(textLabel);
  const canConfirm = !busy && (!needsText || trimmed.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={busy ? undefined : onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-wl-border bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="flex items-center justify-between border-b border-wl-border p-5">
          <h3 className="text-lg font-semibold text-wl-text">{title}</h3>
          <button
            type="button"
            className="rounded-lg p-2 text-wl-text-secondary transition-colors hover:bg-wl-gray-light disabled:opacity-50"
            onClick={onClose}
            disabled={busy}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {children ? <div className="text-sm text-wl-text-secondary">{children}</div> : null}
          {needsText ? (
            <div>
              <label
                htmlFor="confirm-modal-text"
                className="mb-1.5 block text-xs text-wl-text-tertiary"
              >
                {textLabel}
              </label>
              <textarea
                id="confirm-modal-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={4}
                maxLength={textMaxLength}
                autoFocus
                placeholder={textPlaceholder}
                className="w-full rounded-md border border-wl-border bg-white p-3 text-sm text-wl-text outline-none focus:ring-2 focus:ring-wl-blue/20"
              />
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-wl-border p-5">
          <Button
            variant="outline"
            className={neutralActionButtonClass}
            onClick={onClose}
            disabled={busy}
          >
            Annuler
          </Button>
          <Button
            className={`${confirmClassName} disabled:cursor-not-allowed disabled:opacity-50`}
            disabled={!canConfirm}
            onClick={() => onConfirm(trimmed)}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
