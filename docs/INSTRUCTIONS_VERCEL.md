# 📋 Instructions Vercel - Configuration Root Directory

## Problème actuel

Vercel affiche : `The specified Root Directory "frontend" does not exist.`

## Solution : Retirer le Root Directory

### Étapes dans Vercel Dashboard

1. **Ouvrir votre projet sur Vercel**
   - Allez sur https://vercel.com
   - Ouvrez votre projet `module`

2. **Aller dans Settings**
   - Cliquez sur **Settings** (en haut à droite)
   - Puis **General** dans le menu de gauche

3. **Retirer le Root Directory**
   - Dans la section **Root Directory**, **effacez complètement** le champ
   - Laissez-le **vide**
   - **OU** mettez juste `/` (la racine)

4. **Sauvegarder**
   - Cliquez sur **Save**

5. **Redéployer**
   - Allez dans **Deployments**
   - Cliquez sur les **3 points** (...) du dernier déploiement
   - Cliquez sur **Redeploy**
   - **OU** poussez un nouveau commit sur GitHub

## Configuration utilisée

Avec Root Directory vide, Vercel utilisera :
- `vercel.json` à la racine du projet
- `buildCommand`: `cd frontend && npm install && npm run build`
- `outputDirectory`: `frontend/dist`
- Serverless Functions dans `api/[...path].js`

## Vérification

Après le redéploiement :
1. Vérifiez les logs de build (ils doivent être verts)
2. Testez l'application sur votre URL Vercel
3. `/` devrait maintenant servir le frontend
4. `/api/health` devrait répondre




