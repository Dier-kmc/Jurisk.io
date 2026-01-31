export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'analysis' | 'security' | 'productivity' | 'export';
  plans: ('free' | 'premium')[];
}

export const FEATURES: Feature[] = [
  {
    id: 'feat1',
    title: 'Analyse IA avancée',
    description: 'Notre IA identifie automatiquement les clauses importantes, les risques cachés et les obligations.',
    icon: '🤖',
    category: 'analysis',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat2',
    title: 'Score de vigilance',
    description: 'Obtenez un score global de risque pour chaque contrat analysé.',
    icon: '📊',
    category: 'analysis',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat3',
    title: 'Détection des risques',
    description: 'Identification automatique des pénalités excessives, clauses abusives et déséquilibres.',
    icon: '⚠️',
    category: 'analysis',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat4',
    title: 'Extraction des obligations',
    description: 'Liste claire de toutes les obligations, délais et engagements.',
    icon: '📋',
    category: 'analysis',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat5',
    title: 'Support multi-formats',
    description: 'Analyse de PDF, DOC, DOCX, TXT. Même les documents scannés avec OCR.',
    icon: '📄',
    category: 'analysis',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat6',
    title: 'Historique intelligent',
    description: 'Conservez tous vos contrats analysés avec recherche et filtres avancés.',
    icon: '🗃️',
    category: 'productivity',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat7',
    title: 'Export avancé',
    description: 'Exportez vos rapports en PDF, Word ou Excel pour partage et archivage.',
    icon: '💾',
    category: 'export',
    plans: ['premium'],
  },
  {
    id: 'feat8',
    title: 'Analyses prioritaires',
    description: 'Traitement accéléré de vos documents avec notre infrastructure dédiée.',
    icon: '⚡',
    category: 'productivity',
    plans: ['premium'],
  },
  {
    id: 'feat9',
    title: 'Chiffrement de bout en bout',
    description: 'Vos documents sont chiffrés et jamais partagés avec des tiers.',
    icon: '🔒',
    category: 'security',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat10',
    title: 'Suppression automatique',
    description: 'Vos documents sont automatiquement supprimés après 30 jours.',
    icon: '🗑️',
    category: 'security',
    plans: ['free', 'premium'],
  },
  {
    id: 'feat11',
    title: 'API d\'intégration',
    description: 'Intégrez Jurisk.io directement dans vos outils existants.',
    icon: '🔌',
    category: 'productivity',
    plans: ['premium'],
  },
  {
    id: 'feat12',
    title: 'Support prioritaire',
    description: 'Accédez à notre équipe support en moins de 2 heures.',
    icon: '👨‍💼',
    category: 'productivity',
    plans: ['premium'],
  },
];

export const FEATURE_CATEGORIES = [
  { id: 'analysis', name: 'Analyse', color: 'bg-blue-500/20', textColor: 'text-blue-400' },
  { id: 'security', name: 'Sécurité', color: 'bg-green-500/20', textColor: 'text-green-400' },
  { id: 'productivity', name: 'Productivité', color: 'bg-purple-500/20', textColor: 'text-purple-400' },
  { id: 'export', name: 'Export', color: 'bg-yellow-600/20', textColor: 'text-yellow-600' },
];

export const getFeaturesByPlan = (planId: 'free' | 'premium'): Feature[] => {
  return FEATURES.filter(feature => feature.plans.includes(planId));
};

export const getFeaturesByCategory = (categoryId: string): Feature[] => {
  return FEATURES.filter(feature => feature.category === categoryId);
};