"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  FileText,
  Plus,
  LogOut,
  Settings,
  User,
  Sparkles,
  MoreHorizontal,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Copy,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { AnalysisStats, ContractAnalysis } from "@/types/contract";
import {
  AnalysisApiService,
  AnalysisFilters,
} from "@/lib/services/global-analysis";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface SidebarProps {
  analyses: ContractAnalysis[];
  stats: AnalysisStats | null;
  loading: boolean;
  filters: AnalysisFilters;
  selectedChat: string | null;
  userMenuOpen: boolean;
  filterMenuOpen: boolean;
  searchQuery: string;
  selectedStatus: string;
  hoveredItem: string | null;
  openMenuId: string | null;
  onFetchAnalyses: () => Promise<void>;
  onSetSelectedChat: (id: string | null) => void;
  onSetUserMenuOpen: (open: boolean) => void;
  onSetFilterMenuOpen: (open: boolean) => void;
  onSetSearchQuery: (query: string) => void;
  onSetSelectedStatus: (status: string) => void;
  onSetHoveredItem: (id: string | null) => void;
  onSetOpenMenuId: (id: string | null) => void;
  onHandleFilterChange: (newFilters: Partial<AnalysisFilters>) => void;
  onOpenDeleteModal?: (analysis: ContractAnalysis) => void;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

export default function Sidebar({
  analyses,
  stats,
  loading,
  filters,
  selectedChat,
  userMenuOpen,
  filterMenuOpen,
  searchQuery,
  selectedStatus,
  hoveredItem,
  openMenuId,
  onFetchAnalyses,
  onSetSelectedChat,
  onSetUserMenuOpen,
  onSetFilterMenuOpen,
  onSetSearchQuery,
  onSetSelectedStatus,
  onSetHoveredItem,
  onSetOpenMenuId,
  onHandleFilterChange,
  onOpenDeleteModal,
  mobileMenuOpen = false,
  onCloseMobileMenu,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Fermer le menu lors d'un clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!openMenuId) return;

      const menuRef = menuRefs.current.get(openMenuId);

      // Si le clic est à l'extérieur du menu ouvert, on le ferme
      if (menuRef && !menuRef.contains(event.target as Node)) {
        onSetOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, onSetOpenMenuId]);

  const handleSearch = useCallback(
    (term: string) => {
      onSetSearchQuery(term);
      onHandleFilterChange({ search: term });
    },
    [onSetSearchQuery, onHandleFilterChange],
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      onSetSelectedStatus(status);
      onHandleFilterChange({
        status: status === "ALL" ? undefined : status,
        page: 1,
      });
      onSetFilterMenuOpen(false);
    },
    [onSetSelectedStatus, onHandleFilterChange, onSetFilterMenuOpen],
  );

  const handleAnalysisClick = useCallback(
    (analysis: ContractAnalysis) => {
      onSetSelectedChat(analysis.id);
      router.push(`/result/${analysis.id}`);
      if (onCloseMobileMenu) onCloseMobileMenu();
    },
    [onSetSelectedChat, router, onCloseMobileMenu],
  );

  const handleDeleteAnalysis = useCallback(
    (analysis: ContractAnalysis, event: React.MouseEvent) => {
      event.stopPropagation(); // Empêche le clic sur l'item

      onSetOpenMenuId(null);

      // Si la prop onOpenDeleteModal est fournie, l'utiliser
      // Utiliser le modal de confirmation
      if (onOpenDeleteModal) {
        onOpenDeleteModal(analysis);
      }
    },
    [onOpenDeleteModal, onSetOpenMenuId],
  );

  const handleCopyLink = useCallback(
    (analysisId: string, event: React.MouseEvent) => {
      event.stopPropagation();
      const link = `${window.location.origin}/result/${analysisId}`;
      navigator.clipboard.writeText(link);
      toast.success("Lien copié dans le presse-papier");
      onSetOpenMenuId(null);
    },
    [onSetOpenMenuId],
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-3 w-3 text-risk-low" />;
      case "PROCESSING":
        return <Loader2 className="h-3 w-3 text-accent animate-spin" />;
      case "FAILED":
        return <XCircle className="h-3 w-3 text-red-500" />;
      case "PENDING":
        return <Clock className="h-3 w-3 text-gray-500" />;
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 border-r border-border flex flex-col bg-surface-1 z-50 transform transition-transform duration-300 ease-in-out ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 px-2 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <span className="font-bold text-gray-900 text-lg">J</span>
          </div>
          <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
            Jurisk
            <span className="gradient-text">.io</span>
          </span>
        </Link>

        {/* Mobile Close Button */}
        {onCloseMobileMenu && (
          <button
            onClick={onCloseMobileMenu}
            className="md:hidden p-2 text-white/40 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 18 18" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6 pt-0 mt-6">
        <Link
          href="/upload"
          className="w-full bg-accent hover:bg-accent-bright text-background font-black py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 text-xs mb-8"
        >
          <Plus className="h-4 w-4" />
          Nouvelle analyse
        </Link>

        {/* Search and Filter Bar */}
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/5 border border-border text-white text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-accent/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
          </div>
          <button
            onClick={() => onSetFilterMenuOpen(!filterMenuOpen)}
            className={`px-3 py-2 rounded-xl border transition-all ${
              filterMenuOpen || selectedStatus !== "ALL"
                ? "bg-accent border-accent text-background"
                : "bg-white/5 border-border text-white/40 hover:bg-white/10"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status Filter Menu */}
        {filterMenuOpen && (
          <div className="absolute left-3 right-3 mt-2 bg-surface-2 border border-border rounded-lg shadow-xl z-30 backdrop-blur-sm">
            {["ALL", "PROCESSING", "COMPLETED", "FAILED"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                  selectedStatus === status
                    ? "bg-accent/15 text-accent"
                    : "text-gray-300"
                }`}
              >
                {getStatusIcon(status)}
                {status === "ALL"
                  ? "Tous"
                  : status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="px-6 py-4 border-b border-border">
          <div className="grid grid-cols-2 gap-4 text-[10px] font-black tracking-widest uppercase">
            <div className="flex flex-col">
              <span className="text-white/20 mb-1">Total</span>
              <span className="text-white">{stats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/20 mb-1">Terminés</span>
              <span className="text-risk-low">{stats.completed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analyses List */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8 px-4">
            <FileText className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              {searchQuery || selectedStatus !== "ALL"
                ? "Aucune analyse trouvée"
                : "Commencez par analyser un document"}
            </p>
          </div>
        ) : (
          analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="relative group px-2"
              onMouseEnter={() => onSetHoveredItem(analysis.id)}
              onMouseLeave={() => {
                if (openMenuId !== analysis.id) {
                  onSetHoveredItem(null);
                }
              }}
            >
              <button
                onClick={() => handleAnalysisClick(analysis)}
                className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all border ${
                  selectedChat === analysis.id || pathname.includes(analysis.id)
                    ? "bg-white/5 border-border"
                    : "border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      selectedChat === analysis.id ||
                      pathname.includes(analysis.id)
                        ? "bg-accent"
                        : "bg-white/10"
                    }`}
                  />
                  <span
                    className={`text-[11px] font-bold truncate transition-colors ${
                      selectedChat === analysis.id ||
                      pathname.includes(analysis.id)
                        ? "text-white"
                        : "text-white/40 group-hover:text-white/60"
                    }`}
                  >
                    {analysis.fileName}
                  </span>
                </div>
              </button>

              {/* Menu "More" visible au hover */}
              {(hoveredItem === analysis.id || openMenuId === analysis.id) && (
                <div className="absolute right-1 top-1/2 -translate-y-1/2 hover:cursor-pointer">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetOpenMenuId(
                        openMenuId === analysis.id ? null : analysis.id,
                      );
                    }}
                    className="p-1.5 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              )}

              {/* Menu déroulant */}
              {openMenuId === analysis.id && (
                <div
                  ref={(el) => {
                    if (el) {
                      menuRefs.current.set(analysis.id, el);
                    } else {
                      menuRefs.current.delete(analysis.id);
                    }
                  }}
                  className="absolute right-2 top-8 z-50 w-48 bg-surface-2 border border-border rounded-lg shadow-xl"
                >
                  <div className="p-1">
                    <button
                      onClick={(e) => handleCopyLink(analysis.id, e)}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-400/20 hover:text-white rounded-md transition-colors cursor-pointer"
                    >
                      <Copy className="h-3.5 w-3.5 mr-2" />
                      Copier le lien
                    </button>

                    <div className="border-t border-gray-800 my-1"></div>

                    <button
                      onClick={(e) => handleDeleteAnalysis(analysis, e)}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-400/20 hover:text-red rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer - User Menu */}
      <div className="p-4 border-t border-border relative">
        <button
          onClick={() => onSetUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-white text-[10px] flex-shrink-0 border border-border group-hover:border-accent/30 transition-colors">
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex-1 text-left overflow-hidden">
            <div className="text-[11px] font-bold text-white/80 truncate group-hover:text-white transition-colors">
              {user?.name || user?.email || "Utilisateur"}
            </div>
            <div className="text-[9px] font-black tracking-widest uppercase text-white/20 mt-0.5">
              {user?.credits || 0} CRÉDITS
            </div>
          </div>
          <MoreHorizontal
            className={`h-4 w-4 text-white/20 transition-all ${
              userMenuOpen
                ? "rotate-90 text-white"
                : "group-hover:text-white/40"
            }`}
          />
        </button>

        {/* User Dropdown Menu */}
        {userMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-4 mx-3 bg-surface-2 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
            {/* User Info Header */}
            <div className="px-4 py-4 bg-gradient-to-br from-white/5 to-transparent border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-bright p-[1px] shadow-lg">
                  <div className="w-full h-full rounded-full bg-surface-1 flex items-center justify-center">
                    <span className="font-bold text-white text-sm">
                      {user?.name
                        ? user.name.charAt(0).toUpperCase()
                        : user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {user?.name || user?.email}
                  </div>
                  <div className="text-[10px] font-medium text-white/40 truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Credits Section */}
            <div className="px-2 py-2">
              <Link
                href="/pricing"
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-accent/10 to-transparent border border-accent/10 hover:border-accent/30 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-accent">
                    {user?.credits || 0} crédits
                  </div>
                  <div className="text-[10px] text-accent/60">
                    Recharger mon compte
                  </div>
                </div>
                <Plus className="h-4 w-4 text-accent/40 group-hover:text-accent transition-colors" />
              </Link>
            </div>

            <div className="px-2 pb-2">
              <Link
                href="/account"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer group"
              >
                <User className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">Mon compte</span>
              </Link>

              <Link
                href="/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer group"
              >
                <Settings className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
                <span className="text-sm font-medium">Paramètres</span>
              </Link>
            </div>

            <div className="p-2 border-t border-border bg-white/[0.02]">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer group"
              >
                <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
