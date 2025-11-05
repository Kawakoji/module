# 🔧 Fix "Root Directory does not exist"

## Problème

Vercel affiche : `The specified Root Directory "frontend" does not exist.`

## Solutions

### Solution 1 : Vérifier le Root Directory dans Vercel Dashboard

1. **Aller dans Vercel Dashboard**
   - Ouvrez votre projet
   - Allez dans **Settings** → **General**

2. **Vérifier/Corriger le Root Directory**
   - Le champ doit être exactement : `frontend` (sans slash, sans espace)
   - **NE PAS** mettre : `/frontend` ou `./frontend` ou `frontend/`
   - Juste : `frontend`

3. **Sauvegarder et redéployer**

### Solution 2 : Ne pas utiliser Root Directory (Recommandé pour monorepo)

Si la solution 1 ne fonctionne pas, utilisez la configuration à la racine :

1. **Dans Vercel Dashboard**
   - Settings → General
   - Root Directory : **Laisser vide** (ou mettre `/`)

2. **Utiliser `vercel.json` à la racine**
   - Le fichier `vercel.json` à la racine sera utilisé
   - Il configure déjà le build et l'output directory

### Solution 3 : Vérifier la structure Git

Assurez-vous que le dossier `frontend/` est bien commité dans Git :

```bash
git ls-tree -r HEAD --name-only | grep "^frontend"
```

Si le dossier n'apparaît pas, il faut l'ajouter :

```bash
git add frontend/
git commit -m "Add frontend directory"
git push
```

## Configuration recommandée

Pour un monorepo, je recommande **Solution 2** (pas de Root Directory) :

- Root Directory dans Vercel : **vide** ou `/`
- Utiliser `vercel.json` à la racine avec `buildCommand` et `outputDirectory`



