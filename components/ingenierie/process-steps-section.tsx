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
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Notre démarche"
          title="Une méthodologie en 3 étapes"
          description="Un processus structuré pour garantir l'efficacité de vos formations."
        />

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white rounded-2xl p-8 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-5xl font-bold text-primary/10">
                    {step.number}
                  </span>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="font-sans text-xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="h-8 w-8 text-primary/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
