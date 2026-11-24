"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, FileText, Loader2, Mail, RefreshCw, Send, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  approveStudentProof,
  getStudentProofFileUrl,
  listStudentProofs,
  rejectStudentProof,
  resendStudentProofCode,
} from "@/lib/api/admin-commerce";
import type { AdminStudentProof, ProofStatus } from "@/types/admin-commerce";
import {
  DashboardNotice,
  errorMessage,
  formatDay,
  isAdminUnauthorized,
  type Notice,
} from "./dashboard-commerce-utils";
import { DashboardConfirmModal } from "./dashboard-confirm-modal";
import { DashboardSegmentedToggle, type SegmentedToggleOption } from "./dashboard-segmented-toggle";
import { formatDate, neutralActionButtonClass } from "./dashboard-utils";

type StatusFilter = ProofStatus | "ALL";

const STATUS_OPTIONS: Array<SegmentedToggleOption<StatusFilter>> = [
  { id: "PENDING", label: "À examiner" },
  { id: "APPROVED", label: "Validés" },
  { id: "REJECTED", label: "Refusés" },
  { id: "ALL", label: "Tous" },
];

const STATUS_BADGES: Record<ProofStatus, { label: string; className: string }> = {
  PENDING: { label: "À examiner", className: "border-wl-orange/30 bg-wl-orange-tint text-wl-orange" },
  APPROVED: { label: "Validé", className: "border-wl-success/30 bg-wl-success-tint text-wl-success" },
  REJECTED: { label: "Refusé", className: "border-red-200 bg-red-50 text-red-700" },
};

function codeIsActive(code: NonNullable<AdminStudentProof["code"]>): boolean {
  return !code.revokedAt && code.usedCount === 0 && new Date(code.expiresAt).getTime() > Date.now();
}

function codeState(code: NonNullable<AdminStudentProof["code"]>): string | null {
  if (code.revokedAt) return "révoqué";
  if (code.usedCount > 0) return "utilisé";
  if (new Date(code.expiresAt).getTime() <= Date.now()) return "expiré";
  return null;
}

export function DashboardStudentProofsView({
  accessToken,
  onUnauthorized,
  onCounts,
}: {
  accessToken: string;
  onUnauthorized: () => void;
  onCounts: (counts: { total: number; last24h: number }) => void;
}) {
  const [status, setStatus] = useState<StatusFilter>("PENDING");
  const [rows, setRows] = useState<AdminStudentProof[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [approving, setApproving] = useState<AdminStudentProof | null>(null);
  const [rejecting, setRejecting] = useState<AdminStudentProof | null>(null);

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
      setRows(await listStudentProofs(accessToken, status));
    } catch (error) {
      setRows([]);
      fail(error, "Impossible de charger les justificatifs.");
    } finally {
      setLoading(false);
    }
  }, [accessToken, status, fail]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    onCounts({
      total: rows.length,
      last24h: rows.filter((row) => Date.now() - new Date(row.createdAt).getTime() <= 86_400_000).length,
    });
  }, [rows, onCounts]);

  /**
   * Onglet ouvert AU CLIC (sinon bloque comme pop-up), puis dirige vers l'URL
   * signee (60 s) une fois recue. opener coupe : le document ne peut pas
   * piloter le dashboard.
   */
  const openDocument = async (proof: AdminStudentProof) => {
    const tab = window.open("", "_blank");
    if (tab) tab.opener = null;
    setBusyId(proof.id);
    try {
      const url = await getStudentProofFileUrl(accessToken, proof.id);
      if (tab) {
        tab.location.href = url;
      } else {
        setNotice({
          kind: "error",
          text: "Le navigateur a bloqué l'ouverture d'un nouvel onglet. Autorisez les fenêtres pop-up pour ce site.",
        });
      }
    } catch (error) {
      tab?.close();
      fail(error, "Le document n'a pas pu être ouvert.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmApprove = async () => {
    if (!approving) return;
    const proof = approving;
    setBusyId(proof.id);
    try {
      const result = await approveStudentProof(accessToken, proof.id);
      setNotice(
        result.emailSent
          ? { kind: "success", text: `Code ${result.code} envoyé à ${proof.email}.` }
          : {
              kind: "error",
              text: `Code ${result.code} créé, mais l'e-mail n'a pas pu être envoyé. Utilisez « Renvoyer l'e-mail ».`,
            },
      );
      setApproving(null);
      await refresh();
    } catch (error) {
      setApproving(null);
      fail(error, "La validation a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmReject = async (reason: string) => {
    if (!rejecting) return;
    const proof = rejecting;
    setBusyId(proof.id);
    try {
      const result = await rejectStudentProof(accessToken, proof.id, reason);
      setNotice(
        result.emailSent
          ? { kind: "success", text: `Justificatif refusé. Le motif a été envoyé à ${proof.email}.` }
          : {
              kind: "error",
              text: `Justificatif refusé, mais l'e-mail n'a pas pu être envoyé. Contactez ${proof.email} directement.`,
            },
      );
      setRejecting(null);
      await refresh();
    } catch (error) {
      setRejecting(null);
      fail(error, "Le refus a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  const resend = async (proof: AdminStudentProof) => {
    setBusyId(proof.id);
    try {
      await resendStudentProofCode(accessToken, proof.id);
      setNotice({ kind: "success", text: `E-mail renvoyé à ${proof.email}.` });
    } catch (error) {
      fail(error, "L'e-mail n'a pas pu être envoyé.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <DashboardNotice notice={notice} onClose={() => setNotice(null)} />

      <section className="rounded-2xl border border-wl-border bg-white shadow-sm">
        <div className="border-b border-wl-border p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-wl-text">Justificatifs étudiants</h2>
              <p className="mt-1 text-sm text-wl-text-secondary">
                Validez un justificatif pour envoyer à l&apos;étudiant son code personnel du Pack Étudiants.
              </p>
              <div className="mt-3">
                <DashboardSegmentedToggle value={status} options={STATUS_OPTIONS} onChange={setStatus} />
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
                  <th className="py-3 pr-4 font-medium">Étudiant</th>
                  <th className="py-3 pr-4 font-medium">E-mail</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 pr-4 font-medium">Statut</th>
                  <th className="py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wl-border">
                {rows.map((proof) => {
                  const badge = STATUS_BADGES[proof.status];
                  const busy = busyId === proof.id;
                  const state = proof.code ? codeState(proof.code) : null;
                  return (
                    <tr key={proof.id} className="align-top">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-wl-text">{proof.fullName}</p>
                        {proof.phone ? (
                          <p className="text-xs text-wl-text-secondary">{proof.phone}</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4 text-wl-text-secondary">{proof.email}</td>
                      <td className="py-3 pr-4 text-wl-text-secondary">{formatDate(proof.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                        {proof.code ? (
                          <p className="mt-1.5 text-xs text-wl-text-secondary">
                            <span className="font-mono font-semibold text-wl-text">{proof.code.code}</span>
                            {" · "}
                            {state ?? `valable jusqu'au ${formatDay(proof.code.expiresAt)}`}
                          </p>
                        ) : null}
                        {proof.status === "REJECTED" && proof.rejectionReason ? (
                          <p className="mt-1.5 max-w-xs text-xs text-wl-text-secondary">
                            Motif : {proof.rejectionReason}
                          </p>
                        ) : null}
                        {proof.reviewedBy ? (
                          <p className="mt-1 text-xs text-wl-text-tertiary">Par {proof.reviewedBy}</p>
                        ) : null}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-2 xl:flex-row xl:flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            className={neutralActionButtonClass}
                            disabled={busy}
                            onClick={() => void openDocument(proof)}
                          >
                            <FileText className="h-4 w-4" />
                            Voir le document
                          </Button>
                          {proof.status === "PENDING" ? (
                            <>
                              <Button
                                size="sm"
                                className="bg-wl-blue text-white hover:bg-wl-blue-dark"
                                disabled={busy}
                                onClick={() => setApproving(proof)}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Valider et envoyer le code
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700"
                                disabled={busy}
                                onClick={() => setRejecting(proof)}
                              >
                                <XCircle className="h-4 w-4" />
                                Refuser
                              </Button>
                            </>
                          ) : null}
                          {proof.status === "APPROVED" && proof.code && codeIsActive(proof.code) ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className={neutralActionButtonClass}
                              disabled={busy}
                              onClick={() => void resend(proof)}
                            >
                              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                              Renvoyer l&apos;e-mail
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
              Aucun justificatif {status === "PENDING" ? "à examiner" : "pour ce filtre"}.
            </div>
          ) : null}
        </div>
      </section>

      {approving ? (
        <DashboardConfirmModal
          title="Valider le justificatif"
          confirmLabel="Valider et envoyer le code"
          busy={busyId === approving.id}
          onClose={() => setApproving(null)}
          onConfirm={() => void confirmApprove()}
        >
          <p>
            <strong className="text-wl-text">{approving.fullName}</strong> recevra par e-mail un code
            personnel pour le Pack Étudiants, valable 30 jours et utilisable avec{" "}
            <span className="inline-flex items-center gap-1 font-medium text-wl-text">
              <Mail className="h-3.5 w-3.5" />
              {approving.email}
            </span>
            .
          </p>
        </DashboardConfirmModal>
      ) : null}

      {rejecting ? (
        <DashboardConfirmModal
          title="Refuser le justificatif"
          confirmLabel="Refuser"
          confirmClassName="bg-red-600 text-white hover:bg-red-700"
          busy={busyId === rejecting.id}
          textLabel="Motif du refus (obligatoire, envoyé à l'étudiant)"
          textPlaceholder="Ex. : document illisible, année universitaire non visible..."
          textMaxLength={1000}
          onClose={() => setRejecting(null)}
          onConfirm={(reason) => void confirmReject(reason)}
        >
          <p>
            Le motif sera envoyé à <strong className="text-wl-text">{rejecting.email}</strong>, qui pourra
            déposer un nouveau justificatif.
          </p>
        </DashboardConfirmModal>
      ) : null}
    </div>
  );
}
