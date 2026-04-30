import Image from "next/image";
import { SectionHeader } from "@/components/section-header";

const partnerRows = [
  {
    label: "Partenaires académiques",
    logos: [
      { name: "EHTP", src: "/partners/ehtp.webp" },
      { name: "ESLSCA", src: "/partners/ESLSCA-Business-School-Rabat.webp" },
      { name: "Ecole Centrale Casablanca", src: "/partners/ecole-centrale-casablanca.webp" },
      { name: "ACCA", src: "/partners/Logo-acca.svg.webp" },
    ],
  },
  {
    label: "Partenaires institutionnels",
    logos: [
      { name: "ANEP", src: "/partners/anep.webp" },
      { name: "CNOA", src: "/partners/cnoa.webp" },
      { name: "ONIGT", src: "/partners/onigt.webp" },
      { name: "FedEC", src: "/partners/fedec.webp" },
      { name: "OFPPT", src: "/partners/ofppt.webp" },
      { name: "FNPI", src: "/partners/fnpi.webp" },
      { name: "buildingSMART Morocco", src: "/partners/buildingsmart-morocco.webp" },
    ],
  },
  {
    label: "Clients industriels",
    logos: [
      { name: "LafargeHolcim", src: "/partners/lafargeholcim-maroc.webp" },
      { name: "CIMAT", src: "/partners/cimat.webp" },
      { name: "Saint Gobain", src: "/partners/saint-gobain.webp" },
      { name: "Doka", src: "/partners/doka.webp" },
      { name: "Bitulife", src: "/partners/bitulife.webp" },
      { name: "APC", src: "/partners/apc.webp" },
      { name: "SATA Afrique", src: "/partners/sata-afrique.webp" },
    ],
  },
  {
    label: "Entreprises & MOE",
    logos: [
      { name: "TGCC", src: "/partners/tgcc.webp" },
      { name: "SOGEA Maroc", src: "/partners/sogea%20maroc.webp" },
      { name: "Menasteel", src: "/partners/menasteel.webp" },
      { name: "Cegelec", src: "/partners/cegelec.webp" },
      { name: "Socotec", src: "/partners/socotec.webp" },
      { name: "BUTEC", src: "/partners/butec.webp" },
    ],
  },
  {
    label: "Maîtrise d'ouvrage",
    logos: [
      { name: "CGI", src: "/partners/cgi.webp" },
      { name: "Chaabi Lil Iskane", src: "/partners/chaabi-lil-iskane.webp" },
      { name: "Ewane Assets", src: "/partners/ewane-assets.webp" },
      { name: "ASMA Invest", src: "/partners/asma-invest.webp" },
      { name: "Wafa Immobilier", src: "/partners/wafa-immobilier.webp" },
      { name: "CDG", src: "/partners/1200px-CDG.svg.webp" },
    ],
  },
  {
    label: "Financement & Assurance",
    logos: [
      { name: "Societe Generale", src: "/partners/societe-generale.webp" },
      { name: "CIH Bank", src: "/partners/cih-bank.webp" },
      { name: "Bank of Africa", src: "/partners/bank-of-africa-bmce-group.webp" },
      { name: "Bank Al-Maghrib", src: "/partners/bank-al-maghrib.webp" },
      { name: "Atlanta Sanad", src: "/partners/atlanta-sanad-assurance.webp" },
      { name: "SAHAM Assurance", src: "/partners/saham-assurance.webp" },
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

        <div className="mt-12 overflow-hidden rounded-2xl border border-wl-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <table className="w-full border-collapse">
            <tbody>
              {partnerRows.map((row, index) => (
                <tr key={row.label} className="border-b border-wl-border last:border-b-0">
                  <th
                    scope="row"
                    className="w-56 align-top border-r border-wl-border bg-wl-gray-light/70 px-5 py-6 text-left text-xs font-semibold uppercase tracking-[0.08em] text-wl-text"
                  >
                    {row.label}
                  </th>
                  <td className="px-4 py-4 sm:px-6 sm:py-5">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {row.logos.map((logo) => (
                        <div
                          key={`${row.label}-${logo.name}`}
                          className="flex min-h-[76px] items-center justify-center rounded-lg border border-wl-border bg-white px-4 py-3 transition-transform duration-200 hover:-translate-y-0.5"
                        >
                          <Image
                            src={logo.src}
                            alt={logo.name}
                            width={150}
                            height={64}
                            className="h-11 w-auto object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
