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
