import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight, Monitor, Users, BookOpen, BarChart3 } from "lucide-react"

const features = [
  { icon: Monitor, text: "Plateforme 100% en ligne" },
  { icon: Users, text: "Suivi personnalisé" },
  { icon: BookOpen, text: "Contenus interactifs" },
  { icon: BarChart3, text: "Tableau de bord analytique" },
]

export function LMSSection() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-3">
              Notre plateforme
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
              Découvrez notre LMS : welearn.ac
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Nous avons développé notre propre plateforme LMS pour offrir une expérience d'apprentissage optimale.
              Accédez à vos formations, suivez votre progression et interagissez avec vos formateurs en toute
              simplicité.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/90">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
            >
              <Link href="https://welearn.ac" target="_blank">
                Accéder à la plateforme
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="relative">
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <Image
                src="/modern-lms-platform-dashboard-with-courses-and-pro.jpg"
                alt="Plateforme LMS Welearn"
                width={700}
                height={500}
                className="rounded-xl w-full"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-primary" />
                <div>
                  <div className="font-bold text-foreground">+1100</div>
                  <div className="text-sm text-muted-foreground">Apprenants actifs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
