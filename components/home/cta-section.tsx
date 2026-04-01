import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, Globe } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-(--color-welearn-gold) mb-4">
          Passons à l'action
        </p>
        <h2 className="font-sans text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
          Prêt à développer les compétences qui font la différence ?
        </h2>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Que vous soyez un professionnel souhaitant certifier vos compétences,
          une entreprise en quête de performance ou une institution visant
          l'excellence — parlons-en.
        </p>

        <div className="flex justify-center mb-14">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
          >
            <Link href="/contact">
              Contactez-nous
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-white/80">
          <a
            href="mailto:contact@welearn.ma"
            className="flex items-center justify-center gap-2 hover:text-(--color-welearn-gold) transition-colors text-sm"
          >
            <Mail className="h-4 w-4 shrink-0" />
            contact@welearn.ma
          </a>
          <a
            href="tel:+212661499479"
            className="flex items-center justify-center gap-2 hover:text-(--color-welearn-gold) transition-colors text-sm"
          >
            <Phone className="h-4 w-4 shrink-0" />
            +212 661 499 479
          </a>
          <div className="flex items-center justify-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0" />
            Technopark Casablanca
          </div>
          <a
            href="https://welearn.ac"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 hover:text-(--color-welearn-gold) transition-colors text-sm"
          >
            <Globe className="h-4 w-4 shrink-0" />
            welearn.ac
          </a>
        </div>
      </div>
    </section>
  );
}
