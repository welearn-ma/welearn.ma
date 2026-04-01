import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-(--color-welearn-navy) py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="text-sm font-medium text-white/90 tracking-wide">
                Se former · S'informer · Échanger
              </span>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
              Formez les professionnels qui bâtissent{" "}
              <span className="relative inline-block">
                <span className="relative z-10">le monde de demain</span>
                <span
                  className="absolute bottom-1 left-0 right-0 h-2 rounded opacity-30 z-0"
                  style={{ backgroundColor: "var(--color-welearn-gold)" }}
                />
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl lg:max-w-none">
              Welearn est la plateforme EdTech de référence dédiée à la
              construction, l'infrastructure et l'immobilier. Nous accélérons la
              transformation digitale du secteur par des formations innovantes,
              certifiantes et connectées aux réalités du terrain.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
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
                className="border-white border-2 text-white hover:bg-(--color-welearn-gold) hover:text-(--color-welearn-navy) hover:border-(--color-welearn-gold) bg-transparent transition-colors"
              >
                <Link href="/contact">Demander un programme sur mesure</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-white/20 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl -rotate-3" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
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
            <div className="absolute -left-8 top-1/4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--color-welearn-navy) 10%, transparent)" }}>
                  <svg
                    className="h-6 w-6"
                    style={{ color: "var(--color-welearn-navy)" }}
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
                  <div className="font-semibold text-foreground text-sm">Mastère BIM</div>
                  <div className="text-xs text-muted-foreground">Co-diplômant EHTP</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: "color-mix(in oklch, var(--color-welearn-navy) 10%, transparent)" }}>
                  <svg
                    className="h-6 w-6"
                    style={{ color: "var(--color-welearn-navy)" }}
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
                  <div className="font-semibold text-foreground text-sm">buildingSMART</div>
                  <div className="text-xs text-muted-foreground">Service Provider accrédité</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
