"use client";

import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AnalysisPartiesProps {
  analysis: any;
}

export default function AnalysisParties({ analysis }: AnalysisPartiesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {Object.entries(analysis.party_analysis).map(
        ([key, party]: [string, any]) => {
          const partieInfo =
            key === "party_a"
              ? analysis.identified_parties.party_a
              : analysis.identified_parties.party_b;

          return (
            <div
              key={key}
              className="p-10 rounded-xl bg-surface-1 border border-border relative overflow-hidden group hover:bg-surface-2 transition-all"
            >
              <div className="flex flex-col gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center">
                      <Users className="w-5 h-5 text-muted" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold text-foreground">
                        {partieInfo.name}
                      </h3>
                      <span className="text-[10px] font-black tracking-widest uppercase text-faint">
                        {partieInfo.role} • {partieInfo.legal_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
                    <div className="bg-surface-2 p-6 text-center">
                      <span className="text-[9px] font-black tracking-widest text-faint uppercase block mb-1">
                        Risque
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
                    <div className="bg-surface-2 p-6 text-center">
                      <span className="text-[9px] font-black tracking-widest text-faint uppercase block mb-1">
                        Pouvoir
                      </span>
                      <span className="text-[10px] font-black text-accent uppercase">
                        {party.negotiation_power}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-risk-high/60 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-risk-high" />
                      Exposition Critique
                    </h4>
                    <ul className="space-y-4">
                      {party.major_risks.map(
                        (risque: string, index: number) => (
                          <li key={index} className="flex gap-4 items-start">
                            <span className="text-faint text-xs font-bold pt-0.5">
                              0{index + 1}
                            </span>
                            <p className="text-sm text-muted leading-relaxed">
                              {risque}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-risk-low/60 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-risk-low" />
                      Leviers Stratégiques
                    </h4>
                    <ul className="space-y-4">
                      {party.advantages.map(
                        (advantage: string, index: number) => (
                          <li key={index} className="flex gap-4 items-start">
                            <span className="text-faint text-xs font-bold pt-0.5">
                              0{index + 1}
                            </span>
                            <p className="text-sm text-muted leading-relaxed">
                              {advantage}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="pt-8 border-t border-border">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-faint mb-6">
                      Recommandations Proximales
                    </h4>
                    <div className="space-y-3">
                      {party.specific_recommendations.map(
                        (reco: string, index: number) => (
                          <div
                            key={index}
                            className="p-5 rounded-xl bg-surface-1 border border-border"
                          >
                            <p className="text-xs text-muted leading-relaxed italic">
                              "{reco}"
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
