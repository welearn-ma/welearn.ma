import Link from "next/link";
import { ArrowRight, Building2, Clock3, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { certifiantesFormations } from "../../../data/formations-catalogue";
import {
  badgeClasses,
  domainStripeClasses,
  getFormatIcon,
  levelIndicatorClasses,
} from "./constants";

type Formation = (typeof certifiantesFormations)[number];

export function FormationCatalogueCard({
  formation,
}: {
  formation: Formation;
}) {
  const FormatIcon = getFormatIcon(formation.format);

  return (
    <Link href={formation.href} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div
          className={`h-1.5 w-full ${domainStripeClasses[formation.domain]}`}
        />

        <div className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge variant="outline" className={badgeClasses[formation.badge]}>
              {formation.badge}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {formation.domain}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground">
            {formation.title}
          </h3>

          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <span>
                <strong>Organisme :</strong> {formation.provider}
              </span>
            </p>
            {formation.issuer ? (
              <p className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>
                  <strong>Accrédité par :</strong> {formation.issuer}
                </span>
              </p>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              <FormatIcon className="h-3.5 w-3.5 text-primary" />
              {formation.format.join(" / ")}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              {formation.duration}
            </span>
          </div>

          <div className="mt-4 inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold">
            <span
              className={`rounded-full px-2.5 py-1 ${levelIndicatorClasses[formation.level]}`}
            >
              {formation.level}
            </span>
          </div>

          <p className="mt-3 overflow-hidden text-sm leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {formation.summary}
          </p>

          <div className="mt-auto pt-5">
            <Button
              asChild
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              <span>
                En savoir plus
                <ArrowRight className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </div>
      </article>
    </Link>
  );
}
