export interface RiskLevel {
  id: 'low' | 'medium' | 'high' | 'critical';
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
  scoreRange: [number, number]; // min, max
  icon: string;
  recommendations: string[];
}

export const RISK_LEVELS: Record<'low' | 'medium' | 'high' | 'critical', RiskLevel> = {
  low: {
    id: 'low',
    label: 'Faible risque',
    description: 'Le contrat présente peu de risques significatifs. Lecture standard recommandée.',
    color: '#22C55E', // green-500
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    scoreRange: [0, 3.9],
    icon: '✅',
    recommendations: [
      'Lecture standard suffisante',
      'Vérifier les dates et montants',
      'Conserver une copie signée',
    ],
  },
  medium: {
    id: 'medium',
    label: 'Risque modéré',
    description: 'Quelques points nécessitent attention. Revue approfondie recommandée.',
    color: '#F97316', // orange-500
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    scoreRange: [4, 6.9],
    icon: '⚠️',
    recommendations: [
      'Revue approfondie nécessaire',
      'Négocier les clauses problématiques',
      'Documenter les décisions',
      'Consulter un collègue senior',
    ],
  },
  high: {
    id: 'high',
    label: 'Risque élevé',
    description: 'Risques significatifs identifiés. Consultation juridique fortement recommandée.',
    color: '#EF4444', // red-500
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    scoreRange: [7, 8.9],
    icon: '🚨',
    recommendations: [
      'Consultation juridique obligatoire',
      'Négociation approfondie requise',
      'Évaluer les alternatives',
      'Documenter toutes les communications',
      'Considérer une clause de sortie',
    ],
  },
  critical: {
    id: 'critical',
    label: 'Risque critique',
    description: 'Risques majeurs détectés. Signature déconseillée sans modifications substantielles.',
    color: '#991B1B', // red-800
    bgColor: 'bg-red-800/30',
    textColor: 'text-red-300',
    borderColor: 'border-red-800/50',
    scoreRange: [9, 10],
    icon: '⛔',
    recommendations: [
      'NE PAS SIGNER en l\'état',
      'Consultation juridique urgente',
      'Négociation complète requise',
      'Évaluer la nécessité du contrat',
      'Prévoir des garanties substantielles',
      'Clause de sortie impérative',
    ],
  },
};

export const RISK_CATEGORIES = [
  {
    id: 'penalty',
    name: 'Pénalités',
    description: 'Clauses de pénalité, retards, et sanctions financières',
    icon: '💰',
  },
  {
    id: 'liability',
    name: 'Responsabilité',
    description: 'Limitations de responsabilité, indemnités, et garanties',
    icon: '⚖️',
  },
  {
    id: 'confidentiality',
    name: 'Confidentialité',
    description: 'Clauses de non-divulgation et protection des données',
    icon: '🔒',
  },
  {
    id: 'termination',
    name: 'Résiliation',
    description: 'Conditions de fin de contrat et clauses de sortie',
    icon: '🚪',
  },
  {
    id: 'jurisdiction',
    name: 'Juridiction',
    description: 'Droit applicable, tribunal compétent, et arbitrage',
    icon: '🏛️',
  },
  {
    id: 'intellectual',
    name: 'Propriété intellectuelle',
    description: 'Droits d\'auteur, brevets, et licences',
    icon: '💡',
  },
];

export const getRiskLevelByScore = (score: number): RiskLevel => {
  if (score >= RISK_LEVELS.critical.scoreRange[0] && score <= RISK_LEVELS.critical.scoreRange[1]) {
    return RISK_LEVELS.critical;
  }
  if (score >= RISK_LEVELS.high.scoreRange[0] && score <= RISK_LEVELS.high.scoreRange[1]) {
    return RISK_LEVELS.high;
  }
  if (score >= RISK_LEVELS.medium.scoreRange[0] && score <= RISK_LEVELS.medium.scoreRange[1]) {
    return RISK_LEVELS.medium;
  }
  return RISK_LEVELS.low;
};

export const getRiskColor = (score: number): string => {
  const level = getRiskLevelByScore(score);
  return level.color;
};