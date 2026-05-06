import { formatDate } from "./dashboard-utils";
import type { FormationSummary } from "./dashboard-types";

export function DashboardFormationsGrid({
  rows,
}: {
  rows: FormationSummary[];
}) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-wl-border bg-white p-4"
          >
            <p className="text-sm text-wl-text-secondary">Formation</p>
            <h3 className="mt-1 text-base font-semibold text-wl-text">
              {item.title}
            </h3>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-wl-text-secondary">Inscriptions</p>
                <p className="text-2xl font-semibold text-wl-blue">
                  {item.count}
                </p>
              </div>
              <div>
                <p className="text-xs text-wl-text-secondary">Entreprises</p>
                <p className="text-right text-lg font-medium text-wl-text">
                  {item.companiesCount}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs text-wl-text-secondary">
              Derniere demande: {formatDate(item.latest)}
            </p>
          </article>
        ))}
      </div>

      {!rows.length ? (
        <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
          Aucune formation a afficher avec les filtres actifs.
        </div>
      ) : null}
    </>
  );
}
