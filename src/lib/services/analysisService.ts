// src/lib/services/analysisService.ts - Version OpenRouter Llama 3.3 70B avec chunking
import { prisma } from '@/lib/db/client'
import { DocumentExtractor } from '@/lib/pdf/extractText'
import { ResponseParser } from '@/lib/llm/responseParser'
import fetch from 'node-fetch'
import { ContractAnalysis, Summary, Risk, PartyAnalysis } from '@/types/contract'
import { PromptBuilder } from '../llm/promptBuilder'

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY
const MODEL = process.env.OLLAMA_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
const CHUNK_SIZE = 6000 // caractères par chunk
const MAX_TOKENS = 8192

interface OpenRouterChoice {
  message: { role: string; content: string }
}

interface OpenRouterResponse {
  id: string
  object: string
  created: number
  model: string
  choices: OpenRouterChoice[]
}

// Appel OpenRouter défensif
async function callOpenRouter(prompt: string, maxTokens = MAX_TOKENS): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 240000) // 4 min

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful legal assistant for contract analysis.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens
      }),
      signal: controller.signal
    })

    const data = (await response.json()) as OpenRouterResponse
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('OpenRouter response format invalid')
    }

    return data.choices[0].message.content
  } finally {
    clearTimeout(timeout)
  }
}

// Parser JSON défensif amélioré
function safeParseJSON(raw: string): ContractAnalysis | null {
  try {
    // Essayer d'extraire juste le JSON
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback: essayer de parser directement
    return JSON.parse(raw)
  } catch (error) {
    console.error('Erreur parsing JSON:', error)
    console.log('Raw text (500 premiers caractères):', raw.substring(0, 500))
    
    // Tenter de corriger les problèmes courants
    try {
      const cleaned = raw
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/gi, '')
        .replace(/^.*?\{/s, '{')
        .replace(/\}.*?$/s, '}')
        .trim()
      
      return JSON.parse(cleaned)
    } catch {
      return null
    }
  }
}

// Split texte en chunks
function chunkText(text: string, size = CHUNK_SIZE): string[] {
  const chunks: string[] = []
  let index = 0
  while (index < text.length) {
    chunks.push(text.substring(index, index + size))
    index += size
  }
  return chunks
}

// Merge des résultats partiels - CORRIGÉ pour utiliser les noms anglais
function mergeAnalyses(partials: (ContractAnalysis | null)[]): ContractAnalysis {
  const merged: ContractAnalysis = {
    id: '',
    contractId: '',
    userId: '',
    createdAt: new Date().toISOString(),
    modelUsed: MODEL,
    processingTime: 0,
    tokenCount: 0,
    risks: [],
    obligations: [],
    powers: [],
    critical_clauses: [],
    probable_scenarios: [],
    summary: {
      global_risk_score: 0,
      balance_score: 0,
      clarity_score: 0,
      key_points: [],
      strategic_advice: [],
      risk_timeline: {
        immediate: [],
        short_term: [],
        long_term: []
      }
    },
    identified_parties: {
      party_a: { name: 'Party A', role: '', legal_status: '' },
      party_b: { name: 'Party B', role: '', legal_status: '' }
    },
    party_analysis: {
      party_a: {
        party_name: 'Party A',
        risk_score: 0,
        opportunity_score: 0,
        negotiation_power: 'medium',
        major_risks: [],
        advantages: [],
        specific_recommendations: []
      },
      party_b: {
        party_name: 'Party B',
        risk_score: 0,
        opportunity_score: 0,
        negotiation_power: 'medium',
        major_risks: [],
        advantages: [],
        specific_recommendations: []
      }
    }
  }

  for (const partial of partials) {
    if (!partial) continue
    
    // Fusionner les arrays
    if (partial.risks) merged.risks.push(...partial.risks)
    if (partial.obligations) merged.obligations.push(...partial.obligations)
    if (partial.powers) merged.powers.push(...partial.powers)
    if (partial.critical_clauses) merged.critical_clauses.push(...partial.critical_clauses)
    if (partial.probable_scenarios) merged.probable_scenarios.push(...partial.probable_scenarios)
    
    // Fusionner le summary
    if (partial.summary) {
      if (partial.summary.key_points) merged.summary.key_points.push(...partial.summary.key_points)
      if (partial.summary.strategic_advice) merged.summary.strategic_advice.push(...partial.summary.strategic_advice)
      if (partial.summary.global_risk_score > 0) merged.summary.global_risk_score = partial.summary.global_risk_score
    }
    
    // Fusionner les parties identifiées (garder la dernière non-vide)
    if (partial.identified_parties) {
      if (partial.identified_parties.party_a?.name && partial.identified_parties.party_a.name !== 'Party A') {
        merged.identified_parties.party_a = partial.identified_parties.party_a
      }
      if (partial.identified_parties.party_b?.name && partial.identified_parties.party_b.name !== 'Party B') {
        merged.identified_parties.party_b = partial.identified_parties.party_b
      }
    }
    
    // Fusionner l'analyse par partie
    if (partial.party_analysis) {
      if (partial.party_analysis.party_a) {
        if (partial.party_analysis.party_a.party_name !== 'Party A') {
          merged.party_analysis.party_a = partial.party_analysis.party_a
        }
      }
      if (partial.party_analysis.party_b) {
        if (partial.party_analysis.party_b.party_name !== 'Party B') {
          merged.party_analysis.party_b = partial.party_analysis.party_b
        }
      }
    }
  }

  // Limiter max 15 éléments par catégorie
  merged.risks = merged.risks.slice(0, 15)
  merged.obligations = merged.obligations.slice(0, 15)
  merged.powers = merged.powers.slice(0, 15)
  merged.critical_clauses = merged.critical_clauses.slice(0, 15)
  merged.probable_scenarios = merged.probable_scenarios.slice(0, 10)

  // Limiter les listes du summary
  merged.summary.key_points = merged.summary.key_points.slice(0, 10)
  merged.summary.strategic_advice = merged.summary.strategic_advice.slice(0, 10)

  return merged
}

export async function analyzeContract(contractId: string, fileBuffer: Buffer, mimeType: string) {
  const startTime = Date.now()

  try {
    console.log(`=== Début de l'analyse pour le contrat: ${contractId} ===`)
    const contract = await prisma.contract.findUnique({ where: { id: contractId } })
    if (!contract) throw new Error('Contrat non trouvé')
    console.log(`User ID du contrat: ${contract.userId}`)

    // Extraire texte
    const text = await DocumentExtractor.extractText(fileBuffer, mimeType)
    console.log(`Texte extrait: ${text.length} caractères`)

    // Split en chunks
    const chunks = chunkText(text)
    const partials: (ContractAnalysis | null)[] = []

    for (const chunk of chunks) {
      const prompt = PromptBuilder.getContractAnalysisPrompt(chunk)
      console.log(`Appel OpenRouter sur chunk (${chunk.length} caractères)`)
      const llmResponse = await callOpenRouter(prompt)
      const parsed = safeParseJSON(llmResponse)
      if (!parsed) console.warn('Chunk non parsé correctement')
      partials.push(parsed)
    }

    // Merge partiels
    const analysisData = mergeAnalyses(partials)
    
    // Calculer le score de risque global si ResponseParser existe
    try {
      if (ResponseParser && typeof ResponseParser.calculateOverallRiskScore === 'function') {
        analysisData.summary.global_risk_score = ResponseParser.calculateOverallRiskScore(analysisData)
      } else {
        // Fallback: calculer un score basique
        const highRisks = analysisData.risks.filter(r => r.severity === 'high').length
        const mediumRisks = analysisData.risks.filter(r => r.severity === 'medium').length
        const totalRisks = analysisData.risks.length
        
        if (totalRisks > 0) {
          // Pondération: high=80, medium=50, low=20
          const lowRisks = analysisData.risks.filter(r => r.severity === 'low').length
          const weightedScore = (highRisks * 80 + mediumRisks * 50 + lowRisks * 20) / totalRisks
          analysisData.summary.global_risk_score = Math.round(weightedScore)
        } else {
          analysisData.summary.global_risk_score = 50 // Valeur par défaut
        }
      }
    } catch (error) {
      console.error('Erreur calcul score risque:', error)
      analysisData.summary.global_risk_score = 50
    }

    const processingTime = Math.round((Date.now() - startTime) / 1000)

    // Stringify pour la DB - utiliser les noms ANGLAIS pour correspondre au schéma
    const risksString = JSON.stringify(analysisData.risks)
    const obligationsString = JSON.stringify(analysisData.obligations)
    const powersString = JSON.stringify(analysisData.powers)
    const summaryString = JSON.stringify({
      global_risk_score: analysisData.summary.global_risk_score,
      balance_score: 0, // À calculer si nécessaire
      clarity_score: 0, // À calculer si nécessaire
      key_points: analysisData.summary.key_points,
      strategic_advice: analysisData.summary.strategic_advice,
      risk_timeline: analysisData.summary.risk_timeline
    })
    
    // Ajouter les champs manquants pour la compatibilité
    const identifiedPartiesString = JSON.stringify(analysisData.identified_parties)
    const criticalClausesString = JSON.stringify(analysisData.critical_clauses)
    const partyAnalysisString = JSON.stringify(analysisData.party_analysis)
    const probableScenariosString = JSON.stringify(analysisData.probable_scenarios)

    // Sauvegarder avec TOUS les champs
    const analysis = await prisma.analysis.create({
      data: {
        contractId,
        userId: contract.userId,
        risks: risksString,
        obligations: obligationsString,
        powers: powersString,
        summary: summaryString,
        identified_parties: identifiedPartiesString,
        critical_clauses: criticalClausesString,
        party_analysis: partyAnalysisString,
        probable_scenarios: probableScenariosString,
        modelUsed: MODEL,
        processingTime,
        tokenCount: DocumentExtractor.estimateTokenCount(text),
        createdAt: new Date()
      }
    })

    // Mettre à jour le contrat
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: 'COMPLETED' }
    })

    console.log(`=== Analyse terminée pour ${contractId} en ${processingTime}s ===`)
    return analysis
  } catch (error) {
    console.error(`=== ERREUR lors de l'analyse du contrat ${contractId}:`, error)
    try {
      await prisma.contract.update({
        where: { id: contractId },
        data: { 
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Erreur inconnue'
        }
      })
    } catch (dbError) {
      console.error('Erreur mise à jour statut:', dbError)
    }
    return null
  }
}