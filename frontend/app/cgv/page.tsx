import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { CGV_LAST_UPDATED, legalEntity, legalIdentityRows } from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Conditions Générales | Welearn",
    description:
      "Conditions générales d’utilisation du site et de vente des formations Welearn : inscription, prix, paiement sécurisé CMI, accès, réclamations et droit applicable.",
  };
}

const linkClass =
  "text-wl-blue underline underline-offset-2 hover:no-underline";

export default function ConditionsGeneralesPage() {
  return (
    <>
      <PageHero
        title="Conditions Générales"
        description="Conditions générales d’utilisation du site et de vente des formations Welearn."
        size="sm"
      />

      <article className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm text-wl-text-secondary mb-10">
            Dernière mise à jour : {CGV_LAST_UPDATED}
          </p>

          {/* scroll-mt : les liens /cgv#article-N ne doivent pas arriver sous la navbar fixe. */}
          <div className="wl-prose [&_h2]:scroll-mt-24">
            <h2 id="article-1">1. Objet et champ d’application</h2>
            <p>
              Les présentes conditions constituent un contrat à distance qui
              définit les droits et obligations des parties dans le cadre de la
              vente des formations de {legalEntity.name} sur Internet, par
              l’intermédiaire de la plate-forme sécurisée de paiement en ligne
              du Centre Monétique Interbancaire (CMI).
            </p>
            <p>
              Les présentes Conditions Générales (ci-après les « Conditions »)
              ont pour objet de définir, d’une part, les conditions
              d’utilisation du site Welearn par tout visiteur (ci-après l’«
              Utilisateur ») et, d’autre part, les conditions dans lesquelles{" "}
              {legalEntity.name} vend les formations proposées sur le site à
              toute personne physique ou morale (ci-après le « Client »).
            </p>
            <p>
              Toute inscription ou commande passée sur le site implique
              l’acceptation inconditionnelle et irrévocable des Conditions en
              vigueur à la date de la commande, que le Client reconnaît avoir
              lues avant de valider celle-ci. Les conditions particulières
              éventuellement convenues par écrit entre {legalEntity.name} et un
              Client prévalent sur les présentes.
            </p>
            <p>
              {legalEntity.name} se réserve le droit de modifier les Conditions
              à tout moment. Les Conditions applicables sont celles en vigueur à
              la date de la commande.
            </p>

            <h2 id="article-2">2. Identification du vendeur</h2>
            <p>Les formations sont vendues par :</p>
            <table>
              <tbody>
                {legalIdentityRows.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 id="article-3">3. Description des formations</h2>
            <p>
              {legalEntity.name} propose des formations professionnelles dans
              les domaines de la construction, du BIM et de l’immobilier,
              notamment des formations certifiantes, diplômantes, sur mesure et
              en ligne (e-learning).
            </p>
            <p>
              Les caractéristiques essentielles de chaque formation (objectifs,
              public visé, prérequis, programme, durée, modalités présentielles
              ou à distance, dates de session) sont présentées sur sa fiche, que
              le Client est invité à consulter avant toute commande. Certaines
              formations, notamment diplômantes, sont soumises à des conditions
              d’admission précisées sur leur fiche.
            </p>
            <p>
              {legalEntity.name} peut adapter le contenu d’un programme ou
              remplacer un intervenant pour des raisons pédagogiques ou
              d’organisation, sans que les objectifs de la formation n’en soient
              modifiés. Les visuels présentés sur le site ne sont pas
              contractuels.
            </p>

            <h2 id="article-4">4. Processus de commande et d’inscription</h2>
            <p>Pour s’inscrire à une formation, le Client :</p>
            <ol>
              <li>sélectionne la formation et, le cas échéant, la session ;</li>
              <li>
                renseigne le formulaire d’inscription avec des informations
                exactes et complètes ;
              </li>
              <li>
                vérifie le récapitulatif de sa commande (formation, session,
                prix) et accepte les présentes Conditions ;
              </li>
              <li>procède au paiement selon les modalités de l’article 6.</li>
            </ol>
            <p>
              La commande est ferme et définitive à la confirmation du paiement
              par la plateforme de paiement. Une confirmation est alors adressée
              au Client à l’adresse email qu’il a indiquée.
            </p>
            <p>
              Pour les formations soumises à admission, la demande d’inscription
              est d’abord étudiée par l’équipe {legalEntity.name}, qui
              recontacte le candidat. Le paiement n’intervient qu’après
              acceptation de la candidature.
            </p>

            <h2 id="article-5">5. Prix</h2>
            <p>
              Les prix sont exprimés en dirhams marocains (MAD), toutes taxes
              comprises (TTC), TVA en vigueur incluse. Chaque offre est valable
              tant qu’elle est affichée sur le site ; le prix applicable est
              celui affiché au jour de la commande. Les codes de réduction
              éventuels s’appliquent sur le prix TTC affiché, dans les
              conditions communiquées avec le code, et ne sont pas cumulables.
            </p>

            <h2 id="article-6">6. Modalités de paiement</h2>
            <p>
              Le paiement s’effectue en ligne par carte bancaire, via la
              plateforme de paiement sécurisée du CMI (Centre Monétique
              Interbancaire). Les transactions sont protégées par le protocole
              3D Secure, qui peut nécessiter une authentification complémentaire
              auprès de la banque émettrice de la carte.
            </p>
            <p>
              Les données de la carte bancaire sont saisies directement sur la
              page de paiement du CMI.{" "}
              <strong>
                Aucune donnée de carte bancaire n’est collectée ni stockée par{" "}
                {legalEntity.name}.
              </strong>
            </p>
            <p>
              En cas de refus d’autorisation de paiement, la commande n’est pas
              validée.
            </p>
            <p>
              La remise de la transaction pour débit de votre compte est
              effectuée dans la journée qui suit la date de confirmation de la
              commande.
            </p>
            <p>
              Vos paiements en ligne sont sécurisés par le Centre Monétique
              Interbancaire (CMI) qui offre un service de paiement entièrement
              sécurisé.
            </p>
            <p>
              Le client garantit à {legalEntity.name} qu’il dispose des
              autorisations éventuellement nécessaires pour utiliser le mode de
              paiement choisi lors de la validation de sa commande.
            </p>
            <p>
              En cas de paiement par carte bancaire, les dispositions relatives
              à l’utilisation frauduleuse du moyen de paiement prévues dans les
              conventions conclues entre le client et l’émetteur de la carte, et
              entre {legalEntity.name} et son établissement bancaire,
              s’appliquent.
            </p>

            <h2 id="article-7">7. Preuve des transactions</h2>
            <p>
              Les données enregistrées par le CMI sur la plate-forme de paiement
              en ligne pour le compte de {legalEntity.name} constituent la
              preuve des transactions commerciales passées entre le client et{" "}
              {legalEntity.name}.
            </p>

            <h2 id="article-8">8. Accès à la formation après paiement</h2>
            <p>
              Après confirmation du paiement, le Client reçoit par email les
              informations nécessaires pour suivre sa formation : identifiants
              d’accès à la plateforme de formation en ligne pour les contenus à
              distance, ou informations pratiques de la session pour les
              formations en présentiel.
            </p>
            <p>
              Pour les formations à distance, le Client choisit expressément,
              lors de la commande, entre : (a) l’ouverture immédiate de l’accès,
              sous 24 heures ouvrées à compter de la confirmation du paiement,
              en contrepartie de laquelle il reconnaît renoncer à son droit de
              rétractation dès l’ouverture effective de l’accès ; ou (b)
              l’ouverture de l’accès à l’expiration du délai légal de
              rétractation de sept (7) jours, son droit de rétractation étant
              alors intégralement préservé. Ce choix est recueilli par une case
              à cocher distincte et non pré-cochée.
            </p>
            <p>
              Pour les formations organisées par sessions, la formation débute à
              la date de session indiquée lors de la commande.
            </p>

            <h2 id="article-9">9. Obligations de l’utilisateur</h2>
            <p>L’Utilisateur et le Client s’engagent à :</p>
            <ul>
              <li>
                fournir des informations exactes, à jour et complètes lors de
                toute inscription ou demande ;
              </li>
              <li>
                garder confidentiels leurs identifiants d’accès, qui sont
                personnels et ne peuvent être ni partagés ni cédés ;
              </li>
              <li>
                utiliser les contenus de formation pour leur seul usage
                personnel et dans le cadre de la formation suivie ;
              </li>
              <li>
                ne pas porter atteinte au fonctionnement du site, notamment par
                l’envoi automatisé de formulaires ou l’introduction de code
                malveillant ;
              </li>
              <li>
                ne transmettre, via les formulaires du site, aucun contenu
                illicite, injurieux ou portant atteinte aux droits de tiers.
              </li>
            </ul>

            <h2 id="article-10">10. Annulation et remboursement</h2>
            <p>
              Les conditions d’annulation et de remboursement sont définies dans
              notre{" "}
              <Link href="/remboursement" className={linkClass}>
                politique de remboursement
              </Link>
              , qui fait partie intégrante des présentes Conditions.
            </p>

            <h2 id="article-11">11. Réclamations</h2>
            <p>Toute réclamation peut être adressée à {legalEntity.name} :</p>
            <ul>
              <li>
                par email à{" "}
                <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                  {legalEntity.email}
                </a>
                , en précisant l’objet « Réclamation », la formation concernée
                et la référence de la commande ;
              </li>
              <li>
                par téléphone au{" "}
                <a href={legalEntity.phoneHref} className={linkClass}>
                  {legalEntity.phone}
                </a>{" "}
                ;
              </li>
              <li>par courrier à : {legalEntity.address}.</li>
            </ul>
            <p>
              Toute réclamation fait l’objet d’un accusé de réception et est
              traitée dans un délai de 7 jours ouvrables.
            </p>

            <h2 id="article-12">12. Données personnelles</h2>
            <p>
              Les données personnelles du Client sont traitées conformément à la
              loi n° 09-08 relative à la protection des personnes physiques à
              l’égard du traitement des données à caractère personnel, dans les
              conditions décrites dans notre{" "}
              <Link href="/confidentialite" className={linkClass}>
                politique de confidentialité
              </Link>
              .
            </p>

            <h2 id="article-13">
              13. Propriété intellectuelle des contenus pédagogiques
            </h2>
            <p>
              Les contenus pédagogiques (supports de cours, modules e-learning,
              vidéos, exercices, études de cas, brochures et tout autre document
              remis au Client) sont la propriété de {legalEntity.name} ou de ses
              partenaires et sont protégés par le droit de la propriété
              intellectuelle.
            </p>
            <p>
              L’inscription confère au Client un droit d’utilisation personnel,
              non exclusif et non cessible de ces contenus, pour les seuls
              besoins de la formation suivie. Sont notamment interdits, sans
              autorisation écrite préalable de {legalEntity.name} : la
              reproduction, la diffusion, la revente ou la mise à disposition de
              tiers des contenus, l’enregistrement des sessions et le partage
              des identifiants d’accès.
            </p>

            <h2 id="article-14">14. Force majeure</h2>
            <p>
              {legalEntity.name} ne pourra être tenue responsable de
              l’inexécution ou du retard d’exécution de ses obligations
              résultant d’un cas de force majeure au sens de l’article 269 du
              Dahir formant Code des obligations et des contrats. L’exécution
              des obligations concernées est suspendue pendant la durée de
              l’événement ; {legalEntity.name} en informe le Client dans les
              meilleurs délais et recherche avec lui une solution adaptée,
              notamment le report de la formation.
            </p>

            <h2 id="article-15">
              15. Droit applicable et juridiction compétente
            </h2>
            <p>
              Les présentes Conditions sont soumises au droit marocain. En cas
              de litige, les parties rechercheront en priorité une solution
              amiable. À défaut d’accord amiable, le litige sera porté devant
              les tribunaux compétents de Casablanca, sous réserve des
              dispositions impératives applicables aux consommateurs, notamment
              la loi n° 31-08 édictant des mesures de protection du
              consommateur.
            </p>
          </div>
        </div>
      </article>
    </>
  );
}
