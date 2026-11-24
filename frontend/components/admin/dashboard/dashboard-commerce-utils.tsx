import { AlertCircle, CheckCircle2, X } from "lucide-react";

/** JJ/MM/AAAA a l'heure de Casablanca (comme les e-mails envoyes). */
export function formatDay(value: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

/** Date locale -> "AAAA-MM-JJ" (valeur d'un <input type="date">). */
export function toDateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** "AAAA-MM-JJ" -> fin de cette journee (23:59:59, heure du navigateur), en ISO. */
export function endOfDayIso(value: string): string | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function isAdminUnauthorized(error: unknown): boolean {
  return error instanceof Error && error.message === "ADMIN_UNAUTHORIZED";
}

export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

export type Notice = { kind: "success" | "error"; text: string };

export function DashboardNotice({ notice, onClose }: { notice: Notice | null; onClose: () => void }) {
  if (!notice) return null;
  const success = notice.kind === "success";
  const Icon = success ? CheckCircle2 : AlertCircle;
  return (
    <div
      role={success ? "status" : "alert"}
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-wl-success/30 bg-wl-success-tint text-wl-text"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${success ? "text-wl-success" : ""}`} />
      <p className="flex-1">{notice.text}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer le message"
        className="rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
