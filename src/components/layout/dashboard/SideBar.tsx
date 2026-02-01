"use client";
import { useState, useRef, useCallback } from "react";
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
}: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const menuRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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
    },
    [onSetSelectedChat, router],
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
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case "PROCESSING":
        return <Loader2 className="h-3 w-3 text-yellow-500 animate-spin" />;
      case "FAILED":
        return <XCircle className="h-3 w-3 text-red-500" />;
      case "PENDING":
        return <Clock className="h-3 w-3 text-gray-500" />;
      default:
        return <AlertCircle className="h-3 w-3 text-gray-500" />;
    }
  };

  return (
    <div className="fixed w-64 h-screen border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-2xl z-20">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3 mb-8 px-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <span className="font-bold text-gray-900 text-sm">J</span>
          </div>
          <span className="font-bold text-sm tracking-tight text-white/90">
            Jurisk.io
          </span>
        </div>

        <Link
          href="/upload"
          className="w-full bg-yellow-600 hover:bg-yellow-500 text-gray-950 font-black py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 text-xs mb-8 shadow-[0_10px_20px_-5px_rgba(202,138,4,0.2)] hover:scale-[1.02]"
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
              className="w-full bg-white/5 border border-white/10 text-white text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-yellow-600/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-white/20" />
          </div>
          <button
            onClick={() => onSetFilterMenuOpen(!filterMenuOpen)}
            className={`px-3 py-2 rounded-xl border transition-all ${
              filterMenuOpen || selectedStatus !== "ALL"
                ? "bg-yellow-600 border-yellow-600 text-white shadow-lg"
                : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status Filter Menu */}
        {filterMenuOpen && (
          <div className="absolute left-3 right-3 mt-2 bg-gray-300/10 border border-gray-300/20 rounded-lg shadow-xl z-30 backdrop-blur-sm">
            {["ALL", "PROCESSING", "COMPLETED", "FAILED"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-300/15 transition-colors ${
                  selectedStatus === status
                    ? "bg-yellow-600/20 text-yellow-600"
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
        <div className="px-6 py-4 border-b border-white/5">
          <div className="grid grid-cols-2 gap-4 text-[10px] font-black tracking-widest uppercase">
            <div className="flex flex-col">
              <span className="text-white/20 mb-1">Total</span>
              <span className="text-white">{stats.total}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/20 mb-1">Terminés</span>
              <span className="text-green-500/80">{stats.completed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Analyses List */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
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
                    ? "bg-white/5 border-white/10"
                    : "border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      selectedChat === analysis.id ||
                      pathname.includes(analysis.id)
                        ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
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
                  className="absolute right-2 top-8 z-50 w-48 bg-black border border-gray-300/20 rounded-lg shadow-xl"
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
      <div className="p-4 border-t border-white/5 relative">
        <button
          onClick={() => onSetUserMenuOpen(!userMenuOpen)}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-white/5 transition-all group"
        >
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-black text-white text-[10px] flex-shrink-0 border border-white/10 group-hover:border-yellow-500/30 transition-colors">
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
          <div className="absolute bottom-full left-3 right-3 mb-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden z-30 backdrop-blur-sm">
            <div className="px-4 py-3 border-b border-gray-300/15">
              <div className="text-sm font-medium text-white">
                {user?.name || user?.email}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {user?.credits || 0} crédits disponibles
              </div>
            </div>

            <Link
              href="/pricing"
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 hover:cursor-pointer transition-colors text-left border-b border-gray-300/15"
            >
              <div className="w-7 h-7 rounded bg-yellow-600/10 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-yellow-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  Acheter des crédits
                </div>
                <div className="text-xs text-gray-500">
                  Recharger votre compte
                </div>
              </div>
            </Link>

            <Link
              href="/account"
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800 hover:cursor-pointer transition-colors text-left"
            >
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Mon compte</span>
            </Link>

            <Link
              href="/settings"
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-800 hover:cursor-pointer border-t border-gray-300/15 transition-colors text-left"
            >
              <Settings className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Paramètres</span>
            </Link>

            <div className="border-t border-gray-300/15">
              <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-600/10 text-gray-400 hover:text-red-400 hover:cursor-pointer transition-colors text-left"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
