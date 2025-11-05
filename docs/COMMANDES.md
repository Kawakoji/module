# 📋 Commandes Utiles - Moduleia

Liste des commandes utiles pour développer et maintenir Moduleia.

---

## 🚀 Développement

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint

# Tests
npm test
npm run test:ui          # Interface de test
npm run test:coverage    # Coverage report
```

### Backend

```bash
cd backend

# Installer les dépendances
npm install

# Démarrer en mode développement (avec nodemon)
npm run dev

# Démarrer en production
npm start

# Tests
npm test
npm run test:watch       # Mode watch
npm run test:coverage    # Coverage report
```

---

## 🗄️ Base de données

### Supabase

```bash
# Accéder à Supabase Dashboard
# https://supabase.com/dashboard

# SQL Editor : Exécuter les migrations
# 1. backend/src/migrations/001_create_tables.sql
# 2. backend/src/migrations/002_update_rls_policies.sql
```

### Migrations

Les migrations doivent être exécutées manuellement dans Supabase SQL Editor :
- `001_create_tables.sql` : Création des tables
- `002_update_rls_policies.sql` : Mise à jour des politiques RLS

---

## 🧪 Tests

### Frontend (Vitest)

```bash
cd frontend
npm test                 # Lancer tous les tests
npm run test:ui          # Interface graphique
npm run test:coverage    # Rapport de couverture
```

### Backend (Jest)

```bash
cd backend
npm test                 # Lancer tous les tests
npm run test:watch       # Mode watch
npm run test:coverage    # Rapport de couverture
```

---

## 🏗️ Build et Déploiement

### Build Frontend

```bash
cd frontend
npm run build
# Les fichiers sont dans frontend/dist/
```

### Variables d'environnement

**Frontend (.env)** :
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=...
```

**Backend (.env)** :
```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
OPENAI_API_KEY=...
```

---

## 🔍 Debugging

### Backend

```bash
# Voir les logs
cd backend
npm run dev

# Vérifier la santé de l'API
curl http://localhost:5000/api/health
```

### Frontend

```bash
# Ouvrir les DevTools du navigateur
# Console : Erreurs JavaScript
# Network : Requêtes API
# React DevTools : Composants React
```

### Base de données

```bash
# Voir les données dans Supabase Dashboard
# Table Editor → Sélectionner la table
```

---

## 📦 Installation complète

### Première installation

```bash
# Cloner le projet
git clone <repository-url>
cd moduleia

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

# Créer les fichiers .env (voir .env.example)
```

### Mise à jour des dépendances

```bash
# Frontend
cd frontend
npm update

# Backend
cd backend
npm update
```

---

## 🧹 Nettoyage

### Supprimer node_modules

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Nettoyer les fichiers temporaires

```bash
# Supprimer les uploads temporaires
rm -rf backend/uploads/*

# Supprimer les builds
rm -rf frontend/dist/
rm -rf backend/build/
```

---

## 🔐 Sécurité

### Vérifier les variables d'environnement

```bash
# Ne jamais commiter les .env
git check-ignore .env
# Devrait retourner : .env
```

### Vérifier les secrets

```bash
# Chercher les clés API dans le code
grep -r "sk-" .
grep -r "API_KEY" .
```

---

## 📊 Monitoring

### Health Check

```bash
# Vérifier que le backend fonctionne
curl http://localhost:5000/api/health
```

### Logs

**Render** :
- Dashboard → Logs

**Railway** :
- Dashboard → Logs

**Vercel** :
- Dashboard → Logs

---

## 🐛 Dépannage

### Backend ne démarre pas

```bash
# Vérifier les variables d'environnement
cat backend/.env

# Vérifier les ports
lsof -i :5000

# Vérifier les dépendances
cd backend && npm list
```

### Frontend ne se connecte pas au backend

```bash
# Vérifier l'URL de l'API
echo $VITE_API_URL

# Vérifier CORS
curl -H "Origin: http://localhost:5173" http://localhost:5000/api/health
```

### Erreurs Supabase

```bash
# Vérifier les clés dans Supabase Dashboard
# Settings → API → Project API keys
```

---

## 📝 Utilitaires

### Formatage du code

```bash
# Vérifier le format (ESLint)
cd frontend && npm run lint
cd backend && npm run lint
```

### Export de la base de données

```bash
# Via Supabase Dashboard
# Database → Backups → Download
```

---

## 🔄 CI/CD (Futur)

### GitHub Actions

```bash
# Workflow automatique (à créer)
.github/workflows/test.yml
.github/workflows/deploy.yml
```

---

**💡 Astuce** : Créez des alias dans votre shell pour les commandes fréquentes :

```bash
# ~/.bashrc ou ~/.zshrc
alias mf-dev="cd frontend && npm run dev"
alias mb-dev="cd backend && npm run dev"
alias mf-test="cd frontend && npm test"
alias mb-test="cd backend && npm test"
```



