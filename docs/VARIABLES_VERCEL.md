# 🔑 Variables d'Environnement pour Vercel

## 📋 Liste Complète des Variables

### Frontend (Variables VITE_*)

Ces variables sont accessibles côté client (dans le navigateur) :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | `https://hucodhumxzffmwjknoxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme Supabase (publique) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_API_URL` | URL de votre backend Vercel | `https://module-xxx.vercel.app/api` |

### Backend (Variables sensibles)

Ces variables sont accessibles uniquement côté serveur :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `SUPABASE_URL` | URL de votre projet Supabase | `https://hucodhumxzffmwjknoxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_KEY` | Clé service role (secrète) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `DATABASE_URL` | Connection string Neon | `postgresql://neondb_owner:...` |
| `OPENAI_API_KEY` | Clé API OpenAI (optionnel) | `sk-proj-...` |
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port du serveur (optionnel) | `5000` |

---

## 🔧 Configuration dans Vercel

### Étape 1 : Aller dans les Settings

1. Ouvrez votre projet sur [vercel.com](https://vercel.com)
2. Cliquez sur **Settings**
3. Cliquez sur **Environment Variables** dans le menu de gauche

### Étape 2 : Ajouter les Variables

Pour chaque variable, cliquez sur **Add New** et remplissez :

#### Frontend Variables

1. **Key** : `VITE_SUPABASE_URL`
   - **Value** : `https://hucodhumxzffmwjknoxx.supabase.co`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

2. **Key** : `VITE_SUPABASE_ANON_KEY`
   - **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODU1NDAsImV4cCI6MjA3Nzg2MTU0MH0.SCLiBsK-ySabK8QdfNh7jO0bHsSqsmQeCFtsKlqS6yk`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

3. **Key** : `VITE_API_URL`
   - **Value** : `https://votre-app.vercel.app/api` (⚠️ À mettre à jour après le premier déploiement)
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

#### Backend Variables

1. **Key** : `SUPABASE_URL`
   - **Value** : `https://hucodhumxzffmwjknoxx.supabase.co`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

2. **Key** : `SUPABASE_ANON_KEY`
   - **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODU1NDAsImV4cCI6MjA3Nzg2MTU0MH0.SCLiBsK-ySabK8QdfNh7jO0bHsSqsmQeCFtsKlqS6yk`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

3. **Key** : `SUPABASE_SERVICE_KEY`
   - **Value** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NTU0MCwiZXhwIjoyMDc3ODYxNTQwfQ.nLol99igC03QRnm4SUsyUoQmn0HnLnWNZnhzf9IuC3g`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**
   - ⚠️ **SÉCURITÉ** : Cette clé est secrète ! Ne la partagez jamais.

4. **Key** : `DATABASE_URL`
   - **Value** : `postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

5. **Key** : `OPENAI_API_KEY` (Optionnel)
   - **Value** : `sk-proj-...` (votre clé OpenAI)
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

6. **Key** : `NODE_ENV`
   - **Value** : `production`
   - **Environment** : Sélectionner **Production**, **Preview**, et **Development**

---

## 📝 Template Complet pour Copier-Coller

### Variables Frontend (VITE_*)

```
VITE_SUPABASE_URL=https://hucodhumxzffmwjknoxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODU1NDAsImV4cCI6MjA3Nzg2MTU0MH0.SCLiBsK-ySabK8QdfNh7jO0bHsSqsmQeCFtsKlqS6yk
VITE_API_URL=https://votre-app.vercel.app/api
```

### Variables Backend

```
SUPABASE_URL=https://hucodhumxzffmwjknoxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyODU1NDAsImV4cCI6MjA3Nzg2MTU0MH0.SCLiBsK-ySabK8QdfNh7jO0bHsSqsmQeCFtsKlqS6yk
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y29kaHVteHpmZm13amtub3h4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI4NTU0MCwiZXhwIjoyMDc3ODYxNTQwfQ.nLol99igC03QRnm4SUsyUoQmn0HnLnWNZnhzf9IuC3g
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
OPENAI_API_KEY=sk-proj-... (optionnel)
```

---

## ⚠️ Important : VITE_API_URL

**Cette variable doit être mise à jour APRÈS le premier déploiement !**

1. Déployez votre projet sur Vercel
2. Vercel vous donnera une URL : `https://module-xxx.vercel.app`
3. Mettez à jour `VITE_API_URL` avec : `https://module-xxx.vercel.app/api`
4. Redéployez pour que les changements prennent effet

---

## ✅ Checklist de Configuration

- [ ] `VITE_SUPABASE_URL` ajoutée dans Vercel
- [ ] `VITE_SUPABASE_ANON_KEY` ajoutée dans Vercel
- [ ] `VITE_API_URL` ajoutée (mise à jour après premier déploiement)
- [ ] `SUPABASE_URL` ajoutée dans Vercel
- [ ] `SUPABASE_ANON_KEY` ajoutée dans Vercel
- [ ] `SUPABASE_SERVICE_KEY` ajoutée dans Vercel
- [ ] `DATABASE_URL` ajoutée dans Vercel
- [ ] `NODE_ENV=production` ajoutée dans Vercel
- [ ] `OPENAI_API_KEY` ajoutée (optionnel)
- [ ] Toutes les variables sont configurées pour **Production**, **Preview**, et **Development**

---

## 🔍 Vérification

Après avoir ajouté les variables :

1. **Redéployez** votre projet (Vercel → Deployments → 3 points → Redeploy)
2. Vérifiez les **Build Logs** pour voir si les variables sont bien chargées
3. Testez l'application pour voir si l'authentification fonctionne

---

## 🆘 Problèmes Courants

### "Environment variable not found"
➡️ Vérifiez que la variable est bien ajoutée dans Vercel et que l'environnement est correct (Production/Preview/Development)

### "Invalid Supabase URL"
➡️ Vérifiez que l'URL ne contient pas d'espaces ou de caractères supplémentaires

### "Database connection failed"
➡️ Vérifiez que `DATABASE_URL` est correctement copiée (sans espaces)

---

**✅ Toutes les variables sont maintenant documentées !**




