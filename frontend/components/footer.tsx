import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Youtube,
  Facebook,
  Twitter,
} from "lucide-react";
import { PaymentLogos } from "@/components/payment-logos";
import { ManageCookiesButton } from "@/components/manage-cookies-button";

const footerLinks = {
  formations: [
    { name: "Diplomantes", href: "/formations/diplomantes" },
    { name: "Certifiantes", href: "/formations/certifiantes" },
    { name: "Plateforme LMS", href: "/digital-learning/lms" },
    {
      name: "Contenus e-learning",
      href: "/digital-learning/contenus-elearning",
    },
    { name: "Bibliothèque", href: "/digital-learning/bibliotheque" },
  ],
  services: [
    { name: "Ingénierie de formation", href: "/ingenierie" },
    { name: "Accompagnement CSF", href: "/ingenierie/accompagnement" },
    { name: "Plateforme LMS", href: "/digital-learning/lms" },
    {
      name: "Contenus e-learning",
      href: "/digital-learning/contenus-elearning",
    },
    { name: "Conseil & Transformation", href: "/conseil" },
  ],
  company: [
    { name: "À propos", href: "/about" },
    { name: "Événements", href: "/evenements" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "Conditions générales", href: "/cgv" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
    { name: "Politique de remboursement", href: "/remboursement" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-wl-text text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-4 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/welearn-logo-white-trimmed.png"
              alt="Welearn"
              width={1778}
              height={534}
              className="mt-[5px] h-auto w-[85px]"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-sm mt-4">
              EdTech destinée au secteur de la Construction, reconnue comme
              Jeune Entreprise Innovante® en France et au Maroc.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Mail className="h-4 w-4 text-white/50 shrink-0" />
                <span>contact@welearn.ma</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <Phone className="h-4 w-4 text-white/50 shrink-0" />
                <span>+212 661 499 479</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <MapPin className="h-4 w-4 text-white/50 shrink-0" />
                <span>Bureau 300, Technopark, Route de Nouaceur, Casablanca</span>
              </div>
            </div>
          </div>

          {/* Formations Links */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">
              Formations
            </h3>
            <ul className="space-y-2">
              {footerLinks.formations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">
              Welearn
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-sans font-semibold text-sm text-white mb-4">
              Informations légales
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <ManageCookiesButton className="cursor-pointer text-left text-sm text-white/50 hover:text-white/80 transition-colors duration-200" />
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between items-center gap-4">
          <PaymentLogos variant="dark" size="sm" showSecureNote={true} />
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} Welearn. Tous droits réservés. Jeune
            Entreprise Innovante®
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/company/welearnmaroc"
              target="_blank"
              className="p-2 text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCPbfyV72PP5PP1f6fH6-hbA"
              target="_blank"
              className="p-2 text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="https://web.facebook.com/WelearnMaroc"
              target="_blank"
              className="p-2 text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://x.com/welearnmaroc"
              target="_blank"
              className="p-2 text-white/50 hover:text-white/80 transition-colors duration-200"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
