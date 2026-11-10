import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { LEGAL_LAST_UPDATED, legalEntity, legalHosts } from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Politique de confidentialité | Welearn",
    description:
      "Comment Welearn collecte, utilise et protège vos données personnelles, conformément à la loi 09-08 : finalités, destinataires, cookies et exercice de vos droits.",
  };
}

const linkClass = "text-wl-blue underline underline-offset-2 hover:no-underline";

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero
        title="Politique de confidentialité"
        description="Comment nous collectons, utilisons et protégeons vos données personnelles."
        size="sm"
      />

      <article className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm text-wl-text-secondary mb-10">
            Dernière mise à jour : {LEGAL_LAST_UPDATED}
          </p>

          <div className="wl-prose">
            <p>
              La présente politique décrit les traitements de données à
              caractère personnel mis en œuvre sur le site Welearn, conformément
              à la loi n° 09-08 relative à la protection des personnes physiques
              à l’égard du traitement des données à caractère personnel.
            </p>

            <h2>1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement est la société {legalEntity.name},{" "}
              {legalEntity.legalForm}, au capital de {legalEntity.capital},
              dont le siège social est situé {legalEntity.address},
              immatriculée au registre du commerce sous le n° {legalEntity.rc}.
            </p>
            <p>
              Contact :{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
              </a>
            </p>

            <h2>2. Données collectées et finalités</h2>
            <p>
              Nous ne collectons que les données nécessaires aux finalités
              décrites ci-dessous. Les champs obligatoires sont signalés dans
              chaque formulaire.
            </p>

            <h3>Formulaire de contact</h3>
            <ul>
              <li>
                <strong>Données :</strong> nom complet, adresse email, numéro de
                téléphone (facultatif), objet et contenu du message.
              </li>
              <li>
                <strong>Finalité :</strong> répondre à votre demande. Le
                message est transmis par courrier électronique à notre équipe.
              </li>
            </ul>

            <h3>Demande d’inscription à une formation</h3>
            <ul>
              <li>
                <strong>Données :</strong> nom complet, adresse email, numéro de
                téléphone, entreprise et fonction (facultatifs), message
                (facultatif), formation concernée.
              </li>
              <li>
                <strong>Finalité :</strong> traiter votre demande
                d’inscription, vous recontacter à son sujet et assurer le suivi
                de votre inscription.
              </li>
            </ul>

            <h3>Demande de brochure</h3>
            <ul>
              <li>
                <strong>Données :</strong> nom complet, adresse email, numéro de
                téléphone, entreprise et fonction (facultatifs), message
                (facultatif), formation concernée.
              </li>
              <li>
                <strong>Finalité :</strong> vous donner accès à la brochure de
                la formation et vous recontacter au sujet de cette formation.
              </li>
            </ul>

            <h3>Paiement en ligne</h3>
            <p>
              Lors d’un paiement par carte bancaire, les données de la carte
              sont saisies directement sur la plateforme sécurisée du CMI
              (Centre Monétique Interbancaire).{" "}
              {legalEntity.name} ne collecte ni ne stocke aucune donnée de carte
              bancaire.
            </p>

            <h3>Données de navigation</h3>
            <p>
              Lors de votre visite, des données techniques (pages consultées,
              type d’appareil et de navigateur, provenance de la visite) sont
              collectées par nos outils de mesure d’audience afin d’établir des
              statistiques de fréquentation et d’améliorer le site. Voir
              l’article 7 ci-dessous.
            </p>

            <h2>3. Base légale des traitements</h2>
            <ul>
              <li>
                <strong>Votre consentement</strong>, exprimé lors de l’envoi
                volontaire d’un formulaire ;
              </li>
              <li>
                <strong>
                  l’exécution de mesures précontractuelles ou du contrat
                </strong>{" "}
                pour le traitement des demandes d’inscription, des commandes et
                des paiements ;
              </li>
              <li>
                <strong>le respect de nos obligations légales</strong>,
                notamment comptables et fiscales, pour les données liées aux
                commandes.
              </li>
            </ul>

            <h2>4. Destinataires des données</h2>
            <p>
              Vos données sont destinées aux seuls membres habilités de
              l’équipe {legalEntity.name} chargés de traiter votre demande.
              Elles peuvent être communiquées, dans la stricte limite de leurs
              missions, aux prestataires techniques qui agissent pour notre
              compte :
            </p>
            <ul>
              <li>
                {legalHosts.site.name} (hébergement du site, mesure d’audience
                Vercel Analytics) ;
              </li>
              <li>
                {legalHosts.application.name} (hébergement des services de
                traitement des formulaires, {legalHosts.application.domain}) ;
              </li>
              <li>Supabase (hébergement de la base de données) ;</li>
              <li>
                notre prestataire de messagerie électronique, pour
                l’acheminement des messages du formulaire de contact ;
              </li>
              <li>Google (mesure d’audience Google Analytics) ;</li>
              <li>le CMI, pour le traitement des paiements par carte.</li>
            </ul>
            <p>
              Vos données peuvent également être communiquées aux autorités
              habilitées lorsque la loi l’exige. Elles ne sont jamais vendues ni
              cédées à des tiers à des fins commerciales.
            </p>
            <p>
              Certains prestataires techniques de WeLearn sont établis hors du
              Maroc : l’hébergement du site est assuré par Vercel Inc.
              (États-Unis), la base de données est hébergée par Supabase dans
              la région eu-west-1 (Irlande), et la mesure d’audience est
              assurée par Google. Ces traitements impliquent un transfert de
              données à caractère personnel vers l’étranger, encadré par la loi
              n° 09-08. WeLearn veille à ce que ces prestataires présentent des
              garanties suffisantes en matière de sécurité et de
              confidentialité des données.
            </p>

            <h2>5. Durée de conservation</h2>
            <p>
              Vos données ne sont pas conservées au-delà de la durée nécessaire
              aux finalités pour lesquelles elles ont été collectées :
            </p>
            <ul>
              <li>
                Messages reçus via le formulaire de contact : 3 ans à compter
                du dernier contact.
              </li>
              <li>
                Demandes d’inscription et demandes de brochure : 3 ans à
                compter du dernier contact.
              </li>
              <li>
                Données relatives aux commandes et aux paiements : 10 ans,
                conformément aux obligations légales de conservation comptable.
              </li>
              <li>Données de mesure d’audience : 14 mois.</li>
            </ul>

            <h2>6. Sécurité</h2>
            <p>
              {legalEntity.name} met en œuvre des mesures techniques et
              organisationnelles appropriées pour protéger vos données contre
              la perte, l’accès non autorisé, la divulgation ou l’altération :
              chiffrement des échanges entre votre navigateur et nos services,
              accès aux données réservé aux personnes habilitées et
              authentifiées, et recours à une plateforme de paiement sécurisée
              (protocole 3D Secure) pour les paiements par carte.
            </p>

            <h2>7. Cookies et traceurs</h2>
            <p>Le site utilise :</p>
            <ul>
              <li>
                <strong>un stockage local strictement nécessaire</strong>,
                enregistré dans votre navigateur, qui mémorise vos choix
                exprimés dans le bandeau cookies ;
              </li>
              <li>
                <strong>des outils de mesure d’audience</strong> : Google
                Analytics (qui dépose des cookies) et Vercel Analytics, afin de
                mesurer la fréquentation du site.
              </li>
            </ul>
            <p>
              Vous pouvez exprimer vos préférences via le bandeau cookies
              affiché lors de votre première visite. Vous pouvez également, à
              tout moment, configurer votre navigateur pour bloquer ou
              supprimer les cookies.
            </p>

            <h2>8. Vos droits</h2>
            <p>
              Conformément à la loi n° 09-08, vous disposez des droits suivants
              sur vos données :
            </p>
            <ul>
              <li>
                <strong>droit d’accès</strong> : obtenir la confirmation que vos
                données sont traitées et en recevoir communication ;
              </li>
              <li>
                <strong>droit de rectification</strong> : faire corriger,
                compléter ou supprimer des données inexactes ou incomplètes ;
              </li>
              <li>
                <strong>droit d’opposition</strong> : vous opposer, pour des
                motifs légitimes, au traitement de vos données, et vous opposer
                sans frais à leur utilisation à des fins de prospection.
              </li>
            </ul>
            <p>
              Pour exercer ces droits, adressez votre demande, accompagnée d’un
              justificatif d’identité, par email à{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
              </a>{" "}
              ou par courrier à : {legalEntity.name}, {legalEntity.address}.
            </p>

            <h2>9. Réclamation auprès de l’autorité de contrôle</h2>
            <p>
              Si vous estimez que le traitement de vos données à caractère
              personnel n’est pas conforme à la réglementation en vigueur, vous
              pouvez adresser une réclamation à la Commission Nationale de
              contrôle de la protection des Données à caractère Personnel
              (CNDP), autorité marocaine de contrôle en matière de protection
              des données personnelles :{" "}
              <a
                href="https://www.cndp.ma"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                www.cndp.ma
              </a>
              .
            </p>

            <h2>10. Modification de la présente politique</h2>
            <p>
              Nous pouvons être amenés à modifier la présente politique. La
              date de dernière mise à jour figure en haut de cette page.
            </p>

            <h2>11. Contact</h2>
            <p>
              Pour toute question relative à la protection de vos données,
              contactez-nous par email à{" "}
              <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                {legalEntity.email}
              </a>
              , par téléphone au{" "}
              <a href={legalEntity.phoneHref} className={linkClass}>
                {legalEntity.phone}
              </a>{" "}
              ou via notre{" "}
              <Link href="/contact" className={linkClass}>
                formulaire de contact
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
