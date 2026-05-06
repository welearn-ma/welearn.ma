import type { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageHero } from "@/components/page-hero";
import { DiplomantesCataloguePage } from "@/components/formations/diplomantes-catalogue-page/diplomantes-catalogue-page";

export const metadata: Metadata = {
  title: "Masters & Licences Professionnelles | Welearn",
  description:
    "Explorez nos Executive Masters et Licences Professionnelles accrédités en partenariat avec les grandes écoles d'ingénieurs.",
};

export default function DiplomantesPage() {
  return (
    <>
      <Breadcrumb />
      <PageHero
        title="Programmes Diplômants"
        description="Executive Masters et Licences Professionnelles accrédités, en partenariat avec les grandes écoles d'ingénieurs et universités."
        eyebrow="Formations Diplômantes"
        size="sm"
      />

      <DiplomantesCataloguePage />
    </>
  );
}
