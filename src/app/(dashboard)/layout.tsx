"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { AnalysisStats, ContractAnalysis } from "@/types/contract";
import {
  AnalysisApiService,
  AnalysisFilters,
} from "@/lib/services/global-analysis";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import DeleteConfirmationModal from "@/components/layout/dashboard/DeleteConfirmation";
import Sidebar from "@/components/layout/dashboard/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // State variables
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [analysisToDelete, setAnalysisToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [analyses, setAnalyses] = useState<ContractAnalysis[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [filters, setFilters] = useState<AnalysisFilters>({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    fetchAnalyses();
  }, [pathname, isAuthenticated, isLoading]);

  useEffect(() => {
    if (pathname === "/upload") {
      setSelectedChat(null);
    }
  }, [pathname]);

  // Fermer le menu quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AnalysisApiService.getAnalyses(filters);

      if (response.success) {
        setAnalyses(response.data.contracts);
        const responseStats = response.data.stats;
        const completeStats: AnalysisStats = {
          total: responseStats.total || 0,
          completed: responseStats.completed || 0,
          processing: responseStats.processing || 0,
          failed: responseStats.failed || 0,
          pending: responseStats.pending || 0, // Ajouter une valeur par défaut
        };
        setStats(completeStats);
      }
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
      toast.error("Erreur lors du chargement des analyses");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchAnalyses();
    }
  }, [fetchAnalyses, isAuthenticated, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      const hasProcessing = analyses.some((a) => a.status === "PROCESSING");
      if (hasProcessing) {
        fetchAnalyses();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [analyses, fetchAnalyses]);

  const handleOpenDeleteModal = useCallback((analysis: ContractAnalysis) => {
    setAnalysisToDelete({
      id: analysis.id,
      name: analysis.fileName || analysis.contract?.fileName || "Sans nom", // Fournir une valeur par défaut
    });
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!analysisToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/analysis/${analysisToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Analyse supprimée avec succès");
        fetchAnalyses(); // Rafraîchir la liste

        // Si on supprime l'analyse actuellement sélectionnée
        if (
          selectedChat === analysisToDelete.id ||
          pathname.includes(analysisToDelete.id)
        ) {
          router.push("/upload");
          setSelectedChat(null);
        }

        // Fermer le modal
        setDeleteModalOpen(false);
        setAnalysisToDelete(null);
      } else {
        const error = await response.json();
        toast.error(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  }, [
    analysisToDelete,
    selectedChat,
    pathname,
    router,
    fetchAnalyses,
    setSelectedChat,
  ]);

  const handleFilterChange = useCallback(
    (newFilters: Partial<AnalysisFilters>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page || 1,
      }));
    },
    [],
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/90">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Don't render dashboard content if not authenticated
  }

  return (
    <>
      <div className="flex h-screen bg-[#050505] text-white relative overflow-hidden">
        {/* Global Noise & Depth */}
        <div className="noise-overlay pointer-events-none fixed inset-0 z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none fixed z-0" />

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-gray-900 text-sm">J</span>
            </div>
            <span className="font-bold text-sm tracking-tight text-white/90">
              Jurisk.io
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <Sidebar
          analyses={analyses}
          stats={stats}
          loading={loading}
          filters={filters}
          selectedChat={selectedChat}
          userMenuOpen={userMenuOpen}
          filterMenuOpen={filterMenuOpen}
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          hoveredItem={hoveredItem}
          openMenuId={openMenuId}
          onFetchAnalyses={fetchAnalyses}
          onSetSelectedChat={setSelectedChat}
          onSetUserMenuOpen={setUserMenuOpen}
          onSetFilterMenuOpen={setFilterMenuOpen}
          onSetSearchQuery={setSearchQuery}
          onSetSelectedStatus={setSelectedStatus}
          onSetHoveredItem={setHoveredItem}
          onSetOpenMenuId={setOpenMenuId}
          onHandleFilterChange={handleFilterChange}
          onOpenDeleteModal={handleOpenDeleteModal}
          // Mobile props
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative z-10 md:ml-64 bg-[#050505]/40 backdrop-blur-sm h-full overflow-hidden pt-16 md:pt-0 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </main>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
            setAnalysisToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
        itemName={analysisToDelete?.name}
        isDeleting={isDeleting}
      />
    </>
  );
}
