'use client';

import { AlertTriangle, X } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom/CustomButton';
import Portal from '@/components/ui/Portal'; // Importez le Portal

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isDeleting?: boolean;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Supprimer cette analyse ?",
  description = "Cette action est irréversible. Toutes les données de cette analyse seront définitivement supprimées.",
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Portal> {/* Enveloppez avec Portal */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl w-full max-w-md border border-gray-800/50 shadow-2xl animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="relative overflow-hidden border-b border-gray-800/50 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  {title}
                </h2>
                <p className="text-sm text-gray-400">
                  {description}
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="p-1 hover:bg-gray-800/50 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {itemName && (
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-400 mb-1">Analyse à supprimer :</p>
                <p className="text-white font-medium truncate">{itemName}</p>
              </div>
            )}

            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-200">
                  <p className="font-medium mb-1">Attention</p>
                  <p className="text-red-300/80">
                    Cette action est définitive et ne peut pas être annulée. Toutes les données associées seront perdues.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <CustomButton
                onClick={onClose}
                disabled={isDeleting}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </CustomButton>
              <CustomButton
                onClick={handleConfirm}
                disabled={isDeleting}
                isLoading={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}