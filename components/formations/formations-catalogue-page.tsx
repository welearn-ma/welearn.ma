"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Clock3,
  Laptop,
  MonitorSmartphone,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Category =
  | "Certification"
  | "Master / Diplome"
  | "Executive Master"
  | "Sur mesure";

type Format = "E-learning" | "Presentiel" | "Hybride";

type Level = "Bac+3" | "Bac+4" | "Bac+5" | "Executive" | "All levels";

type Duration = "< 1 month" | "1-3 months" | "6-12 months" | "Flexible";

type Domain =
  | "BIM"
  | "Immobilier"
  | "Management"
  | "Digital"
  | "BTP"
  | "Sur mesure";

interface Formation {
  id: string;
  title: string;
  type: string;
  partner: string;
  category: Category;
  formats: Format[];
  formatLabel: string;
  levels: Level[];
  levelLabel: string;
  durations: Duration[];
  durationLabel: string;
  domains: Domain[];
  objectivesSummary: string;
  ctaHref: string;
}

const formations: Formation[] = [
  {
    id: "bim-foundations",
    title: "BIM Foundations - Professional",
    type: "Formation certifiante",
    partner: "Welearn x BuildingSMART International",
    category: "Certification",
    formats: ["E-learning", "Hybride"],
    formatLabel: "E-learning + ateliers de coaching optionnels",
    levels: ["All levels"],
    levelLabel: "Professional (all construction profiles)",
    durations: ["1-3 months"],
    durationLabel: "21h / 1 month",
    domains: ["BIM", "BTP"],
    objectivesSummary:
      "Maitriser les fondamentaux BIM, le cadre normatif open BIM et la mise en place de processus BIM sur un projet de construction.",
    ctaHref: "/formations/certifiantes/bim-foundations",
  },
  {
    id: "ms-bim-ehtp",
    title: "Mastere Specialise BIM & ses Applications (EHTP)",
    type: "Mastere Specialise / Diplome",
    partner: "Welearn x EHTP",
    category: "Master / Diplome",
    formats: ["Presentiel"],
    formatLabel: "Presentiel (EHTP + Welearn), part-time",
    levels: ["Bac+4", "Bac+5"],
    levelLabel: "Bac+5 ou Bac+4 avec 3+ ans d'experience",
    durations: ["6-12 months"],
    durationLabel: "~1 year",
    domains: ["BIM", "BTP", "Management"],
    objectivesSummary:
      "Structurer et piloter des projets BIM collaboratifs, integrer les aspects techniques, juridiques et economiques, et maitriser les outils de modelisation.",
    ctaHref: "/formations/diplomantes/executive-masters#ms-bim",
  },
  {
    id: "executive-master-immo",
    title: "Executive Master en Ingenierie Immobiliere (EHTP)",
    type: "Executive Master / Diplome",
    partner: "Welearn x EHTP",
    category: "Executive Master",
    formats: ["Presentiel"],
    formatLabel: "Presentiel (EHTP + Welearn), part-time",
    levels: ["Bac+4", "Executive"],
    levelLabel: "Bac+4 minimum avec experience professionnelle",
    durations: ["6-12 months"],
    durationLabel: "~1 year",
    domains: ["Immobilier", "Management", "BTP"],
    objectivesSummary:
      "Maitriser urbanisme, finance, droit, fiscalite et commercialisation immobiliere pour piloter des operations performantes de bout en bout.",
    ctaHref: "/formations/diplomantes/executive-masters#em-immo",
  },
  {
    id: "executive-master-bim-eslsca",
    title: "Master Executif Management de Projet de Construction - Expert BIM",
    type: "Executive Master",
    partner: "Welearn x ESLSCA",
    category: "Executive Master",
    formats: ["Hybride"],
    formatLabel: "Format hybride",
    levels: ["Executive"],
    levelLabel: "Senior executives et ingenieurs experimentes",
    durations: ["Flexible"],
    durationLabel: "Non specifie",
    domains: ["BIM", "Management", "BTP"],
    objectivesSummary:
      "Developper des competences avancees pour optimiser la planification, la coordination et la livraison de projets de construction avec une approche BIM.",
    ctaHref: "/formations/diplomantes/executive-masters#em-pm-bim",
  },
  {
    id: "intra-sur-mesure",
    title: "Formations Intra-Entreprise / Sur Mesure",
    type: "Programme sur mesure",
    partner: "Welearn",
    category: "Sur mesure",
    formats: ["E-learning", "Presentiel", "Hybride"],
    formatLabel: "E-learning ou presentiel, parcours adaptables",
    levels: ["All levels"],
    levelLabel: "Tous niveaux",
    durations: ["Flexible"],
    durationLabel: "Customized",
    domains: ["Sur mesure", "BIM", "Immobilier", "Management", "Digital", "BTP"],
    objectivesSummary:
      "Concevoir et deployer des parcours personnalises selon vos enjeux metiers, avec accompagnement CSF et ajustements pedagogiques continus.",
    ctaHref: "/formations/certifiantes/sur-mesure",
  },
];

const categoryOptions: Category[] = [
  "Certification",
  "Master / Diplome",
  "Executive Master",
  "Sur mesure",
];

const formatOptions: Format[] = ["E-learning", "Presentiel", "Hybride"];
const levelOptions: Level[] = ["Bac+3", "Bac+4", "Bac+5", "Executive", "All levels"];
const durationOptions: Duration[] = ["< 1 month", "1-3 months", "6-12 months", "Flexible"];
const domainOptions: Domain[] = [
  "BIM",
  "Immobilier",
  "Management",
  "Digital",
  "BTP",
  "Sur mesure",
];

interface ActiveFilters {
  category: Category | "all";
  format: Format | "all";
  level: Level | "all";
  duration: Duration | "all";
  domain: Domain | "all";
}

const defaultFilters: ActiveFilters = {
  category: "all",
  format: "all",
  level: "all",
  duration: "all",
  domain: "all",
};

const categoryBadgeClasses: Record<Category, string> = {
  Certification: "bg-sky-100 text-sky-800 border-sky-200",
  "Master / Diplome": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Executive Master": "bg-amber-100 text-amber-800 border-amber-200",
  "Sur mesure": "bg-rose-100 text-rose-800 border-rose-200",
};

const categoryLabelMap: Record<Category, string> = {
  Certification: "Certification",
  "Master / Diplome": "Master / Diplôme",
  "Executive Master": "Executive Master",
  "Sur mesure": "Sur mesure",
};

const formatLabelMap: Record<Format, string> = {
  "E-learning": "E-learning",
  Presentiel: "Présentiel",
  Hybride: "Hybride",
};

const levelLabelMap: Record<Level, string> = {
  "Bac+3": "Bac+3",
  "Bac+4": "Bac+4",
  "Bac+5": "Bac+5",
  Executive: "Executive",
  "All levels": "All levels",
};

const durationLabelMap: Record<Duration, string> = {
  "< 1 month": "< 1 month",
  "1-3 months": "1-3 months",
  "6-12 months": "6-12 months",
  Flexible: "Flexible",
};

const domainLabelMap: Record<Domain, string> = {
  BIM: "BIM",
  Immobilier: "Immobilier",
  Management: "Management",
  Digital: "Digital",
  BTP: "BTP",
  "Sur mesure": "Sur mesure",
};

function getFormatIcon(formats: Format[]) {
  if (formats.includes("Hybride")) {
    return MonitorSmartphone;
  }
  if (formats.includes("Presentiel")) {
    return Building2;
  }
  return Laptop;
}

export function FormationsCataloguePage() {
  const [filters, setFilters] = useState<ActiveFilters>(defaultFilters);

  const filteredFormations = useMemo(() => {
    return formations.filter((formation) => {
      const categoryMatch =
        filters.category === "all" || formation.category === filters.category;

      const formatMatch =
        filters.format === "all" || formation.formats.includes(filters.format);

      const levelMatch =
        filters.level === "all" || formation.levels.includes(filters.level);

      const durationMatch =
        filters.duration === "all" || formation.durations.includes(filters.duration);

      const domainMatch =
        filters.domain === "all" || formation.domains.includes(filters.domain);

      return categoryMatch && formatMatch && levelMatch && durationMatch && domainMatch;
    });
  }, [filters]);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "all");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8">
        <div className="rounded-2xl border border-border bg-secondary/40 p-5 lg:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    category: event.target.value as ActiveFilters["category"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All categories</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {categoryLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Format
              </label>
              <select
                value={filters.format}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    format: event.target.value as ActiveFilters["format"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All formats</option>
                {formatOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    level: event.target.value as ActiveFilters["level"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All levels</option>
                {levelOptions.map((option) => (
                  <option key={option} value={option}>
                    {levelLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Duration
              </label>
              <select
                value={filters.duration}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    duration: event.target.value as ActiveFilters["duration"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All durations</option>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>
                    {durationLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Domain
              </label>
              <select
                value={filters.domain}
                onChange={(event) =>
                  setFilters((current) => ({
                    ...current,
                    domain: event.target.value as ActiveFilters["domain"],
                  }))
                }
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground"
              >
                <option value="all">All domains</option>
                {domainOptions.map((option) => (
                  <option key={option} value={option}>
                    {domainLabelMap[option]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {filteredFormations.length} formation
              {filteredFormations.length > 1 ? "s" : ""} trouvée
              {filteredFormations.length > 1 ? "s" : ""}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => setFilters(defaultFilters)}
                className="bg-transparent"
              >
                Reinitialiser les filtres
              </Button>
            )}
          </div>
        </div>

        {filteredFormations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-secondary/30 p-10 text-center">
            <h3 className="text-xl font-semibold text-foreground">
              Aucune formation ne correspond a vos filtres
            </h3>
            <p className="mt-2 text-muted-foreground">
              Ajustez les criteres pour afficher de nouvelles options.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFormations.map((formation) => {
              const FormatIcon = getFormatIcon(formation.formats);

              return (
                <article
                  key={formation.id}
                  className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className={categoryBadgeClasses[formation.category]}
                    >
                      {categoryLabelMap[formation.category]}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground">
                      {domainLabelMap[formation.domains[0]]}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold leading-snug text-foreground">
                    {formation.title}
                  </h3>

                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    {formation.partner}
                  </p>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="flex items-start gap-2 text-foreground">
                      <Tag className="mt-0.5 h-4 w-4 text-primary" />
                      <span>
                        <strong>Type:</strong> {formation.type}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-foreground">
                      <FormatIcon className="mt-0.5 h-4 w-4 text-primary" />
                      <span>
                        <strong>Format:</strong> {formation.formatLabel}
                      </span>
                    </p>
                    <p className="flex items-start gap-2 text-foreground">
                      <Clock3 className="mt-0.5 h-4 w-4 text-primary" />
                      <span>
                        <strong>Durée:</strong> {formation.durationLabel}
                      </span>
                    </p>
                  </div>

                  <Badge variant="secondary" className="mt-4 w-fit">
                    {formation.levelLabel}
                  </Badge>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
                    {formation.objectivesSummary}
                  </p>

                  <div className="mt-auto pt-5">
                    <Button asChild className="w-full bg-primary text-white hover:bg-primary/90">
                      <Link href={formation.ctaHref}>
                        En savoir plus
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}