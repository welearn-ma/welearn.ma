import Image from "next/image";

const instances = [
  {
    logo: "/instances/welearn_institute.png",
    name: "Welearn Institute",
    description: `Promeut la formation dans ses différents formats et durées :
Mastères Spécialisé, e-learning, formation courte et longue durée, MOOC, etc.`,
  },
  {
    logo: "/instances/welearn_together.png",
    name: "Welearn Together",
    description:
      "Une plateforme d'échange digitale et physique, où les acteurs du secteur du bâti et secteurs annexes se réunissent et partagent leurs connaissances.",
  },
  {
    logo: "/instances/welearn_initiatives.png",
    name: "Welearn Initiatives",
    description:
      "Crée et développe des supports, des outils et des événements en vue de valoriser et ancrer la connaissance et le savoir-faire.",
  },
];

export function InstancesSection() {
  return (
    <section className="bg-white border-b border-wl-border">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-wl-border">
          {instances.map((instance) => (
            <div
              key={instance.name}
              className="flex flex-col items-center text-center px-8 py-10"
            >
              <div className="w-full relative aspect-video mb-4">
                <Image
                  src={instance.logo}
                  alt={instance.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-wl-text-secondary leading-relaxed">
                {instance.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
