"use client";

import {
  AlertCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  FileText,
  AlertTriangle,
  HelpCircle,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AnalysisErrorProps {
  error?: string | null;
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  errorMessage?: string;
  onRetry?: () => void;
}

export default function AnalysisError({
  error,
  status,
  errorMessage,
  onRetry,
}: AnalysisErrorProps) {
  const router = useRouter();

  // État FAILED - Échec de l'analyse
  if (status === "FAILED") {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-orange-950/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6 rounded-full border border-red-500/20">
                  <XCircle
                    className="w-16 h-16 text-red-500"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center mb-4">
              <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-red-500/60 mb-3">
                Erreur d'analyse
              </span>
              <span className="serif-display text-5xl md:text-6xl bg-gradient-to-r from-red-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                Échec du Traitement
              </span>
            </h1>

            {/* Error message */}
            <div className="bg-white/[0.02] border border-red-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Message d'erreur
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {errorMessage ||
                      "Une erreur technique s'est produite lors de l'analyse de votre contrat. Nos systèmes n'ont pas pu traiter le document correctement."}
                  </p>
                </div>
              </div>

              {/* Troubleshooting tips */}
              <div className="border-t border-white/5 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-white/60">
                    Que faire ?
                  </h4>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>
                      Vérifiez que votre fichier est un PDF ou document texte
                      valide
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>
                      Assurez-vous que le document contient du texte lisible
                      (pas uniquement des images)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>
                      Essayez avec un fichier de taille inférieure à 10 Mo
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <span>
                      Si le problème persiste, contactez notre support technique
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => router.push("/upload")}
                className="flex-1 h-14 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-500/20"
              >
                <FileText className="w-5 h-5 mr-2" />
                Nouvelle Analyse
              </Button>
              <Button
                onClick={() => router.push("/history")}
                variant="outline"
                className="flex-1 h-14 border-2 border-white/10 text-white hover:bg-white/5 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Historique
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État PENDING - En attente
  if (status === "PENDING") {
    return (
      <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-purple-950/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            {/* Pending Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 rounded-full border border-blue-500/20">
                  <Clock
                    className="w-16 h-16 text-blue-500 animate-pulse"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center mb-4">
              <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-blue-500/60 mb-3">
                Analyse en attente
              </span>
              <span className="serif-display text-5xl md:text-6xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                File d'Attente
              </span>
            </h1>

            {/* Info message */}
            <div className="bg-white/[0.02] border border-blue-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
              <div className="text-center">
                <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-300 text-lg mb-2">
                  Votre document est dans la file d'attente
                </p>
                <p className="text-gray-500 text-sm">
                  L'analyse démarrera automatiquement dans quelques instants.
                  Vous pouvez fermer cette page et revenir plus tard.
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Actualiser
              </Button>
              <Button
                onClick={() => router.push("/history")}
                variant="outline"
                className="flex-1 h-14 border-2 border-white/10 text-white hover:bg-white/5 rounded-full transition-all"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Historique
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État ERROR générique
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/20 via-transparent to-orange-950/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 rounded-full border border-yellow-500/20">
                <AlertCircle
                  className="w-16 h-16 text-yellow-500"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4">
            <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-yellow-500/60 mb-3">
              Erreur de chargement
            </span>
            <span className="serif-display text-5xl md:text-6xl bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              Données Indisponibles
            </span>
          </h1>

          {/* Error message */}
          <div className="bg-white/[0.02] border border-yellow-500/20 rounded-3xl p-8 mb-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <p className="text-gray-300 text-lg mb-2">
                {error || "Impossible de charger les données de l'analyse"}
              </p>
              <p className="text-gray-500 text-sm">
                Une erreur s'est produite lors de la récupération des
                informations. Veuillez réessayer.
              </p>
            </div>

            {/* Quick actions */}
            <div className="border-t border-white/5 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-orange-500" />
                <h4 className="text-sm font-black uppercase tracking-widest text-white/60">
                  Actions rapides
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onRetry || (() => window.location.reload())}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
                >
                  <RefreshCw className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Recharger
                    </div>
                    <div className="text-xs text-gray-500">
                      Actualiser la page
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => router.push("/history")}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
                >
                  <ArrowLeft className="w-5 h-5 text-yellow-500" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      Historique
                    </div>
                    <div className="text-xs text-gray-500">
                      Voir mes analyses
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => router.push("/upload")}
              className="flex-1 h-14 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              <FileText className="w-5 h-5 mr-2" />
              Nouvelle Analyse
            </Button>
            <Button
              onClick={onRetry || (() => window.location.reload())}
              variant="outline"
              className="flex-1 h-14 border-2 border-white/10 text-white hover:bg-white/5 rounded-full transition-all"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Réessayer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
