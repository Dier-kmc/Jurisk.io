"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/utils/formatData";

interface AnalysisFooterProps {
  onNewAnalysis: () => void;
}

export default function AnalysisFooter({ onNewAnalysis }: AnalysisFooterProps) {
  return (
    <footer className="border-t border-border mt-24 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-faint">
              Sceau de Lucidité Digital
            </span>
            <div className="text-xs text-faint font-medium">
              Analyse Certifiée • {formatDate(new Date())} • Intelligence
              Jurisk.io
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={onNewAnalysis}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors"
            >
              Nouvelle Analyse
            </button>

            <div className="w-[1px] h-4 bg-white/5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
