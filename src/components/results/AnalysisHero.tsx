"use client";

import { Badge } from "@/components/ui/badge";

interface AnalysisHeroProps {
  summary: {
    global_risk_score: number;
    balance_score: number;
    clarity_score: number;
  };
}

export default function AnalysisHero({ summary }: AnalysisHeroProps) {
  const stats = [
    {
      label: "Score de Risque",
      val: summary.global_risk_score,
      color: "from-red-500 to-amber-500",
      desc:
        summary.global_risk_score < 30
          ? "Sécurisé"
          : summary.global_risk_score < 70
            ? "Vigilance"
            : "Critique",
    },
    {
      label: "Équilibre",
      val: summary.balance_score,
      color: "from-blue-500 to-emerald-500",
      desc:
        summary.balance_score > 70
          ? "Souverain"
          : summary.balance_score > 40
            ? "Disputé"
            : "Déséquilibré",
    },
    {
      label: "Clarté",
      val: summary.clarity_score,
      color: "from-purple-500 to-pink-500",
      desc:
        summary.clarity_score > 80
          ? "Cristalline"
          : summary.clarity_score > 50
            ? "Lisible"
            : "Opaque",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/10"
        >
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] blur-3xl group-hover:opacity-10 transition-opacity`}
          />

          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20">
              {stat.label}
            </span>
            <Badge
              className={`bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40`}
            >
              {stat.desc}
            </Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className={`serif-display text-7xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.val}
            </span>
            <span className="text-white/10 text-xl font-bold">/100</span>
          </div>

          <div className="mt-8 h-[2px] bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-1000 ease-out`}
              style={{ width: `${stat.val}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
