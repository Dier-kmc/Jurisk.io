export interface PlanFeature {
  id: string;
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  currency?: string;
  popular?: boolean;
  features: PlanFeature[];
  ctaText: string;
  ctaVariant: 'primary' | 'outline' | 'secondary';
  badge?: string;
  limit?: {
    uploads: number;
    fileSize: string;
    history: string;
  };
}

export const PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Parfait pour découvrir l\'outil et analyser quelques contrats par mois.',
    price: 0,
    period: 'mois',
    currency: 'EUR',
    features: [
      { id: 'f1', text: '3 analyses par mois', included: true },
      { id: 'f2', text: 'Formats PDF, DOC, TXT', included: true },
      { id: 'f3', text: 'Historique 30 jours', included: true },
      { id: 'f4', text: 'Score de risque basique', included: true },
      { id: 'f5', text: 'Export PDF simple', included: true },
      { id: 'f6', text: 'Analyses illimitées', included: false },
      { id: 'f7', text: 'Jusqu\'à 50MB par fichier', included: false },
      { id: 'f8', text: 'Support prioritaire', included: false },
    ],
    ctaText: 'Commencer gratuitement',
    ctaVariant: 'outline',
    limit: {
      uploads: 3,
      fileSize: '20MB',
      history: '30 jours',
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Pour les professionnels qui analysent régulièrement des contrats.',
    price: 4.99,
    period: 'mois',
    currency: 'EUR',
    popular: true,
    badge: 'Populaire',
    features: [
      { id: 'p1', text: 'Analyses illimitées', included: true, highlight: true },
      { id: 'p2', text: 'Jusqu\'à 50MB par fichier', included: true, highlight: true },
      { id: 'p3', text: 'Historique illimité', included: true, highlight: true },
      { id: 'p4', text: 'Analyses prioritaires', included: true },
      { id: 'p5', text: 'Export Word/Excel avancé', included: true },
      { id: 'p6', text: 'Support prioritaire', included: true },
      { id: 'p7', text: 'Recommandations détaillées', included: true },
      { id: 'p8', text: 'API d\'intégration', included: true },
    ],
    ctaText: 'S\'abonner maintenant',
    ctaVariant: 'primary',
    limit: {
      uploads: Infinity,
      fileSize: '50MB',
      history: 'Illimité',
    },
  },
];

export const PLAN_FEATURES_ALL = [
  { id: 'all1', text: 'Analyse par IA avancée', category: 'core' },
  { id: 'all2', text: 'Détection des risques', category: 'core' },
  { id: 'all3', text: 'Extraction des obligations', category: 'core' },
  { id: 'all4', text: 'Identification des pouvoirs', category: 'core' },
  { id: 'all5', text: 'Score de vigilance', category: 'core' },
  { id: 'all6', text: 'Rapport structuré', category: 'core' },
  { id: 'all7', text: 'Support multi-formats', category: 'core' },
  { id: 'all8', text: 'Confidentialité garantie', category: 'security' },
  { id: 'all9', text: 'Chiffrement des données', category: 'security' },
  { id: 'all10', text: 'Suppression automatique', category: 'security' },
];

export const BILLING_PERIODS = [
  { id: 'monthly', name: 'Mensuel', value: 'month', discount: 0 },
  { id: 'yearly', name: 'Annuel', value: 'year', discount: 20, badge: '-20%' },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
};