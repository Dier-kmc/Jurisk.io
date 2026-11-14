import { z } from "zod";
import type { AnalysisContext } from "@/types/contractAnalysis";

export const analysisContextSchema = z.object({
  jurisdiction: z.string().trim().min(2).max(80).default("FR"),
  contractType: z.enum(["commercial_general", "employment"]).default("commercial_general"),
  representedParty: z.string().trim().min(2).max(200).default("client"),
  objective: z.enum(["sign", "renegotiate", "renew", "review"]).default("renegotiate"),
});

export function normalizeAnalysisContext(input: Partial<AnalysisContext> | null | undefined): AnalysisContext {
  return analysisContextSchema.parse({
    jurisdiction: input?.jurisdiction || "FR",
    contractType: input?.contractType || "commercial_general",
    representedParty: input?.representedParty || "client",
    objective: input?.objective || "renegotiate",
  });
}

export function contextFromFormData(formData: FormData): AnalysisContext {
  return normalizeAnalysisContext({
    jurisdiction: String(formData.get("jurisdiction") || "FR"),
    contractType: String(formData.get("contractType") || "commercial_general") as AnalysisContext["contractType"],
    representedParty: String(formData.get("representedParty") || "client"),
    objective: String(formData.get("objective") || "renegotiate") as AnalysisContext["objective"],
  });
}
