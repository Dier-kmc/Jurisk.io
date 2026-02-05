"use server";

import { prisma } from "@/lib/db/client";
import { revalidatePath } from "next/cache";
import { Clause } from "@/types/contract";

export async function updateAnalysisClause(
  analysisId: string,
  clauseNumber: string,
  newSolution: string,
) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      select: { critical_clauses: true },
    });

    if (!analysis) {
      throw new Error("Analysis not found");
    }

    const clauses = JSON.parse(analysis.critical_clauses as string) as Clause[];

    // Find and update the specific clause
    const updatedClauses = clauses.map((clause) => {
      if (clause.clause_number === clauseNumber) {
        return { ...clause, proposed_solution: newSolution };
      }
      return clause;
    });

    await prisma.analysis.update({
      where: { id: analysisId },
      data: {
        critical_clauses: JSON.stringify(updatedClauses),
      },
    });

    revalidatePath(`/result/${analysisId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update clause:", error);
    return { success: false, error: "Failed to update clause" };
  }
}
