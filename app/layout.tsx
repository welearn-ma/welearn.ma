import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/navbar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welearn — Formation BIM, Construction & Immobilier au Maroc",
  description:
    "Welearn est la plateforme EdTech de référence pour les professionnels du BTP et de l'immobilier. Formations certifiantes, digital learning, mastères et académies d'entreprise.",
  keywords:
    "formation BIM Maroc, certification buildingSMART, EdTech BTP, formation immobilier maroc, MOOC construction, digital learning BTP, mastère BIM EHTP, formation continue Maroc, accompagnement CSF",
  generator: "@wa1ead",
  icons: {
    icon: [
      {
        url: "/images/icon-welearn-dark.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/images/icon-welearn-light.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/images/welearn-icon.png",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans antialiased`}>
        <Navbar />
        <Breadcrumb />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
