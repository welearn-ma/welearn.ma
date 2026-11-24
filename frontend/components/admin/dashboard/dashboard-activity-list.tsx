import {
  Ban,
  CheckCircle2,
  FileDown,
  GraduationCap,
  HeartHandshake,
  Send,
  TicketPercent,
  Undo2,
  Users,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type {
  AdminActivityEventType,
  AdminActivityRecord,
} from "@/types/admin-activity";
import { formatDate } from "./dashboard-utils";

const EVENT_BADGES: Record<
  AdminActivityEventType,
  { label: string; className: string }
> = {
  new_request: {
    label: "Nouvelle demande",
    className: "border-wl-orange/30 bg-wl-orange-tint text-wl-orange",
  },
  brochure_request: {
    label: "Brochure",
    className:
      "border-wl-accent-purple/30 bg-wl-purple-tint text-wl-accent-purple",
  },
  treated: {
    label: "Traité",
    className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue",
  },
  untreated: {
    label: "Annulé",
    className: "border-wl-border bg-wl-gray-light text-wl-text-secondary",
  },
  proof_submitted: {
    label: "Justificatif",
    className: "border-wl-orange/30 bg-wl-orange-tint text-wl-orange",
  },
  proof_approved: {
    label: "Validé",
    className: "border-wl-success/30 bg-wl-success-tint text-wl-success",
  },
  proof_rejected: {
    label: "Refusé",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  code_created: {
    label: "Code créé",
    className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue",
  },
  code_revoked: {
    label: "Code révoqué",
    className: "border-wl-border bg-wl-gray-light text-wl-text-secondary",
  },
  proof_email_resent: {
    label: "E-mail du code renvoyé",
    className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue",
  },
  code_email_resent: {
    label: "E-mail du code renvoyé",
    className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue",
  },
};

// Garde-fou : un event_type inconnu (base en avance sur le frontend) ne doit
// pas faire planter la vue Activite.
const FALLBACK_BADGE = {
  label: "Evenement",
  className: "border-wl-border bg-wl-gray-light text-wl-text-secondary",
};

function eventIcon(eventType: AdminActivityRecord["eventType"]) {
  if (eventType === "proof_submitted") return GraduationCap;
  if (eventType === "proof_approved") return CheckCircle2;
  if (eventType === "proof_rejected") return XCircle;
  if (eventType === "code_created") return TicketPercent;
  if (eventType === "code_revoked") return Ban;
  if (eventType === "proof_email_resent" || eventType === "code_email_resent") return Send;
  if (eventType === "treated") return CheckCircle2;
  if (eventType === "untreated") return Undo2;
  if (eventType === "brochure_request") return FileDown;
  return Users;
}

function describeEntity(item: AdminActivityRecord) {
  if (item.entityType === "student_proof") {
    return item.studentProof
      ? `${item.studentProof.fullName} (${item.studentProof.email})`
      : "Justificatif supprime";
  }

  if (item.entityType === "code") {
    return item.code ? `${item.code.code} — ${item.code.email}` : "Code supprime";
  }

  if (item.entityType === "student") {
    return item.student
      ? `${item.student.fullName} — ${item.student.formationTitle}`
      : "Demande d'inscription supprimee";
  }

  return item.sponsor
    ? `${item.sponsor.fullName} (${item.sponsor.entreprise})`
    : "Sponsor supprime";
}

/** Evenements des justificatifs et des codes ; null pour les autres. */
function describeCommerceAction(item: AdminActivityRecord): string | null {
  const by = item.actorEmail ? ` (${item.actorEmail})` : "";
  switch (item.eventType) {
    case "proof_submitted":
      return "a déposé un justificatif étudiant.";
    case "proof_approved":
      return `justificatif validé, code envoyé${by}.`;
    case "proof_rejected":
      return `justificatif refusé${by}.`;
    case "code_created":
      return `code ${item.code?.kind === "student" ? "étudiant" : "de réduction"} créé${by}.`;
    case "code_revoked":
      return `code révoqué${by}.`;
    case "proof_email_resent":
    case "code_email_resent":
      return `e-mail du code renvoyé${by}.`;
    default:
      return null;
  }
}

function describeAction(item: AdminActivityRecord) {
  const commerce = describeCommerceAction(item);
  if (commerce) {
    return commerce;
  }

  const entityLabel = item.entityType === "student" ? "l'inscription" : "le sponsor";

  if (item.eventType === "new_request") {
    return item.entityType === "student"
      ? "a soumis une demande d'inscription."
      : "a soumis une demande de sponsoring.";
  }

  if (item.eventType === "brochure_request") {
    return "a téléchargé la brochure.";
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
          const badge = EVENT_BADGES[item.eventType] ?? FALLBACK_BADGE;
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
                {item.entityType === "student_proof" ? (
                  <Badge
                    variant="outline"
                    className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                  >
                    <GraduationCap className="h-3 w-3" />
                    Justificatif étudiant
                  </Badge>
                ) : null}
                {item.entityType === "code" ? (
                  <Badge
                    variant="outline"
                    className="border-wl-blue/20 bg-wl-blue-tint text-wl-blue"
                  >
                    <TicketPercent className="h-3 w-3" />
                    Code
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
