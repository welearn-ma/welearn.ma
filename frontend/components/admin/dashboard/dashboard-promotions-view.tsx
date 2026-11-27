"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Power, PowerOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { activatePromotion, deactivatePromotion, listPromotions } from "@/lib/api/admin-commerce";
import type { AdminPromotion, PromotionStatus } from "@/types/admin-commerce";
import {
  DashboardNotice,
  errorMessage,
  isAdminUnauthorized,
  type Notice,
} from "./dashboard-commerce-utils";
import { DashboardConfirmModal } from "./dashboard-confirm-modal";
import { neutralActionButtonClass } from "./dashboard-utils";

const STATUS_BADGES: Record<PromotionStatus, { label: string; className: string }> = {
  running: { label: "En cours", className: "border-wl-success/30 bg-wl-success-tint text-wl-success" },
  scheduled: { label: "Programmée", className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue" },
  ended: { label: "Terminée", className: "border-wl-border bg-wl-gray-light text-wl-text-secondary" },
  disabled: { label: "Désactivée", className: "border-red-200 bg-red-50 text-red-700" },
};

/** JJ/MM/AAAA HH:mm à l'heure de Casablanca. */
function formatDateTime(value: number): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(value));
}

/** « 27/11/2026 00:00 → 30/11/2026 23:59 » (fin exclue : dernière minute incluse). */
function formatWindow(promotion: AdminPromotion): string {
  const start = new Date(promotion.startsAt).getTime();
  const end = new Date(promotion.endsAt).getTime();
  return `${formatDateTime(start)} → ${formatDateTime(end - 1)}`;
}

function percentLabel(promotion: AdminPromotion): string {
  return `−${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 2 }).format(promotion.percentOff)}\u00a0%`;
}

type Pending = { promotion: AdminPromotion; action: "deactivate" | "activate" };

/**
 * Promotions (table promotions) : arrêt anticipé et réactivation, journalisés
 * dans le flux d'activité. Les dates et le pourcentage se modifient en SQL
 * (voir la migration 20261127005000_promotions.sql).
 */
export function DashboardPromotionsView({
  accessToken,
  onUnauthorized,
  onCounts,
}: {
  accessToken: string;
  onUnauthorized: () => void;
  onCounts: (counts: { total: number; last24h: number }) => void;
}) {
  const [rows, setRows] = useState<AdminPromotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState<Pending | null>(null);
  const [busy, setBusy] = useState(false);

  const fail = useCallback(
    (error: unknown, fallback: string) => {
      if (isAdminUnauthorized(error)) {
        onUnauthorized();
        return;
      }
      setNotice({ kind: "error", text: errorMessage(error, fallback) });
    },
    [onUnauthorized],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await listPromotions(accessToken));
    } catch (error) {
      setRows([]);
      fail(error, "Impossible de charger les promotions.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, fail]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    onCounts({ total: rows.length, last24h: 0 });
  }, [rows, onCounts]);

  const confirm = async () => {
    if (!pending) return;
    const { promotion, action } = pending;
    setBusy(true);
    try {
      if (action === "deactivate") {
        await deactivatePromotion(accessToken, promotion.id);
        setNotice({
          kind: "success",
          text: `Promotion « ${promotion.label} » désactivée : les nouvelles commandes sont au prix normal.`,
        });
      } else {
        await activatePromotion(accessToken, promotion.id);
        setNotice({ kind: "success", text: `Promotion « ${promotion.label} » réactivée.` });
      }
      setPending(null);
      await refresh();
    } catch (error) {
      setPending(null);
      fail(error, "La modification a échoué.");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <DashboardNotice notice={notice} onClose={() => setNotice(null)} />

      <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
        <div className="border-b border-wl-border p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-wl-text">Promotions</h2>
              <p className="mt-1 text-sm text-wl-text-secondary">
                Prix promotionnel appliqué automatiquement pendant la période (heure de Casablanca).
                Une commande déjà créée garde son prix.
              </p>
            </div>
            <Button
              onClick={() => void refresh()}
              variant="outline"
              className={`w-full sm:w-auto ${neutralActionButtonClass}`}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-wl-border text-sm">
              <thead>
                <tr className="text-left text-wl-text-secondary">
                  <th className="py-3 pr-4 font-medium">Promotion</th>
                  <th className="py-3 pr-4 font-medium">Produits</th>
                  <th className="py-3 pr-4 font-medium">Période</th>
                  <th className="py-3 pr-4 font-medium">Statut</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wl-border">
                {rows.map((promotion) => {
                  const badge = STATUS_BADGES[promotion.status];
                  const windowOver = new Date(promotion.endsAt).getTime() <= Date.now();
                  return (
                    <tr key={promotion.id} className="align-top">
                      <td className="whitespace-nowrap py-3 pr-4">
                        <span className="font-semibold text-wl-text">{promotion.label}</span>{" "}
                        <span className="text-wl-text-secondary">{percentLabel(promotion)}</span>
                      </td>
                      <td className="min-w-48 py-3 pr-4 text-wl-text-secondary">
                        {promotion.products.map((product) => (
                          <p key={product.slug}>{product.label}</p>
                        ))}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-wl-text-secondary">
                        {formatWindow(promotion)}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3">
                        {promotion.active && !windowOver ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700"
                            disabled={busy}
                            onClick={() => setPending({ promotion, action: "deactivate" })}
                          >
                            <PowerOff className="h-4 w-4" />
                            Désactiver
                          </Button>
                        ) : null}
                        {!promotion.active && !windowOver ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className={neutralActionButtonClass}
                            disabled={busy}
                            onClick={() => setPending({ promotion, action: "activate" })}
                          >
                            <Power className="h-4 w-4" />
                            Réactiver
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {loading && !rows.length ? (
            <p className="flex items-center gap-2 text-sm text-wl-text-secondary">
              <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
            </p>
          ) : null}
          {!rows.length && !loading ? (
            <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
              Aucune promotion.
            </div>
          ) : null}
        </div>
      </section>

      {pending ? (
        <DashboardConfirmModal
          title={pending.action === "deactivate" ? "Désactiver la promotion" : "Réactiver la promotion"}
          confirmLabel={pending.action === "deactivate" ? "Désactiver" : "Réactiver"}
          confirmClassName={
            pending.action === "deactivate"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-wl-blue text-white hover:bg-wl-blue-dark"
          }
          busy={busy}
          onClose={() => setPending(null)}
          onConfirm={() => void confirm()}
        >
          {pending.action === "deactivate" ? (
            <p>
              La promotion <strong className="text-wl-text">{pending.promotion.label}</strong> (
              {percentLabel(pending.promotion)}) s&apos;arrête immédiatement : les nouvelles commandes
              seront au prix normal, sur le site comme au paiement. Les commandes déjà créées gardent
              leur prix. Vous pourrez la réactiver jusqu&apos;à la fin de sa période.
            </p>
          ) : (
            <p>
              La promotion <strong className="text-wl-text">{pending.promotion.label}</strong> (
              {percentLabel(pending.promotion)}) s&apos;appliquera de nouveau pendant sa période (
              {formatWindow(pending.promotion)}).
            </p>
          )}
        </DashboardConfirmModal>
      ) : null}
    </div>
  );
}
