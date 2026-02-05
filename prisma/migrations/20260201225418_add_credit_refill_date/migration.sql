-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "password" TEXT,
    "image" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'FREE',
    "apiKey" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "lastRefillDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("apiKey", "createdAt", "credits", "email", "emailVerified", "id", "image", "name", "password", "plan", "updatedAt") SELECT "apiKey", "createdAt", "credits", "email", "emailVerified", "id", "image", "name", "password", "plan", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
