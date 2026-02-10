"use client";

import {
  X,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  FileText,
  Shield,
  Zap,
  Chrome,
  Github,
} from "lucide-react";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRegisterForm } from "@/lib/hooks/form/useRegisterForm";
import { InputField } from "../ui/custom/InputField";
import { PasswordStrengthIndicator } from "../ui/custom/PasswordStrengthIndicator";
import { RegisterModalProps } from "../modals/types";

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    success,
    passwordsMatch,
    passwordStrength,
    handleSubmit,
  } = useRegisterForm({ onClose });

  const { login, isLoading: isAuthLoading } = useAuth();

  const handleSocialLogin = async (provider: "google" | "github") => {
    try {
      await login(provider);
    } catch (err) {
      console.error("Social login error:", err);
    }
  };

  if (!isOpen) return null;

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
                Rejoignez l'élite
              </h2>
              <p className="text-white/40 text-sm">
                Créez votre compte pour commencer l'analyse
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
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
            {/* <div className="grid grid-cols-2 gap-4">
              <CustomButton
                onClick={() => handleSocialLogin("google")} // Note: handleSocialLogin needs to be implemented or linked correctly if missing in RegisterModal context, strictly speaking RegisterModal has it defined in line 50.
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center gap-2 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Chrome className="w-5 h-5" />
                <span>Google</span>
              </CustomButton>

              <CustomButton
                onClick={() => handleSocialLogin("github")}
                disabled={isAuthLoading}
                className="w-full flex items-center justify-center gap-2 py-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </CustomButton>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-xs font-medium text-white/20 uppercase tracking-widest">
                ou avec email
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div> */}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-200">{error}</span>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-green-200">{success}</span>
                </div>
              )}

              <div className="space-y-4">
                <InputField
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  label="Nom complet (optionnel)"
                  icon={User}
                />

                <InputField
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@entreprise.com"
                  label="Adresse email"
                  icon={Mail}
                />

                <InputField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  label="Mot de passe"
                  required
                  icon={Lock}
                  showPasswordToggle
                />

                {password && (
                  <PasswordStrengthIndicator strength={passwordStrength} />
                )}

                <InputField
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  label="Confirmer le mot de passe"
                  required
                  icon={Lock}
                  showPasswordToggle
                  error={
                    confirmPassword && !passwordsMatch
                      ? "Les mots de passe ne correspondent pas"
                      : undefined
                  }
                  success={passwordsMatch ? "Parfait !" : undefined}
                />
              </div>

              <div className="pt-4">
                <CustomButton
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={loading}
                  disabled={loading}
                  className="h-14 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-lg shadow-[0_4px_20px_-5px_rgba(202,138,4,0.3)] hover:shadow-[0_8px_30px_-5px_rgba(202,138,4,0.4)] transition-all"
                >
                  {loading ? "Création..." : "Commencer gratuitement"}
                </CustomButton>
              </div>

              <div className="text-center">
                <p className="text-white/40 text-sm">
                  Déjà membre ?{" "}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-yellow-500 hover:text-yellow-400 font-medium transition-colors"
                  >
                    Se connecter
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
                  Rejoignez la révolution <br />
                  <span className="text-white/40">de l'analyse juridique.</span>
                </h3>
              </div>

              <div className="space-y-6 animate-slide-up [animation-delay:0.4s]">
                {[
                  {
                    icon: Sparkles,
                    label: "10 crédits offerts",
                    sub: "Pour démarrer immédiatement",
                  },
                  {
                    icon: Zap,
                    label: "Modèle IA Premium",
                    sub: "Accès à nos algorithmes avancés",
                  },
                  {
                    icon: Shield,
                    label: "Confidentialité totale",
                    sub: "Vos données vous appartiennent",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-yellow-500/10 group-hover:border-yellow-500/20 transition-all duration-500">
                      <item.icon className="w-5 h-5 text-white/40 group-hover:text-yellow-500 transition-colors duration-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors">
                        3 crédits offerts à l&apos;inscription
                      </span>
                      <p className="text-xs text-white/30">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-12 p-6 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-md animate-slide-up [animation-delay:0.6s]">
              <div className="flex -space-x-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-black bg-gray-600"
                  />
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-black bg-yellow-600 flex items-center justify-center text-xs font-bold text-black">
                  +1k
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed">
                Rejoignez une communauté croissante de juristes et
                d'entrepreneurs qui sécurisent leur avenir avec Jurisk.io.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
