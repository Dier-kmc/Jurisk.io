# Refonte UI « Jurisk 2026 » — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refondre toute l'UI de Jurisk.io vers un design « dark néo-tech » (fond quasi-noir, filets fins, accent vert menthe unique, typo Geist), sans toucher à la logique métier.

**Architecture:** Approche fondations-d'abord : 1) tokens/typo globales, 2) primitives custom, 3) coquille, 4) composants résultat + signature, 5) pages. Toute l'UI passe par Tailwind 4 CSS-first (`globals.css` `@theme`) ; aucun changement de logique, de schéma DB ni d'API.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, shadcn primitives (`src/components/ui/*`), design system custom (`src/components/ui/custom/*`), Geist via `next/font/google`.

## Global Constraints

- **Aucune modification de logique métier** : uniquement classes/tokens/composants de présentation. Les signatures de props des composants custom restent inchangées.
- **Pas de framework de test, pas de lint** (AGENTS.md) : la vérification est `npx tsc --noEmit` après chaque tâche, `npm run build` en fin.
- **Commits en français** ; identifiants de code en anglais.
- **L'accent de marque devient mint `#34d399`** ; le jaune/ambre comme accent part.
- Geist est LA seule famille (via `next/font/google`) ; supprimer tout usage de serif.
- Tokens définis dans `src/app/globals.css` `@theme` ; `tailwind.config.ts` est supprimé (ignoré par Tailwind 4).
- `prefers-reduced-motion` respecté.

---

### Task 1: Tokens globaux + typographie Geist (fondations)

**Files:**
- Modify: `src/app/globals.css` (réécriture complète)
- Modify: `src/app/layout.tsx`
- Delete: `tailwind.config.ts`

**Interfaces:**
- Produces: tokens utilitaires utilisés partout ensuite — `bg-background`, `bg-surface-1`, `bg-surface-2`, `border-border`, `text-muted`, `text-faint`, `text-accent`, `bg-accent`, `ring-accent`, `text-risk-low/medium/high`, `bg-risk-low/medium/high`, classe `.glass-card` (re-définie en surface néo-tech).
- Produces: police `Geist` chargée dans `layout.tsx`.

- [ ] **Step 1: Réécrire `src/app/globals.css`**

Remplacer tout le contenu par :

```css
@import "tailwindcss";

@theme {
  --color-background: #08080a;
  --color-surface-1: #0d0d0f;
  --color-surface-2: #111114;
  --color-border: rgb(255 255 255 / 0.08);
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

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0a0a0c;
  }
  ::-webkit-scrollbar-thumb {
    background: #2a2a30;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3a3a42;
  }
}

@layer components {
  .container {
    @apply px-4 mx-auto max-w-7xl;
  }

  .glass-card {
    @apply bg-surface-1 border border-border rounded-xl shadow-sm;
  }

  .glass-card-hover {
    @apply hover:bg-surface-2 transition-colors duration-300 hover:border-white/20;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-accent to-accent-bright bg-clip-text text-transparent;
  }

  .section-padding {
    @apply py-16 md:py-24 px-4;
  }

  .bento-grid {
    @apply grid grid-cols-1 md:grid-cols-6 gap-4;
  }

  .bento-item {
    @apply rounded-xl p-6 border border-border bg-gradient-to-b from-white/[0.04] to-transparent;
  }
}

@layer utilities {
  .tnum {
    font-variant-numeric: tabular-nums;
  }

  .text-balance {
    text-wrap: balance;
  }

  .bg-grid-pattern {
    background-image: radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 0
    );
    background-size: 40px 40px;
  }

  .reveal {
    opacity: 0;
    transform: translateY(16px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .reveal-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-slide-up {
    animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .stagger-1 { animation-delay: 0.08s; }
  .stagger-2 { animation-delay: 0.16s; }
  .stagger-3 { animation-delay: 0.24s; }
  .stagger-4 { animation-delay: 0.32s; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Mettre à jour `src/app/layout.tsx`**

Remplacer l'import `Inter` par `Geist`, appliquer la classe, retirer le noise-overlay du body et corriger `lang` :

```tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
// ... imports AuthProvider, Toaster, DeviceDetector inchangés

const geist = Geist({ subsets: ["latin"] });
```

Dans le body : `className={`${geist.className} bg-background text-foreground min-h-screen flex flex-col relative`}` et **supprimer** `<div className="noise-overlay" />`. `lang="fr"`.

- [ ] **Step 3: Supprimer `tailwind.config.ts`**

`rm tailwind.config.ts` (fichier legacy ignoré par Tailwind 4 ; les tokens vivent dans `@theme`).

- [ ] **Step 4: Vérifier**

`npx tsc --noEmit` → attendu : aucune erreur.

- [ ] **Step 5: Nettoyer les usages de `.noise-overlay` / `.serif-display`**

Grep `noise-overlay` et `serif-display` dans `src/` : supprimer les divs/classes correspondantes dans `src/app/(dashboard)/layout.tsx`, `src/app/(dashboard)/upload/page.tsx`, `src/app/layout.tsx`, et tout autre fichier. (Fait au fil des tâches suivantes quand on passe sur chaque page.)

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat(design): fondations tokens dark neo-tech et typographie Geist"
```

---

### Task 2: Primitives shadcn re-tokénisées

**Files:**
- Modify: `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx` (si existe), `src/components/ui/tabs.tsx`, `src/components/ui/textarea.tsx`, `src/components/ui/progress.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/tooltip.tsx`

**Interfaces:**
- Produces: boutons à rayons courts (`rounded-lg`), focus mint, variantes alignées sur les tokens.

- [ ] **Step 1: Re-tokeniser `button.tsx`**

Remplacer `rounded-full` par `rounded-lg` dans la base et dans `size.sm`/`size.lg` ; garder la structure cva. La variante `default` utilise déjà `bg-primary` — les tokens `primary`/`primary-foreground`/`ring`/`input`/`destructive` doivent être ajoutés à `@theme` (voir Task 1, ils y sont déjà via `--color-accent` ? non — **ajouter dans `@theme`** ) :

Ajouter dans `globals.css` `@theme` :
```css
  --color-primary: #34d399;
  --color-primary-foreground: #08080a;
  --color-destructive: #f87171;
  --color-destructive-foreground: #ffffff;
  --color-ring: #34d399;
  --color-input: rgb(255 255 255 / 0.12);
  --color-secondary: #111114;
  --color-secondary-foreground: #f4f4f5;
  --color-accent-foreground: #f4f4f5;
```

Dans `button.tsx`, remplacer `rounded-full` (2 occurrences : base + `size.sm`) par `rounded-lg`, et `size.lg` `rounded-full` → `rounded-lg`.

- [ ] **Step 2: Re-tokeniser `badge.tsx`**

Ajouter les variantes sémantiques de risque :

```tsx
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 ...",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        destructive: "border-transparent bg-destructive text-white",
        success: "border-transparent bg-risk-low/15 text-risk-low",
        warning: "border-transparent bg-risk-medium/15 text-risk-medium",
        danger: "border-transparent bg-risk-high/15 text-risk-high",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

- [ ] **Step 3: Aligner `card.tsx`, `tabs.tsx`, `progress.tsx`, `separator.tsx`, `tooltip.tsx`**

Pour chaque fichier : remplacer `border-border` existants, `bg-card` → `bg-surface-1`, `bg-popover`/`bg-secondary` → `bg-surface-2`, focus `ring-ring` (déjà mint via token), `rounded-md` → `rounded-lg`. (Ces fichiers sont courts — adapter chaque className aux tokens, sans changer les props.)

- [ ] **Step 4: Vérifier**

`npx tsc --noEmit` → aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/globals.css 2>/dev/null || true
git add src/components/ui/button.tsx src/components/ui/badge.tsx src/components/ui/card.tsx src/components/ui/tabs.tsx src/components/ui/progress.tsx src/components/ui/separator.tsx src/components/ui/tooltip.tsx src/app/globals.css
git commit -m "feat(design): re-tokenisation des primitives shadcn (mint, rayons courts)"
```

---

### Task 3: Primitives custom (`src/components/ui/custom/*`)

**Files:**
- Modify: `src/components/ui/custom/CustomButton.tsx`, `Card.tsx`, `Alert.tsx`, `Badge.tsx`, `InputField.tsx`, `ProgressBar.tsx`, `PasswordStrengthIndicator.tsx`

**Interfaces:**
- Produces: mêmes exports/props, nouvelles classes. Les pages existantes n'ont pas à changer.

- [ ] **Step 1: `CustomButton.tsx`**

Conserver toute la logique/props. Dans `className` de rendu (l'`ShadcnButton` reçoit déjà les variantes re-tokénisées) — ajouter `rounded-lg` :

```tsx
className={cn("rounded-lg", fullWidth && "w-full", className)}
```

Supprimer la classe CSS `bg-yellow-600 ...` passée par les pages (fait page par page plus loin) ; ici seulement la couche de base.

- [ ] **Step 2: `Card.tsx`**

```tsx
className={clsx(
  'bg-surface-1 rounded-xl',
  border && 'border border-border',
  paddingClasses[padding],
  hover && 'hover:border-white/20 transition-colors',
  className
)}
```

`CardHeader`/`CardContent`/`CardFooter` : remplacer `text-gray-400` → `text-muted`, `border-gray-800` → `border-border`.

- [ ] **Step 3: `Alert.tsx`**

Remplacer le jaune par les sémantiques : dans `typeConfig`, `warning` → `bg-risk-medium/10 border-risk-medium/30 text-risk-medium`, `success` → `bg-risk-low/10 border-risk-low/30 text-risk-low`. `filled` warning → `bg-risk-medium border-risk-medium text-white`. Texte body `text-gray-300` → `text-muted`.

- [ ] **Step 4: `Badge.tsx`**

```tsx
const variantClasses = {
  default: 'bg-surface-2 text-muted',
  success: 'bg-risk-low/15 text-risk-low',
  warning: 'bg-risk-medium/15 text-risk-medium',
  danger: 'bg-risk-high/15 text-risk-high',
  info: 'bg-white/5 text-muted',
};
```

- [ ] **Step 5: `InputField.tsx`**

`getBorderColor` défaut : `border-border focus:ring-accent focus:border-accent`. Icône : `group-focus-within:text-accent`. Remplacer `bg-black/50` → `bg-surface-1`, `text-gray-500` → `text-faint`.

- [ ] **Step 6: `ProgressBar.tsx`**

```tsx
const colorClasses = {
  yellow: 'bg-accent',
  green: 'bg-risk-low',
  red: 'bg-risk-high',
  blue: 'bg-white/20',
};
```

(`yellow` devient mint — les usages existants passent au mint sans changer de code.) Label `text-gray-400` → `text-muted`, track `bg-gray-800` → `bg-white/10`.

- [ ] **Step 7: `PasswordStrengthIndicator.tsx`**

`text-green-400` → `text-risk-low`, `bg-green-400` → `bg-risk-low`, `bg-gray-600` → `bg-faint`.

- [ ] **Step 8: Vérifier + commit**

`npx tsc --noEmit` → aucune erreur. Commit : `feat(design): re-tokenisation des primitives custom`.

---

### Task 4: Coquille — Header & Footer

**Files:**
- Modify: `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`

- [ ] **Step 1: `Header.tsx`**

Remplacer le bloc conteneur flottant par un header fixe au scroll avec bordure basse :

```tsx
<header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
  <div className="container max-w-7xl h-16 flex items-center justify-between">
```

- Logo : remplacer `bg-gradient-to-br from-yellow-400 to-amber-600` → `bg-accent`, `shadow-lg` → aucun, retirer `group-hover:scale-110`. `gradient-text italic font-serif` → `gradient-text` (le serif disparaît).
- Nav desktop : `bg-white/[0.03] border border-white/5 rounded-full px-6 py-2` → `gap-1` simple, liens actifs `text-accent` au lieu de `text-yellow-500`.
- Bouton « Démarrer l'essai » : supprimer la classe inline `bg-yellow-600 hover:bg-yellow-500 ... shadow` (le variant primary mint de CustomButton prend le relais) → `className="rounded-lg"`.
- Bloc crédits : `from-yellow-500/20 to-amber-500/10`, `border-yellow-500/20`, `text-yellow-500` → tokens mint/neutres (`bg-accent/10`, `border-accent/20`, `text-accent`).
- Menu mobile : `glass-card` (re-défini), `hover:text-yellow-500` → `hover:text-accent`, boutons register → retirer `bg-yellow-600` inline.
- Modals : inchangés (traités Task 5).

- [ ] **Step 2: `Footer.tsx`**

- Retirer la glow jaune (`bg-yellow-600/5 rounded-full blur-[100px]`).
- Logo : gradient jaune → `bg-accent`, retirer `shadow-lg group-hover:scale-110`.
- Titres colonnes `text-white font-bold mb-6 tracking-wide uppercase text-xs` → `text-muted ... tracking-widest uppercase text-[11px]`.
- Liens `text-gray-400 hover:text-white` → `text-faint hover:text-foreground`.
- Socials : `hover:text-yellow-500 hover:bg-yellow-500/10 hover:border-yellow-500/30` → `hover:text-accent hover:bg-accent/10 hover:border-accent/30`.

- [ ] **Step 3: Vérifier + commit**

`npx tsc --noEmit`. Commit : `feat(design): coquille header et footer neo-tech`.

---

### Task 5: Coquille — Dashboard (sidebar + layout + modals auth)

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`, `src/components/layout/dashboard/SideBar.tsx`, `src/components/layout/dashboard/ContentArea.tsx`, `src/components/layout/dashboard/DeleteConfirmation.tsx`
- Modify: `src/components/auth/LoginModal.tsx`, `src/components/auth/RegisterModal.tsx`

- [ ] **Step 1: `(dashboard)/layout.tsx`**

- Retirer `<div className="noise-overlay ..." />` et le `bg-[radial-gradient(...)]` jaune.
- Fond : `bg-black/90` → `bg-background`.
- Logo mobile `from-yellow-400 to-amber-600` → `bg-accent`.
- Retirer `gradient-text italic font-serif` → `gradient-text`.

- [ ] **Step 2: `SideBar.tsx`**

- Conteneur : `bg-black/95 md:bg-black/40 backdrop-blur-2xl` → `bg-surface-1`.
- Logo : `from-yellow-400 to-amber-600` → `bg-accent`.
- Bouton « Nouvelle analyse » : retirer `bg-yellow-600 hover:bg-yellow-500 ... shadow-[0_10px_20px_-5px_rgba(202,138,4,0.2)] hover:scale-[1.02]` → `bg-accent hover:bg-accent-bright text-background` + `rounded-lg`.
- Focus recherche `focus:border-yellow-600/50` → `focus:border-accent/50`.
- Filtre actif `bg-yellow-600 border-yellow-600 ... shadow-lg` → `bg-accent border-accent text-background`.
- Statut actif dans le menu `bg-yellow-600/20 text-yellow-600` → `bg-accent/15 text-accent`.
- Indicateur actif `bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]` → `bg-accent`.
- Spinner `text-yellow-600` → `text-accent`.
- Menu utilisateur : `from-yellow-400 to-yellow-600 p-[1px]` → `from-accent to-accent-bright p-[1px]` ; carte crédits `from-yellow-500/10 ... border-yellow-500/10 hover:border-yellow-500/30` → tokens accent ; icônes/textes `text-yellow-500` → `text-accent`.
- Badges stats `text-green-500/80` → `text-risk-low`.

- [ ] **Step 3: `ContentArea.tsx` et `DeleteConfirmation.tsx`**

Lire puis appliquer les mêmes règles de tokenisation (jaune → accent, `gray-*` → `muted`/`faint`, bordures → `border-border`, fonds → `surface-1`/`surface-2`).

- [ ] **Step 4: `LoginModal.tsx` / `RegisterModal.tsx`**

- Fond modal → `bg-surface-2 border border-border`, `rounded-2xl`, `shadow-xl`.
- Focus inputs jaune → accent (via `InputField` re-tokénisé, vérifier les classes inline restantes).
- Bouton submit `bg-yellow-600` → retirer (primary mint via CustomButton) ; retirer les ombres jaunes.

- [ ] **Step 5: Vérifier + commit**

`npx tsc --noEmit`. Commit : `feat(design): coquille dashboard et modals auth`.

---

### Task 6: Composant signature « ContractDissection » + jauge de score

**Files:**
- Create: `src/components/results/ContractDissection.tsx`
- Create: `src/components/results/RiskGauge.tsx`

**Interfaces:**
- `ContractDissection({ clauses, onSelectClause }: { clauses: Clause[]; onSelectClause?: (n: string) => void })` — clause = `{ clause_number, title, priority, problem }`.
- `RiskGauge({ value, label }: { value: number; label: string })` — valeur 0–100, arc discret.
- Consumes: type `Clause` depuis `@/types/contract`.

- [ ] **Step 1: Créer `RiskGauge.tsx`**

```tsx
interface RiskGaugeProps {
  value: number;
  label: string;
}

export function RiskGauge({ value, label }: RiskGaugeProps) {
  const v = Math.max(0, Math.min(100, value));
  const color =
    v >= 66 ? "stroke-risk-high" : v >= 33 ? "stroke-risk-medium" : "stroke-risk-low";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" strokeWidth="6" className="stroke-white/10" />
          <circle
            cx="40" cy="40" r="34" fill="none" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(v / 100) * 213.6} 213.6`} className={color} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-foreground tnum">
          {Math.round(v)}
        </span>
      </div>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted">{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Créer `ContractDissection.tsx`**

```tsx
"use client";
import { useEffect, useState } from "react";
import type { Clause } from "@/types/contract";

interface ContractDissectionProps {
  clauses: Clause[];
  onSelectClause?: (clauseNumber: string) => void;
}

const priorityColor: Record<string, string> = {
  high: "bg-risk-high",
  medium: "bg-risk-medium",
  low: "bg-risk-low",
};

export function ContractDissection({ clauses, onSelectClause }: ContractDissectionProps) {
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (clauses.length === 0) return;
    const id = setInterval(() => {
      setRevealed((r) => {
        if (r >= clauses.length) {
          clearInterval(id);
          return r;
        }
        return r + 1;
      });
    }, 220);
    return () => clearInterval(id);
  }, [clauses.length]);

  if (clauses.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface-1 p-6 text-sm text-muted">
        Aucune clause critique détectée.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted">
          Dissection du contrat
        </span>
        <span className="text-[10px] font-medium text-accent tnum">
          {revealed}/{clauses.length}
        </span>
      </div>
      <ul className="divide-y divide-border">
        {clauses.slice(0, revealed).map((clause) => (
          <li key={clause.clause_number}>
            <button
              onClick={() => onSelectClause?.(clause.clause_number)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityColor[clause.priority] ?? "bg-faint"}`} />
              <span className="flex-1 min-w-0">
                <span className="block text-[11px] font-semibold text-foreground">
                  {clause.title || `Clause ${clause.clause_number}`}
                </span>
                {clause.problem && (
                  <span className="mt-0.5 block text-xs text-muted line-clamp-2">{clause.problem}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Vérifier**

`npx tsc --noEmit` → aucune erreur.

- [ ] **Step 4: Commit**

```bash
git add src/components/results/ContractDissection.tsx src/components/results/RiskGauge.tsx
git commit -m "feat(design): composants signature dissection du contrat et jauge de risque"
```

---

### Task 7: Page résultat + composants `results/*`

**Files:**
- Modify: `src/app/(dashboard)/result/[id]/page.tsx`, `src/components/results/*.tsx` (AnalysisHero, AnalysisHeader, AnalysisOverview, AnalysisRisksTab, AnalysisClausesTab, AnalysisStrategyTab, AnalysisTimeline, AnalysisParties, AnalysisLoading, AnalysisError, AnalysisDisclaimer, AnalysisFooter, SummaryCard, VigilanceScore, RiskMatrix, RiskBlock, ObligationsBlock, PowersBlock, NegotiationStrategy, ScenarioSimulator, ClauseEditor)

**Interfaces:**
- Consumes: `ContractDissection`, `RiskGauge` (Task 6).
- Produces: `AnalysisClausesTab` expose une façon d'activer l'onglet clauses (via prop `onSelectClause` ou callback remonté à la page).

- [ ] **Step 1: Lire et re-tokeniser chaque composant `results/*`**

Pour chacun : appliquer la matrice de remplacement suivante, sans changer logique/props :
- `bg-yellow-500/*`, `text-yellow-*`, `from-yellow-*`, `to-amber-*`, `border-yellow-*`, `text-amber-*`, `shadow-[...rgba(202,138,4...)]` → équivalent accent mint (`bg-accent/10`, `text-accent`, `from-accent`, `border-accent/20`).
- `bg-green-500/*`/`text-green-*` (sémantique positif) → `bg-risk-low/*` / `text-risk-low`.
- `bg-red-500/*`/`text-red-*` → `bg-risk-high/*` / `text-risk-high`.
- `bg-orange-500/*` → `bg-risk-medium/*`.
- `bg-gray-900`, `bg-gray-800`, `bg-black/...` (surfaces) → `bg-surface-1` / `bg-surface-2`.
- `text-gray-400` → `text-muted` ; `text-gray-500` → `text-faint` ; `border-gray-800` → `border-border`.
- `rounded-3xl` → `rounded-xl` ; gros `rounded-[Xrem]` → `rounded-xl` ; `shadow-2xl`/`shadow-xl` → `shadow-sm`/`shadow-none`.
- `glass-card`/`glass-card-hover` : inchangé (déjà re-défini en surface néo-tech).
- `font-serif` / `.serif-display` → supprimer.
- `noise-overlay` → supprimer.

- [ ] **Step 2: Intégrer la signature dans la page résultat**

Dans `result/[id]/page.tsx`, remplacer la zone « scores » par une rangée de `RiskGauge` (global risk / balance / clarity) et ajouter `ContractDissection` dans l'onglet clauses :

```tsx
// dans le rendu, là où le hero/aperçu affiche les scores
<RiskGauge value={summary.global_risk_score} label="Risque global" />
<RiskGauge value={summary.balance_score} label="Équilibre" />
<RiskGauge value={summary.clarity_score} label="Clarté" />
```

Et dans `AnalysisClausesTab` (ou via props), rendre `<ContractDissection clauses={analysis.critical_clauses} onSelectClause={(n) => setActiveTab("clauses")} />`.

- [ ] **Step 3: Vérifier + commit**

`npx tsc --noEmit`. Commit : `feat(design): page résultat re-tokenisée et intégration dissection`.

---

### Task 8: Pages landing & pricing

**Files:**
- Modify: `src/app/(public)/page.tsx`, `src/app/(public)/pricing/page.tsx`, `src/components/pricing/PricingCard.tsx`, `src/components/pricing/FeatureList.tsx`

- [ ] **Step 1: Landing `page.tsx`**

- Hero : retirer orbes jaunes (`bg-yellow-500/5 ... blur-3xl animate-pulse`), masque grid conservé en blanc/4.
- Titre : remplacer le dégradé `from-yellow-500 via-yellow-400 to-yellow-300` → `from-accent via-accent-bright to-accent-bright`.
- Bande de dissection signature : ajouter sous le sous-titre un mock :

```tsx
{/* Mock dissection — accent signature */}
<div className="mt-16 w-full max-w-xl">
  <ContractDissection
    clauses={[
      { clause_number: "3", title: "Clause de non-concurrence", problem: "Durée excessive (5 ans)", priority: "high" },
      { clause_number: "7", title: "Indemnités de résiliation", problem: "Pénalités déséquilibrées", priority: "medium" },
      { clause_number: "11", title: "Force majeure", problem: "Champ trop restreint", priority: "low" },
      { clause_number: "14", title: "Confidentialité", problem: "Post-contractuel limité", priority: "medium" },
    ]}
  />
</div>
```

(import `ContractDissection` depuis `@/components/results/ContractDissection`).
- Section fonctionnalités : cartes `rounded-2xl border border-border bg-surface-1` + icônes `text-accent`, remplacer les `bg-white/[0.05]`/ombres.
- Témoignages : `glass-card` + `border-border`, étoiles `text-yellow-500` → `text-accent`.
- `noise-overlay`/`serif-display` : supprimer.

- [ ] **Step 2: Pricing**

- `PricingCard.tsx` : cartes `rounded-xl border border-border bg-surface-1`, plan actif = `border-accent` + `bg-accent/5` au lieu du dégradé jaune ; bouton CTA retirer le jaune inline (primary mint). `text-yellow-500` → `text-accent`.
- `FeatureList.tsx` : `text-green-500` → `text-risk-low`, `text-gray-400` → `text-muted`.
- Page `pricing/page.tsx` : tokeniser fonds/bordures/jaunes résiduels.

- [ ] **Step 3: Vérifier + commit**

`npx tsc --noEmit`. Commit : `feat(design): landing et pricing neo-tech`.

---

### Task 9: Page upload

**Files:**
- Modify: `src/app/(dashboard)/upload/page.tsx`, `src/components/upload/FileUpload.tsx`, `FileList.tsx`, `UploadProgress.tsx`

- [ ] **Step 1: `upload/page.tsx`**

- Remplacer le gros « HUD crédits glassmorphique » (`rounded-[2.5rem] ... backdrop-blur-2xl ... bg-gradient-to-br from-white/[0.08]`) par une **topbar compacte** :

```tsx
<div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface-1 px-5 py-4">
  <div>
    <p className="text-[10px] font-medium uppercase tracking-widest text-muted">Solde de crédits</p>
    <p className="text-2xl font-semibold text-foreground tnum">{userCredits?.credits ?? "…"} crédits</p>
  </div>
  <Link href="/pricing" className="... text-accent hover:text-accent-bright text-xs font-medium">
    Recharger mon compte →
  </Link>
</div>
```

- Bouton « Engager l'Analyse » : `bg-yellow-600 text-black hover:bg-yellow-500 shadow-[0_20px_40px_-10px_rgba(202,138,4,0.3)]` → `bg-accent text-background hover:bg-accent-bright` + `rounded-lg` (rayons courts) ; supprimer le shadow jaune.
- `noise-overlay`, `bg-[radial-gradient(...yellow...)]` → retirer.
- `serif-display` → retirer.
- Card « limites » : `rounded-[3.5rem]` → `rounded-xl`, bordures/jaunes → tokens.

- [ ] **Step 2: `FileUpload.tsx` / `FileList.tsx` / `UploadProgress.tsx`**

Lire puis tokeniser : `border-dashed border-yellow-500/40` → `border-accent/40`, hover `bg-yellow-500/5` → `bg-accent/5`, `text-yellow-600` → `text-accent`, `bg-gray-900` → `bg-surface-1`, `text-gray-400` → `text-muted`, `rounded-3xl` → `rounded-xl`.

- [ ] **Step 3: Vérifier + commit**

`npx tsc --noEmit`. Commit : `feat(design): page upload neo-tech`.

---

### Task 10: Pages publiques + finition + build final

**Files:**
- Modify: pages `src/app/(public)/{docs,blog,guides,legal,terms,privacy,status,cookie-policy,accessibility}/page.tsx` et `(public)/layout.tsx`, `src/app/not-found.tsx`

- [ ] **Step 1: Tokeniser les pages publiques**

Chacune : `bg-black` → `bg-background` (ou rien, hérité), `text-gray-400` → `text-muted`, `text-yellow-500` → `text-accent`, bordures → `border-border`, `rounded-[Xrem]` → `rounded-xl`, retirer `noise-overlay`/`serif-display`. Vérifier qu'elles héritent bien de `globals.css` (body déjà `bg-background`).

- [ ] **Step 2: Grep de reliquats**

Grep dans `src/` : `yellow|amber|#FACC15|noise-overlay|serif-display|font-serif|rounded-\[[0-9]` → corriger tout reliquat visuel.

- [ ] **Step 3: Vérification finale**

- `npx tsc --noEmit` → 0 erreur.
- `npm run build` → succès.
- Lancement visuel `npm run dev` pour contrôle (si environnement le permet).

- [ ] **Step 4: Commit final**

```bash
git add src
git commit -m "feat(design): refonte UI Jurisk 2026 (dark neo-tech, accent mint)"
```

---

## Self-review du plan

- **Couverture spec** : tokens/typo (T1), primitives (T2/T3), coquille (T4/T5), signature+ résultats (T6/T7), landing/pricing (T8), upload (T9), publiques (T10), vérification (T10). La suppression des orbes/noise/glassmorphism et la correction serif/config sont couvertes. ✓
- **Placeholders** : aucune valeur « TBD » ; la matrice de remplacement est complète et précise. ✓
- **Cohérence des types** : `Clause` importé de `@/types/contract` ; props `ContractDissection`/`RiskGauge` définies en T6 et consommées en T7/T8 avec les mêmes noms. ✓