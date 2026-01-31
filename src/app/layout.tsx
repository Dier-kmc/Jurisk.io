import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jurisk.io - Analyse IA de contrats",
  description:
    "Analysez vos contrats avec l'IA. Identifiez risques, obligations et pouvoirs cachés.",
  keywords: ["contrat", "analyse", "IA", "juridique", "risques", "obligations"],
  authors: [{ name: "Jurisk.io" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://Jurisk.io.com",
    title: "Jurisk.io - Analyse IA de contrats",
    description:
      "Analysez vos contrats avec l'IA. Identifiez risques, obligations et pouvoirs cachés.",
    siteName: "Jurisk.io",
  },
};

// Layout corrigé
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-black text-white min-h-screen flex flex-col relative">
        <div className="noise-overlay" />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
