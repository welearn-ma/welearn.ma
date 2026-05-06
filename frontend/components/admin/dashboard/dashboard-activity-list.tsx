import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminRegistrationRecord } from "@/types/admin-registration";
import { formatDate } from "./dashboard-utils";

export function DashboardActivityList({
  rows,
}: {
  rows: AdminRegistrationRecord[];
}) {
  return (
    <>
      <ul className="space-y-4">
        {rows.map((item) => (
          <li
            key={item.id}
            className="rounded-xl border border-wl-border bg-white p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-wl-orange/30 bg-wl-orange-tint text-wl-orange"
              >
                <Users className="h-3 w-3" />
                Nouvelle inscription
              </Badge>
              <span className="text-xs text-wl-text-secondary">
                {formatDate(item.createdAt)}
              </span>
            </div>
            <p className="mt-2 text-sm text-wl-text">
              <strong>{item.fullName}</strong> a demande des informations sur{" "}
              <strong>{item.formationTitle}</strong>.
            </p>
          </li>
        ))}
      </ul>

      {!rows.length ? (
        <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
          Aucun evenement a afficher pour cette periode.
        </div>
      ) : null}
    </>
  );
}
