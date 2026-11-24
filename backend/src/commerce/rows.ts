import type { CodeRecord, ProductRecord, StudentProofRecord } from "./types";

/** Colonnes PostgREST et conversion (numeric -> number). */

export const PRODUCT_COLUMNS =
  "formation_slug, label, amount_mad, active, page_slug, requires_student_code";

export const CODE_COLUMNS =
  "id, code, kind, percent_off, product_slug, customer_email, max_uses, used_count, " +
  "expires_at, revoked_at, created_by, student_proof_id, created_at";

export const PROOF_COLUMNS =
  "id, full_name, email, phone, page_slug, file_path, file_mime, file_size, status, " +
  "rejection_reason, reviewed_by, reviewed_at, code_id, created_at";

type Row = Record<string, unknown>;

/*
 * Client Supabase non type (pas de types generes) : les lignes arrivent en
 * `unknown` ; ces fonctions sont le seul point de conversion.
 */

export function toProduct(value: unknown): ProductRecord {
  const row = value as Row;
  return {
    slug: String(row.formation_slug),
    label: String(row.label),
    amount_mad: Number(row.amount_mad),
    active: row.active === true,
    page_slug: typeof row.page_slug === "string" ? row.page_slug : null,
    requires_student_code: row.requires_student_code === true,
  };
}

export function toCode(value: unknown): CodeRecord {
  const row = value as Row;
  return {
    ...(row as unknown as CodeRecord),
    percent_off: row.percent_off === null ? null : Number(row.percent_off),
    max_uses: Number(row.max_uses),
    used_count: Number(row.used_count),
  };
}

export function toProof(value: unknown): StudentProofRecord {
  const row = value as Row;
  return { ...(row as unknown as StudentProofRecord), file_size: Number(row.file_size) };
}
