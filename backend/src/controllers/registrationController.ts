import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import type {
  RegistrationPayload,
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

  if (isEmpty(payload.phone)) {
    return res
      .status(400)
      .json({ success: false, message: "phone is required" });
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
    .status(200)
    .json({ success: true, message: "Demande enregistrée avec succès" });
}
