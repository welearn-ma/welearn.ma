import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/navbar";
import { Breadcrumb } from "@/components/breadcrumb";
import { Footer } from "@/components/footer";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welearn - Formation Professionnelle Continue",
  description:
    "Welearn, votre partenaire de formation professionnelle dans les domaines du BTP, BIM, Engineering et Executive Education au Maroc et en Afrique.",
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
        <Analytics />
      </body>
    </html>
  );
}
