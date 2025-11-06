# 🚀 Déploiement sur Vercel avec Neon

Guide spécifique pour déployer Moduleia sur Vercel (frontend + backend) avec Neon comme base de données.

---

## 📋 Prérequis

- Compte [Neon](https://neon.tech) (gratuit) - Base de données PostgreSQL
- Compte [Supabase](https://supabase.com) (gratuit) - Uniquement pour l'authentification
- Compte [Vercel](https://vercel.com) (gratuit) - Hébergement
- Clé API OpenAI (optionnel, pour la génération IA)
- Git (pour le déploiement)

---

## 🗄️ 1. Configuration Neon

### Créer une base de données Neon

1. Aller sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Noter la **Connection String** (format : `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)

### Exécuter les migrations

1. Dans Neon Dashboard, aller dans **SQL Editor**
2. Exécuter les migrations dans l'ordre :
   - `backend/src/migrations/001_create_tables.sql`
   - `backend/src/migrations/002_update_rls_policies.sql`

**⚠️ IMPORTANT** : Neon n'a pas de système d'auth intégré comme Supabase. Les politiques RLS qui utilisent `auth.uid()` ne fonctionneront pas directement. Il faut adapter.

### Adapter les migrations pour Neon

**Option 1** : Garder Supabase Auth + Neon DB
- Utiliser Supabase uniquement pour l'authentification
- Utiliser Neon pour la base de données
- Les politiques RLS doivent être adaptées (voir ci-dessous)

**Option 2** : Auth personnalisée
- Créer un système d'auth avec JWT
- Utiliser Neon pour tout

**Nous allons utiliser l'Option 1** (recommandé pour simplicité).

---

## 🔐 2. Configuration Supabase (Auth uniquement)

1. Créer un projet Supabase (gratuit)
2. Aller dans **Authentication → Settings**
3. Activer Email/Password
4. Noter l'URL et les clés API

**Note** : On utilise Supabase uniquement pour l'authentification, pas pour la base de données.

---

## 🚀 3. Déploiement sur Vercel

### Préparation

1. **Pousser le code sur GitHub** :
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Vérifier les fichiers** :
   - `vercel.json` à la racine (pour monorepo)
   - `frontend/vercel.json` (pour frontend seul)
   - `backend/api/index.js` (point d'entrée backend)

### Déploiement Monorepo (Frontend + Backend)

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Importer le projet** depuis GitHub
3. **Configuration** :
   - **Root Directory** : `.` (racine)
   - **Framework Preset** : Other
   - **Build Command** : `cd frontend && npm run build`
   - **Output Directory** : `frontend/dist`
   - **Install Command** : `npm install` (Vercel détectera automatiquement les packages.json)

### Variables d'environnement Vercel

Ajouter dans **Settings → Environment Variables** :

**Pour le Frontend** :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=https://votre-app.vercel.app/api
```

**Pour le Backend** :
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
OPENAI_API_KEY=sk-...
```

**Important** : Vérifier que les variables sont disponibles pour :
- **Production**
- **Preview** (optionnel)
- **Development** (optionnel)

### Déploiement

1. Vercel va automatiquement :
   - Installer les dépendances
   - Builder le frontend
   - Déployer les Serverless Functions (backend)

2. **Premier déploiement** peut prendre 2-3 minutes

3. **URLs** :
   - Frontend : `https://votre-app.vercel.app`
   - Backend API : `https://votre-app.vercel.app/api`

---

## 🔧 4. Adaptation pour Neon

### Modifier les services pour utiliser Neon

Les services utilisent actuellement Supabase JS. Pour Neon, il faut utiliser `pg` directement.

**Exemple** (`backend/src/services/deckService.js`) :

```javascript
// Option 1 : Utiliser Supabase JS (reste compatible)
// Pas de changement nécessaire si on garde Supabase

// Option 2 : Utiliser Neon directement
import { query } from '../config/database.js'

export const deckService = {
  async getAllDecks(userId, options = {}) {
    const { page = 1, limit = 20 } = options
    const offset = (page - 1) * limit
    
    const result = await query(
      'SELECT * FROM decks WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    )
    
    return result.rows
  }
}
```

**⚠️ Note** : Pour simplifier, on peut garder Supabase JS même avec Neon en utilisant la connection string de Neon dans `SUPABASE_URL`. Mais c'est moins optimal.

### Adapter les RLS policies

Neon n'a pas `auth.uid()` comme Supabase. Il faut :

**Option 1** : Désactiver RLS et gérer l'isolation dans le code
- Retirer les politiques RLS
- Vérifier `user_id` dans chaque requête

**Option 2** : Créer une fonction PostgreSQL personnalisée
- Créer une fonction qui retourne l'user_id depuis le JWT
- Utiliser cette fonction dans les politiques

**Pour l'instant, nous recommandons l'Option 1** (plus simple).

---

## 📝 5. Migration SQL pour Neon

### Créer les tables sans RLS strict

```sql
-- Désactiver RLS temporairement (ou adapter)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;

-- Les vérifications d'ownership se feront dans le code backend
```

---

## ✅ Checklist de déploiement

### Avant le déploiement

- [ ] Code poussé sur GitHub
- [ ] Neon database créée et migrations exécutées
- [ ] Supabase configuré (auth uniquement)
- [ ] Variables d'environnement préparées
- [ ] `vercel.json` créé
- [ ] `backend/api/index.js` créé

### Déploiement Vercel

- [ ] Projet importé sur Vercel
- [ ] Variables d'environnement ajoutées
- [ ] Build réussi
- [ ] Frontend accessible
- [ ] Backend API accessible (`/api/health`)
- [ ] Authentification fonctionnelle
- [ ] Base de données connectée

### Tests post-déploiement

- [ ] Créer un compte
- [ ] Se connecter
- [ ] Créer un deck
- [ ] Créer une carte
- [ ] Réviser une carte
- [ ] Vérifier les statistiques

---

## 🐛 Dépannage

### Erreur de connexion à la base de données

```bash
# Vérifier DATABASE_URL
# Format : postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### Erreur CORS

```bash
# Vérifier que VITE_API_URL pointe vers le bon domaine
# Exemple : https://votre-app.vercel.app/api
```

### Erreur 404 sur les routes API

```bash
# Vérifier vercel.json
# Les routes /api/* doivent pointer vers backend/src/server.js
```

### Build échoue

```bash
# Vérifier les logs dans Vercel Dashboard
# Vérifier que tous les packages.json sont corrects
```

---

## 🔄 Architecture Finale

```
┌─────────────────┐
│   Frontend      │
│   (Vercel)      │
│   React + Vite  │
└────────┬────────┘
         │
         ├─► Supabase Auth (authentification)
         │
         └─► Backend API (Vercel Serverless)
                  │
                  ├─► Neon Database (PostgreSQL)
                  │
                  └─► OpenAI API (génération IA)
```

---

## 💡 Avantages de cette architecture

✅ **Vercel** : Déploiement simple, gratuit, excellent pour React
✅ **Neon** : PostgreSQL serverless, gratuit, scalable
✅ **Supabase Auth** : Auth complète et sécurisée
✅ **Tout en un** : Frontend + Backend sur Vercel

---

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

---

**✅ Déploiement terminé !** Votre application est maintenant en production sur Vercel avec Neon.




