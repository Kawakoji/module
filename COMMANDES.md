# 🛠️ Commandes utiles - Moduleia

## 📦 Installation

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

---

## 🚀 Développement

### Frontend (port 3000)
```bash
cd frontend
npm run dev
```

### Backend (port 5000)
```bash
cd backend
npm run dev
```

---

## 🏗️ Build

### Frontend
```bash
cd frontend
npm run build          # Build de production
npm run preview        # Prévisualiser le build
```

### Backend
```bash
cd backend
npm start              # Démarrer en production
```

---

## 🧪 Tests (à venir)

```bash
# Frontend
cd frontend
npm run test

# Backend
cd backend
npm run test
```

---

## 📝 Linting (à configurer)

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

---

## 🔍 Vérification

### Vérifier que le frontend fonctionne
Ouvrir : http://localhost:3000

### Vérifier que le backend fonctionne
```bash
curl http://localhost:5000/api/health
```

Réponse attendue :
```json
{
  "status": "OK",
  "message": "Moduleia API is running"
}
```

---

## 🗄️ Base de données (Supabase)

### Créer les tables
À venir dans l'étape 3.

### Migrations
À venir dans l'étape 3.

---

## 🧹 Nettoyage

### Supprimer node_modules
```bash
# Frontend
cd frontend
rm -rf node_modules

# Backend
cd backend
rm -rf node_modules
```

### Réinstaller
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

---

## 📦 Production

### Variables d'environnement
Assurez-vous d'avoir configuré toutes les variables dans votre plateforme de déploiement :
- Vercel (frontend)
- Render/Railway (backend)
- Supabase (base de données)

---

## 🔧 Utilitaires

### Voir les logs
```bash
# Backend
cd backend
npm run dev    # Logs dans la console
```

### Vérifier les ports
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Mac/Linux
lsof -i :3000
lsof -i :5000
```

---

## 📚 Documentation

- [Guide de démarrage](./docs/QUICKSTART.md)
- [Étapes de développement](./docs/ETAPES.md)
- [Étape 1 détaillée](./docs/ETAPE1.md)
- [Récapitulatif](./docs/RECAPITULATIF.md)




