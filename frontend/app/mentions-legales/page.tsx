import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import {
  LEGAL_LAST_UPDATED,
  legalEntity,
  legalHosts,
  legalIdentityRows,
} from "@/data/legal";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Mentions légales | Welearn",
    description:
      "Mentions légales du site Welearn : éditeur, directeur de la publication, hébergeurs, propriété intellectuelle et contact.",
  };
}

const linkClass = "text-wl-blue underline underline-offset-2 hover:no-underline";

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero
        title="Mentions légales"
        description="Informations légales relatives à l’éditeur et à l’hébergement du site Welearn."
        size="sm"
      />

      <article className="py-20 lg:py-28 bg-white">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-sm text-wl-text-secondary mb-10">
            Dernière mise à jour : {LEGAL_LAST_UPDATED}
          </p>

          <div className="wl-prose">
            <h2>1. Éditeur du site</h2>
            <p>
              Le présent site est édité par la société {legalEntity.name}, dont
              les informations d’identification sont les suivantes :
            </p>
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

            <h2>2. Directeur de la publication</h2>
            <p>
              Direction de la publication : {legalEntity.publicationDirector}.
            </p>

            <h2>3. Hébergeurs</h2>
            <p>
              <strong>Hébergement du site :</strong> {legalHosts.site.name},{" "}
              {legalHosts.site.address}.
            </p>
            <p>
              <strong>Hébergement applicatif</strong> (services de traitement
              des formulaires) : {legalHosts.application.name}, sous le domaine{" "}
              {legalHosts.application.domain}.
            </p>

            <h2>4. Propriété intellectuelle</h2>
            <p>
              L’ensemble des éléments composant le site (textes, programmes de
              formation, brochures, visuels, photographies, vidéos, logos,
              marques, charte graphique, structure et code) est la propriété de{" "}
              {legalEntity.name} ou de ses partenaires, et est protégé par la
              législation marocaine relative à la propriété intellectuelle,
              notamment la loi n° 2-00 relative aux droits d’auteur et droits
              voisins et la loi n° 17-97 relative à la protection de la
              propriété industrielle.
            </p>
            <p>
              Toute reproduction, représentation, adaptation, extraction ou
              diffusion, totale ou partielle, de ces éléments, par quelque
              procédé que ce soit, sans l’autorisation écrite préalable de{" "}
              {legalEntity.name}, est interdite et peut donner lieu à des
              poursuites.
            </p>
            <p>
              Les logos et marques des partenaires et clients présentés sur le
              site restent la propriété de leurs titulaires respectifs.
            </p>

            <h2>5. Limitation de responsabilité</h2>
            <p>
              {legalEntity.name} s’efforce de publier des informations exactes
              et à jour. Les informations présentées sur le site, notamment les
              programmes, les dates de session et les modalités des formations,
              sont fournies à titre indicatif et peuvent évoluer. Les
              conditions applicables aux inscriptions et achats sont définies
              par les{" "}
              <Link href="/cgv" className={linkClass}>
                Conditions Générales
              </Link>
              .
            </p>
            <p>
              {legalEntity.name} ne saurait être tenue responsable des
              interruptions temporaires du site, des erreurs ou omissions
              qu’il pourrait contenir, ni des dommages résultant de son
              utilisation ou de l’impossibilité d’y accéder. Les liens vers des
              sites tiers sont fournis pour information ; {legalEntity.name}{" "}
              n’exerce aucun contrôle sur leur contenu et décline toute
              responsabilité à cet égard.
            </p>

            <h2>6. Données personnelles</h2>
            <p>
              Le traitement des données personnelles collectées sur le site est
              décrit dans notre{" "}
              <Link href="/confidentialite" className={linkClass}>
                politique de confidentialité
              </Link>
              .
            </p>

            <h2>7. Contact</h2>
            <p>Pour toute question relative au site, vous pouvez nous joindre :</p>
            <ul>
              <li>
                par email :{" "}
                <a href={`mailto:${legalEntity.email}`} className={linkClass}>
                  {legalEntity.email}
                </a>
              </li>
              <li>
                par téléphone :{" "}
                <a href={legalEntity.phoneHref} className={linkClass}>
                  {legalEntity.phone}
                </a>
              </li>
              <li>par courrier : {legalEntity.address}</li>
              <li>
                via notre{" "}
                <Link href="/contact" className={linkClass}>
                  formulaire de contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </>
  );
}
