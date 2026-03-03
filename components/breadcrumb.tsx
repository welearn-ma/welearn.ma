"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const routeLabels: Record<string, string> = {
  about: "À propos",
  histoire: "Histoire",
  missions: "Missions",
  valeurs: "Valeurs",
  equipe: "Équipe",
  references: "Références",
  formations: "Formations",
  diplomantes: "Diplômantes",
  certifiantes: "Certifiantes",
  "executive-masters": "Executive Masters",
  "licences-pro": "Licences Professionnelles",
  "bim-foundations": "BIM Foundations Professional",
  catalogue: "Catalogue des formations",
  "sur-mesure": "Formations sur mesure",
  ingenierie: "Ingénierie de Formation",
  academie: "Académie",
  strategie: "Stratégie de formation",
  accompagnement: "Accompagnement CSF",
  "digital-learning": "Solutions Digital Learning",
  lms: "Plateforme LMS",
  "contenus-elearning": "Développement de contenus",
  bibliotheque: "Bibliothèque de cours",
  conseil: "Conseil & Transformation",
  transformation: "Transformation digitale",
  audits: "Études, audits & diagnostics",
  ressources: "Ressources",
  blog: "Articles & Blog",
  videos: "Vidéos pédagogiques",
  faq: "FAQ",
  events: "Webinaires & Événements",
  contact: "Contact",
};

export function Breadcrumb() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      routeLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { href, label };
  });

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-secondary border-b border-border"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <ol className="flex items-center gap-2 py-3 text-sm">
          <li>
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Accueil</span>
            </Link>
          </li>
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.href} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
              {index === breadcrumbs.length - 1 ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
