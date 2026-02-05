// // src/lib/llm/promptBuilder.ts
// export class PromptBuilder {
//   static getContractAnalysisPrompt(
//     text: string,
//     languageCode: string = "en",
//   ): string {
//     // Obtenir les instructions de langue
//     const languageInstructions = this.getLanguageInstructions(languageCode);

//     return `You are a contract analysis expert with 20 years of experience. Analyze contracts with a strategic and balanced approach, identifying issues for EACH party.

// ${languageInstructions}

// ANALYZE THIS CONTRACT FOLLOWING THESE STEPS:

// 1. PARTY IDENTIFICATION:
//    - Name and role of each party
//    - Legal status
//    - Initial power dynamics

// 2. PARTY ANALYSIS (for each):
//    - Major risks with detailed explanations
//    - Advantages with concrete examples
//    - Weaknesses and vulnerabilities
//    - Risk/opportunity score with justification
//    - Negotiation power with reasoning

// 3. CRITICAL CLAUSES:
//    - Identify 5-10 most problematic clauses
//    - Explain WHY each clause is problematic
//    - Propose concrete and actionable solutions
//    - Evaluate legal impact with examples

// 4. PROBABLE SCENARIOS:
//    - Develop 3-4 realistic scenarios
//    - Probabilities with reasoning
//    - Detailed consequences for each party

// 5. STRATEGIC RECOMMENDATIONS:
//    - Negotiation priorities with justification
//    - Non-negotiable points with legal basis
//    - Possible concessions with trade-offs

// RESPONSE QUALITY REQUIREMENTS:
// - Be EXPLANATORY and COMPREHENSIVE, not just titles or abbreviated responses
// - Provide DETAILED descriptions with context and reasoning
// - Include CONCRETE EXAMPLES and practical implications
// - Explain the "WHY" behind each risk, recommendation, and analysis
// - Use COMPLETE SENTENCES and professional legal language
// - Avoid abbreviations and overly contracted responses
// - Each description should be informative and actionable

// RESPOND STRICTLY IN JSON WITH THIS STRUCTURE (ALL FIELD NAMES IN ENGLISH, VALUES IN DETECTED LANGUAGE):

// {
//   "identified_parties": {
//     "party_a": {
//       "name": "string",
//       "role": "string (detailed role description)",
//       "legal_status": "string (complete legal status)"
//     },
//     "party_b": {
//       "name": "string",
//       "role": "string (detailed role description)",
//       "legal_status": "string (complete legal status)"
//     }
//   },
//   "risks": [
//     {
//       "type": "string (e.g., 'penalty_clause', 'deadline', 'confidentiality', 'exclusivity', 'guarantee', 'liability', 'non_competition', 'intellectual_property', 'termination', 'force_majeure', 'imbalance', 'other')",
//       "description": "string (max 300 chars - BE DETAILED AND EXPLANATORY)",
//       "severity": "low | medium | high",
//       "clause": "string (e.g., 'Article 8.2' or 'Clause 3.4')",
//       "recommendation": "string (max 250 chars - PROVIDE ACTIONABLE ADVICE WITH REASONING)",
//       "impact": "financial | legal | operational | reputational | strategic",
//       "probability": 0-100,
//       "impact_magnitude": 0-10,
//       "priority": "low | medium | high",
//       "deadline": "immediate | short_term | medium_term | long_term"
//     }
//   ],
//   "obligations": [
//     {
//       "type": "string (optional but recommended)",
//       "description": "string (max 200 chars - BE SPECIFIC AND CLEAR)",
//       "party": "provider | client | both",
//       "deadline": "string (specific timeframe)",
//       "penalties": "string (detailed penalty description)",
//       "costs": "string (estimated costs if applicable)",
//       "associated_clause": "string (optional)"
//     }
//   ],
//   "powers": [
//     {
//       "type": "termination | modification | control | sanction | audit | general",
//       "description": "string (max 200 chars - EXPLAIN THE POWER AND ITS IMPLICATIONS)",
//       "holder": "provider | client | both",
//       "limitations": "string (detailed limitations)",
//       "potential_abuse": true | false,
//       "associated_clause": "string (optional)"
//     }
//   ],
//   "critical_clauses": [
//     {
//       "clause_number": "string",
//       "title": "string (descriptive title)",
//       "problem": "string (max 200 chars - EXPLAIN WHY IT'S PROBLEMATIC)",
//       "legal_impact": "string (max 200 chars - DETAILED LEGAL CONSEQUENCES)",
//       "proposed_solution": "string (max 250 chars - CONCRETE AND ACTIONABLE SOLUTION)",
//       "priority": "low | medium | high"
//     }
//   ],
//   "party_analysis": {
//     "party_a": {
//       "party_name": "string",
//       "risk_score": 0-100,
//       "opportunity_score": 0-100,
//       "negotiation_power": "weak | medium | strong",
//       "major_risks": ["string (max 100 chars - DETAILED RISK DESCRIPTION)"],
//       "advantages": ["string (max 100 chars - SPECIFIC ADVANTAGE WITH CONTEXT)"],
//       "specific_recommendations": ["string (max 120 chars - ACTIONABLE RECOMMENDATION)"]
//     },
//     "party_b": {
//       "party_name": "string",
//       "risk_score": 0-100,
//       "opportunity_score": 0-100,
//       "negotiation_power": "weak | medium | strong",
//       "major_risks": ["string (max 100 chars - DETAILED RISK DESCRIPTION)"],
//       "advantages": ["string (max 100 chars - SPECIFIC ADVANTAGE WITH CONTEXT)"],
//       "specific_recommendations": ["string (max 120 chars - ACTIONABLE RECOMMENDATION)"]
//     }
//   },
//   "probable_scenarios": [
//     {
//       "scenario": "string (max 60 chars - DESCRIPTIVE SCENARIO NAME)",
//       "probability": 0-100,
//       "consequences_party_a": ["string (max 80 chars - DETAILED CONSEQUENCE)"],
//       "consequences_party_b": ["string (max 80 chars - DETAILED CONSEQUENCE)"],
//       "global_impact": 0-10,
//       "recommendations": ["string (max 100 chars - SPECIFIC RECOMMENDATION)"]
//     }
//   ],
//   "summary": {
//     "global_risk_score": 0-100,
//     "balance_score": 0-100,
//     "clarity_score": 0-100,
//     "key_points": ["string (max 120 chars - COMPREHENSIVE KEY POINT)"],
//     "strategic_advice": ["string (max 150 chars - DETAILED STRATEGIC ADVICE)"],
//     "risk_timeline": {
//       "immediate": ["string (max 80 chars - SPECIFIC IMMEDIATE RISK)"],
//       "short_term": ["string (max 80 chars - SPECIFIC SHORT-TERM RISK)"],
//       "long_term": ["string (max 80 chars - SPECIFIC LONG-TERM RISK)"]
//     }
//   }
// }

// ANALYSIS RULES:
// 1. Always analyze both parties in a balanced way
// 2. Focus on contract imbalance and power dynamics
// 3. Propose practical, negotiable, and legally sound solutions
// 4. Prioritize legal and financial risks with clear explanations
// 5. Consider OHADA legal context (Togolese law) when applicable
// 6. Provide reasoning and justification for all assessments
// 7. Use professional legal terminology appropriate to the language

// LIMITS:
// - Max 15 risks, 10 obligations, 8 powers
// - Max 5 critical clauses
// - Max 3-4 scenarios
// - Scores between 0 and 100 only
// - All descriptions must be comprehensive and explanatory

// CONTRACT TO ANALYZE:
// "${text.substring(0, 8000)}"

// IMPORTANT: Return ONLY valid JSON, no additional text, no markdown, no comments.
// JSON:`;
//   }

//   /**
//    * Obtient les instructions de langue pour le LLM
//    */
//   private static getLanguageInstructions(languageCode: string): string {
//     const instructions: Record<string, string> = {
//       fr: `IMPORTANT: Vous DEVEZ répondre ENTIÈREMENT en FRANÇAIS.
// - Toutes les descriptions, recommandations et explications doivent être en français
// - Utilisez un langage professionnel et juridique français
// - Les noms de champs JSON restent en anglais, mais les VALEURS sont en français
// - Soyez explicatif et détaillé, pas seulement des titres ou réponses contractées`,

//       en: `IMPORTANT: You MUST respond ENTIRELY in ENGLISH.
// - All descriptions, recommendations and explanations must be in English
// - Use professional and legal English language
// - JSON field names remain in English, and VALUES are also in English
// - Be explanatory and detailed, not just titles or abbreviated responses`,

//       es: `IMPORTANTE: Debe responder COMPLETAMENTE en ESPAÑOL.
// - Todas las descripciones, recomendaciones y explicaciones deben estar en español
// - Utilice un lenguaje profesional y jurídico en español
// - Los nombres de campos JSON permanecen en inglés, pero los VALORES están en español
// - Sea explicativo y detallado, no solo títulos o respuestas abreviadas`,
//     };

//     return instructions[languageCode] || instructions["en"];
//   }

//   static getDetailedAnalysisPrompt(text: string): string {
//     return `${this.getContractAnalysisPrompt(text)}

//     DEEPENING REQUIRED:
//     For each critical clause, explain:
//     1. Why it's problematic (legal aspect)
//     2. Practical consequence if applied
//     3. Balanced alternative
//     4. Negotiation strategy

//     For each scenario:
//     1. Trigger
//     2. Event sequence
//     3. Exit options
//     4. Costs/benefits`;
//   }

//   static getChunkAnalysisPrompt(
//     chunkText: string,
//     chunkNumber: number,
//     totalChunks: number,
//   ): string {
//     return `You are analyzing PART ${chunkNumber} of ${totalChunks} of a contract.

// Focus on the specific sections in this chunk. Analyze any clauses, risks, obligations, or parties mentioned here.

// Return analysis in the same JSON format as the main prompt, but only include elements found in this specific chunk.

// CONTRACT CHUNK (PART ${chunkNumber}/${totalChunks}):
// "${chunkText.substring(0, 6000)}"

// Return ONLY JSON:`;
//   }
// }

// src/lib/llm/promptBuilder.ts
export class PromptBuilder {
  static getContractAnalysisPrompt(
    text: string,
    languageCode: string = "en",
  ): string {
    const languageInstructions = this.getLanguageInstructions(languageCode);

    return `You are a specialized legal AI assistant. Your task is to analyze the provided contract text and extract key risk information.
    
${languageInstructions}

ANALYSIS OBJECTIVES:
1. Identify the parties and their roles.
2. Identify major risks, assigning them a severity (high/medium/low) and a probability (high/medium/low).
3. Identify critical clauses that require attention.
4. Assess the balance of power between parties.
5. Develop 3 realistic probable scenarios based on the contract terms.

IMPORTANT: Do NOT perform complex mathematical calculations yourself. Provide qualitative assessments (High, Medium, Low) and concise explanations. The system will calculate scores based on your qualitative inputs.

RESPOND STRICTLY IN JSON FORMAT WITH THE FOLLOWING STRUCTURE:

{
  "identified_parties": {
    "party_a": { "name": "string", "role": "string", "legal_status": "string" },
    "party_b": { "name": "string", "role": "string", "legal_status": "string" }
  },
  "risks": [
    {
      "type": "string (e.g., 'liability', 'termination', 'confidentiality', 'payment')",
      "description": "string (max 200 chars)",
      "severity": "high | medium | low",
      "probability": "high | medium | low",
      "impact": "financial | legal | operational | reputational",
      "clause": "string (reference)",
      "recommendation": "string (actionable advice)",
      "priority": "high | medium | low",
      "deadline": "immediate | short_term | medium_term"
    }
  ],
  "obligations": [
    {
      "description": "string",
      "party": "party_a | party_b | both",
      "deadline": "string",
      "consequences": "string"
    }
  ],
  "critical_clauses": [
    {
      "clause_number": "string",
      "title": "string",
      "problem": "string",
      "proposed_solution": "string",
      "priority": "high | medium | low"
    }
  ],
  "probable_scenarios": [
    {
      "scenario": "string (description of a likely scenario)",
      "probability": "high | medium | low",
      "consequences_party_a": ["string"],
      "consequences_party_b": ["string"]
    }
  ],
  "party_analysis": {
    "party_a": {
      "party_name": "string",
      "party_role": "string (e.g., 'Provider', 'Client')",
      "risk_profile": "high | medium | low",
      "opportunity_level": "high | medium | low",
      "negotiation_power": "strong | medium | weak",
      "major_risks": ["string"],
      "advantages": ["string"]
    },
    "party_b": {
      "party_name": "string",
      "party_role": "string",
      "risk_profile": "high | medium | low",
      "opportunity_level": "high | medium | low",
      "negotiation_power": "strong | medium | weak",
      "major_risks": ["string"],
      "advantages": ["string"]
    }
  },
  "summary": {
    "key_points": ["string"],
    "strategic_advice": ["string"],
    "risk_timeline": {
      "immediate": ["string"],
      "short_term": ["string"],
      "long_term": ["string"]
    }
  }
}

RULES:
- Be concise but accurate.
- Use the detected language for values.
- JSON keys must remain in English.
- Do not output markdown code blocks (backticks), just raw JSON.

CONTRACT TEXT TO ANALYZE:
"${text.substring(0, 12000)}"
`;
  }
  /**
   * Obtient les instructions de langue pour le LLM
   */
  private static getLanguageInstructions(languageCode: string): string {
    const instructions: Record<string, string> = {
      fr: `IMPORTANT: Vous DEVEZ répondre ENTIÈREMENT en FRANÇAIS.
- Toutes les descriptions, recommandations et explications doivent être en français
- Utilisez un langage professionnel et juridique français
- Les noms de champs JSON restent en anglais, mais les VALEURS sont en français
- Soyez explicatif et détaillé, pas seulement des titres ou réponses contractées`,

      en: `IMPORTANT: You MUST respond ENTIRELY in ENGLISH.
- All descriptions, recommendations and explanations must be in English
- Use professional and legal English language
- JSON field names remain in English, and VALUES are also in English
- Be explanatory and detailed, not just titles or abbreviated responses`,

      es: `IMPORTANTE: Debe responder COMPLETAMENTE en ESPAÑOL.
- Todas las descripciones, recomendaciones y explicaciones deben estar en español
- Utilice un lenguaje profesional y jurídico en español
- Los nombres de campos JSON permanecen en inglés, pero los VALORES están en español
- Sea explicativo y detallado, no solo títulos o respuestas abreviadas`,
    };

    return instructions[languageCode] || instructions["en"];
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

  static getChunkAnalysisPrompt(
    chunkText: string,
    chunkNumber: number,
    totalChunks: number,
  ): string {
    return `You are analyzing PART ${chunkNumber} of ${totalChunks} of a contract.
    
Focus on the specific sections in this chunk. Analyze any clauses, risks, obligations, or parties mentioned here.
    
Return analysis in the same JSON format as the main prompt, but only include elements found in this specific chunk.
    
CONTRACT CHUNK (PART ${chunkNumber}/${totalChunks}):
"${chunkText.substring(0, 6000)}"

Return ONLY JSON:`;
  }
  // ... keep existing getLanguageInstructions method ...
}
