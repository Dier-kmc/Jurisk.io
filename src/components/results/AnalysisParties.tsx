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
              className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group hover:bg-white/[0.04] transition-all"
            >
              <div className="flex flex-col gap-10">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white/40" />
                    </div>
                    <div>
                      <h3 className="serif-display text-3xl text-white">
                        {partieInfo.name}
                      </h3>
                      <span className="text-[10px] font-black tracking-widest uppercase text-white/20">
                        {partieInfo.role} • {partieInfo.legal_status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                    <div className="bg-[#050505] p-6 text-center">
                      <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block mb-1">
                        Risque
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
                    <div className="bg-[#050505] p-6 text-center">
                      <span className="text-[9px] font-black tracking-widest text-white/20 uppercase block mb-1">
                        Pouvoir
                      </span>
                      <span className="text-[10px] font-black text-yellow-500 uppercase">
                        {party.negotiation_power}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-red-500/60 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      Exposition Critique
                    </h4>
                    <ul className="space-y-4">
                      {party.major_risks.map(
                        (risque: string, index: number) => (
                          <li key={index} className="flex gap-4 items-start">
                            <span className="text-white/10 text-xs font-bold pt-0.5">
                              0{index + 1}
                            </span>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {risque}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-500/60 mb-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Leviers Stratégiques
                    </h4>
                    <ul className="space-y-4">
                      {party.advantages.map(
                        (advantage: string, index: number) => (
                          <li key={index} className="flex gap-4 items-start">
                            <span className="text-white/10 text-xs font-bold pt-0.5">
                              0{index + 1}
                            </span>
                            <p className="text-sm text-white/60 leading-relaxed">
                              {advantage}
                            </p>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-white/20 mb-6">
                      Recommandations Proximales
                    </h4>
                    <div className="space-y-3">
                      {party.specific_recommendations.map(
                        (reco: string, index: number) => (
                          <div
                            key={index}
                            className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
                          >
                            <p className="text-xs text-white/40 leading-relaxed italic">
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
