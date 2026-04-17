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
  createdAt: string;
};

export type AdminRegistrationListResponse = {
  success: boolean;
  data: AdminRegistrationRecord[];
  message?: string;
};
