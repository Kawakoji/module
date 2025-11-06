# ⚙️ Configuration des Variables d'Environnement

## ✅ Fichiers `.env` créés

Les fichiers `.env` ont été créés avec votre configuration Supabase.

---

## 📝 Ce qu'il reste à faire

### 1. Frontend (`frontend/.env`)

**URL Supabase** : ✅ Déjà configurée
```
VITE_SUPABASE_URL=https://hucodhumxzffmwjknoxx.supabase.co
```

**À compléter** :
1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionner votre projet
3. Settings → API
4. Copier la **anon/public key**
5. Remplacer `votre_cle_anon_ici` dans `frontend/.env`

### 2. Backend (`backend/.env`)

**URL Supabase** : ✅ Déjà configurée
```
SUPABASE_URL=https://hucodhumxzffmwjknoxx.supabase.co
```

**DATABASE_URL Neon** : ✅ Déjà configurée
```
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**À compléter** :
1. Aller sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Settings → API
3. Copier :
   - **anon/public key** → `SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY`
4. Remplacer dans `backend/.env`

**Optionnel** :
- `OPENAI_API_KEY` : Si vous voulez utiliser la génération IA

---

## 🔍 Vérification

### Tester la configuration frontend

```bash
cd frontend
npm run dev
```

Si vous voyez une erreur "Missing Supabase environment variables", vérifiez que les clés sont bien dans `.env`.

### Tester la configuration backend

```bash
cd backend
npm run dev
```

Si vous voyez une erreur de connexion, vérifiez que toutes les variables sont définies.

---

## 🚀 Pour Vercel

Les mêmes variables doivent être ajoutées dans Vercel :

**Frontend** :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (après le premier déploiement)

**Backend** :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- `OPENAI_API_KEY` (optionnel)

---

## ⚠️ Important

- Les fichiers `.env` sont dans `.gitignore` (ne seront pas commités)
- Ne jamais partager les clés publiquement
- Les clés Supabase sont sensibles, gardez-les privées

---

**✅ Fichiers créés !** Il ne reste plus qu'à ajouter les clés Supabase.




