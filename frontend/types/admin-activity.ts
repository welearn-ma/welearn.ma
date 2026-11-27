export type AdminActivityEntityType = "student" | "sponsor" | "student_proof" | "code" | "promotion";
export type AdminActivityEventType =
  | "new_request"
  /** Demande de brochure (registration_requests.source = 'brochure'). */
  | "brochure_request"
  | "treated"
  | "untreated"
  | "proof_submitted"
  | "proof_approved"
  | "proof_rejected"
  | "proof_email_resent"
  | "code_created"
  | "code_revoked"
  | "code_email_resent"
  | "promotion_activated"
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
  student: AdminActivityStudentInfo | null;
  sponsor: AdminActivitySponsorInfo | null;
  /** Absents des reponses d'un backend anterieur aux justificatifs / codes. */
  studentProof?: AdminActivityStudentProofInfo | null;
  code?: AdminActivityCodeInfo | null;
  /** Absent des réponses d'un backend antérieur aux promotions. */
  promotion?: AdminActivityPromotionInfo | null;
};

export type AdminActivityListResponse = {
  success: boolean;
  data: AdminActivityRecord[];
  message?: string;
};
