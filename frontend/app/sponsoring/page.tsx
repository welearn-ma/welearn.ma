import { HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";

const benefits = [
  {
    title: "Formez la filière",
    description:
      "Financez l'accès à des MOOCs techniques de référence pour les professionnels du BTP et de la construction.",
  },
  {
    title: "Valorisez votre marque",
    description:
      "Associez votre entreprise à des contenus pédagogiques reconnus et à la montée en compétences du secteur.",
  },
  {
    title: "Un impact mesurable",
    description:
      "Chaque MOOC parrainé ouvre l'apprentissage à davantage d'apprenants, partout au Maroc.",
  },
];

export default function SponsoringPage() {
  return (
    <>
      <PageHero
        title="Programme de sponsoring des MOOCs"
        description="Parrainez un ou plusieurs MOOCs Welearn et rendez la formation technique accessible à toute la filière. Choisissez les MOOCs que vous souhaitez soutenir et notre équipe revient vers vous."
        eyebrow="Devenez sponsor"
        badge={{ icon: HeartHandshake, text: "Devenez sponsor" }}
        size="lg"
      />

      <section className="bg-wl-gray-light py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange">
                Pourquoi sponsoriser ?
              </p>
              <h2 className="mt-3 font-sans text-3xl font-bold text-wl-text md:text-4xl">
                Soutenez les compétences de demain
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-wl-text-secondary">
                Le sponsoring permet à votre organisation de financer l'accès à
                des MOOCs spécialisés et de contribuer directement à la
                professionnalisation du secteur de la construction.
              </p>

              <div className="mt-8 space-y-6">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="flex gap-4">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-wl-orange" />
                    <div>
                      <h3 className="font-semibold text-wl-text">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-wl-text-secondary">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <SponsorshipForm />
          </div>
        </div>
      </section>
    </>
  );
}
