import type { FormationPageData } from "@/types/formation-page";

type FormationHeroProps = {
  formation: FormationPageData;
};

export function FormationHero({ formation }: FormationHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary to-white py-16 lg:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.85),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        {formation.badges[0] && (
          <span className="inline-flex rounded-full border border-primary/20 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            {formation.badges[0]}
          </span>
        )}

        <h1 className="mt-5 max-w-4xl font-sans text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
          {formation.title}
        </h1>

        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {formation.subtitle}
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {formation.infoBanner.slice(0, 3).map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-2 rounded-xl border border-border bg-white/80 px-4 py-3 text-sm text-foreground">
                <Icon className="h-4 w-4 text-primary" />
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
