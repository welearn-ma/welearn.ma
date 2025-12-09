"use client";

import { ContactInfoSection } from "@/components/contact/contact-info-section";
import { ContactFormSection } from "@/components/contact/contact-form-section";
import { CorporateContactCta } from "@/components/contact/corporate-contact-cta";

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-(--color-welearn-navy)">
        <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
            Parlons de votre projet
          </span>
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Une question sur nos formations ? Un projet de formation corporate ?
            Notre équipe est à votre écoute.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <ContactInfoSection />
            <ContactFormSection />
          </div>
        </div>
      </section>

      <CorporateContactCta />
    </>
  );
}
