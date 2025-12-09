import { SectionHeader } from "@/components/section-header";
import { LogoGrid } from "@/components/logo-grid";

const clients = [
  { name: "OCP", logo: "/ocp-corporate-logo.jpg" },
  { name: "ONCF", logo: "/oncf-railway-corporate-logo.jpg" },
  { name: "Addoha", logo: "/addoha-real-estate-logo.jpg" },
  { name: "Alliances", logo: "/alliances-construction-logo.jpg" },
  { name: "SGTM", logo: "/sgtm-construction-corporate-logo.jpg" },
  { name: "Jet Contractors", logo: "/jet-contractors-construction-logo.jpg" },
  { name: "LafargeHolcim", logo: "/lafargeholcim-cement-logo.jpg" },
  { name: "Sonasid", logo: "/sonasid-steel-corporate-logo.jpg" },
];

export function ReferencesSection() {
  return (
    <section id="references" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos clients"
          title="Nos Références"
          description="Des leaders du secteur de la Construction nous font confiance."
        />
        <LogoGrid logos={clients} />
      </div>
    </section>
  );
}
