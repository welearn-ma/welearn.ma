import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  Compass,
  FileSearch,
  GraduationCap,
  Handshake,
  Lightbulb,
  ListChecks,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Académie | Ingénierie | Welearn",
  description:
    "Concevez et déployez votre Académie de formation avec Welearn : stratégie, ingénierie pédagogique, déploiement et accompagnement opérationnel.",
};

const valuePoints = [
  "Structurer la montée en compétences de votre écosystème externe",
  "Diffuser les bonnes pratiques et renforcer votre expertise métier",
  "Soutenir votre image de marque et votre leadership technique",
  "Créer un levier durable de performance et de différenciation",
];

const offerBlocks = [
  {
    title: "Cadrage & analyse des besoins",
    icon: FileSearch,
    description:
      "Nous construisons une vision partagée, clarifions le périmètre de l'Académie et identifions les publics prioritaires.",
    bullets: [
      "Alignement de la vision et des attentes",
      "Identification du périmètre de l'Académie",
      "Identification du public cible",
      "Diagnostic terrain et analyse des dispositifs existants",
    ],
  },
  {
    title: "Planification stratégique",
    icon: Compass,
    description:
      "Nous définissons la stratégie globale, la feuille de route et les mécanismes de gouvernance et de pilotage.",
    bullets: [
      "Benchmark national et international",
      "Analyse stratégique",
      "Feuille de route",
      "Mécanismes de suivi et de pilotage",
    ],
  },
  {
    title: "Conception des parcours de formation",
    icon: GraduationCap,
    description:
      "Nous concevons un dispositif pédagogique concret, activable rapidement et aligné avec vos enjeux métier.",
    bullets: [
      "Catalogue de formation par public cible",
      "Fiches modules détaillées",
      "Définition des modalités pédagogiques",
      "Préparation du lancement opérationnel",
    ],
  },
  {
    title: "Déploiement & accompagnement",
    icon: Handshake,
    description:
      "Nous accompagnons vos équipes dans l'exécution, l'animation et l'amélioration continue du dispositif.",
    bullets: [
      "Plan de déploiement opérationnel",
      "Plan d'accompagnement et communication",
      "Déploiement des formations",
      "Optimisation continue selon les retours terrain",
    ],
  },
];

const expectedResults = [
  "Une Académie à forte valeur stratégique, ancrée dans votre expertise métier",
  "Un dispositif lisible, pilotable et évolutif dans le temps",
  "Une meilleure adoption des pratiques et standards sur le terrain",
  "Un impact mesurable sur la qualité, la performance et l'image de marque",
];

const deliverables = [
  "Diagnostic et cadrage de l'Académie",
  "Feuille de route stratégique et gouvernance",
  "Catalogue et architecture des parcours de formation",
  "Plan de déploiement et d'animation",
  "Plan d'accompagnement et de communication",
  "Cadre de pilotage (KPI, suivi, amélioration continue)",
];

const expertiseDomains = [
  "Matériaux",
  "Efficacité énergétique",
  "BIM",
  "Management des projets",
  "Immobilier",
  "Construction",
  "Leadership technique",
  "Formations intra-entreprise",
];

const contacts = [
  {
    name: "Hassan Jaji",
    role: "Directeur associé",
    email: "hassan.jaji@welearn.ma",
    phone: "+212 661 299 243",
  },
  {
    name: "Abdelkarim Kouider",
    role: "Directeur associé",
    email: "abdelghani.kouider@welearn.ma",
    phone: "+212 661 405 230",
  },
  {
    name: "Oumaima Dakir",
    role: "Directrice technique, PMP®",
    email: "oumaima.dakir@welearn.ma",
    phone: "+212 661 536 669",
  },
];

export default function AcademiePage() {
  return (
    <>
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-5xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Ingénierie
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Académie de formation
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Nous vous accompagnons de la stratégie au déploiement pour créer une
            Académie utile, pilotable et à fort impact sur votre écosystème.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
            >
              <Link href="/contact">
                Parler à un expert
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link href="#offre">Découvrir notre approche</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi ce dispositif"
            title="Une Académie qui sert vos objectifs business"
            description="L'Académie devient un levier concret de transformation, d'influence et de montée en compétences."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {valuePoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 bg-secondary rounded-xl p-5"
              >
                <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="offre" className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Notre offre"
            title="Un accompagnement de bout en bout"
            description="Une approche en 4 blocs pour passer d'une intention à un dispositif opérationnel."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerBlocks.map((block) => (
              <div key={block.title} className="bg-white rounded-2xl p-6">
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                  <block.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-sans font-bold text-foreground mb-2">
                  {block.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {block.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Livrables"
            title="Ce que vous obtenez à la fin de la mission"
            description="Des livrables directement exploitables par vos équipes métier et formation."
          />
          <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
            {deliverables.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-secondary p-4"
              >
                <ListChecks className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Méthodologie"
            title="Comment se déroule la mission"
            description="Chaque phase produit des décisions concrètes et prépare la suivante."
          />
          <div className="space-y-6">
            {offerBlocks.map((block) => (
              <div
                key={block.title}
                className="rounded-2xl border border-border p-8 bg-white"
              >
                <h3 className="font-sans text-2xl font-bold text-foreground mb-3">
                  {block.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  {block.description}
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {block.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Résultats attendus"
            title="Ce que votre Académie change concrètement"
            description="Un dispositif qui reste pertinent dans le temps et produit des effets mesurables."
          />
          <div className="space-y-4">
            {expectedResults.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-(--color-welearn-gold) mt-0.5 shrink-0" />
                <p className="text-white/90">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Pourquoi Welearn"
            title="Une équipe experte des enjeux formation du secteur Construction"
            description="Nous combinons conseil stratégique, ingénierie pédagogique et déploiement opérationnel."
          />
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Welearn est une EdTech reconnue comme Jeune Entreprise
                Innovante® en France et au Maroc, spécialisée dans la formation
                continue et l'ingénierie pédagogique pour l'écosystème de la
                construction.
              </p>
              <p>
                Nous développons des dispositifs de formation à forte valeur, en
                marque blanche ou en propre, notamment via des programmes
                Masters, certifications et parcours intra-entreprise.
              </p>
              <Button asChild variant="outline" className="bg-transparent">
                <Link href="/about">Découvrir Welearn</Link>
              </Button>
            </div>
            <div className="bg-secondary rounded-2xl p-6">
              <h3 className="font-sans text-xl font-bold text-foreground mb-4">
                Nos domaines d'expertise
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {expertiseDomains.map((domain) => (
                  <div key={domain} className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{domain}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-secondary">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <SectionHeader
            eyebrow="Contact"
            title="Équipe projet"
            description="Échangeons sur votre projet d'Académie."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {contacts.map((contact) => (
              <div key={contact.email} className="bg-white rounded-2xl p-6">
                <h3 className="font-sans text-lg font-bold text-foreground mb-1">
                  {contact.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {contact.role}
                </p>
                <p className="text-sm text-foreground">{contact.email}</p>
                <p className="text-sm text-foreground">{contact.phone}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Link href="/contact">
                Demander un accompagnement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
