# Spécification du Design — Refonte UI Jurisk.io (Modern 2026 & Spacing)

## 1. Vue d'ensemble & Objectif
Pousser l'identité visuelle de Jurisk.io vers un standard "2026 Ultra-Moderne" (inspiré de Linear, Vercel et Stripe Press), en éliminant toute surcharge visuelle, en instaurant un système d'espacements généreux et aérés, et en sublimant les micro-interactions et les contrastes de surfaces sombres.

## 2. Système de Couleurs & Surfaces (Dark Néo-Tech Avancé)
- **Fond Racine (`--color-background`) :** `#050505` (Noir absolu profond).
- **Surfaces de 1er plan (`--color-surface-1`) :** `#0a0a0e` (Légèrement teinté pour contraster avec le fond).
- **Surfaces interactives (`--color-surface-2`) :** `#121217` (Modaux, cartes survolées, champs de saisie).
- **Bordures & Filets (`--color-border`) :** `rgb(255 255 255 / 0.06)` (Ultra-fin, discret).
- **Accents & Lumière :** Menthe vif (`#34d399` / `#6ee7b7`) avec lueurs ambiantes subtiles (`rgba(52, 211, 153, 0.03)`).

## 3. Nouveau Système d'Espacements (Spacing Scale)
- **Rythme Vertical des Sections :**
  - Padding des sections principales : `py-24 md:py-32` (contre `py-16 md:py-24`).
  - Marges entre blocs majeurs : `mb-16` à `mb-24`.
- **Densité et Padding des Cartes :**
  - Cartes Bento / Glass Cards : Padding interne unifié à `p-8` (contre `p-6`).
  - Containers max-width : `max-w-7xl` avec marges latérales `px-6 md:px-8`.
- **Grilles & Gaps :**
  - Grilles majeures : `gap-8`.
  - Sous-éléments et listes : `gap-6`.

## 4. Composants & Éléments Graphiques
- **Boutons & CTAs :** Rayons `rounded-lg`, états de survol avec lueur mint légère et transition fluide.
- **Cartes de Score (`RiskGauge`) & Dissection :** Conteneurs aérés `p-8`, séparateurs `border-border`, typographie tabulaire (`tnum`).
- **Navigation & En-têtes :** Header fixe avec flou de backdrop renforcé (`backdrop-blur-2xl`), bordure basse ultra-fine.
