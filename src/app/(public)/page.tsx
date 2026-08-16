"use client";

import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  Lock,
  FileCheck,
  Users,
  Globe,
  FileText,
  Bot,
  BarChart,
} from "lucide-react";
import CustomButton from "@/components/ui/custom/CustomButton";
import { useReveal } from "@/lib/hooks/useReveal";
import { ContractDissection } from "@/components/results/ContractDissection";

export default function HomePage() {
  useReveal();
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Détection des risques",
      description:
        "Identification automatique des clauses à risque et déséquilibres contractuels",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analyse approfondie",
      description:
        "Extraction des obligations, délais, pénalités et conditions spécifiques",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Traitement rapide",
      description:
        "Analyse complète en quelques secondes grâce à notre IA spécialisée",
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Confidentialité totale",
      description:
        "Vos documents sont chiffrés et ne sont jamais partagés avec des tiers",
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Multi-formats",
      description:
        "Support complet : PDF, DOC, DOCX, TXT, même les documents scannés",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Collaboration",
      description:
        "Partagez vos analyses avec votre équipe et travaillez ensemble",
    },
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Responsable juridique",
      company: "TechCorp",
      content:
        "Jurisk.io a transformé notre processus de revue de contrats. Nous économisons des heures de travail par semaine.",
      rating: 5,
    },
    {
      name: "Thomas Martin",
      role: "Entrepreneur",
      company: "StartUp SAS",
      content:
        "En tant que petite entreprise, nous n'avons pas de département juridique. Jurisk.io nous donne la confiance nécessaire pour signer nos contrats.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Avocate",
      company: "Cabinet Laurent & Associés",
      content:
        "J'utilise Jurisk.io pour une première analyse rapide avant de plonger dans les détails. Un gain de temps considérable.",
      rating: 4,
    },
  ];

  return (
    <>
      {/* Hero Section - Senior Designer Vision */}
      <section className="relative min-h-screen flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden bg-[#050505]">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-gradient-to-b from-accent/5 via-transparent to-transparent blur-3xl" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        </div>

        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
            

            {/* Refined Headline */}
            <h1 className="animate-slide-up [animation-delay:0.4s] opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold mb-8 md:mb-12 lg:mb-14 tracking-tight leading-[0.95]">
              <span className="text-white">Décryptez vos contrats</span>
              <br />
              <span className="bg-gradient-to-r from-accent via-accent-bright to-accent-bright bg-clip-text text-transparent">
                avec une intelligence absolue
              </span>
            </h1>

            {/* Powerful Subheading */}
            <p className="animate-slide-up [animation-delay:0.6s] opacity-0 max-w-3xl text-base sm:text-lg md:text-xl text-white/50 leading-relaxed mb-12 md:mb-16 lg:mb-20 px-4">
              Notre IA analyse chaque clause avec une précision chirurgicale,
              révélant les{" "}
              <span className="text-white/80 font-semibold">
                risques cachés
              </span>
              , les{" "}
              <span className="text-white/80 font-semibold">
                obligations critiques
              </span>{" "}
              et les
              <span className="text-white/80 font-semibold">
                {" "}
                leviers de négociation
              </span>{" "}
              en quelques secondes.
            </p>

            {/* Mock dissection — accent signature */}
            <div className="mt-16 w-full max-w-xl">
              <ContractDissection
                clauses={[
                  {
                    clause_number: "3",
                    title: "Clause de non-concurrence",
                    problem: "Durée excessive (5 ans)",
                    legal_impact:
                      "Empêche tout repositionnement professionnel du salarié pendant une durée déraisonnable.",
                    proposed_solution:
                      "Réduire la durée à 12 mois et restreindre le périmètre géographique.",
                    priority: "high",
                  },
                  {
                    clause_number: "7",
                    title: "Indemnités de résiliation",
                    problem: "Pénalités déséquilibrées",
                    legal_impact:
                      "Expose le cocontractant à des pénalités disproportionnées en cas de résiliation anticipée.",
                    proposed_solution:
                      "Plafonner les pénalités à un montant proportionné au préjudice réel.",
                    priority: "medium",
                  },
                  {
                    clause_number: "11",
                    title: "Force majeure",
                    problem: "Champ trop restreint",
                    legal_impact:
                      "Réduit la protection des parties en cas d'événements imprévisibles et indépendants de leur volonté.",
                    proposed_solution:
                      "Élargir le champ aux événements hors de contrôle raisonnable des parties.",
                    priority: "low",
                  },
                  {
                    clause_number: "14",
                    title: "Confidentialité",
                    problem: "Post-contractuel limité",
                    legal_impact:
                      "Fragilise la protection des informations confidentielles après la fin du contrat.",
                    proposed_solution:
                      "Étendre l'obligation de confidentialité sur une période post-contractuelle définie.",
                    priority: "medium",
                  },
                ]}
              />
            </div>

            {/* Hero CTA - Single Powerful Button */}
            <div className="animate-slide-up [animation-delay:0.8s] opacity-0 w-full max-w-sm sm:max-w-md mx-auto">
              <Link href="/upload" className="block group">
                <CustomButton
                  size="lg"
                  className="group relative h-16 sm:h-20 px-10 sm:px-16 rounded-full bg-accent hover:bg-accent-bright text-background font-bold text-lg sm:text-xl hover:scale-[1.03] transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Analyser mon contrat
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CustomButton>

                {/* Micro-copy */}
                <p className="mt-4 text-xs sm:text-sm text-white/30 font-medium">
                  ✓ Gratuit • ✓ Sécurisé • ✓ Résultat en 45 secondes
                </p>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="animate-slide-up [animation-delay:1s] opacity-0 mt-6 md:mt-6 w-full max-w-2xl">
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Organic Features Section - The "Craftmanship" approach */}
      <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center mb-20 lg:mb-40 reveal">
  {/* Texte - Gauche */}
  <div className="lg:w-1/2 order-2 lg:order-1 px-4 sm:px-0">
    <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-4 lg:mb-6 block">
      01 — L&apos;Expertise
    </span>
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 lg:mb-8 tracking-tight leading-[0.95] text-white">
      Bienvenue dans <br />
      <span className="text-white/40">
        l&apos;ère de l&apos;évidence.
      </span>
    </h2>
    <p className="text-base sm:text-lg md:text-xl text-white/30 leading-relaxed max-w-lg mb-8 lg:mb-10">
      L&apos;IA ne se contente plus de lire. Elle comprend
      l&apos;intention, balance les risques et anticipe les litiges
      avant même qu&apos;ils ne naissent.
    </p>
    <div className="flex flex-col gap-4 lg:gap-6">
      {[
        "Détection des déséquilibres contractuels majeurs",
        "Scrutin des clauses de responsabilité limitative",
        "Identification des obligations de moyens vs résultat",
      ].map((item, i) => (
        <div key={i} className="flex items-start group">
          <div className="w-1 h-5 lg:h-6 bg-accent/30 mr-4 lg:mr-6 group-hover:bg-accent transition-colors flex-shrink-0" />
          <span className="text-sm sm:text-base text-white/60 font-medium group-hover:text-white transition-colors">
            {item}
          </span>
        </div>
      ))}
    </div>
  </div>

  {/* Visual - Droite */}
  <div className="lg:w-1/2 relative order-1 lg:order-2 px-4 sm:px-0 w-full mb-10 lg:mb-0">
    <div className="aspect-square sm:aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-2xl border border-white/[0.06] bg-surface-1 flex items-center justify-center relative overflow-hidden group p-8">
      
      {/* Effet de gradient au hover */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {/* Shield - Taille responsive */}
      <Shield className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 text-white/[0.03] group-hover:text-accent/10 transition-colors duration-1000" />

      {/* Clause flottante - Position responsive */}
      <div className="absolute bottom-4 right-4 sm:-bottom-8 sm:-right-8 lg:-bottom-10 lg:-right-10 w-60 sm:w-64 lg:w-80 p-4 sm:p-6 lg:p-8 glass-card rounded-xl animate-float max-w-[calc(100%-32px)] sm:max-w-none">
        
        {/* Barre rouge d'indicateur */}
        <div className="h-1.5 sm:h-2 w-8 sm:w-12 bg-risk-high/20 rounded mb-3 lg:mb-4" />
        
        {/* Texte de la clause */}
        <p className="text-[10px] sm:text-xs text-white/40 italic leading-relaxed">
          "La responsabilité du Prestataire est exclue en cas de force
          majeure, y compris les cyber-attaques..."
        </p>
        
        {/* Badge d'alerte */}
        <div className="mt-4 sm:mt-6 flex items-center gap-2">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-risk-high animate-pulse flex-shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase text-risk-high/80 whitespace-nowrap">
            Risque Critique
          </span>
        </div>
      </div>

      {/* Points décoratifs - Seulement sur desktop */}
      <div className="hidden lg:block absolute -top-4 -left-4 w-8 h-8 rounded-full border border-white/5 bg-white/[0.01]" />
      <div className="hidden lg:block absolute -bottom-6 -right-6 w-12 h-12 rounded-full border border-white/5 bg-white/[0.01]" />
    </div>

    {/* Légende informative pour mobile */}
    <div className="block lg:hidden mt-4 text-center">
      <p className="text-xs text-white/30">
        ⬆️ Clause à risque détectée automatiquement
      </p>
    </div>
  </div>
</div>

          <div className="flex flex-col lg:flex-row-reverse gap-24 items-center reveal">
            <div className="lg:w-1/2">
              <span className="text-accent/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
                02 — La Lucidité
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter leading-[0.95] text-white">
                Vitesse, sans <br />
                <span className="text-white/40">compromis.</span>
              </h2>
              <p className="text-xl text-white/30 leading-relaxed max-w-lg mb-10">
                L&apos;analyse de 200 pages n&apos;est plus un marathon.
                C&apos;est une formalité de 30 secondes, chiffrée, auditable et
                irréprochable.
              </p>
              <div className="glass-card p-8 relative overflow-hidden">
                <div className="flex justify-between items-end gap-2 h-32">
                  {[30, 60, 45, 90, 65, 40, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/[0.05] rounded-t-lg transition-all duration-1000 hover:bg-accent/20"
                      style={{
                        height: `${h}%`,
                        transitionDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <span className="text-[10px] font-black tracking-widest uppercase text-white/20">
                    Puissance de calcul optimisée
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="aspect-square bg-surface-1 border border-white/[0.06] rounded-full flex flex-col items-center justify-center text-center p-12">
                <Zap className="w-12 h-12 text-accent/20 mb-8" />
                <h3 className="text-3xl font-bold text-white mb-4 italic">
                  45s
                </h3>
                <p className="text-white/20 text-sm max-w-[200px]">
                  Temps moyen pour l&apos;identification d&apos;une clause de
                  résiliation abusive.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-muted">
              Découvrez comment Jurisk.io aide des centaines de professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-8 rounded-xl border border-white/[0.06]">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating ? "text-accent" : "text-faint"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-muted mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center mr-3">
                    <span className="text-accent font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Massive minimalist close */}
      <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden reveal">
        <div className="container relative z-10 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[clamp(2rem,6vw,4rem)] font-bold mb-12 tracking-tighter leading-[1] text-white">
              Sécurisez vos signatures. <br />
              <span className="text-white/30">Maîtrisez votre destin.</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/upload">
                <CustomButton
                  size="lg"
                  className="h-16 px-12 rounded-full bg-accent text-background hover:bg-accent-bright font-black text-lg transition-transform hover:scale-105"
                >
                  Analyse immédiate
                </CustomButton>
              </Link>
              <button className="text-muted hover:text-foreground font-medium flex items-center gap-2 group transition-colors">
                Contacter un expert
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="mt-16 text-[10px] font-black tracking-[0.4em] uppercase text-white/10">
              Jurisk.io — Paris / Bordeaux / Worldwide
            </p>
          </div>
        </div>

        {/* Abstract shape for depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
      </section>
    </>
  );
}
