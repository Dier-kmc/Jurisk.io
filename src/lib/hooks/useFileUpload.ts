'use client';

import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { validateFile, getFileInfo, FileValidationResult, FileInfo } from '@/lib/utils/fileHelpers';

export interface UploadedFile {
  id: string;
  file: File;
  info: FileInfo;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  uploadedAt: Date;
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  onUploadStart?: (files: UploadedFile[]) => void;
  onUploadComplete?: (files: UploadedFile[]) => void;
  onError?: (error: string, file: File) => void;
}

export const useFileUpload = (options: UseFileUploadOptions = {}) => {
  const {
    maxFiles = 1,
    maxSizeMB = 20,
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    onUploadStart,
    onUploadComplete,
    onError,
  } = options;

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Valide et ajoute des fichiers
   */
  const addFiles = useCallback((newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = [];
    
    // Vérifier la limite de fichiers
    if (files.length + newFiles.length > maxFiles) {
      const error = `Maximum ${maxFiles} fichier${maxFiles > 1 ? 's' : ''} autorisé${maxFiles > 1 ? 's' : ''}`;
      onError?.(error, newFiles[0]);
      return;
    }
    
    newFiles.forEach((file) => {
      const validation = validateFile(file, { maxSizeMB, allowedTypes });
      
      if (!validation.isValid) {
        onError?.(validation.error || 'Erreur de validation', file);
        return;
      }
      
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileInfo = getFileInfo(file);
      
      uploadedFiles.push({
        id: fileId,
        file,
        info: fileInfo,
        status: 'pending',
        progress: 0,
        uploadedAt: new Date(),
      });
    });
    
    if (uploadedFiles.length > 0) {
      setFiles(prev => [...prev, ...uploadedFiles]);
    }
    
    return uploadedFiles;
  }, [files.length, maxFiles, maxSizeMB, allowedTypes, onError]);

  /**
   * Gestion du drag & drop
   */
  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  /**
   * Gestion du input file
   */
  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
    
    // Reset l'input pour pouvoir sélectionner le même fichier
    e.target.value = '';
  }, [addFiles]);

  /**
   * Simule l'upload d'un fichier
   */
  const uploadFile = useCallback(async (fileId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'uploading', progress: 0 }
        : f
    ));
    
    // Simulation de progression
    const simulateProgress = () => {
      return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          setFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              const newProgress = Math.min(f.progress + 10, 100);
              
              if (newProgress === 100) {
                clearInterval(interval);
                return {
                  ...f,
                  progress: 100,
                  status: 'success',
                };
              }
              
              return { ...f, progress: newProgress };
            }
            return f;
          }));
        }, 200);
        
        setTimeout(() => {
          clearInterval(interval);
          resolve();
        }, 2200);
      });
    };
    
    await simulateProgress();
  }, []);

  /**
   * Upload de tous les fichiers
   */
  const uploadAll = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      return { success: false, message: 'Aucun fichier à uploader' };
    }
    
    setIsUploading(true);
    onUploadStart?.(pendingFiles);
    
    try {
      // Upload séquentiel pour garder l'ordre
      for (const file of pendingFiles) {
        await uploadFile(file.id);
      }
      
      const uploadedFiles = files.filter(f => f.status === 'success');
      onUploadComplete?.(uploadedFiles);
      
      return { success: true, message: `${uploadedFiles.length} fichier(s) uploadé(s)` };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: 'Erreur lors de l\'upload' };
    } finally {
      setIsUploading(false);
    }
  }, [files, uploadFile, onUploadStart, onUploadComplete]);

  /**
   * Supprime un fichier
   */
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  /**
   * Supprime tous les fichiers
   */
  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  /**
   * Récupère un fichier par son ID
   */
  const getFileById = useCallback((fileId: string) => {
    return files.find(f => f.id === fileId);
  }, [files]);

  return {
    // État
    files,
    isDragging,
    isUploading,
    
    // Méthodes de gestion
    addFiles,
    uploadFile,
    uploadAll,
    removeFile,
    clearFiles,
    getFileById,
    
    // Handlers d'événements
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileInput,
    
    // Utilitaires
    hasFiles: files.length > 0,
    pendingCount: files.filter(f => f.status === 'pending').length,
    uploadingCount: files.filter(f => f.status === 'uploading').length,
    completedCount: files.filter(f => f.status === 'success').length,
    errorCount: files.filter(f => f.status === 'error').length,
  };
};

export type UseFileUploadReturn = ReturnType<typeof useFileUpload>;