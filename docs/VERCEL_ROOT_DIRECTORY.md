# 🔧 Configuration Root Directory Vercel

## Problème

Les erreurs 404 sur `/` indiquent que Vercel ne trouve pas les fichiers statiques du frontend.

## Solution : Configurer Root Directory

Pour un monorepo, Vercel nécessite que vous configuriez le **Root Directory** dans le dashboard :

### Étapes

1. **Aller dans Vercel Dashboard**
   - Ouvrez votre projet
   - Allez dans **Settings** → **General**

2. **Configurer Root Directory**
   - Dans la section **Root Directory**, sélectionnez `frontend`
   - Cliquez sur **Save**

3. **Mettre à jour vercel.json**

   Le `vercel.json` à la racine doit être simplifié ou supprimé si vous utilisez Root Directory.

   **Option A : Root Directory = `frontend`**
   - Créez un `vercel.json` dans `frontend/` :
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
     ]
   }
   ```

   **Option B : Root Directory = `/` (monorepo)**
   - Gardez le `vercel.json` à la racine avec :
   ```json
   {
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

## Alternative : Deux Projets Vercel

Si la configuration monorepo ne fonctionne pas :

1. **Projet 1 : Frontend**
   - Root Directory : `frontend`
   - Framework : Vite
   - Build Command : `npm run build`
   - Output Directory : `dist`

2. **Projet 2 : Backend**
   - Root Directory : `/` (racine)
   - Framework : Other
   - Les Serverless Functions dans `api/` seront automatiquement détectées

## Vérification

Après configuration :
1. Redéployez le projet
2. Vérifiez les logs de build dans Vercel Dashboard
3. Testez `/` et `/api/test` (si disponible)








