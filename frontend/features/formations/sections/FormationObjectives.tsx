type Props = {
  objectives: string[];
};

export function FormationObjectives({ objectives }: Props) {
  return (
    <section className="bg-wl-gray-light py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Compétences visées
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
          Objectifs pédagogiques
        </h2>

        <div className="grid md:grid-cols-2 gap-5">
          {objectives.map((objective, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-xl border border-wl-border bg-white p-7 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wl-blue text-sm font-bold text-white">
                {idx + 1}
              </div>
              <p className="text-base leading-relaxed text-wl-text-secondary">
                {objective}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
