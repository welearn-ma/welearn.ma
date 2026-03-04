"use client";

import { PageHero } from "@/components/page-hero";
import { ContactFormSection } from "@/components/contact/contact-form-section";
import { CorporateContactCta } from "@/components/contact/corporate-contact-cta";

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contactez-nous"
        description="Une question sur nos formations ? Un projet de formation corporate ? Notre équipe est à votre écoute."
        eyebrow="Parlons de votre projet"
        size="lg"
      />

      {/* Contact Section */}}
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
