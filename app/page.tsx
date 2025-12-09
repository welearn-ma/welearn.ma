import { HeroSection } from "@/components/home/hero-section"
import { ExpertiseSection } from "@/components/home/expertise-section"
import { FormatsSection } from "@/components/home/formats-section"
import { ProgramsSection } from "@/components/home/programs-section"
import { LMSSection } from "@/components/home/lms-section"
import { EventsSection } from "@/components/home/events-section"
import { PartnersSection } from "@/components/home/partners-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ExpertiseSection />
      <FormatsSection />
      <ProgramsSection />
      <LMSSection />
      <EventsSection />
      <PartnersSection />
      <CTASection />
    </>
  )
}
