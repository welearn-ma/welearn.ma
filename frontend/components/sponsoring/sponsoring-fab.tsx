"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

type SponsoringFabProps = {
  /** id de la section hero : le bouton apparaît quand elle sort de l'écran. */
  heroId: string;
  /** id de la section formulaire vers laquelle scroller. */
  targetId: string;
};

/**
 * CTA flottant persistant (pilule wl-orange, pleine largeur sur mobile).
 * Masqué tant que le hero est visible.
 */
export function SponsoringFab({ heroId, targetId }: SponsoringFabProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero || typeof window.IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  return (
    <a
      href={`#${targetId}`}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`group fixed inset-x-4 bottom-4 z-40 inline-flex items-center justify-center gap-2 rounded-xl bg-wl-orange px-6 py-[15px] text-[13.5px] font-extrabold text-white shadow-[0_10px_30px_rgba(232,114,28,0.45)] transition-all duration-300 hover:bg-wl-orange-dark hover:shadow-[0_14px_34px_rgba(232,114,28,0.55)] motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:inset-x-auto sm:bottom-[26px] sm:right-[26px] sm:rounded-full ${
        show
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3.5 opacity-0"
      }`}
    >
      Devenir partenaire
      <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" />
    </a>
  );
}
