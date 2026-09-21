import { RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActivityRecord } from "@/types/admin-activity";
import { DashboardActivityList } from "./dashboard-activity-list";
import { neutralActionButtonClass } from "./dashboard-utils";

export function DashboardActivityView({
  items,
  actorEmailFilter,
  onActorEmailFilter,
  onRefresh,
}: {
  items: AdminActivityRecord[];
  actorEmailFilter: string;
  onActorEmailFilter: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
      <div className="border-b border-wl-border p-5 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-wl-text">
              Flux d&apos;activité
            </h2>
            <p className="mt-1 text-sm text-wl-text-secondary">
              Chronologie des demandes et des actions de l&apos;équipe
            </p>
          </div>
          <Button
            onClick={onRefresh}
            variant="outline"
            className={`w-full sm:w-auto ${neutralActionButtonClass}`}
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>

        <div className="mt-5 max-w-sm">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-wl-text-tertiary" />
            <Input
              value={actorEmailFilter}
              onChange={(event) => onActorEmailFilter(event.target.value)}
              placeholder="Filtrer par email de l'admin..."
              className="border-wl-border bg-white pl-9 text-wl-text placeholder:text-wl-text-tertiary"
            />
          </label>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <DashboardActivityList items={items} />
      </div>
    </section>
  );
}
