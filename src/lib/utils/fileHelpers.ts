export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
  lastModified: number;
}

/**
 * Valide un fichier selon les critères de l'application
 */
export const validateFile = (
  file: File, 
  options?: {
    maxSizeMB?: number;
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }
): FileValidationResult => {
  const {
    maxSizeMB = 20,
    allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    allowedExtensions = ['.pdf', '.doc', '.docx', '.txt']
  } = options || {};
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  // Vérification de la taille
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Le fichier est trop volumineux. Taille maximum : ${maxSizeMB}MB`
    };
  }
  
  // Vérification du type MIME
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Type de fichier non supporté'
    };
  }
  
  // Vérification de l'extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: `Extension non supportée. Formats autorisés : ${allowedExtensions.join(', ')}`
    };
  }
  
  return { isValid: true };
};

/**
 * Extrait les informations d'un fichier
 */
export const getFileInfo = (file: File): FileInfo => {
  const name = file.name;
  const extension = '.' + name.split('.').pop()?.toLowerCase() || '';
  
  return {
    name,
    size: file.size,
    type: file.type,
    extension,
    lastModified: file.lastModified,
  };
};

/**
 * Simule la lecture d'un fichier comme texte
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Erreur de lecture du fichier: ${error}`));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Simule la lecture d'un fichier comme DataURL (pour prévisualisation)
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    
    reader.onerror = (error) => {
      reject(new Error(`Erreur de lecture du fichier: ${error}`));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Génère un identifiant unique pour un fichier
 */
export const generateFileId = (file: File): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const nameHash = btoa(file.name).substring(0, 8);
  
  return `${timestamp}-${random}-${nameHash}`;
};

/**
 * Formatte le nom du fichier pour l'affichage
 */
export const formatFileName = (fileName: string, maxLength = 30): string => {
  if (fileName.length <= maxLength) return fileName;
  
  const extension = fileName.split('.').pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const charsToKeep = maxLength - 3 - (extension?.length || 0);
  
  if (charsToKeep <= 3) {
    return `...${fileName.slice(-maxLength)}`;
  }
  
  return `${nameWithoutExt.substring(0, charsToKeep)}...${extension ? `.${extension}` : ''}`;
};