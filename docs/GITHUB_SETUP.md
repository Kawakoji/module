# 📦 Configuration GitHub pour Déploiement Vercel

Guide pour pousser le code sur GitHub et déployer sur Vercel.

---

## ✅ Étape 1 : Créer un Repository GitHub

1. Aller sur [github.com/new](https://github.com/new)
2. **Repository name** : `moduleia` (ou un autre nom)
3. **Description** : "Application de flashcards intelligente avec IA"
4. **Visibility** : Public ou Private (selon vos préférences)
5. **Ne PAS** cocher "Add a README file" (le projet en a déjà un)
6. Cliquer sur **"Create repository"**

---

## ✅ Étape 2 : Configurer le Remote Git

Une fois le repository créé, GitHub vous donnera une URL. Utilisez-la pour configurer le remote :

```bash
cd C:\Users\adamh\Desktop\moduleia

# Supprimer l'ancien remote (si nécessaire)
git remote remove origin

# Ajouter le nouveau remote (remplacez par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/moduleia.git

# Vérifier
git remote -v
```

---

## ✅ Étape 3 : Pousser le Code

```bash
# Pousser sur GitHub
git push -u origin main
```

Si vous avez une erreur d'authentification, vous devrez peut-être configurer un token GitHub.

---

## ✅ Étape 4 : Déployer sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer sur **"Add New Project"**
3. Importer le repository GitHub `moduleia`
4. Vercel détectera automatiquement :
   - **Framework** : Vite
   - **Root Directory** : `.` (racine)
   - **Build Command** : `cd frontend && npm run build`
   - **Output Directory** : `frontend/dist`

5. **Configurer les variables d'environnement** :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` (sera `https://votre-app.vercel.app/api` après le premier déploiement)
   - `DATABASE_URL` (votre connection string Neon)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_KEY`
   - `OPENAI_API_KEY` (optionnel)

6. Cliquer sur **"Deploy"**

---

## 🔧 Configuration Vercel pour Monorepo

Vercel devrait détecter automatiquement la configuration dans `vercel.json`, mais vous pouvez aussi configurer manuellement :

**Build Settings** :
- **Root Directory** : `.` (racine du projet)
- **Build Command** : `cd frontend && npm install && npm run build`
- **Output Directory** : `frontend/dist`
- **Install Command** : `npm install` (Vercel détectera automatiquement les packages.json)

**Functions** :
- Vercel détectera automatiquement `backend/api/index.js` pour les Serverless Functions

---

## 📝 Notes Importantes

### Variables d'environnement

**Frontend** (préfixe `VITE_`) :
- Accessibles seulement au build time
- Compilées dans le code JavaScript

**Backend** :
- Accessibles au runtime
- Ne pas commiter les secrets !

### CORS

Après le déploiement, mettre à jour `VITE_API_URL` dans Vercel avec l'URL réelle de votre app.

---

## 🚀 Prochaines Étapes

1. ✅ Créer le repo GitHub
2. ✅ Configurer le remote
3. ✅ Pousser le code
4. ✅ Déployer sur Vercel
5. ✅ Configurer les variables d'environnement
6. ✅ Tester l'application

---

**Bon déploiement ! 🎉**








