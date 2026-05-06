import { Activity, FolderKanban, Inbox } from "lucide-react";
import type { AdminView } from "./dashboard-types";

const viewConfig = [
  { id: "inscriptions", label: "Inscriptions", icon: Inbox },
  { id: "formations", label: "Par formation", icon: FolderKanban },
  { id: "activite", label: "Activite", icon: Activity },
] as const;

export function DashboardSidebar({
  view,
  onViewChange,
  totalRows,
  last24h,
}: {
  view: AdminView;
  onViewChange: (view: AdminView) => void;
  totalRows: number;
  last24h: number;
}) {
  return (
    <aside className="h-fit rounded-2xl border border-wl-border bg-white p-4 shadow-sm">
      <div className="mb-5 rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-4">
        <p className="text-xs uppercase tracking-wide text-wl-blue">Admin</p>
        <h1 className="mt-1 text-lg font-semibold text-wl-text">
          Tracking Inscriptions
        </h1>
      </div>

      <nav className="space-y-1">
        {viewConfig.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === view;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-wl-blue text-white"
                  : "text-wl-text-secondary hover:bg-wl-gray-light"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-6 space-y-2 rounded-xl border border-wl-border bg-wl-gray-light p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-wl-text-secondary">Total filtre</span>
          <strong className="text-wl-text">{totalRows}</strong>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-wl-text-secondary">Dernieres 24h</span>
          <strong className="text-wl-text">{last24h}</strong>
        </div>
      </div>
    </aside>
  );
}
