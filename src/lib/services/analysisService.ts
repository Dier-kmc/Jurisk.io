// src/lib/services/analysisService.ts - Version OpenRouter Llama 3.3 70B avec chunking
import { prisma } from "@/lib/db/client";
import { DocumentExtractor } from "@/lib/pdf/extractText";
import { ResponseParser } from "@/lib/llm/responseParser";
import fetch from "node-fetch";
import {
  ContractAnalysis,
  Summary,
  Risk,
  PartyAnalysis,
} from "@/types/contract";
import { PromptBuilder } from "../llm/promptBuilder";
import { LanguageDetector } from "../analysis/languageDetector";
import { RiskCalculator } from "../analysis/riskCalculator";

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;
const MODELS = [
  process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-405b-instruct:free",
];
const CHUNK_SIZE = 6000; // caractères par chunk
const MAX_TOKENS = 8192;

interface OpenRouterChoice {
  message: { role: string; content: string };
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenRouterChoice[];
}

// Appel OpenRouter défensif
async function callOpenRouter(
  prompt: string,
  model: string,
  maxTokens = MAX_TOKENS,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 240000); // 4 min

  try {
    console.log("OpenRouter → modèle utilisé :", model)
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content:
                "You are a helpful legal assistant for contract analysis.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      },
    );
    // Vérifier le statut HTTP
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter HTTP Error ${response.status}:`, errorText);
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText.substring(0, 200)}`,
      );
    }

    const data = (await response.json()) as any;

    

    // Logger la réponse pour debug
    console.log("OpenRouter response structure:", {
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasError: !!data.error,
      errorMessage: data.error?.message,
    });

    // Vérifier s'il y a une erreur dans la réponse
    if (data.error) {
      console.error("OpenRouter returned error:", data.error);
      throw new Error(
        `OpenRouter error: ${data.error.message || JSON.stringify(data.error)}`,
      );
    }

    // Vérifier le format de la réponse
    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error(
        "Invalid OpenRouter response format:",
        JSON.stringify(data).substring(0, 500),
      );
      throw new Error(
        `OpenRouter response format invalid. Response: ${JSON.stringify(data).substring(0, 200)}`,
      );
    }

    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenRouterWithFallback(
  prompt: string,
  maxTokens = MAX_TOKENS,
): Promise<{ content: string; modelUsed: string }> {
  let lastError: unknown = null;

  for (const model of MODELS) {
    try {
      console.log(`Tentative OpenRouter avec modèle: ${model}`);
      const content = await callOpenRouter(prompt, model, maxTokens);
      return { content, modelUsed: model };
    } catch (err) {
      console.warn(`Échec du modèle ${model}`);
      lastError = err;
    }
  }

  throw lastError ?? new Error("Tous les modèles OpenRouter ont échoué");
}


function safeParseJSON(raw: string): ContractAnalysis | null {
  try {
    // 1. Nettoyer d'abord les retours à la ligne problématiques
    let cleaned = raw.trim();
    
    // 2. Extraire le JSON du texte (il pourrait y avoir du texte avant/après)
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found");
    }
    
    let jsonStr = jsonMatch[0];
    
    // 3. Réparer les problèmes JSON courants
    jsonStr = jsonStr
      // Supprimer les virgules traînantes
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      // Supprimer les propriétés sans valeur
      .replace(/"[^"]+"\s*:\s*,/g, '')
      // Remplacer les valeurs vides par null
      .replace(/:\s*,/g, ': null,')
      // Nettoyer les retours à la ligne dans les strings
      .replace(/\\n/g, ' ')
      .replace(/\n/g, ' ')
      // Supprimer les échappements inutiles
      .replace(/\\"/g, '"')
      // Réparer les doubles échappements
      .replace(/\\\\/g, '\\');

    // 4. Parser avec validation
    const parsed = JSON.parse(jsonStr);
    
    // 5. Valider la structure de base
    if (typeof parsed !== 'object' || parsed === null) {
      throw new Error("Parsed result is not an object");
    }
    
    // 6. Log pour debug
    console.log("JSON parsé avec succès, structure:", {
      hasRisks: !!parsed.risks,
      hasSummary: !!parsed.summary,
      keys: Object.keys(parsed).slice(0, 5)
    });
    
    // 7. Normaliser la structure pour correspondre à ContractAnalysis
    return normalizeToContractAnalysis(parsed);
    
  } catch (error) {
    console.error("Erreur parsing JSON:", error);
    console.log("Raw text (300 premiers caractères):", raw.substring(0, 300));
    console.log("Raw text (derniers 300 caractères):", raw.substring(Math.max(0, raw.length - 300)));
    
    // Tenter une réparation plus agressive
    try {
      return attemptJSONRepair(raw);
    } catch (secondError) {
      console.error("Échec de la réparation JSON:", secondError);
      return null;
    }
  }
}

function attemptJSONRepair(raw: string): ContractAnalysis | null {
  try {
    // Extraire tout ce qui ressemble à du JSON
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    
    if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) {
      return null;
    }
    
    let jsonStr = raw.substring(jsonStart, jsonEnd + 1);
    
    // Nettoyage agressif
    jsonStr = jsonStr
      .replace(/,\s*([}\]])/g, '$1') // Virgules traînantes
      .replace(/([{,])\s*([}\]])/g, '$1') // Propriétés vides
      .replace(/"\s*:\s*,/g, '": null,') // Valeurs vides
      .replace(/:\s*([}\]])/g, ': null$1') // Valeurs manquantes avant fin
      .replace(/[^\x20-\x7E\n\r]/g, '') // Caractères non-ASCII
      .trim();
    
    // Ajouter des guillemets manquants
    jsonStr = jsonStr.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');
    
    const parsed = JSON.parse(jsonStr);
    return normalizeToContractAnalysis(parsed);
  } catch {
    return null;
  }
}

// Normaliser la structure du LLM vers ContractAnalysis
function normalizeToContractAnalysis(llmData: any): ContractAnalysis {
  // Le prompt builder demande une structure complexe, mais nous avons besoin
  // de la structure simple de ContractAnalysis
  
  return {
    id: "",
    contractId: "",
    userId: "",
    createdAt: new Date().toISOString(),
    modelUsed: "",
    processingTime: 0,
    tokenCount: 0,
    
    // Extraire les données selon la structure du LLM
    identified_parties: {
      party_a: {
        name: llmData.identified_parties?.party_a?.name || "Party A",
        role: llmData.identified_parties?.party_a?.role || "",
        legal_status: llmData.identified_parties?.party_a?.legal_status || ""
      },
      party_b: {
        name: llmData.identified_parties?.party_b?.name || "Party B",
        role: llmData.identified_parties?.party_b?.role || "",
        legal_status: llmData.identified_parties?.party_b?.legal_status || ""
      }
    },
    
    risks: Array.isArray(llmData.risks) ? llmData.risks : 
           Array.isArray(llmData.detailed_risks) ? llmData.detailed_risks.map((r: any) => ({
             type: r.type || "other",
             description: r.description || "",
             severity: (r.severity || r.severity_analysis?.level || "medium").toLowerCase().includes("high") ? "high" : 
                      (r.severity || r.severity_analysis?.level || "medium").toLowerCase().includes("medium") ? "medium" : "low",
             clause: r.clause || "",
             recommendation: r.mitigation_strategy?.immediate_actions?.[0] || "",
             impact: r.impact_assessment?.composite_impact_score ? "financial" : "legal",
             probability: r.probability_assessment?.value || 50,
             impact_magnitude: r.impact_assessment?.composite_impact_score || 5,
             priority: r.priority_assessment?.level || "medium",
             deadline: r.priority_assessment?.urgency || "medium_term"
           })) : [],
    
    obligations: Array.isArray(llmData.obligations) ? llmData.obligations : [],
    powers: Array.isArray(llmData.powers) ? llmData.powers : [],
    critical_clauses: Array.isArray(llmData.critical_clauses) ? llmData.critical_clauses : [],
    
    party_analysis: {
      party_a: {
        party_name: llmData.party_analysis?.party_a?.party_name || "Party A",
        risk_score: llmData.party_analysis?.party_a?.risk_score || 
                   llmData.party_comparative_analysis?.party_a?.risk_portfolio?.total_risk_exposure || 50,
        opportunity_score: llmData.party_analysis?.party_a?.opportunity_score || 
                         llmData.party_comparative_analysis?.party_a?.opportunity_portfolio?.total_opportunity_score || 50,
        negotiation_power: (llmData.party_analysis?.party_a?.negotiation_power || 
                          llmData.party_comparative_analysis?.party_a?.negotiation_analysis?.power_index > 70 ? "strong" : 
                          llmData.party_comparative_analysis?.party_a?.negotiation_analysis?.power_index > 30 ? "medium" : "weak") as "weak" | "medium" | "strong",
        major_risks: llmData.party_analysis?.party_a?.major_risks || [],
        advantages: llmData.party_analysis?.party_a?.advantages || [],
        specific_recommendations: llmData.party_analysis?.party_a?.specific_recommendations || []
      },
      party_b: {
        party_name: llmData.party_analysis?.party_b?.party_name || "Party B",
        risk_score: llmData.party_analysis?.party_b?.risk_score || 
                   llmData.party_comparative_analysis?.party_b?.risk_portfolio?.total_risk_exposure || 50,
        opportunity_score: llmData.party_analysis?.party_b?.opportunity_score || 
                         llmData.party_comparative_analysis?.party_b?.opportunity_portfolio?.total_opportunity_score || 50,
        negotiation_power: (llmData.party_analysis?.party_b?.negotiation_power || 
                          llmData.party_comparative_analysis?.party_b?.negotiation_analysis?.power_index > 70 ? "strong" : 
                          llmData.party_comparative_analysis?.party_b?.negotiation_analysis?.power_index > 30 ? "medium" : "weak") as "weak" | "medium" | "strong",
        major_risks: llmData.party_analysis?.party_b?.major_risks || [],
        advantages: llmData.party_analysis?.party_b?.advantages || [],
        specific_recommendations: llmData.party_analysis?.party_b?.specific_recommendations || []
      }
    },
    
    probable_scenarios: Array.isArray(llmData.probable_scenarios) ? llmData.probable_scenarios : 
                       Array.isArray(llmData.scenario_analysis) ? llmData.scenario_analysis.map((s: any) => ({
                         scenario: s.name || "",
                         probability: s.probability_calculation?.net_probability || 50,
                         consequences_party_a: s.consequence_analysis?.party_a_impact ? 
                                           [s.consequence_analysis.party_a_impact.financial, s.consequence_analysis.party_a_impact.operational].filter(Boolean) : [],
                         consequences_party_b: s.consequence_analysis?.party_b_impact ? 
                                           [s.consequence_analysis.party_b_impact.financial, s.consequence_analysis.party_b_impact.operational].filter(Boolean) : [],
                         global_impact: s.consequence_analysis?.asymmetry_analysis ? 7 : 5,
                         recommendations: s.prevention_strategy?.map((p: any) => p.action) || []
                       })) : [],
    
    summary: {
      global_risk_score: llmData.summary?.global_risk_score || 
                        llmData.executive_summary?.overall_risk_assessment?.global_risk_score || 50,
      balance_score: llmData.summary?.balance_score || 
                    llmData.executive_summary?.contract_health_indicator?.balance_score || 50,
      clarity_score: llmData.summary?.clarity_score || 
                    llmData.executive_summary?.contract_health_indicator?.clarity_score || 50,
      key_points: llmData.summary?.key_points || 
                 llmData.executive_summary?.strategic_recommendations?.map((r: any) => r.recommendation) || [],
      strategic_advice: llmData.summary?.strategic_advice || 
                       llmData.executive_summary?.strategic_recommendations?.map((r: any) => r.recommendation) || [],
      risk_timeline: {
        immediate: llmData.summary?.risk_timeline?.immediate || [],
        short_term: llmData.summary?.risk_timeline?.short_term || [],
        long_term: llmData.summary?.risk_timeline?.long_term || []
      }
    }
  };
}


// Split texte en chunks
function chunkText(text: string, size = CHUNK_SIZE): string[] {
  const chunks: string[] = [];
  let index = 0;
  while (index < text.length) {
    chunks.push(text.substring(index, index + size));
    index += size;
  }
  return chunks;
}

// Merge des résultats partiels - CORRIGÉ pour utiliser les noms anglais
function mergeAnalyses(
  partials: (ContractAnalysis | null)[],
): ContractAnalysis {
  const merged: ContractAnalysis = {
    id: "",
    contractId: "",
    userId: "",
    createdAt: new Date().toISOString(),
    modelUsed: "",
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
        long_term: [],
      },
    },
    identified_parties: {
      party_a: { name: "Party A", role: "", legal_status: "" },
      party_b: { name: "Party B", role: "", legal_status: "" },
    },
    party_analysis: {
      party_a: {
        party_name: "Party A",
        risk_score: 0,
        opportunity_score: 0,
        negotiation_power: "medium",
        major_risks: [],
        advantages: [],
        specific_recommendations: [],
      },
      party_b: {
        party_name: "Party B",
        risk_score: 0,
        opportunity_score: 0,
        negotiation_power: "medium",
        major_risks: [],
        advantages: [],
        specific_recommendations: [],
      },
    },
  };

  for (const partial of partials) {
    if (!partial) continue;

    // Fusionner les arrays
    if (partial.risks) merged.risks.push(...partial.risks);
    if (partial.obligations) merged.obligations.push(...partial.obligations);
    if (partial.powers) merged.powers.push(...partial.powers);
    if (partial.critical_clauses)
      merged.critical_clauses.push(...partial.critical_clauses);
    if (partial.probable_scenarios)
      merged.probable_scenarios.push(...partial.probable_scenarios);

    // Fusionner le summary
    if (partial.summary) {
      if (partial.summary.key_points)
        merged.summary.key_points.push(...partial.summary.key_points);
      if (partial.summary.strategic_advice)
        merged.summary.strategic_advice.push(
          ...partial.summary.strategic_advice,
        );
      if (partial.summary.global_risk_score > 0)
        merged.summary.global_risk_score = partial.summary.global_risk_score;
    }

    // Fusionner les parties identifiées (garder la dernière non-vide)
    if (partial.identified_parties) {
      if (
        partial.identified_parties.party_a?.name &&
        partial.identified_parties.party_a.name !== "Party A"
      ) {
        merged.identified_parties.party_a = partial.identified_parties.party_a;
      }
      if (
        partial.identified_parties.party_b?.name &&
        partial.identified_parties.party_b.name !== "Party B"
      ) {
        merged.identified_parties.party_b = partial.identified_parties.party_b;
      }
    }

    // Fusionner l'analyse par partie
    if (partial.party_analysis) {
      if (partial.party_analysis.party_a) {
        if (partial.party_analysis.party_a.party_name !== "Party A") {
          merged.party_analysis.party_a = partial.party_analysis.party_a;
        }
      }
      if (partial.party_analysis.party_b) {
        if (partial.party_analysis.party_b.party_name !== "Party B") {
          merged.party_analysis.party_b = partial.party_analysis.party_b;
        }
      }
    }
  }

  const usedModels = partials
  .filter((p): p is ContractAnalysis => !!p?.modelUsed)
  .map(p => p.modelUsed);

  merged.modelUsed = [...new Set(usedModels)].join(", ");


  // Limiter max 15 éléments par catégorie
  merged.risks = merged.risks.slice(0, 15);
  merged.obligations = merged.obligations.slice(0, 15);
  merged.powers = merged.powers.slice(0, 15);
  merged.critical_clauses = merged.critical_clauses.slice(0, 15);
  merged.probable_scenarios = merged.probable_scenarios.slice(0, 10);

  // Limiter les listes du summary
  merged.summary.key_points = merged.summary.key_points.slice(0, 10);
  merged.summary.strategic_advice = merged.summary.strategic_advice.slice(
    0,
    10,
  );

  return merged;
}

export async function analyzeContract(
  contractId: string,
  fileBuffer: Buffer,
  mimeType: string,
) {
  const startTime = Date.now();

  try {
    console.log(`=== Début de l'analyse pour le contrat: ${contractId} ===`);
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
    });
    if (!contract) throw new Error("Contrat non trouvé");
    console.log(`User ID du contrat: ${contract.userId}`);

    // Extraire texte
    const text = await DocumentExtractor.extractText(fileBuffer, mimeType);
    console.log(`Texte extrait: ${text.length} caractères`);

    // Détecter la langue du contrat
    const detectedLanguage = LanguageDetector.detectLanguage(text);
    const languageName = LanguageDetector.getLanguageName(detectedLanguage);
    console.log(`Langue détectée: ${languageName} (${detectedLanguage})`);

    // Split en chunks
    const chunks = chunkText(text);
    const partials: (ContractAnalysis | null)[] = [];

    for (const chunk of chunks) {
      const prompt = PromptBuilder.getContractAnalysisPrompt(
        chunk,
        detectedLanguage,
      );
      console.log(`Appel OpenRouter sur chunk (${chunk.length} caractères)`);
      const { content, modelUsed } = await callOpenRouterWithFallback(prompt);
      const parsed = safeParseJSON(content);
      if (parsed) {
        parsed.modelUsed = modelUsed;
      }
      if (!parsed) console.warn("Chunk non parsé correctement");
      partials.push(parsed);
    }

    // Merge partiels
    const analysisData = mergeAnalyses(partials);

    // Enrichir les risques avec les scores calculés
    console.log("Calcul des scores de risque individuels...");
    analysisData.risks = RiskCalculator.enrichRisksWithScores(
      analysisData.risks,
    );

    // Calculer les scores avec la nouvelle formule
    console.log("Calcul du score de risque global...");
    analysisData.summary.global_risk_score =
      RiskCalculator.calculateGlobalRiskScore(analysisData.risks);

    console.log("Calcul du score d'équilibre...");
    analysisData.summary.balance_score = RiskCalculator.calculateBalanceScore(
      analysisData.party_analysis,
    );

    console.log("Calcul du score de clarté...");
    analysisData.summary.clarity_score =
      RiskCalculator.calculateClarityScore(analysisData);

    console.log(
      `Scores calculés - Risque: ${analysisData.summary.global_risk_score}, Équilibre: ${analysisData.summary.balance_score}, Clarté: ${analysisData.summary.clarity_score}`,
    );

    const processingTime = Math.round((Date.now() - startTime) / 1000);

    // Stringify pour la DB - utiliser les noms ANGLAIS pour correspondre au schéma
    const risksString = JSON.stringify(analysisData.risks);
    const obligationsString = JSON.stringify(analysisData.obligations);
    const powersString = JSON.stringify(analysisData.powers);
    const summaryString = JSON.stringify({
      global_risk_score: analysisData.summary.global_risk_score,
      balance_score: analysisData.summary.balance_score,
      clarity_score: analysisData.summary.clarity_score,
      key_points: analysisData.summary.key_points,
      strategic_advice: analysisData.summary.strategic_advice,
      risk_timeline: analysisData.summary.risk_timeline,
    });

    // Ajouter les champs manquants pour la compatibilité
    const identifiedPartiesString = JSON.stringify(
      analysisData.identified_parties,
    );
    const criticalClausesString = JSON.stringify(analysisData.critical_clauses);
    const partyAnalysisString = JSON.stringify(analysisData.party_analysis);
    const probableScenariosString = JSON.stringify(
      analysisData.probable_scenarios,
    );

    // Sauvegarder avec TOUS les champs, incluant la langue détectée
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
        detectedLanguage: detectedLanguage,
        modelUsed: analysisData.modelUsed,
        processingTime,
        tokenCount: DocumentExtractor.estimateTokenCount(text),
        createdAt: new Date(),
      },
    });

    // Mettre à jour le contrat
    await prisma.contract.update({
      where: { id: contractId },
      data: { status: "COMPLETED" },
    });

    console.log(
      `=== Analyse terminée pour ${contractId} en ${processingTime}s ===`,
    );
    return analysis;
  } catch (error) {
    console.error(
      `=== ERREUR lors de l'analyse du contrat ${contractId}:`,
      error,
    );
    try {
      await prisma.contract.update({
        where: { id: contractId },
        data: {
          status: "FAILED",
          errorMessage:
            error instanceof Error ? error.message : "Erreur inconnue",
        },
      });
    } catch (dbError) {
      console.error("Erreur mise à jour statut:", dbError);
    }
    return null;
  }
}
