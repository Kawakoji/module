# 🎴 Moduleia - Application de Flashcards Intelligente

Application moderne de flashcards avec assistance IA, inspirée de Retain.cards.

## ✨ Fonctionnalités

- 📚 **Création de decks** : Organisez vos cartes par catégories
- 🎴 **Cartes mémoire** : Créez des questions/réponses manuellement
- 🤖 **Génération IA** : Générez automatiquement des cartes à partir de texte
- 📄 **Import de documents** : Importez PDF ou texte pour créer des cartes
- 📊 **Révision espacée** : Algorithme SM2 pour optimiser la mémorisation
- 📈 **Statistiques** : Suivez votre progression
- 🌙 **Mode sombre** : Interface adaptée à vos préférences

## 🚀 Technologies

- **Frontend** : React 18 + Vite 5 + TailwindCSS 3
- **Backend** : Node.js 20 + Express 4
- **Base de données** : PostgreSQL (Neon ou Supabase)
- **Authentification** : Supabase Auth
- **IA** : OpenAI API
- **Déploiement** : Vercel (frontend + backend)

## 📋 Structure du projet

```
moduleia/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/    # Composants réutilisables
│   │   ├── pages/         # Pages de l'application
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Services API
│   │   └── utils/         # Utilitaires
│   └── package.json
├── backend/           # API Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── controllers/   # Contrôleurs
│   │   ├── models/        # Modèles de données
│   │   └── server.js
│   └── package.json
├── docs/              # Documentation des étapes
└── README.md
```

## 🚀 Démarrage rapide

### 1. Installer les dépendances

**Frontend :**
```bash
cd frontend
npm install
```

**Backend :**
```bash
cd backend
npm install
```

### 2. Configurer les variables d'environnement

Créez les fichiers `.env` dans `frontend/` et `backend/` (voir `.env.example`)

**Frontend (.env) :**
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=http://localhost:5000
```

**Backend (.env) :**
```env
PORT=5000
NODE_ENV=development

# Supabase (pour l'authentification)
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role

# Neon (pour la base de données) - OU utiliser Supabase DB
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# OpenAI (optionnel)
OPENAI_API_KEY=votre_cle_openai
```

### 3. Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:3000
- Backend : http://localhost:5000

## 📚 Documentation

- **[Guide de démarrage rapide](./docs/QUICKSTART.md)** : Installation en 5 minutes
- **[Guide étape par étape](./docs/ETAPES.md)** : Vue d'ensemble des 12 étapes
- **[Guide de déploiement](./docs/DEPLOYMENT.md)** : Déploiement en production (Render/Railway)
- **[Déploiement Vercel + Neon](./docs/DEPLOYMENT_VERCEL_NEON.md)** : Déploiement sur Vercel avec Neon
- **[Checklist de déploiement](./docs/CHECKLIST_DEPLOYMENT.md)** : Checklist complète
- **[Récapitulatif final](./docs/RECAPITULATIF.md)** : Vue d'ensemble complète du projet

### Documentation des étapes

- [Étape 1 - Configuration](./docs/ETAPE1.md)
- [Étape 2 - Frontend de base](./docs/ETAPE2.md)
- [Étape 3 - Backend de base](./docs/ETAPE3.md)
- [Étape 4 - Authentification](./docs/ETAPE4.md)
- [Étape 5 - Gestion des decks et cartes](./docs/ETAPE5.md)
- [Étape 6 - Système de révision espacée](./docs/ETAPE6.md)
- [Étape 7 - IA de génération de cartes](./docs/ETAPE7.md)
- [Étape 8 - Import de documents](./docs/ETAPE8.md)
- [Étape 9 - Améliorations UX/UI](./docs/ETAPE9.md)
- [Étape 10 - Sauvegarde et synchronisation](./docs/ETAPE10.md)
- [Étape 11 - Statistiques et profil](./docs/ETAPE11.md)
- [Étape 12 - Tests et déploiement](./docs/ETAPE12.md)

## 🧩 Plan de développement

Le projet est développé en 12 étapes progressives :

1. ✅ Configuration du projet
2. ✅ Frontend de base
3. ✅ Backend de base
4. ✅ Authentification
5. ✅ Gestion des decks et cartes
6. ✅ Système de révision espacée
7. ✅ IA de génération de cartes
8. ✅ Import de documents
9. ✅ Améliorations UX/UI
10. ✅ Sauvegarde et synchronisation
11. ✅ Statistiques et profil
12. ✅ Tests et déploiement

**🎉 PROJET TERMINÉ !**

Voir `docs/ETAPES.md` pour le guide complet et `docs/RECAPITULATIF.md` pour le récapitulatif final.

## 🛠️ Scripts disponibles

### Frontend
- `npm run dev` : Démarrer le serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build

### Backend
- `npm run dev` : Démarrer avec nodemon (rechargement auto)
- `npm start` : Démarrer en production

## 📝 Prérequis

- Node.js 20+
- npm ou yarn
- Compte Neon (gratuit) : [neon.tech](https://neon.tech) - Base de données PostgreSQL
- Compte Supabase (gratuit) : [supabase.com](https://supabase.com) - Uniquement pour l'authentification
- Compte Vercel (gratuit) : [vercel.com](https://vercel.com) - Hébergement
- Clé API OpenAI (optionnel, pour la génération IA)

## 🤝 Contribution

Ce projet est développé étape par étape. Consultez la documentation pour suivre le développement progressif.

## 📄 Licence

MIT

