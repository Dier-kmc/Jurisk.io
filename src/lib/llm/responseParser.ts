// src/lib/llm/responseParser.ts
import { 
  ContractAnalysis, 
  Risk, 
  Obligation, 
  Power, 
  Clause, 
  PartyAnalysis, 
  Summary,
  Scenario,
  Party
} from '@/types/contract';

export class ResponseParser {
  // Parse LLM response into ContractAnalysis
  static parseAnalysisResponse(llmResponse: string): ContractAnalysis {
    try {
      // Extract JSON from response
      const jsonMatch = llmResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const jsonString = jsonMatch[0]
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Clean control characters
        .replace(/\s+/g, ' ')
        .trim();
      
      const parsed = JSON.parse(jsonString);
      
      // Normalize and validate
      return {
        id: '', // Will be set later
        contractId: '',
        userId: '',
        createdAt: new Date().toISOString(),
        modelUsed: 'llm-analysis',
        processingTime: 0,
        tokenCount: 0,
        identified_parties: this.normalizeIdentifiedParties(parsed.identified_parties),
        risks: this.normalizeRisks(parsed.risks || []),
        obligations: this.normalizeObligations(parsed.obligations || []),
        powers: this.normalizePowers(parsed.powers || []),
        critical_clauses: this.normalizeCriticalClauses(parsed.critical_clauses || []),
        party_analysis: this.normalizePartyAnalysis(parsed.party_analysis),
        probable_scenarios: this.normalizeScenarios(parsed.probable_scenarios || []),
        summary: this.normalizeSummary(parsed.summary || {})
      };
      
    } catch (error) {
      console.error('LLM parsing error:', error, 'Response:', llmResponse.substring(0, 500));
      return this.getFallbackAnalysis();
    }
  }

  // Calculate overall risk score
  static calculateOverallRiskScore(analysis: ContractAnalysis): number {
    if (!analysis.risks || analysis.risks.length === 0) {
      return 50; // Default value
    }
    
    let totalScore = 0;
    let count = 0;
    
    analysis.risks.forEach(risk => {
      // Base score based on severity
      let baseScore = 20; // low
      if (risk.severity === 'high') baseScore = 80;
      else if (risk.severity === 'medium') baseScore = 50;
      
      // Adjust by probability if available
      let adjustedScore = baseScore;
      if (risk.probability) {
        adjustedScore = (baseScore * risk.probability) / 100;
      }
      
      // Adjust by impact magnitude if available
      if (risk.impact_magnitude) {
        adjustedScore = (adjustedScore * risk.impact_magnitude) / 10;
      }
      
      totalScore += adjustedScore;
      count++;
    });
    
    return Math.min(100, Math.max(0, Math.round(totalScore / count)));
  }

  // Calculate balance score
  static calculateBalanceScore(analysis: ContractAnalysis): number {
    if (!analysis.party_analysis) return 50;
    
    const partyA = analysis.party_analysis.party_a;
    const partyB = analysis.party_analysis.party_b;
    
    // Calculate difference in negotiation power
    const powerMap = { weak: 0, medium: 50, strong: 100 };
    const powerA = powerMap[partyA.negotiation_power] || 50;
    const powerB = powerMap[partyB.negotiation_power] || 50;
    
    // Calculate difference in risk scores
    const riskDiff = Math.abs(partyA.risk_score - partyB.risk_score);
    
    // Balance formula: 100 - (power difference + risk difference)/2
    const powerDiff = Math.abs(powerA - powerB);
    const imbalance = (powerDiff + riskDiff) / 2;
    
    return Math.max(0, Math.min(100, Math.round(100 - imbalance)));
  }

  // Calculate clarity score based on contract structure
  static calculateClarityScore(analysis: ContractAnalysis): number {
    let score = 70; // Base score
    
    // Penalize for missing information
    if (!analysis.identified_parties?.party_a?.name || analysis.identified_parties.party_a.name === 'Partie A') {
      score -= 10;
    }
    if (!analysis.identified_parties?.party_b?.name || analysis.identified_parties.party_b.name === 'Partie B') {
      score -= 10;
    }
    
    // Bonus for detailed analysis
    if (analysis.risks && analysis.risks.length > 5) score += 5;
    if (analysis.critical_clauses && analysis.critical_clauses.length > 0) score += 10;
    if (analysis.summary?.key_points && analysis.summary.key_points.length > 3) score += 5;
    
    return Math.max(10, Math.min(100, score));
  }

  // Merge multiple analyses from chunks
  static mergeChunkAnalyses(chunkAnalyses: ContractAnalysis[]): ContractAnalysis {
    if (chunkAnalyses.length === 0) return this.getFallbackAnalysis();
    if (chunkAnalyses.length === 1) return chunkAnalyses[0];
    
    const merged: ContractAnalysis = {
      id: chunkAnalyses[0].id || '',
      contractId: chunkAnalyses[0].contractId || '',
      userId: chunkAnalyses[0].userId || '',
      createdAt: new Date().toISOString(),
      modelUsed: chunkAnalyses[0].modelUsed || 'merged',
      processingTime: chunkAnalyses.reduce((sum, a) => sum + (a.processingTime || 0), 0),
      tokenCount: chunkAnalyses.reduce((sum, a) => sum + (a.tokenCount || 0), 0),
      identified_parties: this.mergeIdentifiedParties(chunkAnalyses.map(a => a.identified_parties)),
      risks: this.mergeArrays(chunkAnalyses.map(a => a.risks || [])),
      obligations: this.mergeArrays(chunkAnalyses.map(a => a.obligations || [])),
      powers: this.mergeArrays(chunkAnalyses.map(a => a.powers || [])),
      critical_clauses: this.mergeArrays(chunkAnalyses.map(a => a.critical_clauses || [])),
      party_analysis: this.mergePartyAnalyses(chunkAnalyses.map(a => a.party_analysis)),
      probable_scenarios: this.mergeArrays(chunkAnalyses.map(a => a.probable_scenarios || [])),
      summary: this.mergeSummaries(chunkAnalyses.map(a => a.summary))
    };
    
    // Remove duplicates based on description/clause
    merged.risks = this.removeDuplicateRisks(merged.risks);
    merged.obligations = this.removeDuplicateObligations(merged.obligations);
    merged.critical_clauses = this.removeDuplicateClauses(merged.critical_clauses);
    
    return merged;
  }

  // Private normalization methods
  private static normalizeIdentifiedParties(parties: any): { party_a: Party; party_b: Party } {
    return {
      party_a: {
        name: parties?.party_a?.name || 'Party A',
        role: parties?.party_a?.role || 'To be determined',
        legal_status: parties?.party_a?.legal_status || 'Not specified'
      },
      party_b: {
        name: parties?.party_b?.name || 'Party B',
        role: parties?.party_b?.role || 'To be determined',
        legal_status: parties?.party_b?.legal_status || 'Not specified'
      }
    };
  }

  private static normalizeRisks(risks: any[]): Risk[] {
    return risks.slice(0, 15).map(risk => ({
      type: this.normalizeString(risk.type, 'other'),
      description: this.truncate(risk.description, 150),
      severity: this.normalizeSeverity(risk.severity),
      clause: this.truncate(risk.clause, 100),
      recommendation: this.truncate(risk.recommendation, 100),
      impact: this.normalizeString(risk.impact, 'legal'),
      probability: this.clampNumber(risk.probability, 0, 100),
      impact_magnitude: this.clampNumber(risk.impact_magnitude, 0, 10),
      priority: this.normalizePriority(risk.priority),
      deadline: this.normalizeString(risk.deadline, 'medium_term')
    }));
  }

  private static normalizeObligations(obligations: any[]): Obligation[] {
    return obligations.slice(0, 10).map(obligation => ({
      type: obligation.type,
      description: this.truncate(obligation.description, 120),
      party: this.normalizeParty(obligation.party),
      deadline: obligation.deadline || 'Not specified',
      penalties: obligation.penalties || 'Not specified',
      costs: obligation.costs || 'Not specified',
      associated_clause: obligation.associated_clause
    }));
  }

  private static normalizePowers(powers: any[]): Power[] {
    return powers.slice(0, 8).map(power => ({
      type: this.normalizePowerType(power.type),
      description: this.truncate(power.description, 100),
      holder: this.normalizeParty(power.holder),
      limitations: power.limitations || 'Not specified',
      potential_abuse: Boolean(power.potential_abuse),
      associated_clause: power.associated_clause
    }));
  }

  private static normalizeCriticalClauses(clauses: any[]): Clause[] {
    return clauses.slice(0, 5).map(clause => ({
      clause_number: clause.clause_number || 'N/A',
      title: this.truncate(clause.title, 60),
      problem: this.truncate(clause.problem, 80),
      legal_impact: clause.legal_impact || 'To be evaluated',
      proposed_solution: this.truncate(clause.proposed_solution, 100),
      priority: this.normalizePriority(clause.priority)
    }));
  }

  private static normalizePartyAnalysis(analysis: any): PartyAnalysis {
    return {
      party_a: this.normalizeSinglePartyAnalysis(analysis?.party_a, 'Party A'),
      party_b: this.normalizeSinglePartyAnalysis(analysis?.party_b, 'Party B')
    };
  }

  private static normalizeSinglePartyAnalysis(party: any, defaultName: string) {
    return {
      party_name: party?.party_name || defaultName,
      risk_score: this.clampNumber(party?.risk_score, 0, 100),
      opportunity_score: this.clampNumber(party?.opportunity_score, 0, 100),
      negotiation_power: this.normalizeNegotiationPower(party?.negotiation_power),
      major_risks: this.truncateArray(party?.major_risks || [], 50, 5),
      advantages: this.truncateArray(party?.advantages || [], 50, 5),
      specific_recommendations: this.truncateArray(party?.specific_recommendations || [], 60, 5)
    };
  }

  private static normalizeScenarios(scenarios: any[]): Scenario[] {
    return scenarios.slice(0, 4).map(scenario => ({
      scenario: this.truncate(scenario.scenario, 30),
      probability: this.clampNumber(scenario.probability, 0, 100),
      consequences_party_a: this.truncateArray(scenario.consequences_party_a || [], 40, 3),
      consequences_party_b: this.truncateArray(scenario.consequences_party_b || [], 40, 3),
      global_impact: this.clampNumber(scenario.global_impact, 0, 10),
      recommendations: this.truncateArray(scenario.recommendations || [], 50, 3)
    }));
  }

  private static normalizeSummary(summary: any): Summary {
    return {
      global_risk_score: this.clampNumber(summary.global_risk_score, 0, 100),
      balance_score: this.clampNumber(summary.balance_score, 0, 100),
      clarity_score: this.clampNumber(summary.clarity_score, 0, 100),
      key_points: this.truncateArray(summary.key_points || [], 60, 5),
      strategic_advice: this.truncateArray(summary.strategic_advice || [], 70, 5),
      risk_timeline: {
        immediate: this.truncateArray(summary.risk_timeline?.immediate || [], 40, 3),
        short_term: this.truncateArray(summary.risk_timeline?.short_term || [], 40, 3),
        long_term: this.truncateArray(summary.risk_timeline?.long_term || [], 40, 3)
      }
    };
  }

  // Helper methods
  private static truncate(text: string, maxLength: number): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  private static truncateArray(arr: string[], maxLength: number, maxItems: number): string[] {
    return arr.slice(0, maxItems).map(item => this.truncate(String(item), maxLength));
  }

  private static clampNumber(value: any, min: number, max: number): number {
    const num = Number(value);
    return isNaN(num) ? Math.round((min + max) / 2) : Math.max(min, Math.min(max, Math.round(num)));
  }

  private static normalizeString(value: any, defaultValue: string): string {
    return value ? String(value) : defaultValue;
  }

  private static normalizeSeverity(severity: any): 'low' | 'medium' | 'high' {
    const severityStr = String(severity).toLowerCase();
    if (severityStr === 'high' || severityStr === 'elevee') return 'high';
    if (severityStr === 'medium' || severityStr === 'moyenne') return 'medium';
    return 'low';
  }

  private static normalizePriority(priority: any): 'low' | 'medium' | 'high' {
    const priorityStr = String(priority).toLowerCase();
    if (priorityStr === 'high' || priorityStr === 'haute') return 'high';
    if (priorityStr === 'medium' || priorityStr === 'moyenne') return 'medium';
    return 'low';
  }

  private static normalizeParty(party: any): 'provider' | 'client' | 'both' {
    const partyStr = String(party).toLowerCase();
    if (partyStr === 'provider' || partyStr === 'prestataire') return 'provider';
    if (partyStr === 'client') return 'client';
    return 'both';
  }

  private static normalizePowerType(type: any): Power['type'] {
    const validTypes: Power['type'][] = ['termination', 'modification', 'control', 'sanction', 'audit', 'general'];
    const typeStr = String(type).toLowerCase();
    return validTypes.includes(typeStr as any) ? typeStr as Power['type'] : 'general';
  }

  private static normalizeNegotiationPower(power: any): 'weak' | 'medium' | 'strong' {
    const powerStr = String(power).toLowerCase();
    if (powerStr === 'strong' || powerStr === 'fort') return 'strong';
    if (powerStr === 'medium' || powerStr === 'moyen') return 'medium';
    return 'weak';
  }

  // Merging helpers
  private static mergeIdentifiedParties(partiesArray: any[]) {
    // Take the first non-default party names
    const result = { party_a: { name: 'Party A', role: '', legal_status: '' }, party_b: { name: 'Party B', role: '', legal_status: '' } };
    
    for (const parties of partiesArray) {
      if (parties?.party_a?.name && parties.party_a.name !== 'Party A') {
        result.party_a = parties.party_a;
      }
      if (parties?.party_b?.name && parties.party_b.name !== 'Party B') {
        result.party_b = parties.party_b;
      }
    }
    
    return result;
  }

  private static mergeArrays<T>(arrays: T[][]): T[] {
    const merged: T[] = [];
    for (const arr of arrays) {
      merged.push(...arr);
    }
    return merged;
  }

  private static mergePartyAnalyses(analyses: PartyAnalysis[]): PartyAnalysis {
    if (analyses.length === 0) {
      return {
        party_a: this.normalizeSinglePartyAnalysis({}, 'Party A'),
        party_b: this.normalizeSinglePartyAnalysis({}, 'Party B')
      };
    }
    
    // Average scores from all analyses
    const partyA = {
      party_name: analyses[0].party_a.party_name || 'Party A',
      risk_score: Math.round(analyses.reduce((sum, a) => sum + a.party_a.risk_score, 0) / analyses.length),
      opportunity_score: Math.round(analyses.reduce((sum, a) => sum + a.party_a.opportunity_score, 0) / analyses.length),
      negotiation_power: this.determineDominantPower(analyses.map(a => a.party_a.negotiation_power)),
      major_risks: this.mergeUniqueStrings(analyses.map(a => a.party_a.major_risks)),
      advantages: this.mergeUniqueStrings(analyses.map(a => a.party_a.advantages)),
      specific_recommendations: this.mergeUniqueStrings(analyses.map(a => a.party_a.specific_recommendations))
    };
    
    const partyB = {
      party_name: analyses[0].party_b.party_name || 'Party B',
      risk_score: Math.round(analyses.reduce((sum, a) => sum + a.party_b.risk_score, 0) / analyses.length),
      opportunity_score: Math.round(analyses.reduce((sum, a) => sum + a.party_b.opportunity_score, 0) / analyses.length),
      negotiation_power: this.determineDominantPower(analyses.map(a => a.party_b.negotiation_power)),
      major_risks: this.mergeUniqueStrings(analyses.map(a => a.party_b.major_risks)),
      advantages: this.mergeUniqueStrings(analyses.map(a => a.party_b.advantages)),
      specific_recommendations: this.mergeUniqueStrings(analyses.map(a => a.party_b.specific_recommendations))
    };
    
    return { party_a: partyA, party_b: partyB };
  }

  private static mergeSummaries(summaries: Summary[]): Summary {
    if (summaries.length === 0) return this.normalizeSummary({});
    
    return {
      global_risk_score: Math.round(summaries.reduce((sum, s) => sum + s.global_risk_score, 0) / summaries.length),
      balance_score: Math.round(summaries.reduce((sum, s) => sum + s.balance_score, 0) / summaries.length),
      clarity_score: Math.round(summaries.reduce((sum, s) => sum + s.clarity_score, 0) / summaries.length),
      key_points: this.mergeUniqueStrings(summaries.map(s => s.key_points)),
      strategic_advice: this.mergeUniqueStrings(summaries.map(s => s.strategic_advice)),
      risk_timeline: {
        immediate: this.mergeUniqueStrings(summaries.map(s => s.risk_timeline?.immediate || [])),
        short_term: this.mergeUniqueStrings(summaries.map(s => s.risk_timeline?.short_term || [])),
        long_term: this.mergeUniqueStrings(summaries.map(s => s.risk_timeline?.long_term || []))
      }
    };
  }

  private static mergeUniqueStrings(arrays: string[][]): string[] {
    const seen = new Set<string>();
    const result: string[] = [];
    
    for (const arr of arrays) {
      for (const item of arr) {
        const normalized = item.trim();
        if (normalized && !seen.has(normalized)) {
          seen.add(normalized);
          result.push(normalized);
        }
      }
    }
    
    return result.slice(0, 10); // Limit to 10 items
  }

  private static determineDominantPower(powers: ('weak' | 'medium' | 'strong')[]): 'weak' | 'medium' | 'strong' {
    const counts = { weak: 0, medium: 0, strong: 0 };
    for (const power of powers) {
      counts[power]++;
    }
    
    if (counts.strong > counts.medium && counts.strong > counts.weak) return 'strong';
    if (counts.medium > counts.weak) return 'medium';
    return 'weak';
  }

  private static removeDuplicateRisks(risks: Risk[]): Risk[] {
    const seen = new Set<string>();
    return risks.filter(risk => {
      const key = `${risk.type}-${risk.clause}-${risk.description.substring(0, 50)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private static removeDuplicateObligations(obligations: Obligation[]): Obligation[] {
    const seen = new Set<string>();
    return obligations.filter(obligation => {
      const key = `${obligation.description.substring(0, 50)}-${obligation.party}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private static removeDuplicateClauses(clauses: Clause[]): Clause[] {
    const seen = new Set<string>();
    return clauses.filter(clause => {
      const key = `${clause.clause_number}-${clause.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private static getFallbackAnalysis(): ContractAnalysis {
    return {
      id: '',
      contractId: '',
      userId: '',
      createdAt: new Date().toISOString(),
      modelUsed: 'fallback',
      processingTime: 0,
      tokenCount: 0,
      identified_parties: {
        party_a: { name: 'Party A', role: 'To identify', legal_status: 'Not specified' },
        party_b: { name: 'Party B', role: 'To identify', legal_status: 'Not specified' }
      },
      risks: [],
      obligations: [],
      powers: [],
      critical_clauses: [],
      party_analysis: {
        party_a: {
          party_name: 'Party A',
          risk_score: 50,
          opportunity_score: 50,
          negotiation_power: 'medium',
          major_risks: ['Analysis error'],
          advantages: ['To determine'],
          specific_recommendations: ['Retry analysis']
        },
        party_b: {
          party_name: 'Party B',
          risk_score: 50,
          opportunity_score: 50,
          negotiation_power: 'medium',
          major_risks: ['Analysis error'],
          advantages: ['To determine'],
          specific_recommendations: ['Retry analysis']
        }
      },
      probable_scenarios: [],
      summary: {
        global_risk_score: 50,
        balance_score: 50,
        clarity_score: 50,
        key_points: ['Problem during analysis. Please try again.'],
        strategic_advice: ['Check document format and try again.'],
        risk_timeline: {
          immediate: ['Re-analyze document'],
          short_term: [],
          long_term: []
        }
      }
    };
  }
}