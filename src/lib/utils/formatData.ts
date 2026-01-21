/**
 * Formate une date selon les préférences françaises
 */
export const formatDate = (
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  
  return dateObj.toLocaleDateString('fr-FR', defaultOptions);
};

/**
 * Formate une date avec l'heure
 */
export const formatDateTime = (
  date: Date | string | number,
  showSeconds = false
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(showSeconds && { second: '2-digit' }),
  };
  
  const dateStr = formatDate(dateObj, { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('fr-FR', timeOptions);
  
  return `${dateStr} à ${timeStr}`;
};

/**
 * Formate une date relative (ex: "il y a 2 jours")
 */
export const formatRelativeDate = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `à l'instant`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
  }
  
  return formatDate(dateObj, { day: 'numeric', month: 'short' });
};

/**
 * Formate une durée en secondes en format lisible
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} seconde${seconds !== 1 ? 's' : ''}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} heure${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h${remainingMinutes.toString().padStart(2, '0')}`;
};

/**
 * Formate un nombre comme taille de fichier
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};