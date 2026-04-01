const stats = [
  { value: "1 500+", label: "Professionnels formés" },
  { value: "2 500+", label: "Heures de formation dispensées" },
  { value: "100+", label: "Clients entreprises & institutionnels" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "10+", label: "Années d'expertise terrain" },
];

export function StatsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            Notre impact
          </p>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-wl-text mb-6 text-balance leading-tight">
            La formation continue, repensée pour le BTP
          </h2>
          <p className="text-lg text-wl-text-secondary leading-relaxed">
            Le secteur de la construction est l'un des plus grands au monde —
            et l'un des moins digitalisés. Les professionnels doivent maîtriser
            de nouvelles compétences : BIM, construction durable, IA, management
            de projets complexes. Welearn est né pour combler ce fossé.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-wl-gray-light border border-wl-border hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-wl-blue/20 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold text-wl-blue mb-2 font-sans">
                {stat.value}
              </div>
              <div className="text-sm text-wl-text-secondary font-medium leading-snug">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
