export interface ContractAnalysis {
  id: string
  fileName: string
  fileSize: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  summary: string
  riskScore: number | null
  createdAt: string
  updatedAt: string
  totalPages: number
  fileType: string
  analysisTime: string | null
  hasAnalysis: boolean
}

export interface AnalysisStats {
  total: number
  completed: number
  processing: number
  failed: number
}

export interface PaginationInfo {
  total: number
  page: number
  limit: number
  totalPages: number
}