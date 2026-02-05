"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  AlertTriangle,
  FileText,
  Target,
} from "lucide-react";

// Types
import { ContractAnalysis } from "@/types/contract";

// Composants Shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Composants extraits
import AnalysisLoading from "@/components/results/AnalysisLoading";
import AnalysisError from "@/components/results/AnalysisError";
import AnalysisHeader from "@/components/results/AnalysisHeader";
import AnalysisHero from "@/components/results/AnalysisHero";
import AnalysisOverview from "@/components/results/AnalysisOverview";
import AnalysisParties from "@/components/results/AnalysisParties";
import AnalysisRisksTab from "@/components/results/AnalysisRisksTab";
import AnalysisClausesTab from "@/components/results/AnalysisClausesTab";
import AnalysisStrategyTab from "@/components/results/AnalysisStrategyTab";
import AnalysisTimeline from "@/components/results/AnalysisTimeline";
import AnalysisDisclaimer from "@/components/results/AnalysisDisclaimer";
import AnalysisFooter from "@/components/results/AnalysisFooter";

interface AnalysisData {
  contract: {
    id: string;
    fileName: string;
    fileSize: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    errorMessage?: string;
    fileUrl?: string;
    mimeType: string;
  };
  analysis: ContractAnalysis | null;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDetailedView, setShowDetailedView] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Fetch des données
  const fetchAnalysis = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const response = await fetch(`/api/analysis/${params.id}`);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData({
            contract: result.contract,
            analysis: result.analysis,
          });
        } else {
          throw new Error(result.error || "Erreur inconnue");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        if (!silent) {
          setError(err instanceof Error ? err.message : "Erreur de chargement");
          toast.error("Erreur lors du chargement de l'analyse");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [params.id],
  );

  useEffect(() => {
    if (!data) {
      fetchAnalysis();
    }

    // Polling silencieux si en cours de traitement
    if (
      data?.contract.status === "PROCESSING" ||
      data?.contract.status === "PENDING"
    ) {
      const interval = setInterval(() => fetchAnalysis(true), 3000);
      return () => clearInterval(interval);
    }
  }, [fetchAnalysis, data?.contract.status, data === null]);

  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "PROCESSING":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "FAILED":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "PENDING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      toast.info("Génération de l'export...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Export terminé");
    } catch (err) {
      toast.error("Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papier");
  };

  // 1. Écrans de chargement
  if (loading) {
    return <AnalysisLoading />;
  }

  // 2. Écrans d'erreur / Status non terminés
  if (error || !data) {
    return <AnalysisError error={error} onRetry={() => fetchAnalysis()} />;
  }

  const { contract, analysis } = data;

  if (contract.status === "PROCESSING") {
    return <AnalysisLoading status="PROCESSING" />;
  }

  if (contract.status === "FAILED") {
    return (
      <AnalysisError status="FAILED" errorMessage={contract.errorMessage} />
    );
  }

  if (contract.status === "PENDING") {
    return <AnalysisError status="PENDING" />;
  }

  if (!analysis) {
    return <AnalysisError error="Aucune analyse disponible pour ce contrat." />;
  }

  // 3. Vue principale (COMPLETED)
  return (
    <div className="bg-[#050505] text-white relative">
      <AnalysisHeader
        contract={contract}
        showDetailedView={showDetailedView}
        onToggleDetailedView={() => setShowDetailedView(!showDetailedView)}
        onExport={handleExport}
        exporting={exporting}
        onBack={() => router.back()}
        getStatusColor={getStatusColor}
      />

      <main className="container mx-auto px-6 py-12 relative z-10">
        <AnalysisHero summary={analysis.summary} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="bg-white/5 border border-white/5 p-1 rounded-full h-14 w-fit flex gap-1">
            {[
              { value: "overview", icon: BarChart3, label: "Vision Globale" },
              { value: "parties", icon: Users, label: "Parties" },
              { value: "risks", icon: AlertTriangle, label: "Risques" },
              { value: "clauses", icon: FileText, label: "Clauses" },
              { value: "strategy", icon: Target, label: "Stratégie" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/40 rounded-full px-6 transition-all hover:text-white/60 h-full text-[10px] font-black uppercase tracking-widest"
              >
                <tab.icon className="w-3.5 h-3.5 mr-2 opacity-50" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <AnalysisOverview
              analysis={analysis}
              showDetailedView={showDetailedView}
            />
          </TabsContent>

          <TabsContent value="parties">
            <AnalysisParties analysis={analysis} />
          </TabsContent>

          <TabsContent value="risks">
            <AnalysisRisksTab risks={analysis.risks} />
          </TabsContent>

          <TabsContent value="clauses">
            <AnalysisClausesTab
              criticalClauses={analysis.critical_clauses}
              showDetailedView={showDetailedView}
              onCopy={copyToClipboard}
              analysisId={analysis.id}
            />
          </TabsContent>
          <TabsContent value="strategy">
            <AnalysisStrategyTab analysis={analysis} />
          </TabsContent>
        </Tabs>
        <AnalysisTimeline riskTimeline={analysis.summary.risk_timeline} />
        <AnalysisDisclaimer />
      </main>
      <AnalysisFooter onNewAnalysis={() => router.push("/upload")} />
    </div>
  );
}
