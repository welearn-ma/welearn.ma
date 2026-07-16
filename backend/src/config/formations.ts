/**
 * Referentiel canonique des formations sponsorisables — source de verite
 * unique du couple slug/libelle.
 *
 * - slug  : cle STABLE de reporting, stockee dans
 *           sponsor_formations.formation_slug (contrainte CHECK en base).
 * - label : cache d'affichage denormalise, stocke dans
 *           sponsor_formations.formation_name. Les libelles correspondent
 *           exactement aux items du formulaire MOOC.
 *
 * Miroir frontend : frontend/lib/sponsoring/formations.ts — toute evolution
 * doit etre reportee dans les deux fichiers ET dans la contrainte
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

const bySlug: ReadonlyMap<string, Formation> = new Map(
  FORMATIONS.map((formation) => [formation.slug, formation]),
);

// Compat : les anciens clients (frontend pas encore redeploye) envoient
// encore le libelle affiche au lieu du slug.
const byLabel: ReadonlyMap<string, Formation> = new Map(
  FORMATIONS.map((formation) => [formation.label, formation]),
);

/** Resout un slug canonique OU un libelle legacy ; null si inconnu. */
export function resolveFormation(value: string): Formation | null {
  return bySlug.get(value) ?? byLabel.get(value) ?? null;
}

/**
 * Libelle d'affichage derive du slug (source de verite) ; retombe sur le
 * formation_name stocke si le slug est absent du referentiel.
 */
export function formationLabel(
  slug: string | null,
  storedName: string,
): string {
  if (slug) {
    const formation = bySlug.get(slug);
    if (formation) {
      return formation.label;
    }
  }
  return storedName;
}
