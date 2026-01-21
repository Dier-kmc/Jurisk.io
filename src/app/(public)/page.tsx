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

export default function HomePage() {
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
        "ContractScope a transformé notre processus de revue de contrats. Nous économisons des heures de travail par semaine.",
      rating: 5,
    },
    {
      name: "Thomas Martin",
      role: "Entrepreneur",
      company: "StartUp SAS",
      content:
        "En tant que petite entreprise, nous n'avons pas de département juridique. ContractScope nous donne la confiance nécessaire pour signer nos contrats.",
      rating: 5,
    },
    {
      name: "Sophie Laurent",
      role: "Avocate",
      company: "Cabinet Laurent & Associés",
      content:
        "J'utilise ContractScope pour une première analyse rapide avant de plonger dans les détails. Un gain de temps considérable.",
      rating: 4,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="section-padding h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-black/90" />

        {/* Gradients diagonaux animés */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient diagonal gauche animé */}
          <div className="absolute top-0 left-0 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow">
            <div
              className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-yellow-500/10 to-transparent animate-float"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
                animation: "float 8s ease-in-out infinite",
              }}
            />
          </div>

          {/* Gradient diagonal droit animé */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] translate-x-1/2 -translate-y-1/2 animate-pulse-slow">
            <div
              className="absolute inset-0 bg-gradient-to-bl from-purple-500/30 via-purple-500/10 to-transparent animate-float"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 0)",
                animation: "float 8s ease-in-out infinite 2s",
              }}
            />
          </div>

          {/* Effet de lumière supplémentaire */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-purple-500/10 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Le reste du contenu reste identique */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-600/20 border border-yellow-500/30 mb-6">
              <span className="text-yellow-600 text-sm font-medium">
                ✨ Nouveau : Analyse en temps réel disponible
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              Analysez vos{" "}
              <span className="text-yellow-600 font-light italic">
                contrats
              </span>
              <br />
              en quelques secondes
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              ContractScope utilise l'intelligence artificielle pour identifier
              les risques, obligations et pouvoirs cachés dans vos documents
              juridiques. Plus besoin d'être expert pour comprendre un contrat.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/upload">
                <CustomButton size="lg" variant="outline" className="group">
                  Analyser un contrat gratuitement
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </CustomButton>
              </Link>
              <Link href="/pricing">
                <CustomButton size="lg" variant="primary">
                  Voir les tarifs
                </CustomButton>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  100%
                </div>
                <div className="text-gray-400">Confidentialité</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  94%
                </div>
                <div className="text-gray-400">Précision</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  30s
                </div>
                <div className="text-gray-400">Analyse moyenne</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  10k+
                </div>
                <div className="text-gray-400">Contrats analysés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="section-padding relative overflow-hidden bg-black/90">
        {/* Contenu */}
        <div className="container relative z-10 p-8 md:p-12 border-t border-l border-r border-gray-200/30 rounded-t-2xl bg-gradient-to-b from-black/80 via-black/90 to-black">
          <div className="max-w-3xl mx-auto text-center my-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Comment ça marche
            </h2>
            <p className="text-gray-400 text-lg">
              Trois étapes simples pour transformer vos documents juridiques en
              insights actionnables
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                step: "1",
                icon: <FileText className="w-7 h-7" />,
                title: "Téléversez",
                description:
                  "Importez votre contrat (PDF, DOC, TXT). Vos données restent privées et sécurisées.",
              },
              {
                step: "2",
                icon: <Bot className="w-7 h-7" />,
                title: "Analyse IA",
                description:
                  "Notre agent IA scanne et structure le contenu pour en extraire les éléments clés.",
              },
              {
                step: "3",
                icon: <BarChart className="w-7 h-7" />,
                title: "Résultats clairs",
                description:
                  "Visualisez les risques, obligations et pouvoirs dans un dashboard intuitif.",
              },
            ].map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center p-8 border border-gray-300/30 rounded-xl hover:border-yellow-600/50 relative z-10 bg-gradient-to-b from-black/40 to-gray-900/20 backdrop-blur-sm">
                  <div className="relative mb-8">
                    {/* Cercle de fond avec gradient */}
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-lg mx-auto" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                    </div>
                    {/* Numéro d'étape */}
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-600/90 rounded-full flex items-center justify-center text-gray-300 font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Toutes les fonctionnalités */}
          <div className="max-w-3xl mx-auto text-center my-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-400 text-lg">
              Des fonctionnalités pensées pour les professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 border border-gray-300/30 rounded-xl hover:border-yellow-600/50 relative z-10 bg-gradient-to-b from-black/40 to-gray-900/20 backdrop-blur-sm"              >
                {/* Effet de hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/0 via-yellow-500/0 to-yellow-500/0 group-hover:from-yellow-500/5 group-hover:via-yellow-500/2 group-hover:to-yellow-500/0 rounded-xl transition-all duration-300" />

                <div className="relative z-10">
                  <div className="text-yellow-600 mb-4 text-2xl">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      {/* <section className="section-padding">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ils nous font confiance</h2>
            <p className="text-gray-400">
              Découvrez comment ContractScope aide des centaines de
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

      {/* CTA Final */}
      <section className="section-padding bg-gradient-to-b from-black/90 to-black">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gray-300/5 border border-yellow-600/30 rounded-3xl p-12">
              <h2 className="text-4xl font-bold mb-6">
                Prêt à analyser vos contrats ?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                Essayez gratuitement — 3 analyses offertes sans engagement.
                Aucune carte bancaire requise.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/upload">
                  <CustomButton size="lg" variant="primary" className="group">
                    Téléverser un document
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </CustomButton>
                </Link>
                <Link href="/pricing">
                  <CustomButton size="lg" variant="outline">
                    Découvrir Premium
                  </CustomButton>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-green-500 mr-2" />
                  <span>Données 100% sécurisées</span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-blue-500 mr-2" />
                  <span>Support 7j/7</span>
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 text-yellow-600 mr-2" />
                  <span>Analyses en 30 secondes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
