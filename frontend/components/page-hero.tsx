import type { LucideIcon } from "lucide-react";

interface PageHeroProps {
  title: string;
  description: string;
  eyebrow?: string;
  badge?: {
    icon?: LucideIcon;
    text: string;
  };
  size?: "sm" | "lg";
}

export function PageHero({
  title,
  description,
  eyebrow,
  badge,
  size = "lg",
}: PageHeroProps) {
  const paddingClass = size === "sm" ? "py-16 lg:py-24" : "py-20 lg:py-28";

  return (
    <section
      className={`relative overflow-hidden bg-linear-to-br from-wl-blue to-wl-blue-dark ${paddingClass}`}
    >
      <div className="absolute -top-28 -right-24 h-80 w-80 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-4 lg:px-8 text-center">
        {(badge || eyebrow) && (
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 mb-6 backdrop-blur-sm">
            {badge?.icon && <badge.icon className="h-4 w-4 text-white" />}
            <span className="text-sm font-medium text-white/90 tracking-wide">
              {badge?.text || eyebrow}
            </span>
          </div>
        )}
        <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-white mb-6 text-balance">
          {title}
        </h1>
        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">
          {description}
        </p>
      </div>
    </section>
  );
}
