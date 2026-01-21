/* ===== src/components/history/HistoryTable.tsx ===== */
"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import { clsx } from "clsx";
import { getRiskLevelByScore, RISK_LEVELS } from "@/lib/constants/riskLevels";
import Button from "@/components/ui/custom/CustomButton";
import Badge from "@/components/ui/custom/Badge";
import { formatDate, formatFileSize } from "@/lib/utils/formatData";
import { useRouter } from "next/navigation";

interface HistoryItem {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  analysisDate: Date;
  riskScore: number;
  status: "completed" | "processing" | "failed";
  pageCount?: number;
}

interface HistoryTableProps {
  items: HistoryItem[];
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const HistoryTable = ({
  items,
  onView,
  onDownload,
  onDelete,
  className,
}: HistoryTableProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof HistoryItem>("analysisDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Filtrage et tri
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch = item.fileName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField]!;
      let bValue = b[sortField]!;

      if (sortField === "uploadDate" || sortField === "analysisDate") {
        aValue = new Date(aValue as Date).getTime();
        bValue = new Date(bValue as Date).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, search, sortField, sortDirection, filterStatus]);

  const handleSort = (field: keyof HistoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: HistoryItem["status"]) => {
    const config = {
      completed: { label: "Terminé", variant: "success" as const },
      processing: { label: "En cours", variant: "warning" as const },
      failed: { label: "Échec", variant: "danger" as const },
    };
    return (
      <Badge variant={config[status].variant}>{config[status].label}</Badge>
    );
  };

  const getRiskScoreDisplay = (score: number) => {
    const level = getRiskLevelByScore(score);
    return (
      <div className="flex items-center">
        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden mr-3">
          <div
            className={clsx("h-full transition-all duration-300")}
            style={{
              width: `${(score / 10) * 100}%`,
              backgroundColor: level.color,
            }}
          />
        </div>
        <span
          className={clsx(
            "font-semibold",
            level.id === "critical" && "text-red-300",
            level.id === "high" && "text-red-400",
            level.id === "medium" && "text-orange-400",
            level.id === "low" && "text-green-400"
          )}
        >
          {score.toFixed(1)}/10
        </span>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Aucune analyse dans l'historique</p>
        <Button
          variant="primary"
          className="mt-4"
          onClick={() => router.push("/upload")}
        >
          Analyser un premier contrat
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Filtres et recherche */}
      <div className="bg-gray-900/50 p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold mb-3">Filtrer les analyses</h3>
            <div className="flex flex-wrap gap-3">
              <button
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  filterStatus === "all"
                    ? "bg-yellow-600 text-gray-900 font-medium"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                )}
                onClick={() => setFilterStatus("all")}
              >
                Tous ({items.length})
              </button>
              <button
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  filterStatus === "completed"
                    ? "bg-green-500 text-white font-medium"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                )}
                onClick={() => setFilterStatus("completed")}
              >
                Terminés ({items.filter((i) => i.status === "completed").length}
                )
              </button>
              <button
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  filterStatus === "processing"
                    ? "bg-yellow-600 text-gray-900 font-medium"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                )}
                onClick={() => setFilterStatus("processing")}
              >
                En cours (
                {items.filter((i) => i.status === "processing").length})
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un contrat..."
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full focus:border-yellow-500 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-900">
            <tr>
              <th className="text-left p-6 font-semibold">
                <button
                  className="flex items-center hover:text-yellow-600"
                  onClick={() => handleSort("fileName")}
                >
                  Contrat
                  {sortField === "fileName" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-6 font-semibold">
                <button
                  className="flex items-center hover:text-yellow-600"
                  onClick={() => handleSort("analysisDate")}
                >
                  Date
                  {sortField === "analysisDate" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-6 font-semibold">
                <button
                  className="flex items-center hover:text-yellow-600"
                  onClick={() => handleSort("riskScore")}
                >
                  Score risque
                  {sortField === "riskScore" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  )}
                </button>
              </th>
              <th className="text-left p-6 font-semibold">Statut</th>
              <th className="text-left p-6 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedItems.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors"
              >
                <td className="p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.fileName}</p>
                      <p className="text-gray-400 text-sm">
                        {item.fileType} • {formatFileSize(item.fileSize)}
                        {item.pageCount &&
                          ` • ${item.pageCount} page${
                            item.pageCount > 1 ? "s" : ""
                          }`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <div>
                    <p className="text-white">
                      {formatDate(item.analysisDate)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(item.analysisDate, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </td>
                <td className="p-6">
                  {item.status === "completed" ? (
                    getRiskScoreDisplay(item.riskScore)
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="p-6">{getStatusBadge(item.status)}</td>
                <td className="p-6">
                  <div className="flex space-x-2">
                    {item.status === "completed" && onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye size={16} />}
                        onClick={() => onView(item.id)}
                      >
                        Voir
                      </Button>
                    )}

                    {item.status === "completed" && onDownload && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download size={16} />}
                        onClick={() => onDownload(item.id)}
                      >
                        Télécharger
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Résumé */}
      <div className="mt-4 text-sm text-gray-500">
        {filteredAndSortedItems.length} analyse
        {filteredAndSortedItems.length > 1 ? "s" : ""} sur {items.length} total
      </div>
    </div>
  );
};

export default HistoryTable;
