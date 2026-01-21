// src/hooks/useDashboardAnalyses.ts
'use client';

import { useState, useEffect } from 'react';

export interface DashboardAnalysis {
  id: string;
  contractId: string;
  fileName: string;
  status: string;
  summary: {
    score_risque?: number;
    score_clarte?: number;
    duree_contrat?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function useDashboardAnalyses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<DashboardAnalysis[]>([]);
  const [total, setTotal] = useState(0);

  const fetchAnalyses = async (recentOnly: boolean = false) => {
    try {
      setLoading(true);
      
      const endpoint = recentOnly ? '/api/analyses/recent' : '/api/analyses';
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyses(data.analyses);
        if (!recentOnly) {
          setTotal(data.total);
        }
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecent = async () => {
    await fetchAnalyses(true);
  };

  const fetchAll = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/analyses?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAnalyses(data.analyses);
        setTotal(data.total);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAnalyses();
  };

  useEffect(() => {
    // Charger les analyses récentes par défaut
    fetchRecent();
  }, []);

  return {
    loading,
    error,
    analyses,
    total,
    fetchRecent,
    fetchAll,
    refetch
  };
}