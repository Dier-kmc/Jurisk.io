// types/contract.ts - Version 100% anglaise
export interface Risk {
  id?: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  clause: string;
  recommendation: string;
  impact: string;
  probability?: number;
  impact_magnitude?: number;
  priority?: "low" | "medium" | "high";
  deadline?: string;
  calculatedScore?: number; // Score calculé par la formule RiskCalculator
  financialImpactEstimate?: string; // Estimation de l'impact financier
  legalJustification?: string; // Justification légale détaillée
}

export interface Clause {
  clause_number: string;
  title: string;
  problem: string;
  legal_impact: string;
  proposed_solution: string;
  priority: "low" | "medium" | "high";
}

export interface Party {
  name: string;
  role: string;
  legal_status: string;
}

export interface PartyAnalysis {
  party_a: {
    party_name: string;
    risk_score: number;
    opportunity_score: number;
    negotiation_power: "weak" | "medium" | "strong";
    major_risks: string[];
    advantages: string[];
    specific_recommendations: string[];
  };
  party_b: {
    party_name: string;
    risk_score: number;
    opportunity_score: number;
    negotiation_power: "weak" | "medium" | "strong";
    major_risks: string[];
    advantages: string[];
    specific_recommendations: string[];
  };
}

export interface Summary {
  global_risk_score: number;
  balance_score: number;
  clarity_score: number;
  key_points: string[];
  strategic_advice: string[];
  risk_timeline: {
    immediate: string[];
    short_term: string[];
    long_term: string[];
  };
  riskCalculationMethod?: string; // Méthode de calcul utilisée
  confidenceScore?: number; // Score de confiance de l'analyse (0-100)
}

export interface Scenario {
  scenario: string;
  probability: number;
  consequences_party_a: string[];
  consequences_party_b: string[];
  global_impact: number;
  recommendations: string[];
}

export interface Power {
  id?: string;
  type:
    | "termination"
    | "modification"
    | "control"
    | "sanction"
    | "audit"
    | "general";
  description: string;
  holder: "provider" | "client" | "both";
  limitations: string;
  potential_abuse: boolean;
  associated_clause?: string;
}

export interface Obligation {
  id?: string;
  type?: string;
  description: string;
  party: "provider" | "client" | "both";
  deadline: string;
  penalties: string;
  costs: string;
  associated_clause?: string;
}

export interface ContractAnalysis {
  id: string;
  contractId: string;
  userId: string;

  fileName?: string;
  fileSize?: number;
  status?: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

  // Données parsées depuis les champs JSON stringifiés
  summary: Summary;

  identified_parties: {
    party_a: Party;
    party_b: Party;
  };

  risks: Array<Risk>;

  obligations: Array<{
    id?: string;
    type?: string;
    description: string;
    party: "provider" | "client" | "both";
    deadline: string;
    penalties: string;
    costs: string;
    associated_clause?: string;
  }>;

  powers: Array<Power>;

  critical_clauses: Array<Clause>;

  party_analysis: PartyAnalysis;

  probable_scenarios: Array<Scenario>;

  // Langue détectée du contrat
  detectedLanguage?: string; // Code ISO 639-1 (fr, en, es, etc.)

  // Métadonnées techniques
  modelUsed: string;
  processingTime: number;
  tokenCount: number;
  cost?: number;
  errorMessage?: string;

  createdAt: string;
  contract?: {
    id: string;
    fileName: string;
    fileSize: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    fileUrl?: string;
    mimeType: string;
    extractedText?: string;
  };
}

// Interface pour les données brutes de l'API (avant parsing)
export interface RawAnalysisData {
  id: string;
  contractId: string;
  userId: string;

  // Champs JSON stringifiés (TOUS en anglais)
  summary: string;
  identified_parties: string; // Anglais
  risks: string; // Anglais
  obligations: string; // Anglais
  powers: string; // Anglais
  critical_clauses: string; // Anglais
  party_analysis: string; // Anglais
  probable_scenarios: string; // Anglais

  // Métadonnées
  modelUsed: string;
  processingTime: number;
  tokenCount: number;
  cost?: number;
  errorMessage?: string;
  createdAt: string;
}

// Interface pour la réponse API complète
export interface AnalysisResponse {
  success: boolean;
  contract: {
    id: string;
    fileName: string;
    fileSize: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
    createdAt: string;
    updatedAt: string;
    fileUrl?: string;
    mimeType: string;
    extractedText?: string;
    errorMessage?: string;
  };
  analysis: ContractAnalysis | null;
}

// Interface pour la liste des contrats (dashboard/historique)
export interface ContractListItem {
  id: string;
  fileName: string;
  fileSize: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  updatedAt: string;
  fileType: string;
  hasAnalysis: boolean;
  analysis?: {
    id: string;
    createdAt: string;
    summary?: {
      global_risk_score: number;
      clarity_score: number;
    };
  };
}

export interface AnalysisStats {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  pending?: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Fonction utilitaire pour parser les données brutes
export function parseAnalysisData(rawData: RawAnalysisData): ContractAnalysis {
  try {
    // Parse les données JSON
    const parsedSummary = JSON.parse(rawData.summary || "{}");
    const parsedIdentifiedParties = JSON.parse(
      rawData.identified_parties || "{}",
    );
    const parsedRisks = JSON.parse(rawData.risks || "[]");
    const parsedObligations = JSON.parse(rawData.obligations || "[]");
    const parsedPowers = JSON.parse(rawData.powers || "[]");
    const parsedCriticalClauses = JSON.parse(rawData.critical_clauses || "[]");
    const parsedPartyAnalysis = JSON.parse(rawData.party_analysis || "{}");
    const parsedScenarios = JSON.parse(rawData.probable_scenarios || "[]");

    return {
      id: rawData.id,
      contractId: rawData.contractId,
      userId: rawData.userId,
      summary: {
        global_risk_score: parsedSummary.global_risk_score || 0,
        balance_score: parsedSummary.balance_score || 0,
        clarity_score: parsedSummary.clarity_score || 0,
        key_points: parsedSummary.key_points || [],
        strategic_advice: parsedSummary.strategic_advice || [],
        risk_timeline: parsedSummary.risk_timeline || {
          immediate: [],
          short_term: [],
          long_term: [],
        },
      },
      identified_parties: parsedIdentifiedParties,
      risks: parsedRisks,
      obligations: parsedObligations,
      powers: parsedPowers,
      critical_clauses: parsedCriticalClauses,
      party_analysis: parsedPartyAnalysis,
      probable_scenarios: parsedScenarios,
      modelUsed: rawData.modelUsed,
      processingTime: rawData.processingTime,
      tokenCount: rawData.tokenCount,
      cost: rawData.cost,
      errorMessage: rawData.errorMessage,
      createdAt: rawData.createdAt,
    };
  } catch (error) {
    console.error("Error parsing analysis data:", error);

    // Retourner une structure vide en cas d'erreur
    return {
      id: rawData.id,
      contractId: rawData.contractId,
      userId: rawData.userId,
      summary: {
        global_risk_score: 0,
        balance_score: 0,
        clarity_score: 0,
        key_points: [],
        strategic_advice: [],
        risk_timeline: {
          immediate: [],
          short_term: [],
          long_term: [],
        },
      },
      identified_parties: {
        party_a: { name: "Party A", role: "", legal_status: "" },
        party_b: { name: "Party B", role: "", legal_status: "" },
      },
      risks: [],
      obligations: [],
      powers: [],
      critical_clauses: [],
      party_analysis: {
        party_a: {
          party_name: "Party A",
          risk_score: 0,
          opportunity_score: 0,
          negotiation_power: "medium",
          major_risks: [],
          advantages: [],
          specific_recommendations: [],
        },
        party_b: {
          party_name: "Party B",
          risk_score: 0,
          opportunity_score: 0,
          negotiation_power: "medium",
          major_risks: [],
          advantages: [],
          specific_recommendations: [],
        },
      },
      probable_scenarios: [],
      modelUsed: rawData.modelUsed,
      processingTime: rawData.processingTime,
      tokenCount: rawData.tokenCount,
      cost: rawData.cost,
      errorMessage: rawData.errorMessage || "Error parsing analysis data",
      createdAt: rawData.createdAt,
    };
  }
}

// Fonction pour créer un RawAnalysisData à partir d'un objet Prisma
export function createRawAnalysisData(prismaAnalysis: any): RawAnalysisData {
  return {
    id: prismaAnalysis.id,
    contractId: prismaAnalysis.contractId,
    userId: prismaAnalysis.userId,
    summary: prismaAnalysis.summary || "{}",
    identified_parties: prismaAnalysis.identified_parties || "{}",
    risks: prismaAnalysis.risks || "[]",
    obligations: prismaAnalysis.obligations || "[]",
    powers: prismaAnalysis.powers || "[]",
    critical_clauses: prismaAnalysis.critical_clauses || "[]",
    party_analysis: prismaAnalysis.party_analysis || "{}",
    probable_scenarios: prismaAnalysis.probable_scenarios || "[]",
    modelUsed: prismaAnalysis.modelUsed,
    processingTime: prismaAnalysis.processingTime,
    tokenCount: prismaAnalysis.tokenCount,
    cost: prismaAnalysis.cost,
    errorMessage: prismaAnalysis.errorMessage,
    createdAt: prismaAnalysis.createdAt.toISOString(),
  };
}
