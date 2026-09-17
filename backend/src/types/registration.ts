export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  position?: string;
  message?: string;
  formationSlug: string;
  formationTitle: string;
};

export type RegistrationResponse = {
  success: boolean;
  message: string;
};

export type RegistrationRecord = {
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

export type RegistrationListResponse = {
  success: boolean;
  data: RegistrationRecord[];
  message?: string;
};

export type UpdateTreatedPayload = {
  treated: boolean;
};

export type UpdateTreatedResponse = {
  success: boolean;
  message: string;
};
