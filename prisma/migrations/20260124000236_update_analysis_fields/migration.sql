/*
  Warnings:

  - You are about to drop the column `analyse_par_partie` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `clauses_critiques` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `obligations_new` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `parties_identifiees` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `pouvoirs` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `risques` on the `Analysis` table. All the data in the column will be lost.
  - You are about to drop the column `scenarios_probables` on the `Analysis` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Analysis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '{}',
    "identified_parties" TEXT NOT NULL DEFAULT '{}',
    "risks" TEXT NOT NULL DEFAULT '[]',
    "obligations" TEXT NOT NULL DEFAULT '[]',
    "powers" TEXT NOT NULL DEFAULT '[]',
    "critical_clauses" TEXT NOT NULL DEFAULT '[]',
    "party_analysis" TEXT NOT NULL DEFAULT '{}',
    "probable_scenarios" TEXT NOT NULL DEFAULT '[]',
    "modelUsed" TEXT NOT NULL,
    "processingTime" INTEGER NOT NULL,
    "tokenCount" INTEGER NOT NULL,
    "cost" REAL,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Analysis_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Analysis" ("contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", "obligations", "powers", "processingTime", "risks", "summary", "tokenCount", "userId") SELECT "contractId", "cost", "createdAt", "errorMessage", "id", "modelUsed", coalesce("obligations", '[]') AS "obligations", coalesce("powers", '[]') AS "powers", "processingTime", coalesce("risks", '[]') AS "risks", coalesce("summary", '{}') AS "summary", "tokenCount", "userId" FROM "Analysis";
DROP TABLE "Analysis";
ALTER TABLE "new_Analysis" RENAME TO "Analysis";
CREATE UNIQUE INDEX "Analysis_contractId_key" ON "Analysis"("contractId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
