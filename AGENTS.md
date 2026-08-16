# AGENTS.md

Jurisk.io — SaaS AI contract-analysis app (Next.js 16 App Router, React 19, TypeScript, Tailwind 4). Formerly "ContractScope"; the refactor IS the current codebase. UI copy, comments, and commit messages are in **French**; code identifiers in English. Match this.

## Commands

- `npm run dev` — dev server. **Restart after editing `prisma/schema.prisma`**: the dev process caches the Prisma client and `prisma generate` alone won't take effect (see `resume.md`).
- `npm run build` — `prisma generate && next build`
- `npm run start`, `npx prisma migrate dev --name <x>`, `npx prisma generate`
- `npx tsc --noEmit` — typecheck. **No test framework, no ESLint/Prettier config, no CI.** Don't invent one.

## Architecture (what the files actually do)

- **Auth**: NextAuth.js v4 (Credentials + Google), JWT sessions, PrismaAdapter in `src/lib/auth/auth.ts`. Client uses `useAuth` (`src/lib/hooks/useAuth.ts`) + `SessionProvider`. Route guard is `src/proxy.ts` (Next 16 proxy file — there is **no `middleware.ts`**), using `getToken()` from `next-auth/jwt`; its matcher excludes `/api`, so API routes auth themselves via `AuthService.getCurrentUser()`.
- **DB**: Prisma against Supabase **PostgreSQL** (`DATABASE_URL`). Warning: `prisma.config.ts` declares a sqlite adapter (`file:./prisma/dev.db`) that conflicts with `schema.prisma`'s postgresql datasource — trust the schema, not that file. `prisma/dev.db` is a stale local artifact; `scripts/clear-database.ts` uses SQLite pragmas and won't run against Postgres.
- **Analysis data**: all structured fields live as JSON **strings** in `Analysis` columns (English keys: `summary`, `risks`, `critical_clauses`, `party_analysis`, ...). Always `JSON.parse` before use; TS types in `src/types/contract.ts`.
- **Analysis pipeline**: `POST /api/upload` extracts text (pdf2json for PDF, mammoth for DOCX), validates (50–50k chars, ≥10 words), uploads file to Supabase Storage bucket `jurisk-io` at `uploads/{uuid}-{name}`, creates `Contract` (status `PROCESSING`), decrements 1 credit, then calls `analyzeContract()` **fire-and-forget** (not awaited). That service chunks text (6000 chars), calls OpenRouter per chunk with model fallback (llama-3.3-70b-instruct → 405b), defensively parses/repairs JSON, merges partials, computes risk/balance/clarity scores (`src/lib/analysis/riskCalculator.ts`), writes `Analysis`, sets contract `COMPLETED`/`FAILED`. Dashboard polls `GET /api/analysis` every 20s while anything is PROCESSING (`src/app/(dashboard)/layout.tsx`).
- **File URL gotcha**: DB `fileUrl` stores `/uploads/...`, but the real object URL is `{NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/jurisk-io/uploads/...`, and `src/lib/proxy/blockUploads.ts` redirects every `/uploads/*` request away — the stored `fileUrl` is not directly fetchable.
- **Credits**: default 3/user; `GET /api/user/credits` tops up to 3 only when >30 days past `lastRefillDate` and credits < 3. The date is intentionally NOT updated otherwise (buffer design — explanatory comments in that route).

## Conventions & gotchas

- **Design system**: dark glassmorphism "Premium" style (`#050505`, yellow/amber accents). The real components are `src/components/ui/custom/*` (CustomButton, GlassCard, ...); `src/components/ui/*` are shadcn primitives. Reuse `custom/*` and existing tokens; don't introduce new color systems.
- **`next-auth` is not in `package.json`** — it's installed only as an auto-installed peer dep of `@next-auth/prisma-adapter`. Don't remove that adapter without adding `next-auth` explicitly.
- **Legacy/dead code to avoid**: `src/lib/llm/ollama.ts`, `src/lib/services/openrouter.service.ts` (real calls are inline in `analysisService.ts` via node-fetch), `src/lib/llm/responseParser.ts` (imported but unused — `analysisService.ts` has its own parser/merge), the standalone `/api/auth/{login,register,verify,me,logout}` routes + `auth_token` cookie (jose/jsonwebtoken path — the client flow is NextAuth), and `src/lib/auth/config.ts` (fully commented out).
- `scripts/*.ts` need `tsx`, which is not in devDependencies. `scripts/test-db.ts` writes French-keyed `Analysis` fixtures — mismatches current English-keyed schema.
- `.env` is gitignored; no `.env.example`. Required vars: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`. `src/lib/supabase/client.ts` throws at import if Supabase vars are missing. `src/lib/auth/auth.ts` throws in production if NextAuth/Google vars are missing.