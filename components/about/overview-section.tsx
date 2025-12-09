import Image from "next/image";

export function OverviewSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Qui sommes-nous
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
              Former les professionnels de demain
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welearn est née de la conviction que le secteur de la
                Construction a besoin d'une formation adaptée aux enjeux
                contemporains : digitalisation, transition écologique, et
                excellence opérationnelle.
              </p>
              <p>
                Reconnue comme{" "}
                <strong className="text-foreground">
                  Jeune Entreprise Innovante®
                </strong>{" "}
                en France et au Maroc, nous bénéficions également de la
                reconnaissance de l'
                <strong className="text-foreground">
                  Agence de Développement du Digital (ADD)
                </strong>{" "}
                pour notre approche pionnière.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/modern-office-team-collaboration-construction-trai.jpg"
                alt="Équipe Welearn"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
