/*
  Warnings:

  - You are about to drop the column `powers` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `risks` on the `Analysis` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '{}',
    "parties_identifiees" TEXT NOT NULL DEFAULT '{}',
    "risques" TEXT NOT NULL DEFAULT '[]',
    "obligations" TEXT NOT NULL DEFAULT '[]',
    "pouvoirs" TEXT NOT NULL DEFAULT '[]',
    "clauses_critiques" TEXT NOT NULL DEFAULT '[]',
    "analyse_par_partie" TEXT NOT NULL DEFAULT '{}',
    "scenarios_probables" TEXT NOT NULL DEFAULT '[]',
    "old_risks" TEXT,
    "old_obligations" TEXT,
    "old_powers" TEXT,
    "modelUsed" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "cost" REAL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Analysis_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", "obligations", "processingTime", "summary", "tokenCount", "userId") SELECT "contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", "obligations", "processingTime", "summary", "tokenCount", "userId" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE UNIQUE INDEX "Analysis_contractId_key" ON "Analysis"("contractId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
