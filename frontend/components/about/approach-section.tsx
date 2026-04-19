import { Target, Layers, Shield, Network, Cpu } from "lucide-react";

const differentiators = [
  {
    icon: Target,
    title: "Spécialiste vertical",
    description:
      "Entièrement dédiés à la construction, l'infrastructure et l'immobilier — cette spécialisation garantit la pertinence et la profondeur de chaque programme.",
  },
  {
    icon: Layers,
    title: "Double compétence",
    description:
      "Ingénierie de formation + expertise métier BTP/Immobilier. Cette combinaison est rare — et elle change tout.",
  },
  {
    icon: Shield,
    title: "Certifications à valeur internationale",
    description:
      "Service provider accrédité buildingSMART International, programmes accrédités par la Conférence des Grandes Écoles, labels openBIM.",
  },
  {
    icon: Network,
    title: "Un écosystème, pas juste un catalogue",
    description:
      "Nous connectons l'industrie, les universités, les institutions et les professionnels. Nos programmes sont co-construits avec les leaders du secteur.",
  },
  {
    icon: Cpu,
    title: "Innovation intégrée",
    description:
      "Notre propre plateforme LMS, studio de production audiovisuelle, solutions d'IA appliquées à l'apprentissage — nous produisons l'innovation, nous ne la sous-traitons pas.",
  },
];

function DiffCard({
  icon: Icon,
  title,
  description,
}: (typeof differentiators)[number]) {
  return (
    <div className="h-full bg-white border border-wl-border rounded-xl p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
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

export function DifferentiatorsSection() {
  return (
    <section className="py-20 bg-wl-gray-light">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            NOTRE DIFFÉRENCE
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text text-balance leading-tight">
            Ce qui fait de Welearn un partenaire unique
          </h2>
        </div>

        {/*
          Single 6-col grid: each card spans 2 cols → identical widths.
          Bottom pair starts at col 2 so col 1 and col 6 stay empty → centered.
        */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
          {differentiators.slice(0, 3).map((d) => (
            <div key={d.title} className="sm:col-span-2">
              <DiffCard {...d} />
            </div>
          ))}
          <div className="sm:col-start-2 sm:col-span-2">
            <DiffCard {...differentiators[3]} />
          </div>
          <div className="sm:col-span-2">
            <DiffCard {...differentiators[4]} />
          </div>
        </div>
      </div>
    </section>
  );
}
