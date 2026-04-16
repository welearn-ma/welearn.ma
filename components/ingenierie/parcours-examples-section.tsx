import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const parcours = [
  "BIM pour la Maîtrise d'Ouvrage (MOA)",
  "BIM 4D/5D/6D/7D avancé",
  "Expertise immobilière",
  "Management de projet construction",
  "Efficacité énergétique des bâtiments",
  "Réglementation technique du bâtiment",
];

export function ParcoursExamplesSection() {
  return (
    <section className="py-20 lg:py-28 bg-wl-gray-light">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Exemples de parcours"
          title="Parcours réalisés"
          description="Découvrez quelques exemples de parcours de formation que nous avons conçus pour nos clients."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {parcours.map((parcour, index) => (
            <div
              key={index}
              className="group cursor-pointer rounded-xl border border-wl-border bg-white px-6 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-wl-blue hover:text-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-wl-orange transition-colors group-hover:bg-white" />
                <span className="font-medium">{parcour}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-wl-blue text-wl-blue hover:bg-wl-blue hover:text-white bg-transparent transition-all duration-200"
          >
            <Link href="/contact">
              Demander un devis personnalisé
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
