import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

export function CorporateAcademySection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wl-highlight mb-3">
              Académies d'entreprise
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
              Créez votre académie corporate
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Welearn vous accompagne dans la création et le pilotage de votre
              propre académie d'entreprise. Formez vos collaborateurs en continu
              avec des parcours personnalisés et une plateforme dédiée.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Parcours de formation personnalisés",
                "Plateforme LMS dédiée",
                "Contenus sur-mesure",
                "Suivi et reporting avancés",
                "Accompagnement pédagogique",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/90">
                  <CheckCircle className="h-5 w-5 text-white shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-white/90 text-wl-blue-dark font-semibold transition-all duration-200"
            >
              <Link href="/contact">
                Discuter de votre projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm shadow-2xl">
              <Building2 className="h-16 w-16 text-white mb-6" />
              <h3 className="font-sans text-2xl font-bold text-white mb-4">
                Votre Académie
              </h3>
              <p className="text-white/70 mb-6">
                Structurez et valorisez la formation au sein de votre
                organisation avec une académie qui porte vos valeurs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/70">Personnalisable</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-white/70">Accessible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
