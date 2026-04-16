import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FormationsCta() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-wl-highlight mb-4">
          Orientation & accompagnement
        </p>
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
          Besoin d'aide pour choisir votre formation ?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
          Nos conseillers sont à votre disposition pour vous orienter vers le
          programme le plus adapté à votre profil et vos objectifs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-white/90 text-wl-blue-dark font-semibold transition-all duration-200"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 border-2 bg-transparent text-white hover:bg-white hover:text-wl-blue-dark transition-all duration-200"
          >
            <Link href="/formations/certifiantes">Voir le catalogue</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
