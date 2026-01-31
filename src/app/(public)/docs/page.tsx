"use client";

import { useReveal } from "@/lib/hooks/useReveal";
import { BookOpen, Search, Code, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  useReveal();

  const sections = [
    {
      title: "Démarrage rapide",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      items: ["Installation", "Première analyse", "Configuration du compte"],
    },
    {
      title: "Analyse IA",
      icon: <Search className="w-6 h-6 text-yellow-500" />,
      items: [
        "Modèles de langage",
        "Détection des risques",
        "Rapports d'analyse",
      ],
    },
    {
      title: "API & Intégrations",
      icon: <Code className="w-6 h-6 text-yellow-500" />,
      items: ["Webhooks", "Authentification API", "SDK Node.js"],
    },
    {
      title: "Sécurité",
      icon: <Shield className="w-6 h-6 text-yellow-500" />,
      items: [
        "Chiffrement AES-256",
        "Conformité RGPD",
        "Hébergement souverain",
      ],
    },
  ];

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 px-6">
        <header className="max-w-4xl mb-24 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Ressources
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Centre de <br />
            <span className="serif-display text-white/30">connaissances.</span>
          </h1>
          <p className="max-w-xl text-xl text-white/30 leading-relaxed">
            Tout ce dont vous avez besoin pour intégrer Jurisk.io à votre
            flux de travail juridique. Guide complet, API et bonnes pratiques.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal">
          {sections.map((section, i) => (
            <div
              key={i}
              className="glass-card p-12 rounded-[3rem] border-white/5 group hover:border-yellow-500/20 transition-all"
            >
              <div className="mb-8 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                {section.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.items.map((item, j) => (
                  <li key={j}>
                    <Link
                      href="#"
                      className="text-white/40 hover:text-white transition-colors flex items-center group/link"
                    >
                      <div className="w-1 h-4 bg-white/10 mr-4 group-hover/link:bg-yellow-500 transition-colors" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-40 p-16 glass-card rounded-[4rem] text-center border-yellow-500/10 reveal">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
            Besoin d&apos;aide{" "}
            <span className="serif-display text-white/40">personnalisée ?</span>
          </h2>
          <button className="px-12 py-5 rounded-full bg-white text-black font-black text-lg hover:bg-gray-200 transition-all">
            Contacter le Support Expert
          </button>
        </div>
      </div>
    </div>
  );
}
