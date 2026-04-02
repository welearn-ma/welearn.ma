export function HistorySection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            NOTRE HISTOIRE
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text text-balance leading-tight">
            D'une conviction à un écosystème
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="border-l-4 border-wl-blue pl-5">
            <p className="text-xs font-bold uppercase tracking-widest text-wl-blue mb-2">
              NOTRE MISSION
            </p>
            <p className="text-base text-wl-text-secondary leading-relaxed">
              Accélérer la transformation du secteur de la construction par des
              solutions d'apprentissage innovantes, des certifications reconnues
              et une orchestration d'écosystème unique. Nous créons les ponts
              entre l'industrie, les professionnels, le monde académique et les
              fournisseurs de technologies — pour que la compétence devienne le
              moteur du progrès.
            </p>
          </div>

          <div className="border-l-4 border-wl-orange pl-5">
            <p className="text-xs font-bold uppercase tracking-widest text-wl-orange mb-2">
              NOTRE VISION
            </p>
            <p className="text-base text-wl-text-secondary leading-relaxed">
              Devenir la plateforme de référence mondiale pour la formation et
              l'innovation dans les métiers de la construction, de
              l'infrastructure et de l'immobilier. Nous croyons en un avenir où
              chaque professionnel du secteur a accès aux compétences qui
              transforment sa pratique.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
