/** Carte KPI minimale, toujours fixe (donnees non filtrees). */
export function DashboardStatTile({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-wl-border bg-wl-gray-light px-4 py-3">
      <p className="text-2xl font-semibold text-wl-blue">{value}</p>
      <p className="mt-0.5 text-xs text-wl-text-secondary">{label}</p>
    </div>
  );
}
