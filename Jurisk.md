# Jurisk

## Présentation

Jurisk est une application SaaS d’aide à la lecture et à la négociation de contrats. Elle transforme un fichier PDF, DOC, DOCX ou TXT en une analyse structurée : contexte du contrat, parties, obligations, priorités, conséquences, questions ouvertes, preuves textuelles et formulations de négociation.

Jurisk ne remplace pas un avocat et ne fournit pas un avis juridique. Le produit sert à mieux comprendre un document et à préparer une décision ou une discussion.

## Stack technique

- **Frontend et serveur** : Next.js `16.1.6`, App Router, React `19.2.3`, TypeScript.
- **Styles** : Tailwind CSS `4`, PostCSS, CSS global dans `src/app/globals.css`, icônes Lucide React.
- **Authentification** : NextAuth.js v4, sessions JWT, connexion email/mot de passe et Google, adaptateur Prisma.
- **Base de données** : PostgreSQL Supabase, Prisma `5.12`, migrations dans `prisma/migrations`.
- **Stockage** : Supabase Storage, bucket `jurisk-io`.
- **Analyse documentaire** : `pdf2json` pour PDF, `mammoth` pour DOCX, extraction de texte et segmentation par page/section.
- **IA** : OpenRouter via `node-fetch`, modèle configuré par `OPENROUTER_MODEL`, avec fallback de modèle.
- **Sécurité et validation** : bcryptjs, jose/jsonwebtoken pour les anciens endpoints, Zod disponible pour les validations.
- **Outils** : Prisma CLI, npm, Turbopack en développement et en build Next.js.

## Architecture actuelle

Les routes publiques sont dans `src/app/(public)` : accueil, méthode, rapport, tarifs, ressources, guides, audiences, authentification et pages légales. Elles utilisent leurs propres composants dans `src/components/public` et la direction visuelle ivoire/bleu/corail.

Le dashboard est dans `src/app/(dashboard)` :

- `/upload` : import d’un contrat et définition de son contexte ;
- `/analyses` : historique des contrats de l’utilisateur ;
- `/result/[id]` : rapport de lecture structuré.

Les anciens composants dashboard, upload et résultats ont été remplacés par `src/components/dashboard/DashboardFrame.tsx` et des interfaces propres aux nouvelles données d’analyse.

## Parcours d’analyse

1. L’utilisateur se connecte ou crée un compte.
2. Il renseigne la juridiction, la famille de contrat, sa partie et son objectif.
3. `POST /api/upload` valide le fichier, extrait le texte, crée le contrat et décompte un crédit.
4. Le contrat est enregistré en statut `PROCESSING`.
5. `analyzeContract()` segmente le document et lance l’analyse OpenRouter en arrière-plan.
6. Les findings sans preuve exploitable sont écartés. Les autres sont classés `urgent`, `important` ou `monitor`.
7. L’analyse stocke les données structurées sous forme de chaînes JSON dans `Analysis`.
8. Le rapport affiche les priorités, les conséquences, la position recommandée, les questions, les obligations et les extraits sources.

Le score de confiance est calculé comme la moyenne des niveaux de confiance des findings sourcés. Il est enregistré dans `summary.confidenceScore`, avec compatibilité pour les anciennes analyses via `summary.clarity_score`.

## Fonctionnalités réalisées

- Authentification email/mot de passe et Google.
- Gestion des crédits avec recharge mensuelle jusqu’à trois crédits.
- Upload et extraction de PDF, DOCX, DOC et TXT.
- Segmentation des sources et citations vérifiables.
- Analyse orientée négociation avec contexte utilisateur.
- Inventaire des parties, obligations et clauses manquantes.
- Priorités, questions ouvertes et formulations de négociation.
- Historique personnel des analyses.
- Synchronisation des crédits entre le header et l’écran d’upload.
- Nouvelle UI publique et nouveau dashboard éditorial sans composants du dashboard historique.
- Logo `J/`, palette bleue, ombres dures décalées et interfaces sans arrondis dans les zones refondues.
- Pages publiques Confidentialité, Conditions, Accessibilité et Guides.

## Variables d’environnement

Les variables requises sont dans `.env`, qui ne doit jamais être commitée :

```env
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=
```

Après une modification de `.env`, redémarrer le serveur Next.js. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET` ou `OPENROUTER_API_KEY` dans le navigateur, les logs ou le dépôt.

## Problèmes rencontrés et résolutions

### Historique Prisma SQLite/PostgreSQL

L’ancien `migration_lock.toml` déclarait SQLite alors que `schema.prisma` utilise PostgreSQL. Prisma retournait `P3019`. L’historique SQLite a été remplacé par une nouvelle migration PostgreSQL et la base Supabase a été réinitialisée avant le déploiement de cette nouvelle histoire.

Toujours vérifier que `prisma/schema.prisma`, `migration_lock.toml` et `DATABASE_URL` utilisent le même fournisseur. Après une modification du schéma, redémarrer le serveur pour éviter un client Prisma mis en cache.

### Connexion directe Supabase

Le port PostgreSQL direct Supabase peut être inaccessible depuis certains réseaux. Utiliser l’URL pooler Supabase adaptée à l’environnement lorsque `P1001` apparaît. Vérifier également que la base est active et que les règles réseau autorisent la connexion.

### En-tête OpenRouter invalide

Une valeur OpenRouter incomplète ou entourée de caractères parasites provoquait `Invalid character in header content ["Authorization"]`. Les services valident maintenant la clé, retirent les guillemets externes et renvoient une erreur de configuration explicite. Une clé complète doit rester dans `.env`, puis le serveur doit être redémarré.

### Crédits différents entre les écrans

Le header utilisait auparavant les crédits figés dans la session NextAuth tandis que `/upload` interrogeait la base. Le hook `useCredits` utilise désormais `/api/user/credits` comme source unique et diffuse un événement `jurisk:credits-updated` après une analyse.

### Clés React dupliquées

Certains findings générés par l’IA pouvaient partager le même identifiant. Le rapport ajoute maintenant l’index de rendu à la clé React afin de garantir une identité unique sans modifier l’identifiant métier.

### URL des fichiers stockés

La valeur historique `fileUrl` peut contenir `/uploads/...`, alors que l’objet réel se trouve dans Supabase Storage. Il faut construire l’URL publique Supabase avec le bucket `jurisk-io`. Les fichiers `/uploads/*` sont bloqués par le proxy pour éviter une exposition incorrecte.

### Build Turbopack

Le build peut échouer avec `Operation not permitted` lorsque l’environnement interdit à Turbopack de créer un processus ou de binder un port pendant le traitement CSS. Ce problème est lié à l’environnement d’exécution ; vérifier les permissions, lancer le build dans un environnement Node autorisé ou utiliser une configuration CI compatible.

## Commandes utiles

```bash
npm run dev
npm run build
npm run start
npx tsc --noEmit
npx prisma generate
npx prisma migrate deploy
npx prisma migrate dev --name nom_de_la_migration
```

Le projet ne possède actuellement ni framework de tests, ni configuration ESLint/Prettier, ni pipeline CI. Toute modification doit au minimum passer par `npx tsc --noEmit` et `git diff --check`, puis être vérifiée manuellement sur les parcours concernés.

## Points de vigilance

- Les champs JSON du modèle `Analysis` doivent toujours être parsés avant utilisation.
- L’analyse est lancée en arrière-plan après l’upload ; le rapport doit donc gérer `PENDING` et `PROCESSING`.
- Les findings doivent rester reliés à une source vérifiable.
- Les textes et commentaires de l’interface sont en français ; les identifiants de code restent en anglais.
- Ne pas réintroduire les anciens composants supprimés du dashboard sans nécessité fonctionnelle.
