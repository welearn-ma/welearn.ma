import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Prêt à développer vos compétences ?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Contactez-nous pour discuter de vos besoins en formation et découvrir
          comment Welearn peut accompagner votre entreprise.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
          >
            <Link href="/contact">
              Demander un devis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-(--color-welearn-gold) hover:text-(--color-welearn-navy) hover:border-(--color-welearn-gold) bg-transparent transition-colors"
          >
            <Link href="/programs">Voir les programmes</Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center text-white/80">
          <a
            href="mailto:contact@welearn.ma"
            className="flex items-center gap-2 hover:text-(--color-welearn-gold) transition-colors"
          >
            <Mail className="h-5 w-5" />
            contact@welearn.ma
          </a>
          <a
            href="tel:+212522000000"
            className="flex items-center gap-2 hover:text-(--color-welearn-gold) transition-colors"
          >
            <Phone className="h-5 w-5" />
            +212 520 850 850
          </a>
        </div>
      </div>
    </section>
  );
}
