export type SponsorPayload = {
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string;
  telephone: string;
  email: string;
  moocs: string[];
};

export type SponsorResponse = {
  success: boolean;
  message: string;
};
