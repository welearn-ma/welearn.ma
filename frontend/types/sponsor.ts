export type SponsorProgram = "sponsoring" | "mooc" | "fnpi";

export type SponsorPayload = {
  nom: string;
  prenom: string;
  entreprise: string;
  role?: string;
  telephone: string;
  email: string;
  /** Slugs canoniques des formations (cf. lib/sponsoring/formations.ts). */
  formations: string[];
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

export type AdminSponsorRecord = {
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
  createdAt: string;
};

export type AdminSponsorListResponse = {
  success: boolean;
  data: AdminSponsorRecord[];
  message?: string;
};
