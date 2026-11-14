import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db/client";
import { AuthService } from "@/lib/auth/auth-service";
import { normalizeAnalysisContext } from "@/lib/analysis/analysisContext";
import { askCopilot } from "@/lib/analysis/negotiationService";
import type { SourceSegment } from "@/types/contractAnalysis";

function relevantSources(sources: SourceSegment[], question: string): SourceSegment[] {
  const terms = question.toLowerCase().split(/\W+/).filter((term) => term.length > 3);
  const scored = sources.map((source) => ({ source, score: terms.reduce((score, term) => score + (source.text.toLowerCase().includes(term) ? 1 : 0), 0) }));
  const matches = scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 8).map((item) => item.source);
  return matches.length ? matches : sources.slice(0, 8);
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await AuthService.getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  const { id } = await params;
  const analysis = await prisma.analysis.findFirst({ where: { id, userId: user.id }, select: { id: true } });
  if (!analysis) return NextResponse.json({ success: false, error: "Analyse non trouvée" }, { status: 404 });
  const messages = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    'SELECT "id", "analysisId", "userId", "role", "content", "citations", "createdAt" FROM "AnalysisMessage" WHERE "analysisId" = $1 AND "userId" = $2 ORDER BY "createdAt" ASC',
    id,
    user.id,
  );
  return NextResponse.json({ success: true, messages });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await AuthService.getCurrentUser();
    if (!user) return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    const { id } = await params;
    const body = await request.json() as { question?: string };
    const question = body.question?.trim();
    if (!question || question.length < 3 || question.length > 2000) return NextResponse.json({ success: false, error: "La question doit contenir entre 3 et 2 000 caractères" }, { status: 400 });
    const analysisRows = await prisma.$queryRawUnsafe<Array<{ id: string; analysisContext: string; sourceSegments: string }>>(
      'SELECT "id", "analysisContext", "sourceSegments" FROM "Analysis" WHERE "id" = $1 AND "userId" = $2 LIMIT 1',
      id,
      user.id,
    );
    const analysis = analysisRows[0];
    if (!analysis) return NextResponse.json({ success: false, error: "Analyse non trouvée" }, { status: 404 });
    const context = normalizeAnalysisContext(JSON.parse(analysis.analysisContext || "{}"));
    const sources = JSON.parse(analysis.sourceSegments || "[]") as SourceSegment[];
    const answer = await askCopilot(question, context, relevantSources(sources, question));
    const userMessageRows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      'INSERT INTO "AnalysisMessage" ("id", "analysisId", "userId", "role", "content", "citations") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "analysisId", "userId", "role", "content", "citations", "createdAt"',
      randomUUID(),
      id,
      user.id,
      "user",
      question,
      "[]",
    );
    const assistantMessageRows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      'INSERT INTO "AnalysisMessage" ("id", "analysisId", "userId", "role", "content", "citations") VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "analysisId", "userId", "role", "content", "citations", "createdAt"',
      randomUUID(),
      id,
      user.id,
      "assistant",
      answer.answer,
      JSON.stringify(answer.citations),
    );
    const userMessage = userMessageRows[0];
    const assistantMessage = assistantMessageRows[0];
    return NextResponse.json({ success: true, answer: assistantMessage, question: userMessage });
  } catch (error) {
    console.error("Copilot error:", error);
    return NextResponse.json({ success: false, error: "Impossible de répondre à cette question" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await AuthService.getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  const { id } = await params;
  const body = await request.json() as { messageId?: string; pinned?: boolean };
  if (!body.messageId || typeof body.pinned !== "boolean") return NextResponse.json({ success: false, error: "Paramètres invalides" }, { status: 400 });
  const result = await prisma.$executeRawUnsafe(
    'UPDATE "AnalysisMessage" SET "pinned" = $1 WHERE "id" = $2 AND "analysisId" = $3 AND "userId" = $4',
    body.pinned,
    body.messageId,
    id,
    user.id,
  );
  if (!result) return NextResponse.json({ success: false, error: "Message non trouvé" }, { status: 404 });
  return NextResponse.json({ success: true });
}
