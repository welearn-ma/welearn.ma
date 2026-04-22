import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-[1200px] px-6 text-center">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-5 text-balance">
          Envie de rejoindre l'aventure ?
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
          Que vous soyez un professionnel souhaitant développer vos compétences,
          une entreprise cherchant un partenaire de formation stratégique, ou un
          expert désireux de contribuer à nos programmes — nous serions ravis
          d'échanger avec vous.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-wl-orange hover:bg-wl-orange-dark text-white font-semibold transition-all duration-200 border-0"
          >
            <Link href="/contact">
              Rejoindre notre réseau de formateurs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
