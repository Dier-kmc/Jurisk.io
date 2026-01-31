"use client";

import {
  ChevronRight,
  FileText,
  Download,
  Printer,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/utils/formatData";

interface AnalysisHeaderProps {
  contract: {
    fileName: string;
    fileSize: number;
    status: string;
  };
  showDetailedView: boolean;
  onToggleDetailedView: () => void;
  onExport: () => void;
  exporting: boolean;
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

export default function AnalysisHeader({
  contract,
  showDetailedView,
  onToggleDetailedView,
  onExport,
  exporting,
  onBack,
  getStatusColor,
}: AnalysisHeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/40 border-b border-white/5">
      <div className="container mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180 text-white/40" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-base font-bold text-white tracking-tight truncate max-w-[200px] md:max-w-md">
                    {contract.fileName}
                  </h1>
                  <Badge
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusColor(contract.status)}`}
                  >
                    {contract.status === "COMPLETED"
                      ? "Lucidité acquise"
                      : "Phase finale"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black tracking-widest uppercase text-white/20">
                  <span>{formatFileSize(contract.fileSize)}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span>MODÈLE L-v4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
              <button
                onClick={onToggleDetailedView}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                  showDetailedView
                    ? "bg-white/10 text-white"
                    : "text-white/20 hover:text-white/40"
                }`}
              >
                Expert
              </button>
              <button
                onClick={onToggleDetailedView}
                className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                  !showDetailedView
                    ? "bg-white/10 text-white"
                    : "text-white/20 hover:text-white/40"
                }`}
              >
                Essentiel
              </button>
            </div>

            <div className="h-8 w-[1px] bg-white/5 mx-2" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={exporting}
                className="rounded-full border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all h-10 px-6 font-bold text-xs"
              >
                {exporting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-2" />
                    Export
                  </>
                )}
              </Button>

              <button
                onClick={() => window.print()}
                className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-none"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
