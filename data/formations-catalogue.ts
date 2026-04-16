import { formations as detailedFormations } from "./formations";
import formationsJsonData from "./formations.json";

export type FormationType = "Certifiante" | "Sur mesure" | "Diplomante";
export type FormationBadge =
  | "Certifiante"
  | "Sur mesure"
  | "Executive Masters"
  | "Licence Pro";
export type FormationDomain =
  | "BIM"
  | "BTP"
  | "Immobilier"
  | "Digital & IA"
  | "Management";
export type FormationFormat = "E-learning" | "Présentiel";
export type FormationLevel =
  | "Débutant"
  | "Intermédiaire"
  | "Avancé"
  | "Tous niveaux"
  | "Professionnel";

type JsonFormation = {
  id: number;
  slug?: string;
  title: string;
  type: "Certifiante" | "Formation courte" | "Diplomante";
  badge: FormationBadge;
  domain: FormationDomain;
  provider: string;
  issuer: string | null;
  format: FormationFormat[];
  duration: string;
  level: FormationLevel;
  summary: string;
  tags?: string[];
};

export type CatalogueFormation = {
  id: number;
  slug: string;
  href: string;
  title: string;
  type: FormationType;
  badge: FormationBadge;
  domain: FormationDomain;
  provider: string;
  issuer: string | null;
  format: FormationFormat[];
  duration: string;
  level: FormationLevel;
  summary: string;
  tags?: string[];
};

const slugAliases: Record<string, string> = {
  "bim-foundations": "bim-foundations-professional",
};

const detailSlugs = new Set(
  Object.values(detailedFormations).map((formation) => formation.slug),
);

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function getFallbackHref(formation: JsonFormation): string {
  if (formation.type === "Diplomante") {
    return formation.badge === "Licence Pro"
      ? "/formations/diplomantes/licences-pro"
      : "/formations/diplomantes/executive-masters";
  }

  return "/formations/certifiantes/sur-mesure";
}

function toCatalogueFormation(formation: JsonFormation): CatalogueFormation {
  const rawSlug = formation.slug ?? slugify(formation.title);
  const slug = slugAliases[rawSlug] ?? rawSlug;
  const href = detailSlugs.has(slug)
    ? `/formations/${slug}`
    : getFallbackHref(formation);
  const type: FormationType =
    formation.type === "Formation courte" ? "Sur mesure" : formation.type;

  return {
    id: formation.id,
    slug,
    href,
    title: formation.title,
    type,
    badge: formation.badge,
    domain: formation.domain,
    provider: formation.provider,
    issuer: formation.issuer,
    format: formation.format,
    duration: formation.duration,
    level: formation.level,
    summary: formation.summary,
    tags: formation.tags,
  };
}

const jsonFormations = formationsJsonData.formations as JsonFormation[];

export const catalogueFormations: CatalogueFormation[] =
  jsonFormations.map(toCatalogueFormation);

export const certifiantesFormations = catalogueFormations.filter(
  (formation) => formation.type !== "Diplomante",
);

export const diplomantesFormations = catalogueFormations.filter(
  (formation) => formation.type === "Diplomante",
);
