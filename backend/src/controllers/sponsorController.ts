import { Request, Response } from "express";
import { getBearerToken, validateAdminAccessToken } from "../lib/adminAuth";
import { supabase } from "../lib/supabaseClient";
import type {
  SponsorListResponse,
  SponsorPayload,
  SponsorRecord,
  SponsorResponse,
} from "../types/sponsor";

/*
-- CREATE TABLE sponsors (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at timestamptz NOT NULL DEFAULT now(),
--   nom text NOT NULL,
--   prenom text NOT NULL,
--   entreprise text NOT NULL,
--   role text,
--   telephone text NOT NULL,
--   email text NOT NULL,
--   program text DEFAULT 'sponsoring' -- 'sponsoring' | 'mooc' | 'fnpi'
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

const ALLOWED_PROGRAMS = ["sponsoring", "mooc", "fnpi"] as const;

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

  // Champ optionnel : absent => le default SQL 'sponsoring' s'applique,
  // les anciens clients restent donc inchanges.
  const program = isEmpty(payload.program)
    ? undefined
    : String(payload.program).trim();

  if (
    program !== undefined &&
    !(ALLOWED_PROGRAMS as readonly string[]).includes(program)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "program is invalid" });
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
      ...(program !== undefined ? { program } : {}),
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

export async function listSponsors(
  req: Request,
  res: Response<SponsorListResponse>,
) {
  const token = getBearerToken(req.header("authorization"));
  const access = await validateAdminAccessToken(token);

  if (!access.ok) {
    if (access.reason === "not_admin") {
      return res.status(403).json({
        success: false,
        data: [],
        message: "Acces refuse: compte non admin.",
      });
    }

    return res.status(401).json({
      success: false,
      data: [],
      message: "Session admin invalide ou expiree.",
    });
  }

  const rawLimit = Number(req.query.limit ?? 200);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), 1000)
    : 200;

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "id, created_at, nom, prenom, entreprise, role, telephone, email, sponsor_moocs(mooc_name)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase select error (sponsors):", error);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Impossible de recuperer les sponsors",
    });
  }

  const rows = (data ?? []) as Array<{
    id: string;
    created_at: string;
    nom: string;
    prenom: string;
    entreprise: string;
    role: string | null;
    telephone: string;
    email: string;
    sponsor_moocs: Array<{ mooc_name: string }> | null;
  }>;

  const responseData: SponsorRecord[] = rows.map((item) => ({
    id: item.id,
    nom: item.nom,
    prenom: item.prenom,
    entreprise: item.entreprise,
    role: item.role,
    telephone: item.telephone,
    email: item.email,
    moocs: (item.sponsor_moocs ?? []).map((mooc) => mooc.mooc_name),
    createdAt: item.created_at,
  }));

  return res.status(200).json({ success: true, data: responseData });
}
