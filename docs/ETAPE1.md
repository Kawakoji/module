# ÉTAPE 1 — CONFIGURATION DU PROJET

## 🎯 Objectif

Mettre en place la structure de base du projet avec frontend, backend et configuration des outils de développement.

---

## 🔧 Technologies choisies

### Frontend
- **React 18** : Bibliothèque UI moderne et performante
- **Vite 5** : Build tool ultra-rapide pour le développement
- **TailwindCSS 3** : Framework CSS utilitaire pour un design rapide
- **React Router 6** : Navigation côté client
- **Supabase Client** : Pour l'authentification et la base de données

### Backend
- **Node.js 20** : Runtime JavaScript moderne
- **Express 4** : Framework web minimaliste
- **Supabase JS** : Client pour interagir avec Supabase
- **CORS** : Gestion des requêtes cross-origin
- **dotenv** : Gestion des variables d'environnement

### Base de données et Services
- **PostgreSQL** : Via Supabase (hébergé)
- **Supabase Auth** : Authentification prête à l'emploi
- **OpenAI API** : Pour la génération de cartes avec IA

---

## 📁 Structure des dossiers créée

```
moduleia/
├── frontend/
│   ├── src/
│   │   ├── components/      # Composants réutilisables
│   │   │   └── Layout.jsx   # Layout principal avec navigation
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── Home.jsx     # Page d'accueil
│   │   │   ├── Decks.jsx    # Liste des decks
│   │   │   └── Review.jsx   # Page de révision
│   │   ├── hooks/           # Custom React hooks (à venir)
│   │   ├── services/        # Services API (à venir)
│   │   ├── utils/           # Utilitaires (à venir)
│   │   ├── App.jsx          # Composant racine avec routing
│   │   ├── main.jsx         # Point d'entrée React
│   │   └── index.css        # Styles globaux TailwindCSS
│   ├── public/              # Fichiers statiques
│   ├── index.html           # HTML principal
│   ├── package.json         # Dépendances frontend
│   ├── vite.config.js       # Configuration Vite
│   ├── tailwind.config.js   # Configuration TailwindCSS
│   └── postcss.config.js    # Configuration PostCSS
│
├── backend/
│   ├── src/
│   │   ├── routes/          # Routes API (à venir)
│   │   ├── controllers/     # Contrôleurs (à venir)
│   │   ├── models/          # Modèles de données (à venir)
│   │   ├── middleware/      # Middleware Express (à venir)
│   │   ├── services/        # Services métier (à venir)
│   │   └── server.js        # Point d'entrée du serveur
│   ├── package.json         # Dépendances backend
│   └── .env.example         # Exemple de variables d'environnement
│
├── docs/
│   ├── ETAPES.md            # Vue d'ensemble des étapes
│   └── ETAPE1.md            # Cette documentation
│
├── .gitignore               # Fichiers ignorés par Git
└── README.md                # Documentation principale
```

---

## ⚙️ Configuration détaillée

### Frontend - package.json

Le fichier `package.json` du frontend inclut :
- **React 18** et **React DOM** pour l'interface
- **React Router DOM** pour la navigation
- **@supabase/supabase-js** pour l'authentification
- **TailwindCSS** et ses dépendances (PostCSS, Autoprefixer)
- **Vite** et le plugin React
- **ESLint** pour la qualité du code

### Backend - package.json

Le fichier `package.json` du backend inclut :
- **Express** pour le serveur HTTP
- **CORS** pour autoriser les requêtes cross-origin
- **dotenv** pour charger les variables d'environnement
- **@supabase/supabase-js** pour interagir avec Supabase
- **Nodemon** (dev) pour le rechargement automatique

### TailwindCSS Configuration

Le fichier `tailwind.config.js` configure :
- **Dark mode** : Activé via la classe `dark`
- **Couleurs personnalisées** : Palette primary (bleu)
- **Contenu** : Tous les fichiers JSX/TSX dans `src/`

### Vite Configuration

Le fichier `vite.config.js` configure :
- **Proxy API** : Redirige `/api/*` vers `http://localhost:5000`
- **Port** : Frontend sur le port 3000
- **Plugin React** : Support JSX

---

## 🚀 Commandes à exécuter

### 1. Installer les dépendances frontend

```bash
cd frontend
npm install
```

### 2. Installer les dépendances backend

```bash
cd backend
npm install
```

### 3. Configurer les variables d'environnement

#### Frontend (.env)
Créez `frontend/.env` :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_supabase
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
Créez `backend/.env` :
```env
PORT=5000
SUPABASE_URL=votre_url_supabase
SUPABASE_KEY=votre_cle_supabase_anon
SUPABASE_SERVICE_KEY=votre_cle_supabase_service
OPENAI_API_KEY=votre_cle_openai
```

### 4. Démarrer le développement

**Terminal 1 - Frontend :**
```bash
cd frontend
npm run dev
```
Le frontend sera accessible sur `http://localhost:3000`

**Terminal 2 - Backend :**
```bash
cd backend
npm run dev
```
Le backend sera accessible sur `http://localhost:5000`

---

## ✅ Vérification

### Frontend
- ✅ Vite configuré avec React
- ✅ TailwindCSS installé et configuré
- ✅ Routing de base (Home, Decks, Review)
- ✅ Layout avec navigation
- ✅ Styles globaux avec classes utilitaires

### Backend
- ✅ Express configuré
- ✅ Route de santé `/api/health`
- ✅ Routes placeholder pour `/api/decks` et `/api/cards`
- ✅ CORS activé
- ✅ Support JSON

---

## 🎨 Classes CSS personnalisées

Dans `frontend/src/index.css`, nous avons défini :

- `.card` : Conteneur de carte avec ombre et padding
- `.btn-primary` : Bouton principal (bleu)
- `.btn-secondary` : Bouton secondaire (gris)
- `.input` : Champ de saisie stylisé avec support dark mode

---

## 📝 Prochaines étapes

### ÉTAPE 2 — FRONTEND DE BASE
Dans la prochaine étape, nous allons :
1. Créer les composants de formulaire pour créer des decks
2. Ajouter la gestion d'état (localStorage ou context)
3. Améliorer l'interface avec des composants réutilisables
4. Ajouter un toggle pour le mode sombre

### Améliorations possibles
- Ajouter TypeScript pour un typage fort
- Configurer ESLint avec des règles strictes
- Ajouter Prettier pour le formatage automatique
- Configurer Husky pour les pre-commit hooks

---

## 🔗 Ressources

- [Documentation Vite](https://vitejs.dev/)
- [Documentation TailwindCSS](https://tailwindcss.com/)
- [Documentation React Router](https://reactrouter.com/)
- [Documentation Supabase](https://supabase.com/docs)

---

## 💡 Notes importantes

1. **Variables d'environnement** : Ne commitez jamais les fichiers `.env` dans Git. Utilisez `.env.example` comme modèle.

2. **Ports** : Si les ports 3000 ou 5000 sont occupés, modifiez-les dans les fichiers de configuration.

3. **Supabase** : Vous devrez créer un projet Supabase gratuit sur [supabase.com](https://supabase.com) pour obtenir les clés d'API.

4. **OpenAI** : Vous aurez besoin d'une clé API OpenAI pour la génération de cartes (étape 7).

---

**✅ ÉTAPE 1 TERMINÉE** — La structure de base du projet est en place !








