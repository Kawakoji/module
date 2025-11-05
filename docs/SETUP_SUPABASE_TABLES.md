# 🗄️ Configuration des Tables Supabase

Guide pour créer les tables nécessaires dans Supabase.

## 📋 Étapes

### 1. Ouvrir le SQL Editor dans Supabase

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Dans le menu de gauche, cliquez sur **SQL Editor**
4. Cliquez sur **New query**

### 2. Exécuter la Migration 001 (Création des tables)

1. Copiez tout le contenu du fichier `backend/src/migrations/001_create_tables.sql`
2. Collez-le dans le SQL Editor de Supabase
3. Cliquez sur **Run** (ou appuyez sur `Ctrl+Enter` / `Cmd+Enter`)
4. Vérifiez qu'il n'y a pas d'erreurs (vous devriez voir "Success. No rows returned")

### 3. Vérifier que les tables sont créées

1. Dans Supabase, allez dans **Table Editor** (menu de gauche)
2. Vous devriez voir les tables suivantes :
   - `profiles`
   - `decks`
   - `cards`

### 4. Exécuter la Migration 002 (Politiques RLS)

1. Copiez tout le contenu du fichier `backend/src/migrations/002_update_rls_policies.sql`
2. Collez-le dans le SQL Editor de Supabase
3. Cliquez sur **Run**
4. Vérifiez qu'il n'y a pas d'erreurs

### 5. Vérifier les politiques RLS

1. Dans Supabase, allez dans **Authentication** → **Policies**
2. Vérifiez que les politiques sont bien créées pour chaque table

## ✅ Vérification finale

Après avoir exécuté les migrations, testez :

1. **Redéployez sur Vercel** (ou attendez le prochain déploiement automatique)
2. **Essayez de créer un deck** dans l'application
3. **Vérifiez les logs Vercel** pour voir s'il y a encore des erreurs

## 🔍 Si vous avez des erreurs

### Erreur : "relation already exists"
- Les tables existent déjà
- Vous pouvez ignorer cette erreur ou supprimer les tables existantes et réexécuter

### Erreur : "permission denied"
- Vérifiez que vous utilisez la bonne clé API (Service Role Key pour les opérations admin)

### Erreur : "function does not exist"
- Vérifiez que toutes les fonctions (triggers) ont été créées correctement

## 📝 Notes importantes

- Les migrations utilisent `IF NOT EXISTS`, donc vous pouvez les réexécuter sans problème
- Les politiques RLS sont importantes pour la sécurité - ne les désactivez pas en production
- Le trigger `handle_new_user()` crée automatiquement un profil lors de l'inscription

