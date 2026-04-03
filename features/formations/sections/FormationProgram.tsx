import type { FormationModule, FinalBlock, CertificationBlock } from "@/types/formation-page";
import { Shield } from "lucide-react";

type Props = {
  modules: FormationModule[];
  finalBlocks: FinalBlock[];
  certification?: CertificationBlock;
};

export function FormationProgram({ modules, finalBlocks, certification }: Props) {
  return (
    <>
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
            Contenu détaillé
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
            Programme
          </h2>

          <div className="space-y-4">
            {modules.map((mod) => (
              <div
                key={mod.number}
                className="rounded-xl border border-wl-border bg-white p-7 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="shrink-0 rounded-lg bg-wl-blue-tint px-3 py-1 text-sm font-bold text-wl-blue">
                    Module {mod.number}
                  </span>
                  <div>
                    <h3 className="font-semibold text-wl-text">{mod.title}</h3>
                    <p className="mt-1 text-sm text-wl-text-secondary">
                      {mod.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {finalBlocks.map((block) => (
              <div
                key={block.badge}
                className={
                  block.variant === "orange"
                    ? "rounded-xl border-2 border-wl-orange bg-wl-orange-tint p-7"
                    : "rounded-xl border border-wl-border bg-wl-blue-tint p-7"
                }
              >
                <div className="flex items-start gap-4">
                  <span
                    className={
                      block.variant === "orange"
                        ? "shrink-0 rounded-lg bg-wl-orange px-3 py-1 text-sm font-bold text-white"
                        : "shrink-0 rounded-lg bg-wl-blue px-3 py-1 text-sm font-bold text-white"
                    }
                  >
                    {block.badge}
                  </span>
                  <div>
                    <h3 className="font-semibold text-wl-text">{block.title}</h3>
                    <p className="mt-1 text-sm text-wl-text-secondary">
                      {block.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {certification && (
        <section className="bg-white pb-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="rounded-xl border border-wl-blue/20 bg-wl-blue-tint p-8">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 shrink-0 text-wl-blue mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-wl-text mb-2">
                    {certification.title}
                  </h3>
                  <p className="text-base leading-relaxed text-wl-text-secondary">
                    {certification.text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
