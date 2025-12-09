import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DigitalLearningCta() {
  return (
    <section className="py-20 lg:py-28 bg-(--color-welearn-navy)">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-white mb-6">
          Prêt à digitaliser vos formations ?
        </h2>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Contactez-nous pour discuter de vos besoins et découvrir comment nos
          solutions peuvent transformer votre approche de la formation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/contact">Demander une démonstration</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
          >
            <Link href="https://welearn.ac" target="_blank">
              Accéder au LMS
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
