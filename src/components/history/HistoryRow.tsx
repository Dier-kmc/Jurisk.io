/* ===== src/components/history/HistoryRow.tsx ===== */
'use client';

import { FileText, Eye, Download, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { getRiskLevelByScore } from '@/lib/constants/riskLevels';
import Button from '@/components/ui/custom/CustomButton';
import Badge from '@/components/ui/custom/Badge';
import { formatDate, formatFileSize } from '@/lib/utils/formatData';

interface HistoryRowProps {
  item: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadDate: Date;
    analysisDate: Date;
    riskScore: number;
    status: 'completed' | 'processing' | 'failed';
    pageCount?: number;
  };
  onView?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
  className?: string;
}

const HistoryRow = ({
  item,
  onView,
  onDownload,
  onDelete,
  className,
}: HistoryRowProps) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusBadge = (status: typeof item.status) => {
    const config = {
      completed: { label: 'Terminé', variant: 'success' as const },
      processing: { label: 'En cours', variant: 'warning' as const },
      failed: { label: 'Échec', variant: 'danger' as const },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getRiskScoreDisplay = (score: number) => {
    const level = getRiskLevelByScore(score);
    return (
      <div className="flex items-center">
        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden mr-2">
          <div
            className="h-full transition-all duration-300"
            style={{ 
              width: `${(score / 10) * 100}%`,
              backgroundColor: level.color
            }}
          />
        </div>
        <span className={clsx(
          'text-sm font-semibold',
          level.id === 'critical' && 'text-red-300',
          level.id === 'high' && 'text-red-400',
          level.id === 'medium' && 'text-orange-400',
          level.id === 'low' && 'text-green-400'
        )}>
          {score.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className={clsx(
      'bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors',
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-gray-400" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium text-white truncate">
                {item.fileName}
              </p>
              {getStatusBadge(item.status)}
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span>{formatFileSize(item.fileSize)}</span>
              <span>•</span>
              <span>{item.fileType}</span>
              {item.pageCount && (
                <>
                  <span>•</span>
                  <span>{item.pageCount} page{item.pageCount > 1 ? 's' : ''}</span>
                </>
              )}
              <span>•</span>
              <span>Analysé le {formatDate(item.analysisDate)}</span>
            </div>
            
            {item.status === 'completed' && (
              <div className="mt-3">
                {getRiskScoreDisplay(item.riskScore)}
              </div>
            )}
          </div>
        </div>

        <div className="relative ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical size={20} />
          </Button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {item.status === 'completed' && onView && (
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      onView();
                      setShowActions(false);
                    }}
                  >
                    <Eye size={16} className="mr-2" />
                    Voir le rapport
                  </button>
                )}
                
                {item.status === 'completed' && onDownload && (
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      onDownload();
                      setShowActions(false);
                    }}
                  >
                    <Download size={16} className="mr-2" />
                    Télécharger
                  </button>
                )}
                
                {onDelete && (
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                      onDelete();
                      setShowActions(false);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryRow;