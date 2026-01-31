"use client";

import { useReveal } from "@/lib/hooks/useReveal";

export default function LegalPage() {
  useReveal();

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.02)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Éditeur
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            Mentions <br />
            <span className="serif-display text-white/30">légales.</span>
          </h1>
          <p className="text-xl text-white/30 leading-relaxed">
            Jurisk.io est une solution éditée par Dier Holdings SAS.
          </p>
        </header>

        <div className="space-y-16 reveal border-t border-white/5 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-[10px] font-black tracking-widest uppercase text-white/20 mb-4">
                Société
              </h3>
              <p className="text-white/60 font-medium">
                Dier Holdings SAS
                <br />
                Capital de 50,000€
                <br />
                RCS Bordeaux B 123 456 789
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-black tracking-widest uppercase text-white/20 mb-4">
                Siège Social
              </h3>
              <p className="text-white/60 font-medium">
                8 Cité de la Lumière
                <br />
                33000 Bordeaux
                <br />
                France
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-black tracking-widest uppercase text-white/20 mb-4">
                Contact
              </h3>
              <p className="text-white/60 font-medium">
                legal@Jurisk.io.com
                <br />
                +33 5 00 00 00 00
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-black tracking-widest uppercase text-white/20 mb-4">
                Hébergement
              </h3>
              <p className="text-white/60 font-medium">
                CloudSovereign Infrastructure
                <br />
                Paris, France
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
