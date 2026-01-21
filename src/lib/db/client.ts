// src/lib/db/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Types TypeScript (car SQLite ne supporte pas les enums natifs)
export type Plan = 'FREE' | 'PREMIUM'
export type Status = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

// Interfaces pour les données JSON stockées comme strings
export interface AnalysisSummary {
  score_risque?: number
  score_clarte?: number
  points_cles?: string[]
  conseils?: string[]
  duree_contrat?: string
  renouvellement?: string
}

export interface Risk {
  type: string
  description: string
  gravite: 'low' | 'medium' | 'high'
  clause: string
  recommandation: string
  impact: string
}

export interface Obligation {
  partie: string
  description: string
  delai: string
  penalites: string
  couts: string
}

export interface Power {
  type: string
  detenteur: string
  description: string
  limitations: string
  abus_potentiel: boolean
}

export interface AnalysisData {
  risks: Risk[]
  obligations: Obligation[]
  powers: Power[]
  summary: AnalysisSummary
}

// Helper pour gérer JSON dans SQLite
export const dbHelpers = {
  parseJson<T>(jsonString: string): T {
    try {
      return JSON.parse(jsonString) as T
    } catch {
      return {} as T
    }
  },
  
  stringifyJson(data: any): string {
    return JSON.stringify(data)
  }
}