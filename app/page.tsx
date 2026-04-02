import { HeroSection } from "@/components/home/hero-section";
import { InstancesSection } from "@/components/home/instances-section";
import { StatsSection } from "@/components/home/stats-section";
import { ExpertiseSection } from "@/components/home/expertise-section";
import { FormatsSection } from "@/components/home/formats-section";
import { ProcessSection } from "@/components/home/process-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersSection } from "@/components/home/partners-section";
import { CTASection } from "@/components/home/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <InstancesSection />
      <StatsSection />
      <ExpertiseSection />
      <FormatsSection />
      <ProcessSection />
      <TestimonialsSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
