# Documentation de l'Architecture Technique - Projet Expensify

## 1. Vue d'Ensemble
Le projet est une plateforme de centralisation des finances personnelles composée d'une application web moderne (Next.js) et d'une API robuste (Express.js).

### Stack Technologique
- **Frontend** : Next.js 15 (App Router), React 19, Tailwind CSS v4, **DaisyUI**.
- **Backend** : Express.js v5 (Beta), TypeScript, Node.js.
- **Base de Données** : PostgreSQL (hébergé sur Neon/Supabase), géré via **Prisma ORM**.
- **Authentification** : **Clerk** (Gestion des utilisateurs et sessions).
- **Stockage de Fichiers** : **Supabase Storage** (Documents justificatifs).

---

## 2. Architecture Backend (API)
Le backend suit une **Architecture en Couches (Layered Architecture)** stricte pour garantir la maintenance, la testabilité et la séparation des responsabilités.

### Structure des Dossiers
```
backend/src/
├── controllers/    # Gestion des requêtes HTTP (Req/Res)
├── services/       # Logique métier et appels SGBD/Externes
├── routes/         # Définition des endpoints API
├── middlewares/    # Intercepteurs (Auth, Upload)
└── types/          # Définitions TypeScript partagées
```

### Flux de Données (Data Flow)
1.  **Route (`routes/`)** : Reçoit la requête HTTP et la dirige vers le bon contrôleur. Applique les middlewares (ex: `requireAuthMiddleware`).
2.  **Contrôleur (`controllers/`)** :
    *   Valide les entrées (via **Zod**).
    *   Appelle le Service approprié.
    *   Gère les codes de réponse HTTP (200, 201, 400, etc.).
3.  **Service (`services/`)** :
    *   Contient toute la **logique métier**.
    *   Interagit avec la Base de Données via **Prisma**.
    *   Gère les appels externes (ex: Supabase Storage).
    *   Ne connait pas le contexte HTTP (pas de `req` ni `res`).

### Exemple : Création d'un Bien Immobilier
*   **POST** `/api/real-estate` -> `RealEstateController.create`
*   **Controller** : Valide le JSON body -> Appelle `RealEstateService.create(userId, data)`
*   **Service** : Prépare les données -> `prisma.realEstate.create(...)` -> Retourne l'objet

---

## 3. Architecture Frontend (Web App)
Le frontend utilise **Next.js 15** avec le **App Router** et suit une architecture orientée **Fonctionnalités (Feature-based)**.

### Structure des Dossiers
```
frontend/src/
├── app/                    # Pages et Routing (Next.js)
│   ├── dashboard/          # Routes protégées
│   │   ├── layout.tsx      # Layout partagé (Sidebar + Header)
│   │   └── page.tsx        # Dashboard principal
├── components/
│   ├── features/           # Composants métier (ex: real-estate/RealEstateManager.tsx)
│   ├── layout/             # Structure globale (Sidebar.tsx)
│   └── ui/                 # Composants atomiques (Modal.tsx, Button...)
├── hooks/                  # Custom Hooks (useRealEstate.ts)
├── services/               # Appels API (axios instance)
├── types/                  # Interfaces TypeScript
└── lib/                    # Configuration (Client API)
```

### Patterns Clés
1.  **Client API Centralisé (`lib/api.ts`)** :
    *   Instance **Axios** configurée.
    *   **Intercepteur** automatique : Injecte le token Clerk (`Authorization: Bearer <token>`) dans chaque requête.
2.  **Pattern Container/Manager** :
    *   **Manager** (ex: `RealEstateManager`) : Gère l'état, les modales et la logique (Smart Component).
    *   **Presentational** (ex: `RealEstateList`) : Reçoit les données via `props` et affiche l'UI (Dumb Component).
3.  **Design System** :
    *   **Tailwind CSS v4** : Framework utilitaire pour le styling.
    *   **DaisyUI** : Librairie de composants (Modals, Boutons) pour accélérer le développement.
4.  **Custom Hooks (`hooks/`)** :
    *   Gère l'état local (loading, error, data).
    *   Fait le lien entre les Composants UI et les Services API.
5.  **Layout System** :
    *   Layout partagé dans `app/dashboard/layout.tsx`.
    *   Sidebar persistante pour la navigation.

---

## 4. Modèle de Données (Data Model)
Les données sont structurées pour être cohérentes avec le système d'authentification externe.

*   **IDs Utilisateurs** : Stockés sous forme de `String` (ex: `user_2p...`) pour correspondre aux IDs générés par Clerk.
*   **Tables Principales** :
    *   `RealEstate` (Biens immobiliers)
    *   `Stock` (Actions/Investissements)
    *   `Transaction` (Revenus/Dépenses)
    *   `AssetDocument` (Documents liés aux actifs)
*   **Relations** : Les documents sont liés polymorphiquement aux actifs via `objectId` et `objectType`.

---

## 5. Sécurité
*   **Authentification** : Validation du token Clerk sur chaque route protégée du backend middleware.
*   **Validation** : Validation stricte des données entrantes avec **Zod** sur le backend.
*   **Type Safety** : TypeScript utilisé de bout en bout (Frontend & Backend) pour garantir la cohérence des données.
