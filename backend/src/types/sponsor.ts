export type SponsorProgram = "sponsoring" | "mooc" | "fnpi";

export type SponsorPayload = {
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string;
  telephone: string;
  email: string;
  /** Slugs canoniques des formations (cf. config/formations.ts). */
  formations?: string[];
  /** Compat : anciens clients — libelles affiches (normalises en slug). */
  moocs?: string[];
  program?: SponsorProgram;
};

export type SponsorResponse = {
  success: boolean;
  message: string;
};

export type SponsorFormation = {
  /** Cle stable de reporting ; null uniquement pour une ligne legacy. */
  slug: string | null;
  /** Libelle d'affichage derive du slug via le referentiel canonique. */
  name: string;
};

export type SponsorRecord = {
  id: string;
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string | null;
  telephone: string;
  email: string;
  formations: SponsorFormation[];
  /** Page d'origine de la demande ; null uniquement pour une ligne legacy. */
  program: SponsorProgram | null;
  treated: boolean;
  treatedAt: string | null;
  treatedBy: string | null;
  treatedNote: string | null;
  createdAt: string;
};

export type SponsorListResponse = {
  success: boolean;
  data: SponsorRecord[];
  message?: string;
};

export type UpdateSponsorTreatedPayload = {
  treated: boolean;
  /** Requis quand treated=true ; ignore quand treated=false. */
  note?: string;
};

export type UpdateSponsorTreatedResponse = {
  success: boolean;
  message: string;
};
