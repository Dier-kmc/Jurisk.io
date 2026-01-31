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
      color: "text-red-500",
      items: riskTimeline.immediate,
    },
    {
      label: "Court Terme",
      sub: "1 - 3 Mois",
      color: "text-yellow-500",
      items: riskTimeline.short_term,
    },
    {
      label: "Projection Longue",
      sub: "+3 Mois",
      color: "text-blue-500",
      items: riskTimeline.long_term,
    },
  ];

  return (
    <div className="mt-16 p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
          <Clock className="w-5 h-5 text-yellow-500" />
        </div>
        <div>
          <h3 className="serif-display text-4xl text-white">
            Trajectoire de Sécurité
          </h3>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 mt-2">
            Chronologie d'action immédiate et long terme
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {phases.map((phase, i) => (
          <div key={i} className="space-y-6">
            <div>
              <h4 className={`serif-display text-2xl ${phase.color} mb-1`}>
                {phase.label}
              </h4>
              <span className="text-[9px] font-black tracking-widest text-white/10 uppercase">
                {phase.sub}
              </span>
            </div>
            <ul className="space-y-4">
              {phase.items.map((item, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 items-start p-4 rounded-xl bg-[#050505] border border-white/5"
                >
                  <div
                    className={`w-1 h-1 rounded-full ${phase.color.replace("text-", "bg-")} mt-1.5`}
                  />
                  <p className="text-xs text-white/40 leading-relaxed font-medium">
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
