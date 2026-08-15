"use client";

import { Clock } from "lucide-react";

interface AnalysisTimelineProps {
  riskTimeline: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
}

export default function AnalysisTimeline({
  riskTimeline,
}: AnalysisTimelineProps) {
  const phases = [
    {
      label: "Phase Immédiate",
      sub: "0 - 30 Jours",
      color: "text-risk-high",
      items: riskTimeline.immediate,
    },
    {
      label: "Court Terme",
      sub: "1 - 3 Mois",
      color: "text-accent",
      items: riskTimeline.short_term,
    },
    {
      label: "Projection Longue",
      sub: "+3 Mois",
      color: "text-accent/60",
      items: riskTimeline.long_term,
    },
  ];

  return (
    <div className="mt-16 p-12 rounded-xl bg-surface-1 border border-border relative overflow-hidden">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
          <Clock className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="text-4xl font-bold text-foreground">
            Trajectoire de Sécurité
          </h3>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-faint mt-2">
            Chronologie d'action immédiate et long terme
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {phases.map((phase, i) => (
          <div key={i} className="space-y-6">
            <div>
              <h4 className={`text-2xl font-bold ${phase.color} mb-1`}>
                {phase.label}
              </h4>
              <span className="text-[9px] font-black tracking-widest text-faint uppercase">
                {phase.sub}
              </span>
            </div>
            <ul className="space-y-4">
              {phase.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 items-start p-4 rounded-xl bg-surface-2 border border-border"
                >
                  <div
                    className={`w-1 h-1 rounded-full ${phase.color.replace("text-", "bg-")} mt-1.5`}
                  />
                  <p className="text-xs text-muted leading-relaxed font-medium">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
