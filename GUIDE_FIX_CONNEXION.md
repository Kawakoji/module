# 🔧 Guide de Résolution - Erreur "Failed to fetch" lors de la connexion/inscription

## 🔍 Diagnostic

L'erreur **"Failed to fetch"** lors de la connexion ou de l'inscription signifie que l'application ne peut pas se connecter à Supabase.

## ✅ Solution Étape par Étape

### 1. Vérifier que le fichier `.env` existe

Le fichier `.env` doit être dans le dossier `frontend/` :

```
moduleia/
└── frontend/
    └── .env  ← Ce fichier doit exister
```

### 2. Créer le fichier `.env` si il n'existe pas

Créez un fichier `frontend/.env` avec le contenu suivant :

```env
# URL de votre projet Supabase
VITE_SUPABASE_URL=https://votre-projet.supabase.co

# Clé anonyme Supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_ici

# URL de l'API backend (développement local)
VITE_API_URL=http://localhost:5000/api
```

### 3. Obtenir les valeurs Supabase

#### Étape 1 : Aller sur Supabase Dashboard

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous ou créez un compte
3. Sélectionnez votre projet (ou créez-en un nouveau)

#### Étape 2 : Récupérer l'URL du projet

1. Dans le dashboard, allez dans **Settings** (icône engrenage en bas à gauche)
2. Cliquez sur **API**
3. Copiez la valeur **Project URL** :
   ```
   https://xxxxx.supabase.co
   ```
   ➡️ C'est votre `VITE_SUPABASE_URL`

#### Étape 3 : Récupérer la clé anonyme

1. Toujours dans **Settings → API**
2. Copiez la valeur **anon public** (la longue chaîne qui commence par `eyJ...`) :
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   ➡️ C'est votre `VITE_SUPABASE_ANON_KEY`

### 4. Remplir le fichier `.env`

Remplacez les valeurs dans `frontend/.env` :

```env
VITE_SUPABASE_URL=https://votre-vraie-url.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.votre_vraie_cle
VITE_API_URL=http://localhost:5000/api
```

### 5. ⚠️ IMPORTANT : Redémarrer le serveur de développement

**Vite ne charge les variables `.env` qu'au démarrage !**

1. **Arrêtez** le serveur de développement (Ctrl+C)
2. **Redémarrez** le serveur :
   ```bash
   cd frontend
   npm run dev
   ```

### 6. Vérifier que ça fonctionne

1. Ouvrez la console du navigateur (F12)
2. Vous devriez voir : `[API] API_URL: http://localhost:5000/api`
3. Essayez de vous connecter ou de vous inscrire

---

## 🐛 Vérifications Supplémentaires

### Vérifier que le backend est démarré

Le backend doit être en cours d'exécution sur le port 5000 :

```bash
cd backend
npm run dev
```

Vous devriez voir :
```
🚀 Server running on http://localhost:5000
```

### Vérifier la configuration Supabase

1. Allez dans **Authentication** → **Settings**
2. Vérifiez que **Email** est activé
3. Si vous voulez tester rapidement, vous pouvez désactiver **"Confirm email"** (temporairement)

### Vérifier la connexion internet

L'erreur peut aussi venir d'un problème de connexion. Vérifiez que :
- Votre connexion internet fonctionne
- Aucun pare-feu ne bloque Supabase
- Vous n'êtes pas derrière un proxy d'entreprise

---

## 📋 Checklist Complète

- [ ] Fichier `frontend/.env` existe
- [ ] `VITE_SUPABASE_URL` est défini et correct
- [ ] `VITE_SUPABASE_ANON_KEY` est défini et correct
- [ ] `VITE_API_URL` est défini
- [ ] Le serveur de développement a été **redémarré** après la création/modification du `.env`
- [ ] Le backend est démarré sur le port 5000
- [ ] La connexion internet fonctionne
- [ ] Supabase est accessible (essayez d'ouvrir l'URL dans un navigateur)

---

## 🆘 Si ça ne fonctionne toujours pas

### 1. Vérifier les erreurs dans la console

Ouvrez la console du navigateur (F12) et regardez les erreurs. Vous devriez voir un message plus détaillé maintenant.

### 2. Vérifier que les variables sont chargées

Dans la console du navigateur, tapez :
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL)
```

Si cela affiche `undefined`, le fichier `.env` n'est pas chargé. Vérifiez :
- Que le fichier est bien dans `frontend/.env` (pas `frontend/src/.env`)
- Que le serveur a été redémarré

### 3. Vérifier le format du fichier `.env`

Le fichier `.env` doit :
- Ne pas avoir d'espaces autour du `=`
- Ne pas avoir de guillemets autour des valeurs (sauf si nécessaire)
- Avoir une ligne par variable

**Bon format :**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

**Mauvais format :**
```env
VITE_SUPABASE_URL = https://xxxxx.supabase.co  ← Espaces autour du =
VITE_SUPABASE_ANON_KEY="eyJ..."  ← Guillemets inutiles
```

### 4. Vérifier que Supabase est accessible

Essayez d'ouvrir l'URL de votre projet Supabase dans un navigateur :
```
https://votre-projet.supabase.co
```

Si la page ne charge pas, il y a un problème avec votre projet Supabase.

---

## 📞 Besoin d'aide ?

Si après toutes ces vérifications ça ne fonctionne toujours pas :

1. Vérifiez les logs de la console du navigateur
2. Vérifiez les logs du serveur de développement
3. Vérifiez que votre projet Supabase est actif et accessible

---

**✅ Une fois le `.env` configuré et le serveur redémarré, l'erreur devrait disparaître !**

