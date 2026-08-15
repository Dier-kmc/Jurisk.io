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
      <div className="min-h-screen bg-surface-1 text-foreground relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-risk-high/10 via-transparent to-risk-medium/10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-risk-high/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-risk-medium/5 rounded-full blur-3xl" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            {/* Error Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-risk-high/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-risk-high/10 to-risk-medium/10 p-6 rounded-full border border-risk-high/20">
                  <XCircle
                    className="w-16 h-16 text-risk-high"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center mb-4">
              <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-risk-high/60 mb-3">
                Erreur d'analyse
              </span>
              <span className="text-5xl md:text-6xl bg-gradient-to-r from-risk-high via-risk-medium to-risk-high bg-clip-text text-transparent font-bold">
                Échec du Traitement
              </span>
            </h1>

            {/* Error message */}
            <div className="bg-surface-1 border border-risk-high/20 rounded-xl p-8 mb-8 backdrop-blur-sm">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-6 h-6 text-risk-high flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Message d'erreur
                  </h3>
                  <p className="text-muted leading-relaxed">
                    {errorMessage ||
                      "Une erreur technique s'est produite lors de l'analyse de votre contrat. Nos systèmes n'ont pas pu traiter le document correctement."}
                  </p>
                </div>
              </div>

              {/* Troubleshooting tips */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-risk-medium" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-muted">
                    Que faire ?
                  </h4>
                </div>
                <ul className="space-y-3 text-sm text-muted">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-risk-medium mt-2 flex-shrink-0" />
                    <span>
                      Vérifiez que votre fichier est un PDF ou document texte
                      valide
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-risk-medium mt-2 flex-shrink-0" />
                    <span>
                      Assurez-vous que le document contient du texte lisible
                      (pas uniquement des images)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-risk-medium mt-2 flex-shrink-0" />
                    <span>
                      Essayez avec un fichier de taille inférieure à 10 Mo
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-risk-medium mt-2 flex-shrink-0" />
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
                className="flex-1 h-14 bg-gradient-to-r from-risk-high to-risk-medium hover:from-risk-high/80 hover:to-risk-medium/80 text-white font-bold rounded-full transition-all hover:scale-105 shadow-sm"
              >
                <FileText className="w-5 h-5 mr-2" />
                Nouvelle Analyse
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
      <div className="min-h-screen bg-surface-1 text-foreground relative overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            {/* Pending Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-full border border-accent/20">
                  <Clock
                    className="w-16 h-16 text-accent animate-pulse"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center mb-4">
              <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-accent/60 mb-3">
                Analyse en attente
              </span>
              <span className="text-5xl md:text-6xl bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent font-bold">
                File d'Attente
              </span>
            </h1>

            {/* Info message */}
            <div className="bg-surface-1 border border-accent/20 rounded-xl p-8 mb-8 backdrop-blur-sm">
              <div className="text-center">
                <Zap className="w-12 h-12 text-accent mx-auto mb-4" />
                <p className="text-foreground text-lg mb-2">
                  Votre document est dans la file d'attente
                </p>
                <p className="text-faint text-sm">
                  L'analyse démarrera automatiquement dans quelques instants.
                  Vous pouvez fermer cette page et revenir plus tard.
                </p>
              </div>

              {/* Progress indicator */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-75" />
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-150" />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 h-14 bg-gradient-to-r from-accent to-accent-bright hover:from-accent/80 hover:to-accent-bright/80 text-background font-bold rounded-full transition-all hover:scale-105 shadow-sm"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // État ERROR générique
  return (
    <div className="min-h-screen bg-surface-1 text-foreground relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-risk-medium/10 via-transparent to-risk-medium/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-risk-medium/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-risk-medium/5 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-risk-medium/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-risk-medium/10 to-risk-medium/5 p-6 rounded-full border border-risk-medium/20">
                <AlertCircle
                  className="w-16 h-16 text-risk-medium"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center mb-4">
            <span className="block text-[10px] font-black tracking-[0.3em] uppercase text-risk-medium/60 mb-3">
              Erreur de chargement
            </span>
            <span className="text-5xl md:text-6xl bg-gradient-to-r from-risk-medium to-risk-medium/60 bg-clip-text text-transparent font-bold">
              Données Indisponibles
            </span>
          </h1>

          {/* Error message */}
          <div className="bg-surface-1 border border-risk-medium/20 rounded-xl p-8 mb-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <p className="text-foreground text-lg mb-2">
                {error || "Impossible de charger les données de l'analyse"}
              </p>
              <p className="text-faint text-sm">
                Une erreur s'est produite lors de la récupération des
                informations. Veuillez réessayer.
              </p>
            </div>

            {/* Quick actions */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-risk-medium" />
                <h4 className="text-sm font-black uppercase tracking-widest text-muted">
                  Actions rapides
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={onRetry || (() => window.location.reload())}
                  className="flex items-center gap-3 p-4 rounded-xl bg-surface-1 border border-border hover:bg-surface-2 transition-all text-left"
                >
                  <RefreshCw className="w-5 h-5 text-risk-medium" />
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      Recharger
                    </div>
                    <div className="text-xs text-faint">
                      Actualiser la page
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
              className="flex-1 h-14 bg-gradient-to-r from-risk-medium to-risk-medium/70 hover:from-risk-medium/80 hover:to-risk-medium/60 text-background font-bold rounded-full transition-all hover:scale-105 shadow-sm"
            >
              <FileText className="w-5 h-5 mr-2" />
              Nouvelle Analyse
            </Button>
            <Button
              onClick={onRetry || (() => window.location.reload())}
              variant="outline"
              className="flex-1 h-14 border-2 border-border text-foreground hover:bg-surface-2 rounded-full transition-all"
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
