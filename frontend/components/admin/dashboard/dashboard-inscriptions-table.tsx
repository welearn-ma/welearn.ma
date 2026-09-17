import { CheckCircle2, Eye, Mail, Undo2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import { formatDate, neutralActionButtonClass } from "./dashboard-utils";
import type { RequestStatus } from "./dashboard-types";

export function DashboardInscriptionsTable({
  rows,
  status,
  onView,
  onContact,
  onMarkTreated,
  onUnmarkTreated,
}: {
  rows: AdminRegistrationRecord[];
  status: RequestStatus;
  onView: (record: AdminRegistrationRecord) => void;
  onContact: (email: string) => void;
  onMarkTreated: (id: string) => void;
  onUnmarkTreated: (id: string) => void;
}) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-wl-border text-sm">
          <thead>
            <tr className="text-left text-wl-text-secondary">
              <th className="py-3 pr-4 font-medium">Demandeur</th>
              <th className="py-3 pr-4 font-medium">Formation</th>
              <th className="py-3 pr-4 font-medium">Contact</th>
              <th className="py-3 pr-4 font-medium">Date</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wl-border">
            {rows.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="py-3 pr-4">
                  <p className="font-medium text-wl-text">{item.fullName}</p>
                  <p className="text-xs text-wl-text-secondary">
                    {item.company || "Entreprise non renseignee"}
                  </p>
                  {status === "treated" && item.treatedBy ? (
                    <p className="mt-1 text-xs text-wl-text-tertiary">
                      Traite par {item.treatedBy}
                    </p>
                  ) : null}
                </td>
                <td className="py-3 pr-4">
                  <Badge
                    variant="outline"
                    className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                  >
                    {item.formationTitle}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-wl-text-secondary">
                  <p>{item.email}</p>
                  <p>{item.phone}</p>
                </td>
                <td className="py-3 pr-4 text-wl-text-secondary">
                  {formatDate(item.createdAt)}
                </td>
                <td className="py-3">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      variant="outline"
                      size="sm"
                      className={neutralActionButtonClass}
                      onClick={() => onView(item)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir
                    </Button>
                    <Button
                      size="sm"
                      className="bg-wl-orange text-white hover:bg-wl-orange-dark"
                      onClick={() => onContact(item.email)}
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </Button>
                    {status === "new" ? (
                      <Button
                        size="sm"
                        className="bg-wl-blue text-white hover:bg-wl-blue-dark"
                        onClick={() => onMarkTreated(item.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Marquer comme traité
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className={neutralActionButtonClass}
                        onClick={() => onUnmarkTreated(item.id)}
                      >
                        <Undo2 className="h-4 w-4" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!rows.length ? (
        <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
          Aucun resultat avec les filtres actuels.
        </div>
      ) : null}
    </>
  );
}
