import { SectionHeader } from "@/components/section-header";

// TODO: replace with real testimonials
const testimonials = [
  {
    quote:
      "Welearn a transformé notre approche de la formation BIM. Les programmes sont directement connectés aux réalités du terrain, ce qui a permis à nos équipes de monter rapidement en compétences.",
    author: "Prénom Nom",
    role: "Directeur Technique",
    company: "Entreprise A",
  },
  {
    quote:
      "Un partenaire de confiance pour notre académie d'entreprise. La qualité pédagogique est au rendez-vous et l'équipe est très réactive. Nos collaborateurs ont adoré les formations.",
    author: "Prénom Nom",
    role: "DRH",
    company: "Entreprise B",
  },
  {
    quote:
      "La certification BIM Foundations via Welearn nous a permis de standardiser les pratiques de notre équipe et d'obtenir une reconnaissance internationale reconnue par buildingSMART.",
    author: "Prénom Nom",
    role: "BIM Manager",
    company: "Entreprise C",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Témoignages"
          title="Ce que nos clients disent de nous"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Quote mark */}
              <div
                className="text-5xl font-serif leading-none mb-4 select-none"
                style={{ color: "var(--color-welearn-navy)", opacity: 0.2 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote className="flex-1">
                <p className="text-foreground leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
              </blockquote>

              <div className="flex items-center gap-4 pt-6 border-t border-border">
                {/* Logo placeholder */}
                <div className="h-10 w-10 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-muted-foreground uppercase">
                    {testimonial.company.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
