import Image from "next/image";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center flex-col py-20">
      <Image
        src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
        alt="Construction aerial view"
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-wl-blue/80" />
      <div className="relative mx-auto max-w-[1200px] px-6 text-center">
        <p className="text-s font-semibold uppercase tracking-widest text-wl-orange mb-4">
          À PROPOS DE WELEARN
        </p>
        <h1 className="font-sans text-5xl md:text-5xl font-bold text-white mb-5 text-balance leading-tight">
          D'une conviction à un écosystème
        </h1>
        <p className="text-xl text-white/75 leading-relaxed max-w-xl mx-auto">
          Welearn est la plateforme EdTech de référence dédiée à la
          construction, l'infrastructure et l'immobilier — construite sur une
          conviction : la compétence est le moteur du progrès.
        </p>
      </div>
    </section>
  );
}
