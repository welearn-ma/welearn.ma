/**
 * Enregistrements "commerce" : produits payables (formation_prices), codes
 * personnels (codes) et justificatifs etudiants (student_proofs).
 * Voir migrations/20261124000000_cmi_products_codes_students.sql.
 */

/** Ligne formation_prices. */
export interface ProductRecord {
  slug: string;
  label: string;
  amount_mad: number;
  active: boolean;
  /** Slug de la page formation (frontend/data/formations.ts), ou null. */
  page_slug: string | null;
  requires_student_code: boolean;
}

export type CodeKind = "student" | "discount";

/** Ligne codes. */
export interface CodeRecord {
  id: string;
  code: string;
  kind: CodeKind;
  /** Pourcentage de remise (discount) ; null pour un code etudiant. */
  percent_off: number | null;
  /** Produit vise ; null = tout produit eligible (discount). */
  product_slug: string | null;
  /** Toujours en minuscules. */
  customer_email: string;
  max_uses: number;
  used_count: number;
  expires_at: string;
  revoked_at: string | null;
  created_by: string;
  student_proof_id: string | null;
  created_at: string;
}

export interface NewCode {
  code: string;
  kind: CodeKind;
  percent_off: number | null;
  product_slug: string | null;
  customer_email: string;
  max_uses: number;
  expires_at: string;
  created_by: string;
  student_proof_id: string | null;
}

export type ProofStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProofMime = "application/pdf" | "image/jpeg" | "image/png";

/** Ligne student_proofs. */
export interface StudentProofRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  page_slug: string;
  /** Chemin dans le bucket prive : "<uuid>.<ext>". Jamais une URL. */
  file_path: string;
  file_mime: ProofMime;
  file_size: number;
  status: ProofStatus;
  rejection_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  code_id: string | null;
  created_at: string;
}

export type NewStudentProof = Pick<
  StudentProofRecord,
  "id" | "full_name" | "email" | "phone" | "page_slug" | "file_path" | "file_mime" | "file_size"
>;

export type ActivityEntityType = "student_proof" | "code";
export type ActivityEventType =
  | "proof_approved"
  | "proof_rejected"
  | "code_created"
  | "code_revoked";

export interface NewActivityEntry {
  entity_type: ActivityEntityType;
  entity_id: string;
  event_type: ActivityEventType;
  actor_email: string;
  note: string | null;
}
