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

    return `You are a contract risk analysis expert with 20 years of experience in legal risk management. Analyze contracts with a strategic, mathematical approach using proven risk assessment methodologies.

${languageInstructions}

**IMPORTANTE : VOUS DEVEZ CALCULER LES RISQUES AVEC DES FORMULES CONCRÈTES**

ANALYZE THIS CONTRACT FOLLOWING THIS PRECISE METHODOLOGY:

1. PARTY IDENTIFICATION & INITIAL ASSESSMENT:
   - Identify each party with complete legal details
   - Assess initial power dynamics using a weighted scoring system

2. RISK CALCULATION FORMULA (for each identified risk):
   Use this formula: **Risk Score = (Probability × Impact) × Severity Factor**
   
   Where:
   - Probability: 0-100% (based on contractual, market, and historical factors)
   - Impact: Financial, operational, reputational (weighted average)
   - Severity Factor: Low=1.0, Medium=1.5, High=2.0
   
   Example calculation for a penalty clause:
   Probability of breach: 40% (based on delivery complexity)
   Impact magnitude: 7/10 (financial penalty of 20% contract value)
   Severity: High (Severity Factor = 2.0)
   Risk Score = (40 × 7) × 2.0 = 560 (normalized to 0-100 scale)

3. OPPORTUNITY CALCULATION:
   Use: **Opportunity Score = (Benefit × Probability of Success) × Strategic Value**
   
   Where:
   - Benefit: Financial, strategic, market position
   - Probability of Success: Based on capabilities and market conditions
   - Strategic Value: Long-term importance (1.0-2.0 multiplier)

4. PARTY-SPECIFIC ANALYSIS (for each party):
   - Calculate Risk Exposure = Σ(Risk Scores × Party Vulnerability Factor)
   - Calculate Opportunity Portfolio = Σ(Opportunity Scores)
   - Determine Negotiation Power Index based on:
     * Market position (0-10)
     * Alternative options (0-10) 
     * Contract dependency (0-10)
     * Legal resources (0-10)
   
   Negotiation Power = (Sum of factors / 40) × 100

5. CONTRACT BALANCE ASSESSMENT:
   Calculate Balance Score using:
   **Balance Score = 100 - |(Party A Power Index - Party B Power Index)| + |(Party A Risk Exposure - Party B Risk Exposure)| / 2**

6. CRITICAL CLAUSE RISK ASSESSMENT:
   For each critical clause, calculate:
   - Legal Risk Index = (Ambiguity Score + Enforcement Difficulty + Penalty Severity) / 3
   - Financial Impact = (Potential Loss × Probability)
   - Strategic Impact = Long-term consequences score

7. SCENARIO PROBABILITY CALCULATION:
   For each scenario, use Bayesian probability:
   P(Scenario) = P(Trigger) × P(Chain Reaction) × P(No Mitigation)
   
   Where each probability is based on:
   - Historical data (if available)
   - Market conditions
   - Party capabilities
   - Contractual safeguards

RESPONSE QUALITY REQUIREMENTS:
- Be EXPLICITLY EXPLANATORY and COMPREHENSIVE
- SHOW YOUR CALCULATIONS for key risks and scores
- Explain the "WHY" behind every number and assessment
- Provide CONTEXT for all probabilities and impacts
- Use COMPLETE, DETAILED sentences with practical examples
- AVOID abbreviations and overly technical jargon
- Make it understandable for non-experts while maintaining professional rigor

RESPOND STRICTLY IN JSON WITH THIS ENHANCED STRUCTURE:

{
  "analysis_methodology": {
    "risk_formula_applied": "Probability × Impact × Severity Factor",
    "opportunity_formula_applied": "Benefit × Probability of Success × Strategic Value",
    "negotiation_power_formula": "Market Position + Alternatives + Dependency + Legal Resources",
    "balance_formula": "100 - |Power A - Power B| + |Risk A - Risk B|/2"
  },
  "identified_parties": {
    "party_a": {
      "name": "string",
      "role": "string (detailed with specific responsibilities)",
      "legal_status": "string (with implications)",
      "initial_power_assessment": {
        "market_position": "0-10 with explanation",
        "alternative_options": "0-10 with details",
        "contract_dependency": "0-10 with reasoning",
        "legal_resources": "0-10 with justification",
        "calculated_power_index": 0-100
      }
    },
    "party_b": {
      "name": "string",
      "role": "string (detailed with specific responsibilities)", 
      "legal_status": "string (with implications)",
      "initial_power_assessment": {
        "market_position": "0-10 with explanation",
        "alternative_options": "0-10 with details",
        "contract_dependency": "0-10 with reasoning",
        "legal_resources": "0-10 with justification",
        "calculated_power_index": 0-100
      }
    }
  },
  "detailed_risks": [
    {
      "risk_id": "R001",
      "type": "string",
      "description": "string (300-500 chars - DETAILED explanation of the risk mechanism)",
      "clause": "string",
      "probability_assessment": {
        "value": 0-100,
        "calculation_basis": "string (detailed explanation of how probability was determined)",
        "factors_considered": ["string (specific factors like market conditions, party history, etc.)"],
        "confidence_level": "low | medium | high"
      },
      "impact_assessment": {
        "financial_impact": "string (estimated monetary impact with currency)",
        "operational_impact": "string (how operations would be affected)",
        "reputational_impact": "string (brand/image consequences)",
        "legal_impact": "string (legal consequences and liabilities)",
        "composite_impact_score": 0-10,
        "impact_calculation_explanation": "string (how composite score was determined)"
      },
      "severity_analysis": {
        "level": "low | medium | high",
        "severity_factor": 1.0 | 1.5 | 2.0,
        "justification": "string (why this severity level was assigned)"
      },
      "calculated_risk_score": {
        "raw_score": 0-1000,
        "normalized_score": 0-100,
        "calculation_formula": "string (actual formula used, e.g., (40 × 7) × 2.0 = 560 → normalized to 72)",
        "risk_category": "low (0-30) | medium (31-70) | high (71-100)"
      },
      "mitigation_strategy": {
        "immediate_actions": ["string (specific actions to take now)"],
        "contractual_mitigations": ["string (specific contract changes needed)"],
        "operational_mitigations": ["string (operational changes to reduce risk)"],
        "insurance_options": "string (if applicable)"
      },
      "priority_assessment": {
        "level": "low | medium | high | critical",
        "urgency": "immediate | 1-3 months | 3-6 months | 6+ months",
        "justification": "string (why this priority level was assigned)"
      }
    }
  ],
  "opportunities": [
    {
      "opportunity_id": "O001",
      "description": "string (detailed explanation of the opportunity)",
      "associated_clause": "string",
      "benefit_analysis": {
        "financial_benefit": "string (estimated value)",
        "strategic_benefit": "string (long-term advantages)",
        "competitive_advantage": "string (market positioning benefits)",
        "benefit_score": 0-10
      },
      "success_probability": {
        "value": 0-100,
        "dependencies": ["string (what needs to happen for success)"],
        "constraints": ["string (potential obstacles)"]
      },
      "strategic_value": {
        "value_multiplier": 1.0-2.0,
        "alignment_with_objectives": "string (how it aligns with party goals)",
        "long_term_significance": "string"
      },
      "calculated_opportunity_score": {
        "raw_score": 0-1000,
        "normalized_score": 0-100,
        "calculation": "string (show the math)"
      }
    }
  ],
  "party_comparative_analysis": {
    "party_a": {
      "party_name": "string",
      "risk_portfolio": {
        "total_risk_exposure": 0-100,
        "highest_risks": [
          {
            "risk_id": "string",
            "score": 0-100,
            "contribution_to_total": "string (percentage)"
          }
        ],
        "risk_concentration": "string (are risks diversified or concentrated?)"
      },
      "opportunity_portfolio": {
        "total_opportunity_score": 0-100,
        "best_opportunities": [
          {
            "opportunity_id": "string",
            "score": 0-100,
            "realization_timeline": "string"
          }
        ]
      },
      "negotiation_analysis": {
        "power_index": 0-100,
        "strengths": ["string (specific negotiation advantages)"],
        "weaknesses": ["string (specific negotiation disadvantages)"],
        "bargaining_chips": ["string (what can be offered/traded)"],
        "non_negotiable_items": ["string (with legal/business justification)"]
      }
    },
    "party_b": {
      // Same structure as party_a
    },
    "comparative_metrics": {
      "power_differential": "string (absolute difference in power indices)",
      "risk_differential": "string (difference in risk exposures)",
      "balance_assessment": {
        "balance_score": 0-100,
        "calculation": "string (show the math)",
        "interpretation": "string (what the score means practically)"
      }
    }
  },
  "critical_clauses": [
    {
      "clause_reference": "string",
      "clause_title": "string",
      "risk_breakdown": {
        "legal_risk_index": 0-100,
        "financial_risk_score": 0-100,
        "operational_risk_score": 0-100,
        "composite_risk_score": 0-100
      },
      "problem_diagnosis": {
        "core_issue": "string (200-300 chars)",
        "legal_vulnerabilities": ["string (specific legal weaknesses)"],
        "practical_consequences": ["string (what would happen in reality)"],
        "worst_case_scenario": "string (detailed description)"
      },
      "recommended_solutions": {
        "ideal_solution": "string (optimal contractual fix)",
        "practical_alternative": "string (realistic compromise)",
        "negotiation_strategy": "string (how to approach this in negotiations)",
        "fallback_position": "string (minimum acceptable change)"
      }
    }
  ],
  "scenario_analysis": [
    {
      "scenario_id": "S001",
      "name": "string (descriptive name)",
      "trigger_conditions": ["string (what would start this scenario)"],
      "probability_calculation": {
        "base_probability": 0-100,
        "escalation_factors": ["string (what could increase probability)"],
        "mitigation_factors": ["string (what could decrease probability)"],
        "net_probability": 0-100,
        "calculation_rationale": "string (explain the probability assessment)"
      },
      "consequence_analysis": {
        "party_a_impact": {
          "financial": "string",
          "operational": "string",
          "reputational": "string",
          "composite_impact_score": 0-10
        },
        "party_b_impact": {
          // same structure
        },
        "asymmetry_analysis": "string (which party suffers more and why)"
      },
      "prevention_strategy": [
        {
          "action": "string",
          "effectiveness": "estimated % reduction in probability",
          "implementation_cost": "string"
        }
      ]
    }
  ],
  "executive_summary": {
    "overall_risk_assessment": {
      "global_risk_score": 0-100,
      "calculation_methodology": "string (how the overall score was derived)",
      "key_risk_drivers": ["string (what contributes most to the risk score)"],
      "risk_trend": "decreasing | stable | increasing (with explanation)"
    },
    "contract_health_indicator": {
      "balance_score": 0-100,
      "clarity_score": 0-100,
      "enforceability_score": 0-100,
      "overall_health_rating": "poor | fair | good | excellent"
    },
    "strategic_recommendations": [
      {
        "recommendation": "string (150-200 chars detailed advice)",
        "rationale": "string (why this recommendation is made)",
        "expected_benefit": "string (what improvement to expect)",
        "implementation_priority": "immediate | short_term | medium_term | long_term"
      }
    ],
    "negotiation_roadmap": {
      "opening_position": "string (what to ask for first)",
      "key_concessions": ["string (what you can give up)"],
      "deal_breakers": ["string (what you cannot accept)"],
      "optimal_outcome": "string (best realistic result)"
    }
  }
}

ANALYSIS RULES:
1. FOR EVERY SCORE OR NUMBER, SHOW THE CALCULATION OR EXPLAIN THE METHODOLOGY
2. PROVIDE PRACTICAL, REAL-WORLD EXAMPLES FOR EACH ASSESSMENT
3. CONSIDER THE SPECIFIC BUSINESS CONTEXT AND INDUSTRY DYNAMICS
4. BALANCE LEGAL THEORY WITH COMMERCIAL PRACTICALITY
5. USE PLAIN LANGUAGE TO EXPLAIN COMPLEX CONCEPTS
6. BE EXPLICIT ABOUT ASSUMPTIONS AND LIMITATIONS

EXAMPLE CALCULATION FORMAT:
"probability_assessment": {
  "value": 40,
  "calculation_basis": "Based on: (1) Historical breach rate in similar contracts (25%), (2) Current market volatility adding 10%, (3) Specific performance challenges in clause 8.2 adding 5%",
  "factors_considered": ["Supplier's past delivery performance", "Market conditions for raw materials", "Technical complexity of requirements"],
  "confidence_level": "medium"
}

LIMITS:
- Maximum 10 detailed risks (but analyze all found risks)
- Maximum 5 opportunities
- Maximum 5 critical clauses
- Maximum 3 scenarios
- All calculations must be shown or explained
- No unexplained scores or ratings

CONTRACT TO ANALYZE:
"${text.substring(0, 8000)}"

IMPORTANT: Return ONLY valid JSON, no additional text, no markdown, no comments.
JSON:`;
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
