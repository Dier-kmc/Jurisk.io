import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jurisk.io - Analyse IA de contrats',
  description: 'Analysez vos contrats avec l\'IA. Identifiez risques, obligations et pouvoirs cachés.',
  keywords: ['contrat', 'analyse', 'IA', 'juridique', 'risques', 'obligations'],
  authors: [{ name: 'Jurisk.io' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://Jurisk.io.com',
    title: 'Jurisk.io - Analyse IA de contrats',
    description: 'Analysez vos contrats avec l\'IA. Identifiez risques, obligations et pouvoirs cachés.',
    siteName: 'Jurisk.io',
  },
};

// Layout corrigé
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="bg-background text-foreground min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
  );
}