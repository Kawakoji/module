# ⚡ Démarrage Rapide avec Neon

Guide rapide pour configurer Moduleia avec votre base de données Neon.

---

## 🚀 Configuration en 3 étapes

### 1. Créer le fichier `.env` backend

Créez `backend/.env` avec votre connection string Neon :

```env
PORT=5000
NODE_ENV=development

# Supabase (pour l'authentification)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role

# Neon (votre connection string)
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# OpenAI (optionnel)
OPENAI_API_KEY=sk-...
```

### 2. Tester la connexion

```bash
cd backend
npm install
npm run test:neon
```

Si vous voyez `✅ Connexion réussie !`, c'est bon !

### 3. Exécuter les migrations

Dans Neon SQL Editor :
1. Aller sur [console.neon.tech](https://console.neon.tech)
2. Sélectionner votre projet
3. Ouvrir **SQL Editor**
4. Copier-coller le contenu de `backend/src/migrations/001_create_tables.sql`
5. Exécuter

**Important** : Pour Neon, désactivez RLS dans la migration `002` ou adaptez les politiques.

---

## ✅ C'est tout !

Votre base Neon est configurée. Vous pouvez maintenant :

- Démarrer le backend : `cd backend && npm run dev`
- Tester les API endpoints
- Déployer sur Vercel

---

Voir [CONFIGURATION_NEON.md](./CONFIGURATION_NEON.md) pour plus de détails.



