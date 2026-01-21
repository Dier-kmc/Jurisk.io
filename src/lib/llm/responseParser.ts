import { ContractAnalysis, Risk, Obligation, Power, Summary } from './promptBuilder'

export class ResponseParser {
  static parseAnalysisResponse(llmResponse: string): ContractAnalysis {
    try {
      // Nettoyer la réponse
      const cleaned = llmResponse
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .replace(/^.*?\{/s, '{')
        .replace(/\}.*?$/s, '}')
        .trim()

      // Essayer d'extraire le JSON
      let jsonString = cleaned
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonString = jsonMatch[0]
      }

      const parsed = JSON.parse(jsonString)

      // Valider et normaliser la structure
      return {
        risques: this.normalizeRisks(parsed.risques || []),
        obligations: this.normalizeObligations(parsed.obligations || []),
        pouvoirs: this.normalizePowers(parsed.pouvoirs || []),
        summary: this.normalizeSummary(parsed.summary || {})
      }
    } catch (error) {
      console.error('Failed to parse LLM response:', error)
      console.log('Raw response:', llmResponse.substring(0, 500))
      
      // Fallback à une structure vide avec message d'erreur
      return {
        risques: [],
        obligations: [],
        pouvoirs: [],
        summary: {
          score_risque: 50,
          score_clarte: 50,
          points_cles: ["Erreur lors de l'analyse. Veuillez réessayer."],
          conseils: ["Vérifiez que le document est lisible et en français/anglais."],
          duree_contrat: "Non déterminée",
          renouvellement: "Non spécifié"
        }
      }
    }
  }

  private static normalizeRisks(risks: any[]): Risk[] {
    return risks.slice(0, 15).map(risk => ({
      type: this.normalizeRiskType(risk.type),
      description: risk.description?.toString() || 'Non spécifié',
      gravite: this.normalizeSeverity(risk.gravite),
      clause: risk.clause?.toString() || 'Non spécifié',
      recommandation: risk.recommandation?.toString() || 'À définir',
      impact: this.normalizeImpact(risk.impact)
    }))
  }

  private static normalizeObligations(obligations: any[]): Obligation[] {
    return obligations.slice(0, 15).map(obligation => ({
      partie: this.normalizeParty(obligation.partie),
      description: obligation.description?.toString() || 'Non spécifié',
      delai: obligation.delai?.toString() || 'Non spécifié',
      penalites: obligation.penalites?.toString() || 'Non spécifié',
      couts: obligation.couts?.toString() || 'Non spécifié'
    }))
  }

  private static normalizePowers(powers: any[]): Power[] {
    return powers.slice(0, 15).map(power => ({
      type: this.normalizePowerType(power.type),
      detenteur: this.normalizeParty(power.detenteur),
      description: power.description?.toString() || 'Non spécifié',
      limitations: power.limitations?.toString() || 'Non spécifié',
      abus_potentiel: Boolean(power.abus_potentiel)
    }))
  }

  private static normalizeSummary(summary: any): Summary {
    return {
      score_risque: this.clampNumber(summary.score_risque, 0, 100),
      score_clarte: this.clampNumber(summary.score_clarte, 0, 100),
      points_cles: Array.isArray(summary.points_cles) 
        ? summary.points_cles.slice(0, 5).map(String)
        : ['Analyse en cours'],
      conseils: Array.isArray(summary.conseils)
        ? summary.conseils.slice(0, 5).map(String)
        : ['Consultez un juriste pour validation'],
      duree_contrat: summary.duree_contrat?.toString() || 'Non spécifiée',
      renouvellement: summary.renouvellement?.toString() || 'Non spécifié'
    }
  }

  private static normalizeRiskType(type: any): Risk['type'] {
    const validTypes: Risk['type'][] = ['clause_penale', 'delai', 'confidentialite', 'exclusivite', 'garantie', 'responsabilite', 'autre']
    const typeStr = String(type).toLowerCase()
    return validTypes.includes(typeStr as any) ? typeStr as Risk['type'] : 'autre'
  }

  private static normalizeSeverity(severity: any): Risk['gravite'] {
    const validSeverities: Risk['gravite'][] = ['faible', 'moyenne', 'elevee']
    const severityStr = String(severity).toLowerCase()
    return validSeverities.includes(severityStr as any) ? severityStr as Risk['gravite'] : 'moyenne'
  }

  private static normalizeImpact(impact: any): Risk['impact'] {
    const validImpacts: Risk['impact'][] = ['financier', 'legal', 'operationnel', 'reputation']
    const impactStr = String(impact).toLowerCase()
    return validImpacts.includes(impactStr as any) ? impactStr as Risk['impact'] : 'legal'
  }

  private static normalizeParty(party: any): Obligation['partie'] {
    const validParties: Obligation['partie'][] = ['prestataire', 'client', 'les_deux']
    const partyStr = String(party).toLowerCase()
    return validParties.includes(partyStr as any) ? partyStr as Obligation['partie'] : 'les_deux'
  }

  private static normalizePowerType(type: any): Power['type'] {
    const validTypes: Power['type'][] = ['resiliation', 'modification', 'controle', 'sanction', 'audit']
    const typeStr = String(type).toLowerCase()
    return validTypes.includes(typeStr as any) ? typeStr as Power['type'] : 'controle'
  }

  private static clampNumber(value: any, min: number, max: number): number {
    const num = Number(value)
    if (isNaN(num)) return Math.round((min + max) / 2)
    return Math.min(max, Math.max(min, Math.round(num)))
  }

  static calculateOverallRiskScore(analysis: ContractAnalysis): number {
    if (analysis.risques.length === 0) return 0

    const severityWeights = {
      elevee: 3,
      moyenne: 2,
      faible: 1
    }

    const weightedSum = analysis.risques.reduce((sum, risk) => {
      return sum + (severityWeights[risk.gravite] || 1)
    }, 0)

    const maxPossibleScore = analysis.risques.length * 3
    return Math.min(Math.round((weightedSum / maxPossibleScore) * 100), 100)
  }
}