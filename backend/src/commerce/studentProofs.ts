import { randomUUID } from "crypto";
import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import {
  PROOF_MIN_HUMAN_ELAPSED_MS,
  PROOF_UPLOAD_RATE_LIMIT,
  STUDENT_PROOF_MAX_BYTES,
} from "../config/commerce";
import { trySend, type Mailer } from "../lib/mailer";
import { createRateLimiter } from "../lib/rateLimit";
import { proofNotificationEmail, proofReceivedEmail } from "./emails";
import { detectProofType, normalizeDeclaredMime, type ProofFiles } from "./proofFiles";
import type { StudentProofStore } from "./store";

/*
 * POST /api/students/proofs (multipart/form-data)
 *   full_name, email, phone (facultatif), page_slug, consent, file
 *   + anti-bot : website (piege, doit rester vide), elapsed_ms (piege temporel).
 * Reponses JSON : 201 { ok: true } | 400 / 429 / 500 { ok: false, message }.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s().-]{8,20}$/;
const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 64;
const MAX_PAGE_SLUG_LENGTH = 100;

type Reply = { ok: true } | { ok: false; message: string };

const MESSAGES = {
  invalid: "Formulaire invalide. Merci de vérifier vos informations.",
  name: "Merci de renseigner votre nom et prénom.",
  email: "Merci de saisir une adresse e-mail valide.",
  phone: "Merci de saisir un numéro de téléphone valide.",
  formation: "Formation inconnue.",
  consent: "Merci d'accepter le traitement de votre justificatif.",
  fileMissing: "Merci de joindre votre justificatif.",
  fileType: "Formats acceptés : PDF, JPG ou PNG.",
  fileSize: "Le fichier ne doit pas dépasser 5 Mo.",
  rateLimited: "Trop d'envois depuis cette connexion. Merci de réessayer plus tard.",
  error: "Une erreur est survenue. Merci de réessayer dans quelques minutes.",
} as const;

export interface StudentProofDeps {
  store: StudentProofStore;
  files: ProofFiles;
  mailer: Mailer;
  /** Destinataire interne des notifications (CONTACT_RECIPIENT). */
  notifyRecipient: string;
  newId?: () => string;
}

function fail(res: Response<Reply>, status: number, message: string): void {
  res.status(status).json({ ok: false, message });
}

/** Champ texte : "" si absent, null si non-chaine (cle dupliquee). */
function textField(body: unknown, key: string): string | null {
  if (!body || typeof body !== "object") return "";
  const value = (body as Record<string, unknown>)[key];
  if (value === undefined) return "";
  return typeof value === "string" ? value : null;
}

export function createStudentProofsRouter({
  store,
  files,
  mailer,
  notifyRecipient,
  newId = randomUUID,
}: StudentProofDeps): Router {
  const router = Router();

  const rateLimit = createRateLimiter({
    name: "student-proofs",
    ...PROOF_UPLOAD_RATE_LIMIT,
    onLimited: (_req, res) => fail(res, 429, MESSAGES.rateLimited),
  });

  const parseUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: STUDENT_PROOF_MAX_BYTES,
      files: 1,
      fields: 10,
      fieldSize: 2048,
      parts: 11,
    },
  }).single("file");

  /** Erreurs multipart -> reponse JSON propre (jamais le gestionnaire Express). */
  function multipart(req: Request, res: Response, next: NextFunction): void {
    parseUpload(req, res, (error?: unknown) => {
      if (!error) {
        next();
        return;
      }
      if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
        fail(res, 400, MESSAGES.fileSize);
        return;
      }
      fail(res, 400, MESSAGES.invalid);
    });
  }

  async function submit(req: Request, res: Response<Reply>): Promise<void> {
    const body: unknown = req.body;

    // Anti-bot : on repond comme un succes, sans rien enregistrer ni envoyer.
    const honeypot = textField(body, "website");
    if (honeypot === null || honeypot.trim()) {
      console.warn("[students] honeypot triggered");
      res.status(201).json({ ok: true });
      return;
    }
    const elapsedRaw = textField(body, "elapsed_ms");
    const elapsedMs = elapsedRaw ? Number(elapsedRaw) : NaN;
    if (Number.isFinite(elapsedMs) && elapsedMs < PROOF_MIN_HUMAN_ELAPSED_MS) {
      console.warn(`[students] time-trap triggered elapsedMs=${Math.round(elapsedMs)}`);
      res.status(201).json({ ok: true });
      return;
    }

    const fullName = textField(body, "full_name")?.trim() ?? null;
    const emailInput = textField(body, "email")?.trim() ?? null;
    const phoneInput = textField(body, "phone")?.trim().replace(/\s+/g, " ") ?? null;
    const pageSlug = textField(body, "page_slug")?.trim() ?? null;
    const consent = textField(body, "consent")?.trim() ?? null;

    if (!fullName || Array.from(fullName).length > MAX_NAME_LENGTH) {
      return fail(res, 400, MESSAGES.name);
    }
    if (
      !emailInput ||
      emailInput.length > MAX_EMAIL_LENGTH ||
      !EMAIL_REGEX.test(emailInput)
    ) {
      return fail(res, 400, MESSAGES.email);
    }
    if (phoneInput === null || (phoneInput && !PHONE_REGEX.test(phoneInput))) {
      return fail(res, 400, MESSAGES.phone);
    }
    if (!pageSlug || pageSlug.length > MAX_PAGE_SLUG_LENGTH) {
      return fail(res, 400, MESSAGES.formation);
    }
    if (consent !== "on" && consent !== "true") {
      return fail(res, 400, MESSAGES.consent);
    }

    const file = req.file;
    if (!file || file.size === 0) {
      return fail(res, 400, MESSAGES.fileMissing);
    }
    if (file.size > STUDENT_PROOF_MAX_BYTES) {
      return fail(res, 400, MESSAGES.fileSize);
    }
    // Type annonce ET signature reelle du fichier, qui doivent concorder.
    const declared = normalizeDeclaredMime(file.mimetype ?? "");
    const detected = detectProofType(file.buffer);
    if (!declared || !detected || detected.mime !== declared) {
      return fail(res, 400, MESSAGES.fileType);
    }

    const email = emailInput.toLowerCase();
    const id = newId();
    const path = `${id}.${detected.ext}`;
    let uploaded = false;

    try {
      const product = await store.findStudentProductByPageSlug(pageSlug);
      if (!product) {
        return fail(res, 400, MESSAGES.formation);
      }

      await files.upload(path, file.buffer, detected.mime);
      uploaded = true;

      await store.insertStudentProof({
        id,
        full_name: fullName,
        email,
        phone: phoneInput || null,
        page_slug: pageSlug,
        file_path: path,
        file_mime: detected.mime,
        file_size: file.size,
      });
    } catch (error) {
      console.error(
        `[students] proof submission failed: ${error instanceof Error ? error.message : "unknown error"}`,
      );
      if (uploaded) {
        // Pas de ligne en base : le fichier orphelin est supprime.
        await files.remove(path).catch(() => {
          console.error(`[students] orphan file could not be removed id=${id}`);
        });
      }
      return fail(res, 500, MESSAGES.error);
    }

    console.log(`[students] proof received id=${id}`);

    await Promise.all([
      trySend(
        mailer,
        "proof acknowledgement",
        proofReceivedEmail({ to: email, fullName, replyTo: notifyRecipient }),
      ),
      trySend(
        mailer,
        "proof notification",
        proofNotificationEmail({
          to: notifyRecipient,
          fullName,
          email,
          phone: phoneInput || null,
          pageSlug,
        }),
      ),
    ]);

    res.status(201).json({ ok: true });
  }

  router.post("/proofs", rateLimit, multipart, submit);
  return router;
}
