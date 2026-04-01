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
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Témoignages"
          title="Ce que nos clients disent de nous"
        />

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col bg-wl-gray-light rounded-xl p-7 hover:shadow-sm transition-shadow duration-300"
            >
              {/* 5-star rating */}
              <div className="flex gap-0.5 mb-4" aria-label="5 étoiles sur 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="h-4 w-4 text-wl-star"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="flex-1">
                <p className="text-wl-text-secondary leading-relaxed italic text-[15px] mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-wl-border">
                <div className="h-10 w-10 rounded-full bg-wl-blue flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white uppercase">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-wl-text text-sm">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-wl-text-tertiary">
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
