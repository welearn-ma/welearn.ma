import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import type { SponsorPayload, SponsorResponse } from "../types/sponsor";

/*
-- CREATE TABLE sponsors (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at timestamptz NOT NULL DEFAULT now(),
--   nom text NOT NULL,
--   prenom text NOT NULL,
--   entreprise text NOT NULL,
--   role text,
--   telephone text NOT NULL,
--   email text NOT NULL
-- );
-- CREATE TABLE sponsor_moocs (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   sponsor_id uuid NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
--   mooc_name text NOT NULL
-- );
-- ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sponsor_moocs ENABLE ROW LEVEL SECURITY;
*/

function isEmpty(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

export async function createSponsor(
  req: Request,
  res: Response<SponsorResponse>,
) {
  const payload = req.body as Partial<SponsorPayload>;

  if (isEmpty(payload.nom)) {
    return res.status(400).json({ success: false, message: "nom is required" });
  }

  if (isEmpty(payload.prenom)) {
    return res
      .status(400)
      .json({ success: false, message: "prenom is required" });
  }

  if (isEmpty(payload.entreprise)) {
    return res
      .status(400)
      .json({ success: false, message: "entreprise is required" });
  }

  if (isEmpty(payload.telephone)) {
    return res
      .status(400)
      .json({ success: false, message: "telephone is required" });
  }

  if (!phoneRegex.test(String(payload.telephone).trim())) {
    return res
      .status(400)
      .json({ success: false, message: "telephone format is invalid" });
  }

  if (isEmpty(payload.email)) {
    return res
      .status(400)
      .json({ success: false, message: "email is required" });
  }

  if (!emailRegex.test(String(payload.email).trim())) {
    return res
      .status(400)
      .json({ success: false, message: "email format is invalid" });
  }

  const moocs = Array.isArray(payload.moocs)
    ? payload.moocs.map((mooc) => String(mooc).trim()).filter(Boolean)
    : [];

  if (moocs.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "au moins un MOOC est requis" });
  }

  const { data: sponsor, error: sponsorError } = await supabase
    .from("sponsors")
    .insert({
      nom: payload.nom,
      prenom: payload.prenom,
      entreprise: payload.entreprise,
      role: payload.role ?? null,
      telephone: payload.telephone,
      email: payload.email,
    })
    .select("id")
    .single();

  if (sponsorError || !sponsor) {
    console.error("Supabase insert error (sponsors):", sponsorError);
    return res
      .status(500)
      .json({ success: false, message: "Une erreur interne est survenue" });
  }

  const { error: moocsError } = await supabase.from("sponsor_moocs").insert(
    moocs.map((mooc_name) => ({
      sponsor_id: sponsor.id,
      mooc_name,
    })),
  );

  if (moocsError) {
    console.error("Supabase insert error (sponsor_moocs):", moocsError);
    // Rollback the parent row so no orphan sponsor is left without MOOCs.
    await supabase.from("sponsors").delete().eq("id", sponsor.id);
    return res
      .status(500)
      .json({ success: false, message: "Une erreur interne est survenue" });
  }

  return res
    .status(201)
    .json({ success: true, message: "Demande de sponsoring enregistree avec succes" });
}
