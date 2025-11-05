# 🔧 Fix Erreur 404 Vercel

## Problème

Erreur 404 NOT_FOUND sur Vercel lors du déploiement.

## Cause

La configuration Vercel n'était pas optimale pour un monorepo avec backend et frontend.

## Solution Appliquée

### 1. Création du dossier `api/` à la racine

Vercel détecte automatiquement les Serverless Functions dans le dossier `api/` à la racine du projet.

**Fichier créé** : `api/index.js`

### 2. Correction de `vercel.json`

**Avant** :
```json
{
  "functions": {
    "backend/src/server.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

**Après** :
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/index.js": {
      "runtime": "nodejs20.x"
    }
  }
}
```

## Structure Correcte

```
moduleia/
├── api/
│   └── index.js          ← Point d'entrée Vercel
├── frontend/
│   └── dist/             ← Build frontend
├── backend/
│   └── src/              ← Code backend
└── vercel.json           ← Configuration Vercel
```

## Vérification

### 1. Tester les routes API

Après le déploiement, tester :
- `https://votre-app.vercel.app/api/health` → Devrait retourner `{"status": "OK"}`

### 2. Tester le frontend

- `https://votre-app.vercel.app/` → Devrait afficher l'application React

## Si l'erreur persiste

### Vérifier les logs Vercel

1. Aller dans Vercel Dashboard
2. Sélectionner votre projet
3. Cliquer sur "Functions" ou "Logs"
4. Vérifier les erreurs de build ou runtime

### Vérifier les variables d'environnement

Assurez-vous que toutes les variables sont définies dans Vercel :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- etc.

### Vérifier le build

1. Dans Vercel Dashboard → Deployments
2. Cliquer sur le dernier déploiement
3. Vérifier les logs de build
4. Vérifier qu'il n'y a pas d'erreurs

## Prochaines Étapes

1. ✅ Commit les changements
2. ✅ Push sur GitHub
3. ✅ Vercel redéploiera automatiquement
4. ✅ Tester les routes API

---

**✅ Configuration corrigée !** Redéployez sur Vercel.



