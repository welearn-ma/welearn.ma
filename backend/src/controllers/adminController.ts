import { Request, Response } from "express";
import {
  getBearerToken,
  validateAdminAccessToken,
} from "../lib/adminAuth";
import { supabase } from "../lib/supabaseClient";
import type {
  AdminActivityListResponse,
  AdminActivityRecord,
} from "../types/admin-activity";

type AdminSessionResponse =
  | {
      success: true;
      email: string;
    }
  | {
      success: false;
      message: string;
    };

export async function getAdminSession(
  req: Request,
  res: Response<AdminSessionResponse>,
) {
  const token = getBearerToken(req.header("authorization"));
  const access = await validateAdminAccessToken(token);

  if (!access.ok) {
    if (access.reason === "not_admin") {
      return res.status(403).json({
        success: false,
        message: "Compte non autorise pour le dashboard admin.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Session admin invalide ou expiree.",
    });
  }

  return res.status(200).json({
    success: true,
    email: access.email,
  });
}

type StudentInfoRow = {
  id: string;
  full_name: string;
  email: string;
  formation_title: string;
};

type SponsorInfoRow = {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  email: string;
};

export async function getAdminActivity(
  req: Request,
  res: Response<AdminActivityListResponse>,
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
  const actorEmail = String(req.query.actor_email ?? "")
    .trim()
    .toLowerCase();

  let query = supabase
    .from("admin_activity_log")
    .select("id, entity_type, entity_id, event_type, actor_email, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (actorEmail) {
    query = query.eq("actor_email", actorEmail);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Supabase select error (admin_activity_log):", error);
    return res.status(500).json({
      success: false,
      data: [],
      message: "Impossible de recuperer le flux d'activite",
    });
  }

  const rows = (data ?? []) as Array<{
    id: string;
    entity_type: "student" | "sponsor";
    entity_id: string;
    event_type: "new_request" | "treated" | "untreated";
    actor_email: string | null;
    created_at: string;
  }>;

  const studentIds = rows
    .filter((row) => row.entity_type === "student")
    .map((row) => row.entity_id);
  const sponsorIds = rows
    .filter((row) => row.entity_type === "sponsor")
    .map((row) => row.entity_id);

  const [studentsResult, sponsorsResult] = await Promise.all([
    studentIds.length
      ? supabase
          .from("registration_requests")
          .select("id, full_name, email, formation_title")
          .in("id", studentIds)
      : Promise.resolve({ data: [] as StudentInfoRow[], error: null }),
    sponsorIds.length
      ? supabase
          .from("sponsors")
          .select("id, nom, prenom, entreprise, email")
          .in("id", sponsorIds)
      : Promise.resolve({ data: [] as SponsorInfoRow[], error: null }),
  ]);

  if (studentsResult.error || sponsorsResult.error) {
    console.error(
      "Supabase select error (activity entity join):",
      studentsResult.error ?? sponsorsResult.error,
    );
  }

  const studentById = new Map(
    ((studentsResult.data ?? []) as StudentInfoRow[]).map((item) => [
      item.id,
      item,
    ]),
  );
  const sponsorById = new Map(
    ((sponsorsResult.data ?? []) as SponsorInfoRow[]).map((item) => [
      item.id,
      item,
    ]),
  );

  const responseData: AdminActivityRecord[] = rows.map((row) => {
    const student =
      row.entity_type === "student"
        ? studentById.get(row.entity_id)
        : undefined;
    const sponsor =
      row.entity_type === "sponsor"
        ? sponsorById.get(row.entity_id)
        : undefined;

    return {
      id: row.id,
      entityType: row.entity_type,
      entityId: row.entity_id,
      eventType: row.event_type,
      actorEmail: row.actor_email,
      createdAt: row.created_at,
      student: student
        ? {
            fullName: student.full_name,
            email: student.email,
            formationTitle: student.formation_title,
          }
        : null,
      sponsor: sponsor
        ? {
            fullName: `${sponsor.prenom} ${sponsor.nom}`,
            email: sponsor.email,
            entreprise: sponsor.entreprise,
          }
        : null,
    };
  });

  return res.status(200).json({ success: true, data: responseData });
}
