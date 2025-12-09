import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Users, BookOpen } from "lucide-react";

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
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-white" />
              <span className="text-sm font-medium text-white">
                Jeune Entreprise Innovante®
              </span>
            </div>

            <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance leading-tight">
              Formez-vous aux métiers de la{" "}
              <span className="text-white/90 underline decoration-white/30 underline-offset-4">
                Construction
              </span>{" "}
              de demain
            </h1>

            <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl lg:max-w-none">
              Welearn est une EdTech destinée au secteur de la Construction,
              reconnue comme Jeune Entreprise Innovante® en France et au Maroc.
              Experts en BIM, ingénierie et formation executive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
              >
                <Link href="/programs">
                  Découvrir nos programmes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white border-2 text-white hover:bg-(--color-welearn-gold) hover:text-(--color-welearn-navy) hover:border-(--color-welearn-gold) bg-transparent transition-colors"
              >
                <Link href="/contact">Demander un devis</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  1100+
                </div>
                <div className="text-sm text-white/70">Apprenants formés</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  50+
                </div>
                <div className="text-sm text-white/70">
                  Entreprises partenaires
                </div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-white">
                  10+
                </div>
                <div className="text-sm text-white/70">Années d'expertise</div>
              </div>
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
            <div className="absolute -left-8 top-1/4 bg-white/90 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-welearn-navy/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-welearn-navy" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    Masters BIM
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Accréditation CGE
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-welearn-navy/10 rounded-lg">
                  <Users className="h-6 w-6 text-welearn-navy" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    BuildingSmart
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Certification officielle
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
