"use client";

import { Scale } from "lucide-react";

export default function AnalysisDisclaimer() {
  return (
    <div className="mt-24 p-12 rounded-xl bg-surface-1 border border-border relative overflow-hidden text-center max-w-4xl mx-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-risk-high/5 blur-[100px] -z-10" />
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-2">
          <Scale className="w-5 h-5 text-muted" />
        </div>
        <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-faint">
          Protocole de Responsabilité
        </h4>
        <p className="text-2xl text-muted leading-relaxed max-w-2xl">
          Cette analyse constitue une{" "}
          <span className="text-foreground italic">
            aide à la décision stratégique
          </span>{" "}
          et ne remplace en aucun cas un avis juridique formel émis par un
          cabinet d'avocats.
        </p>
      </div>
    </div>
  );
}
