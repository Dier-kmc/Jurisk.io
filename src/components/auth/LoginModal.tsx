"use client";

import { useState, useEffect } from "react";
import {
  X,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Chrome,
  Github,
  Loader2,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { InputField } from "@/components/ui/custom/InputField";
import { useAuth } from "@/lib/hooks/useAuth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<
    "google" | "github" | "credentials" | null
  >(null);

  // Utiliser le hook useAuth corrigé
  const { login, isLoading } = useAuth();

  // Réinitialiser l'état quand la modal s'ouvre
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // Fonction pour réinitialiser tous les champs
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setError("");
    setSuccess("");
    setLoadingProvider(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingProvider("credentials");

    try {
      // Utiliser la fonction login du hook useAuth
      await login("credentials", { email, password });

      setSuccess("Connexion réussie ! Redirection...");

      // Fermer la modal après un délai
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setLoadingProvider(null);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setError("");
    setLoadingProvider(provider);
    try {
      // Pour OAuth, laisser NextAuth gérer la redirection
      await login(provider);
      // Réinitialiser avant de fermer
      resetForm();
    } catch (err: any) {
      setError(err.message || `Erreur de connexion avec ${provider}`);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl bg-[#050505] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 max-h-[90vh] overflow-y-auto">
        {/* Noise & Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

        {/* Header */}
        <div className="relative border-b border-white/5 p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <span className="font-bold text-gray-950 text-lg">J</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Bon retour
              </h2>
              <p className="text-white/40 text-sm">
                Connectez-vous pour accéder à vos analyses
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105 group"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Colonne gauche - Formulaire */}
          <div className="p-8 lg:p-12 space-y-8 relative z-10">
            {/* Boutons de connexion rapide */}
            <div className="grid grid-cols-2 gap-4">
              <CustomButton
                onClick={() => handleSocialLogin("google")}
                disabled={isLoading || !!loadingProvider}
                className="w-full flex items-center justify-center gap-2 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Chrome className="w-5 h-5" />
                <span>Google</span>
                {loadingProvider === "google" && (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                )}
              </CustomButton>

              <CustomButton
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading || !!loadingProvider}
                className="w-full flex items-center justify-center gap-2 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
                {loadingProvider === "github" && (
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                )}
              </CustomButton>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs font-medium text-white/20 uppercase tracking-widest">
                ou continuer avec email
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top duration-200">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 animate-in slide-in-from-top duration-200">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-green-200">{success}</span>
                </div>
              )}

              <div className="space-y-4">
                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@entreprise.com"
                  label="Adresse email"
                  icon={Mail}
                  disabled={isLoading || !!loadingProvider}
                />

                <div className="space-y-2">
                  <InputField
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    label="Mot de passe"
                    required
                    icon={Lock}
                    showPasswordToggle
                    disabled={isLoading || !!loadingProvider}
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs text-white/40 hover:text-yellow-500 transition-colors disabled:opacity-50"
                      disabled={isLoading || !!loadingProvider}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <CustomButton
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={loadingProvider === "credentials"}
                  disabled={isLoading || !!loadingProvider || !email || !password}
                  className="h-14 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-lg shadow-[0_4px_20px_-5px_rgba(202,138,4,0.3)] hover:shadow-[0_8px_30px_-5px_rgba(202,138,4,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProvider === "credentials"
                    ? "Connexion..."
                    : "Se connecter"}
                </CustomButton>
              </div>

              <div className="text-center">
                <p className="text-white/40 text-sm">
                  Pas encore de compte ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      onSwitchToRegister();
                    }}
                    className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors disabled:opacity-50"
                    disabled={isLoading || !!loadingProvider}
                  >
                    Créer un compte
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Colonne droite - Visuel & Info */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 bg-white/[0.02] border-l border-white/5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,rgba(250,204,21,0.05)_0%,transparent_50%)] pointer-events-none" />

            <div className="relative space-y-8">
              <div className="animate-slide-up [animation-delay:0.2s]">
                <h3 className="text-3xl font-bold text-white mb-2 leading-tight">
                  L'intelligence artificielle <br />
                  <span className="text-white/40">
                    au service de votre sécurité.
                  </span>
                </h3>
              </div>

              <div className="space-y-6 animate-slide-up [animation-delay:0.4s]">
                {[
                  {
                    icon: TrendingUp,
                    label: "Historique complet",
                    sub: "Retrouvez toutes vos analyses",
                  },
                  {
                    icon: Shield,
                    label: "Données chiffrées",
                    sub: "Protection AES-256",
                  },
                  {
                    icon: Zap,
                    label: "Analyse instantanée",
                    sub: "Résultats en < 45s",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-yellow-500/10 group-hover:border-yellow-500/20 transition-all duration-500">
                      <item.icon className="w-5 h-5 text-white/40 group-hover:text-yellow-500 transition-colors duration-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-yellow-500 transition-colors">
                        {item.label}
                      </h4>
                      <p className="text-xs text-white/30">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-12 p-6 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md animate-slide-up [animation-delay:0.6s]">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-black bg-gray-600"
                    />
                  ))}
                </div>
                <div className="text-xs text-white/40">
                  <span className="text-white font-bold">1,000+</span> experts
                  nous font confiance
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                "Jurisk.io a transformé notre façon de travailler. C'est l'outil
                que nous attendions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;