import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { DiplomantesProgramsSection } from "@/components/formations/diplomantes-programs-section";

export const metadata: Metadata = {
  title: "Formations Diplômantes | Welearn",
  description:
    "Executive Masters et Licences Professionnelles en partenariat avec les grandes écoles.",
};

export default function DiplomantesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
            <GraduationCap className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Formations Diplômantes
            </span>
          </div>
          <h1 className="font-sans text-4xl md:text-5xl font-bold text-white mb-6">
            Masters & Licences Professionnelles
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Des programmes accrédités en partenariat avec les grandes écoles
            d'ingénieurs et universités.
          </p>
        </div>
      </section>

      <DiplomantesProgramsSection />
    </>
  );
}
