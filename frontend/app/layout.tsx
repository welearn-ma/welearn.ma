import type React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthGuard } from "@/components/AuthGuard";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteChrome } from "@/components/layout/site-chrome";
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
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FB1HB2JTZ2"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FB1HB2JTZ2');
          `}
        </Script>
        <AuthGuard>
          <SiteChrome>{children}</SiteChrome>
        </AuthGuard>
        <CookieConsent />
        <Analytics />
      </body>
    </html>
  );
}
