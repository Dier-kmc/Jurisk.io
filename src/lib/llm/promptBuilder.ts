// src/lib/llm/promptBuilder.ts
export class PromptBuilder {
  static getContractAnalysisPrompt(text: string): string {
    return `You are a contract analysis expert with 20 years of experience. Analyze contracts with a strategic and balanced approach, identifying issues for EACH party.

ANALYZE THIS CONTRACT FOLLOWING THESE STEPS:

1. PARTY IDENTIFICATION:
   - Name and role of each party
   - Legal status
   - Initial power dynamics

2. PARTY ANALYSIS (for each):
   - Major risks
   - Advantages
   - Weaknesses
   - Risk/opportunity score
   - Negotiation power

3. CRITICAL CLAUSES:
   - Identify 5-10 most problematic clauses
   - Propose concrete solutions
   - Evaluate legal impact

4. PROBABLE SCENARIOS:
   - Develop 3-4 realistic scenarios
   - Probabilities and consequences

5. STRATEGIC RECOMMENDATIONS:
   - Negotiation priorities
   - Non-negotiable points
   - Possible concessions

RESPOND STRICTLY IN JSON WITH THIS STRUCTURE (ALL FIELD NAMES IN ENGLISH):

{
  "identified_parties": {
    "party_a": {
      "name": "string",
      "role": "string", 
      "legal_status": "string"
    },
    "party_b": {
      "name": "string",
      "role": "string",
      "legal_status": "string"
    }
  },
  "risks": [
    {
      "type": "string (e.g., 'penalty_clause', 'deadline', 'confidentiality', 'exclusivity', 'guarantee', 'liability', 'non_competition', 'intellectual_property', 'termination', 'force_majeure', 'imbalance', 'other')",
      "description": "string (max 150 chars)",
      "severity": "low | medium | high",
      "clause": "string (e.g., 'Art. 8.2')",
      "recommendation": "string (max 100 chars)",
      "impact": "financial | legal | operational | reputational | strategic",
      "probability": 0-100,
      "impact_magnitude": 0-10,
      "priority": "low | medium | high",
      "deadline": "immediate | short_term | medium_term | long_term"
    }
  ],
  "obligations": [
    {
      "type": "string (optional)",
      "description": "string (max 120 chars)",
      "party": "provider | client | both",
      "deadline": "string",
      "penalties": "string",
      "costs": "string",
      "associated_clause": "string (optional)"
    }
  ],
  "powers": [
    {
      "type": "termination | modification | control | sanction | audit | general",
      "description": "string (max 100 chars)",
      "holder": "provider | client | both",
      "limitations": "string",
      "potential_abuse": true | false,
      "associated_clause": "string (optional)"
    }
  ],
  "critical_clauses": [
    {
      "clause_number": "string",
      "title": "string",
      "problem": "string (max 80 chars)",
      "legal_impact": "string",
      "proposed_solution": "string (max 100 chars)",
      "priority": "low | medium | high"
    }
  ],
  "party_analysis": {
    "party_a": {
      "party_name": "string",
      "risk_score": 0-100,
      "opportunity_score": 0-100,
      "negotiation_power": "weak | medium | strong",
      "major_risks": ["string (max 50 chars)"],
      "advantages": ["string (max 50 chars)"],
      "specific_recommendations": ["string (max 60 chars)"]
    },
    "party_b": {
      "party_name": "string",
      "risk_score": 0-100,
      "opportunity_score": 0-100,
      "negotiation_power": "weak | medium | strong",
      "major_risks": ["string (max 50 chars)"],
      "advantages": ["string (max 50 chars)"],
      "specific_recommendations": ["string (max 60 chars)"]
    }
  },
  "probable_scenarios": [
    {
      "scenario": "string (max 30 chars)",
      "probability": 0-100,
      "consequences_party_a": ["string (max 40 chars)"],
      "consequences_party_b": ["string (max 40 chars)"],
      "global_impact": 0-10,
      "recommendations": ["string (max 50 chars)"]
    }
  ],
  "summary": {
    "global_risk_score": 0-100,
    "balance_score": 0-100,
    "clarity_score": 0-100,
    "key_points": ["string (max 60 chars)"],
    "strategic_advice": ["string (max 70 chars)"],
    "risk_timeline": {
      "immediate": ["string (max 40 chars)"],
      "short_term": ["string (max 40 chars)"],
      "long_term": ["string (max 40 chars)"]
    }
  }
}

ANALYSIS RULES:
1. Always analyze both parties in a balanced way
2. Focus on contract imbalance
3. Propose practical and negotiable solutions
4. Prioritize legal and financial risks
5. Consider OHADA legal context (Togolese law)

LIMITS:
- Max 15 risks, 10 obligations, 8 powers
- Max 5 critical clauses
- Max 3-4 scenarios
- Scores between 0 and 100 only

CONTRACT TO ANALYZE:
"${text.substring(0, 8000)}"

IMPORTANT: Return ONLY valid JSON, no additional text, no markdown, no comments.
JSON:`;
  }

  static getDetailedAnalysisPrompt(text: string): string {
    return `${this.getContractAnalysisPrompt(text)}

    DEEPENING REQUIRED:
    For each critical clause, explain:
    1. Why it's problematic (legal aspect)
    2. Practical consequence if applied
    3. Balanced alternative
    4. Negotiation strategy
    
    For each scenario:
    1. Trigger
    2. Event sequence
    3. Exit options
    4. Costs/benefits`;
  }

  static getChunkAnalysisPrompt(chunkText: string, chunkNumber: number, totalChunks: number): string {
    return `You are analyzing PART ${chunkNumber} of ${totalChunks} of a contract.
    
Focus on the specific sections in this chunk. Analyze any clauses, risks, obligations, or parties mentioned here.
    
Return analysis in the same JSON format as the main prompt, but only include elements found in this specific chunk.
    
CONTRACT CHUNK (PART ${chunkNumber}/${totalChunks}):
"${chunkText.substring(0, 6000)}"

Return ONLY JSON:`;
  }
}