"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Ban, Check, Copy, Loader2, Plus, RefreshCw, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createDiscountCode, listCodes, resendCode, revokeCode } from "@/lib/api/admin-commerce";
import type { AdminCode, CodeKind, CodeStatus } from "@/types/admin-commerce";
import {
  addDays,
  DashboardNotice,
  endOfDayIso,
  errorMessage,
  formatDay,
  isAdminUnauthorized,
  toDateInputValue,
  type Notice,
} from "./dashboard-commerce-utils";
import { DashboardConfirmModal } from "./dashboard-confirm-modal";
import { DashboardSegmentedToggle, type SegmentedToggleOption } from "./dashboard-segmented-toggle";
import { neutralActionButtonClass } from "./dashboard-utils";

type KindFilter = CodeKind | "all";

const KIND_OPTIONS: Array<SegmentedToggleOption<KindFilter>> = [
  { id: "all", label: "Tous" },
  { id: "discount", label: "Réduction" },
  { id: "student", label: "Étudiant" },
];

const STATUS_BADGES: Record<CodeStatus, { label: string; className: string }> = {
  active: { label: "Actif", className: "border-wl-success/30 bg-wl-success-tint text-wl-success" },
  used: { label: "Utilisé", className: "border-wl-blue/20 bg-wl-blue-tint text-wl-blue" },
  expired: { label: "Expiré", className: "border-wl-border bg-wl-gray-light text-wl-text-secondary" },
  revoked: { label: "Révoqué", className: "border-red-200 bg-red-50 text-red-700" },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_VALIDITY_DAYS = 30;
const MAX_VALIDITY_DAYS = 365;

function kindLabel(code: AdminCode): string {
  return code.kind === "discount" ? `Réduction ${code.percentOff ?? ""} %` : "Étudiant";
}

/** Coupure de ligne preferee avant « @ » pour les adresses longues. */
function breakableEmail(email: string) {
  const at = email.indexOf("@");
  if (at <= 0) return email;
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  );
}

function productLabel(code: AdminCode): string {
  if (code.productLabel) return code.productLabel;
  return code.kind === "discount" ? "Toute formation (hors Pack Étudiants)" : "—";
}

export function DashboardCodesView({
  accessToken,
  onUnauthorized,
  onCounts,
}: {
  accessToken: string;
  onUnauthorized: () => void;
  onCounts: (counts: { total: number; last24h: number }) => void;
}) {
  const today = useMemo(() => new Date(), []);
  const [kind, setKind] = useState<KindFilter>("all");
  const [rows, setRows] = useState<AdminCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<AdminCode | null>(null);

  const [email, setEmail] = useState("");
  const [expiry, setExpiry] = useState(() => toDateInputValue(addDays(today, DEFAULT_VALIDITY_DAYS)));
  const [sendEmail, setSendEmail] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

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
      setRows(await listCodes(accessToken, kind));
    } catch (error) {
      setRows([]);
      fail(error, "Impossible de charger les codes.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, kind, fail]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    onCounts({
      total: rows.length,
      last24h: rows.filter((row) => Date.now() - new Date(row.createdAt).getTime() <= 86_400_000).length,
    });
  }, [rows, onCounts]);

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized || normalized.length > 64 || !EMAIL_REGEX.test(normalized)) {
      setFormError("Adresse e-mail invalide.");
      return;
    }
    const expiresAt = endOfDayIso(expiry);
    if (!expiresAt) {
      setFormError("Date d'expiration invalide.");
      return;
    }
    setFormError(null);
    setCreating(true);
    try {
      const created = await createDiscountCode(accessToken, { email: normalized, expiresAt, sendEmail });
      setNotice({
        kind: !sendEmail || created.emailSent ? "success" : "error",
        text: !sendEmail
          ? `Code ${created.code} créé pour ${created.customerEmail} (non envoyé par e-mail).`
          : created.emailSent
            ? `Code ${created.code} créé et envoyé à ${created.customerEmail}.`
            : `Code ${created.code} créé, mais l'e-mail n'a pas pu être envoyé. Utilisez « Renvoyer l'e-mail ».`,
      });
      setEmail("");
      setSendEmail(false);
      setExpiry(toDateInputValue(addDays(new Date(), DEFAULT_VALIDITY_DAYS)));
      await refresh();
    } catch (error) {
      if (isAdminUnauthorized(error)) {
        onUnauthorized();
        return;
      }
      // Ex. : un code actif existe deja pour cet e-mail (message du backend).
      setFormError(errorMessage(error, "La création du code a échoué."));
    } finally {
      setCreating(false);
    }
  };

  const copy = async (code: AdminCode) => {
    try {
      await navigator.clipboard.writeText(code.code);
      setCopiedId(code.id);
      window.setTimeout(() => setCopiedId((current) => (current === code.id ? null : current)), 2000);
    } catch {
      setNotice({ kind: "error", text: "Copie impossible : sélectionnez le code et copiez-le manuellement." });
    }
  };

  const confirmRevoke = async () => {
    if (!revoking) return;
    const code = revoking;
    setBusyId(code.id);
    try {
      await revokeCode(accessToken, code.id);
      setNotice({ kind: "success", text: `Code ${code.code} révoqué.` });
      setRevoking(null);
      await refresh();
    } catch (error) {
      setRevoking(null);
      fail(error, "La révocation a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (code: AdminCode) => {
    setBusyId(code.id);
    try {
      await resendCode(accessToken, code.id);
      setNotice({ kind: "success", text: `E-mail renvoyé à ${code.customerEmail}.` });
    } catch (error) {
      fail(error, "L'e-mail n'a pas pu être envoyé.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <DashboardNotice notice={notice} onClose={() => setNotice(null)} />

      <section className="rounded-2xl border border-wl-border bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-lg font-semibold text-wl-text">Créer un code 5 %</h2>
        <p className="mt-1 text-sm text-wl-text-secondary">
          Code personnel, lié à l&apos;adresse e-mail du client, utilisable une seule fois. Un seul code
          actif par client.
        </p>
        <form onSubmit={(event) => void create(event)} noValidate className="mt-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
            <div>
              <Label htmlFor="code-email" className="text-sm font-medium text-wl-text">
                E-mail du client
              </Label>
              <Input
                id="code-email"
                type="email"
                value={email}
                maxLength={64}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFormError(null);
                }}
                placeholder="client@exemple.com"
                className="mt-1 border-wl-border bg-white text-wl-text placeholder:text-wl-text-tertiary"
              />
            </div>
            <div>
              <Label htmlFor="code-expiry" className="text-sm font-medium text-wl-text">
                Expire le
              </Label>
              <Input
                id="code-expiry"
                type="date"
                value={expiry}
                min={toDateInputValue(today)}
                max={toDateInputValue(addDays(today, MAX_VALIDITY_DAYS))}
                onChange={(event) => {
                  setExpiry(event.target.value);
                  setFormError(null);
                }}
                className="mt-1 border-wl-border bg-white text-wl-text"
              />
            </div>
            <Button
              type="submit"
              disabled={creating}
              className="bg-wl-blue text-white hover:bg-wl-blue-dark"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Créer un code 5 %
            </Button>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-wl-text">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(event) => setSendEmail(event.target.checked)}
              className="h-4 w-4 rounded border-wl-border accent-wl-blue"
            />
            Envoyer par e-mail
          </label>
          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
        </form>
      </section>

      <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
        <div className="border-b border-wl-border p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-wl-text">Codes de réduction</h2>
              <p className="mt-1 text-sm text-wl-text-secondary">
                Codes de réduction et codes étudiants. Un code n&apos;est consommé qu&apos;au paiement
                confirmé.
              </p>
              <div className="mt-3">
                <DashboardSegmentedToggle value={kind} options={KIND_OPTIONS} onChange={setKind} />
              </div>
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
                  <th className="py-3 pr-4 font-medium">Code</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">E-mail</th>
                  <th className="py-3 pr-4 font-medium">Produit</th>
                  <th className="py-3 pr-4 font-medium">Utilisations</th>
                  <th className="py-3 pr-4 font-medium">Expiration</th>
                  <th className="py-3 pr-4 font-medium">Statut</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wl-border">
                {rows.map((code) => {
                  const badge = STATUS_BADGES[code.status];
                  const busy = busyId === code.id;
                  const copied = copiedId === code.id;
                  return (
                    <tr key={code.id} className="align-top">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <span className="font-mono font-semibold text-wl-text">{code.code}</span>
                          <button
                            type="button"
                            onClick={() => void copy(code)}
                            aria-label={`Copier le code ${code.code}`}
                            title="Copier le code"
                            className="rounded p-1 text-wl-text-tertiary transition-colors hover:bg-wl-blue-tint hover:text-wl-blue"
                          >
                            {copied ? <Check className="h-4 w-4 text-wl-success" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="mt-0.5 text-xs text-wl-text-tertiary [overflow-wrap:anywhere]">
                          Par {code.createdBy}
                        </p>
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-wl-text-secondary">{kindLabel(code)}</td>
                      <td className="py-3 pr-4 text-wl-text-secondary [overflow-wrap:anywhere]">
                        {breakableEmail(code.customerEmail)}
                      </td>
                      <td className="min-w-40 py-3 pr-4 text-wl-text-secondary">{productLabel(code)}</td>
                      <td className="py-3 pr-4 text-wl-text-secondary">
                        {code.usedCount}/{code.maxUses}
                      </td>
                      <td className="py-3 pr-4 text-wl-text-secondary">{formatDay(code.expiresAt)}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col items-start gap-2">
                          {code.kind === "discount" && code.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className={neutralActionButtonClass}
                              disabled={busy}
                              onClick={() => void resend(code)}
                            >
                              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                              Renvoyer l&apos;e-mail
                            </Button>
                          ) : null}
                          {code.status === "active" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700"
                              disabled={busy}
                              onClick={() => setRevoking(code)}
                            >
                              <Ban className="h-4 w-4" />
                              Révoquer
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!rows.length && !loading ? (
            <div className="rounded-lg border border-dashed border-wl-border bg-wl-gray-light px-4 py-8 text-center text-sm text-wl-text-secondary">
              Aucun code pour le moment.
            </div>
          ) : null}
        </div>
      </section>

      {revoking ? (
        <DashboardConfirmModal
          title="Révoquer le code"
          confirmLabel="Révoquer"
          confirmClassName="bg-red-600 text-white hover:bg-red-700"
          busy={busyId === revoking.id}
          onClose={() => setRevoking(null)}
          onConfirm={() => void confirmRevoke()}
        >
          <p>
            Le code <strong className="font-mono text-wl-text">{revoking.code}</strong> ({revoking.customerEmail})
            ne pourra plus être utilisé. Cette action est définitive.
          </p>
        </DashboardConfirmModal>
      ) : null}
    </div>
  );
}
