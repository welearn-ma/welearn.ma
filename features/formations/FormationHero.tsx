import { BookOpen, Clock, Users } from "lucide-react";
import type { Formation } from "@/data/formations";

type FormationHeroProps = {
  formation: Formation;
};

const categoryLabels = {
  diplomante: "Diplomante",
  certifiante: "Certifiante",
};

export function FormationHero({ formation }: FormationHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-white py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <span className="inline-flex rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          {categoryLabels[formation.category]}
        </span>

        <h1 className="mt-5 max-w-4xl font-sans text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {formation.title}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {formation.subtitle}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{formation.duration}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{formation.level}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>{formation.language}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
