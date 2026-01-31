"use client";

import RiskMatrix from "@/components/results/RiskMatrix";

interface AnalysisRisksTabProps {
  risks: any[];
}

export default function AnalysisRisksTab({ risks }: AnalysisRisksTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-red-500/60 block mb-4">
              Cartographie du danger
            </span>
            <h3 className="serif-display text-4xl text-white">
              Matrice d'Exposition
            </h3>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                Critique
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
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
