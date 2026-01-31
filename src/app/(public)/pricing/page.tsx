"use client";

import { useState } from "react";
import {
  Check,
  HelpCircle,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
  Globe,
} from "lucide-react";
import PricingCard from "@/components/pricing/PricingCard";
import FeatureList from "@/components/pricing/FeatureList";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { PLANS } from "@/lib/constants/plans";
import Link from "next/link";
import { useReveal } from "@/lib/hooks/useReveal";

export default function PricingPage() {
  useReveal();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly",
  );

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 overflow-hidden relative">
      {/* Background Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 px-6">
        {/* Editorial Header */}
        <div className="max-w-4xl mb-32 animate-slide-up">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Tarification
          </span>
          <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-bold tracking-tighter leading-[0.9] text-white mb-12">
            L&apos;expertise <br />
            <span className="serif-display text-white/30">
              sans la latence.
            </span>
          </h1>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <p className="max-w-md text-xl text-white/30 leading-relaxed">
              Choisissez le calibre d&apos;analyse qui correspond à votre
              ambition. Des outils conçus pour les cabinets exigeants.
            </p>

            {/* Interactive Switcher - Styled as high-end toggle */}
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/10 p-2 rounded-full backdrop-blur-xl">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all ${billingPeriod === "monthly" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase transition-all relative ${billingPeriod === "yearly" ? "bg-white text-black" : "text-white/40 hover:text-white"}`}
              >
                Annuel
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              </button>
            </div>
          </div>
        </div>

        {/* Imbalanced Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start reveal">
          {/* Plan: Free - Ghostly/Minimalist */}
          <div className="lg:col-span-2 p-12 glass-card rounded-[3rem] border-white/5 opacity-60 hover:opacity-100 transition-opacity duration-700">
            <span className="text-[10px] font-black tracking-widest uppercase text-white/40 mb-12 block">
              Le Départ
            </span>
            <h3 className="text-3xl font-bold text-white mb-4 italic">
              Essentiel
            </h3>
            <div className="text-5xl font-black mb-12">
              0€{" "}
              <span className="text-sm font-medium text-white/20">/mois</span>
            </div>

            <ul className="space-y-6 mb-20 text-sm text-white/40 font-medium">
              <li className="flex items-center gap-4">
                <div className="w-1 h-3 bg-white/10" /> 3 analyses par mois
              </li>
              <li className="flex items-center gap-4">
                <div className="w-1 h-3 bg-white/10" /> Rapports PDF simples
              </li>
              <li className="flex items-center gap-4">
                <div className="w-1 h-3 bg-white/10" /> Support standard
              </li>
            </ul>

            <Link href="/upload" className="block">
              <button className="w-full py-5 rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-all">
                Commencer
              </button>
            </Link>
          </div>

          {/* Plan: Premium - The "Vignette" of Power */}
          <div className="lg:col-span-3 p-16 glass-card rounded-[4rem] border-yellow-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <Zap className="w-64 h-64 -rotate-12 group-hover:text-yellow-500 transition-colors duration-[2s]" />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-16">
                <div>
                  <span className="text-yellow-500 text-[10px] font-black tracking-widest uppercase mb-4 block">
                    Le Standard Senior
                  </span>
                  <h3 className="text-5xl font-bold text-white mb-2">
                    Premium
                  </h3>
                </div>
                <div className="text-6xl font-black text-white">
                  {billingPeriod === "yearly" ? "3.99" : "4.99"}€
                </div>
              </div>

              <p className="text-xl text-white/40 mb-16 leading-relaxed max-w-sm">
                L&apos;arsenal complet pour transformer votre gestion
                contractuelle en avantage compétitif.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-24">
                {[
                  "Analyses illimitées 24/7",
                  "Scrutin des risques critiques",
                  "Support prioritaire (1h)",
                  "Export Word éditable",
                  "Historique illimité",
                  "Intégration API",
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Check className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-semibold text-white/70">
                      {f}
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/upload" className="block">
                <CustomButton
                  size="lg"
                  className="w-full h-20 rounded-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-black text-xl shadow-[0_20px_40px_-10px_rgba(202,138,4,0.3)] hover:scale-[1.02] transition-transform"
                >
                  Acquérir la Puissance
                </CustomButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Technical Mastery Footer - Micro-stats */}
        <div className="mt-40 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 reveal">
          {[
            { label: "Modèle", val: "Legal-Instruct-v4" },
            { label: "GDPR", val: "Strict Compliant" },
            { label: "Uptime", val: "99.99%" },
            { label: "Certif", val: "ISO 27001 Ready" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center md:items-start">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/10 mb-2">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-white/40">
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
