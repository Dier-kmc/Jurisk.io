// components/upload/FileUpload.tsx
"use client";

import { useCallback } from "react";
import { Upload, X } from "lucide-react";

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
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
  className = "",
}: FileUploadProps) {
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Type de fichier non supporté";
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Fichier trop volumineux (max ${maxSizeMB}MB)`;
    }

    return null;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
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
    },
    [maxFiles, onUploadComplete],
  );

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
        className="group relative h-72 rounded-[2.5rem] bg-white/[0.02] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.04] hover:border-white/10 flex flex-col items-center justify-center cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.03)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-yellow-500/30 transition-all duration-500">
            <Upload className="w-8 h-8 text-white/20 group-hover:text-yellow-500 transition-colors duration-500" />
          </div>

          <h3 className="serif-display text-3xl text-white mb-3">
            Déposez l'acte
          </h3>
          <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 mb-8">
            ou parcourez votre bibliothèque
          </p>

          <div className="flex items-center gap-6">
            {["PDF", "DOCX", "TXT"].map((ext) => (
              <div key={ext} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] font-black tracking-widest text-white/20">
                  {ext}
                </span>
              </div>
            ))}
            <div className="h-4 w-px bg-white/5" />
            <span className="text-[10px] font-black tracking-widest text-white/20 uppercase">
              Max {maxSizeMB}MB
            </span>
          </div>
        </div>

        <input
          id="file-input"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={allowedTypes.join(",")}
          multiple={maxFiles > 1}
        />
      </div>
    </div>
  );
}
