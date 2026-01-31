"use client";

import { Brain, Cpu, Sparkles } from "lucide-react";

interface AnalysisLoadingProps {
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

export default function AnalysisLoading({ status }: AnalysisLoadingProps) {
  if (status === "PROCESSING") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
        <div className="noise-overlay" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05)_0%,transparent_50%)]" />

        <div className="relative z-10 text-center max-w-2xl px-6">
          <div className="mb-16">
            <div className="relative inline-block">
              <Sparkles className="w-16 h-16 text-yellow-500/40 absolute -top-8 -right-8 animate-pulse" />
              <Cpu className="w-24 h-24 text-white/10 animate-pulse" />
            </div>
          </div>

          <h1 className="serif-display text-5xl md:text-6xl text-white mb-8 leading-[1.1]">
            Chirurgie de la <br />{" "}
            <span className="gradient-subtle">Structure Contractuelle</span>
          </h1>

          <div className="space-y-8 max-w-md mx-auto">
            <div className="h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent w-full animate-progress-flow" />
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[
                { label: "Risques", status: "Scan" },
                { label: "Obligations", status: "Analyse" },
                { label: "Pouvoirs", status: "Calcul" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <span className="text-[9px] font-black tracking-widest uppercase text-white/20 mb-1">
                    {item.label}
                  </span>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-yellow-500 animate-ping" />
                    <span className="text-[10px] text-white/40">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default initial loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      <div className="noise-overlay" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.05)_0%,transparent_50%)]" />

      <div className="relative z-10 text-center">
        <div className="mb-12 relative inline-block">
          <div className="absolute inset-0 bg-yellow-500/20 blur-3xl animate-pulse rounded-full" />
          <Brain className="w-20 h-20 text-yellow-500 relative animate-float stagger-2" />
        </div>
        <h2 className="serif-display text-4xl md:text-5xl text-white mb-6 tracking-tight animate-slide-up">
          Extraction de la{" "}
          <span className="gradient-subtle italic">lucidité</span>...
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="w-1 h-1 rounded-full bg-yellow-500/40 animate-ping" />
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20">
            Protocole de précision en cours
          </p>
        </div>
      </div>
    </div>
  );
}
