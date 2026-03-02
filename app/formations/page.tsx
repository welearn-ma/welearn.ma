import type { Metadata } from "next";
import { StatsSection } from "@/components/formations/stats-section";
import { CategoriesSection } from "@/components/formations/categories-section";
import { FormationsCta } from "@/components/formations/formations-cta";

export const metadata: Metadata = {
  title: "Formations | Welearn",
  description:
    "Découvrez notre catalogue de formations diplômantes et certifiantes dans le BTP, BIM et management de projet.",
};

export default function FormationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Catalogue de formations
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Nos Formations
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Des programmes adaptés à tous les profils : formations diplômantes,
            certifiantes et sur mesure pour le secteur de la Construction.
          </p>
        </div>
      </section>

      <StatsSection />
      <CategoriesSection />
      <FormationsCta />
    </>
  );
}
