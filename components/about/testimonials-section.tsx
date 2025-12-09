import { SectionHeader } from "@/components/section-header";
import { Testimonials } from "@/components/testimonials";

const testimonials = [
  {
    quote:
      "Welearn nous a accompagnés dans la mise en place d'un programme de formation BIM complet pour nos équipes. Les résultats sont au-delà de nos attentes.",
    author: "Directeur Technique",
    company: "Grand Groupe BTP",
  },
  {
    quote:
      "La qualité pédagogique et l'expertise des formateurs Welearn ont permis à nos collaborateurs de monter rapidement en compétences sur les outils BIM.",
    author: "DRH",
    company: "Promoteur Immobilier",
  },
  {
    quote:
      "Un partenaire de confiance pour notre stratégie de formation. L'accompagnement CSF a été particulièrement précieux.",
    author: "Directeur Formation",
    company: "Entreprise de Construction",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Témoignages"
          title="Ce qu'ils disent de nous"
          description=""
        />
        <Testimonials items={testimonials} />
      </div>
    </section>
  );
}
