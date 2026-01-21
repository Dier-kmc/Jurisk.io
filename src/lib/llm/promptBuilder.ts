export interface Risk {
  type:
    | "clause_penale"
    | "delai"
    | "confidentialite"
    | "exclusivite"
    | "garantie"
    | "responsabilite"
    | "autre";
  description: string;
  gravite: "faible" | "moyenne" | "elevee";
  clause: string;
  recommandation: string;
  impact: "financier" | "legal" | "operationnel" | "reputation";
}

export interface Obligation {
  partie: "prestataire" | "client" | "les_deux";
  description: string;
  delai: string;
  penalites: string;
  couts: string;
}

export interface Power {
  type: "resiliation" | "modification" | "controle" | "sanction" | "audit";
  detenteur: "prestataire" | "client" | "les_deux";
  description: string;
  limitations: string;
  abus_potentiel: boolean;
}

export interface Summary {
  score_risque: number;
  score_clarte: number;
  points_cles: string[];
  conseils: string[];
  duree_contrat: string;
  renouvellement: string;
}

export interface ContractAnalysis {
  risques: Risk[];
  obligations: Obligation[];
  pouvoirs: Power[];
  summary: Summary;
}

export class PromptBuilder {
  static getContractAnalysisPrompt(text: string): string {
    // Limiter la longueur des champs et des listes
    return `Tu es un expert en analyse contractuelle avec 20 ans d'expérience.
Analyse ce contrat et retourne un JSON strictement formaté avec cette structure :

{
  "risques": [
    {
      "type": "clause_penale | delai | confidentialite | exclusivite | garantie | responsabilite | autre",
      "description": "max 200 caractères",
      "gravite": "faible | moyenne | elevee",
      "clause": "max 100 caractères",
      "recommandation": "max 150 caractères",
      "impact": "financier | legal | operationnel | reputation"
    }
  ],
  "obligations": [
    {
      "partie": "prestataire | client | les_deux",
      "description": "max 200 caractères",
      "delai": "max 50 caractères",
      "penalites": "max 50 caractères",
      "couts": "max 50 caractères"
    }
  ],
  "pouvoirs": [
    {
      "type": "resiliation | modification | controle | sanction | audit",
      "detenteur": "prestataire | client | les_deux",
      "description": "max 150 caractères",
      "limitations": "max 100 caractères",
      "abus_potentiel": true | false
    }
  ],
  "summary": {
    "score_risque": 0-100,
    "score_clarte": 0-100,
    "points_cles": ["max 5 points, 50 caractères chacun"],
    "conseils": ["max 5 conseils, 50 caractères chacun"],
    "duree_contrat": "max 50 caractères",
    "renouvellement": "max 50 caractères"
  }
}

Règles strictes :
1. Retourne UNIQUEMENT le JSON valide, sans texte supplémentaire.
2. Limite chaque liste à 15 éléments maximum.
3. Pour le score_risque, 0 = aucun risque, 100 = risque extrême.
4. Pour le score_clarte, 0 = illisible, 100 = parfaitement clair.

Contrat à analyser (max 6000 caractères par chunk) :
"${text.substring(0, 6000)}"

JSON :`
  }
}

