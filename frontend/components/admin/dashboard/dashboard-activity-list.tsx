import { HeartHandshake, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ActivityItem } from "./dashboard-types";
import { formatDate, sponsorProgramLabel } from "./dashboard-utils";

export function DashboardActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={`${item.kind}-${item.record.id}`}
            className="rounded-xl border border-wl-border bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              {item.kind === "inscription" ? (
                <Badge
                  variant="outline"
                  className="border-wl-orange/30 bg-wl-orange-tint text-wl-orange"
                >
                  <Users className="h-3 w-3" />
                  Nouvelle inscription
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                >
                  <HeartHandshake className="h-3 w-3" />
                  Nouveau sponsor
                </Badge>
              )}
              <span className="text-xs text-wl-text-secondary">
                {formatDate(item.createdAt)}
              </span>
            </div>
            {item.kind === "inscription" ? (
              <p className="mt-2 text-sm text-wl-text">
                <strong>{item.record.fullName}</strong> a demande des
                informations sur <strong>{item.record.formationTitle}</strong>.
              </p>
            ) : (
              <p className="mt-2 text-sm text-wl-text">
                <strong>
                  {item.record.prenom} {item.record.nom}
                </strong>{" "}
                ({item.record.entreprise}) a soumis une demande de sponsoring —{" "}
                {sponsorProgramLabel(item.record.program)} —{" "}
                {item.record.formations.length ? (
                  <strong>
                    {item.record.formations
                      .map((formation) => formation.name)
                      .join(", ")}
                  </strong>
                ) : (
                  "contact seul"
                )}
                .
              </p>
            )}
          </li>
        ))}
      </ul>

      {!items.length ? (
        <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
          Aucun evenement a afficher pour cette periode.
        </div>
      ) : null}
    </>
  );
}
