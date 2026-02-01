"use client";

import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import ClauseEditor from "@/components/results/ClauseEditor";

interface AnalysisClausesTabProps {
  criticalClauses: any[];
  showDetailedView: boolean;
  onCopy: (text: string) => void;
  analysisId: string;
}

export default function AnalysisClausesTab({
  criticalClauses,
  showDetailedView,
  onCopy,
  analysisId,
}: AnalysisClausesTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {criticalClauses.map((clause, index) => (
        <div
          key={index}
          className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Badge
                  className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    clause.priority === "high"
                      ? "bg-red-500/10 text-red-500 border-red-500/20"
                      : clause.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  }`}
                >
                  Prio: {clause.priority}
                </Badge>
                <h3 className="serif-display text-2xl text-white">
                  Art. {clause.clause_number} — {clause.title}
                </h3>
              </div>

              <div className="space-y-8">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block mb-3">
                    Diagnostic du problème
                  </span>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {clause.problem}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#050505] border border-white/5">
                  <span className="text-[9px] font-black tracking-widest text-yellow-500/60 uppercase block mb-3">
                    Remédiation Préconisée
                  </span>
                  <p className="text-sm text-white leading-relaxed">
                    {clause.proposed_solution}
                  </p>
                </div>
              </div>
            </div>

            {showDetailedView && (
              <div className="lg:w-80 flex-shrink-0">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <ClauseEditor clause={clause} analysisId={analysisId} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-white/5">
            <button
              onClick={() =>
                onCopy(`${clause.clause_number}: ${clause.proposed_solution}`)
              }
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copier la solution
            </button>
            <span className="text-[10px] font-black tracking-widest text-white/10 uppercase">
              Index. {index + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
