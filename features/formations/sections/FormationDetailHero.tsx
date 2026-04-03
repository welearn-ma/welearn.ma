import Image from "next/image";
import { ChevronRight } from "lucide-react";
import type { InfoBannerItem } from "@/types/formation-page";

type Props = {
  badges: string[];
  title: string;
  subtitle: string;
  partnerLine: string;
  infoBanner: InfoBannerItem[];
  heroImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

export function FormationDetailHero({
  badges,
  title,
  subtitle,
  partnerLine,
  infoBanner,
  heroImage,
  ctaPrimary,
  ctaSecondary,
}: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image src={heroImage} alt="" fill className="object-cover" priority />
      <div className="absolute inset-0 bg-wl-blue/75" />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 py-32 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-white px-4 py-1 text-sm font-semibold text-wl-text"
            >
              {badge}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl text-white/75 max-w-3xl mx-auto mb-3">
          {subtitle}
        </p>
        <p className="text-sm text-white/60 mb-8">{partnerLine}</p>

        <div className="bg-white/10 backdrop-blur rounded-xl px-6 py-4 inline-flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
          {infoBanner.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-white">
              <item.icon className="h-5 w-5 text-white/80" />
              <div className="text-left">
                <p className="font-semibold text-sm">{item.value}</p>
                <p className="text-xs text-white/60">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#registration-form"
            className="inline-flex items-center rounded-lg bg-wl-orange px-6 py-3 font-semibold text-white hover:bg-wl-orange-dark transition-colors"
          >
            {ctaPrimary}
            <ChevronRight className="ml-1 h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center rounded-lg border border-white/40 bg-transparent px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
          >
            {ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}
