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

  const router = useRouter();
  const pathname = usePathname();

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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black/90">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
      </div>
    );
  }

  if (!isAuthenticated && !isLoading) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div className="flex h-screen bg-[#050505] text-white relative">
        {/* Global Noise & Depth */}
        <div className="noise-overlay pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.03)_0%,transparent_50%)] pointer-events-none" />

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
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative z-10 ml-64 bg-[#050505]/40 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          {children}
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
