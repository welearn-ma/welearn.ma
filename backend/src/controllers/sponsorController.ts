import { Request, Response } from "express";
import { getBearerToken, validateAdminAccessToken } from "../lib/adminAuth";
import { supabase } from "../lib/supabaseClient";
import {
  formationLabel,
  resolveFormation,
  type Formation,
} from "../config/formations";
import type {
  SponsorListResponse,
  SponsorPayload,
  SponsorRecord,
  SponsorResponse,
  UpdateSponsorTreatedPayload,
  UpdateSponsorTreatedResponse,
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
--   program text DEFAULT 'sponsoring', -- 'sponsoring' | 'mooc' | 'fnpi'
--   treated boolean NOT NULL DEFAULT false,
--   treated_at timestamptz,
--   treated_by text,
--   treated_note text
-- );
-- CREATE TABLE sponsor_formations (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   sponsor_id uuid NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
--   formation_name text NOT NULL, -- cache d'affichage derive du slug
--   formation_slug text           -- cle stable (CHECK sur le referentiel)
-- );
-- ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sponsor_formations ENABLE ROW LEVEL SECURITY;
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

  // `formations` = slugs canoniques ; `moocs` = compat anciens clients
  // (libelles affiches). Chaque valeur est normalisee vers le referentiel :
  // le slug fait foi, le libelle stocke est derive du referentiel.
  const rawItems = Array.isArray(payload.formations)
    ? payload.formations
    : Array.isArray(payload.moocs)
      ? payload.moocs
      : [];

  const formations: Formation[] = [];
  for (const rawItem of rawItems) {
    const trimmed = String(rawItem).trim();
    if (!trimmed) continue;

    const formation = resolveFormation(trimmed);
    if (!formation) {
      return res
        .status(400)
        .json({ success: false, message: `formation inconnue: ${trimmed}` });
    }
    formations.push(formation);
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

  // FNPI : formulaire contact seul, un sponsor peut etre cree sans aucune
  // formation liee. Les autres programmes exigent toujours au moins un item.
  if (formations.length === 0 && program !== "fnpi") {
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

  if (formations.length > 0) {
    const { error: formationsError } = await supabase
      .from("sponsor_formations")
      .insert(
        formations.map((formation) => ({
          sponsor_id: sponsor.id,
          formation_slug: formation.slug,
          formation_name: formation.label,
        })),
      );

    if (formationsError) {
      console.error(
        "Supabase insert error (sponsor_formations):",
        formationsError,
      );
      // Rollback the parent row so no orphan sponsor is left without items.
      await supabase.from("sponsors").delete().eq("id", sponsor.id);
      return res
        .status(500)
        .json({ success: false, message: "Une erreur interne est survenue" });
    }
  }

  return res
    .status(201)
    .json({ success: true, message: "Demande de sponsoring enregistree avec succes" });
}

export async function listAdminSponsors(
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
  const status = req.query.status === "treated" ? "treated" : "new";

  const { data, error } = await supabase
    .from("sponsors")
    .select(
      "id, created_at, nom, prenom, entreprise, role, telephone, email, program, treated, treated_at, treated_by, treated_note, sponsor_formations(formation_slug, formation_name)",
    )
    .eq("treated", status === "treated")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Supabase select error (sponsors):", error);
    // Route reservee aux admins authentifies : exposer le code PostgREST
    // (ex. PGRST200 = embed introuvable -> backend desynchronise du schema)
    // rend le diagnostic possible sans acces aux logs du serveur.
    return res.status(500).json({
      success: false,
      data: [],
      message: `Impossible de recuperer les sponsors (${error.code ?? "?"}: ${error.message})`,
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
    program: string | null;
    treated: boolean;
    treated_at: string | null;
    treated_by: string | null;
    treated_note: string | null;
    sponsor_formations: Array<{
      formation_slug: string | null;
      formation_name: string;
    }> | null;
  }>;

  const responseData: SponsorRecord[] = rows.map((item) => ({
    id: item.id,
    nom: item.nom,
    prenom: item.prenom,
    entreprise: item.entreprise,
    role: item.role,
    telephone: item.telephone,
    email: item.email,
    formations: (item.sponsor_formations ?? []).map((formation) => ({
      slug: formation.formation_slug,
      name: formationLabel(formation.formation_slug, formation.formation_name),
    })),
    program: (ALLOWED_PROGRAMS as readonly string[]).includes(
      item.program ?? "",
    )
      ? (item.program as SponsorRecord["program"])
      : null,
    treated: item.treated,
    treatedAt: item.treated_at,
    treatedBy: item.treated_by,
    treatedNote: item.treated_note,
    createdAt: item.created_at,
  }));

  return res.status(200).json({ success: true, data: responseData });
}

export async function updateSponsorTreated(
  req: Request,
  res: Response<UpdateSponsorTreatedResponse>,
) {
  const token = getBearerToken(req.header("authorization"));
  const access = await validateAdminAccessToken(token);

  if (!access.ok) {
    if (access.reason === "not_admin") {
      return res.status(403).json({
        success: false,
        message: "Acces refuse: compte non admin.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Session admin invalide ou expiree.",
    });
  }

  const id = String(req.params.id ?? "").trim();
  if (!id) {
    return res.status(400).json({ success: false, message: "id is required" });
  }

  const body = req.body as Partial<UpdateSponsorTreatedPayload>;
  const treated = body?.treated;
  if (typeof treated !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "treated (boolean) is required" });
  }

  const note = treated ? String(body?.note ?? "").trim() : null;
  if (treated && !note) {
    return res
      .status(400)
      .json({ success: false, message: "note is required" });
  }

  const { data, error } = await supabase
    .from("sponsors")
    .update(
      treated
        ? {
            treated: true,
            treated_at: new Date().toISOString(),
            treated_by: access.email,
            treated_note: note,
          }
        : {
            treated: false,
            treated_at: null,
            treated_by: null,
            treated_note: null,
          },
    )
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Supabase update error (sponsors):", error);
    return res.status(404).json({ success: false, message: "Sponsor introuvable" });
  }

  const { error: logError } = await supabase.from("admin_activity_log").insert({
    entity_type: "sponsor",
    entity_id: id,
    event_type: treated ? "treated" : "untreated",
    actor_email: access.email,
    note,
  });

  if (logError) {
    console.error("Supabase insert error (admin_activity_log):", logError);
  }

  return res
    .status(200)
    .json({ success: true, message: "Statut mis a jour" });
}
