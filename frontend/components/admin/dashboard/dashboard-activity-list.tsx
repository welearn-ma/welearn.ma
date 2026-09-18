import { CheckCircle2, HeartHandshake, Undo2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AdminActivityRecord } from "@/types/admin-activity";
import { formatDate } from "./dashboard-utils";

const EVENT_BADGES = {
  new_request: {
    label: "Nouvelle demande",
    className: "border-wl-orange/30 bg-wl-orange-tint text-wl-orange",
  },
  treated: {
    label: "Traité",
    className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue",
  },
  untreated: {
    label: "Annulé",
    className: "border-wl-border bg-wl-gray-light text-wl-text-secondary",
  },
} as const;

function eventIcon(eventType: AdminActivityRecord["eventType"]) {
  if (eventType === "treated") return CheckCircle2;
  if (eventType === "untreated") return Undo2;
  return Users;
}

function describeEntity(item: AdminActivityRecord) {
  if (item.entityType === "student") {
    return item.student
      ? `${item.student.fullName} — ${item.student.formationTitle}`
      : "Demande d'inscription supprimee";
  }

  return item.sponsor
    ? `${item.sponsor.fullName} (${item.sponsor.entreprise})`
    : "Sponsor supprime";
}

function describeAction(item: AdminActivityRecord) {
  const entityLabel = item.entityType === "student" ? "l'inscription" : "le sponsor";

  if (item.eventType === "new_request") {
    return item.entityType === "student"
      ? "a soumis une demande d'inscription."
      : "a soumis une demande de sponsoring.";
  }

  if (item.eventType === "treated") {
    return `a marque ${entityLabel} comme traite${item.actorEmail ? ` (${item.actorEmail})` : ""}.`;
  }

  return `a annule le statut traite de ${entityLabel}${item.actorEmail ? ` (${item.actorEmail})` : ""}.`;
}

export function DashboardActivityList({
  items,
}: {
  items: AdminActivityRecord[];
}) {
  return (
    <>
      <ul className="space-y-4">
        {items.map((item) => {
          const badge = EVENT_BADGES[item.eventType];
          const Icon = eventIcon(item.eventType);

          return (
            <li
              key={item.id}
              className="rounded-xl border border-wl-border bg-white p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={badge.className}>
                  <Icon className="h-3 w-3" />
                  {badge.label}
                </Badge>
                {item.entityType === "sponsor" ? (
                  <Badge
                    variant="outline"
                    className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                  >
                    <HeartHandshake className="h-3 w-3" />
                    Sponsor
                  </Badge>
                ) : null}
                <span className="text-xs text-wl-text-secondary">
                  {formatDate(item.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-sm text-wl-text">
                <strong>{describeEntity(item)}</strong> — {describeAction(item)}
              </p>
              {item.note ? (
                <p className="mt-2 rounded-lg bg-wl-gray-light px-3 py-2 text-sm text-wl-text-secondary">
                  {item.note}
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      {!items.length ? (
        <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
          Aucun evenement a afficher.
        </div>
      ) : null}
    </>
  );
}
