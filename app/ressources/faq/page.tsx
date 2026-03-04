"use client";

import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    name: "Formations",
    questions: [
      {
        q: "Quels sont les prérequis pour intégrer un Executive Master ?",
        a: "Les Executive Masters s'adressent aux professionnels justifiant d'au moins 3 ans d'expérience dans le secteur concerné. Un dossier de candidature et un entretien de motivation sont requis.",
      },
      {
        q: "Les formations sont-elles éligibles au CPF ?",
        a: "Oui, la majorité de nos formations certifiantes et diplômantes sont éligibles au Compte Personnel de Formation. Contactez-nous pour vérifier l'éligibilité de la formation qui vous intéresse.",
      },
      {
        q: "Quelle est la durée des formations ?",
        a: "La durée varie selon le type de formation : de 2 jours pour les formations courtes, à 18 mois pour les Executive Masters. Les formats sont adaptés aux contraintes des professionnels en activité.",
      },
    ],
  },
  {
    name: "Modalités",
    questions: [
      {
        q: "Comment se déroulent les formations en blended learning ?",
        a: "Le blended learning combine des modules e-learning accessibles sur notre plateforme LMS et des sessions présentielles. Cette approche permet de concilier flexibilité et interactions avec les formateurs.",
      },
      {
        q: "Où se déroulent les formations présentielles ?",
        a: "Nos formations présentielles se déroulent principalement à Casablanca. Pour les formations intra-entreprise, nous pouvons intervenir dans vos locaux partout au Maroc.",
      },
      {
        q: "Peut-on suivre les formations à distance ?",
        a: "Oui, de nombreuses formations sont disponibles en format 100% distanciel ou hybride. Notre plateforme LMS permet un suivi complet à distance avec des classes virtuelles interactives.",
      },
    ],
  },
  {
    name: "Entreprises",
    questions: [
      {
        q: "Comment mettre en place une formation intra-entreprise ?",
        a: "Contactez notre équipe commerciale pour définir vos besoins. Nous concevons des programmes sur-mesure adaptés à votre contexte, vos objectifs et vos contraintes.",
      },
      {
        q: "Proposez-vous des tarifs groupés ?",
        a: "Oui, nous proposons des tarifs dégressifs pour les inscriptions groupées et des offres spécifiques pour les entreprises souhaitant former plusieurs collaborateurs.",
      },
      {
        q: "Pouvez-vous créer une académie corporate ?",
        a: "Absolument. Notre expertise en ingénierie de formation nous permet de concevoir et déployer des académies internes complètes : diagnostic, conception pédagogique, plateforme LMS, animation et évaluation.",
      },
    ],
  },
  {
    name: "Certifications",
    questions: [
      {
        q: "Quelles certifications délivrez-vous ?",
        a: "Nous délivrons des certifications reconnues par l'État et les branches professionnelles, ainsi que des certifications propriétaires validant les compétences acquises dans nos parcours.",
      },
      {
        q: "Comment se déroulent les examens de certification ?",
        a: "Les modalités d'évaluation varient selon les certifications : études de cas, soutenances de projets, examens écrits ou QCM. Les détails sont communiqués en début de formation.",
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <span className="font-medium text-foreground pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-primary shrink-0 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-96 pb-5" : "max-h-0",
        )}
      >
        <p className="text-muted-foreground">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        description="Retrouvez les réponses aux questions les plus fréquemment posées sur nos formations et services."
        eyebrow="Questions fréquentes"
        size="lg"
      />

      {/* FAQ Content */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.name}>
                <h2 className="font-sans text-2xl font-bold text-foreground mb-6">
                  {category.name}
                </h2>
                <div className="bg-secondary rounded-xl p-6">
                  {category.questions.map((item, index) => (
                    <FAQItem key={index} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
