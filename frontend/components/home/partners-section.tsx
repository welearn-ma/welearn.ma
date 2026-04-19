import { SectionHeader } from "@/components/section-header";

const partnerGroups = [
  {
    label: "Partenaires académiques",
    partners: ["EHTP", "ESLSCA (Groupe Planeta Université)"],
  },
  {
    label: "Partenaires institutionnels",
    partners: ["ANEP", "CNOA", "ONIGT", "FédEC", "OFPPT", "FNPI", "buildingSMART Morocco"],
  },
  {
    label: "Clients industriels",
    partners: [
      "LafargeHolcim",
      "Ciments de l'Atlas",
      "Sika",
      "Saint-Gobain",
      "Doka",
      "Bitulife",
      "APC",
    ],
  },
  {
    label: "Entreprises & MOE",
    partners: ["TGCC", "Vinci (SOGEA Maroc)", "Menasteel", "Cegelec", "Socotec", "BUTEC"],
  },
  {
    label: "Maîtrise d'ouvrage",
    partners: ["CGI", "ANEP", "Chaabi Lil Iskane", "Ewane Assets", "ASMA Invest"],
  },
  {
    label: "Financement & Assurance",
    partners: [
      "Société Générale",
      "CIH Bank",
      "Bank of Africa",
      "Bank Al-Maghrib",
      "AtlantaSanad",
      "SAHAM Assurance",
    ],
  },
];

export function PartnersSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Écosystème & confiance"
          title="Un écosystème unique au service de la construction"
          description="Welearn ne se limite pas à la formation. Nous construisons des ponts entre l'industrie, le monde académique, les institutions et les professionnels de terrain."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {partnerGroups.map((group, index) => (
            <div
              key={index}
              className="rounded-xl border border-wl-border bg-white p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2.5 w-2.5 rounded-full shrink-0 bg-wl-blue" />
                <h3 className="font-semibold text-wl-text text-sm uppercase tracking-wide">
                  {group.label}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.partners.map((partner, partnerIdx) => (
                  <span
                    key={partnerIdx}
                    className="inline-block px-3 py-1 text-xs font-medium text-wl-text-secondary bg-wl-gray-light rounded-full border border-wl-border"
                  >
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
