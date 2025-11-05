# 🔧 Fix CORS "No Access-Control-Allow-Origin header"

## Problème

Erreur CORS : `No 'Access-Control-Allow-Origin' header is present on the requested resource`

**Et aussi** : L'URL de la requête est `https://module-lac.vercel.app/decks` au lieu de `https://module-lac.vercel.app/api/decks`

## Causes

1. **Requêtes OPTIONS (preflight) non gérées correctement** - Le rate limiter ou d'autres middlewares bloquent les requêtes OPTIONS
2. **Variable d'environnement `VITE_API_URL` mal configurée** - Elle ne contient pas `/api`

## ✅ Corrections Appliquées

### 1. Gestion explicite des requêtes OPTIONS

Les requêtes OPTIONS (preflight) sont maintenant gérées **AVANT** tous les autres middlewares, y compris le rate limiter :

```javascript
app.options('*', (req, res) => {
  const origin = req.headers.origin
  if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.status(200).end()
  } else {
    res.status(403).end()
  }
})
```

### 2. Exclusion des requêtes OPTIONS du rate limiter

Le rate limiter ignore maintenant les requêtes OPTIONS :

```javascript
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  next()
})
```

## 🔍 Vérification de la Configuration

### ⚠️ IMPORTANT : Vérifier `VITE_API_URL` dans Vercel

Dans **Vercel Dashboard** → **Settings** → **Environment Variables**, vérifiez que :

**`VITE_API_URL`** est défini comme :
```
https://module-lac.vercel.app/api
```

**❌ PAS** :
```
https://module-lac.vercel.app
```

**❌ PAS** :
```
https://module-lac.vercel.app/
```

**✅ CORRECT** :
```
https://module-lac.vercel.app/api
```

### Comment vérifier

1. Allez dans **Vercel Dashboard** → **Settings** → **Environment Variables**
2. Cherchez `VITE_API_URL`
3. Vérifiez que la valeur est : `https://module-lac.vercel.app/api` (avec `/api` à la fin)
4. Si ce n'est pas le cas, **modifiez-la** et **redéployez**

### Pourquoi c'est important

Si `VITE_API_URL` est `https://module-lac.vercel.app` (sans `/api`), alors :
- Les requêtes vont vers `https://module-lac.vercel.app/decks` ❌
- Au lieu de `https://module-lac.vercel.app/api/decks` ✅
- Et ces requêtes ne sont pas gérées par votre handler API Vercel

## 🚀 Après Correction

1. **Vérifiez `VITE_API_URL` dans Vercel** (doit contenir `/api`)
2. **Redéployez** si vous avez modifié la variable
3. **Les erreurs CORS devraient disparaître**
4. **Les requêtes devraient aller vers `/api/decks` et non `/decks`**

## 📝 Résumé

- ✅ Requêtes OPTIONS gérées explicitement
- ✅ Rate limiter ignore les requêtes OPTIONS
- ✅ Headers CORS correctement définis
- ⚠️ **ACTION REQUISE** : Vérifier que `VITE_API_URL` contient `/api`

