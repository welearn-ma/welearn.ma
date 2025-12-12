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

const footerLinks = {
  formations: [
    {
      name: "Executive Masters",
      href: "/formations/diplomantes/executive-masters",
    },
    {
      name: "Licences Professionnelles",
      href: "/formations/diplomantes/licences-pro",
    },
    {
      name: "BIM Foundations",
      href: "/formations/certifiantes/bim-foundations",
    },
    { name: "Catalogue intra", href: "/formations/certifiantes/catalogue" },
    {
      name: "Formations sur mesure",
      href: "/formations/certifiantes/sur-mesure",
    },
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
    { name: "Notre équipe", href: "/about/equipe" },
    { name: "Références", href: "/about/references" },
    { name: "Blog & Articles", href: "/ressources/blog" },
    { name: "Événements", href: "/events" },
  ],
  legal: [
    { name: "Mentions légales", href: "/mentions-legales" },
    { name: "CGU", href: "/cgu" },
    { name: "Politique de confidentialité", href: "/confidentialite" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-(--color-welearn-navy-dark) text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Image
              src="/images/welearn-logo-white.png"
              alt="Welearn"
              width={100}
              height={100}
            />
            <p className="text-white/80 text-sm leading-relaxed mb-6 max-w-sm">
              EdTech destinée au secteur de la Construction, reconnue comme
              Jeune Entreprise Innovante® en France et au Maroc.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="h-4 w-4 text-white" />
                <span>contact@welearn.ma</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="h-4 w-4 text-white" />
                <span>+212 520 850 850</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="h-4 w-4 text-white" />
                <span>300, Technopark Casablanca, Maroc</span>
              </div>
            </div>
          </div>

          {/* Formations Links */}
          <div>
            <h3 className="font-sans font-semibold text-base mb-4">
              Formations
            </h3>
            <ul className="space-y-2">
              {footerLinks.formations.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-(--color-welearn-gold) transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-sans font-semibold text-base mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-(--color-welearn-gold) transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-sans font-semibold text-base mb-4">Welearn</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-(--color-welearn-gold) transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-sans font-semibold text-base mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-(--color-welearn-gold) transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Welearn. Tous droits réservés. Jeune
            Entreprise Innovante®
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/company/welearnmaroc"
              target="_blank"
              className="p-2 text-white/60 hover:text-(--color-welearn-gold) transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://www.youtube.com/channel/UCPbfyV72PP5PP1f6fH6-hbA"
              target="_blank"
              className="p-2 text-white/60 hover:text-(--color-welearn-gold) transition-colors"
            >
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="https://web.facebook.com/WelearnMaroc"
              target="_blank"
              className="p-2 text-white/60 hover:text-(--color-welearn-gold) transition-colors"
            >
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="https://x.com/welearnmaroc"
              target="_blank"
              className="p-2 text-white/60 hover:text-(--color-welearn-gold) transition-colors"
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
