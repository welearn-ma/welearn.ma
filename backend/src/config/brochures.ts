/**
 * Allowlist des brochures telechargeables — source de verite cote backend.
 *
 * - cle            : slug de la formation (frontend/data/formations.ts).
 * - storagePath    : chemin du PDF dans le bucket Supabase PRIVE `brochures`.
 * - downloadName   : nom de fichier propose au navigateur (Content-Disposition).
 * - formationTitle : titre EXACT de la formation dans frontend/data/formations.ts.
 *                    Stocke dans registration_requests.formation_title ; le
 *                    dashboard admin regroupe les demandes par ce titre.
 *
 * SYNCHRO : la liste des formations avec brochure doit rester alignee avec
 * `hasBrochure: true` dans frontend/data/formations.ts (et les titres avec
 * leurs `title`). Toute evolution doit etre reportee dans les deux fichiers.
 */
export type BrochureConfig = {
  storagePath: string;
  downloadName: string;
  formationTitle: string;
};

export const BROCHURE_BUCKET = "brochures";

/** Duree de validite des URLs signees, en secondes. */
export const BROCHURE_URL_TTL_SECONDS = 300;

export const BROCHURES: Readonly<Record<string, BrochureConfig>> = {
  "mastere-bim": {
    storagePath: "mastere-bim.pdf",
    downloadName: "Brochure-Mastere-Specialise-BIM-EHTP-Welearn.pdf",
    formationTitle: "Mastère Spécialisé® BIM & ses Applications",
  },
  "master-immobilier": {
    storagePath: "master-immobilier.pdf",
    downloadName: "Brochure-Executive-Master-Ingenierie-Immobiliere.pdf",
    formationTitle: "Executive Master en Ingénierie Immobilière",
  },
  "licence-executive-bim-modeler": {
    storagePath: "licence-executive-bim-modeler.pdf",
    downloadName: "Brochure-Licence-Executive-BIM-Modeler-UIC-Welearn.pdf",
    formationTitle: "Licence Executive BIM Modeler",
  },
  "executive-master-direction-transformation-projets-construction": {
    storagePath:
      "executive-master-direction-transformation-projets-construction.pdf",
    downloadName:
      "Brochure-Executive-Master-Direction-Transformation-Projets-Construction-ECC-Welearn.pdf",
    formationTitle:
      "Executive Master Direction & Transformation des Projets de Construction",
  },
};

/** Configuration de la brochure d'une formation ; null si non autorisee. */
export function getBrochureConfig(formationSlug: string): BrochureConfig | null {
  return Object.prototype.hasOwnProperty.call(BROCHURES, formationSlug)
    ? BROCHURES[formationSlug]
    : null;
}
