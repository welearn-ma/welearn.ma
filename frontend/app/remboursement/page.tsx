import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { LEGAL_LAST_UPDATED } from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Politique de remboursement | Welearn",
    description:
      "Politique d’annulation et de remboursement des formations Welearn : rétractation, annulation, procédure de demande et délais de traitement.",
  };
}

const linkClass = "text-wl-blue underline underline-offset-2 hover:no-underline";

export default function RemboursementPage() {
  return (
    <>
      <PageHero
        title="Politique de remboursement"
        description="Conditions d’annulation et de remboursement des formations Welearn."
        size="sm"
      />

      <article className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm text-wl-text-secondary mb-10">
            Dernière mise à jour : {LEGAL_LAST_UPDATED}
          </p>

          <div className="wl-prose">
            <p>
              La présente politique fait partie intégrante des{" "}
              <Link href="/cgv" className={linkClass}>
                Conditions Générales
              </Link>
              .
            </p>

            <h2>1. Droit de rétractation légal</h2>
            <p>
              Conformément à la loi n° 31-08 édictant des mesures de protection
              du consommateur, le client non professionnel bénéficie d’un droit
              de rétractation pour les contrats conclus à distance, dans les
              conditions, délais et sous réserve des exceptions prévues par la
              loi. Les dispositions de la présente politique s’appliquent sans
              préjudice de ce droit légal.
            </p>

            <h2>2. Annulation avant le début de la formation</h2>
            <p>
              Toute demande d’annulation adressée à WeLearn avant la date de
              début de la formation donne lieu au remboursement intégral des
              sommes versées, sans frais de dossier ni retenue.
            </p>

            <h2>3. Annulation après le début de la formation</h2>
            <p>
              À compter de la date de début de la formation, la prestation est
              considérée comme engagée et aucun remboursement ne peut être
              accordé. Cette règle s’applique quel que soit le niveau de
              participation effective du client aux sessions ou aux contenus
              mis à sa disposition.
            </p>

            <h2>4. Annulation à l’initiative de WeLearn</h2>
            <p>
              Si WeLearn annule une formation, le client est intégralement
              remboursé des sommes versées. Si WeLearn reporte une formation, le
              client peut opter soit pour le report de son inscription à la
              nouvelle session, soit pour le remboursement intégral des sommes
              versées.
            </p>

            <h2>5. Cas de non-remboursement</h2>
            <p>Aucun remboursement n’est accordé dans les cas suivants :</p>
            <ul>
              <li>
                Demande d’annulation formulée après la date de début de la
                formation.
              </li>
              <li>
                Exclusion du client pour non-respect des conditions générales ou
                du règlement intérieur de la formation.
              </li>
              <li>
                Informations inexactes ou frauduleuses communiquées lors de
                l’inscription.
              </li>
              <li>
                Absence ou abandon du client en cours de formation, pour quelque
                motif que ce soit.
              </li>
            </ul>

            <h2>6. Procédure de demande</h2>
            <p>
              Toute demande de remboursement doit être adressée par courrier
              électronique à{" "}
              <a href="mailto:contact@welearn.ma" className={linkClass}>
                contact@welearn.ma
              </a>
              , depuis l’adresse électronique utilisée lors de l’inscription, et
              comporter les éléments suivants : nom et prénom du participant,
              intitulé de la formation concernée, date de la commande et
              référence de la transaction. Les demandes formulées par téléphone
              ne sont pas recevables.
            </p>

            <h2>7. Délai de traitement et modalités de remboursement</h2>
            <p>
              Les demandes recevables sont traitées dans un délai de 7 jours
              ouvrables à compter de leur réception. Le remboursement est
              effectué exclusivement par recrédit de la carte bancaire ayant
              servi au paiement, via la plateforme sécurisée CMI. Le délai de
              mise à disposition effective des fonds dépend de la banque
              émettrice de la carte. Aucun remboursement par virement, par
              chèque ou en espèces ne peut être effectué.
            </p>

            <h2>8. Contact et réclamations</h2>
            <p>
              WeLearn — Bureau 300, Technopark, Route de Nouaceur, Casablanca,
              Maroc
              <br />
              Courriel :{" "}
              <a href="mailto:contact@welearn.ma" className={linkClass}>
                contact@welearn.ma
              </a>{" "}
              — Téléphone :{" "}
              <a href="tel:+212661499479" className={linkClass}>
                +212 661 499 479
              </a>
              <br />
              Toute réclamation fait l’objet d’un accusé de réception et est
              traitée dans un délai de 7 jours ouvrables.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
