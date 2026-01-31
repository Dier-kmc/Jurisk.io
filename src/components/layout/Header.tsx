"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, LogOut } from "lucide-react";
import { CustomButton } from "@/components/ui/custom/CustomButton";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/pricing", label: "Tarifs" },
  ];

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setShowRegisterModal(false);
  };

  const handleRegisterClick = () => {
    setShowRegisterModal(true);
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 pointer-events-none animate-slide-up">
        <div className="container max-w-7xl pointer-events-auto">
          <div className="mx-4 glass-card px-6 py-4 rounded-2xl flex items-center justify-between border-white/10 shadow-2xl">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="font-bold text-gray-900 text-lg">J</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
                Jurisk
                <span className="gradient-text italic font-serif">.io</span>
              </span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center bg-white/[0.03] border border-white/5 rounded-full px-6 py-2 ml-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 text-sm font-medium transition-all duration-300 ${
                    pathname === link.href
                      ? "text-yellow-500"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/5 pr-4 pl-2 py-1 rounded-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-full flex items-center justify-center border border-yellow-500/20">
                      <User className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/90 leading-tight">
                        {user?.name || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-[10px] text-yellow-500/80 font-bold uppercase tracking-wider">
                        {user?.credits} crédits
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    title="Déconnexion"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="px-5 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Connexion
                  </button>
                  <CustomButton
                    size="sm"
                    onClick={handleRegisterClick}
                    className="rounded-xl px-6 h-10 bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-bold shadow-[0_0_15px_rgba(202,138,4,0.3)]"
                  >
                    Démarrer l'essai
                  </CustomButton>
                </>
              )}
            </div>

            {/* Menu Mobile Button */}
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Menu Mobile Expansion */}
          {isMenuOpen && (
            <div className="md:hidden mx-4 mt-2 glass-card rounded-2xl p-6 border-white/10 animate-fade-in">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-gray-300 hover:text-yellow-500 transition-colors py-2 border-b border-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {user?.name || user?.email}
                        </p>
                        <p className="text-sm text-yellow-500">
                          {user?.credits} crédits disponibles
                        </p>
                      </div>
                    </div>
                    <CustomButton
                      variant="danger"
                      fullWidth
                      onClick={handleLogout}
                      className="rounded-xl"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </CustomButton>
                  </div>
                ) : (
                  <div className="pt-4 flex flex-col gap-3">
                    <CustomButton
                      variant="outline"
                      fullWidth
                      onClick={handleLoginClick}
                      className="rounded-xl border-white/10"
                    >
                      Connexion
                    </CustomButton>
                    <CustomButton
                      fullWidth
                      onClick={handleRegisterClick}
                      className="rounded-xl bg-yellow-600 text-gray-950 font-bold"
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
  );
}

export default Header;
