import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import { DashboardInscriptionsTable } from "./dashboard-inscriptions-table";
import { neutralActionButtonClass } from "./dashboard-utils";

export function DashboardFormationCandidatesModal({
  formationTitle,
  rows,
  onClose,
  onView,
  onContact,
}: {
  formationTitle: string;
  rows: AdminRegistrationRecord[];
  onClose: () => void;
  onView: (record: AdminRegistrationRecord) => void;
  onContact: (email: string) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-wl-border bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Candidats inscrits - ${formationTitle}`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-wl-border p-5">
          <div>
            <div className="flex items-center gap-2 text-wl-blue">
              <Users className="h-4 w-4" />
              <p className="text-xs uppercase tracking-wide">
                Candidats inscrits
              </p>
            </div>
            <h3 className="mt-2 text-lg font-semibold text-wl-text">
              {formationTitle}
            </h3>
            <p className="mt-1 text-sm text-wl-text-secondary">
              {rows.length} candidat{rows.length > 1 ? "s" : ""} enregistre
              {rows.length > 1 ? "s" : ""} pour cette formation.
            </p>
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

        <div className="p-5">
          <DashboardInscriptionsTable
            rows={rows}
            onView={onView}
            onContact={onContact}
          />
        </div>

        <div className="flex items-center justify-end border-t border-wl-border p-5">
          <Button
            variant="outline"
            className={neutralActionButtonClass}
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
}
