import { ContractAnalysis } from '@/types/contract'

export interface AnalysisFilters {
  limit?: number
  page?: number
  status?: string
  search?: string
}

export interface AnalysisResponse {
  success: boolean
  data: {
    contracts: ContractAnalysis[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
    stats: {
      total: number
      completed: number
      processing: number
      failed: number
    }
  }
  error?: string
}

export class AnalysisApiService {
  static async getAnalyses(filters: AnalysisFilters = {}): Promise<AnalysisResponse> {
    try {
      console.log('AnalysisApiService: Récupération des analyses avec filtres:', filters)
      
      const params = new URLSearchParams()
      
      if (filters.limit) params.append('limit', filters.limit.toString())
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.status) params.append('status', filters.status)
      if (filters.search) params.append('search', filters.search)

      const url = `/api/analysis?${params.toString()}`
      console.log('URL de la requête:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-store'
      })

      console.log('Réponse reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erreur de réponse:', errorText)
        
        // Essayer de parser l'erreur JSON
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(`Erreur ${response.status}: ${errorData.error || response.statusText}`)
        } catch {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }
      }

      const data = await response.json()
      console.log('Données reçues:', {
        success: data.success,
        contractCount: data.data?.contracts?.length || 0
      })

      return data
    } catch (error) {
      console.error('AnalysisApiService: Erreur fetch:', error)
      
      // Retourner une réponse d'erreur structurée
      return {
        success: false,
        data: {
          contracts: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          },
          stats: {
            total: 0,
            completed: 0,
            processing: 0,
            failed: 0
          }
        },
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }

  static async getAnalysisById(id: string) {
    try {
      const response = await fetch(`/api/analysis/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error fetching analysis ${id}:`, error)
      throw error
    }
  }
}