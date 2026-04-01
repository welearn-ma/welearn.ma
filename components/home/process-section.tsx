import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Diagnostic & Analyse",
    description:
      "Analyse détaillée des compétences à développer et des enjeux métier.",
  },
  {
    number: "02",
    title: "Conception & Déploiement",
    description:
      "Ingénierie pédagogique sur mesure. Format présentiel, e-learning ou hybride.",
  },
  {
    number: "03",
    title: "Évaluation & Financement",
    description:
      "Évaluation d'impact + gestion intégrale du dossier de remboursement CSF.",
  },
];

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            Méthodologie
          </p>
          <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
            Un accompagnement de A à Z
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
            De l'analyse de vos besoins jusqu'au suivi post-formation, nous
            vous accompagnons à chaque étape.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-14">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Connector line between steps on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(50%+2.5rem)] right-[calc(-50%+2.5rem)] h-px bg-white/20" />
              )}

              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-sm mb-6 group-hover:border-white/40 group-hover:bg-white/15 transition-all duration-300">
                <span className="font-sans text-2xl font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="font-sans text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-white/70 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-wl-orange hover:bg-wl-orange-dark text-white font-semibold transition-colors border-0"
          >
            <Link href="/contact">
              Lancer votre projet de formation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
