"use client";
import { useState } from "react";
import {
  FileText,
  Plus,
  LogOut,
  Settings,
  User,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Données exemple pour l'historique
  const recentAnalyses = [
    {
      id: 1,
      title: "Contrat de prestation",
      date: "Aujourd'hui",
    },
    {
      id: 2,
      title: "Bail commercial 2026",
      date: "Hier",
    },
    {
      id: 3,
      title: "NDA Partenaire",
      date: "Il y a 2 jours",
    },
    {
      id: 4,
      title: "Contrat SaaS",
      date: "Il y a 5 jours",
    },
    {
      id: 5,
      title: "Accord de confidentialité",
      date: "Il y a 1 semaine",
    },
  ];

  return (
    <div className="flex h-screen bg-black/90 text-white">
      {/* Sidebar */}
      <div className="fixed w-64 h-screen border-r border-gray-300/20 flex flex-col bg-black">
        {/* Header */}
        <div className="p-3 mt-3 pb-6 border-b border-gray-300/20">
          <div className="flex items-center gap-2 mb-3 px-2">
            <FileText className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-sm">ContractScope</span>
          </div>

          <Link href="/upload" className="w-full bg-transparent hover:bg-gray-300/15 hover:cursor-pointer border border-gray-300/20 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
            <Plus className="h-4 w-4" />
            Nouvelle analyse
          </Link>
        </div>

        {/* Liste des analyses */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {recentAnalyses.map((analysis) => (
            <button
              key={analysis.id}
              onClick={() => setSelectedChat(analysis.id)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 transition-colors group ${
                selectedChat === analysis.id
                  ? "bg-gray-300/15"
                  : "hover:bg-gray-300/15 hover:cursor-pointer"
              }`}
            >
              <h4 className="text-sm font-medium text-white truncate group-hover:text-yellow-600 transition-colors">
                {analysis.title}
              </h4>
            </button>
          ))}
        </div>

        {/* Footer - User Menu */}
        <div className="p-3 border-t border-gray-300/20 relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-300/15 hover:cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-500 flex items-center justify-center font-semibold text-black text-sm flex-shrink-0">
              JD
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <div className="text-sm font-medium text-white truncate">
                John Doe
              </div>
              <div className="text-xs text-gray-500 truncate">Plan gratuit</div>
            </div>
            <MoreHorizontal
              className={`h-4 w-4 text-gray-400 transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-gray-300/10 border border-gray-300/15 rounded-lg shadow-xl overflow-hidden">
              <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-300/15 hover:cursor-pointer transition-colors text-left border-b border-gray-300/15">
                <div className="w-7 h-7 rounded bg-yellow-600/10 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    Mettre à niveau
                  </div>
                  <div className="text-xs text-gray-500">
                    Débloquer toutes les fonctionnalités
                  </div>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300/15 hover:cursor-pointer transition-colors text-left">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Mon compte</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-300/15 hover:cursor-pointer border-t border-gray-300/15 transition-colors text-left">
                <Settings className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">Paramètres</span>
              </button>

              <div className="border-t border-gray-300/15">
                <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-600/15 text-gray-400 hover:text-red-600/60 hover:cursor-pointer transition-colors text-left">
                  <LogOut className="h-4 w-4 " />
                  <span className="text-sm">Déconnexion</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="flex-1 flex flex-col overflow-visible bg-black/90">
          {children}
      </main>
    </div>
  );
};
