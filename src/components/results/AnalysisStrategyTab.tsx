"use client";

import NegotiationStrategy from "@/components/results/NegotiationStrategy";
import ScenarioSimulator from "@/components/results/ScenarioSimulator";

interface AnalysisStrategyTabProps {
  analysis: any;
}

export default function AnalysisStrategyTab({
  analysis,
}: AnalysisStrategyTabProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="p-10 rounded-xl bg-surface-1 border border-border relative overflow-hidden">
        <NegotiationStrategy
          parties={analysis.identified_parties}
          partyAnalysis={analysis.party_analysis}
          clauses={analysis.critical_clauses}
          summary={analysis.summary}
        />
        <div className="mt-12 pt-12 border-t border-border">
          <ScenarioSimulator scenarios={analysis.probable_scenarios} />
        </div>
      </div>
    </div>
  );
}
