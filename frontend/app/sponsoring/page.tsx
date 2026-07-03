import { HeartHandshake } from "lucide-react";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";

export default function SponsoringPage() {
  return (
    <>
      {/* Hero court */}
      <section className="relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark py-16 lg:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/4" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/3" />
        <div className="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 backdrop-blur-sm">
            <HeartHandshake className="h-4 w-4 text-white" />
            <span className="text-sm font-medium tracking-wide text-white/90">
              Devenez sponsor
            </span>
          </div>
          <h1 className="mb-5 font-sans text-4xl font-bold leading-tight tracking-tight text-balance text-white md:text-5xl">
            Appel à manifestation d’intérêt
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/75">
            Parrainez un ou plusieurs MOOCs et rendez la formation technique
            accessible à toute la filière BTP.
          </p>
        </div>
      </section>

      {/* Formulaire de sponsoring + Comment participer */}
      <section
        id="sponsor-form"
        className="scroll-mt-24 bg-wl-gray-light py-16 lg:py-20"
      >
        <div className="mx-auto max-w-4xl px-4 lg:px-8">
          <SponsorshipForm />
        </div>
      </section>
    </>
  );
}
