export type AdminActivityEntityType = "student" | "sponsor";
export type AdminActivityEventType = "new_request" | "treated" | "untreated";

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
};

export type AdminActivityListResponse = {
  success: boolean;
  data: AdminActivityRecord[];
  message?: string;
};
