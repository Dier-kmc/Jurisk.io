"use client";

import { Badge } from "@/components/ui/badge";
import { Zap, Brain, Sparkles } from "lucide-react";
import RiskMatrix from "@/components/results/RiskMatrix";

interface AnalysisOverviewProps {
  analysis: any;
  showDetailedView: boolean;
}

export default function AnalysisOverview({
  analysis,
  showDetailedView,
}: AnalysisOverviewProps) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Analyse des parties */}
        <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="mb-10">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-yellow-500/60 block mb-4">
              Équilibre des forces
            </span>
            <h3 className="serif-display text-4xl text-white">
              Analyse Comparative
            </h3>
          </div>

          <div className="space-y-10">
            {[
              analysis.party_analysis.party_a,
              analysis.party_analysis.party_b,
            ].map((party, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${index === 0 ? "bg-yellow-500" : "bg-purple-500"} shadow-[0_0_12px_rgba(234,179,8,0.4)]`}
                    />
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      {party.party_name}
                    </h4>
                  </div>
                  <Badge className="bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-white/40">
                    SCORE:{" "}
                    {party.negotiation_power === "strong"
                      ? "MAXIMAL"
                      : "MÉDIAN"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                  <div className="bg-[#050505] p-6 text-center">
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block mb-1">
                      Impact Risque
                    </span>
                    <span className="text-2xl font-bold text-white tracking-tighter">
                      {party.risk_score}
                    </span>
                  </div>
                  <div className="bg-[#050505] p-6 text-center">
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block mb-1">
                      Opportunité
                    </span>
                    <span className="text-2xl font-bold text-white tracking-tighter">
                      {party.opportunity_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scénarios probables */}
        <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden">
          <div className="mb-10">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-emerald-500/60 block mb-4">
              Projection temporelle
            </span>
            <h3 className="serif-display text-4xl text-white">
              Scénarios Probables
            </h3>
          </div>

          <div className="space-y-6">
            {analysis.probable_scenarios.map((scenario: any, index: number) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-[#050505] border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-base font-bold text-white tracking-tight">
                    {scenario.scenario}
                  </h4>
                  <span className="serif-display text-2xl text-white/10 group-hover:text-emerald-500/20 transition-colors">
                    {scenario.probability}%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase mb-3 block">
                      Conséquence A
                    </span>
                    <ul className="space-y-2">
                      {scenario.consequences_party_a
                        .slice(0, 2)
                        .map((cons: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-white/40 leading-relaxed"
                          >
                            • {cons}
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[9px] font-black tracking-widest text-white/20 uppercase mb-3 block">
                      Conséquence B
                    </span>
                    <ul className="space-y-2">
                      {scenario.consequences_party_b
                        .slice(0, 2)
                        .map((cons: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-white/40 leading-relaxed"
                          >
                            • {cons}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points clés et conseils */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
            <h3 className="serif-display text-3xl text-white">
              Points de Vigilance
            </h3>
          </div>
          <div className="space-y-4">
            {analysis.summary.key_points.map((point: string, index: number) => (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 items-start group hover:bg-white/[0.04] transition-colors"
              >
                <span className="serif-display text-3xl text-white/10 group-hover:text-yellow-500/40 transition-colors leading-none">
                  0{index + 1}
                </span>
                <p className="text-sm text-white/60 leading-relaxed pt-1">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Brain className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="serif-display text-3xl text-white">
              Conseils Stratégiques
            </h3>
          </div>
          <div className="space-y-4">
            {analysis.summary.strategic_advice.map(
              (conseil: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 items-start group hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full border border-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-purple-500/40 group-hover:text-purple-500 transition-colors" />
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed pt-1">
                    {conseil}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Matrice des risques */}
      {showDetailedView && <RiskMatrix risks={analysis.risks} />}
    </div>
  );
}
