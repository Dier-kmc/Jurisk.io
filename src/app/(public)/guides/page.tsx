"use client";

import { useReveal } from "@/lib/hooks/useReveal";
import { Book, CheckCircle2, FileText, Zap } from "lucide-react";

export default function GuidesPage() {
  useReveal();

  const guides = [
    {
      title: "Optimiser vos revues",
      desc: "Comment structurer vos dossiers pour une analyse IA parfaite.",
      icon: <Zap className="w-5 h-5" />,
    },
    {
      title: "Négociation Augmentée",
      desc: "Utiliser Jurisk.io en temps réel lors de vos visio-conférences.",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "Cloud Souverain",
      desc: "Comprendre où et comment vos documents sont sécurisés.",
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 px-6">
        <header className="max-w-4xl mb-32 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Support
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Guides <br />
            <span className="serif-display text-white/30">
              d&apos;utilisation.
            </span>
          </h1>
          <p className="max-w-xl text-xl text-white/30 leading-relaxed">
            Des tutoriels étape par étape pour maîtriser chaque facette de notre
            technologie.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 reveal">
          {guides.map((guide, i) => (
            <div key={i} className="flex flex-col gap-8 group">
              <div className="aspect-square bg-white/[0.02] border border-white/10 rounded-[3rem] flex items-center justify-center group-hover:border-yellow-500/20 transition-all overflow-hidden relative">
                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Book className="w-16 h-16 text-white/5" />
              </div>
              <div>
                <div className="flex items-center gap-3 text-yellow-500 mb-4">
                  {guide.icon}
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    Guide Pratique
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                  {guide.title}
                </h3>
                <p className="text-white/30 leading-relaxed">{guide.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
