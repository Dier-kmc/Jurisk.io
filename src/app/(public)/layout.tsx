import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import "@/app/globals.css";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ContractScope - Analyse IA de contrats',
  description: 'Analysez vos contrats avec l\'IA. Identifiez risques, obligations et pouvoirs cachés.',
  keywords: ['contrat', 'analyse', 'IA', 'juridique', 'risques', 'obligations'],
  authors: [{ name: 'ContractScope' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://contractscope.com',
    title: 'ContractScope - Analyse IA de contrats',
    description: 'Analysez vos contrats avec l\'IA. Identifiez risques, obligations et pouvoirs cachés.',
    siteName: 'ContractScope',
  },
};

// Layout corrigé
export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#111111] text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}