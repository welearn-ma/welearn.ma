import { SectionHeader } from "@/components/section-header";
import { Search, Lightbulb, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Analyse des besoins",
    description:
      "Diagnostic approfondi des compétences existantes et identification des gaps à combler pour atteindre vos objectifs stratégiques.",
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Conception pédagogique",
    description:
      "Développement de programmes sur-mesure avec les méthodes les plus adaptées : présentiel, digital, blended learning.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Évaluation & Ajustement",
    description:
      "Suivi des résultats et amélioration continue des dispositifs de formation pour maximiser l'impact.",
  },
];

export function ProcessStepsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Notre démarche"
          title="Une méthodologie en 3 étapes"
          description="Un processus structuré pour garantir l'efficacité de vos formations."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="h-full rounded-2xl border border-wl-border bg-wl-gray-light p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-bold text-wl-blue/15">
                    {step.number}
                  </span>
                  <div className="rounded-xl bg-wl-blue-tint p-3">
                    <step.icon className="h-6 w-6 text-wl-blue" />
                  </div>
                </div>
                <h3 className="font-sans text-xl font-bold text-wl-text mb-3">
                  {step.title}
                </h3>
                <p className="text-wl-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-wl-orange/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
