import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Monitor,
  Users,
  BarChart3,
  BookOpen,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle,
  Play,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plateforme LMS | Solutions Digital Learning | Welearn",
  description:
    "Découvrez welearn.ac, notre plateforme LMS propriétaire pour une expérience d'apprentissage optimale.",
};

const features = [
  {
    icon: Monitor,
    title: "Interface intuitive",
    description:
      "Navigation simple et ergonomique pour une prise en main immédiate.",
  },
  {
    icon: BookOpen,
    title: "Contenus riches",
    description: "Vidéos, quiz, documents et ressources interactives.",
  },
  {
    icon: BarChart3,
    title: "Suivi de progression",
    description: "Tableaux de bord détaillés pour suivre votre avancement.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Échangez avec les formateurs et autres apprenants.",
  },
  {
    icon: Smartphone,
    title: "Multi-devices",
    description: "Accessible sur ordinateur, tablette et mobile.",
  },
  {
    icon: Shield,
    title: "Sécurisé",
    description: "Protection des données et accès sécurisé.",
  },
];

const benefits = [
  "Accès 24/7 à vos formations",
  "Progression à votre rythme",
  "Certificats téléchargeables",
  "Support pédagogique réactif",
  "Communauté d'apprenants",
  "Mises à jour régulières des contenus",
];

export default function LMSPage() {
  return (
    <>
      <PageHero
        title="Plateforme LMS"
        description="Nous avons développé notre propre plateforme LMS pour offrir une expérience d'apprentissage optimale."
        eyebrow="Notre technologie"
        size="lg"
      />

      {/* Platform Preview */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
                welearn.ac
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text mb-6 text-balance">
                Une plateforme conçue pour vous
              </h2>
              <p className="text-lg text-wl-text-secondary leading-relaxed mb-8">
                Notre LMS a été développé en interne pour répondre aux besoins
                spécifiques des professionnels de la Construction. Interface
                intuitive, contenus riches et suivi personnalisé pour maximiser
                votre apprentissage.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-wl-blue shrink-0" />
                    <span className="text-wl-text">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-wl-blue hover:bg-wl-blue-dark text-white"
                >
                  <Link href="https://welearn.ac" target="_blank">
                    Découvrir la plateforme
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-wl-blue text-wl-blue bg-transparent hover:bg-wl-blue hover:text-white"
                >
                  <Link href="/contact">
                    <Play className="mr-2 h-4 w-4" />
                    Demander une démo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-wl-border bg-white p-4 shadow-[0_12px_36px_rgba(0,0,0,0.08)]">
                <Image
                  src="/modern-lms-dashboard-interface-with-courses-progre.jpg"
                  alt="Plateforme LMS Welearn"
                  width={700}
                  height={500}
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
              Fonctionnalités
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-wl-border bg-wl-gray-light p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="w-fit rounded-xl bg-wl-blue-tint p-3 mb-4">
                  <feature.icon className="h-6 w-6 text-wl-blue" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-wl-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-wl-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-highlight mb-4">
            Passage à l'action
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre formation ?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Créez votre compte sur welearn.ac et accédez à nos formations dès
            aujourd'hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-wl-blue-dark hover:bg-white/90 font-semibold"
            >
              <Link href="https://welearn.ac" target="_blank">
                Créer un compte
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 border-2 bg-transparent text-white hover:bg-white hover:text-wl-blue-dark"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
