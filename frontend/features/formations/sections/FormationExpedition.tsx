import Image from "next/image";
import type { ExpeditionBlock } from "@/types/formation-page";
import { Plane } from "lucide-react";

type Props = {
  expedition: ExpeditionBlock;
};

export function FormationExpedition({ expedition }: Props) {
  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="overflow-hidden rounded-2xl border border-wl-border">
          {/* Bandeau image */}
          <div className="relative h-72 md:h-96">
            <Image
              src={expedition.image}
              alt={expedition.imageAlt}
              fill
              sizes="(min-width: 1200px) 1200px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-wl-orange">
                <Plane className="h-4 w-4" />
                {expedition.eyebrow}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {expedition.title}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {expedition.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contenu */}
          <div className="grid gap-10 p-6 md:grid-cols-2 md:p-10">
            {expedition.sections.map((s) => (
              <div key={s.heading}>
                <h3 className="mb-4 text-lg font-bold leading-snug text-wl-blue">
                  {s.heading}
                </h3>
                <div className="space-y-3 text-sm leading-relaxed text-wl-text-secondary">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bénéfices */}
          <div className="border-t border-wl-border bg-wl-orange-tint p-6 md:p-10">
            <h3 className="mb-8 text-xs font-semibold uppercase tracking-widest text-wl-orange">
              {expedition.benefitsTitle}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {expedition.benefits.map((b) => (
                <div key={b.title} className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-wl-blue">
                    <b.icon className="h-6 w-6" />
                  </div>
                  <p className="mb-1 font-semibold uppercase tracking-wide text-wl-text">
                    {b.title}
                  </p>
                  <p className="text-sm leading-relaxed text-wl-text-secondary">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
