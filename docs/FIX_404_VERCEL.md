# 🔧 Guide de Résolution - Erreur 404 Vercel

## Problème
Erreur `404: NOT_FOUND` lors du déploiement sur Vercel.

## ✅ Solutions Appliquées

### 1. Correction du `vercel.json`
Le fichier `vercel.json` a été mis à jour pour utiliser le format moderne de Vercel :

```json
{
  "installCommand": "npm install",
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Correction du handler API
Le fichier `api/[...path].js` utilise maintenant la syntaxe correcte pour `@vercel/node` v3.

## 🚀 Étapes à Suivre dans Vercel Dashboard

### Étape 1 : Configurer le Root Directory

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Ouvrir votre projet**
3. **Aller dans Settings → General**
4. **Dans la section "Root Directory"** :
   - **IMPORTANT** : Laissez le champ **VIDE** ou mettez juste `/` (racine du projet)
   - **NE PAS** mettre `frontend` dans ce champ
5. **Cliquer sur "Save"**

### Étape 2 : Vérifier les Build Settings

Dans **Settings → General → Build & Development Settings** :

- **Framework Preset** : `Other` (pas Vite, car nous utilisons un monorepo)
- **Build Command** : `cd frontend && npm install && npm run build` (ou laisser vide, il sera pris depuis `vercel.json`)
- **Output Directory** : `frontend/dist` (ou laisser vide, il sera pris depuis `vercel.json`)
- **Install Command** : `npm install` (ou laisser vide, il sera pris depuis `vercel.json`)

### Étape 3 : Vérifier les Variables d'Environnement

Dans **Settings → Environment Variables**, assurez-vous d'avoir :

**Variables Frontend** (préfixées avec `VITE_`) :
```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=https://votre-app.vercel.app/api
```

**Variables Backend** :
```
NODE_ENV=production
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
```

**Important** : Cochez toutes les cases (Production, Preview, Development) pour chaque variable.

### Étape 4 : Redéployer

1. **Aller dans Deployments**
2. **Cliquer sur les 3 points** (...) du dernier déploiement
3. **Cliquer sur "Redeploy"**
   - **OU** pousser un nouveau commit sur GitHub pour déclencher un nouveau déploiement

## 🔍 Vérification après Redéploiement

### 1. Vérifier les Logs de Build

Dans **Deployments → [Votre dernier déploiement] → Build Logs** :
- ✅ Le build doit se terminer avec succès
- ✅ Pas d'erreurs rouges
- ✅ Le message "Build Completed" doit apparaître

### 2. Tester les Routes

**API Health Check** :
```
https://votre-app.vercel.app/api/health
```
Devrait retourner :
```json
{
  "status": "OK",
  "message": "Moduleia API is running",
  "timestamp": "..."
}
```

**Frontend** :
```
https://votre-app.vercel.app/
```
Devrait afficher votre application React.

### 3. Vérifier les Functions

Dans **Deployments → [Votre déploiement] → Functions** :
- ✅ Vous devriez voir `api/[...path].js` listé
- ✅ Pas d'erreurs dans les logs de fonction

## 🐛 Si le Problème Persiste

### Vérifier les Logs de Runtime

1. **Aller dans Deployments → [Votre déploiement] → Functions**
2. **Cliquer sur `api/[...path].js`**
3. **Vérifier les logs d'erreur**

Erreurs communes :
- **Module not found** : Les dépendances du backend ne sont pas installées → Vérifier que `npm install` s'exécute à la racine
- **Cannot find module '@vercel/node'** : Vérifier que `@vercel/node` est dans `package.json` à la racine
- **ENOENT** : Vérifier que les chemins relatifs dans `api/[...path].js` sont corrects

### Vérifier la Structure du Projet

Votre structure devrait ressembler à :
```
moduleia/
├── api/
│   └── [...path].js       ← Handler API Vercel
├── frontend/
│   ├── dist/              ← Build output (créé après build)
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   └── package.json
├── package.json           ← Racine (avec @vercel/node)
└── vercel.json            ← Configuration Vercel
```

### Options de Dépannage

1. **Supprimer le Root Directory** :
   - Dans Settings → General → Root Directory
   - Supprimer complètement le contenu
   - Sauvegarder et redéployer

2. **Vérifier que git est à jour** :
   ```bash
   git add .
   git commit -m "Fix Vercel configuration"
   git push origin main
   ```

3. **Vérifier les permissions Vercel** :
   - Assurez-vous d'avoir les droits d'administration sur le projet
   - Vérifiez que le repository GitHub est bien connecté

## 📝 Résumé des Changements

1. ✅ `vercel.json` mis à jour avec le format moderne
2. ✅ `api/[...path].js` corrigé pour utiliser la bonne syntaxe `@vercel/node`
3. ⚠️ **ACTION REQUISE** : Configurer Root Directory = `/` (vide) dans Vercel Dashboard
4. ⚠️ **ACTION REQUISE** : Redéployer le projet

Après ces étapes, l'erreur 404 devrait être résolue ! 🎉

