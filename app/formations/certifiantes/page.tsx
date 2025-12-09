import type { Metadata } from "next";
import { Award } from "lucide-react";
import { CertifiantesSections } from "@/components/formations/certifiantes-sections";
import { EntrepriseCta } from "@/components/formations/entreprise-cta";

export const metadata: Metadata = {
  title: "Formations Certifiantes | Welearn",
  description:
    "Certifications professionnelles BIM et formations sur mesure pour les entreprises.",
};

export default function CertifiantesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <Award className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Formations Certifiantes
            </span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">
            Certifications & Formations Intra
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Certifications internationales et formations sur mesure pour
            développer les compétences de vos équipes.
          </p>
        </div>
      </section>

      <CertifiantesSections />
      <EntrepriseCta />
    </>
  );
}
