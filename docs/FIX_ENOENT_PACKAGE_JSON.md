# 🔧 Fix ENOENT package.json - Vercel ne trouve pas package.json

## Problème

Erreur lors du build Vercel :
```
npm error path /vercel/path0/package.json
npm error errno -2
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
Error: Command "npm run vercel-build" exited with 254
```

## Causes Possibles

1. **Le `package.json` modifié n'est pas commité** dans Git
2. **Root Directory mal configuré** dans Vercel Dashboard
3. **Build Command pointe vers un mauvais chemin**
4. **Conflit entre les paramètres Dashboard et vercel.json**

## ✅ Solution Immédiate

### Étape 1 : Commiter les changements

Les fichiers modifiés doivent être commités et poussés sur GitHub :

```bash
git add package.json vercel.json
git commit -m "Fix Vercel build configuration"
git push origin main
```

**Important** : Vercel utilise le code depuis GitHub, pas les fichiers locaux. Si `package.json` n'est pas commité, Vercel ne le verra pas.

### Étape 2 : Vérifier le Root Directory dans Vercel

1. **Aller dans Vercel Dashboard** → **Settings** → **General**
2. **Root Directory** : Doit être **VIDE** (ou `.`)
3. **Sauvegarder**

### Étape 3 : Vérifier les Build Settings

Dans **Settings** → **General** → **Build & Development Settings** :

#### Option A : Laisser Vercel utiliser vercel.json (Recommandé)

- **Build Command** : **VIDE** (sera pris depuis `vercel.json`)
- **Output Directory** : **VIDE** (sera pris depuis `vercel.json`)
- **Install Command** : **VIDE** (sera pris depuis `vercel.json`)

#### Option B : Spécifier manuellement

- **Build Command** : `cd frontend && npm install && npm run build`
- **Output Directory** : `frontend/dist`
- **Install Command** : `cd frontend && npm install`

**⚠️ Important** : Si vous utilisez l'Option B, assurez-vous que le Root Directory est **VIDE**.

### Étape 4 : Redéployer

Après avoir commité et poussé les changements :

1. **Vercel devrait automatiquement redéployer** (si auto-deploy est activé)
2. **OU** allez dans **Deployments** → **Redeploy**

## 🔍 Vérification

### Vérifier que package.json est dans Git

```bash
git ls-files package.json
```

Doit retourner : `package.json`

### Vérifier que les fichiers sont commités

```bash
git status
```

Ne doit **PAS** montrer `package.json` ou `vercel.json` comme modifiés (sauf si vous venez de les modifier localement).

### Vérifier les logs de build

Après redéploiement, les logs doivent montrer :
```
✅ Installing dependencies...
✅ Running build command...
✅ Build completed in frontend/dist
```

**Pas** d'erreur `ENOENT package.json`.

## 🐛 Si le problème persiste

### Solution Alternative 1 : Utiliser Root Directory = frontend

Si le monorepo pose problème, vous pouvez :

1. **Root Directory** : `frontend`
2. **Framework Preset** : `Vite`
3. **Build Command** : `npm run build`
4. **Output Directory** : `dist`

Mais attention : avec cette config, les routes API dans `/api/` ne fonctionneront pas car elles sont à la racine. Il faudra :
- Soit créer un projet séparé pour l'API
- Soit déplacer `api/` dans `frontend/api/` et adapter les chemins

### Solution Alternative 2 : Build Command explicite sans npm run

Si `npm run vercel-build` ne fonctionne pas, utilisez directement la commande dans `vercel.json` :

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "installCommand": "cd frontend && npm install",
  "outputDirectory": "frontend/dist"
}
```

Et dans Vercel Dashboard, **laissez Build Command VIDE** pour qu'il utilise `vercel.json`.

### Solution Alternative 3 : Vérifier les chemins relatifs

Assurez-vous que dans Vercel Dashboard, tous les chemins sont relatifs à la **racine du projet** (pas au Root Directory si vous en avez un).

## 📝 Checklist de Résolution

- [ ] `package.json` est commité dans Git
- [ ] `vercel.json` est commité dans Git
- [ ] Changements poussés sur GitHub (`git push`)
- [ ] Root Directory dans Vercel = **VIDE** (ou `.`)
- [ ] Build Command dans Vercel = **VIDE** (utilise vercel.json)
- [ ] Output Directory dans Vercel = **VIDE** (utilise vercel.json)
- [ ] Install Command dans Vercel = **VIDE** (utilise vercel.json)
- [ ] Redéploiement effectué
- [ ] Logs de build montrent "Installing dependencies" (pas d'erreur ENOENT)

## ✅ Résultat Attendu

Après correction :
- ✅ Build trouve `package.json`
- ✅ Installation des dépendances réussit
- ✅ Build du frontend s'exécute
- ✅ Fichiers créés dans `frontend/dist`
- ✅ Déploiement réussi

