// components/upload/FileUpload.tsx
'use client';

import { useCallback } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onUploadComplete: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  allowedTypes?: string[];
  className?: string;
}

export default function FileUpload({
  onUploadComplete,
  maxFiles = 1,
  maxSizeMB = 10,
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  className = '',
}: FileUploadProps) {
  
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return 'Type de fichier non supporté';
    }
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Fichier trop volumineux (max ${maxSizeMB}MB)`;
    }
    
    return null;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    
    for (const file of files.slice(0, maxFiles)) {
      const error = validateFile(file);
      if (!error) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length > 0) {
      onUploadComplete(validFiles);
    }
  }, [maxFiles, onUploadComplete]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles: File[] = [];
    
    for (const file of files.slice(0, maxFiles)) {
      const error = validateFile(file);
      if (!error) {
        validFiles.push(file);
      }
    }
    
    if (validFiles.length > 0) {
      onUploadComplete(validFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className={className}>
      <div
        className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center hover:border-yellow-600 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-yellow-600" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Déposez votre fichier ici</h3>
        <p className="text-gray-400 mb-4">
          ou cliquez pour sélectionner
        </p>
        
        <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
          <span>PDF</span>
          <span>•</span>
          <span>DOC</span>
          <span>•</span>
          <span>DOCX</span>
          <span>•</span>
          <span>TXT</span>
          <span>•</span>
          <span>Jusqu'à {maxSizeMB}MB</span>
        </div>
        
        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={allowedTypes.join(',')}
          multiple={maxFiles > 1}
        />
      </div>
    </div>
  );
}