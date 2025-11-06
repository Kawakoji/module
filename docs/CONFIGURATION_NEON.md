# 🔧 Configuration Neon - Guide Rapide

Guide pour configurer votre base de données Neon avec Moduleia.

---

## 📝 Votre Connection String

Votre connection string Neon :
```
postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

---

## ⚙️ Configuration

### 1. Fichier `.env` Backend

Créez ou modifiez `backend/.env` :

```env
# Port
PORT=5000
NODE_ENV=development

# Supabase (pour l'authentification uniquement)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role

# Neon (pour la base de données)
DATABASE_URL=postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# OpenAI (optionnel)
OPENAI_API_KEY=sk-...
```

---

## 🗄️ Exécuter les Migrations

### Option 1 : Via Neon SQL Editor (Recommandé)

1. Aller sur [console.neon.tech](https://console.neon.tech)
2. Sélectionner votre projet
3. Aller dans **SQL Editor**
4. Copier-coller le contenu de `backend/src/migrations/001_create_tables.sql`
5. Exécuter
6. Copier-coller le contenu de `backend/src/migrations/002_update_rls_policies.sql`
7. **Adapter** pour Neon (voir ci-dessous)

### Option 2 : Via psql en ligne de commande

```bash
# Installer psql si nécessaire
# Windows: installer PostgreSQL
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Se connecter et exécuter les migrations
psql 'postgresql://neondb_owner:npg_M3OGSpJrhPE1@ep-mute-water-abz5dm2y-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require' -f backend/src/migrations/001_create_tables.sql
```

---

## 🔄 Adapter les Migrations pour Neon

Neon n'a pas `auth.uid()` comme Supabase. Deux options :

### Option 1 : Désactiver RLS (Recommandé pour débuter)

Dans la migration `002_update_rls_policies.sql`, ajouter au début :

```sql
-- Désactiver RLS pour Neon (l'isolation se fait dans le code)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
```

### Option 2 : Garder RLS mais adapter

Les politiques RLS qui utilisent `auth.uid()` ne fonctionneront pas. Il faudrait créer une fonction PostgreSQL personnalisée.

**Pour l'instant, utilisez l'Option 1** (plus simple).

---

## 🧪 Tester la Connexion

### Test simple avec Node.js

Créez un fichier `backend/test-neon.js` :

```javascript
import { query } from './src/config/database.js'

async function test() {
  try {
    const result = await query('SELECT NOW() as current_time')
    console.log('✅ Connexion réussie !', result.rows[0])
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message)
  }
  process.exit(0)
}

test()
```

Exécuter :
```bash
cd backend
node test-neon.js
```

---

## ⚠️ Important : Supabase JS vs Neon

**Problème** : Les services actuels utilisent `supabase.from()` qui est spécifique à Supabase.

**Solutions** :

### Solution 1 : Utiliser pg directement (Recommandé)

Modifier les services pour utiliser `pg` au lieu de `supabase.from()`.

**Exemple** (`deckService.js`) :
```javascript
// Avant (Supabase JS)
const { data } = await supabase.from('decks').select('*')

// Après (pg)
const result = await query('SELECT * FROM decks WHERE user_id = $1', [userId])
const data = result.rows
```

### Solution 2 : Garder Supabase JS (pour l'instant)

Pour l'instant, le code peut fonctionner si vous utilisez Supabase pour la DB aussi. Mais pour Neon, il faudra adapter.

**Recommandation** : Utiliser `pg` directement pour Neon (plus propre).

---

## 🚀 Prochaines Étapes

1. ✅ Configurer `DATABASE_URL` dans `.env`
2. ✅ Exécuter les migrations dans Neon
3. ⚠️ Adapter les services pour utiliser `pg` (optionnel pour l'instant)
4. ✅ Tester la connexion
5. ✅ Déployer sur Vercel

---

## 📚 Ressources

- [Documentation Neon](https://neon.tech/docs)
- [Guide de déploiement Vercel + Neon](./DEPLOYMENT_VERCEL_NEON.md)

---

**✅ Configuration terminée !** Votre base Neon est prête à être utilisée.




