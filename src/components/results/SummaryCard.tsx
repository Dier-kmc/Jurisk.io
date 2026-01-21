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
    <div className={clsx('bg-gray-900/50 rounded-xl p-6', className)}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
        <div>
          <div className="flex items-center mb-2">
            <FileText className="w-5 h-5 text-yellow-600 mr-2" />
            <h1 className="text-2xl font-bold text-white truncate max-w-lg">
              {fileName}
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {fileSize && (
              <span className="flex items-center">
                <span className="text-yellow-600 mr-1">📦</span>
                {formatFileSize(fileSize)}
              </span>
            )}
            
            <span className="flex items-center">
              <Calendar className="w-3 h-3 text-yellow-600 mr-1" />
              Uploadé le {formatDate(uploadDate)}
            </span>
            
            <span className="flex items-center">
              <User className="w-3 h-3 text-yellow-600 mr-1" />
              Analysé le {formatDate(analysisDate)}
            </span>
            
            {pageCount && (
              <span className="flex items-center">
                <Hash className="w-3 h-3 text-yellow-600 mr-1" />
                {pageCount} page{pageCount > 1 ? 's' : ''}
              </span>
            )}
            
            {wordCount && (
              <span className="flex items-center">
                <span className="text-yellow-600 mr-1">📝</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-800">
          {fileSize && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatFileSize(fileSize)}
              </div>
              <div className="text-sm text-gray-400">Taille du fichier</div>
            </div>
          )}
          
          {pageCount && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {pageCount}
              </div>
              <div className="text-sm text-gray-400">Pages</div>
            </div>
          )}
          
          {wordCount && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {(wordCount / 1000).toFixed(1)}k
              </div>
              <div className="text-sm text-gray-400">Mots</div>
            </div>
          )}
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {formatDate(analysisDate, { month: 'short', day: 'numeric' })}
            </div>
            <div className="text-sm text-gray-400">Date d'analyse</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;