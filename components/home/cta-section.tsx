import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, Globe } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-4">
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
            className="bg-wl-orange hover:bg-wl-orange-dark text-white font-semibold transition-all duration-200 border-0"
          >
            <Link href="/contact">
              Contactez-nous
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
