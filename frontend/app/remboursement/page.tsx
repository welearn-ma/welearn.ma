import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { REFUND_LAST_UPDATED, legalEntity } from "@/data/legal";

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
            Dernière mise à jour : {REFUND_LAST_UPDATED}
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
              Conformément à la loi n° 31-08, le Client non professionnel
              dispose d’un délai de sept (7) jours pour se rétracter, sans avoir
              à justifier de motif ni à supporter de pénalité. Ce délai court à
              compter de l’acceptation de l’offre pour les prestations de
              services. La rétractation s’exerce par tout moyen écrit (email ou
              courrier) adressé à{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
              </a>
              . Un formulaire type de rétractation est{" "}
              <a
                href="/documents/formulaire-retractation-welearn.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                téléchargeable ici
              </a>
              . {legalEntity.name} rembourse les sommes versées dans un délai
              maximal de quinze (15) jours à compter de la rétractation. Ce
              droit ne s’applique pas lorsque l’exécution de la prestation a
              commencé, avec l’accord exprès du Client, avant l’expiration de
              ce délai (
              <Link href="/cgv#article-8" className={linkClass}>
                article 8 des Conditions Générales
              </Link>
              ).
            </p>

            <h2>2. Annulation avant le début de la formation</h2>
            <p>
              Toute demande d’annulation adressée à {legalEntity.name} avant la
              date de
              début de la formation donne lieu au remboursement intégral des
              sommes versées, sans frais de dossier ni retenue.
            </p>

            <h2>3. Annulation après le début de la formation</h2>
            <p>
              Sous réserve de l’exercice du droit de rétractation prévu à
              l’article 1, à compter de la date de début de la formation la
              prestation est considérée comme engagée et aucun remboursement ne
              peut être accordé, sauf cas de force majeure dûment justifié. Dans
              ce cas, {legalEntity.name} propose le report de l’inscription sur
              une session ultérieure ou, à défaut de session disponible dans
              les douze mois, le remboursement au prorata des prestations non
              exécutées.
            </p>

            <h2>4. Annulation à l’initiative de {legalEntity.name}</h2>
            <p>
              Si {legalEntity.name} annule une formation, le client est
              intégralement remboursé des sommes versées. Si {legalEntity.name}{" "}
              reporte une formation, le client peut opter soit pour le report de son inscription à la
              nouvelle session, soit pour le remboursement intégral des sommes
              versées.
            </p>

            <h2>5. Cas de non-remboursement</h2>
            <p>
              Sous réserve du droit de rétractation prévu à l’article 1 et du
              cas de force majeure prévu à l’article 3, aucun remboursement
              n’est accordé dans les cas suivants :
            </p>
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
              Toute demande de remboursement doit être adressée par écrit, soit
              par courrier électronique à{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
              </a>
              , depuis l’adresse électronique utilisée lors de l’inscription,
              soit par courrier postal au siège, et comporter les éléments
              suivants : nom et prénom du participant, intitulé de la formation
              concernée, date de la commande et référence de la transaction.
              Pour des raisons de preuve, toute demande doit être formulée par
              écrit (email ou courrier postal). Une demande exprimée par
              téléphone devra être confirmée par écrit dans les quarante-huit
              heures ; la date retenue est alors celle de la demande
              téléphonique.
            </p>

            <h2>7. Délai de traitement et modalités de remboursement</h2>
            <p>
              Les demandes recevables sont traitées dans un délai de 7 jours
              ouvrables à compter de leur réception. Le remboursement est
              effectué par recrédit de la carte bancaire ayant servi au
              paiement, via la plateforme sécurisée CMI. Le délai de mise à
              disposition effective des fonds dépend de la banque émettrice de
              la carte. Lorsque le recrédit de la carte est techniquement
              impossible (carte expirée, perdue ou compte clôturé), le
              remboursement est effectué par virement bancaire sur présentation
              d’un relevé d’identité bancaire au nom du titulaire du paiement.
              Aucun remboursement en espèces ne peut être effectué.
            </p>

            <h2>8. Contact et réclamations</h2>
            <p>
              {legalEntity.name} — Bureau 300, Technopark, Route de Nouaceur,
              Casablanca, Maroc
              <br />
              Courriel :{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
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
