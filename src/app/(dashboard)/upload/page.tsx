"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  FileText,
  Shield,
  CheckCircle,
  Loader2,
  Zap,
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
    <div className="bg-background text-foreground relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.03)_0%,transparent_50%)] pointer-events-none" />

      <main className="container max-w-5xl px-6 py-24 relative z-10">
        {/* En-tête Méditorial */}
        <div className="mb-20 text-center">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-muted block mb-6 animate-fade-in">
            Protocole de Lancement
          </span>
          <h1 className="text-5xl md:text-7xl text-foreground mb-8 tracking-tight animate-slide-up">
            Engager la <span className="gradient-text italic">Lucidité</span>
          </h1>
          <p className="text-muted max-w-xl mx-auto leading-relaxed animate-slide-up stagger-1">
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

        {/* Topbar crédits */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-1 px-5 py-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
              Solde de crédits
            </p>
            <p className="text-2xl font-semibold text-foreground tnum">
              {loadingCredits ? "…" : userCredits?.credits ?? 0} crédits
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-accent hover:text-accent-bright text-xs font-medium transition-colors"
          >
            Recharger mon compte →
          </Link>
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
              className={`h-20 px-16 rounded-lg text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 ${
                files.length > 0
                  ? "bg-accent text-background hover:bg-accent-bright hover:scale-[1.02]"
                  : "bg-surface-1 text-faint cursor-not-allowed border border-border"
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
                    className={`w-4 h-4 ${files.length > 0 ? "text-background" : "text-faint"}`}
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
                  className="text-accent hover:text-accent-bright text-[10px] font-black tracking-widest uppercase underline underline-offset-4"
                >
                  Recharger mon compte →
                </Link>
              </div>
            )}

            <p className="text-faint text-[9px] font-bold tracking-[0.2em] uppercase max-w-sm text-center leading-relaxed">
              En engageant l'analyse, vous adhérez à notre <br />
              <a
                href="#"
                className="text-muted hover:text-foreground transition-colors"
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
              color: "text-accent",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start text-center md:text-left group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-surface-1 border border-border flex items-center justify-center mb-6 group-hover:border-accent/40 transition-all`}
              >
                <item.icon
                  className={`w-5 h-5 ${item.color} opacity-40 group-hover:opacity-100 transition-opacity`}
                />
              </div>
              <h4 className="text-xl text-foreground mb-3 tracking-tight">
                {item.title}
              </h4>
              <p className="text-muted text-xs leading-relaxed max-w-[200px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Limites d'Exploration (Simplifiées) */}
        <div className="p-12 rounded-xl bg-surface-1 border border-border relative overflow-hidden text-center">
          <span className="text-[10px] font-black tracking-[0.4em] uppercase text-muted block mb-6">
            Paramètres Unifiés
          </span>
          <h3 className="text-4xl text-foreground mb-16">
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
                <span className="text-[10px] font-black tracking-widest text-faint uppercase">
                  {limit.label}
                </span>
                <span className="text-3xl text-accent font-bold">
                  {limit.value}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-12 border-t border-border">
            <p className="text-muted text-sm mb-10 max-w-sm mx-auto italic">
              Vous bénéficiez de toutes les fonctionnalités avancées, sans
              restriction de niveau.
            </p>
            <Link href="/pricing" className="block">
              <button className="h-14 px-10 rounded-lg bg-accent text-background text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent-bright transition-all hover:scale-[1.02]">
                Ajouter des Crédits
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
