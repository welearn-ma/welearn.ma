import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConseilCta() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
          Un projet de transformation ?
        </h2>
        <p className="text-lg text-white/90 mb-8">
          Discutons ensemble de vos enjeux et voyons comment nous pouvons vous
          accompagner.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white text-primary hover:bg-white/90"
        >
          <Link href="/contact">Prendre rendez-vous</Link>
        </Button>
      </div>
    </section>
  );
}
