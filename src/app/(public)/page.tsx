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
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 overflow-hidden bg-[#050505]">
        {/* Subtle Depth Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)]" />

        <div className="container relative z-10 px-6">
          <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
            {/* Status Badge */}
            <div className="animate-slide-up [animation-delay:0.2s] opacity-0 flex items-center space-x-3 mb-12 bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-full backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/50 uppercase">
                Analyse Juridique 2.0
              </span>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="animate-slide-up [animation-delay:0.4s] opacity-0 text-[clamp(2.5rem,8vw,6.5rem)] font-bold mb-12 tracking-[-0.04em] leading-[0.9] text-white">
              La lucidité radicale, <br />
              <span className="serif-display gradient-subtle">
                enfin accessible.
              </span>
            </h1>

            {/* Sub-text with brand voice */}
            <p className="animate-slide-up [animation-delay:0.6s] opacity-0 max-w-3xl text-lg sm:text-xl text-white/40 leading-relaxed mb-16 px-4">
              Jurisk.io transcende la lecture traditionnelle.{" "}
              <br className="hidden md:block" />
              Nous extrayons
              <span className="text-white/80">
                {" "}
                le risque, l&apos;obligation et la puissance{" "}
              </span>
              de chaque paragraphe avec une précision chirurgicale.
            </p>

            {/* Hero Actions */}
            <div className="animate-slide-up [animation-delay:0.8s] opacity-0 grid grid-cols-1 sm:flex items-center gap-6">
              <Link href="/upload">
                <CustomButton
                  size="lg"
                  className="h-20 px-14 rounded-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-black text-xl shadow-[0_20px_40px_-10px_rgba(202,138,4,0.3)] hover:scale-[1.02] transition-all"
                >
                  Engager l&apos;Analyse
                  <ArrowRight className="ml-3 w-6 h-6" />
                </CustomButton>
              </Link>
              <button className="h-20 px-10 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-white/70 font-bold text-lg">
                L&apos;Expérience Jurisk.io
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stat Bars - Aesthetic element */}
        <div className="absolute bottom-12 left-0 right-0 animate-slide-up [animation-delay:1s] opacity-0 flex justify-center px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24">
            {[
              { label: "Précision", val: "99.4%" },
              { label: "Vitesse", val: "45s" },
              { label: "Confidentialité", val: "AES-256" },
              { label: "Disponibilité", val: "24/7" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-white/20 mb-1 uppercase text-center md:text-left">
                  {stat.label}
                </span>
                <span className="text-sm font-bold text-white/80 text-center md:text-left">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organic Features Section - The "Craftmanship" approach */}
      <section className="py-32 bg-[#050505] relative overflow-hidden">
        <div className="container px-6">
          <div className="flex flex-col lg:flex-row gap-24 items-center mb-40 reveal">
            <div className="lg:w-1/2">
              <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
                01 — L&apos;Expertise
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter leading-[0.95] text-white">
                Bienvenue dans <br />
                <span className="serif-display text-white/40">
                  l&apos;ère de l&apos;évidence.
                </span>
              </h2>
              <p className="text-xl text-white/30 leading-relaxed max-w-lg mb-10">
                L&apos;IA ne se contente plus de lire. Elle comprend
                l&apos;intention, balance les risques et anticipe les litiges
                avant même qu&apos;ils ne naissent.
              </p>
              <div className="flex flex-col gap-6">
                {[
                  "Détection des déséquilibres contractuels majeurs",
                  "Scrutin des clauses de responsabilité limitative",
                  "Identification des obligations de moyens vs résultat",
                ].map((item, i) => (
                  <div key={i} className="flex items-start group">
                    <div className="w-1 h-6 bg-yellow-600/30 mr-6 group-hover:bg-yellow-500 transition-colors" />
                    <span className="text-white/60 font-medium group-hover:text-white transition-colors">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] bg-white/[0.02] border border-white/10 rounded-[4rem] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <Shield className="w-48 h-48 text-white/[0.03] group-hover:text-yellow-500/10 transition-colors duration-1000" />

                {/* Asymmetrical "Floating Clause" */}
                <div className="absolute -bottom-10 -right-10 w-80 p-8 glass-card rounded-3xl animate-float">
                  <div className="h-2 w-12 bg-red-500/20 rounded mb-4" />
                  <p className="text-xs text-white/40 italic leading-relaxed">
                    "La responsabilité du Prestataire est exclue en cas de force
                    majeure, y compris les cyber-attaques..."
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-red-500/80">
                      Risque Critique
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-24 items-center reveal">
            <div className="lg:w-1/2">
              <span className="text-yellow-500/80 text-xs font-black tracking-[0.3em] uppercase mb-6 block">
                02 — La Lucidité
              </span>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter leading-[0.95] text-white">
                Vitesse, sans <br />
                <span className="serif-display text-white/40">compromis.</span>
              </h2>
              <p className="text-xl text-white/30 leading-relaxed max-w-lg mb-10">
                L&apos;analyse de 200 pages n&apos;est plus un marathon.
                C&apos;est une formalité de 30 secondes, chiffrée, auditable et
                irréprochable.
              </p>
              <div className="glass-card p-8 rounded-[3rem] border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-end gap-2 h-32">
                  {[30, 60, 45, 90, 65, 40, 80].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-white/[0.05] rounded-t-lg transition-all duration-1000 hover:bg-yellow-500/20"
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
              <div className="aspect-square bg-white/[0.01] border border-white/5 rounded-full flex flex-col items-center justify-center text-center p-12">
                <Zap className="w-12 h-12 text-yellow-500/20 mb-8" />
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
      {/* <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-400">
              Découvrez comment Jurisk.io aide des centaines de
              professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/30 p-6 rounded-xl border border-gray-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? "text-yellow-600"
                          : "text-gray-600"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                    <span className="text-yellow-600 font-semibold">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Final CTA Section - Massive minimalist close */}
      <section className="py-48 bg-[#050505] relative overflow-hidden reveal">
        <div className="container relative z-10 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-[clamp(2rem,6vw,4rem)] font-bold mb-12 tracking-tighter leading-[1] text-white">
              Sécurisez vos signatures. <br />
              <span className="serif-display text-white/30">
                Maîtrisez votre destin.
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <Link href="/upload">
                <CustomButton
                  size="lg"
                  className="h-16 px-12 rounded-full bg-white text-black hover:bg-gray-200 font-black text-lg transition-transform hover:scale-105"
                >
                  Analyse immédiate
                </CustomButton>
              </Link>
              <button className="text-white/50 hover:text-white font-medium flex items-center gap-2 group transition-colors">
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
