# 📋 Récapitulatif Rapide des Variables

## 🎯 Variables à Obtenir

### 1. Supabase (3 variables) - Pour l'authentification

**Où les trouver** :
1. Aller sur [supabase.com](https://supabase.com) → Créer un projet
2. Settings → API
3. Copier :
   - **Project URL** → `SUPABASE_URL` et `VITE_SUPABASE_URL`
   - **anon/public key** → `SUPABASE_ANON_KEY` et `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY`

### 2. Neon (1 variable) - Base de données

**Vous l'avez déjà !** :
```
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### 3. OpenAI (1 variable) - Optionnel

**Où la trouver** :
1. [platform.openai.com](https://platform.openai.com) → API keys
2. Créer une nouvelle clé
3. Copier → `OPENAI_API_KEY`

### 4. Vercel (1 variable) - Après déploiement

**À mettre à jour après le premier déploiement** :
```
VITE_API_URL=https://votre-app.vercel.app/api
```

---

## ✅ Checklist Rapide

1. [ ] Créer projet Supabase → Récupérer 3 clés
2. [ ] Vous avez déjà Neon → DATABASE_URL ✓
3. [ ] (Optionnel) Créer clé OpenAI
4. [ ] Déployer sur Vercel
5. [ ] Mettre à jour VITE_API_URL

---

## 📝 Template Vercel

**Frontend** :
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://votre-app.vercel.app/api
```

**Backend** :
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
OPENAI_API_KEY=sk-proj-... (optionnel)
```

---

**Voir `docs/VARIABLES_ENVIRONNEMENT.md` pour le guide complet !**




