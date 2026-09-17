import type { RequestStatus } from "./dashboard-types";

const TABS: Array<{ id: RequestStatus; label: string }> = [
  { id: "new", label: "Nouveaux" },
  { id: "treated", label: "Traités" },
];

export function DashboardStatusTabs({
  status,
  onStatusChange,
}: {
  status: RequestStatus;
  onStatusChange: (status: RequestStatus) => void;
}) {
  return (
    <div className="flex gap-1 rounded-lg border border-wl-border bg-wl-gray-light p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onStatusChange(tab.id)}
          className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
            status === tab.id
              ? "bg-wl-blue text-white"
              : "text-wl-text-secondary hover:bg-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
