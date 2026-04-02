import { Lightbulb, Award, Flame, Rocket, BookOpen } from "lucide-react";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Pour avancer, il faut oser envisager ce qui n'a jamais été fait. L'innovation est pour nous un multiplicateur de possibilités — pas un label, mais une extension permanente des horizons. Des MOOCs interactifs à l'IA appliquée à l'apprentissage, nous réinventons chaque jour la manière de transmettre le savoir.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Nous répondons aux besoins de nos clients avec des produits et des services conçus selon les plus hauts critères de qualité. L'excellence n'est pas un luxe — c'est le standard qui accompagne chacune de nos actions, de la conception pédagogique au déploiement sur le terrain.",
  },
  {
    icon: Flame,
    title: "Passion",
    description:
      "La passion nous propulse et nous pousse vers les horizons les plus ambitieux. Elle nous dote d'une dynamique permanente, transformant chaque challenge en opportunité et chaque projet en succès.",
  },
  {
    icon: Rocket,
    title: "Audace",
    description:
      "Le progrès commence lorsqu'on écarte le mot « impossible » de son vocabulaire. Nous avons de l'ambition, nous osons, et nous explorons en permanence de nouveaux territoires — nouveaux marchés, nouvelles technologies, nouvelles manières de former.",
  },
  {
    icon: BookOpen,
    title: "Transmission",
    description:
      "La transmission du savoir est au cœur de notre ADN. Nous croyons que la connaissance partagée est la connaissance multipliée — et que chaque professionnel formé contribue à élever l'ensemble du secteur.",
  },
];

function ValueCard({
  icon: Icon,
  title,
  description,
}: (typeof values)[number]) {
  return (
    <div className="bg-white border border-wl-border rounded-xl p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-12 w-12 rounded-xl bg-wl-blue-tint flex items-center justify-center mb-4 shrink-0">
        <Icon className="h-5 w-5 text-wl-blue" />
      </div>
      <h3 className="text-[17px] font-semibold text-wl-text mb-2">{title}</h3>
      <p className="text-sm text-wl-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export function ValuesSection() {
  return (
    <section className="py-20 bg-wl-gray-light">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            NOS VALEURS
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text text-balance leading-tight">
            Les valeurs qui nous portent
          </h2>
        </div>

        {/* Row 1 — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          {values.slice(0, 3).map((v) => (
            <ValueCard key={v.title} {...v} />
          ))}
        </div>

        {/* Row 2 — 2 cards centered at 1/3-width each */}
        <div className="flex flex-col sm:flex-row gap-6 sm:justify-center">
          {values.slice(3).map((v) => (
            <div key={v.title} className="w-full sm:w-1/3">
              <ValueCard {...v} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
