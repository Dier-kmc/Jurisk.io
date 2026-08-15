"use client";

import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import ClauseEditor from "@/components/results/ClauseEditor";
import { ContractDissection } from "@/components/results/ContractDissection";

interface AnalysisClausesTabProps {
  criticalClauses: any[];
  showDetailedView: boolean;
  onCopy: (text: string) => void;
  analysisId: string;
  onSelectClause?: (clauseNumber: string) => void;
}

export default function AnalysisClausesTab({
  criticalClauses,
  showDetailedView,
  onCopy,
  analysisId,
  onSelectClause,
}: AnalysisClausesTabProps) {
  const handleSelectClause = onSelectClause ?? (() => {});
  return (
    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {criticalClauses.map((clause, index) => (
        <div
          key={index}
          className="p-8 rounded-xl bg-surface-1 border border-border relative overflow-hidden group hover:bg-surface-2 transition-all"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <Badge
                  className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    clause.priority === "high"
                      ? "bg-risk-high/10 text-risk-high border-risk-high/20"
                      : clause.priority === "medium"
                        ? "bg-risk-medium/10 text-risk-medium border-risk-medium/20"
                        : "bg-risk-low/10 text-risk-low border-risk-low/20"
                  }`}
                >
                  Prio: {clause.priority}
                </Badge>
                <h3 className="text-2xl font-bold text-foreground">
                  Art. {clause.clause_number} — {clause.title}
                </h3>
              </div>

              <div className="space-y-8">
                <div>
                  <span className="text-[9px] font-black tracking-widest text-faint uppercase block mb-3">
                    Diagnostic du problème
                  </span>
                  <p className="text-sm text-muted leading-relaxed">
                    {clause.problem}
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-surface-2 border border-border">
                  <span className="text-[9px] font-black tracking-widest text-accent/60 uppercase block mb-3">
                    Remédiation Préconisée
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {clause.proposed_solution}
                  </p>
                </div>
              </div>
            </div>

            {showDetailedView && (
              <div className="lg:w-80 flex-shrink-0">
                <div className="p-6 rounded-xl bg-surface-2 border border-border">
                  <ClauseEditor clause={clause} analysisId={analysisId} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-border">
            <button
              onClick={() =>
                onCopy(`${clause.clause_number}: ${clause.proposed_solution}`)
              }
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-faint hover:text-foreground transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copier la solution
            </button>
            <span className="text-[10px] font-black tracking-widest text-faint uppercase">
              Index. {index + 1}
            </span>
          </div>
        </div>
      ))}

      <ContractDissection
        clauses={criticalClauses}
        onSelectClause={handleSelectClause}
      />
    </div>
  );
}
