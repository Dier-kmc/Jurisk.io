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
import Button, { CustomButton } from "@/components/ui/custom/CustomButton";
import { PLANS } from "@/lib/constants/plans";
import Link from "next/dist/client/link";

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Analyses ultra-rapides",
      description: "Traitement en moins de 30 secondes",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Confidentialité totale",
      description: "Chiffrement de bout en bout",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Support prioritaire",
      description: "Réponse en moins de 2 heures",
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Disponibilité mondiale",
      description: "Service 24h/24, 7j/7",
    },
  ];

  const faqs = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer:
        "Oui, vous pouvez passer du plan Free à Premium à tout moment. La migration est instantanée.",
    },
    {
      question: "Y a-t-il des frais cachés ?",
      answer:
        "Non, tous nos tarifs sont transparents. Seul le prix affiché vous sera facturé.",
    },
    {
      question: "Que se passe-t-il à la fin de ma période d'essai gratuit ?",
      answer:
        "Votre compte repasse automatiquement sur le plan Free avec ses limitations.",
    },
    {
      question: "Puis-je annuler mon abonnement ?",
      answer:
        "Oui, vous pouvez annuler à tout moment. L'annulation prend effet à la fin de la période de facturation.",
    },
    {
      question: "Mes données sont-elles conservées après annulation ?",
      answer:
        "Oui, vos analyses restent accessibles pendant 30 jours après annulation.",
    },
    {
      question: "Quels modes de paiement acceptez-vous ?",
      answer: "Carte bancaire (Visa, Mastercard, American Express) et PayPal.",
    },
  ];

  return (
    <div className="section-padding bg-black/90">
      <div className="container max-w-6xl">
        {/* En-tête */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-600/20 border border-yellow-500/30 mb-6">
            <Star className="w-4 h-4 text-yellow-600 mr-2" />
            <span className="text-yellow-600 text-sm font-medium">
              La solution la plus avancée du marché
            </span>
          </div>

          <h1 className="text-5xl font-bold mb-6">
            Choisissez votre <span className="text-yellow-600 italic font-normal">plan</span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Analysez vos contrats en toute confiance. Passez à Premium pour des
            analyses illimitées et des fonctionnalités avancées.
          </p>

          {/* Période de facturation */}
          <div className="inline-flex bg-gray-900/20 border border-gray-300/20 rounded-lg p-1 mb-12">
            <button
              className={`px-6 py-3 rounded-md transition-colors ${
                billingPeriod === "monthly"
                  ? "bg-yellow-600 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-white hover:cursor-pointer"
              }`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Facturation mensuelle
            </button>
            <button
              className={`px-6 py-3 rounded-md transition-colors ${
                billingPeriod === "yearly"
                  ? "bg-yellow-600 text-gray-900 font-medium"
                  : "text-gray-400 hover:text-white hover:cursor-pointer"
              }`}
              onClick={() => setBillingPeriod("yearly")}
            >
              <span className="flex items-center">
                Facturation annuelle
                <span className="ml-2 px-2 py-1 bg-yellow-800/20 text-yellow-600 text-xs rounded-full">
                  -20%
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={() => setSelectedPlan(plan.id)}
            />
          ))}
        </div>

        {/* Comparaison complète */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Comparaison complète</h2>
            <p className="text-gray-400">
              Tout ce que vous obtenez avec chaque plan
            </p>
          </div>

          <FeatureList showComparison={true} />
        </div>

        {/* Fonctionnalités Premium */}
        <div className="bg-gray-700/10 border border-gray-300/30 rounded-3xl p-12 mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Pourquoi choisir <span className="text-yellow-600 italic font-normal">Premium </span>?
            </h2>
            <p className="text-gray-400">
              Des avantages exclusifs pour les professionnels exigeants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-yellow-600">{feature.icon}</div>
                </div>
                <h4 className="font-semibold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <CustomButton
              size="lg"
              variant="outline"
              className="group border-yellow-600/60"
              onClick={() => setSelectedPlan("premium")}
            >
              <span className="flex items-center">
                S'abonner à Premium
                <span className="ml-2 bg-white/20 px-3 py-1 rounded-full text-sm">
                  {billingPeriod === "yearly" ? "4,99€/mois*" : "4,99€/mois"}
                </span>
              </span>
            </CustomButton>
            {billingPeriod === "yearly" && (
              <p className="text-gray-400 text-sm mt-4">
                *Facturé 59,88€/an, soit 4,99€ par mois
              </p>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Questions fréquentes</h2>
            <p className="text-gray-400">
              Tout ce que vous devez savoir avant de vous abonner
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/20 rounded-xl p-6 hover:bg-gray-800/50 transition-colors"
                >
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <HelpCircle className="w-5 h-5 text-yellow-600 mr-3" />
                    {faq.question}
                  </h4>
                  <p className="text-gray-400 pl-8">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">
              Commencez à analyser vos contrats dès aujourd'hui
            </h3>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui font confiance à
              ContractScope pour leurs analyses contractuelles.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <CustomButton
                size="lg"
                variant="outline"
                onClick={() => setSelectedPlan("premium")}
                className="group"
              >
                <span className="flex items-center">
                  Essayer Premium gratuitement
                </span>
              </CustomButton>

              <Link
                href="/upload"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-yellow-500 text-yellow-600 hover:bg-yellow-600 hover:text-gray-900 transition"
              >
                Tester la version gratuite
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                <span>Pas de carte bancaire requise</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-yellow-600 mr-2" />
                <span>Annulation à tout moment</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-blue-500 mr-2" />
                <span>Garantie satisfait ou remboursé 30 jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
