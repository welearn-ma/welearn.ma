import type { ExpeditionBlock } from "@/types/formation-page";
import { Plane } from "lucide-react";

type Props = {
  expedition: ExpeditionBlock;
};

export function FormationExpedition({ expedition }: Props) {
  return (
    <section className="bg-white pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="rounded-xl border-2 border-wl-orange bg-wl-orange-tint p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-wl-orange text-white">
              <Plane className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-2">
                {expedition.eyebrow}
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-wl-text mb-6">
                {expedition.title}
              </h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {expedition.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-lg bg-white p-4 text-sm leading-relaxed text-wl-text-secondary"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wl-orange" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
