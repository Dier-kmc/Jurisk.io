"use client";

import { useReveal } from "@/lib/hooks/useReveal";
import { CheckCircle2 } from "lucide-react";

export default function StatusPage() {
  useReveal();

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-4xl relative z-10 px-6">
        <header className="mb-24 animate-slide-up">
          <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Temps réel
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            État des <br />
            <span className="text-white/30">systèmes.</span>
          </h1>
        </header>

        <div className="reveal">
          <div className="p-12 glass-card rounded-xl border-green-500/10 bg-green-500/[0.01] flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight uppercase">
                Tous les systèmes sont opérationnels
              </h2>
              <p className="text-green-500/60 font-medium">
                Uptime moyen de 99.98% au cours des 30 derniers jours.
              </p>
            </div>
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Analyse IA", status: "Opérationnel" },
              { name: "API Gateway", status: "Non-Opérationnel" },
              { name: "Dashboard Client", status: "Opérationnel" },
              { name: "Export Documents", status: "Non-Opérationnel" },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 glass-card rounded-3xl border-white/5 flex justify-between items-center group"
              >
                <span className="font-bold text-white/60 group-hover:text-white transition-colors">
                  {s.name}
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase text-green-500">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
