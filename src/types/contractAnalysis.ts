export type ContractFamily = "commercial_general" | "employment";
export type AnalysisObjective = "sign" | "renegotiate" | "renew" | "review";
export type ActionPriority = "urgent" | "important" | "monitor";

export interface AnalysisContext {
  jurisdiction: string;
  contractType: ContractFamily;
  representedParty: string;
  objective: AnalysisObjective;
}

export interface SourceSegment {
  id: string;
  text: string;
  page?: number;
  section?: string;
  start: number;
  end: number;
}

export interface SourceReference {
  segmentId: string;
  quote: string;
  page?: number;
  section?: string;
}

export interface NegotiationFinding {
  id: string;
  priority: ActionPriority;
  category: string;
  title: string;
  issue: string;
  consequence: string;
  confidence: number;
  sources: SourceReference[];
  recommendedPosition: string;
  negotiationWording: string;
  question: string;
}

export interface ContractObligation {
  id: string;
  party: string;
  action: string;
  deadline: string;
  cost: string;
  consequence: string;
  source?: SourceReference;
}

export interface ContractInventory {
  parties: Array<{ name: string; role: string }>;
  contractType: ContractFamily;
  missingClauses: string[];
  obligations: ContractObligation[];
  findings: NegotiationFinding[];
}

export interface NegotiationAnalysis {
  context: AnalysisContext;
  inventory: ContractInventory;
  findings: NegotiationFinding[];
  topPriorities: string[];
  openQuestions: string[];
  confidence: number;
  sourceSegments: SourceSegment[];
}

export interface CopilotCitation {
  segmentId: string;
  quote: string;
  page?: number;
  section?: string;
}
