import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-20 lg:py-32">
      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-[360px] w-[360px] rounded-full bg-white/2 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#4ADE80] shrink-0" />
              <span className="text-sm font-medium text-white/90 tracking-wide">
                Se former · S'informer · Échanger
              </span>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight tracking-tight">
              Formez les professionnels qui{" "}
              <span className="text-wl-highlight">
                bâtissent le monde de demain
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/75 mb-8 leading-relaxed max-w-xl lg:max-w-none">
              Welearn est la plateforme EdTech de référence dédiée à la
              construction, l'infrastructure et l'immobilier. Nous accélérons la
              transformation digitale du secteur par des formations innovantes,
              certifiantes et connectées aux réalités du terrain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-white/90 text-wl-blue-dark font-semibold transition-all duration-200"
              >
                <Link href="/formations">
                  Découvrir nos formations
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 border-2 text-white hover:bg-white hover:text-wl-blue-dark bg-transparent transition-all duration-200"
              >
                <Link href="/contact">Demander un programme sur mesure</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-white/6 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-white/4 backdrop-blur-sm rounded-3xl -rotate-3" />
              <div className="relative bg-white/8 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <Image
                  src="/images/welearn-icon.png"
                  alt="Welearn Education"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
