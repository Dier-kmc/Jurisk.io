"use client";

import { Scale } from "lucide-react";

export default function AnalysisDisclaimer() {
  return (
    <div className="mt-24 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden text-center max-w-4xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/5 blur-[100px] -z-10" />
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-2">
          <Scale className="w-5 h-5 text-white/20" />
        </div>
        <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">
          Protocole de Responsabilité
        </h4>
        <p className="serif-display text-2xl text-white/60 leading-relaxed max-w-2xl">
          Cette analyse constitue une{" "}
          <span className="text-white italic">
            aide à la décision stratégique
          </span>{" "}
          et ne remplace en aucun cas un avis juridique formel émis par un
          cabinet d'avocats.
        </p>
      </div>
    </div>
  );
}
