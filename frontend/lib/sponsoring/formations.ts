/**
 * Referentiel canonique des formations sponsorisables — source de verite
 * unique du couple slug/libelle cote frontend.
 *
 * - slug  : cle STABLE envoyee a l'API (payload.formations) et stockee dans
 *           sponsor_formations.formation_slug.
 * - label : libelle affiche dans le formulaire ; le backend le derive du
 *           slug (le formulaire n'invente jamais de libelle en base).
 *
 * Miroir backend : backend/src/config/formations.ts — toute evolution doit
 * etre reportee dans les deux fichiers ET dans la contrainte
 * sponsor_formations_slug_check (migration dediee).
 */
export const FORMATIONS = [
  {
    slug: "etancheite-toitures",
    label: "MOOC Etanchéité – Toitures Terrasses et Toitures Inclinées",
  },
  {
    slug: "etancheite-facades",
    label: "MOOC Etanchéité – Façade",
  },
  {
    slug: "etancheite-soussols",
    label: "MOOC Etanchéité – Sous sol, salles d'eau et gradins",
  },
  {
    slug: "plancher-beton",
    label: "MOOC Planchers et dalles en béton",
  },
  {
    slug: "bim",
    label: "MOOC Fondamentaux du BIM",
  },
  {
    slug: "securite-incendie",
    label: "MOOC Sécurité Incendie",
  },
] as const;

export type Formation = (typeof FORMATIONS)[number];
export type FormationSlug = Formation["slug"];

/** Slugs canoniques, dans l'ordre d'affichage du formulaire MOOC. */
export const FORMATION_SLUGS: readonly FormationSlug[] = FORMATIONS.map(
  (formation) => formation.slug,
);

const bySlug: ReadonlyMap<string, Formation> = new Map(
  FORMATIONS.map((formation) => [formation.slug, formation]),
);

/**
 * Libelle d'affichage derive du slug ; retombe sur la valeur brute si le
 * slug est absent du referentiel (donnee legacy).
 */
export function formationLabel(slug: string): string {
  return bySlug.get(slug)?.label ?? slug;
}
