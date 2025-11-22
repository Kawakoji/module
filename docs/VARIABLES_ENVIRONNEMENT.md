# 🔑 Guide des Variables d'Environnement

Guide complet pour obtenir toutes les variables d'environnement nécessaires pour Moduleia.

---

## 📋 Liste Complète des Variables

### Frontend (Vercel)
- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `VITE_API_URL` - URL de votre backend (sera mise à jour après déploiement)

### Backend (Vercel)
- `PORT` - Port du serveur (5000 ou laisser Vercel gérer)
- `NODE_ENV` - Environnement (production)
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `SUPABASE_SERVICE_KEY` - Clé service role Supabase
- `DATABASE_URL` - Connection string Neon
- `OPENAI_API_KEY` - Clé API OpenAI (optionnel)

---

## 🔐 1. Variables Supabase (Authentification)

### Étape 1 : Créer un projet Supabase

1. Aller sur [supabase.com](https://supabase.com)
2. Cliquer sur **"New Project"**
3. Remplir :
   - **Name** : `moduleia` (ou autre nom)
   - **Database Password** : Créer un mot de passe fort (à sauvegarder)
   - **Region** : Choisir la région la plus proche
   - **Pricing Plan** : Free (gratuit)
4. Cliquer sur **"Create new project"**
5. Attendre 2-3 minutes que le projet soit créé

### Étape 2 : Récupérer les clés API

1. Dans le dashboard Supabase, aller dans **Settings** (icône engrenage en bas à gauche)
2. Cliquer sur **API**
3. Vous verrez :

**Project URL** :
```
https://xxxxx.supabase.co
```
➡️ C'est votre `SUPABASE_URL` et `VITE_SUPABASE_URL`

**anon/public key** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
➡️ C'est votre `SUPABASE_ANON_KEY` et `VITE_SUPABASE_ANON_KEY`

**service_role key** :
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
⚠️ **IMPORTANT** : Cette clé est secrète ! Ne la partagez jamais publiquement.
➡️ C'est votre `SUPABASE_SERVICE_KEY`

### Étape 3 : Configurer l'authentification

1. Aller dans **Authentication** → **Settings**
2. Vérifier que **Email** est activé
3. Désactiver **"Confirm email"** si vous voulez tester rapidement (optionnel)
4. Sauvegarder

---

## 🗄️ 2. Variables Neon (Base de données)

### Vous avez déjà la connection string !

Votre connection string Neon :
```
postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

➡️ C'est votre `DATABASE_URL`

### Si vous avez besoin de la retrouver :

1. Aller sur [console.neon.tech](https://console.neon.tech)
2. Sélectionner votre projet
3. Aller dans **Connection Details**
4. Copier la **Connection String**

---

## 🤖 3. Variables OpenAI (Optionnel - pour la génération IA)

### Si vous voulez utiliser la génération IA de cartes :

1. Aller sur [platform.openai.com](https://platform.openai.com)
2. Se connecter ou créer un compte
3. Aller dans **API keys** (icône clé dans le menu)
4. Cliquer sur **"Create new secret key"**
5. Donner un nom (ex: "Moduleia")
6. Copier la clé immédiatement (elle ne sera plus affichée après)

**Format** :
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

➡️ C'est votre `OPENAI_API_KEY`

⚠️ **Note** : OpenAI a des coûts à l'usage. Le plan gratuit donne des crédits de départ.

---

## 📝 4. Variables Vercel (après déploiement)

### VITE_API_URL

1. Déployer votre projet sur Vercel
2. Vercel donnera une URL : `https://module-xxx.vercel.app`
3. Votre `VITE_API_URL` sera : `https://module-xxx.vercel.app/api`

**Important** : Cette variable doit être mise à jour APRÈS le premier déploiement.

---

## ✅ Checklist Complète

### Supabase
- [ ] Projet Supabase créé
- [ ] `SUPABASE_URL` copiée
- [ ] `SUPABASE_ANON_KEY` copiée
- [ ] `SUPABASE_SERVICE_KEY` copiée
- [ ] Authentification Email configurée

### Neon
- [ ] `DATABASE_URL` copiée (vous l'avez déjà !)
- [ ] Migrations SQL exécutées dans Neon

### OpenAI (Optionnel)
- [ ] Compte OpenAI créé
- [ ] `OPENAI_API_KEY` créée et copiée

### Vercel (après déploiement)
- [ ] `VITE_API_URL` mise à jour avec l'URL réelle

---

## 📋 Template pour Vercel

Copier-coller ce template dans Vercel (Settings → Environment Variables) :

### Frontend
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=https://votre-app.vercel.app/api
```

### Backend
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
OPENAI_API_KEY=sk-proj-... (optionnel)
```

---

## 🔒 Sécurité

### ⚠️ Ne JAMAIS commiter :
- Les fichiers `.env`
- Les clés API dans le code
- Les secrets dans les messages de commit

### ✅ Utiliser :
- Variables d'environnement dans Vercel
- `.env.example` pour documenter (sans les vraies valeurs)
- `.gitignore` pour exclure `.env`

---

## 🆘 Problèmes Courants

### "Missing Supabase environment variables"
➡️ Vérifier que toutes les variables Supabase sont définies dans Vercel

### "Database pool not initialized"
➡️ Vérifier que `DATABASE_URL` est correctement configurée

### "Invalid API key"
➡️ Vérifier que les clés sont copiées complètement (sans espaces)

### Erreurs CORS
➡️ Vérifier que `VITE_API_URL` pointe vers le bon domaine Vercel

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Neon](https://neon.tech/docs)
- [Documentation OpenAI](https://platform.openai.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

---

**✅ Toutes vos variables sont prêtes !** Vous pouvez maintenant les configurer dans Vercel.








