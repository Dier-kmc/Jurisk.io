"use client";

import { RiskGauge } from "@/components/results/RiskGauge";

interface AnalysisHeroProps {
  summary: {
    global_risk_score: number;
    balance_score: number;
    clarity_score: number;
  };
}

export default function AnalysisHero({ summary }: AnalysisHeroProps) {
  return (
    <div className="mb-16">
      <div className="mb-10">
        <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent/60 block mb-4">
          Indicateurs contractuels
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Vue d'ensemble des scores
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 rounded-xl bg-surface-1 border border-border">
        <RiskGauge value={summary.global_risk_score} label="Risque global" />
        <RiskGauge value={summary.balance_score} label="Équilibre" invert />
        <RiskGauge value={summary.clarity_score} label="Clarté" invert />
      </div>
    </div>
  );
}