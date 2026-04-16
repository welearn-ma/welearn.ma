"use client";

import { useState } from "react";
import { PageHero } from "@/components/page-hero";
import { ContactFormSection } from "@/components/contact/contact-form-section";
import { CorporateContactCta } from "@/components/contact/corporate-contact-cta";
import { ContactInfoSection } from "@/components/contact/contact-info-section";
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
    <div className="border-b border-wl-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-wl-blue"
      >
        <span className="pr-4 font-medium text-wl-text">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-wl-blue transition-transform",
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
        <p className="text-wl-text-secondary">{answer}</p>
      </div>
    </div>
  );
}
export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        description="Une question sur nos formations ? Un projet de formation corporate ? Notre équipe est à votre écoute."
        eyebrow="Parlons de votre projet"
        size="lg"
      />

      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-wl-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <ContactFormSection />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-linear-to-br from-wl-blue to-wl-blue-dark">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/2 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-4 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-wl-highlight mb-4">
              FAQ
            </p>
            <h2 className="font-sans text-4xl md:text-5xl font-bold text-white mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-white/80">
              Retrouvez les réponses aux questions les plus posées sur nos
              formations et services.
            </p>
          </div>

          <div className="space-y-12">
            {faqCategories.map((category) => (
              <div key={category.name}>
                <h2 className="font-sans text-2xl font-bold text-wl-highlight mb-6">
                  {category.name}
                </h2>
                <div className="rounded-xl border border-white/15 bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
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
