import type { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Users, Award, CheckCircle, ArrowRight, Globe, FileCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "BIM Foundations Professional | Formations Certifiantes | Welearn",
  description: "Certification officielle BuildingSmart validant vos compétences fondamentales en BIM.",
}

const highlights = [
  "Certification officielle BuildingSmart International",
  "Reconnaissance mondiale dans l'industrie",
  "Concepts openBIM fondamentaux",
  "Examen en ligne ou sur site",
  "Préparation intensive incluse",
  "Support pédagogique complet",
]

const modules = [
  {
    title: "Introduction au BIM",
    topics: ["Définition et concepts", "Historique et évolution", "Niveaux de maturité BIM"],
  },
  {
    title: "Standards et normes",
    topics: ["ISO 19650", "IFC et openBIM", "Niveaux de détail (LOD)"],
  },
  {
    title: "Processus BIM",
    topics: ["Cycle de vie du projet", "Rôles et responsabilités", "Collaboration et coordination"],
  },
  {
    title: "Outils et technologies",
    topics: ["Logiciels BIM", "Environnement de données commun (CDE)", "Interopérabilité"],
  },
]

export default function BIMFoundationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Award className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Certification Internationale</span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">BIM Foundations Professional</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Certification officielle BuildingSmart validant vos compétences fondamentales en BIM, reconnue
            internationalement.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge className="bg-primary/10 text-primary border-0">
                  <Globe className="h-3 w-3 mr-1" />
                  BuildingSmart International
                </Badge>
                <Badge className="bg-primary/10 text-primary border-0">
                  <FileCheck className="h-3 w-3 mr-1" />
                  Certification Officielle
                </Badge>
              </div>

              <h2 className="font-sans text-2xl font-bold text-foreground mb-4">À propos de la certification</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                La certification BIM Foundations Professional de BuildingSmart International est la référence mondiale
                pour valider les compétences fondamentales en BIM. Elle atteste de votre maîtrise des concepts openBIM
                et vous ouvre les portes de l'industrie de la construction numérique.
              </p>

              <h3 className="font-sans text-xl font-bold text-foreground mb-4">Points clés</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-8">
                {highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-sans text-xl font-bold text-foreground mb-4">Programme</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {modules.map((module, idx) => (
                  <div key={idx} className="bg-secondary rounded-xl p-6">
                    <h4 className="font-semibold text-foreground mb-3">{module.title}</h4>
                    <ul className="space-y-2">
                      {module.topics.map((topic, tidx) => (
                        <li key={tidx} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="bg-secondary rounded-2xl p-6 sticky top-24">
                <h3 className="font-sans text-lg font-bold text-foreground mb-6">Informations pratiques</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Durée
                    </span>
                    <span className="font-medium text-foreground">2-3 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" /> Format
                    </span>
                    <span className="font-medium text-foreground">Présentiel ou en ligne</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Award className="h-4 w-4" /> Niveau
                    </span>
                    <span className="font-medium text-foreground">Fondamental</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Globe className="h-4 w-4" /> Validité
                    </span>
                    <span className="font-medium text-foreground">Internationale</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white">
                    <Link href="/contact">
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-primary text-primary bg-transparent">
                    <Link href="/contact">Demander un devis entreprise</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
