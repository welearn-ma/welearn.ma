import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import type {
  RegistrationPayload,
  RegistrationListResponse,
  RegistrationRecord,
  RegistrationResponse,
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

export async function listRegistrations(
  req: Request,
  res: Response<RegistrationListResponse>,
) {
  const rawLimit = Number(req.query.limit ?? 200);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), 1000)
    : 200;
  const formationSlug = String(req.query.formationSlug ?? "").trim();

  let query = supabase
    .from("registration_requests")
    .select(
      "id, full_name, email, phone, company, position, message, formation_slug, formation_title, created_at",
    )
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
    createdAt: item.created_at,
  }));

  return res.status(200).json({
    success: true,
    data: responseData,
  });
}
