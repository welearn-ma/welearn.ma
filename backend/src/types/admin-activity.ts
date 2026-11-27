export type AdminActivityEntityType = "student" | "sponsor" | "student_proof" | "code" | "promotion";
export type AdminActivityEventType =
  | "new_request"
  /** Demande de brochure (registration_requests.source = 'brochure'). */
  | "brochure_request"
  | "treated"
  | "untreated"
  /** Justificatif etudiant depose (trigger sur student_proofs). */
  | "proof_submitted"
  | "proof_approved"
  | "proof_rejected"
  /** « Renvoyer l'e-mail » du code d'un justificatif valide. */
  | "proof_email_resent"
  | "code_created"
  | "code_revoked"
  /** « Renvoyer l'e-mail » d'un code de reduction. */
  | "code_email_resent"
  /** Promotion activee (admin, migration ou SQL documente). */
  | "promotion_activated"
  /** Promotion desactivee (arret anticipe). */
  | "promotion_deactivated";

export type AdminActivityPromotionInfo = {
  label: string;
  percentOff: number;
};

export type AdminActivityStudentProofInfo = {
  fullName: string;
  email: string;
  pageSlug: string;
};

export type AdminActivityCodeInfo = {
  code: string;
  kind: "student" | "discount";
  email: string;
};

export type AdminActivityStudentInfo = {
  fullName: string;
  email: string;
  formationTitle: string;
};

export type AdminActivitySponsorInfo = {
  fullName: string;
  email: string;
  entreprise: string;
};

export type AdminActivityRecord = {
  id: string;
  entityType: AdminActivityEntityType;
  entityId: string;
  eventType: AdminActivityEventType;
  actorEmail: string | null;
  note: string | null;
  createdAt: string;
  /** Populated when entityType is "student"; null if the source row is gone. */
  student: AdminActivityStudentInfo | null;
  /** Populated when entityType is "sponsor"; null if the source row is gone. */
  sponsor: AdminActivitySponsorInfo | null;
  /** Populated when entityType is "student_proof"; null otherwise. */
  studentProof: AdminActivityStudentProofInfo | null;
  /** Populated when entityType is "code"; null otherwise. */
  code: AdminActivityCodeInfo | null;
  /** Populated when entityType is "promotion"; null otherwise. */
  promotion: AdminActivityPromotionInfo | null;
};

export type AdminActivityListResponse = {
  success: boolean;
  data: AdminActivityRecord[];
  message?: string;
};
