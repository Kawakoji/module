# 🔍 Diagnostic Erreur 404 Vercel

## Problème

L'application affiche `404: NOT_FOUND` sur toutes les routes.

## Étapes de diagnostic

### 1. Vérifier les logs de build dans Vercel

1. **Aller dans Vercel Dashboard**
   - Ouvrez votre projet
   - Onglet **Deployments**
   - Cliquez sur le dernier déploiement

2. **Vérifier les Build Logs**
   - Regardez si le build du frontend réussit
   - Cherchez des erreurs comme :
     - `npm install` échoue
     - `npm run build` échoue
     - `frontend/dist` n'existe pas après le build

3. **Vérifier les Function Logs**
   - Onglet **Functions** dans le déploiement
   - Vérifiez si `api/[...path].js` est détecté
   - Vérifiez les erreurs runtime

### 2. Tester les routes API

Testez ces URLs après déploiement :

- `/api/health` → Devrait retourner `{"status": "OK", ...}`
- `/api/test` → Devrait retourner `{"status": "OK", "message": "Vercel Serverless Function is working"}`

Si ces routes fonctionnent, le problème est uniquement le frontend.

### 3. Vérifier la structure des fichiers

Dans les Build Logs, vérifiez que :
- `frontend/dist/index.html` existe après le build
- `frontend/dist/assets/` contient les fichiers JS/CSS

### 4. Vérifier l'outputDirectory

Le `vercel.json` spécifie :
```json
"outputDirectory": "frontend/dist"
```

Vercel devrait chercher les fichiers statiques dans ce répertoire.

### 5. Solution alternative : Vérifier le build local

Si le build fonctionne localement :

```bash
cd frontend
npm install
npm run build
ls dist/  # Vérifier que index.html existe
```

## Solutions possibles

### Solution 1 : Vérifier que le build réussit

Si le build échoue, corriger les erreurs dans les logs.

### Solution 2 : Ajuster outputDirectory

Si Vercel ne trouve pas les fichiers, essayer :
- `outputDirectory: "dist"` (si on utilise Root Directory = frontend)
- Ou vérifier que le chemin est correct

### Solution 3 : Vérifier les rewrites

Les rewrites dans `vercel.json` doivent être :
```json
{
  "source": "/(.*)",
  "destination": "/index.html"
}
```

### Solution 4 : Utiliser cleanUrls

Ajouter dans `vercel.json` :
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

## Prochaines étapes

1. **Vérifier les Build Logs** dans Vercel Dashboard
2. **Partager les erreurs** si le build échoue
3. **Tester `/api/health`** pour voir si les Serverless Functions fonctionnent
4. **Vérifier que `frontend/dist/index.html` existe** après le build



