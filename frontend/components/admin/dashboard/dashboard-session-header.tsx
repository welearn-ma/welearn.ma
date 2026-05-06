import { Globe, HardDrive, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { neutralActionButtonClass } from "./dashboard-utils";

export function DashboardSessionHeader({
  adminEmail,
  onLogout,
}: {
  adminEmail?: string;
  onLogout: () => void;
}) {
  const isWeb = Boolean(adminEmail);

  const displayName = adminEmail
    ? adminEmail
        .split("@")[0]
        .split(".")
        .map((part) => part.toUpperCase())
        .join(" ")
    : null;

  return (
    <header className="rounded-2xl border border-wl-border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-wl-blue-tint p-2 text-wl-blue">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-wl-text-tertiary">
              Session admin
            </p>
            <p className="text-sm font-semibold text-wl-text">
              {displayName ?? "Accès local"}
            </p>
            <span
              className={`mt-0.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                isWeb
                  ? "bg-wl-blue-tint text-wl-blue"
                  : "bg-wl-gray-light text-wl-text-secondary"
              }`}
            >
              {isWeb ? (
                <>
                  <Globe className="h-3 w-3" /> Connexion sécurisée
                </>
              ) : (
                <>
                  <HardDrive className="h-3 w-3" /> Accès en mode local
                </>
              )}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className={neutralActionButtonClass}
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
            Se deconnecter
          </Button>
        </div>
      </div>
    </header>
  );
}
