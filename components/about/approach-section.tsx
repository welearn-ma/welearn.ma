import Image from "next/image";

export function ApproachSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/construction-site-workers-training-bim-technology.jpg"
              alt="Formation sur chantier"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Notre approche
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              L'excellence au service de la Construction
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nous combinons expertise technique, innovation pédagogique et
              accompagnement personnalisé pour offrir des formations qui
              répondent aux défis réels du secteur de la Construction.
            </p>
            <ul className="space-y-3">
              {[
                "Formateurs experts du secteur",
                "Méthodes pédagogiques innovantes",
                "Suivi personnalisé",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
