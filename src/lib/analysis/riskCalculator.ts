// src/lib/analysis/riskCalculator.ts
// Module de calcul de risque basé sur la méthodologie ISO 31000 adaptée au contexte juridique

import { Risk, PartyAnalysis, ContractAnalysis } from "@/types/contract";

/**
 * Facteurs d'urgence basés sur le délai
 */
const URGENCY_FACTORS = {
  immediate: 2.0,
  short_term: 1.5,
  medium_term: 1.2,
  long_term: 1.0,
} as const;

/**
 * Poids basés sur la priorité
 */
const PRIORITY_WEIGHTS = {
  high: 3,
  medium: 2,
  low: 1,
} as const;

/**
 * Multiplicateurs de sévérité
 */
const SEVERITY_MULTIPLIERS = {
  high: 1.3,
  medium: 1.1,
  low: 1.0,
} as const;

/**
 * Facteurs de coût basés sur l'impact
 */
const IMPACT_COST_FACTORS = {
  financial: 3.0,
  legal: 2.5,
  strategic: 2.0,
  operational: 1.5,
  reputational: 1.3,
} as const;

export class RiskCalculator {
  /**
   * Calcule le score de risque individuel
   * Formule: (Probability × Impact × Urgency Factor × Cost Factor) / 100
   *
   * @param risk - Le risque à évaluer
   * @returns Score de risque entre 0 et 100
   */
  static calculateIndividualRiskScore(risk: Risk): number {
    // Valeurs par défaut si non fournies
    const probability =
      risk.probability ?? this.inferProbabilityFromSeverity(risk.severity);
    const impactMagnitude =
      risk.impact_magnitude ?? this.inferImpactFromSeverity(risk.severity);
    const urgencyFactor = this.getUrgencyFactor(risk.deadline);
    const costFactor = this.getCostFactor(risk.impact);

    // Calcul du score brut
    const rawScore =
      (probability * impactMagnitude * urgencyFactor * costFactor) / 100;

    // Normaliser entre 0 et 100
    const normalizedScore = Math.min(100, Math.max(0, rawScore));

    return Math.round(normalizedScore);
  }

  /**
   * Calcule le score de risque global pour tous les risques
   * Formule: (Σ(Risk Score × Weight) / Σ(Weight)) × Severity Multiplier
   *
   * @param risks - Liste des risques
   * @returns Score global entre 0 et 100
   */
  static calculateGlobalRiskScore(risks: Risk[]): number {
    if (!risks || risks.length === 0) {
      return 0;
    }

    // Calculer les scores individuels
    const risksWithScores = risks.map((risk) => ({
      score: this.calculateIndividualRiskScore(risk),
      weight: PRIORITY_WEIGHTS[risk.priority || "medium"],
      severity: risk.severity,
    }));

    // Calculer le score pondéré
    const totalWeightedScore = risksWithScores.reduce(
      (sum, risk) => sum + risk.score * risk.weight,
      0,
    );
    const totalWeight = risksWithScores.reduce(
      (sum, risk) => sum + risk.weight,
      0,
    );

    const weightedAverage = totalWeightedScore / totalWeight;

    // Appliquer le multiplicateur de sévérité
    const severityMultiplier = this.getSeverityMultiplier(risks);
    const finalScore = weightedAverage * severityMultiplier;

    return Math.round(Math.min(100, Math.max(0, finalScore)));
  }

  /**
   * Calcule le score d'équilibre entre les parties
   * Un score de 50 indique un équilibre parfait
   * < 50 favorise la partie A, > 50 favorise la partie B
   *
   * @param partyAnalysis - Analyse des parties
   * @returns Score d'équilibre entre 0 et 100
   */
  static calculateBalanceScore(partyAnalysis: PartyAnalysis): number {
    if (!partyAnalysis) {
      return 50; // Neutre par défaut
    }

    const partyA = partyAnalysis.party_a;
    const partyB = partyAnalysis.party_b;

    // Calculer le différentiel de risque
    const riskDifferential = partyB.risk_score - partyA.risk_score;

    // Calculer le différentiel d'opportunité
    const opportunityDifferential =
      partyA.opportunity_score - partyB.opportunity_score;

    // Calculer le différentiel de pouvoir de négociation
    const powerDifferential =
      this.getNegotiationPowerValue(partyA.negotiation_power) -
      this.getNegotiationPowerValue(partyB.negotiation_power);

    // Score composite (50 = équilibré)
    // Si partyA a plus de risques, le score augmente (favorise B)
    // Si partyA a plus d'opportunités, le score diminue (favorise A)
    const balanceScore =
      50 +
      riskDifferential * 0.3 +
      opportunityDifferential * 0.3 +
      powerDifferential * 10 * 0.4;

    return Math.round(Math.min(100, Math.max(0, balanceScore)));
  }

  /**
   * Calcule le score de clarté du contrat
   * Basé sur la complétude et la cohérence de l'analyse
   *
   * @param analysis - Analyse complète du contrat
   * @returns Score de clarté entre 0 et 100
   */
  static calculateClarityScore(analysis: ContractAnalysis): number {
    let clarityScore = 100;

    // Pénalités pour manque de clarté
    const penalties = {
      missingParties:
        !analysis.identified_parties?.party_a?.name ||
        !analysis.identified_parties?.party_b?.name
          ? 20
          : 0,
      fewObligations: analysis.obligations?.length < 3 ? 10 : 0,
      manyHighRisks:
        analysis.risks?.filter((r) => r.severity === "high").length > 5
          ? 15
          : 0,
      fewCriticalClauses: analysis.critical_clauses?.length < 3 ? 10 : 0,
      noScenarios:
        !analysis.probable_scenarios || analysis.probable_scenarios.length === 0
          ? 15
          : 0,
    };

    const totalPenalty = Object.values(penalties).reduce(
      (sum, penalty) => sum + penalty,
      0,
    );
    clarityScore -= totalPenalty;

    // Bonus pour bonne structure
    const bonuses = {
      wellDefinedParties:
        analysis.identified_parties?.party_a?.legal_status &&
        analysis.identified_parties?.party_b?.legal_status
          ? 5
          : 0,
      balancedRisks: this.hasBalancedRiskDistribution(analysis.risks) ? 10 : 0,
      detailedRecommendations:
        analysis.summary?.strategic_advice?.length >= 5 ? 5 : 0,
    };

    const totalBonus = Object.values(bonuses).reduce(
      (sum, bonus) => sum + bonus,
      0,
    );
    clarityScore += totalBonus;

    return Math.round(Math.min(100, Math.max(0, clarityScore)));
  }

  /**
   * Infère la probabilité à partir de la sévérité
   */
  private static inferProbabilityFromSeverity(
    severity: "low" | "medium" | "high",
  ): number {
    const probabilityMap = {
      high: 70,
      medium: 50,
      low: 30,
    };
    return probabilityMap[severity] || 50;
  }

  /**
   * Infère l'impact à partir de la sévérité
   */
  private static inferImpactFromSeverity(
    severity: "low" | "medium" | "high",
  ): number {
    const impactMap = {
      high: 8,
      medium: 5,
      low: 3,
    };
    return impactMap[severity] || 5;
  }

  /**
   * Obtient le facteur d'urgence
   */
  private static getUrgencyFactor(deadline?: string): number {
    if (!deadline) return 1.0;

    const deadlineLower = deadline.toLowerCase();
    if (
      deadlineLower.includes("immediate") ||
      deadlineLower.includes("immédiat")
    ) {
      return URGENCY_FACTORS.immediate;
    }
    if (deadlineLower.includes("short") || deadlineLower.includes("court")) {
      return URGENCY_FACTORS.short_term;
    }
    if (deadlineLower.includes("medium") || deadlineLower.includes("moyen")) {
      return URGENCY_FACTORS.medium_term;
    }
    return URGENCY_FACTORS.long_term;
  }

  /**
   * Obtient le facteur de coût basé sur le type d'impact
   */
  private static getCostFactor(impact: string): number {
    const impactLower = impact.toLowerCase();

    if (
      impactLower.includes("financial") ||
      impactLower.includes("financier")
    ) {
      return IMPACT_COST_FACTORS.financial;
    }
    if (
      impactLower.includes("legal") ||
      impactLower.includes("légal") ||
      impactLower.includes("juridique")
    ) {
      return IMPACT_COST_FACTORS.legal;
    }
    if (
      impactLower.includes("strategic") ||
      impactLower.includes("stratégique")
    ) {
      return IMPACT_COST_FACTORS.strategic;
    }
    if (
      impactLower.includes("operational") ||
      impactLower.includes("opérationnel")
    ) {
      return IMPACT_COST_FACTORS.operational;
    }
    if (
      impactLower.includes("reputational") ||
      impactLower.includes("réputationnel")
    ) {
      return IMPACT_COST_FACTORS.reputational;
    }

    return 1.5; // Valeur par défaut
  }

  /**
   * Calcule le multiplicateur de sévérité global
   */
  private static getSeverityMultiplier(risks: Risk[]): number {
    const highRisks = risks.filter((r) => r.severity === "high").length;
    const mediumRisks = risks.filter((r) => r.severity === "medium").length;
    const totalRisks = risks.length;

    const highPercentage = highRisks / totalRisks;
    const mediumPercentage = mediumRisks / totalRisks;

    if (highPercentage > 0.5) {
      return SEVERITY_MULTIPLIERS.high;
    }
    if (mediumPercentage > 0.5) {
      return SEVERITY_MULTIPLIERS.medium;
    }
    return SEVERITY_MULTIPLIERS.low;
  }

  /**
   * Convertit le pouvoir de négociation en valeur numérique
   */
  private static getNegotiationPowerValue(
    power: "weak" | "medium" | "strong",
  ): number {
    const powerMap = {
      strong: 1,
      medium: 0,
      weak: -1,
    };
    return powerMap[power] || 0;
  }

  /**
   * Vérifie si la distribution des risques est équilibrée
   */
  private static hasBalancedRiskDistribution(risks: Risk[]): boolean {
    if (!risks || risks.length === 0) return false;

    const highCount = risks.filter((r) => r.severity === "high").length;
    const mediumCount = risks.filter((r) => r.severity === "medium").length;
    const lowCount = risks.filter((r) => r.severity === "low").length;

    // Distribution équilibrée si aucune catégorie ne domine trop
    const total = risks.length;
    return (
      highCount / total < 0.7 &&
      mediumCount / total < 0.7 &&
      lowCount / total < 0.7
    );
  }

  /**
   * Enrichit un risque avec son score calculé
   */
  static enrichRiskWithScore(risk: Risk): Risk & { calculatedScore: number } {
    return {
      ...risk,
      calculatedScore: this.calculateIndividualRiskScore(risk),
    };
  }

  /**
   * Enrichit tous les risques avec leurs scores
   */
  static enrichRisksWithScores(
    risks: Risk[],
  ): Array<Risk & { calculatedScore: number }> {
    return risks.map((risk) => this.enrichRiskWithScore(risk));
  }
}
