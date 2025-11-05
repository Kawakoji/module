# ✅ Checklist Variables d'Environnement Vercel

## 🔍 Vérification de vos Variables

### ✅ Variables Frontend (VITE_*)

Ces variables doivent être dans **Vercel Dashboard** → **Settings** → **Environment Variables**

| Variable | Votre Valeur | Status | Notes |
|----------|--------------|--------|-------|
| `VITE_SUPABASE_URL` | `https://hucodhumxzffmwjknoxx.supabase.co` | ✅ **CORRECT** | Format correct |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | ❓ **À VÉRIFIER** | Doit commencer par `eyJ` |
| `VITE_API_URL` | `https://module-lac.vercel.app/api` | ✅ **CORRECT** | Se termine bien par `/api` |

### ✅ Variables Backend (Sensibles)

Ces variables sont nécessaires pour que l'API fonctionne :

| Variable | Requis | Description | Format |
|----------|--------|-------------|--------|
| `SUPABASE_URL` | ✅ **OUI** | URL Supabase | `https://hucodhumxzffmwjknoxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ **OUI** | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_KEY` | ✅ **OUI** | Clé service role (secrète) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `DATABASE_URL` | ✅ **OUI** | Connection string Neon | `postgresql://...` |
| `OPENAI_API_KEY` | ⚠️ **Optionnel** | Pour génération IA | `sk-proj-...` |
| `NODE_ENV` | ⚠️ **Recommandé** | `production` | `production` |

## 🔍 Où Trouver les Variables Manquantes

### 1. Clés Supabase

1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. **Settings** → **API**
4. Vous verrez :
   - **Project URL** : `https://hucodhumxzffmwjknoxx.supabase.co` ✅ (vous l'avez)
   - **anon/public key** : Copier pour `SUPABASE_ANON_KEY` et `VITE_SUPABASE_ANON_KEY`
   - **service_role key** : Copier pour `SUPABASE_SERVICE_KEY` (⚠️ SECRÈTE)

### 2. DATABASE_URL (Neon)

Si vous utilisez Neon, vous devriez avoir une connection string comme :
```
postgresql://neondb_owner:password@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require
```

### 3. OPENAI_API_KEY (Optionnel)

1. Aller sur [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Créer une nouvelle clé
3. Copier (commence par `sk-`)

## 📋 Configuration Complète dans Vercel

### Étape 1 : Aller dans Vercel Dashboard

1. [vercel.com](https://vercel.com) → Votre projet
2. **Settings** → **Environment Variables**

### Étape 2 : Ajouter les Variables Frontend

Pour chaque variable, cliquez sur **Add New** :

1. **Key** : `VITE_SUPABASE_URL`
   - **Value** : `https://hucodhumxzffmwjknoxx.supabase.co`
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

2. **Key** : `VITE_SUPABASE_ANON_KEY`
   - **Value** : `eyJ...` (votre clé anon depuis Supabase)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

3. **Key** : `VITE_API_URL`
   - **Value** : `https://module-lac.vercel.app/api`
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

### Étape 3 : Ajouter les Variables Backend

1. **Key** : `SUPABASE_URL`
   - **Value** : `https://hucodhumxzffmwjknoxx.supabase.co`
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

2. **Key** : `SUPABASE_ANON_KEY`
   - **Value** : `eyJ...` (même clé que `VITE_SUPABASE_ANON_KEY`)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

3. **Key** : `SUPABASE_SERVICE_KEY`
   - **Value** : `eyJ...` (clé service_role depuis Supabase)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development
   - ⚠️ **IMPORTANT** : Ne jamais partager cette clé !

4. **Key** : `DATABASE_URL`
   - **Value** : `postgresql://...` (votre connection string Neon)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

5. **Key** : `NODE_ENV`
   - **Value** : `production`
   - **Environments** : ✅ Production, ✅ Preview

6. **Key** : `OPENAI_API_KEY` (Optionnel)
   - **Value** : `sk-...` (votre clé OpenAI)
   - **Environments** : ✅ Production, ✅ Preview, ✅ Development

## ✅ Vérification Finale

### Checklist

- [ ] `VITE_SUPABASE_URL` = `https://hucodhumxzffmwjknoxx.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` = Clé anon depuis Supabase
- [ ] `VITE_API_URL` = `https://module-lac.vercel.app/api`
- [ ] `SUPABASE_URL` = `https://hucodhumxzffmwjknoxx.supabase.co`
- [ ] `SUPABASE_ANON_KEY` = Clé anon depuis Supabase
- [ ] `SUPABASE_SERVICE_KEY` = Clé service_role depuis Supabase
- [ ] `DATABASE_URL` = Connection string Neon
- [ ] `NODE_ENV` = `production`
- [ ] `OPENAI_API_KEY` = Clé OpenAI (optionnel)

### Test

Après avoir ajouté toutes les variables :

1. **Redéployez** le projet dans Vercel
2. Testez : `https://module-lac.vercel.app/api/health`
   - Devrait retourner : `{"status": "OK", ...}`
3. Testez le frontend : `https://module-lac.vercel.app/`
   - Devrait afficher l'application

## 🐛 Si les Erreurs Persistent

### Vérifier les Logs

1. **Vercel Dashboard** → **Deployments** → Dernier déploiement
2. **Functions** → `api/[...path].js` → **Logs**
3. Cherchez les erreurs comme :
   - `Missing environment variable`
   - `Cannot read property of undefined`
   - `Database connection error`

### Erreurs Courantes

**"Missing SUPABASE_URL"** :
- Vérifiez que `SUPABASE_URL` est bien défini dans Vercel

**"Authentication failed"** :
- Vérifiez que `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_KEY` sont corrects

**"Database connection failed"** :
- Vérifiez que `DATABASE_URL` est correct et que Neon est accessible

## 📝 Notes Importantes

1. **Les variables `VITE_*` sont publiques** (visibles dans le code JavaScript)
2. **Les autres variables sont secrètes** (côté serveur uniquement)
3. **Après modification**, Vercel doit **redéployer** pour que les changements prennent effet
4. **Redéployez** après avoir ajouté/modifié des variables

