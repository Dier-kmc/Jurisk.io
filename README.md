# Jurisk.io - Plateforme d'Analyse Contractuelle par Intelligence Artificielle

## 📖 Présentation

**Jurisk.io** est une solution SaaS innovante dédiée à l'analyse de contrats juridiques. En utilisant des modèles de langage souverains et avancés, la plateforme permet une dissection chirurgicale des documents (PDF, Word) pour identifier instantanément les risques, obligations et leviers de négociation.

Le projet a évolué d'une simple vision MVP vers une application "Premium" au design sophistiqué (Glassmorphism, Dark UI) et au modèle économique flexible basé sur des crédits.

## 🚀 Fonctionnalités Principales

### 🔍 Analyse Intelligente

- **Extraction des Risques** : Identification et scoring des clauses dangereuses.
- **Synthèse Structurée** : Résumé exécutif, obligations des parties, et pouvoirs clés.
- **Scénarisation** : Simulation de scénarios juridiques probables basée sur le contenu du contrat.

### 💳 Système de Crédits (Refonte)

- **Modèle Flexible** : Pas d'abonnement forcé. Paiement à l'usage via des packs de crédits.
- **Franchise Mensuelle** : **3 crédits offerts** chaque mois à tous les utilisateurs (Free Tier).
- **Packs** : Achat de crédits supplémentaires valables à vie (Pack Essentiel, Pro, Business).

### 🖥️ Expérience Utilisateur Premium

- **Interface Immersive** : Design sombre, effets de bruit, gradients subtils et typographie soignée.
- **Upload Simplifié** : Drag & drop intuitif, support multi-formats (PDF, DOCX).
- **Dashboard Dynamique** : Suivi des analyses, tri par statut, et accès rapide aux résultats.

## 🛠️ Stack Technique

Ce projet est construit sur une stack moderne et robuste :

### **Frontend & Core**

- **Next.js 14** (App Router) : Framework React pour le rendu hybride et l'API.
- **TypeScript** : Pour la sécurité et la robustesse du code.
- **Tailwind CSS** : Styling utilitaire rapide.
- **Framer Motion** : Animations fluides et transitions d'interface.
- **Lucide React** : Iconographie cohérente.

### **Backend & Data**

- **Prisma ORM** : Gestion de la base de données (SQLite en dev, PostgreSQL ready).
- **NextAuth.js** : Authentification sécurisée (Email/Password, Google, Github).
- **Server Actions** : Logique serveur intégrée.

### **IA & Traitement**

- **OpenAI API / Mistral** (simulé ou intégré) : Moteur d'analyse sémantique.
- **LangChain** (concepts) : Structuration des prompts et des réponses.

## 🏗️ Installation et Démarrage

### Prérequis

- Node.js 18+
- NPM ou PNPM

### Étapes

1. **Cloner le projet**

   ```bash
   git clone https://github.com/votre-repo/jurisk-io.git
   cd jurisk-io
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer l'environnement**
   Dupliquez le fichier `.env.example` en `.env` et renseignez vos clés :

   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="votre_secret"
   NEXTAUTH_URL="http://localhost:3000"
   # Clés API pour l'IA et Stripe si nécessaire
   ```

4. **Initialiser la base de données**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```
   Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## 📄 Structure du Projet

- `src/app` : Pages et routes API (App Router).
- `src/components` : Composants UI réutilisables (Design System).
- `src/lib` : Utilitaires, hooks, et services (Auth, DB, Analysis).
- `src/types` : Définitions TypeScript partagées.
- `prisma` : Schéma de base de données.

---

_Jurisk.io - L'expertise sans la latence._
