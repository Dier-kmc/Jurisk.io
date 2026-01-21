'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import { LoginModal } from '@/components/auth/LoginModal'
import { RegisterModal } from '@/components/auth/RegisterModal'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  
  const { user, logout, isAuthenticated, loading } = useAuth()

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/pricing', label: 'Tarifs' },
  ];

  const handleLoginClick = () => {
    setShowLoginModal(true)
    setShowRegisterModal(false)
  }

  const handleRegisterClick = () => {
    setShowRegisterModal(true)
    setShowLoginModal(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-gray-900">CS</span>
              </div>
              <span className="text-white font-bold text-xl">ContractScope</span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex ml-10 space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${
                    pathname === link.href
                      ? 'text-yellow-600 font-medium'
                      : 'text-gray-300 hover:text-yellow-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user?.name || user?.email}</p>
                      <p className="text-xs text-gray-400">{user?.credits} crédits</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:cursor-pointer hover:bg-gray-300/15 hover:rounded-md transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <CustomButton
                    variant="outline"
                    size="sm"
                    onClick={handleLoginClick}
                    className='border-gray-300/30 px-4'
                  >
                    Connexion
                  </CustomButton>
                  <CustomButton
                    size="sm"
                    onClick={handleRegisterClick}
                  >
                    S'inscrire gratuitement
                  </CustomButton>
                </>
              )}
            </div>

            {/* Menu Mobile Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menu Mobile */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tarifs
                </Link>
                
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Tableau de bord
                    </Link>
                    <Link
                      href="/upload"
                      className="text-gray-300 hover:text-yellow-500 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Analyser
                    </Link>
                    <div className="pt-4 border-t border-gray-800">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user?.name || user?.email}</p>
                            <p className="text-xs text-gray-400">{user?.credits} crédits</p>
                          </div>
                        </div>
                      </div>
                      <CustomButton
                        variant="danger"
                        fullWidth
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </CustomButton>
                    </div>
                  </>
                ) : (
                  <div className="pt-4 border-t border-gray-800 space-y-3">
                    <CustomButton
                      variant="outline"
                      fullWidth
                      onClick={handleLoginClick}
                      className='border border-gray-300/15'
                    >
                      Connexion
                    </CustomButton>
                    <CustomButton
                      fullWidth
                      onClick={handleRegisterClick}
                    >
                      S'inscrire gratuitement
                    </CustomButton>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleRegisterClick}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleLoginClick}
      />
    </>
  )
}

export default Header;