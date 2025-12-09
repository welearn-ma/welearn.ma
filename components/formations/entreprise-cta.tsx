import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export function EntrepriseCta() {
  return (
    <section className="py-20 lg:py-28 bg-secondary">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 text-center">
        <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-6">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-sans text-3xl md:text-4xl font-bold text-foreground mb-6">
          Vous êtes une entreprise ?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez nos solutions de formation intra-entreprise et bénéficiez
          d'un accompagnement personnalisé pour le développement des compétences
          de vos équipes.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Link href="/contact">Demander un devis</Link>
        </Button>
      </div>
    </section>
  );
}
