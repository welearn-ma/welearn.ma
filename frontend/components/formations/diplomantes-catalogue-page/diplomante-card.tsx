import Link from "next/link";
import { ArrowRight, Clock3, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  badgeClasses,
  domainStripeClasses,
  levelIndicatorClasses,
} from "./constants";
import type { Diplomante } from "./types";

export function DiplomanteCatalogueCard({
  diplomante,
}: {
  diplomante: Diplomante;
}) {
  return (
    <Link key={diplomante.id} href={diplomante.href} className="block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
        <div
          className={`h-1.5 w-full ${domainStripeClasses[diplomante.domain]}`}
        />

        <div className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Badge variant="outline" className={badgeClasses[diplomante.badge]}>
              {diplomante.badge}
            </Badge>
            <span className="text-xs font-medium text-muted-foreground">
              {diplomante.domain}
            </span>
          </div>

          <h3 className="text-lg font-bold leading-snug text-foreground">
            {diplomante.title}
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            <strong>Organisme :</strong> {diplomante.provider}
          </p>

          {diplomante.issuer ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
              <span>
                <strong>Partenaire :</strong> {diplomante.issuer}
              </span>
            </p>
          ) : null}

          {diplomante.tags && diplomante.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {diplomante.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
              <Clock3 className="h-3.5 w-3.5 text-primary" />
              {diplomante.duration}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${levelIndicatorClasses[diplomante.level]}`}
            >
              {diplomante.level}
            </span>
          </div>

          <p className="mt-3 overflow-hidden text-sm leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {diplomante.summary}
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
