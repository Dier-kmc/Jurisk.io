/* ===== src/components/upload/FileList.tsx ===== */
'use client';

import { FileText, Download, Trash2, Eye } from 'lucide-react';
import { UploadedFile } from '@/lib/hooks/useFileUpload';
import Button from '@/components/ui/custom/CustomButton';
import Badge from '@/components/ui/custom/Badge';
import { formatDate, formatFileSize } from '@/lib/utils/formatData';

interface FileListProps {
  files: UploadedFile[];
  onRemove?: (fileId: string) => void;
  onDownload?: (fileId: string) => void;
  onView?: (fileId: string) => void;
  showActions?: boolean;
  className?: string;
}

const FileList = ({
  files,
  onRemove,
  onDownload,
  onView,
  showActions = true,
  className,
}: FileListProps) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">Aucun fichier sélectionné</p>
      </div>
    );
  }

  const getStatusBadge = (status: UploadedFile['status']) => {
    const variants = {
      pending: { label: 'En attente', variant: 'warning' as const },
      uploading: { label: 'Upload...', variant: 'info' as const },
      success: { label: 'Terminé', variant: 'success' as const },
      error: { label: 'Erreur', variant: 'danger' as const },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className={className}>
      <div className="space-y-3">
        {files.map((file) => (
          <div
            key={file.id}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-white truncate">
                      {file.info.name}
                    </p>
                    {getStatusBadge(file.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{formatFileSize(file.info.size)}</span>
                    <span>•</span>
                    <span>{file.info.type}</span>
                    <span>•</span>
                    <span>Uploadé le {formatDate(file.uploadedAt)}</span>
                  </div>
                  
                  {file.error && (
                    <p className="text-sm text-red-400 mt-1">{file.error}</p>
                  )}
                </div>
              </div>

              {showActions && (
                <div className="flex items-center space-x-2 ml-4">
                  {onView && file.status === 'success' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye size={16} />}
                      onClick={() => onView(file.id)}
                    >
                      Voir
                    </Button>
                  )}
                  
                  {onDownload && file.status === 'success' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Download size={16} />}
                      onClick={() => onDownload(file.id)}
                    >
                      Télécharger
                    </Button>
                  )}
                  
                  {onRemove && (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={16} />}
                      onClick={() => onRemove(file.id)}
                      disabled={file.status === 'uploading'}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
              )}
            </div>

            {file.status === 'uploading' && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Progression</span>
                  <span>{file.progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default FileList;