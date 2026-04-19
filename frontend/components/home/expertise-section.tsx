"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, Monitor, Building2 } from "lucide-react";

const savoirFaireItems = [
  {
    icon: BookOpen,
    title: "Ingénierie de formation",
    description:
      "Analyse des besoins, cartographie des compétences, conception de programmes sur mesure, évaluation d'impact.",
  },
  {
    icon: Layers,
    title: "Ingénierie pédagogique & Scénarisation",
    description:
      "Transformation de contenus en expériences engageantes : storyboards, gamification, mises en situation, évaluations progressives.",
  },
  {
    icon: Monitor,
    title: "Digital Learning & Production",
    description:
      "MOOCs, micro-learning, motion design, voix-off multilingues (FR, AR, EN), VR, vidéos 3D. Sur welearn.ac ou en marque blanche.",
  },
  {
    icon: Building2,
    title: "Académies d'entreprise",
    description:
      "Création d'académies internes : parcours, plateforme, contenus, partenariats académiques, déploiement à grande échelle.",
  },
];

const expertiseTerrainRows = [
  {
    category: "BIM & Digitalisation",
    tags: [
      "BIM Management",
      "BIM Foundations (buildingSMART)",
      "Coordination BIM",
      "Modélisation",
      "BIM MOA/MOE",
    ],
  },
  {
    category: "Construction & Matériaux",
    tags: [
      "Béton",
      "Étanchéité & Isolation",
      "Pathologies du bâtiment",
      "Sécurité incendie",
      "Construction durable",
      "Parasismique",
    ],
  },
  {
    category: "Immobilier",
    tags: [
      "Asset Management",
      "Facility Management",
      "Investissement",
      "Droit immobilier",
      "VEFA",
      "Expertise et évaluation",
    ],
  },
  {
    category: "IA & Innovation",
    tags: [
      "IA pour la construction",
      "IA pour l'immobilier",
      "Apprentissage augmenté par l'IA",
    ],
  },
  {
    category: "Management",
    tags: [
      "Management de projets",
      "Leadership",
      "Soft skills",
      "RH",
      "Marketing & Commercial",
    ],
  },
];

type Tab = "savoir-faire" | "terrain";

export function ExpertiseSection() {
  const [activeTab, setActiveTab] = useState<Tab>("savoir-faire");
  const [visible, setVisible] = useState(true);

  const switchTab = (tab: Tab) => {
    if (tab === activeTab) return;
    setVisible(false);
    setTimeout(() => {
      setActiveTab(tab);
      setVisible(true);
    }, 150);
  };

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-[1000px] px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-wl-orange mb-3">
            Notre double expertise
          </p>
          <h2 className="font-sans text-3xl md:text-4xl font-bold text-wl-text mb-5 text-balance leading-tight">
            L'expertise métier & l'expertise pédagogique — c'est notre double
            force
          </h2>
          <p className="text-lg text-wl-text-secondary leading-relaxed max-w-2xl mx-auto">
            Beaucoup savent former. Peu connaissent votre métier. Welearn réunit
            les deux : une maîtrise approfondie de l'ingénierie de formation et
            du digital learning, combinée à une expertise terrain dans la
            construction et l'immobilier.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-wl-gray-light rounded-xl p-1.5 gap-1">
            <button
              type="button"
              onClick={() => switchTab("savoir-faire")}
              className={`min-w-[200px] px-6 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                activeTab === "savoir-faire"
                  ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-wl-blue font-semibold"
                  : "bg-transparent text-wl-text-secondary font-medium"
              }`}
            >
              Savoir-faire
            </button>
            <button
              type="button"
              onClick={() => switchTab("terrain")}
              className={`min-w-[200px] px-6 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                activeTab === "terrain"
                  ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] text-wl-blue font-semibold"
                  : "bg-transparent text-wl-text-secondary font-medium"
              }`}
            >
              Expertise terrain
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div
          className={`transition-all duration-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          }`}
        >
          {activeTab === "savoir-faire" ? (
            <div className="grid sm:grid-cols-2 gap-5">
              {savoirFaireItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-wl-border rounded-xl p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="h-12 w-12 rounded-xl bg-wl-blue-tint flex items-center justify-center mb-4 shrink-0">
                      <Icon className="h-5 w-5 text-wl-blue" />
                    </div>
                    <h3 className="text-[17px] font-semibold text-wl-text mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-wl-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-wl-border bg-white overflow-hidden">
              {expertiseTerrainRows.map((row, idx) => (
                <div
                  key={idx}
                  className={`px-7 py-5 flex flex-col sm:flex-row sm:items-start gap-4 ${
                    idx < expertiseTerrainRows.length - 1
                      ? "border-b border-wl-border"
                      : ""
                  }`}
                >
                  <div className="sm:w-[200px] shrink-0">
                    <span className="text-[13px] font-bold uppercase tracking-[0.08em] text-shadow-wl-blue-dark">
                      {row.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.tags.map((tag, tagIdx) => (
                      <span
                        key={tagIdx}
                        className="inline-block px-3 py-1 text-[13px] text-wl-text-secondary bg-wl-gray-light border border-wl-border rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Closing line + CTA */}
        <div className="mt-12 text-center">
          <p className="text-[15px] italic text-wl-text-secondary max-w-[700px] mx-auto mb-6 leading-relaxed">
            C'est parce que nous maîtrisons à la fois l'art de former et la
            réalité de vos métiers que nos programmes produisent un impact
            concret sur le terrain.
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-wl-blue text-wl-blue hover:bg-wl-blue hover:text-white bg-transparent transition-all duration-200"
          >
            <Link href="/formations">Voir tout le catalogue de formations</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
