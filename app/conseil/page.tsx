import type { Metadata } from "next";
import { ConseilServicesSection } from "@/components/conseil/services-section";
import { ConseilCta } from "@/components/conseil/conseil-cta";

export const metadata: Metadata = {
  title: "Conseil & Transformation | Welearn",
  description:
    "Accompagnement stratégique et transformation digitale pour les entreprises du secteur de la Construction.",
};

export default function ConseilPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Accompagnement stratégique
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Conseil & Transformation
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Accompagnement stratégique et transformation digitale pour accélérer
            la performance de votre organisation.
          </p>
        </div>
      </section>

      <ConseilServicesSection />
      <ConseilCta />
    </>
  );
}
