import type { ReactNode } from "react";

/** Libellé de section : tiret + texte wl-blue en capitales espacées. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2.2px] text-wl-blue">
      <span aria-hidden className="h-[1.5px] w-4 bg-wl-blue" />
      {children}
    </span>
  );
}
