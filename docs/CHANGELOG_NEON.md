# 🔄 Migration vers Neon

Guide pour adapter le projet pour utiliser Neon au lieu de Supabase PostgreSQL.

---

## 🎯 Objectif

Utiliser **Neon** comme base de données PostgreSQL tout en gardant **Supabase Auth** pour l'authentification.

---

## 📝 Modifications nécessaires

### 1. Variables d'environnement

**Backend (.env)** :
```env
# Supabase (uniquement pour Auth)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role

# Neon (pour la base de données)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
```

### 2. Installation de pg

```bash
cd backend
npm install pg
```

### 3. Configuration de la base de données

Le fichier `backend/src/config/database.js` a été créé pour gérer les connexions Neon.

### 4. Adaptation des services

**Option recommandée** : Garder Supabase JS pour la compatibilité

Les services actuels utilisent `supabase.from('table')`. Pour utiliser Neon directement, il faudrait les réécrire avec `pg`.

**Pour l'instant, on peut utiliser Supabase JS avec la connection string de Neon** :
- Utiliser `DATABASE_URL` de Neon dans `SUPABASE_URL`
- Cela fonctionne car Supabase JS utilise PostgreSQL

### 5. Politiques RLS

**Problème** : Neon n'a pas `auth.uid()` comme Supabase.

**Solution** :
1. Désactiver RLS dans les migrations
2. Gérer l'isolation dans le code backend (déjà fait)

**Migration adaptée** :
```sql
-- Désactiver RLS (optionnel)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE decks DISABLE ROW LEVEL SECURITY;
ALTER TABLE cards DISABLE ROW LEVEL SECURITY;
```

---

## ✅ Avantages de Neon

- ✅ PostgreSQL serverless
- ✅ Plan gratuit généreux
- ✅ Scaling automatique
- ✅ Branching de bases de données
- ✅ Pas de vendor lock-in

---

## 🔄 Migration étape par étape

1. **Créer la base Neon**
2. **Exécuter les migrations**
3. **Désactiver RLS** (optionnel)
4. **Mettre à jour DATABASE_URL**
5. **Tester la connexion**
6. **Déployer**

---

Voir `docs/DEPLOYMENT_VERCEL_NEON.md` pour le guide complet.




