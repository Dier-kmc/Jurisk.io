# Design — Refonte UI « Jurisk 2026 »

Date : 2026-08-15
Statut : validé (brainstorming)

## Contexte

Jurisk.io, SaaS d'analyse de contrats par IA (Next.js 16, Tailwind 4 CSS-first). Le design actuel est un dark « premium » glassmorphism : fond `#050505`, accents jaune/ambre, orbes flous, noise overlay, rayons très arrondis (`rounded-[3rem]`), police serif déclarée mais jamais chargée (`--font-newsreader`), et `tailwind.config.ts` legacy ignoré par Tailwind 4.

Objectif : refonte UI globale, direction « moderne 2026 » = **dark néo-tech / app tool**, un seul accent vif, une seule famille typographique. Zéro changement de logique métier ; uniquement la couche présentation (tokens, classes, composants de présentation).

Décisions actées avec le client :
- Périmètre : **toute l'app** (landing, pricing, upload, dashboard, résultat, auth, pages publiques).
- Direction : **dark néo-tech**, fond quasi-noir, filets fins, monochrome + un accent vif.
- Accent : **vert menthe** (`#34d399`).
- Typographie : **une seule famille bien dressée** (Geist).
- Exécution : **Approche 1 — fondations d'abord** (tokens + primitives + coquille, puis pages).

## Système de tokens

### Couleurs (globals.css, `@theme`, Tailwind 4 CSS-first)

| Token | Valeur | Usage |
|---|---|---|
| `background` | `#08080a` | Fond racine (quasi-noir, légèrement froid) |
| `surface-1` | `#0d0d0f` | Cartes, sidebar |
| `surface-2` | `#111114` | Panneaux superposés, modals |
| `border` | `white/6–10%` | Filets hairline (vocabulaire principal) |
| `foreground` | `#f4f4f5` | Texte principal |
| `muted` | `#a1a1aa` | Texte secondaire |
| `faint` | `#52525b` | Texte tertiaire |
| `accent` | `#34d399` → `#6ee7b7` | Interactivité, données clés, focus — rare et précis |
| `risk-low` / `risk-medium` / `risk-high` | mint `#34d399` / ambre `#f59e0b` / rouge `#f87171` | Niveaux de risque (sémantiques, pas des accents de marque) |

### Disparitions
- Jaune/ambre comme accent de marque (partout).
- Orbes flous, noise overlay, blobs `rounded-[3rem]`, fonds jaunes `blur-3xl`.
- Glassmorphism (`backdrop-blur` lourd) → surfaces plates + filets.
- `.serif-display` et la police serif cassée.
- `tailwind.config.ts` (legacy ignoré par Tailwind 4).

### Rayons
- Cartes : `rounded-xl` (max `rounded-2xl` pour les surfaces héro).
- Boutons / inputs : `rounded-lg`.
- Chips / badges : `rounded-full` conservé.

## Typographie

- **Geist** via `next/font/google` (remplace Inter dans `src/app/layout.tsx`).
- Hiérarchie stricte : display `tracking-tight`, corps régulier, micro-labels (11px, lettres espacées) utilisés avec parcimonie.
- **Tabular figures** (`tnum`) pour tous les chiffres/scores.
- Suppression de `.serif-display`.

## Élément signature

**« La dissection du contrat »** : le contrat est présenté comme une bande verticale de clauses, chaque clause étant une ligne avec son marqueur de risque (mint/ambre/rouge). Une ligne de scan mint descend la bande au chargement et révèle les clauses une à une — l'IA « dissèque » le document sous les yeux. Utilisé sur :
- la page résultat (données réelles de l'analyse) ;
- le hero de la landing (mock de scan).

À côté, scores de risque en jauges discrètes (arc) plutôt que gros blocs chiffrés.

## Coquille & composants

### Layout
- **Header public** : logo + navigation en micro-labels, `backdrop-blur` au scroll, bordure basse hairline.
- **Dashboard** : sidebar fixe (fond `surface-1`, filet droit) + topbar fine (contrat, crédits, avatar). Structure `SideBar` / `TopBar` / `ContentArea` conservée, rebadgée.
- **Modals (login/register)** : surfaces `surface-2`, rayons courts, focus mint.
- **Footer** : discret, filets hairline.

### Primitives custom (`src/components/ui/custom/*`)
Reconstruites sur les nouveaux tokens, **signatures de props inchangées** (aucune page cassée) :
- `CustomButton` : `primary` (mint), `outline`, `ghost`, `danger` ; rayons courts ; hover = fond + accent, pas de scale exagéré.
- `Card` : surfaces `surface-1` + filet + `shadow-sm` (corrige le `bg-gray-900` hors-système).
- `Alert`, `Badge`, `InputField`, `ProgressBar`, `PasswordStrengthIndicator` : re-tokénisés.
- Primitives shadcn (`src/components/ui/*`) re-tokénisées (focus mint, filets, radius).
- Badge sémantique : mint/ambre/rouge pour risques, monochrome pour neutre.

### Motion
- **Une seule grande séquence** : la bande de dissection (scan mint).
- Micro-interactions : hover lignes de clauses, focus inputs, transitions d'onglets.
- `prefers-reduced-motion` respecté (fade court).
- Suppression des animations décoratives (orbes `animate-pulse`, float, shimmer).

## Traitement des pages

- **Landing** : hero réduit et centré, bande de dissection (mock de scan), grille fonctionnalités dense, témoignages discrets. Suppression orbes/gradients jaunes.
- **Pricing** : cartes surfaces + filets, plan courant souligné par un filet mint discret, copie alignée sur le modèle crédits (3/mois).
- **Upload** : le gros « HUD crédits » glassmorphique devient une topbar compacte (solde), bouton « analyser » mint, dropzone redessinée (filets + état hover mint).
- **Dashboard** : liste d'analyses retokénisée, badges de statut sémantiques, état actif en mint.
- **Résultat** : bande de dissection intégrée, scores en jauges discrètes, onglets et matrices conservés mais re-tokénisés.
- **Auth (modals)** : surfaces `surface-2`, focus mint.
- **Pages publiques** (docs, legal, terms, …) : simple tokenisation.

## Corrections de bugs design incluses

- Police serif cassée → supprimée, Geist partout.
- `tailwind.config.ts` legacy → supprimé.
- `Card.tsx` hors-système → aligné sur les tokens.

## Exécution (Approche 1 — fondations d'abord)

1. **Fondations** : tokens `globals.css`, Geist dans `layout.tsx`, retrait config legacy et serif/noise.
2. **Primitives** : reconstruire `custom/*` (Button, Card, Alert, Input, Progress, Badge) — props inchangées.
3. **Coquille** : header, footer, sidebar, topbar, modals, DashboardLayout.
4. **Composants résultat** : bande de dissection + jauges.
5. **Pages** : landing, pricing, upload, dashboard, résultat, pages publiques.

## Vérification

- `npx tsc --noEmit` après chaque phase.
- `npm run build` en fin.
- Pas de tests (aucun framework dans le repo).
- Vérification visuelle avec `npm run dev`.
- Aucune modification de logique métier.