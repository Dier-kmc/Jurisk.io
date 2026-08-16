"use client";
import { useEffect, useState } from "react";
import type { Clause } from "@/types/contract";

interface ContractDissectionProps {
  clauses: Clause[];
  onSelectClause?: (clauseNumber: string) => void;
}

const priorityColor: Record<string, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
};

export function ContractDissection({ clauses, onSelectClause }: ContractDissectionProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (clauses.length === 0) return;
    const id = setInterval(() => {
      setRevealed((r) => {
        if (r >= clauses.length) {
          clearInterval(id);
          return r;
        }
        return r + 1;
      });
    }, 220);
    return () => clearInterval(id);
  }, [clauses.length]);

  if (clauses.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-1 p-8 text-sm text-muted">
        Aucune clause critique détectée.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
          Dissection du contrat
        </span>
        <span className="text-[10px] font-medium text-accent tnum">
          {revealed}/{clauses.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {clauses.slice(0, revealed).map((clause) => (
          <li key={clause.clause_number}>
            <button
              onClick={() => onSelectClause?.(clause.clause_number)}
              className="w-full flex items-start gap-4 px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityColor[clause.priority] ?? "bg-faint"}`} />
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold text-foreground">
                  {clause.title || `Clause ${clause.clause_number}`}
                </span>
                {clause.problem && (
                  <span className="mt-0.5 block text-xs text-muted line-clamp-2">{clause.problem}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}