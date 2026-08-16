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
        <div className="p-10 rounded-xl bg-surface-1 border border-border relative overflow-hidden">
          <div className="mb-10">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent/60 block mb-4">
              Équilibre des forces
            </span>
            <h3 className="text-4xl font-bold text-foreground">
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
                      className={`w-2 h-2 rounded-full ${index === 0 ? "bg-accent" : "bg-accent/60"}`}
                    />
                    <h4 className="text-xl font-bold text-foreground tracking-tight">
                      {party.party_name}
                    </h4>
                  </div>
                  <Badge className="bg-surface-2 border-border text-[9px] font-black uppercase tracking-widest text-muted">
                    SCORE:{" "}
                    {party.negotiation_power === "strong"
                      ? "MAXIMAL"
                      : "MÉDIAN"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
                  <div className="bg-surface-2 p-6 text-center">
                    <span className="text-[9px] font-black tracking-widest text-faint uppercase block mb-1">
                      Impact Risque
                    </span>
                    <span className="text-2xl font-bold text-foreground tracking-tighter">
                      {party.risk_score}
                    </span>
                  </div>
                  <div className="bg-surface-2 p-6 text-center">
                    <span className="text-[9px] font-black tracking-widest text-faint uppercase block mb-1">
                      Opportunité
                    </span>
                    <span className="text-2xl font-bold text-foreground tracking-tighter">
                      {party.opportunity_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scénarios probables */}
        <div className="p-10 rounded-xl bg-surface-1 border border-border relative overflow-hidden">
          <div className="mb-10">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-accent/60 block mb-4">
              Projection temporelle
            </span>
            <h3 className="text-4xl font-bold text-foreground">
              Scénarios Probables
            </h3>
          </div>

          <div className="space-y-6">
            {!analysis.probable_scenarios ||
            analysis.probable_scenarios.length === 0 ? (
              <div className="p-8 rounded-xl bg-surface-1 border border-border text-center">
                <p className="text-faint italic">
                  Aucun scénario critique n'a été identifié pour ce contrat.
                </p>
              </div>
            ) : (
              analysis.probable_scenarios.map(
                (scenario: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl bg-surface-2 border border-border hover:border-white/20 transition-all group"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-base font-bold text-foreground tracking-tight">
                        {scenario.scenario}
                      </h4>
                      <span className="text-2xl font-bold text-faint group-hover:text-accent/40 transition-colors">
                        {scenario.probability}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-faint uppercase mb-3 block">
                          Conséquence A
                        </span>
                        <ul className="space-y-2">
                          {scenario.consequences_party_a
                            .slice(0, 2)
                            .map((cons: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs text-muted leading-relaxed"
                              >
                                • {cons}
                              </li>
                            ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[9px] font-black tracking-widest text-faint uppercase mb-3 block">
                          Conséquence B
                        </span>
                        <ul className="space-y-2">
                          {scenario.consequences_party_b
                            .slice(0, 2)
                            .map((cons: string, i: number) => (
                              <li
                                key={i}
                                className="text-xs text-muted leading-relaxed"
                              >
                                • {cons}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </div>
      </div>

      {/* Points clés et conseils */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <Zap className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              Points de Vigilance
            </h3>
          </div>
          <div className="space-y-4">
            {analysis.summary.key_points.map((point: string, index: number) => (
              <div
                key={index}
                className="flex gap-6 p-6 rounded-xl bg-surface-1 border border-border items-start group hover:bg-surface-2 transition-colors"
              >
                <span className="text-3xl font-bold text-faint group-hover:text-accent/40 transition-colors leading-none">
                  0{index + 1}
                </span>
                <p className="text-sm text-muted leading-relaxed pt-1">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              Conseils Stratégiques
            </h3>
          </div>
          <div className="space-y-4">
            {analysis.summary.strategic_advice.map(
              (conseil: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 p-6 rounded-xl bg-surface-1 border border-border items-start group hover:bg-surface-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full border border-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-accent/40 group-hover:text-accent transition-colors" />
                  </div>
                  <p className="text-sm text-muted leading-relaxed pt-1">
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
