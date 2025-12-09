import { SectionHeader } from "@/components/section-header";
import { TeamGrid } from "@/components/team-grid";

const team = [
  {
    name: "Mohamed Alami",
    role: "Fondateur & CEO",
    bio: "Expert en transformation digitale du secteur BTP avec plus de 15 ans d'expérience.",
    image: "/ceo-portrait.png",
  },
  {
    name: "Sarah Bennis",
    role: "Directrice Pédagogique",
    bio: "Spécialiste en ingénierie de formation et développement des compétences.",
    image: "/professional-woman-director.png",
  },
  {
    name: "Karim Tazi",
    role: "Directeur BIM",
    bio: "Expert BIM certifié BuildingSmart, coordinateur de projets complexes.",
    image: "/professional-man-bim-expert-portrait.jpg",
  },
  {
    name: "Fatima Zahra El Ouafi",
    role: "Responsable Digital Learning",
    bio: "Experte en conception de contenus e-learning et plateformes LMS.",
    image: "/professional-woman-digital-learning-portrait.jpg",
  },
  {
    name: "Youssef Amrani",
    role: "Directeur Commercial",
    bio: "Développement des partenariats et relations entreprises.",
    image: "/professional-sales-director.png",
  },
  {
    name: "Nadia Berrada",
    role: "Responsable Relations Académiques",
    bio: "Coordination des partenariats avec les grandes écoles et universités.",
    image: "/professional-woman-academic-portrait.jpg",
  },
];

export function TeamSection() {
  return (
    <section id="equipe" className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeader
          eyebrow="Les experts"
          title="Notre Équipe"
          description="Des experts passionnés au service de votre développement professionnel."
        />
        <TeamGrid members={team} />
      </div>
    </section>
  );
}
