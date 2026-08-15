/* ===== src/components/results/SummaryCard.tsx ===== */
'use client';

import { FileText, Calendar, User, Hash, Download } from 'lucide-react';
import Button from '@/components/ui/custom/CustomButton';
import { clsx } from 'clsx';
import { formatDate, formatFileSize } from '@/lib/utils/formatData';

interface SummaryCardProps {
  fileName: string;
  fileSize?: number;
  uploadDate: Date;
  analysisDate: Date;
  pageCount?: number;
  wordCount?: number;
  onDownload?: () => void;
  onNewAnalysis?: () => void;
  className?: string;
}

const SummaryCard = ({
  fileName,
  fileSize,
  uploadDate,
  analysisDate,
  pageCount,
  wordCount,
  onDownload,
  onNewAnalysis,
  className,
}: SummaryCardProps) => {
  return (
    <div className={clsx('bg-surface-1 rounded-xl p-6 border border-border', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 text-accent mr-2" />
            <h1 className="text-2xl font-bold text-foreground truncate max-w-lg">
              {fileName}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-muted">
            {fileSize && (
              <span className="flex items-center">
                <span className="text-accent mr-1">📦</span>
                {formatFileSize(fileSize)}
              </span>
            )}
            
            <span className="flex items-center">
              <Calendar className="w-3 h-3 text-accent mr-1" />
              Uploadé le {formatDate(uploadDate)}
            </span>
            
            <span className="flex items-center">
              <User className="w-3 h-3 text-accent mr-1" />
              Analysé le {formatDate(analysisDate)}
            </span>
            
            {pageCount && (
              <span className="flex items-center">
                <Hash className="w-3 h-3 text-accent mr-1" />
                {pageCount} page{pageCount > 1 ? 's' : ''}
              </span>
            )}
            
            {wordCount && (
              <span className="flex items-center">
                <span className="text-accent mr-1">📝</span>
                {wordCount.toLocaleString()} mots
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          {onDownload && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={onDownload}
            >
              Télécharger
            </Button>
          )}
          
          {onNewAnalysis && (
            <Button
              variant="primary"
              size="sm"
              onClick={onNewAnalysis}
            >
              Nouvelle analyse
            </Button>
          )}
        </div>
      </div>

      {/* Métriques rapides */}
      {(pageCount || wordCount) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
          {fileSize && (
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {formatFileSize(fileSize)}
              </div>
              <div className="text-sm text-muted">Taille du fichier</div>
            </div>
          )}
          
          {pageCount && (
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {pageCount}
              </div>
              <div className="text-sm text-muted">Pages</div>
            </div>
          )}
          
          {wordCount && (
            <div className="text-center">
              <div className="text-2xl font-bold text-risk-low">
                {(wordCount / 1000).toFixed(1)}k
              </div>
              <div className="text-sm text-muted">Mots</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {formatDate(analysisDate, { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-sm text-muted">Date d'analyse</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;