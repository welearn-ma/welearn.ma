import { Button } from "@/components/ui/button";

export function CorporateContactCta() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
          Besoin d'une formation corporate ?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Découvrez nos solutions sur-mesure pour entreprises : ingénierie de
          formation, académies corporate, parcours personnalisés.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-white hover:bg-(--color-welearn-gold) text-(--color-welearn-navy) font-semibold transition-colors"
        >
          <a href="/ingenierie">Découvrir nos solutions entreprise</a>
        </Button>
      </div>
    </section>
  );
}
