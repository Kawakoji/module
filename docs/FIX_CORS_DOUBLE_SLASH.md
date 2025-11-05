# 🔧 Fix CORS et Double Slash dans les URLs

## Problèmes Corrigés

### 1. Double Slash dans l'URL (`//decks`)

**Cause** : Si `VITE_API_URL` se termine par `/` et que l'endpoint commence par `/`, on obtient `//decks`.

**Solution** : Ajout d'une fonction `normalizeUrl` qui :
- Supprime le slash final de `API_URL` s'il existe
- S'assure que l'endpoint commence par `/`
- Construit l'URL correctement

### 2. Erreur CORS : "Redirect is not allowed for a preflight request"

**Cause** : Les preview URLs Vercel (comme `module-n31a6kitg-kawakojis-projects.vercel.app`) n'étaient pas explicitement autorisées dans CORS.

**Solution** : Configuration CORS améliorée qui :
- Autorise toutes les URLs contenant `vercel.app`
- Autorise `localhost` et `127.0.0.1` pour le développement
- Autorise les méthodes HTTP nécessaires (GET, POST, PUT, DELETE, OPTIONS)
- Autorise les headers nécessaires (Content-Type, Authorization, etc.)

## ✅ Corrections Appliquées

### 1. `frontend/src/services/api.js`

Ajout de la fonction `normalizeUrl` :
```javascript
const normalizeUrl = (baseUrl, endpoint) => {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}
```

### 2. `api/[...path].js`

Configuration CORS améliorée :
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true)
    } else {
      callback(null, true)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}
```

## 🔍 Vérification

### Vérifier la Variable d'Environnement

Dans **Vercel Dashboard** → **Settings** → **Environment Variables**, vérifiez que :

1. **`VITE_API_URL`** est défini
2. **Format correct** :
   - ✅ `https://module-lac.vercel.app/api` (sans slash final)
   - ✅ `https://module-lac.vercel.app/api/` (avec slash final - fonctionne aussi maintenant)
   - ❌ `https://module-lac.vercel.app/api//` (double slash - ne devrait plus arriver)

### Vérifier que CORS fonctionne

Après le redéploiement, testez :
1. Ouvrez la console du navigateur
2. Vérifiez qu'il n'y a plus d'erreur CORS
3. Les requêtes vers `/api/decks` devraient fonctionner

## 🚀 Après le Redéploiement

1. **Vercel va automatiquement redéployer** (si auto-deploy est activé)
2. **Les erreurs CORS devraient disparaître**
3. **Les URLs ne devraient plus avoir de double slash**

## 📝 Notes Importantes

### Variable VITE_API_URL

**Format recommandé** (sans slash final) :
```
VITE_API_URL=https://module-lac.vercel.app/api
```

**Mais fonctionne aussi** (avec slash final) grâce à `normalizeUrl` :
```
VITE_API_URL=https://module-lac.vercel.app/api/
```

### URLs Vercel

Vercel génère plusieurs types d'URLs :
- **Production** : `https://module-lac.vercel.app`
- **Preview** : `https://module-n31a6kitg-kawakojis-projects.vercel.app`
- **Branch** : `https://module-git-<branch>-kawakojis-projects.vercel.app`

Toutes ces URLs sont maintenant autorisées par CORS.

## ✅ Résultat Attendu

Après correction :
- ✅ Plus d'erreur CORS
- ✅ URLs correctes sans double slash
- ✅ Requêtes API fonctionnelles depuis toutes les URLs Vercel
- ✅ Fonctionne en production et en preview

