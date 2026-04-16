import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DigitalLearningCta() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-wl-highlight mb-4">
          Digital learning
        </p>
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
          Prêt à digitaliser vos formations ?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Contactez-nous pour discuter de vos besoins et découvrir comment nos
          solutions peuvent transformer votre approche de la formation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-white/90 text-wl-blue-dark font-semibold transition-all duration-200"
          >
            <Link href="/contact">Demander une démonstration</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 border-2 bg-transparent text-white hover:bg-white hover:text-wl-blue-dark transition-all duration-200"
          >
            <Link href="https://welearn.ac" target="_blank">
              Accéder au LMS
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
