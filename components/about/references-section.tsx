const referencesData = [
  {
    category: "Industriel",
    partners: [
      { name: "LafargeHolcim Maroc", logo: "/logos/lafargeholcim-maroc.png" },
      { name: "CIMAT (Ciments de l'Atlas)", logo: "/logos/cimat.png" },
      { name: "APC", logo: "/logos/apc.png" },
      { name: "Doka", logo: "/logos/doka.png" },
      { name: "Bitulife", logo: "/logos/bitulife.png" },
      { name: "Jika", logo: "/logos/jika.png" },
      { name: "A.M.B.P.E", logo: "/logos/ambpe.png" },
      { name: "Saint-Gobain", logo: "/logos/saint-gobain.png" },
    ],
  },
  {
    category: "Maîtrise d'œuvre",
    partners: [
      {
        name: "CNOA (Conseil National de l'Ordre des Architectes)",
        logo: "/logos/cnoa.png",
      },
      { name: "ONIGT", logo: "/logos/onigt.png" },
      { name: "FédEC", logo: "/logos/fedec.png" },
      { name: "SOCOTEC", logo: "/logos/socotec.png" },
      { name: "BUTEC", logo: "/logos/butec.png" },
      {
        name: "CASAVIGILANCE Sécurité Incendie",
        logo: "/logos/casavigilance.png",
      },
      { name: "SATA AFRIQUE", logo: "/logos/sata-afrique.png" },
    ],
  },
  {
    category: "Entreprise",
    partners: [
      { name: "FNPI", logo: "/logos/fnpi.png" },
      { name: "SOGERA (une société de VINCI)", logo: "/logos/sogera.png" },
      {
        name: "Menasteel Construction Métallique",
        logo: "/logos/menasteel.png",
      },
      { name: "TGCC (Construisons Ensemble)", logo: "/logos/tgcc.png" },
      { name: "Cegelec", logo: "/logos/cegelec.png" },
      { name: "BATE International", logo: "/logos/bate-international.png" },
    ],
  },
  {
    category: "Maîtrise d'ouvrage",
    partners: [
      { name: "ANEP", logo: "/logos/anep.png" },
      { name: "Chaabi lil Iskane", logo: "/logos/chaabi-lil-iskane.png" },
      { name: "CGI", logo: "/logos/cgi.png" },
      {
        name: "السعودية المغربية للاستثمار (ASMA INVEST)",
        logo: "/logos/asma-invest.png",
      },
      { name: "EWANE ASSETS", logo: "/logos/ewane-assets.png" },
      { name: "OFPPT", logo: "/logos/ofppt.png" },
      { name: "MAC (Africa)", logo: "/logos/mac-africa.png" },
      {
        name: "buildingSMART Morocco",
        logo: "/logos/buildingsmart-morocco.png",
      },
    ],
  },
  {
    category: "Financement",
    partners: [
      { name: "Société Générale", logo: "/logos/societe-generale.png" },
      { name: "Wafa Immobilier", logo: "/logos/wafa-immobilier.png" },
      { name: "Bank Al-Maghrib", logo: "/logos/bank-al-maghrib.png" },
      {
        name: "Bank of Africa (BMCE Group)",
        logo: "/logos/bank-of-africa-bmce-group.png",
      },
      { name: "CIH Bank", logo: "/logos/cih-bank.png" },
      {
        name: "M.S.IN Société de Bourse",
        logo: "/logos/msin-societe-de-bourse.png",
      },
    ],
  },
  {
    category: "Assurance",
    partners: [
      {
        name: "AtlantaSanad Assurance",
        logo: "/logos/atlanta-sanad-assurance.png",
      },
      {
        name: "SAHAM Assurance (member of Sanlam group)",
        logo: "/logos/saham-assurance.png",
      },
    ],
  },
];

export function ReferencesSection() {
  return (
    <section id="references" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="mb-12 text-center font-sans text-4xl font-bold text-[#1a2e4a] md:text-5xl">
          Nos Références
        </h2>

        <div className="border-t border-[#e5e5e5]">
          {referencesData.map((group, groupIndex) => (
            <div
              key={group.category}
              className={`min-h-[90px] py-6 ${
                groupIndex !== referencesData.length - 1
                  ? "border-b border-[#e5e5e5]"
                  : ""
              }`}
            >
              <div className="flex flex-col gap-4 md:min-h-[90px] md:flex-row md:items-center md:gap-8">
                <h3 className="shrink-0 text-left text-[22px] font-bold text-[#1a2e4a] md:w-[180px]">
                  {group.category}:
                </h3>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:flex-1">
                  {group.partners.map((partner) => (
                    <img
                      key={partner.name}
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-[50px] w-auto object-contain"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
