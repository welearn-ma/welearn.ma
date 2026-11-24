import { Router, type NextFunction, type Request, type Response } from "express";
import {
  CODE_MAX_VALIDITY_DAYS,
  CODE_VALIDITY_DAYS,
  DISCOUNT_EMAIL_PRODUCT_SLUG,
  DISCOUNT_PERCENT,
  PROOF_SIGNED_URL_TTL_SECONDS,
} from "../config/commerce";
import { trySend, type Mailer } from "../lib/mailer";
import { expireStalePendingOrders } from "../payments/expiry";
import { generateCode } from "./codes";
import {
  checkoutUrl,
  discountCodeEmail,
  formatDateCasablanca,
  proofApprovedEmail,
  proofPageUrl,
  proofRejectedEmail,
} from "./emails";
import type { ProofFiles } from "./proofFiles";
import type { AdminCommerceStore } from "./store";
import type {
  CodeKind,
  CodeRecord,
  NewCode,
  ProductRecord,
  ProofStatus,
  StudentProofRecord,
} from "./types";

/*
 * Admin (meme authentification que les autres routes /api/admin) :
 *   GET  /student-proofs?status=PENDING|APPROVED|REJECTED
 *   GET  /student-proofs/:id/file        URL signee 60 s
 *   POST /student-proofs/:id/approve     code etudiant (30 j) + e-mail
 *   POST /student-proofs/:id/reject      { reason } + e-mail
 *   POST /student-proofs/:id/resend      renvoie le code EXISTANT (jamais de nouveau code)
 *   GET  /codes?kind=student|discount
 *   POST /codes                          { email, expiresAt?, sendEmail? } -> code 5 %
 *   POST /codes/:id/revoke
 *   POST /codes/:id/resend               code de reduction actif : renvoie l'e-mail
 * Reponses : { success: true, data } | { success: false, message }.
 */

type AdminAccess =
  | { ok: true; email: string }
  | { ok: false; reason: "missing_token" | "invalid_token" | "not_admin" };

export interface AdminCommerceDeps {
  store: AdminCommerceStore;
  files: ProofFiles;
  mailer: Mailer;
  siteUrl: string;
  /** Adresse de reponse des e-mails envoyes aux clients (CONTACT_RECIPIENT). */
  replyTo: string;
  verifyAdmin: (token: string) => Promise<AdminAccess>;
  now?: () => Date;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 64;
const MAX_REASON_LENGTH = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CODE_INSERT_ATTEMPTS = 5;
const PROOF_STATUSES: ReadonlyArray<ProofStatus> = ["PENDING", "APPROVED", "REJECTED"];

/**
 * Meme regle que getBearerToken (lib/adminAuth) ; dupliquee ici pour que ce
 * module n'importe pas le client Supabase (tests sans base).
 */
function bearerToken(header: string | undefined): string {
  const [scheme, token] = (header ?? "").split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token.trim() : "";
}

function sendError(res: Response, status: number, message: string): void {
  res.status(status).json({ success: false, message });
}

function adminEmail(res: Response): string {
  return res.locals.adminEmail as string;
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

export type CodeStatus = "active" | "used" | "expired" | "revoked";

export function codeStatus(code: CodeRecord, now: Date): CodeStatus {
  if (code.revoked_at) return "revoked";
  if (code.used_count >= code.max_uses) return "used";
  if (new Date(code.expires_at).getTime() <= now.getTime()) return "expired";
  return "active";
}

const UNUSABLE_CODE_MESSAGES: Record<Exclude<CodeStatus, "active">, string> = {
  revoked: "Ce code a été révoqué : il ne peut pas être renvoyé.",
  used: "Ce code a déjà été utilisé : il ne peut pas être renvoyé.",
  expired: "Ce code a expiré : il ne peut pas être renvoyé.",
};

const RESEND_FAILED = "L'e-mail n'a pas pu être envoyé. Merci de réessayer.";

function toCodeView(code: CodeRecord, now: Date, labels: Map<string, string>) {
  return {
    id: code.id,
    code: code.code,
    kind: code.kind,
    percentOff: code.percent_off,
    productSlug: code.product_slug,
    productLabel: code.product_slug ? (labels.get(code.product_slug) ?? code.product_slug) : null,
    customerEmail: code.customer_email,
    usedCount: code.used_count,
    maxUses: code.max_uses,
    expiresAt: code.expires_at,
    revokedAt: code.revoked_at,
    createdBy: code.created_by,
    createdAt: code.created_at,
    status: codeStatus(code, now),
  };
}

function toProofView(proof: StudentProofRecord, code: CodeRecord | undefined) {
  return {
    id: proof.id,
    fullName: proof.full_name,
    email: proof.email,
    phone: proof.phone,
    pageSlug: proof.page_slug,
    fileMime: proof.file_mime,
    fileSize: proof.file_size,
    status: proof.status,
    rejectionReason: proof.rejection_reason,
    reviewedBy: proof.reviewed_by,
    reviewedAt: proof.reviewed_at,
    createdAt: proof.created_at,
    code: code
      ? { code: code.code, expiresAt: code.expires_at, usedCount: code.used_count, revokedAt: code.revoked_at }
      : null,
  };
}

export function createAdminCommerceRouters({
  store,
  files,
  mailer,
  siteUrl,
  replyTo,
  verifyAdmin,
  now = () => new Date(),
}: AdminCommerceDeps): { studentProofs: Router; codes: Router } {
  /** Meme reponses que les routes admin existantes. */
  async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    let access: AdminAccess;
    try {
      access = await verifyAdmin(bearerToken(req.header("authorization")));
    } catch (error) {
      console.error(`[admin] session check failed: ${describe(error)}`);
      return sendError(res, 500, "Vérification de la session impossible. Merci de réessayer.");
    }
    if (!access.ok) {
      if (access.reason === "not_admin") {
        return sendError(res, 403, "Acces refuse: compte non admin.");
      }
      return sendError(res, 401, "Session admin invalide ou expiree.");
    }
    res.locals.adminEmail = access.email;
    next();
  }

  function validId(req: Request, res: Response): string | null {
    const id = String(req.params.id ?? "").toLowerCase();
    if (!UUID_REGEX.test(id)) {
      sendError(res, 404, "Introuvable.");
      return null;
    }
    return id;
  }

  /** Insere un code avec une valeur aleatoire ; nouvel essai si collision. */
  async function insertWithFreshCode(base: Omit<NewCode, "code">): Promise<CodeRecord> {
    for (let attempt = 0; attempt < MAX_CODE_INSERT_ATTEMPTS; attempt += 1) {
      const inserted = await store.insertCode({ ...base, code: generateCode() });
      if (inserted !== "duplicate_code") {
        return inserted;
      }
    }
    throw new Error("code generation: too many collisions");
  }

  async function productLabels(): Promise<Map<string, string>> {
    const products: ProductRecord[] = await store.listProducts();
    return new Map(products.map((product) => [product.slug, product.label]));
  }

  // -------------------------------------------------------------------------
  // Justificatifs etudiants
  // -------------------------------------------------------------------------

  const studentProofs = Router();
  studentProofs.use(requireAdmin);

  studentProofs.get("/", async (req, res) => {
    const rawStatus = typeof req.query.status === "string" ? req.query.status.trim().toUpperCase() : "";
    if (rawStatus && rawStatus !== "ALL" && !PROOF_STATUSES.includes(rawStatus as ProofStatus)) {
      return sendError(res, 400, "Statut invalide.");
    }
    const status = rawStatus && rawStatus !== "ALL" ? (rawStatus as ProofStatus) : null;

    try {
      const proofs = await store.listStudentProofs(status);
      const codeIds = proofs.map((proof) => proof.code_id).filter((id): id is string => Boolean(id));
      const codes = codeIds.length ? await store.findCodesByIds(codeIds) : [];
      const codeById = new Map(codes.map((code) => [code.id, code]));
      res.json({
        success: true,
        data: proofs.map((proof) => toProofView(proof, proof.code_id ? codeById.get(proof.code_id) : undefined)),
      });
    } catch (error) {
      console.error(`[admin] student proofs list failed: ${describe(error)}`);
      sendError(res, 500, "Impossible de récupérer les justificatifs.");
    }
  });

  studentProofs.get("/:id/file", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;
    try {
      const proof = await store.findStudentProof(id);
      if (!proof) {
        return sendError(res, 404, "Justificatif introuvable.");
      }
      const url = await files.signedUrl(proof.file_path, PROOF_SIGNED_URL_TTL_SECONDS);
      res.json({ success: true, data: { url, expiresInSeconds: PROOF_SIGNED_URL_TTL_SECONDS } });
    } catch (error) {
      console.error(`[admin] proof file url failed id=${id}: ${describe(error)}`);
      sendError(res, 502, "Le document n'a pas pu être ouvert. Merci de réessayer.");
    }
  });

  studentProofs.post("/:id/approve", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;
    const actor = adminEmail(res);
    const at = now();

    try {
      const proof = await store.findStudentProof(id);
      if (!proof) {
        return sendError(res, 404, "Justificatif introuvable.");
      }
      if (proof.status !== "PENDING") {
        return sendError(res, 409, "Ce justificatif a déjà été traité.");
      }
      const product = await store.findStudentProductByPageSlug(proof.page_slug);
      if (!product) {
        return sendError(res, 409, "Aucun pack étudiant n'est associé à cette formation.");
      }

      // 1. Reservation du justificatif (PENDING -> APPROVED, conditionnel).
      const claimed = await store.reviewStudentProof(id, {
        status: "APPROVED",
        reviewed_by: actor,
        reviewed_at: at.toISOString(),
        rejection_reason: null,
      });
      if (!claimed) {
        return sendError(res, 409, "Ce justificatif a déjà été traité.");
      }

      // 2. Code etudiant ; en cas d'echec, le justificatif redevient PENDING.
      let code: CodeRecord;
      try {
        code = await insertWithFreshCode({
          kind: "student",
          percent_off: null,
          product_slug: product.slug,
          customer_email: proof.email,
          max_uses: 1,
          expires_at: new Date(at.getTime() + CODE_VALIDITY_DAYS * DAY_MS).toISOString(),
          created_by: actor,
          student_proof_id: id,
        });
      } catch (error) {
        await store.reopenStudentProof(id).catch((reopenError: unknown) => {
          console.error(`[admin] proof reopen failed id=${id}: ${describe(reopenError)}`);
        });
        throw error;
      }

      // 3. Lien justificatif -> code (le code reference deja le justificatif).
      await store.linkStudentProofCode(id, code.id).catch((error: unknown) => {
        console.error(`[admin] proof/code link failed id=${id}: ${describe(error)}`);
      });

      await store.logActivity({
        entity_type: "student_proof",
        entity_id: id,
        event_type: "proof_approved",
        actor_email: actor,
        note: null,
      });

      const emailSent = await trySend(
        mailer,
        "student code",
        proofApprovedEmail({
          to: proof.email,
          fullName: proof.full_name,
          code: code.code,
          expiresAt: code.expires_at,
          paymentUrl: checkoutUrl(siteUrl, product.slug),
          replyTo,
        }),
      );

      res.json({ success: true, data: { code: code.code, expiresAt: code.expires_at, emailSent } });
    } catch (error) {
      console.error(`[admin] proof approval failed id=${id}: ${describe(error)}`);
      sendError(res, 500, "La validation a échoué. Merci de réessayer.");
    }
  });

  studentProofs.post("/:id/reject", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;
    const reasonInput = (req.body as { reason?: unknown } | undefined)?.reason;
    const reason = typeof reasonInput === "string" ? reasonInput.trim() : "";
    if (!reason) {
      return sendError(res, 400, "Le motif du refus est obligatoire.");
    }
    if (Array.from(reason).length > MAX_REASON_LENGTH) {
      return sendError(res, 400, `Le motif ne doit pas dépasser ${MAX_REASON_LENGTH} caractères.`);
    }
    const actor = adminEmail(res);

    try {
      const proof = await store.findStudentProof(id);
      if (!proof) {
        return sendError(res, 404, "Justificatif introuvable.");
      }
      const reviewed = await store.reviewStudentProof(id, {
        status: "REJECTED",
        reviewed_by: actor,
        reviewed_at: now().toISOString(),
        rejection_reason: reason,
      });
      if (!reviewed) {
        return sendError(res, 409, "Ce justificatif a déjà été traité.");
      }

      await store.logActivity({
        entity_type: "student_proof",
        entity_id: id,
        event_type: "proof_rejected",
        actor_email: actor,
        note: reason,
      });

      const emailSent = await trySend(
        mailer,
        "proof rejection",
        proofRejectedEmail({
          to: proof.email,
          fullName: proof.full_name,
          reason,
          proofUrl: proofPageUrl(siteUrl, proof.page_slug),
          replyTo,
        }),
      );

      res.json({ success: true, data: { emailSent } });
    } catch (error) {
      console.error(`[admin] proof rejection failed id=${id}: ${describe(error)}`);
      sendError(res, 500, "Le refus a échoué. Merci de réessayer.");
    }
  });

  studentProofs.post("/:id/resend", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;

    try {
      const proof = await store.findStudentProof(id);
      if (!proof) {
        return sendError(res, 404, "Justificatif introuvable.");
      }
      const code = proof.status === "APPROVED" && proof.code_id
        ? await store.findCodeById(proof.code_id)
        : null;
      if (!code) {
        return sendError(res, 409, "Aucun code n'est associé à ce justificatif.");
      }
      const status = codeStatus(code, now());
      if (status !== "active") {
        return sendError(res, 409, UNUSABLE_CODE_MESSAGES[status]);
      }

      const sent = await trySend(
        mailer,
        "student code (resend)",
        proofApprovedEmail({
          to: proof.email,
          fullName: proof.full_name,
          code: code.code,
          expiresAt: code.expires_at,
          paymentUrl: checkoutUrl(siteUrl, code.product_slug ?? ""),
          replyTo,
        }),
      );
      if (!sent) {
        return sendError(res, 502, RESEND_FAILED);
      }
      await store.logActivity({
        entity_type: "student_proof",
        entity_id: id,
        event_type: "proof_email_resent",
        actor_email: adminEmail(res),
        note: null,
      });
      res.json({ success: true, data: { emailSent: true } });
    } catch (error) {
      console.error(`[admin] student code resend failed id=${id}: ${describe(error)}`);
      sendError(res, 500, RESEND_FAILED);
    }
  });

  // -------------------------------------------------------------------------
  // Codes
  // -------------------------------------------------------------------------

  const codes = Router();
  codes.use(requireAdmin);

  codes.post("/:id/resend", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;

    try {
      const code = await store.findCodeById(id);
      if (!code) {
        return sendError(res, 404, "Code introuvable.");
      }
      if (code.kind !== "discount") {
        return sendError(
          res,
          409,
          "Un code étudiant se renvoie depuis « Justificatifs étudiants ».",
        );
      }
      const status = codeStatus(code, now());
      if (status !== "active") {
        return sendError(res, 409, UNUSABLE_CODE_MESSAGES[status]);
      }

      const sent = await trySend(
        mailer,
        "discount code (resend)",
        discountCodeEmail({
          to: code.customer_email,
          code: code.code,
          expiresAt: code.expires_at,
          paymentUrl: checkoutUrl(siteUrl, code.product_slug ?? DISCOUNT_EMAIL_PRODUCT_SLUG),
          replyTo,
        }),
      );
      if (!sent) {
        return sendError(res, 502, RESEND_FAILED);
      }
      await store.logActivity({
        entity_type: "code",
        entity_id: id,
        event_type: "code_email_resent",
        actor_email: adminEmail(res),
        note: null,
      });
      res.json({ success: true, data: { emailSent: true } });
    } catch (error) {
      console.error(`[admin] discount code resend failed id=${id}: ${describe(error)}`);
      sendError(res, 500, RESEND_FAILED);
    }
  });

  codes.get("/", async (req, res) => {
    const rawKind = typeof req.query.kind === "string" ? req.query.kind.trim() : "";
    if (rawKind && rawKind !== "student" && rawKind !== "discount") {
      return sendError(res, 400, "Type de code invalide.");
    }
    const at = now();
    // Expiration paresseuse des commandes PENDING (comme a chaque /cmi/init).
    await expireStalePendingOrders(store, at);

    try {
      const [list, labels] = await Promise.all([
        store.listCodes(rawKind ? (rawKind as CodeKind) : null),
        productLabels(),
      ]);
      res.json({ success: true, data: list.map((code) => toCodeView(code, at, labels)) });
    } catch (error) {
      console.error(`[admin] codes list failed: ${describe(error)}`);
      sendError(res, 500, "Impossible de récupérer les codes.");
    }
  });

  codes.post("/", async (req, res) => {
    const body = (req.body ?? {}) as { email?: unknown; expiresAt?: unknown; sendEmail?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || email.length > MAX_EMAIL_LENGTH || !EMAIL_REGEX.test(email)) {
      return sendError(res, 400, "Adresse e-mail invalide.");
    }

    const at = now();
    let expiresAt = new Date(at.getTime() + CODE_VALIDITY_DAYS * DAY_MS);
    if (body.expiresAt !== undefined && body.expiresAt !== null && body.expiresAt !== "") {
      const requested = typeof body.expiresAt === "string" ? new Date(body.expiresAt) : new Date(NaN);
      const time = requested.getTime();
      if (
        !Number.isFinite(time) ||
        time <= at.getTime() ||
        time > at.getTime() + CODE_MAX_VALIDITY_DAYS * DAY_MS
      ) {
        return sendError(res, 400, "Date d'expiration invalide.");
      }
      expiresAt = requested;
    }
    if (body.sendEmail !== undefined && typeof body.sendEmail !== "boolean") {
      return sendError(res, 400, "Option d'envoi invalide.");
    }
    const sendEmail = body.sendEmail === true;
    const actor = adminEmail(res);

    try {
      // Un seul code de reduction actif par client.
      const existing = await store.findActiveDiscountCode(email, at.toISOString());
      if (existing) {
        return sendError(
          res,
          409,
          `Un code de réduction actif existe déjà pour cette adresse e-mail : ${existing.code} (valable jusqu'au ${formatDateCasablanca(existing.expires_at)}). Révoquez-le avant d'en créer un nouveau.`,
        );
      }

      const code = await insertWithFreshCode({
        kind: "discount",
        percent_off: DISCOUNT_PERCENT,
        product_slug: null,
        customer_email: email,
        max_uses: 1,
        expires_at: expiresAt.toISOString(),
        created_by: actor,
        student_proof_id: null,
      });

      await store.logActivity({
        entity_type: "code",
        entity_id: code.id,
        event_type: "code_created",
        actor_email: actor,
        note: null,
      });

      const emailSent = sendEmail
        ? await trySend(
            mailer,
            "discount code",
            discountCodeEmail({
              to: email,
              code: code.code,
              expiresAt: code.expires_at,
              paymentUrl: checkoutUrl(siteUrl, DISCOUNT_EMAIL_PRODUCT_SLUG),
              replyTo,
            }),
          )
        : false;

      res.status(201).json({
        success: true,
        data: { ...toCodeView(code, at, await productLabels().catch(() => new Map())), emailSent },
      });
    } catch (error) {
      console.error(`[admin] code creation failed: ${describe(error)}`);
      sendError(res, 500, "La création du code a échoué. Merci de réessayer.");
    }
  });

  codes.post("/:id/revoke", async (req, res) => {
    const id = validId(req, res);
    if (!id) return;
    const actor = adminEmail(res);
    const at = now();

    try {
      const code = await store.findCodeById(id);
      if (!code) {
        return sendError(res, 404, "Code introuvable.");
      }
      const revoked = !code.revoked_at && (await store.revokeCode(id, at.toISOString()));
      if (!revoked) {
        return sendError(res, 409, "Ce code est déjà révoqué.");
      }

      await store.logActivity({
        entity_type: "code",
        entity_id: id,
        event_type: "code_revoked",
        actor_email: actor,
        note: null,
      });

      const updated = (await store.findCodeById(id)) ?? { ...code, revoked_at: at.toISOString() };
      res.json({ success: true, data: toCodeView(updated, at, await productLabels()) });
    } catch (error) {
      console.error(`[admin] code revocation failed id=${id}: ${describe(error)}`);
      sendError(res, 500, "La révocation a échoué. Merci de réessayer.");
    }
  });

  return { studentProofs, codes };
}
