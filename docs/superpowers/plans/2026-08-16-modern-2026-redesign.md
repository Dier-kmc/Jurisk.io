# Refonte Modern 2026 & Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Améliorer le design et les espacements de l'application Jurisk.io pour atteindre un standard 2026 ultra-moderne (style Linear / Vercel / Stripe Press) : fonds plus profonds (`#050505`, `#0a0a0e`, `#121217`), bordures ultra-fines (`border border-white/[0.06]`), espacements généreux et rythmés (`py-24 md:py-32`, cartes `p-8`, grilles `gap-8`).

**Architecture:** Mises à jour des tokens CSS dans `globals.css` (@theme), ajustement des classes d'espacement, de padding et de bordures sur les conteneurs globaux, les pages publiques (landing, pricing), les pages dashboard (upload, result) et les composants clés.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript.

## Global Constraints
- **Design system:** Sombre ultra-profondeur, accent menthe `#34d399`, police Geist, sans orbes jaunes/amber, sans noise-overlay.
- **Espacements :** Padding vertical de section `py-24 md:py-32`, padding interne des cartes `p-8`, espacements de grilles `gap-8`.
- **Logique métier :** Inchangée (UI-only).
- **Vérification :** `npx tsc --noEmit` et `npm run build` sans erreur.

---

### Task 1: Fondations de surface et tokens (globals.css)

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: tokens de surface raffinés (`--color-background: #050505`, `--color-surface-1: #0a0a0e`, `--color-surface-2: #121217`, `--color-border: rgb(255 255 255 / 0.06)`).

- [ ] **Step 1: Mettre à jour `src/app/globals.css` avec les nouvelles couleurs de surface et bordure 2026**

```css
@import "tailwindcss";

@theme {
  --color-background: #050505;
  --color-surface-1: #0a0a0e;
  --color-surface-2: #121217;
  --color-border: rgb(255 255 255 / 0.06);
  --color-foreground: #f4f4f5;
  --color-muted: #a1a1aa;
  --color-faint: #52525b;
  --color-accent: #34d399;
  --color-accent-bright: #6ee7b7;
  --color-risk-low: #34d399;
  --color-risk-medium: #f59e0b;
  --color-risk-high: #f87171;

  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.25rem;
}
```

- [ ] **Step 2: Vérifier la compilation TS**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(design): mise à jour des tokens de surface et bordures 2026"
```

---

### Task 2: Refonte Landing Page & Pricing (Espace & Bento Grids)

**Files:**
- Modify: `src/app/(public)/page.tsx`, `src/app/(public)/pricing/page.tsx`, `src/components/pricing/PricingCard.tsx`

**Interfaces:**
- Consumes: nouveaux tokens de surface et bordure `border-white/[0.06]`.
- Produces: sections aérées (`py-24 md:py-32`), grilles `gap-8`, cartes bento et pricing `p-8`.

- [ ] **Step 1: Ajuster les espacements et bordures de `src/app/(public)/page.tsx`**

Modifier les sections de la landing pour utiliser `py-24 md:py-32`, les bento grids avec `gap-8` et `p-8`, et les bordures `border-white/[0.06]`.

- [ ] **Step 2: Ajuster `src/app/(public)/pricing/page.tsx` et `PricingCard.tsx`**

Appliquer `py-24 md:py-32` au conteneur principal et `p-8` sur `PricingCard.tsx`.

- [ ] **Step 3: Vérifier avec tsc**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/app/(public)/page.tsx src/app/(public)/pricing/page.tsx src/components/pricing/PricingCard.tsx
git commit -m "feat(design): espacements généreux et grille bento 2026 sur landing et pricing"
```

---

### Task 3: Refonte Dashboard Shell, Upload & Modals

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`, `src/components/layout/dashboard/SideBar.tsx`, `src/app/(dashboard)/upload/page.tsx`, `src/components/upload/FileUpload.tsx`

**Interfaces:**
- Consumes: tokens de surface-1/2 et bordure.
- Produces: dashboard et upload aérés, padding cartes `p-8`, espacement sidebar/contenu `gap-8`.

- [ ] **Step 1: Ajuster `src/app/(dashboard)/layout.tsx` et `SideBar.tsx`**

Uniformiser les fonds sur `bg-background` / `bg-surface-1`, bordures `border-border` (`rgb(255 255 255 / 0.06)`), et padding `p-6 md:p-8`.

- [ ] **Step 2: Ajuster `src/app/(dashboard)/upload/page.tsx` et `FileUpload.tsx`**

Appliquer `p-8` sur la zone de drop et les cartes de limites, et `gap-8` sur les conteneurs.

- [ ] **Step 3: Vérifier**

Run: `npx tsc --noEmit`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/app/(dashboard)/layout.tsx src/components/layout/dashboard/SideBar.tsx src/app/(dashboard)/upload/page.tsx src/components/upload/FileUpload.tsx
git commit -m "feat(design): espacements et surfaces 2026 sur dashboard et upload"
```

---

### Task 4: Refonte Page Résultat & Composants de Résultats

**Files:**
- Modify: `src/app/(dashboard)/result/[id]/page.tsx`, `src/components/results/AnalysisHero.tsx`, `src/components/results/ContractDissection.tsx`, `src/components/results/AnalysisClausesTab.tsx`, `src/components/results/AnalysisRisksTab.tsx`

**Interfaces:**
- Consumes: composants `RiskGauge`, `ContractDissection`, tokens de surface.
- Produces: page résultat aérée (`gap-8`, cartes `p-8`), séparateurs et bordures 2026.

- [ ] **Step 1: Ajuster `AnalysisHero.tsx`, `ContractDissection.tsx`, `AnalysisClausesTab.tsx`**

Harmoniser les conteneurs à `p-8`, les grilles à `gap-8`, et les bordures à `border-border`.

- [ ] **Step 2: Ajuster `src/app/(dashboard)/result/[id]/page.tsx`**

Aérer les espacements entre les onglets, le hero et le footer (`space-y-12` ou `gap-8`).

- [ ] **Step 3: Vérification finale de typecheck et build**

Run: `npx tsc --noEmit && npm run build`
Expected: 0 errors, build success

- [ ] **Step 4: Commit**

```bash
git add src/app/(dashboard)/result/[id]/page.tsx src/components/results/
git commit -m "feat(design): espacements et surfaces 2026 sur la page résultat et onglets"
```

---

### Task 5: Revue globale, netteté des filets et build final

**Files:**
- Modify: tous les composants restants si nécessaire (Header, Footer, modaux auth).

**Interfaces:**
- Produces: application 100% cohérente avec le design system 2026.

- [ ] **Step 1: Vérifier les composants globaux (`Header.tsx`, `Footer.tsx`, `LoginModal.tsx`, `RegisterModal.tsx`)**

S'assurer que les bordures sont bien en `border-border` et les espacements de padding internes homogènes (`p-8` ou `p-6`).

- [ ] **Step 2: Exécuter la vérification complète**

Run: `npx tsc --noEmit && npm run build`
Expected: SUCCESS

- [ ] **Step 3: Commit final**

```bash
git add src/
git commit -m "feat(design): finalisation de la refonte Modern 2026 et espacements harmonisés"
```
