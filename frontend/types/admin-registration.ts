export type AdminRegistrationRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company?: string | null;
  position?: string | null;
  message?: string | null;
  formationSlug: string;
  formationTitle: string;
  treated: boolean;
  treatedAt: string | null;
  treatedBy: string | null;
  createdAt: string;
};

export type AdminRegistrationListResponse = {
  success: boolean;
  data: AdminRegistrationRecord[];
  message?: string;
};

export type UpdateTreatedResponse = {
  success: boolean;
  message: string;
};
