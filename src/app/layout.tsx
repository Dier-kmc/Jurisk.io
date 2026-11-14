import type { Metadata } from "next";
import "@/app/globals.css";
import { SessionProvider } from "next-auth/react";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import DeviceDetector from "@/components/layout/DeviceDetector";

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
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-foreground min-h-screen flex flex-col relative">
        <AuthProvider>
          {children}
          <Toaster richColors theme="dark" position="top-center" />
          <DeviceDetector />
        </AuthProvider>
      </body>
    </html>
  );
}
