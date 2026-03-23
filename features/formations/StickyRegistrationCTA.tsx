"use client";

import { Button } from "@/components/ui/button";

type StickyRegistrationCTAProps = {
  formationTitle: string;
  targetId?: string;
};

export function StickyRegistrationCTA({
  formationTitle,
  targetId = "registration-form",
}: StickyRegistrationCTAProps) {
  const handleClick = () => {
    const formSection = document.getElementById(targetId);
    if (!formSection) return;

    formSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed bottom-5 left-1/2 z-40 hidden w-[min(900px,92vw)] -translate-x-1/2 items-center justify-between rounded-2xl border border-border bg-white/95 px-5 py-3 shadow-xl backdrop-blur md:flex">
      <p className="truncate pr-4 text-sm font-semibold text-foreground">
        {formationTitle}
      </p>
      <Button
        onClick={handleClick}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Demander une inscription
      </Button>
    </div>
  );
}
