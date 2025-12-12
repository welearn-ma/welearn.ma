"use client";

import Image from "next/image";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { SectionHeader } from "@/components/section-header";

const partners = [
  { name: "000520684", logo: "/partners/000520684_image_600x315.webp" },
  { name: "CDG", logo: "/partners/1200px-CDG.svg.webp" },
  {
    name: "Leica Geosystems",
    logo: "/partners/1200px-Leica_Geosystems.svg.webp",
  },
  { name: "1576078248", logo: "/partners/1576078248.webp" },
  { name: "157bd83c", logo: "/partners/157bd83c288036c15b25378f3d8a8465.webp" },
  { name: "1635240202439", logo: "/partners/1635240202439.webp" },
  { name: "Attic", logo: "/partners/1846-attic-2-68-1570520114.webp" },
  { name: "Socotec", logo: "/partners/20171026154534!SOCOTEC-LOGO.webp" },
  { name: "Active 3D", logo: "/partners/662-active-3d-3-1502270075.webp" },
  { name: "AFNOR", logo: "/partners/afnor-logo.webp" },
  { name: "AMBC", logo: "/partners/ambc.webp" },
  { name: "ANEP", logo: "/partners/anep%20png_Plan%20de%20travail%201.webp" },
  { name: "Autodesk", logo: "/partners/AutoCAD-Logo-1024x576.webp" },
  {
    name: "Conseil Provincial Errachidia",
    logo: "/partners/conseil%20provincial%20errachidia%20logo.webp",
  },
  { name: "CYPE", logo: "/partners/CYPE_plano.webp" },
  { name: "Eco-Cité Zenata", logo: "/partners/Eco-Cite-Zenata-CDG.webp" },
  {
    name: "École Centrale Casablanca",
    logo: "/partners/ecole-centrale-casablanca.webp",
  },
  { name: "EHTP", logo: "/partners/ehtp.webp" },
  { name: "ESLSCA", logo: "/partners/ESLSCA-Business-School-Rabat.webp" },
  { name: "CNOA", logo: "/partners/logo%20cnoa%20trait%C3%A9.webp" },
  { name: "Ewane", logo: "/partners/logo%20ewane.webp" },
  { name: "OFPPT", logo: "/partners/Logo%20OFPPT%20VF%20NV.webp" },
  { name: "ACCA", logo: "/partners/Logo-acca.svg.webp" },
  { name: "BIM", logo: "/partners/logo-bim.webp" },
  { name: "BNP", logo: "/partners/logo-bnp-01.webp" },
  { name: "COM", logo: "/partners/logo-com.webp" },
  {
    name: "Labeo",
    logo: "/partners/logo-labeo-logiciel-gestion-patrimoine-immobilier-bas-abyla-flat-160x86.webp",
  },
  { name: "Longueur", logo: "/partners/logo-longueur-d%C3%A9tour%C3%A9.webp" },
  { name: "PMI", logo: "/partners/Logo-PMI-png.webp" },
  { name: "Logo2", logo: "/partners/logo2.webp" },
  { name: "Mojazine", logo: "/partners/LogoMojazine.webp" },
  { name: "ImmoTech", logo: "/partners/logo_immotech-2.webp" },
  { name: "Robobat", logo: "/partners/logo_robobat_copie.webp" },
  { name: "Mafoder", logo: "/partners/mafoder%20prefa.webp" },
  { name: "MS", logo: "/partners/MS_RVB-2.webp" },
  { name: "OCP", logo: "/partners/OCP_Group.svg.webp" },
  { name: "Revit", logo: "/partners/Revit_2017_logo.webp" },
  { name: "Sogea Maroc", logo: "/partners/sogea%20maroc.webp" },
  { name: "Strugal", logo: "/partners/strugal%20aludoors.webp" },
  { name: "Toastmasters", logo: "/partners/toastmasters-logo-color-png.webp" },
  {
    name: "Telechargement 1",
    logo: "/partners/t%C3%A9l%C3%A9chargement%20(1).webp",
  },
];

export function PartnersSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Nos partenaires"
          title="Ils nous font confiance"
          description="Welearn collabore avec les institutions et entreprises leaders du secteur Construction."
        />

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {partners.map((partner, index) => (
                <div
                  key={`${partner.name}-${index}`}
                  className="basis-[20%] flex-[0_0_20%] px-2 sm:px-3"
                >
                  <div className="flex h-20 sm:h-24 md:h-28 items-center justify-center rounded-xl border border-border bg-white shadow-sm">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      width={240}
                      height={140}
                      className="h-full w-full object-contain"
                      priority={index < 5}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:bg-secondary"
              aria-label="Précédent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white shadow-sm transition hover:bg-secondary"
              aria-label="Suivant"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
