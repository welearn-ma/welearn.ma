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
            <div className="inline-flex items-center gap-2 bg-white/[0.12] backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
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
              <div className="absolute inset-0 bg-white/[0.06] rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-white/[0.04] backdrop-blur-sm rounded-3xl -rotate-3" />
              <div className="relative bg-white/[0.08] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
                <Image
                  src="/images/welearn-icon.png"
                  alt="Welearn Education"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -left-8 top-1/4 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-wl-blue-tint rounded-lg">
                  <svg
                    className="h-6 w-6 text-wl-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-wl-text text-sm">
                    Mastère BIM
                  </div>
                  <div className="text-xs text-wl-text-tertiary">
                    Co-diplômant EHTP
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-wl-blue-tint rounded-lg">
                  <svg
                    className="h-6 w-6 text-wl-blue"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-wl-text text-sm">
                    buildingSMART
                  </div>
                  <div className="text-xs text-wl-text-tertiary">
                    Service Provider accrédité
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
