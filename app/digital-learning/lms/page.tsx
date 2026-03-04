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
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
                welearn.ac
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                Une plateforme conçue pour vous
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Notre LMS a été développé en interne pour répondre aux besoins
                spécifiques des professionnels de la Construction. Interface
                intuitive, contenus riches et suivi personnalisé pour maximiser
                votre apprentissage.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white"
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
                  className="border-primary text-primary bg-transparent"
                >
                  <Link href="/contact">
                    <Play className="mr-2 h-4 w-4" />
                    Demander une démo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-secondary rounded-2xl p-4 border border-border">
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
      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Fonctionnalités
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground">
              Tout ce dont vous avez besoin
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
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
              className="bg-white text-primary hover:bg-white/90"
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
              className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
            >
              <Link href="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
