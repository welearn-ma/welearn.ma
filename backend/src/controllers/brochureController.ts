import { Request, Response } from "express";
import {
  BROCHURE_BUCKET,
  BROCHURE_URL_TTL_SECONDS,
  getBrochureConfig,
} from "../config/brochures";
import { supabase } from "../lib/supabaseClient";
import type {
  BrochureRequestPayload,
  BrochureRequestResponse,
} from "../types/brochure";

// Validateurs dupliques depuis registrationController (non exportes la-bas) :
// garder les deux en phase.
function isEmpty(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

/** Envoi plus rapide que ce seuil apres l'ouverture du formulaire = bot. */
const MIN_HUMAN_ELAPSED_MS = 3000;

export async function requestBrochure(
  req: Request,
  res: Response<BrochureRequestResponse>,
) {
  const payload = (req.body ?? {}) as Partial<BrochureRequestPayload>;

  // Piege temporel : envoi trop rapide -> on repond comme un succes, sans
  // insertion ni URL. `elapsedMs` absent ou non numerique (ancien frontend
  // en cache) -> parcours normal.
  const { elapsedMs } = payload as { elapsedMs?: unknown };
  if (typeof elapsedMs === "number" && elapsedMs < MIN_HUMAN_ELAPSED_MS) {
    // Une seule ligne, sans donnee personnelle.
    console.warn(
      `[brochures] time-trap triggered formationSlug=${JSON.stringify(
        String(payload.formationSlug ?? "").slice(0, 100),
      )} elapsedMs=${elapsedMs}`,
    );
    return res.status(200).json({ ok: true });
  }

  if (isEmpty(payload.fullName)) {
    return res
      .status(400)
      .json({ ok: false, message: "fullName is required" });
  }

  if (isEmpty(payload.email)) {
    return res.status(400).json({ ok: false, message: "email is required" });
  }

  if (!emailRegex.test(String(payload.email).trim())) {
    return res
      .status(400)
      .json({ ok: false, message: "email format is invalid" });
  }

  if (isEmpty(payload.phone)) {
    return res.status(400).json({ ok: false, message: "phone is required" });
  }

  if (!phoneRegex.test(String(payload.phone).trim())) {
    return res
      .status(400)
      .json({ ok: false, message: "phone format is invalid" });
  }

  if (isEmpty(payload.formationSlug)) {
    return res
      .status(400)
      .json({ ok: false, message: "formationSlug is required" });
  }

  const brochure = getBrochureConfig(String(payload.formationSlug));
  if (!brochure) {
    return res
      .status(400)
      .json({ ok: false, message: "formationSlug is invalid" });
  }

  const { error: insertError } = await supabase
    .from("registration_requests")
    .insert({
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      company: payload.company ?? null,
      position: payload.position ?? null,
      message: payload.message ?? null,
      formation_slug: payload.formationSlug,
      // Titre issu de la config serveur, jamais du client.
      formation_title: brochure.formationTitle,
      source: "brochure",
    });

  if (insertError) {
    console.error("Supabase insert error (brochure request):", insertError);
    return res
      .status(500)
      .json({ ok: false, message: "Une erreur interne est survenue" });
  }

  const { data, error: signError } = await supabase.storage
    .from(BROCHURE_BUCKET)
    .createSignedUrl(brochure.storagePath, BROCHURE_URL_TTL_SECONDS, {
      download: brochure.downloadName,
    });

  if (signError || !data?.signedUrl) {
    console.error(
      `Supabase signed URL error (bucket=${BROCHURE_BUCKET}, path=${brochure.storagePath}):`,
      signError,
    );
    return res.status(502).json({
      ok: false,
      message:
        "Votre demande est enregistrée, mais le téléchargement a échoué. Notre équipe vous enverra la brochure.",
    });
  }

  return res.status(200).json({ ok: true, url: data.signedUrl });
}
