# 🚀 Guide de Déploiement - Moduleia

Guide complet pour déployer Moduleia en production.

---

## 📋 Prérequis

- Compte [Supabase](https://supabase.com) (gratuit)
- Compte [Vercel](https://vercel.com) (gratuit) pour le frontend
- Compte [Render](https://render.com) ou [Railway](https://railway.app) (gratuit) pour le backend
- Clé API OpenAI (optionnel, pour la génération IA)
- Git (pour le déploiement)

---

## 🗄️ 1. Configuration Supabase

### Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Noter l'URL et les clés API

### Configurer la base de données

1. Aller dans **SQL Editor**
2. Exécuter les migrations dans l'ordre :
   - `backend/src/migrations/001_create_tables.sql`
   - `backend/src/migrations/002_update_rls_policies.sql`

### Configurer les politiques RLS

Les politiques Row Level Security sont déjà définies dans les migrations. Vérifiez qu'elles sont actives :

- `profiles` : Les utilisateurs peuvent voir/modifier leur propre profil
- `decks` : Les utilisateurs peuvent voir/modifier leurs propres decks
- `cards` : Les utilisateurs peuvent voir/modifier leurs propres cartes

---

## 🎨 2. Déploiement Frontend (Vercel)

### Préparation

1. **Build du projet** :
```bash
cd frontend
npm install
npm run build
```

2. **Variables d'environnement** :
Créer un fichier `.env.production` :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=https://votre-backend.render.com/api
```

### Déploiement sur Vercel

1. **Via GitHub** (recommandé) :
   - Pousser le code sur GitHub
   - Aller sur [vercel.com](https://vercel.com)
   - Importer le projet
   - Configurer :
     - **Root Directory** : `frontend`
     - **Build Command** : `npm run build`
     - **Output Directory** : `dist`
     - **Install Command** : `npm install`
   - Ajouter les variables d'environnement dans Vercel
   - Déployer

2. **Via CLI** :
```bash
npm install -g vercel
cd frontend
vercel
```

### Configuration Vercel

**Variables d'environnement à ajouter** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL`

**Build Settings** :
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

---

## ⚙️ 3. Déploiement Backend (Render)

### Préparation

1. **Variables d'environnement** :
Créer un fichier `.env.production` :
```env
NODE_ENV=production
PORT=5000
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
OPENAI_API_KEY=votre_cle_openai
```

### Déploiement sur Render

1. **Créer un nouveau Web Service** :
   - Aller sur [render.com](https://render.com)
   - Cliquer sur "New" → "Web Service"
   - Connecter votre repository GitHub

2. **Configuration** :
   - **Name** : `moduleia-backend`
   - **Environment** : `Node`
   - **Build Command** : `cd backend && npm install`
   - **Start Command** : `cd backend && npm start`
   - **Root Directory** : `backend`

3. **Variables d'environnement** :
   - Ajouter toutes les variables du `.env.production`

4. **Déployer** :
   - Cliquer sur "Create Web Service"
   - Render va automatiquement builder et déployer

### Configuration Render

**Settings** :
- Auto-Deploy: `Yes` (déploie automatiquement à chaque push)
- Health Check Path: `/api/health`

**Environnement** :
- Node Version: `20.x`

---

## 🚂 Alternative : Railway

### Déploiement sur Railway

1. **Créer un projet** :
   - Aller sur [railway.app](https://railway.app)
   - Cliquer sur "New Project"
   - Sélectionner "Deploy from GitHub repo"

2. **Configuration** :
   - Sélectionner le repository
   - Railway détecte automatiquement Node.js
   - Configurer :
     - **Root Directory** : `backend`
     - **Start Command** : `npm start`

3. **Variables d'environnement** :
   - Ajouter toutes les variables nécessaires

4. **Déployer** :
   - Railway déploie automatiquement

---

## 🔒 4. Sécurité

### Variables d'environnement

**Ne JAMAIS commiter** :
- `.env` fichiers
- Clés API
- Secrets

**Utiliser** :
- Variables d'environnement du service de déploiement
- Secrets management (Vercel, Render, Railway)

### CORS

Le backend est configuré pour accepter les requêtes depuis :
- `http://localhost:3000` (dev)
- Votre domaine Vercel (production)

Mettre à jour `backend/src/server.js` si nécessaire :
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://votre-app.vercel.app',
  credentials: true
}))
```

### Rate Limiting

Le backend inclut un rate limiter :
- 100 requêtes / 15 minutes (général)
- 20 requêtes / 15 minutes (routes IA)

---

## 📊 5. Monitoring

### Health Check

Le backend expose un endpoint de health check :
```
GET /api/health
```

Utilisez-le pour :
- Monitoring (Uptime Robot, Pingdom)
- Health checks de Render/Railway

### Logs

**Render** :
- Logs disponibles dans le dashboard
- Streaming logs en temps réel

**Railway** :
- Logs dans le dashboard
- Export possible

**Vercel** :
- Logs dans le dashboard
- Analytics intégrées

---

## 🔄 6. CI/CD (Optionnel)

### GitHub Actions

Exemple de workflow pour les tests :

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: cd backend && npm install && npm test
      - run: cd frontend && npm install && npm test
```

---

## 🐛 7. Dépannage

### Problèmes courants

**Backend ne démarre pas** :
- Vérifier les variables d'environnement
- Vérifier les logs dans Render/Railway
- Vérifier que le port est correctement configuré

**Frontend ne se connecte pas au backend** :
- Vérifier `VITE_API_URL` dans Vercel
- Vérifier CORS dans le backend
- Vérifier que le backend est accessible

**Erreurs Supabase** :
- Vérifier les clés API
- Vérifier les politiques RLS
- Vérifier que les migrations sont exécutées

**Erreurs OpenAI** :
- Vérifier la clé API
- Vérifier les crédits OpenAI
- Vérifier les limites de rate

---

## 📈 8. Optimisations Production

### Backend

- **Compression** : Déjà activée avec `compression`
- **Rate Limiting** : Déjà configuré
- **Caching** : À ajouter pour les statistiques (optionnel)

### Frontend

- **Build optimisé** : Vite optimise automatiquement
- **Code splitting** : Automatique avec React Router
- **Lazy loading** : À ajouter pour les pages lourdes

### Base de données

- **Index** : Déjà créés dans les migrations
- **Connection pooling** : Géré par Supabase
- **Backups** : Automatiques avec Supabase (plan payant)

---

## 🔗 9. URLs de Production

Après déploiement, vous aurez :

- **Frontend** : `https://votre-app.vercel.app`
- **Backend** : `https://moduleia-backend.onrender.com` (ou railway.app)

Mettre à jour :
1. `VITE_API_URL` dans Vercel
2. CORS dans le backend

---

## ✅ Checklist de Déploiement

- [ ] Supabase configuré avec migrations
- [ ] Variables d'environnement configurées
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Render/Railway
- [ ] Health check fonctionnel
- [ ] CORS configuré correctement
- [ ] Tests passent (optionnel)
- [ ] Monitoring configuré (optionnel)
- [ ] Documentation mise à jour

---

## 📚 Ressources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Supabase Documentation](https://supabase.com/docs)

---

**✅ Déploiement terminé !** Votre application est maintenant en production.




