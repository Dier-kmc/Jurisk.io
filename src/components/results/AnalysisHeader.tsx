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
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={onBack}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4 rotate-180 text-white/40" />
            </button>

            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 md:gap-3 mb-1">
                  <h1 className="text-sm md:text-base font-bold text-white tracking-tight truncate max-w-[150px] sm:max-w-xs md:max-w-md">
                    {contract.fileName}
                  </h1>
                  <Badge
                    className={`px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest flex-shrink-0 ${getStatusColor(contract.status)}`}
                  >
                    {contract.status === "COMPLETED"
                      ? "Lucidité acquise"
                      : "Phase finale"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-black tracking-widest uppercase text-white/20">
                  <span>{formatFileSize(contract.fileSize)}</span>
                  <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white/10" />
                  <span>MODÈLE L-v4</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto overflow-x-auto no-scrollbar pt-2 lg:pt-0 border-t border-white/5 lg:border-0">
            <div className="flex bg-white/5 p-1 rounded-full border border-white/5 flex-shrink-0">
              <button
                onClick={onToggleDetailedView}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all ${
                  showDetailedView
                    ? "bg-white/10 text-white"
                    : "text-white/20 hover:text-white/40"
                }`}
              >
                Expert
              </button>
              <button
                onClick={onToggleDetailedView}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all ${
                  !showDetailedView
                    ? "bg-white/10 text-white"
                    : "text-white/20 hover:text-white/40"
                }`}
              >
                Essentiel
              </button>
            </div>

            <div className="h-6 md:h-8 w-[1px] bg-white/5 mx-1 md:mx-2 hidden sm:block" />

            {/* <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={onExport}
                disabled={exporting}
                className="rounded-full border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all h-8 md:h-10 px-4 md:px-6 font-bold text-[10px] md:text-xs"
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
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-none hidden sm:flex"
              >
                <Printer className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
