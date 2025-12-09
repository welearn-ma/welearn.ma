import { SectionHeader } from "@/components/section-header"

const partners = [
  { name: "EHTP", category: "École" },
  { name: "ESLSCA", category: "École" },
  { name: "BuildingSmart", category: "Certification" },
  { name: "CGE", category: "Accréditation" },
  { name: "SAHAM", category: "Assurance" },
  { name: "FEDEC", category: "Fédération" },
]

export function PartnersSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos partenaires"
          title="Ils nous font confiance"
          description="Welearn collabore avec les institutions et entreprises leaders du secteur Construction."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 bg-secondary rounded-xl hover:bg-primary/5 transition-colors"
            >
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <span className="font-heading font-bold text-primary text-lg">{partner.name.slice(0, 2)}</span>
              </div>
              <span className="font-medium text-foreground text-center">{partner.name}</span>
              <span className="text-xs text-muted-foreground">{partner.category}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
