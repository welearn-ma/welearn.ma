"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  {
    name: "Accueil",
    href: "/",
  },
  { name: "À propos", href: "/about" },
  {
    name: "Ingénierie & Accompagnement",
    href: "/ingenierie",
    children: [
      { name: "Stratégie de formation", href: "/ingenierie/strategie" },
      { name: "Ingénierie de formation", href: "/ingenierie" },
      { name: "Accompagnement CSF", href: "/ingenierie/accompagnement" },
    ],
  },
  {
    name: "Formations",
    href: "/formations",
    children: [
      {
        name: "Diplômantes",
        href: "/formations/diplomantes",
        children: [
          {
            name: "Executive Masters",
            href: "/formations/diplomantes/executive-masters",
          },
          {
            name: "Licences Professionnelles",
            href: "/formations/diplomantes/licences-pro",
          },
        ],
      },
      {
        name: "Certifiantes",
        href: "/formations/certifiantes",
        children: [
          {
            name: "BIM Foundations Professional",
            href: "/formations/certifiantes/bim-foundations",
          },
          {
            name: "Catalogue des formations intra",
            href: "/formations/certifiantes/catalogue",
          },
          {
            name: "Formations sur mesure",
            href: "/formations/certifiantes/sur-mesure",
          },
        ],
      },
    ],
  },
  {
    name: "Solutions Digital Learning",
    href: "/digital-learning",
    children: [
      { name: "Plateforme LMS", href: "/digital-learning/lms" },
      {
        name: "Développement de contenus e-learning",
        href: "/digital-learning/contenus-elearning",
      },
      { name: "Bibliothèque de cours", href: "/digital-learning/bibliotheque" },
    ],
  },
  {
    name: "Conseil & Transformation",
    href: "/conseil",
  },
  {
    name: "Ressources",
    href: "/ressources",
    children: [
      { name: "Articles & Blog", href: "/ressources/blog" },
      { name: "Vidéos pédagogiques", href: "/ressources/videos" },
      { name: "FAQ", href: "/ressources/faq" },
    ],
  },
  { name: "Événements", href: "/evenements" },
];

interface NavItem {
  name: string;
  href: string;
  children?: NavItem[];
}

function MegaMenuItem({ item }: { item: NavItem }) {
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
      >
        {item.name}
        {item.children && <ChevronDown className="h-4 w-4" />}
      </Link>
      {item.children && (
        <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-border p-3 min-w-[260px]">
            {item.children.map((child) => (
              <div key={child.name} className="relative group/sub">
                {child.children ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded-lg transition-colors cursor-pointer">
                      <span>{child.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                    <div className="absolute left-full top-0 pl-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-border p-3 min-w-60">
                        {child.children.map((subChild) => (
                          <Link
                            key={subChild.name}
                            href={subChild.href}
                            className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded-lg transition-colors"
                          >
                            {subChild.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={child.href}
                    className="block px-4 py-2.5 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded-lg transition-colors"
                  >
                    {child.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileMenuItem({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link
          href={item.href}
          className="block py-2 text-base font-medium text-foreground/80 hover:text-primary"
          onClick={onClose}
        >
          {item.name}
        </Link>
        {item.children && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-muted-foreground hover:text-primary"
          >
            <ChevronDown
              className={`h-5 w-5 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>
      {item.children && isOpen && (
        <div className="pl-4 pb-2 space-y-1">
          {item.children.map((child) => (
            <div key={child.name}>
              <Link
                href={child.href}
                className="block py-2 text-sm text-muted-foreground hover:text-primary"
                onClick={onClose}
              >
                {child.name}
              </Link>
              {child.children && (
                <div className="pl-4 space-y-1">
                  {child.children.map((subChild) => (
                    <Link
                      key={subChild.name}
                      href={subChild.href}
                      className="block py-1.5 text-sm text-muted-foreground/80 hover:text-primary"
                      onClick={onClose}
                    >
                      {subChild.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 border-b border-border">
      <nav className="flex max-w-7xl items-center justify-between gap-4 px-4  lg:px-8 min-w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/welearn-logo.png"
            alt="Welearn"
            width={80}
            height={80}
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex xl:items-center xl:gap-6">
          {navigation.map((item) => (
            <MegaMenuItem key={item.name} item={item} />
          ))}
        </div>

        <div className="hidden xl:flex xl:items-center xl:gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
          >
            <Link href="https://welearn.ac" target="_blank">
              Accéder au LMS
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="xl:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-border bg-white max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <MobileMenuItem
                key={item.name}
                item={item}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}
            <div className="pt-4 space-y-2 border-t border-border mt-4">
              <Button
                asChild
                variant="outline"
                className="w-full border-primary text-primary bg-transparent"
              >
                <Link href="https://welearn.ac" target="_blank">
                  Accéder au LMS
                </Link>
              </Button>
              <Button asChild className="w-full bg-primary text-white">
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
