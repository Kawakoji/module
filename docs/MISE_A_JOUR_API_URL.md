# 🔄 Mise à Jour de VITE_API_URL après Déploiement

## 📋 Pourquoi mettre à jour ?

`VITE_API_URL` doit pointer vers l'URL de votre backend déployé sur Vercel. 

**Avant le déploiement** : `http://localhost:5000` (développement local)  
**Après le déploiement** : `https://votre-app.vercel.app/api` (production)

---

## ✅ Étapes pour Mettre à Jour

### 1. Récupérer l'URL de votre App Vercel

1. Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Sélectionner votre projet `module`
3. Vous verrez l'URL de votre app (ex: `https://module-xxx.vercel.app`)

### 2. Mettre à Jour dans Vercel

1. Dans Vercel Dashboard, aller dans **Settings**
2. Cliquer sur **Environment Variables**
3. Trouver `VITE_API_URL`
4. Cliquer sur les **3 points** → **Edit**
5. Mettre à jour la valeur :
   ```
   https://votre-app.vercel.app/api
   ```
   (Remplacez `votre-app.vercel.app` par votre vraie URL)
6. Cliquer sur **Save**

### 3. Redéployer

Après avoir mis à jour la variable :
1. Vercel peut redéployer automatiquement
2. OU allez dans **Deployments**
3. Cliquez sur les **3 points** du dernier déploiement
4. Cliquez sur **Redeploy**

---

## 📝 Exemple

Si votre app Vercel est : `https://module-abc123.vercel.app`

Alors `VITE_API_URL` doit être :
```
https://module-abc123.vercel.app/api
```

---

## ✅ Vérification

Après le redéploiement, tester :

1. **Frontend** : `https://votre-app.vercel.app/`
   - Devrait afficher l'application

2. **API Health** : `https://votre-app.vercel.app/api/health`
   - Devrait retourner `{"status": "OK"}`

3. **Tester une requête API** depuis le frontend
   - Se connecter
   - Créer un deck
   - Vérifier que tout fonctionne

---

## 🔍 Comment Vérifier l'URL Actuelle

Dans Vercel Dashboard :
- **Deployments** → Cliquer sur le dernier déploiement
- L'URL est affichée en haut (ex: `https://module-xxx.vercel.app`)

---

## ⚠️ Important

- `VITE_API_URL` doit finir par `/api`
- Pas de slash à la fin : `https://app.vercel.app/api` ✅ (pas `/api/`)
- Après modification, il faut redéployer pour que les changements prennent effet

---

**✅ Une fois mis à jour, votre application sera complètement fonctionnelle !**




