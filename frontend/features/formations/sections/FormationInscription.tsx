import { CalendarDays, ChevronRight, Mail, Phone } from "lucide-react";
import type { InscriptionStep } from "@/types/formation-page";

type Props = {
  steps: InscriptionStep[];
  session: string;
  ctaLabel: string;
};

export function FormationInscription({ steps, session, ctaLabel }: Props) {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-wl-orange mb-3">
          Rejoignez-nous
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-wl-text mb-10">
          Modalités d&apos;inscription
        </h2>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex-1 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wl-blue text-sm font-bold text-white">
                {step.number}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-wl-text">{step.title}</h3>
                <p className="mt-1 text-sm text-wl-text-secondary">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="hidden md:block h-5 w-5 text-wl-text-tertiary self-center" />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 mb-8 text-sm text-wl-text-secondary">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-wl-blue" />
            <span>Session : {session}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-wl-blue" />
            <span>contact@welearn.ma</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-wl-blue" />
            <span>+212 661 499 479</span>
          </div>
        </div>

        <div className="text-center">
          <a
            href="#registration-form"
            className="inline-flex items-center rounded-lg bg-wl-orange px-8 py-3 font-semibold text-white hover:bg-wl-orange-dark transition-colors"
          >
            {ctaLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
