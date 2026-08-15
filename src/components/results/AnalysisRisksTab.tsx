"use client";

import RiskMatrix from "@/components/results/RiskMatrix";

interface AnalysisRisksTabProps {
  risks: any[];
}

export default function AnalysisRisksTab({ risks }: AnalysisRisksTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="p-10 rounded-xl bg-surface-1 border border-border relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-risk-high/60 block mb-4">
              Cartographie du danger
            </span>
            <h3 className="text-4xl font-bold text-foreground">
              Matrice d'Exposition
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface-2">
              <div className="w-2 h-2 rounded-full bg-risk-high" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Critique
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface-2">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Important
              </span>
            </div>
          </div>
        </div>

        <RiskMatrix risks={risks} />
      </div>
    </div>
  );
}
