# ÉTAPE 3 — BACKEND DE BASE

## 🎯 Objectif

Créer une API REST complète avec Supabase, PostgreSQL, et remplacer localStorage par des appels API dans le frontend.

---

## ✅ Ce qui a été implémenté

### 1. Configuration Supabase

#### `backend/src/config/supabase.js`
- Client Supabase avec clé service (opérations admin)
- Client Supabase avec clé anon (pour utilisation côté frontend)
- Gestion des variables d'environnement

### 2. Base de données PostgreSQL

#### Migration SQL (`backend/src/migrations/001_create_tables.sql`)

**Tables créées :**

1. **profiles**
   - Extension de `auth.users` (Supabase Auth)
   - Champs : `id`, `email`, `full_name`, `avatar_url`, `created_at`, `updated_at`

2. **decks**
   - `id` (UUID, primary key)
   - `user_id` (UUID, référence auth.users)
   - `name` (TEXT, requis)
   - `description` (TEXT, optionnel)
   - `card_count` (INTEGER, compteur automatique)
   - `created_at`, `updated_at` (timestamps)

3. **cards**
   - `id` (UUID, primary key)
   - `deck_id` (UUID, référence decks)
   - `question` (TEXT, requis)
   - `answer` (TEXT, requis)
   - Champs révision espacée : `ease_factor`, `interval`, `repetitions`, `next_review`
   - `created_at`, `updated_at` (timestamps)

**Fonctionnalités automatiques :**
- Triggers pour mettre à jour `updated_at`
- Triggers pour mettre à jour `card_count` automatiquement
- Index pour améliorer les performances
- RLS (Row Level Security) activé (politiques publiques temporaires)

### 3. Architecture backend

#### Structure MVC

```
backend/src/
├── config/
│   └── supabase.js          # Configuration Supabase
├── services/
│   ├── deckService.js       # Logique métier decks
│   └── cardService.js       # Logique métier cartes
├── controllers/
│   ├── deckController.js    # Contrôleurs HTTP decks
│   └── cardController.js    # Contrôleurs HTTP cartes
├── routes/
│   ├── deckRoutes.js        # Routes Express decks
│   └── cardRoutes.js        # Routes Express cartes
├── middleware/
│   └── errorHandler.js      # Gestion des erreurs
├── migrations/
│   └── 001_create_tables.sql # Migration SQL
└── server.js                 # Point d'entrée Express
```

### 4. Services métier

#### `deckService.js`
- `getAllDecks(userId)` - Récupérer tous les decks
- `getDeckById(deckId)` - Récupérer un deck
- `createDeck(deckData)` - Créer un deck
- `updateDeck(deckId, updates)` - Mettre à jour un deck
- `deleteDeck(deckId)` - Supprimer un deck

#### `cardService.js`
- `getCardsByDeck(deckId)` - Récupérer les cartes d'un deck
- `getCardById(cardId)` - Récupérer une carte
- `getCardsToReview(userId)` - Récupérer les cartes à réviser
- `createCard(cardData)` - Créer une carte
- `updateCard(cardId, updates)` - Mettre à jour une carte
- `deleteCard(cardId)` - Supprimer une carte

### 5. Routes API

#### Decks
- `GET /api/decks` - Liste tous les decks
- `GET /api/decks/:id` - Détails d'un deck
- `POST /api/decks` - Créer un deck
- `PUT /api/decks/:id` - Mettre à jour un deck
- `DELETE /api/decks/:id` - Supprimer un deck

#### Cards
- `GET /api/cards/review` - Cartes à réviser
- `GET /api/cards/deck/:deckId` - Cartes d'un deck
- `GET /api/cards/:id` - Détails d'une carte
- `POST /api/cards` - Créer une carte
- `PUT /api/cards/:id` - Mettre à jour une carte
- `DELETE /api/cards/:id` - Supprimer une carte

### 6. Frontend - Service API

#### `frontend/src/services/api.js`
- Service centralisé pour toutes les requêtes API
- Gestion des erreurs
- Conversion automatique JSON
- Support des codes HTTP 204 (No Content)

### 7. Frontend - Mise à jour du Context

#### `frontend/src/contexts/AppContext.jsx`
- Remplacement de localStorage par des appels API
- Gestion des états de chargement (`loading`)
- Gestion des erreurs (`error`)
- Fonctions asynchrones pour toutes les opérations CRUD

### 8. Pages mises à jour

- **Decks.jsx** : Chargement depuis l'API, gestion async
- **DeckDetail.jsx** : Chargement des cartes depuis l'API
- **Review.jsx** : Chargement des cartes à réviser depuis l'API
- **Home.jsx** : Statistiques depuis l'API

---

## 🗄️ Configuration de la base de données

### Étapes pour créer les tables

1. **Créer un projet Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL et les clés API

2. **Exécuter la migration SQL**
   - Ouvrir le SQL Editor dans Supabase
   - Copier le contenu de `backend/src/migrations/001_create_tables.sql`
   - Exécuter le script

3. **Configurer les variables d'environnement**
   - Créer `backend/.env` :
   ```env
   PORT=5000
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_KEY=votre_cle_anon
   SUPABASE_SERVICE_KEY=votre_cle_service_role
   ```

---

## 📝 Format des données

### Deck
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Histoire de France",
  "description": "Dates importantes",
  "card_count": 10,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Card
```json
{
  "id": "uuid",
  "deck_id": "uuid",
  "question": "Quelle est la capitale ?",
  "answer": "Paris",
  "ease_factor": 2.5,
  "interval": 1,
  "repetitions": 0,
  "next_review": "2024-01-01T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

## 🔄 Migration depuis localStorage

### Avant (Étape 2)
- Données stockées dans `localStorage`
- Pas de synchronisation
- Pas de persistance entre appareils

### Après (Étape 3)
- Données stockées dans PostgreSQL
- Synchronisation via API
- Persistance cloud

### Changements dans le code

**AppContext.jsx :**
- `useState` avec localStorage → `useState` avec API
- Fonctions synchrones → Fonctions asynchrones
- Pas de loading → États `loading` et `error`

**Pages :**
- Accès direct aux données → Appels API avec `useEffect`
- Pas de gestion async → `async/await` partout

---

## 🚀 Utilisation

### Démarrer le backend
```bash
cd backend
npm install
npm run dev
```

### Démarrer le frontend
```bash
cd frontend
npm install
npm run dev
```

### Tester l'API
```bash
# Health check
curl http://localhost:5000/api/health

# Créer un deck
curl -X POST http://localhost:5000/api/decks \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "description": "Test deck"}'

# Récupérer les decks
curl http://localhost:5000/api/decks
```

---

## ✅ Checklist de l'étape 3

- [x] Configuration Supabase
- [x] Migration SQL créée
- [x] Services métier (deckService, cardService)
- [x] Contrôleurs (deckController, cardController)
- [x] Routes API complètes
- [x] Middleware de gestion d'erreurs
- [x] Service API frontend
- [x] AppContext mis à jour pour utiliser l'API
- [x] Pages mises à jour (async/await)
- [x] Gestion des états de chargement
- [x] Gestion des erreurs

---

## 🔒 Sécurité (à améliorer à l'étape 4)

**Actuellement :**
- RLS activé mais avec politiques publiques
- Pas d'authentification
- Pas de validation des permissions

**À l'étape 4 :**
- Authentification Supabase Auth
- Politiques RLS basées sur `user_id`
- Validation JWT côté backend
- Middleware d'authentification

---

## 🐛 Problèmes connus / Limitations

1. **Pas d'authentification** : Tous les utilisateurs partagent les mêmes données
2. **user_id temporaire** : Utilisation d'un UUID par défaut
3. **Pas de validation côté serveur** : Validation uniquement côté client
4. **Pas de rate limiting** : API accessible sans limite
5. **Politiques RLS publiques** : Tous les utilisateurs peuvent voir/modifier toutes les données

Tous ces points seront résolus à l'étape 4 (Authentification).

---

## 📝 Prochaines étapes

### ÉTAPE 4 — AUTHENTIFICATION
Dans la prochaine étape, nous allons :
1. Implémenter Supabase Auth
2. Ajouter l'inscription/connexion
3. Sécuriser les routes API avec JWT
4. Mettre à jour les politiques RLS
5. Gérer la session côté frontend

---

## 💡 Notes importantes

1. **Migration SQL** : Exécutez-la une seule fois dans Supabase. Les triggers et fonctions sont créés automatiquement.

2. **Variables d'environnement** : Ne jamais commiter les fichiers `.env`. Utilisez `.env.example` comme modèle.

3. **Supabase Keys** :
   - `SUPABASE_KEY` (anon) : Clé publique, peut être exposée côté frontend
   - `SUPABASE_SERVICE_KEY` : Clé secrète, uniquement côté backend

4. **Performance** : Les index créés sur `user_id`, `deck_id`, et `next_review` améliorent les performances des requêtes.

5. **Compteur de cartes** : Mis à jour automatiquement via les triggers PostgreSQL. Pas besoin de le gérer manuellement.

---

**✅ ÉTAPE 3 TERMINÉE** — Le backend est maintenant fonctionnel avec Supabase et PostgreSQL !








