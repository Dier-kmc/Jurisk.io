/*
  Warnings:

  - You are about to drop the column `old_obligations` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `old_powers` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `old_risks` on the `Analysis` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "risks" TEXT DEFAULT '[]',
    "obligations" TEXT DEFAULT '[]',
    "powers" TEXT DEFAULT '[]',
    "summary" TEXT DEFAULT '{}',
    "parties_identifiees" TEXT NOT NULL DEFAULT '{}',
    "risques" TEXT NOT NULL DEFAULT '[]',
    "obligations_new" TEXT NOT NULL DEFAULT '[]',
    "pouvoirs" TEXT NOT NULL DEFAULT '[]',
    "clauses_critiques" TEXT NOT NULL DEFAULT '[]',
    "analyse_par_partie" TEXT NOT NULL DEFAULT '{}',
    "scenarios_probables" TEXT NOT NULL DEFAULT '[]',
    "modelUsed" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "cost" REAL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Analysis_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("analyse_par_partie", "clauses_critiques", "contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", "obligations", "parties_identifiees", "pouvoirs", "processingTime", "risques", "scenarios_probables", "summary", "tokenCount", "userId") SELECT "analyse_par_partie", "clauses_critiques", "contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", "obligations", "parties_identifiees", "pouvoirs", "processingTime", "risques", "scenarios_probables", "summary", "tokenCount", "userId" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE UNIQUE INDEX "Analysis_contractId_key" ON "Analysis"("contractId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
