import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import { formatDate, neutralActionButtonClass } from "./dashboard-utils";

export function DashboardRequestModal({
  selectedRequest,
  onClose,
  onContact,
}: {
  selectedRequest: AdminRegistrationRecord;
  onClose: () => void;
  onContact: (email: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-wl-border bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Details de la demande"
      >
        <div className="flex items-center justify-between border-b border-wl-border p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-wl-text-tertiary">
              Demande d'inscription
            </p>
            <h3 className="mt-1 text-lg font-semibold text-wl-text">
              {selectedRequest.fullName}
            </h3>
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-wl-text-secondary transition-colors hover:bg-wl-gray-light"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Email</p>
            <p className="mt-1 text-sm text-wl-text">{selectedRequest.email}</p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Telephone</p>
            <p className="mt-1 text-sm text-wl-text">{selectedRequest.phone}</p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Entreprise</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedRequest.company || "Non renseignee"}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Poste</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedRequest.position || "Non renseigne"}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">Formation</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedRequest.formationTitle}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">Date de soumission</p>
            <p className="mt-1 text-sm text-wl-text">
              {formatDate(selectedRequest.createdAt)}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">Message</p>
            <p className="mt-1 whitespace-pre-wrap text-sm text-wl-text">
              {selectedRequest.message || "Aucun message saisi."}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-wl-border p-5">
          <Button
            variant="outline"
            className={neutralActionButtonClass}
            onClick={onClose}
          >
            Fermer
          </Button>
          <Button
            className="bg-wl-orange text-white hover:bg-wl-orange-dark"
            onClick={() => onContact(selectedRequest.email)}
          >
            <Mail className="h-4 w-4" />
            Contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
