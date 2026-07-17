import { Mail, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminSponsorRecord } from "@/types/sponsor";
import {
  formatDate,
  neutralActionButtonClass,
  sponsorProgramLabel,
} from "./dashboard-utils";

export function DashboardSponsorModal({
  selectedSponsor,
  onClose,
  onContact,
}: {
  selectedSponsor: AdminSponsorRecord;
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
        aria-label="Details du sponsor"
      >
        <div className="flex items-center justify-between border-b border-wl-border p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-wl-text-tertiary">
              Sponsor
            </p>
            <h3 className="mt-1 text-lg font-semibold text-wl-text">
              {selectedSponsor.prenom} {selectedSponsor.nom}
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
            <p className="text-xs text-wl-text-tertiary">Entreprise</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedSponsor.entreprise}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Rôle</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedSponsor.role || "Non renseigné"}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Email</p>
            <p className="mt-1 text-sm text-wl-text">{selectedSponsor.email}</p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3">
            <p className="text-xs text-wl-text-tertiary">Téléphone</p>
            <p className="mt-1 text-sm text-wl-text">
              {selectedSponsor.telephone}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">Programme</p>
            <p className="mt-1 text-sm text-wl-text">
              {sponsorProgramLabel(selectedSponsor.program)}
            </p>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">
              Formations sponsorisées ({selectedSponsor.formations.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selectedSponsor.formations.length ? (
                selectedSponsor.formations.map((formation, index) => (
                  <Badge
                    key={`${formation.slug ?? formation.name}-${index}`}
                    variant="outline"
                    className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                  >
                    {formation.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-wl-text-tertiary">
                  {selectedSponsor.program === "fnpi"
                    ? "Contact seul"
                    : "Aucune formation"}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-wl-border bg-wl-gray-light p-3 md:col-span-2">
            <p className="text-xs text-wl-text-tertiary">Date de soumission</p>
            <p className="mt-1 text-sm text-wl-text">
              {formatDate(selectedSponsor.createdAt)}
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
            onClick={() => onContact(selectedSponsor.email)}
          >
            <Mail className="h-4 w-4" />
            Contacter
          </Button>
        </div>
      </div>
    </div>
  );
}
