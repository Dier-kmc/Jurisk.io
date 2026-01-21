/* ===== src/components/upload/UploadProgress.tsx ===== */
'use client';

import { Upload, CheckCircle, XCircle } from 'lucide-react';
import ProgressBar from '@/components/ui/custom/ProgressBar';

interface UploadProgressProps {
  current: number;
  total: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  fileName?: string;
  error?: string;
  className?: string;
}

const UploadProgress = ({
  current,
  total,
  status,
  fileName,
  error,
  className,
}: UploadProgressProps) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  const statusConfig = {
    idle: {
      icon: <Upload className="w-6 h-6" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-800',
      label: 'Prêt à uploader',
    },
    uploading: {
      icon: (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500" />
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-600/10',
      label: 'Upload en cours...',
    },
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      label: 'Upload terminé',
    },
    error: {
      icon: <XCircle className="w-6 h-6" />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      label: 'Erreur d\'upload',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={className}>
      <div className={`rounded-lg border p-6 ${config.bgColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={config.color}>{config.icon}</div>
            <div>
              <h4 className="font-semibold text-white">{config.label}</h4>
              {fileName && (
                <p className="text-sm text-gray-400 truncate max-w-xs">
                  {fileName}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold text-white">
              {current.toFixed(1)}/{total.toFixed(1)} MB
            </div>
            <div className="text-sm text-gray-400">{percentage.toFixed(1)}%</div>
          </div>
        </div>

        <ProgressBar
          value={current}
          max={total}
          color={status === 'error' ? 'red' : 'yellow'}
          size="lg"
        />

        {status === 'uploading' && (
          <div className="mt-4 text-sm text-gray-400">
            Transfert en cours... Veuillez patienter.
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 text-sm text-green-400">
            Fichier uploadé avec succès. Lancement de l'analyse...
          </div>
        )}

        {status === 'error' && error && (
          <div className="mt-4 text-sm text-red-400">
            Erreur : {error}
          </div>
        )}
      </div>

      {status === 'uploading' && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Ne fermez pas cette page pendant l'upload
        </div>
      )}
    </div>
  );
};

export default UploadProgress;