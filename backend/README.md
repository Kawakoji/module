# Moduleia Backend API

API REST pour l'application Moduleia - Flashcards intelligentes.

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

1. Créez un fichier `.env` à la racine du dossier `backend/`
2. Ajoutez vos variables d'environnement :

```env
PORT=5000
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
```

## 🗄️ Base de données

### Créer les tables dans Supabase

1. Allez dans votre projet Supabase
2. Ouvrez le SQL Editor
3. Exécutez le script `src/migrations/001_create_tables.sql`

Ou via la ligne de commande :
```bash
# Installer Supabase CLI si nécessaire
npm install -g supabase

# Lier votre projet
supabase link --project-ref votre-project-ref

# Exécuter la migration
supabase db push
```

## 🏃 Démarrer le serveur

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📡 Routes API

### Health Check
- `GET /api/health` - Vérifier l'état de l'API

### Decks
- `GET /api/decks` - Récupérer tous les decks
- `GET /api/decks/:id` - Récupérer un deck par ID
- `POST /api/decks` - Créer un nouveau deck
- `PUT /api/decks/:id` - Mettre à jour un deck
- `DELETE /api/decks/:id` - Supprimer un deck

### Cards
- `GET /api/cards/review` - Récupérer les cartes à réviser
- `GET /api/cards/deck/:deckId` - Récupérer les cartes d'un deck
- `GET /api/cards/:id` - Récupérer une carte par ID
- `POST /api/cards` - Créer une nouvelle carte
- `PUT /api/cards/:id` - Mettre à jour une carte
- `DELETE /api/cards/:id` - Supprimer une carte

## 📝 Exemples de requêtes

### Créer un deck
```bash
curl -X POST http://localhost:5000/api/decks \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Histoire de France",
    "description": "Dates et événements importants"
  }'
```

### Créer une carte
```bash
curl -X POST http://localhost:5000/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "deck_id": "uuid-du-deck",
    "question": "Quelle est la capitale de la France ?",
    "answer": "Paris"
  }'
```

## 🏗️ Structure

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuration Supabase
│   ├── controllers/
│   │   ├── deckController.js    # Contrôleurs pour les decks
│   │   └── cardController.js     # Contrôleurs pour les cartes
│   ├── services/
│   │   ├── deckService.js       # Services métier pour les decks
│   │   └── cardService.js       # Services métier pour les cartes
│   ├── routes/
│   │   ├── deckRoutes.js        # Routes pour les decks
│   │   └── cardRoutes.js        # Routes pour les cartes
│   ├── middleware/
│   │   └── errorHandler.js      # Gestion des erreurs
│   ├── migrations/
│   │   └── 001_create_tables.sql # Migration SQL
│   └── server.js                # Point d'entrée
└── package.json
```

## 🔒 Sécurité

⚠️ **Note importante** : Pour l'instant, les politiques RLS permettent l'accès public. 
À l'étape 4, nous ajouterons l'authentification et sécuriserons les routes.




