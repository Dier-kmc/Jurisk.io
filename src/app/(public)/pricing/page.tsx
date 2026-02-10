"use client";

import { Check, Zap, Shield, CreditCard, Gift } from "lucide-react";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { CREDIT_PACKS } from "@/lib/constants/plans";
import Link from "next/link";
import { useReveal } from "@/lib/hooks/useReveal";
import { useState } from "react";
import RegisterModal from "@/components/auth/RegisterModal";
import LoginModal from "@/components/auth/LoginModal";

export default function PricingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
  useReveal();

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };
  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-24 overflow-hidden relative">
      {/* Background Depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="container max-w-7xl relative z-10 px-6">
        {/* Editorial Header */}
        <div className="max-w-4xl mb-24 animate-slide-up mx-auto text-center">
          <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
            Crédits à la carte
          </span>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold tracking-tighter leading-[0.95] text-white mb-8">
            Analysez{" "}
            <span className="serif-display text-white/30 italic">
              votre rythme.
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xl text-white/40 leading-relaxed">
            Pas d'abonnement, pas d'engagement. Achetez des crédits quand vous
            en avez besoin. Profitez de{" "}
            <strong className="text-white">3 crédits offerts</strong> chaque
            mois.
          </p>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end reveal max-w-6xl mx-auto">
          {CREDIT_PACKS.map((pack, index) => (
            <div
              key={pack.id}
              className={`p-10 glass-card rounded-[2.5rem] relative group transition-all duration-500 hover:-translate-y-2
                ${
                  pack.popular
                    ? "bg-gradient-to-b from-white/[0.08] to-black/80 border-yellow-500/20 shadow-2xl shadow-yellow-900/10 z-10 scale-105"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-black tracking-widest uppercase">
                  {pack.badge || "Populaire"}
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-4 block">
                  {pack.name}
                </span>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-black text-white">
                    {pack.credits}
                  </span>
                  <span className="text-lg font-medium text-white/40">
                    crédits
                  </span>
                </div>
                <div className="text-2xl text-yellow-500 font-bold">
                  {pack.price}€
                </div>
                <p className="text-xs text-white/30 mt-2 h-8">
                  {pack.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {pack.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-white/60"
                  >
                    <Check
                      className={`w-4 h-4 mt-0.5 ${pack.popular ? "text-yellow-500" : "text-white/20"}`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action */}
              <Link href="/upload" className="block">
                <CustomButton
                  fullWidth
                  className={`h-14 rounded-2xl font-bold text-lg transition-all
                    ${
                      pack.popular
                        ? "bg-yellow-600 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/20"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                >
                  Choisir ce pack
                </CustomButton>
              </Link>
            </div>
          ))}
        </div>

        {/* Free Tier Info */}
        <div className="mt-24 max-w-4xl mx-auto rounded-[3rem] bg-white/[0.02] border border-white/5 p-12 relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center shrink-0">
              <Gift className="w-10 h-10 text-yellow-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Toujours gratuit pour commencer
              </h3>
              <p className="text-white/40 leading-relaxed">
                Chaque mois, nous rechargeons votre compte avec{" "}
                <strong className="text-white">3 crédits gratuits</strong>.
                Utilisez-les pour analyser vos contrats, sans carte bancaire ni
                engagement. Si vous avez besoin de plus, nos packs sont là.
              </p>
            </div>
              <CustomButton
              onClick={handleRegisterClick}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                Créer un compte
              </CustomButton>
          </div>
        </div>

        {/* Technical Footer */}
        <div className="mt-32 pt-16 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-12 reveal opacity-50 hover:opacity-100 transition-opacity">
          {[
            { label: "Paiement", val: "Stripe Secure" },
            { label: "Validité", val: "Illimitée" },
            { label: "Facturation", val: "TVA Incluse" },
            { label: "Support", val: "24/7 Expert" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center md:items-start">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/30 mb-2">
                {stat.label}
              </span>
              <span className="text-sm font-bold text-white/60">
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleRegisterClick}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleLoginClick}
      />
    </div>
  );
}
