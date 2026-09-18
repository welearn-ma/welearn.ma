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
  student: AdminActivityStudentInfo | null;
  sponsor: AdminActivitySponsorInfo | null;
};

export type AdminActivityListResponse = {
  success: boolean;
  data: AdminActivityRecord[];
  message?: string;
};
