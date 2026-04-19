import { CheckCircle } from "lucide-react";

type Props = {
  profiles: string[];
  prerequisites: string[];
};

export function FormationAudience({ profiles, prerequisites }: Props) {
  return (
    <section className="bg-wl-gray-light py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Public visé
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
          À qui s&apos;adresse cette formation
        </h2>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold text-wl-text mb-4">Profils cibles</h3>
            <div className="flex flex-wrap gap-2">
              {profiles.map((profile) => (
                <span
                  key={profile}
                  className="rounded-full border border-wl-border bg-white px-3 py-1 text-sm text-wl-text"
                >
                  {profile}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-wl-text mb-4">Prérequis</h3>
            <ul className="space-y-3">
              {prerequisites.map((prereq) => (
                <li
                  key={prereq}
                  className="flex items-start gap-2 text-base text-wl-text-secondary leading-relaxed"
                >
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-wl-blue" />
                  {prereq}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
