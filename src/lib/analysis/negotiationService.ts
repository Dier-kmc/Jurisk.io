import fetch from "node-fetch";
import { PromptBuilder } from "@/lib/llm/promptBuilder";
import { LanguageDetector } from "@/lib/analysis/languageDetector";
import type {
  AnalysisContext,
  ContractInventory,
  NegotiationAnalysis,
  NegotiationFinding,
  SourceReference,
  SourceSegment,
} from "@/types/contractAnalysis";

const MODELS = [process.env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free", "meta-llama/llama-3.1-405b-instruct:free"];

function parseJson(raw: string): any {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse JSON absente");
  return JSON.parse(raw.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1"));
}

async function callModel(prompt: string): Promise<{ content: string; model: string }> {
  let lastError: unknown;
  for (const model of MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], max_tokens: 10000 }),
      });
      if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
      const data = await response.json() as any;
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Réponse LLM vide");
      return { content, model };
    } catch (error) { lastError = error; }
  }
  throw lastError instanceof Error ? lastError : new Error("Tous les modèles ont échoué");
}

function priority(value: unknown): NegotiationFinding["priority"] {
  const normalized = String(value || "important").toLowerCase();
  if (normalized.includes("urgent") || normalized.includes("high") || normalized.includes("élev")) return "urgent";
  if (normalized.includes("monitor") || normalized.includes("surve")) return "monitor";
  return "important";
}

function sourceReference(value: any, segments: Map<string, SourceSegment>): SourceReference | null {
  const source = segments.get(String(value?.segmentId || ""));
  if (!source || !value?.quote) return null;
  const quote = String(value.quote).trim();
  if (!source.text.toLocaleLowerCase().includes(quote.toLocaleLowerCase())) return null;
  return { segmentId: source.id, quote: quote.slice(0, 500), page: source.page, section: source.section };
}

function normalizeFinding(raw: any, segments: Map<string, SourceSegment>, index: number): NegotiationFinding | null {
  const sources = (Array.isArray(raw?.sources) ? raw.sources : []).map((source: any) => sourceReference(source, segments)).filter(Boolean) as SourceReference[];
  if (!sources.length) return null;
  return {
    id: String(raw.id || `finding-${index + 1}`),
    priority: priority(raw.priority),
    category: String(raw.category || "other"),
    title: String(raw.title || "Point à examiner").slice(0, 180),
    issue: String(raw.issue || "").slice(0, 1000),
    consequence: String(raw.consequence || "").slice(0, 1000),
    confidence: Math.max(0, Math.min(100, Number(raw.confidence) || 50)),
    sources,
    recommendedPosition: String(raw.recommendedPosition || "À clarifier avec l'autre partie.").slice(0, 1000),
    negotiationWording: String(raw.negotiationWording || "Pouvez-vous préciser ce point dans le contrat ?").slice(0, 1000),
    question: String(raw.question || "Comment cette clause s'applique-t-elle concrètement ?").slice(0, 500),
  };
}

function mergeDrafts(drafts: any[], context: AnalysisContext, sourceSegments: SourceSegment[], models: string[]): NegotiationAnalysis {
  const sourceMap = new Map(sourceSegments.map((source) => [source.id, source]));
  const findings = new Map<string, NegotiationFinding>();
  const obligations = new Map<string, ContractInventory["obligations"][number]>();
  const parties = new Map<string, { name: string; role: string }>();
  const missingClauses = new Set<string>();
  const openQuestions = new Set<string>();
  for (const draft of drafts) {
    for (const party of Array.isArray(draft?.parties) ? draft.parties : []) if (party?.name) parties.set(String(party.name), { name: String(party.name), role: String(party.role || "") });
    for (const missing of Array.isArray(draft?.missingClauses) ? draft.missingClauses : []) if (missing) missingClauses.add(String(missing));
    for (const question of Array.isArray(draft?.openQuestions) ? draft.openQuestions : []) if (question) openQuestions.add(String(question));
    for (const raw of Array.isArray(draft?.findings) ? draft.findings : []) {
      const finding = normalizeFinding(raw, sourceMap, findings.size);
      if (!finding) continue;
      const key = `${finding.category}:${finding.title.toLowerCase()}`;
      if (!findings.has(key) || finding.confidence > findings.get(key)!.confidence) findings.set(key, finding);
      openQuestions.add(finding.question);
    }
    for (const raw of Array.isArray(draft?.obligations) ? draft.obligations : []) {
      if (!raw?.action) continue;
      const source = sourceReference(raw.source, sourceMap);
      obligations.set(`${raw.party}:${raw.action}`, { id: String(raw.id || `obligation-${obligations.size + 1}`), party: String(raw.party || "non précisée"), action: String(raw.action), deadline: String(raw.deadline || "Non précisé"), cost: String(raw.cost || "Non précisé"), consequence: String(raw.consequence || "Non précisée"), source: source || undefined });
    }
  }
  const orderedFindings = [...findings.values()].sort((a, b) => ({ urgent: 0, important: 1, monitor: 2 }[a.priority] - { urgent: 0, important: 1, monitor: 2 }[b.priority] || b.confidence - a.confidence)).slice(0, 30);
  const topPriorities = orderedFindings.slice(0, 5).map((finding) => finding.id);
  return { context, inventory: { parties: [...parties.values()], contractType: context.contractType, missingClauses: [...missingClauses].slice(0, 15), obligations: [...obligations.values()].slice(0, 30), findings: orderedFindings }, findings: orderedFindings, topPriorities, openQuestions: [...openQuestions].slice(0, 20), confidence: orderedFindings.length ? Math.round(orderedFindings.reduce((sum, finding) => sum + finding.confidence, 0) / orderedFindings.length) : 0, sourceSegments, };
}

export async function runNegotiationAnalysis(context: AnalysisContext, sourceSegments: SourceSegment[], fullText: string): Promise<{ analysis: NegotiationAnalysis; models: string[] }> {
  const language = LanguageDetector.detectLanguage(fullText);
  const batches: SourceSegment[][] = [];
  let batch: SourceSegment[] = [];
  let size = 0;
  for (const segment of sourceSegments) {
    if (batch.length && size + segment.text.length > 14000) { batches.push(batch); batch = []; size = 0; }
    batch.push(segment); size += segment.text.length;
  }
  if (batch.length) batches.push(batch);
  const drafts: any[] = [];
  const models: string[] = [];
  for (const sourceBatch of batches) {
    const result = await callModel(PromptBuilder.getNegotiationAnalysisPrompt(context, sourceBatch, language));
    models.push(result.model);
    drafts.push(parseJson(result.content));
  }
  return { analysis: mergeDrafts(drafts, context, sourceSegments, models), models };
}

export function priorityToLegacy(value: NegotiationFinding["priority"]): "low" | "medium" | "high" {
  return value === "urgent" ? "high" : value === "important" ? "medium" : "low";
}

export async function askCopilot(question: string, context: AnalysisContext, sources: SourceSegment[]) {
  const language = LanguageDetector.detectLanguage(sources.map((source) => source.text).join("\n"));
  const result = await callModel(PromptBuilder.getCopilotPrompt(question, context, sources));
  const parsed = parseJson(result.content);
  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  const citations = (Array.isArray(parsed.citations) ? parsed.citations : []).map((citation: any) => sourceReference(citation, sourceMap)).filter(Boolean) as SourceReference[];
  return { answer: String(parsed.answer || "L'information n'a pas été trouvée dans le contrat."), citations, confidence: Math.max(0, Math.min(100, Number(parsed.confidence) || 50)), model: result.model, language };
}
