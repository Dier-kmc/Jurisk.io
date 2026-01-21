// src/lib/services/analysisService.ts - Version OpenRouter Llama 3.3 70B avec chunking
import { prisma } from '@/lib/db/client'
import { DocumentExtractor } from '@/lib/pdf/extractText'
import { ContractAnalysis, PromptBuilder } from '@/lib/llm/promptBuilder'
import { ResponseParser } from '@/lib/llm/responseParser'
import fetch from 'node-fetch'

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

// Parser JSON défensif
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

// Merge des résultats partiels
function mergeAnalyses(partials: (ContractAnalysis | null)[]): ContractAnalysis {
  const merged: ContractAnalysis = {
    risques: [],
    obligations: [],
    pouvoirs: [],
    summary: {
      score_risque: 0,
      score_clarte: 0,
      points_cles: [],
      conseils: [],
      duree_contrat: '',
      renouvellement: ''
    }
  }

  for (const p of partials) {
    if (!p) continue
    merged.risques.push(...(p.risques || []))
    merged.obligations.push(...(p.obligations || []))
    merged.pouvoirs.push(...(p.pouvoirs || []))
    merged.summary.points_cles.push(...(p.summary?.points_cles || []))
    merged.summary.conseils.push(...(p.summary?.conseils || []))
    if (!merged.summary.duree_contrat) merged.summary.duree_contrat = p.summary?.duree_contrat || ''
    if (!merged.summary.renouvellement) merged.summary.renouvellement = p.summary?.renouvellement || ''
  }

  // Limiter max 15 éléments par catégorie
  merged.risques = merged.risques.slice(0, 15)
  merged.obligations = merged.obligations.slice(0, 15)
  merged.pouvoirs = merged.pouvoirs.slice(0, 15)

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
    analysisData.summary.score_risque = ResponseParser.calculateOverallRiskScore(analysisData)

    const processingTime = Math.round((Date.now() - startTime) / 1000)

    // Stringify pour la DB
    const risksString = JSON.stringify(analysisData.risques)
    const obligationsString = JSON.stringify(analysisData.obligations)
    const powersString = JSON.stringify(analysisData.pouvoirs)
    const summaryString = JSON.stringify(analysisData.summary)

    // Sauvegarder
    const analysis = await prisma.analysis.create({
      data: {
        contractId,
        userId: contract.userId,
        risks: risksString,
        obligations: obligationsString,
        powers: powersString,
        summary: summaryString,
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
        data: { status: 'FAILED' }
      })
    } catch (dbError) {
      console.error('Erreur mise à jour statut:', dbError)
    }
    return null
  }
}


