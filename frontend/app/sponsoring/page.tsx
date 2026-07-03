import { ArrowRight, HeartHandshake, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SponsorshipForm } from "@/features/sponsoring/SponsorshipForm";

const anepStats = [
  { value: "+40 ans", label: "d'expertise" },
  { value: "3 000+", label: "projets ANEP" },
  { value: "55 Mds DH", label: "d'investissement" },
];

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
            Sponsorisez les MOOCs Welearn
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/75">
            Parrainez un ou plusieurs MOOCs et rendez la formation technique
            accessible à toute la filière BTP.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-wl-orange text-white transition-all duration-200 hover:bg-wl-orange-dark"
          >
            <a href="#sponsor-form">
              Sponsoriser un MOOC
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* Bandeau de crédibilité compact */}
      <section className="border-b border-wl-border bg-white py-8 lg:py-10">
        <div className="mx-auto max-w-5xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {anepStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-center gap-2 rounded-xl border border-wl-border bg-wl-gray-light px-5 py-4 text-center"
              >
                <span className="font-sans text-2xl font-bold text-wl-blue md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-wl-text-secondary">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de sponsoring */}
      <section
        id="sponsor-form"
        className="scroll-mt-24 bg-wl-gray-light py-16 lg:py-20"
      >
        <div className="mx-auto max-w-2xl px-4 lg:px-8">
          <SponsorshipForm />

          {/* Contact compact */}
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-wl-text-secondary">
            <span>
              Un échange direct ?{" "}
              <span className="font-medium text-wl-text">
                Mohamed Taha Mazoz
              </span>
            </span>
            <a
              href="tel:+212703175052"
              className="inline-flex items-center gap-1.5 font-medium text-wl-blue transition-colors hover:text-wl-blue-dark"
            >
              <Phone className="h-4 w-4" />
              +212 7 03 17 50 52
            </a>
            <a
              href="mailto:taha.mazoz@welearn.ma"
              className="inline-flex items-center gap-1.5 font-medium text-wl-blue transition-colors hover:text-wl-blue-dark"
            >
              <Mail className="h-4 w-4" />
              taha.mazoz@welearn.ma
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
