'use client'

import { useState } from 'react'
import { 
  X, 
  Mail, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Shield, 
  Zap, 
  TrendingUp,
  Chrome,
  Github,
  Loader2
} from 'lucide-react'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import { InputField } from '../ui/custom/InputField'
import { useAuth } from '@/lib/hooks/useAuth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Utiliser le hook useAuth
  const { login, isLoading } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Utiliser la fonction login du hook useAuth
      await login('credentials', { email, password })
      
      setSuccess('Connexion réussie ! Redirection...')
      
      // Fermer la modal après un délai
      setTimeout(() => {
        onClose()
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setError('')
    try {
      await login(provider)
      // La modal se fermera automatiquement via la redirection NextAuth
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erreur de connexion avec ${provider}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-gray-900/40 to-black rounded-2xl w-full max-w-5xl border border-gray-300/15 shadow-2xl shadow-yellow-500/5 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="relative overflow-hidden border-b border-gray-300/15">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-yellow-600/5 to-transparent"></div>
          <div className="relative flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Bon retour !
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Connectez-vous pour accéder à vos analyses
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
          <div className="space-y-6">
            {/* Boutons de connexion rapide */}
            <div className="space-y-3">
              <CustomButton
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-6 bg-transparent text-white hover:bg-gray-400/15 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300/15 hover:border-yellow-500/30"
              >
                <Chrome className="w-5 h-5" />
                <span>Continuer avec Google</span>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </CustomButton>
              
              <CustomButton
                onClick={() => handleSocialLogin('github')}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-6 bg-transparent text-white hover:bg-gray-400/15 font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300/15 hover:border-yellow-500/30"
              >
                <Github className="w-5 h-5" />
                <span>Continuer avec GitHub</span>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              </CustomButton>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-400">ou</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
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

              {/* Email */}
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                label="Adresse email"
                icon={Mail}
                //disabled={isLoading}
              />

              {/* Mot de passe */}
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                label="Mot de passe"
                required
                icon={Lock}
                showPasswordToggle
                //disabled={isLoading}
              />

              {/* Options supplémentaires */}
              <div className="flex items-end justify-end text-sm">
                <button
                  type="button"
                  className="text-yellow-600 hover:text-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
                  disabled={isLoading}
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton */}
              <CustomButton
                type="submit"
                fullWidth
                size="lg"
                variant="outline"
                isLoading={isLoading}
                disabled={isLoading}
                className="mt-2 hover:bg-yellow-600/30 hover:border-yellow-600/20 hover:text-yellow-600/80 border-gray-300/30 transition-all"
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </CustomButton>

              {/* Lien inscription */}
              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-yellow-600 hover:text-yellow-600/70 hover:cursor-pointer font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    Créer un compte →
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Colonne droite - Statistiques & Avantages */}
          <div className="space-y-6">
            
            {/* Stats principales */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5 hover:border-yellow-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">1K+</span>
                </div>
                <p className="text-xs text-gray-400">Contrats analysés</p>
              </div>
              
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5 hover:border-yellow-500/20 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-white">98%</span>
                </div>
                <p className="text-xs text-gray-400">Précision de l'IA</p>
              </div>
            </div>

            {/* Carte avantages */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-8 hover:border-yellow-500/30 transition-colors">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative space-y-4">
                <h3 className="text-xl font-bold text-white">Pourquoi se connecter ?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Accès à votre historique</p>
                      <p className="text-xs text-gray-400">Retrouvez toutes vos analyses</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Synchronisation multi-appareils</p>
                      <p className="text-xs text-gray-400">Travaillez où que vous soyez</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Données sécurisées</p>
                      <p className="text-xs text-gray-400">Chiffrement de bout en bout</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">10 crédits gratuits</p>
                      <p className="text-xs text-gray-400">Analysez vos premiers contrats</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Fonctionnalités */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5 hover:border-blue-500/20 transition-colors">
                <Shield className="w-8 h-8 text-blue-400 mb-3" />
                <h4 className="font-semibold text-white mb-1">Sécurisé</h4>
                <p className="text-xs text-gray-400">Protection maximale de vos données</p>
              </div>
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5 hover:border-purple-500/20 transition-colors">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-semibold text-white mb-1">Rapide</h4>
                <p className="text-xs text-gray-400">Résultats en quelques secondes</p>
              </div>
            </div>

            {/* Footer légal */}
            <div className="pt-2">
              <p className="text-xs text-gray-500 leading-relaxed">
                En vous connectant, vous acceptez nos{' '}
                <a 
                  href="/terms" 
                  className="text-gray-400 hover:text-yellow-600 underline transition-colors hover:cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Conditions d'utilisation
                </a>{' '}
                et notre{' '}
                <a 
                  href="/privacy" 
                  className="text-gray-400 hover:text-yellow-600 underline transition-colors hover:cursor-pointer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
                . Vos données sont traitées de manière sécurisée et confidentielle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal