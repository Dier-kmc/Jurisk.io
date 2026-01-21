export interface RiskItem {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  clause?: string;
  probability?: number;
  recommandation?: string;
  impact?: number;
  impactType?: string;
}

export interface RiskScore {
  overall: number; // 0-10
  breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  items: RiskItem[];
}

export interface CalculatedRisk {
  score: number;
  level: 'low' | 'medium' | 'high';
  color: string;
  label: string;
}

/**
 * Calcule le score global de risque basé sur les items
 */
export const calculateOverallRiskScore = (riskItems: RiskItem[]): CalculatedRisk => {
  if (riskItems.length === 0) {
    return {
      score: 0,
      level: 'low',
      color: '#22C55E', // green-500
      label: 'Aucun risque détecté',
    };
  }
  
  // Pondération par sévérité
  const weights = {
    high: 1.0,
    medium: 0.6,
    low: 0.3,
  };
  
  // Calcul du score pondéré
  let weightedScore = 0;
  let totalWeight = 0;
  
  const breakdown = { high: 0, medium: 0, low: 0 };
  
  riskItems.forEach(item => {
    const weight = weights[item.severity];
    const itemScore = item.probability && item.impact 
      ? (item.probability * item.impact) / 10 
      : weight * 8; // Valeur par défaut si probabilité/impact non définis
    
    weightedScore += itemScore * weight;
    totalWeight += weight;
    
    breakdown[item.severity]++;
  });
  
  const overallScore = totalWeight > 0 
    ? (weightedScore / totalWeight) * 10 
    : 0;
  
  // Normalisation sur 10
  const normalizedScore = Math.min(10, Math.max(0, overallScore));
  
  // Détermination du niveau
  let level: 'low' | 'medium' | 'high';
  let color: string;
  let label: string;
  
  if (normalizedScore >= 7) {
    level = 'high';
    color = '#EF4444'; // red-500
    label = 'Risque élevé';
  } else if (normalizedScore >= 4) {
    level = 'medium';
    color = '#F97316'; // orange-500
    label = 'Risque modéré';
  } else {
    level = 'low';
    color = '#EAB308'; // yellow-500
    label = 'Risque faible';
  }
  
  return {
    score: Math.round(normalizedScore * 10) / 10, // Arrondi à 1 décimale
    level,
    color,
    label,
  };
};

/**
 * Calcule la probabilité en fonction du type de clause
 */
export const calculateRiskProbability = (
  clauseType: string, 
  context: Record<string, any> = {}
): number => {
  const probabilities: Record<string, number> = {
    'penalty': 0.8,
    'liability': 0.7,
    'termination': 0.6,
    'confidentiality': 0.5,
    'indemnity': 0.7,
    'warranty': 0.4,
    'jurisdiction': 0.3,
    'default': 0.5,
  };
  
  // Ajustement basé sur le contexte
  let probability = probabilities[clauseType] || probabilities.default;
  
  if (context.duration && context.duration > 5) {
    probability += 0.1;
  }
  
  if (context.amount && context.amount > 100000) {
    probability += 0.15;
  }
  
  if (context.oneSided === true) {
    probability += 0.2;
  }
  
  return Math.min(1, Math.max(0.1, probability));
};

/**
 * Calcule l'impact en fonction de la sévérité
 */
export const calculateRiskImpact = (severity: 'low' | 'medium' | 'high'): number => {
  const impacts = {
    low: 3,
    medium: 6,
    high: 9,
  };
  
  return impacts[severity];
};

/**
 * Génére des recommandations basées sur le score de risque
 */
export const generateRiskRecommendations = (
  riskScore: CalculatedRisk,
  riskItems: RiskItem[]
): string[] => {
  const recommendations: string[] = [];
  
  if (riskScore.level === 'high') {
    recommendations.push(
      "Consulter un avocat avant de signer",
      "Négocier les clauses à haut risque prioritairement",
      "Évaluer les alternatives contractuelles"
    );
  }
  
  if (riskScore.level === 'medium' || riskScore.level === 'high') {
    const highRiskItems = riskItems.filter(item => item.severity === 'high');
    if (highRiskItems.length > 0) {
      highRiskItems.forEach(item => {
        recommendations.push(`Renégocier : ${item.title} (${item.clause || 'clause concernée'})`);
      });
    }
    
    recommendations.push(
      "Vérifier les délais et pénalités",
      "S'assurer des garanties et assurances requises"
    );
  }
  
  if (riskItems.some(item => item.severity === 'low')) {
    recommendations.push(
      "Maintenir les clauses à faible risque",
      "Documenter les décisions contractuelles"
    );
  }
  
  // Recommandations générales
  recommendations.push(
    "Conserver une trace écrite des négociations",
    "Vérifier la cohérence des dates et échéances"
  );
  
  return Array.from(new Set(recommendations)); // Supprime les doublons
};