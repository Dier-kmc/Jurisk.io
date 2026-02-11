"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  CreditCard,
  Loader2,
  Zap,
  Sparkles,
  Crown,
} from "lucide-react";
import FileUpload from "@/components/upload/FileUpload";
import CustomButton from "@/components/ui/custom/CustomButton";
import Alert from "@/components/ui/custom/Alert";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface UserCredits {
  credits: number;
  plan: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);

  // Récupérer les crédits de l'utilisateur
  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const response = await fetch("/api/user/credits");
        const data = await response.json();

        if (data.success) {
          setUserCredits({
            credits: data.credits,
            plan: data.plan,
          });
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des crédits:", error);
      } finally {
        setLoadingCredits(false);
      }
    };

    fetchUserCredits();
  }, []);

  const handleUploadComplete = (uploadedFiles: File[]) => {
    setFiles(uploadedFiles);
    setError(null);
  };

  const handleAnalyze = async () => {
    // Vérifier les crédits
    if (userCredits && userCredits.credits <= 0) {
      setError(
        "Vous n'avez plus de crédits disponibles. Veuillez recharger votre compte.",
      );
      return;
    }

    if (files.length === 0) {
      setError("Veuillez sélectionner un fichier à analyser.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      // Appel à votre API réelle
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'upload");
      }

      if (!data.success) {
        throw new Error(data.error || "Échec de l'upload");
      }

      // Mettre à jour les crédits localement
      if (userCredits) {
        setUserCredits({
          ...userCredits,
          credits: data.creditsRemaining,
        });
      }

      setSuccess("Fichier uploadé avec succès ! Redirection vers l'analyse...");

      // Rediriger vers la page de résultat avec l'ID du contrat
      setTimeout(() => {
        router.push(`/result/${data.contractId}`);
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'analyse. Veuillez réessayer.";
      setError(errorMessage);
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const limits = [
    {
      label: "Crédits disponibles",
      value: userCredits
        ? `${userCredits.credits} crédit${userCredits.credits > 1 ? "s" : ""}`
        : "Chargement...",
    },
    { label: "Taille max", value: "10 MB" },
    { label: "Formats", value: "PDF, DOC, DOCX, TXT" },
    { label: "Traitement", value: "30 secondes" },
  ];

  const calculateProgress = () => {
    if (!userCredits) return "0%";
    // Pour un utilisateur FREE, maximum 10 crédits initialement
    const maxCredits = userCredits.plan === "PREMIUM" ? 100 : 10;
    return `${((maxCredits - userCredits.credits) / maxCredits) * 100}%`;
  };

  return (
    <div className="bg-[#050505] text-white relative">
      <div className="noise-overlay border-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none" />

      <main className="container max-w-5xl px-6 py-24 relative z-10">
        {/* En-tête Méditorial */}
        <div className="mb-20 text-center">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20 block mb-6 animate-fade-in">
            Protocole de Lancement
          </span>
          <h1 className="serif-display text-5xl md:text-7xl text-white mb-8 tracking-tight animate-slide-up">
            Engager la <span className="gradient-subtle italic">Lucidité</span>
          </h1>
          <p className="text-white/40 max-w-xl mx-auto leading-relaxed animate-slide-up stagger-1">
            Activez la puissance de l'intelligence souveraine pour une
            dissection chirurgicale de vos structures contractuelles.
          </p>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Erreur"
              children={error}
              icon={<AlertCircle className="w-5 h-5" />}
              onClose={() => setError(null)}
            />
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Succès"
              children={success}
              icon={<CheckCircle className="w-5 h-5" />}
              onClose={() => setSuccess(null)}
            />
          </div>
        )}

        {/* HUD de Crédits Glassmorphic */}
        <div className="mb-24 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-yellow-600/20 rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700" />

          <div className="relative p-10 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-50 pointer-events-none">
              <div className="w-64 h-64 bg-yellow-500/20 rounded-full blur-[80px]" />
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-end gap-12 relative z-10">
              <div className="flex-1 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center shadow-[0_0_30px_-10px_rgba(234,179,8,0.3)]">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-yellow-500 tracking-widest uppercase mb-1">
                      Votre Carburant
                    </h2>
                    <h3 className="serif-display text-3xl md:text-4xl text-white">
                      Solde de Crédits
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 tracking-tighter filter drop-shadow-lg">
                      {loadingCredits ? "..." : userCredits?.credits || 0}
                    </span>
                    <span className="text-xl font-medium text-white/40 pb-4">
                      crédits disponibles
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-white/40 max-w-md">
                    <div className="w-1 h-1 rounded-full bg-yellow-500" />
                    <p>
                      Chaque analyse consomme 1 crédit pour générer un rapport
                      complet et détaillé.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <Link href="/pricing" className="block w-full">
                  <button className="w-full relative group/btn overflow-hidden rounded-2xl bg-white p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-600 opacity-100 group-hover/btn:opacity-100 transition-opacity" />
                    <div className="relative h-16 px-10 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3 group-hover/btn:bg-black/40 transition-colors">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                        Recharger mon compte
                      </span>
                      <CreditCard className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </Link>

                <div className="mt-4 flex justify-center gap-6">
                  {userCredits?.plan === "FREE" && (
                    <span className="text-[10px] font-bold text-yellow-500/60 uppercase tracking-widest">
                      Plan Gratuit
                    </span>
                  )}
                  {userCredits?.plan === "PREMIUM" && (
                    <span className="text-[10px] font-bold text-purple-400/80 uppercase tracking-widest flex items-center gap-2">
                      <Crown className="w-3 h-3" />
                      Membre Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone d'upload Éditoriale */}
        <div className="mb-24">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            maxFiles={1}
            maxSizeMB={50} // Increased limit for everyone since no premium
            allowedTypes={[
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/msword",
              "text/plain",
            ]}
            className="mb-12"
          />

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={handleAnalyze}
              disabled={
                loadingCredits ||
                (userCredits && userCredits.credits <= 0) ||
                files.length === 0 ||
                isUploading
              }
              className={`h-20 px-16 rounded-full text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 ${
                files.length > 0
                  ? "bg-yellow-600 text-black hover:bg-yellow-500 shadow-[0_20px_40px_-10px_rgba(202,138,4,0.3)] hover:scale-[1.02]"
                  : "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Initialisation...
                </>
              ) : (
                <>
                  <Zap
                    className={`w-4 h-4 ${files.length > 0 ? "text-black" : "text-white/10"}`}
                  />
                  Engager l'Analyse (-1 Crédit)
                </>
              )}
            </button>

            {userCredits && userCredits.credits <= 0 && (
              <div className="mt-2 text-center">
                <p className="text-red-500/60 text-[10px] font-black tracking-widest uppercase mb-2">
                  Solde insuffisant
                </p>
                <Link
                  href="/pricing"
                  className="text-yellow-500 hover:text-yellow-400 text-[10px] font-black tracking-widest uppercase underline underline-offset-4"
                >
                  Recharger mon compte →
                </Link>
              </div>
            )}

            <p className="text-white/10 text-[9px] font-bold tracking-[0.2em] uppercase max-w-sm text-center leading-relaxed">
              En engageant l'analyse, vous adhérez à notre <br />
              <a
                href="#"
                className="text-white/20 hover:text-white transition-colors"
              >
                Charte de Confidentialité Radicale
              </a>
            </p>
          </div>
        </div>

        {/* Trust Bar Éditorial */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {[
            {
              icon: Shield,
              title: "Sanctuaire de Données",
              desc: "Chiffrement post-quantique. Suppression automatique sous 30 jours.",
              color: "text-emerald-500",
            },
            {
              icon: FileText,
              title: "Omnivore Numérique",
              desc: "Extraction native sur PDF, Word et documents scannés haute définition.",
              color: "text-blue-500",
            },
            {
              icon: CheckCircle,
              title: "Certitude Académique",
              desc: "Précision chirurgicale sur 94% des clauses de force majeure et d'indemnité.",
              color: "text-yellow-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div
                className={`w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 group-hover:border-white/20 transition-all`}
              >
                <item.icon
                  className={`w-5 h-5 ${item.color} opacity-40 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <h4 className="serif-display text-xl text-white mb-3 tracking-tight">
                {item.title}
              </h4>
              <p className="text-white/30 text-xs leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Limites d'Exploration (Simplifiées) */}
        <div className="p-12 rounded-[3.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/5 blur-[100px] -z-10" />

          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white/10 block mb-6">
            Paramètres Unifiés
          </span>
          <h3 className="serif-display text-4xl text-white mb-16">
            Puissance Maximale Débloquée
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 px-6">
            {[
              { label: "Analyse", value: "IA Gen 4" },
              { label: "Taille max", value: "50 MB" },
              { label: "Formats", value: "PDF, Office" },
              { label: "Vitesse", value: "~15s/page" },
            ].map((limit, index) => (
              <div key={index} className="flex flex-col gap-4">
                <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
                  {limit.label}
                </span>
                <span className="serif-display text-3xl text-yellow-500/60 font-bold">
                  {limit.value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-white/5">
            <p className="text-white/30 text-sm mb-10 max-w-sm mx-auto italic">
              Vous bénéficiez de toutes les fonctionnalités avancées, sans
              restriction de niveau.
            </p>
            <Link href="/pricing" className="block">
              <button className="h-14 px-10 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/90 transition-all hover:scale-[1.02]">
                Ajouter des Crédits
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
