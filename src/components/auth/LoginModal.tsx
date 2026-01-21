'use client'

import { useState } from 'react'
import { X, Mail, Lock, AlertCircle, CheckCircle2, Eye, EyeOff, FileText, Shield, Zap, TrendingUp } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import { InputField } from '../ui/custom/InputField'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion')
      }

      setSuccess('Connexion réussie ! Redirection...')
      
      setTimeout(() => {
        onClose()
        window.location.reload()
      }, 1000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
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

              {/* Email */}
              <InputField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="youremail@gmail.com"
                label="Adresse email"
                icon={Mail}
              />
              {/* <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Adresse email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-yellow-600 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 text-white placeholder-gray-500 transition-all"
                    required
                  />
                </div>
              </div> */}

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

              {/* Bouton */}
              <CustomButton
                type="submit"
                fullWidth
                size="lg"
                variant="outline"
                isLoading={loading}
                disabled={loading}
                className="mt-6 hover:bg-yellow-600/30 hover:border-yellow-600/20 hover:text-yellow-600/80 border-gray-300/30"
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </CustomButton>

              {/* Lien inscription */}
              <div className="text-center pt-4">
                <p className="text-gray-400 text-sm">
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToRegister}
                    className="text-yellow-600 hover:text-yellow-600/70 hover:cursor-pointer font-medium transition-colors"
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
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-2xl font-bold text-white">50</span>
                </div>
                <p className="text-xs text-gray-400">Contrats analysés</p>
              </div>
              
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  <span className="text-2xl font-bold text-white">98%</span>
                </div>
                <p className="text-xs text-gray-400">Précision de l'IA</p>
              </div>
            </div>

            {/* Carte avantages */}
            <div className="relative overflow-hidden rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"></div>
              <div className="relative space-y-4">
                <h3 className="text-xl font-bold text-white">Reprenez là où vous en étiez</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Accédez à votre historique</p>
                      <p className="text-xs text-gray-400">Retrouvez toutes vos analyses</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Synchronisé sur tous vos appareils</p>
                      <p className="text-xs text-gray-400">Travaillez où que vous soyez</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">Vos données sécurisées</p>
                      <p className="text-xs text-gray-400">Chiffrement de bout en bout</p>
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
                <p className="text-xs text-gray-400">Protection maximale de vos données</p>
              </div>
              <div className="bg-gray-800/15 border border-gray-300/15 rounded-xl p-5">
                <Zap className="w-8 h-8 text-purple-400 mb-3" />
                <h4 className="font-semibold text-white mb-1">Instantané</h4>
                <p className="text-xs text-gray-400">Résultats en temps réel</p>
              </div>
            </div>

            {/* Footer légal */}
            <div className="pt-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                En vous connectant, vous acceptez nos{' '}
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

export default LoginModal