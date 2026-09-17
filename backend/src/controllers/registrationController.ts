import { Request, Response } from "express";
import { getBearerToken, validateAdminAccessToken } from "../lib/adminAuth";
import { supabase } from "../lib/supabaseClient";
import type {
  RegistrationPayload,
  RegistrationListResponse,
  RegistrationRecord,
  RegistrationResponse,
  UpdateTreatedPayload,
  UpdateTreatedResponse,
} from "../types/registration";

/*
-- CREATE TABLE registration_requests (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   full_name text NOT NULL,
--   email text NOT NULL,
--   phone text NOT NULL,
--   company text,
--   position text,
--   message text,
--   formation_slug text NOT NULL,
--   formation_title text NOT NULL,
--   treated boolean NOT NULL DEFAULT false,
--   treated_at timestamptz,
--   treated_by text,
--   created_at timestamptz DEFAULT now()
-- );
-- ALTER TABLE registration_requests ENABLE ROW LEVEL SECURITY;
*/

function isEmpty(value: unknown): value is undefined | null | "" {
  return value === undefined || value === null || value === "";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s().-]{8,20}$/;

export async function createRegistration(
  req: Request,
  res: Response<RegistrationResponse>,
) {
  const payload = req.body as Partial<RegistrationPayload>;

  if (isEmpty(payload.fullName)) {
    return res
      .status(400)
      .json({ success: false, message: "fullName is required" });
  }

  if (isEmpty(payload.email)) {
    return res
      .status(400)
      .json({ success: false, message: "email is required" });
  }

  if (!emailRegex.test(String(payload.email).trim())) {
    return res.status(400).json({
      success: false,
      message: "email format is invalid",
    });
  }

  if (isEmpty(payload.phone)) {
    return res
      .status(400)
      .json({ success: false, message: "phone is required" });
  }

  if (!phoneRegex.test(String(payload.phone).trim())) {
    return res.status(400).json({
      success: false,
      message: "phone format is invalid",
    });
  }

  if (isEmpty(payload.formationSlug)) {
    return res
      .status(400)
      .json({ success: false, message: "formationSlug is required" });
  }

  if (isEmpty(payload.formationTitle)) {
    return res
      .status(400)
      .json({ success: false, message: "formationTitle is required" });
  }

  const { error } = await supabase.from("registration_requests").insert({
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    company: payload.company ?? null,
    position: payload.position ?? null,
    message: payload.message ?? null,
    formation_slug: payload.formationSlug,
    formation_title: payload.formationTitle,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Une erreur interne est survenue" });
  }

  return res
    .status(201)
    .json({ success: true, message: "Demande enregistree avec succes" });
}

export async function listAdminRegistrations(
  req: Request,
  res: Response<RegistrationListResponse>,
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
  const formationSlug = String(req.query.formationSlug ?? "").trim();
  const status = req.query.status === "treated" ? "treated" : "new";

  let query = supabase
    .from("registration_requests")
    .select(
      "id, full_name, email, phone, company, position, message, formation_slug, formation_title, treated, treated_at, treated_by, created_at",
    )
    .eq("treated", status === "treated")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (formationSlug) {
    query = query.eq("formation_slug", formationSlug);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase select error:", error);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Impossible de recuperer les demandes d'inscription",
    });
  }

  const rows = (data ?? []) as Array<{
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company: string | null;
    position: string | null;
    message: string | null;
    formation_slug: string;
    formation_title: string;
    treated: boolean;
    treated_at: string | null;
    treated_by: string | null;
    created_at: string;
  }>;

  const responseData: RegistrationRecord[] = rows.map((item) => ({
    id: item.id,
    fullName: item.full_name,
    email: item.email,
    phone: item.phone,
    company: item.company,
    position: item.position,
    message: item.message,
    formationSlug: item.formation_slug,
    formationTitle: item.formation_title,
    treated: item.treated,
    treatedAt: item.treated_at,
    treatedBy: item.treated_by,
    createdAt: item.created_at,
  }));

  return res.status(200).json({
    success: true,
    data: responseData,
  });
}

export async function updateRegistrationTreated(
  req: Request,
  res: Response<UpdateTreatedResponse>,
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

  const treated = (req.body as Partial<UpdateTreatedPayload>)?.treated;
  if (typeof treated !== "boolean") {
    return res
      .status(400)
      .json({ success: false, message: "treated (boolean) is required" });
  }

  const { data, error } = await supabase
    .from("registration_requests")
    .update(
      treated
        ? {
            treated: true,
            treated_at: new Date().toISOString(),
            treated_by: access.email,
          }
        : { treated: false, treated_at: null, treated_by: null },
    )
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    console.error("Supabase update error (registration_requests):", error);
    return res
      .status(404)
      .json({ success: false, message: "Demande introuvable" });
  }

  const { error: logError } = await supabase.from("admin_activity_log").insert({
    entity_type: "student",
    entity_id: id,
    event_type: treated ? "treated" : "untreated",
    actor_email: access.email,
  });

  if (logError) {
    console.error("Supabase insert error (admin_activity_log):", logError);
  }

  return res
    .status(200)
    .json({ success: true, message: "Statut mis a jour" });
}
