import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle, ArrowRight } from "lucide-react";

export function CorporateAcademySection() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
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
              className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
            >
              <Link href="/contact">
                Discuter de votre projet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <Building2 className="h-16 w-16 text-white mb-6" />
              <h3 className="font-sans text-2xl font-bold text-white mb-4">
                Votre Académie
              </h3>
              <p className="text-white/70 mb-6">
                Structurez et valorisez la formation au sein de votre
                organisation avec une académie qui porte vos valeurs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-white/70">Personnalisable</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 text-center">
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
