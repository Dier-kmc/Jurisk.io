'use client';

import { useState, useEffect, useCallback } from 'react';

type StorageValue<T> = T | null;

interface UseLocalStorageOptions<T> {
  serialize?: (value: T) => string;
  deserialize?: (value: string) => T;
  defaultValue?: T;
}

/**
 * Custom hook for using localStorage securely
 */
export function useLocalStorage<T>(
  key: string,
  initialValue?: T,
  options?: UseLocalStorageOptions<T>
) {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    defaultValue,
  } = options || {};

  // State for storing the value
  const [storedValue, setStoredValue] = useState<StorageValue<T>>(() => {
    if (typeof window === 'undefined') {
      return defaultValue !== undefined ? defaultValue : (initialValue || null);
    }

    try {
      const item = window.localStorage.getItem(key);
      
      if (item === null) {
        // If no value is stored and there is a defaultValue, initialize it.
        if (defaultValue !== undefined) {
          window.localStorage.setItem(key, serialize(defaultValue));
          return defaultValue;
        }
        return initialValue !== undefined ? initialValue : null;
      }
      
      return deserialize(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue !== undefined ? defaultValue : (initialValue || null);
    }
  });

  // Function to update the value in localStorage and the state
  const setValue = useCallback((value: T | ((val: StorageValue<T>) => T)) => {
    if (typeof window === 'undefined') {
      console.warn('localStorage is not available');
      return;
    }

    try {
      // Allows you to pass a function for updating
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // update state
      setStoredValue(valueToStore);
      
      // Save in localStorage
      if (valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serialize(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, serialize, storedValue]);

  // Function to delete the key from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(null);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);

  // Function to clear all localStorage (optional)
  const clearStorage = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.clear();
      setStoredValue(null);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  // Synchronize changes between tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.storageArea === window.localStorage) {
        try {
          if (event.newValue === null) {
            setStoredValue(null);
          } else {
            setStoredValue(deserialize(event.newValue));
          }
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [key, deserialize]);

  // Outline all necessary methods
  return {
    value: storedValue,
    setValue,
    removeValue,
    clearStorage,
    isAvailable: typeof window !== 'undefined' && 'localStorage' in window,
  };
}

/**
 * Specific hook for user settings
 */
export function useUserSettings() {
  const settings = useLocalStorage('contractscope_settings', {
    theme: 'dark' as 'light' | 'dark' | 'system',
    language: 'fr' as 'fr' | 'en',
    notifications: true,
    autoSave: true,
    defaultView: 'grid' as 'grid' | 'list',
  });

  return settings;
}

/**
 * Specific hook for analysis preferences
 */
export function useAnalysisPreferences() {
  const preferences = useLocalStorage('contractscope_analysis_prefs', {
    detailedAnalysis: true,
    includeOCR: false,
    languageDetection: true,
    riskThreshold: 7,
    autoExport: false,
    exportFormat: 'pdf' as 'pdf' | 'word' | 'excel',
  });

  return preferences;
}

/**
 * Specific hook for recent history
 */
export function useRecentFiles() {
  const recentFiles = useLocalStorage<Array<{
    id: string;
    name: string;
    uploadedAt: string;
    analysisId?: string;
  }>>('contractscope_recent_files', []);

  const addRecentFile = useCallback((file: {
    id: string;
    name: string;
    uploadedAt: Date;
    analysisId?: string;
  }) => {
    const currentFiles = recentFiles.value || [];
    
    // Limit to a maximum of 10 files
    const updatedFiles = [
      {
        id: file.id,
        name: file.name,
        uploadedAt: file.uploadedAt.toISOString(),
        analysisId: file.analysisId,
      },
      ...currentFiles.filter(f => f.id !== file.id),
    ].slice(0, 10);
    
    recentFiles.setValue(updatedFiles);
  }, [recentFiles]);

  const clearRecentFiles = useCallback(() => {
    recentFiles.setValue([]);
  }, [recentFiles]);

  return {
    ...recentFiles,
    addRecentFile,
    clearRecentFiles,
  };
}

/**
 * Hook for the analysis counter (for the free version)
 */
export function useAnalysisCounter() {
  const counter = useLocalStorage<{
    count: number;
    resetDate: string;
    limit: number;
  }>('contractscope_analysis_counter', {
    count: 0,
    resetDate: new Date().toDateString(),
    limit: 3,
  });

  const increment = useCallback(() => {
    const today = new Date().toDateString();
    const current = counter.value;
    
    if (!current || current.resetDate !== today) {
      // Reset the counter for today 
      counter.setValue({
        count: 1,
        resetDate: today,
        limit: 3,
      });
      return 1;
    }
    
    const newCount = current.count + 1;
    counter.setValue({
      ...current,
      count: newCount,
    });
    
    return newCount;
  }, [counter]);

  const resetCounter = useCallback(() => {
    counter.setValue({
      count: 0,
      resetDate: new Date().toDateString(),
      limit: 3,
    });
  }, [counter]);

  const canAnalyze = useCallback(() => {
    const current = counter.value;
    if (!current) return true;
    
    const today = new Date().toDateString();
    if (current.resetDate !== today) return true;
    
    return current.count < current.limit;
  }, [counter.value]);

  const remainingAnalyses = useCallback(() => {
    const current = counter.value;
    if (!current) return 3;
    
    const today = new Date().toDateString();
    if (current.resetDate !== today) return 3;
    
    return Math.max(0, current.limit - current.count);
  }, [counter.value]);

  return {
    ...counter,
    increment,
    resetCounter,
    canAnalyze,
    remainingAnalyses,
  };
}