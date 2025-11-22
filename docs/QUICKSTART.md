# 🚀 Guide de démarrage rapide - Moduleia

## Installation en 5 minutes

### Prérequis
- Node.js 20+ installé
- npm ou yarn
- Compte Supabase (gratuit) : [supabase.com](https://supabase.com)
- Clé API OpenAI (optionnel pour l'étape 7)

---

## 1. Cloner ou télécharger le projet

```bash
# Si vous avez Git
git clone <url-du-repo>
cd moduleia

# Ou simplement téléchargez et extrayez le projet
```

---

## 2. Installer les dépendances

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

## 3. Configurer Supabase

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez :
   - L'URL du projet (ex: `https://xxxxx.supabase.co`)
   - La clé `anon` (clé publique)
   - La clé `service_role` (clé secrète, pour le backend)

---

## 4. Créer les fichiers .env

### Frontend (.env)
Dans `frontend/.env` :
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=http://localhost:5000
```

### Backend (.env)
Dans `backend/.env` :
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
OPENAI_API_KEY=votre_cle_openai_optional
```

---

## 5. Démarrer l'application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
Le backend sera sur `http://localhost:5000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Le frontend sera sur `http://localhost:3000`

---

## 6. Vérifier que tout fonctionne

1. Ouvrez `http://localhost:3000` dans votre navigateur
2. Vous devriez voir la page d'accueil de Moduleia
3. Testez la navigation (Accueil, Mes Decks, Révision)
4. Vérifiez le backend : `http://localhost:5000/api/health`

---

## 🐛 Problèmes courants

### Port déjà utilisé
Si le port 3000 ou 5000 est occupé :
- Frontend : Modifiez `vite.config.js` → `server.port`
- Backend : Modifiez `PORT` dans `backend/.env`

### Erreur CORS
Assurez-vous que le backend tourne et que CORS est bien configuré dans `backend/src/server.js`

### Variables d'environnement non chargées
Vérifiez que vos fichiers `.env` sont bien dans les dossiers `frontend/` et `backend/`

---

## 📚 Prochaines étapes

Consultez [ETAPES.md](./ETAPES.md) pour suivre le développement étape par étape.

---

## 💡 Besoin d'aide ?

- Documentation Supabase : [supabase.com/docs](https://supabase.com/docs)
- Documentation Vite : [vitejs.dev](https://vitejs.dev)
- Documentation React : [react.dev](https://react.dev)








