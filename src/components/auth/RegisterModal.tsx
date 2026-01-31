'use client'

import { X, Mail, Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, FileText, Shield, Zap } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import { useRegisterForm } from '@/lib/hooks/form/useRegisterForm'
import { InputField } from '../ui/custom/InputField'
import { PasswordStrengthIndicator } from '../ui/custom/PasswordStrengthIndicator'
import { RegisterModalProps } from '../modals/types'

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
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
    handleSubmit
  } = useRegisterForm({ onClose })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-gray-900/40 to-black rounded-2xl w-full max-w-5xl border border-gray-300/15 shadow-2xl shadow-yellow-500/5 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative overflow-hidden border-b border-gray-300/15">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-yellow-600/5 to-transparent"></div>
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Rejoignez Jurisk.io
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Analysez vos contrats avec l'IA en quelques secondes
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-all duration-200 hover:rotate-90 hover:cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          
          {/* Colonne gauche - Formulaire */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              
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

              {/* Nom */}
              <InputField
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                label="Nom complet (optionnel)"
                icon={User}
              />

              {/* Email */}
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                label="Adresse email"
                icon={Mail}
              />

              {/* Mot de passe */}
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

              {/* Confirmation */}
              {password && <PasswordStrengthIndicator strength={passwordStrength} />}

              {/* Confirmation du mot de passe */}
              <InputField
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                label="Confirmer le mot de passe"
                required
                icon={Lock}
                showPasswordToggle
                error={confirmPassword && !passwordsMatch ? "Les mots de passe ne correspondent pas" : undefined}
                success={passwordsMatch ? "Parfait !" : undefined}
              />

              {/* Bouton */}
              <CustomButton
                type="submit"
                fullWidth
                size="lg"
                variant='outline'
                isLoading={loading}
                disabled={loading}
                className="mt-6 hover:bg-yellow-600/30 hover:border-yellow-600/20 hover:text-yellow-600/80 border-gray-300/30"
              >
                {loading ? 'Création en cours...' : 'Créer mon compte gratuit'}
              </CustomButton>

              {/* Lien connexion */}
              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Vous avez déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-yellow-600 hover:text-yellow-600/70 hover:cursor-pointer font-medium transition-colors"
                  >
                    Se connecter →
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Colonne droite - Avantages */}
          <div className="space-y-6">
            
            {/* Carte principale */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-yellow-600" />
                  <h3 className="text-2xl font-bold text-white">Inclus gratuitement</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-white">10 crédits offerts</p>
                      <p className="text-sm text-gray-400">Pour analyser vos premiers contrats</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-white">100% local avec Ollama</p>
                      <p className="text-sm text-gray-400">Vos données restent chez vous</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-white">Sans engagement</p>
                      <p className="text-sm text-gray-400">Aucune carte bancaire requise</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5">
                <Shield className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="font-semibold text-white mb-1">Sécurisé</h4>
                <p className="text-xs text-gray-400">Chiffrement de bout en bout</p>
              </div>
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-semibold text-white mb-1">Rapide</h4>
                <p className="text-xs text-gray-400">Analyse en 30 secondes</p>
              </div>
            </div>

            {/* Footer légal */}
            <div className="pt-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                En créant un compte, vous acceptez nos{' '}
                <a href="/terms" className="text-gray-400 hover:text-yellow-600 underline transition-colors">
                  Conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a href="/privacy" className="text-gray-400 hover:text-yellow-600 underline transition-colors">
                  Politique de confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterModal