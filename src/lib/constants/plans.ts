export interface CreditPack {
  id: string;
  name: string;
  credits: number; // Changed from tokens to credits for clarity
  price: number;
  currency: string;
  popular?: boolean;
  features: string[];
  description: string;
  badge?: string;
  stripePriceId?: string; // Future use
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack_10",
    name: "Pack Essentiel",
    credits: 10,
    price: 9.9,
    currency: "EUR",
    description: "Pour démarrer et analyser vos premiers contrats.",
    features: [
      "10 crédits (+3 offerts/mois)",
      "Valable à vie (sans expiration)",
      "Analyse complète (Risques, Obligations)",
      "Export PDF inclus",
    ],
  },
  {
    id: "pack_25",
    name: "Pack Pro",
    credits: 25,
    price: 19.9,
    currency: "EUR",
    popular: true,
    badge: "Populaire",
    description: "Le choix idéal pour les entrepreneurs réguliers.",
    features: [
      "25 crédits (+3 offerts/mois)",
      "Valable à vie (sans expiration)",
      "Support prioritaire",
      "Analyse comparative (bientôt)",
    ],
  },
  {
    id: "pack_50",
    name: "Pack Business",
    credits: 50,
    price: 29.9,
    currency: "EUR",
    description: "Pour les cabinets et les volumes importants.",
    features: [
      "50 crédits (+3 offerts/mois)",
      "Valable à vie (sans expiration)",
      "Tarif dégressif",
      "Accès API (sur demande)",
    ],
  },
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: "€",
  USD: "$",
  GBP: "£",
};

// Legacy exports to avoid breaking imports immediately, but set to empty or safe defaults
// We will clean up usage in components next.
export const PLANS: any[] = [];
export const BILLING_PERIODS: any[] = [];
