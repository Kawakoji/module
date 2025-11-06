# ÉTAPE 4 — AUTHENTIFICATION

## 🎯 Objectif

Implémenter l'authentification complète avec Supabase Auth, sécuriser les routes API, et protéger les données utilisateur avec RLS.

---

## ✅ Ce qui a été implémenté

### 1. Frontend - Authentification

#### AuthContext (`frontend/src/contexts/AuthContext.jsx`)
- Gestion de la session utilisateur
- Fonctions `signUp`, `signIn`, `signOut`
- Écoute des changements d'authentification
- État `loading` et `isAuthenticated`
- Export du client Supabase pour utilisation dans les services

#### Pages d'authentification

**Login.jsx**
- Formulaire de connexion (email/password)
- Gestion des erreurs
- Redirection après connexion

**Signup.jsx**
- Formulaire d'inscription (email, password, fullName)
- Validation des mots de passe
- Confirmation email (si activée dans Supabase)
- Redirection après inscription

#### ProtectedRoute (`frontend/src/components/ProtectedRoute.jsx`)
- Composant pour protéger les routes
- Redirection vers `/login` si non authentifié
- Affichage d'un loader pendant la vérification

#### Layout mis à jour
- Affichage conditionnel selon l'état d'authentification
- Boutons Connexion/Inscription si non authentifié
- Email de l'utilisateur et bouton Déconnexion si authentifié
- Navigation masquée si non authentifié

### 2. Backend - Sécurisation

#### Middleware d'authentification (`backend/src/middleware/auth.js`)
- `authenticate` : Vérifie le token JWT et ajoute `req.user`
- `optionalAuth` : Authentification optionnelle (pour routes publiques)
- Utilisation de Supabase pour valider les tokens

#### Routes sécurisées
- Toutes les routes `/api/decks/*` nécessitent une authentification
- Toutes les routes `/api/cards/*` nécessitent une authentification
- Le middleware `authenticate` est appliqué à toutes les routes

#### Contrôleurs mis à jour
- Vérification de `req.user` dans tous les contrôleurs
- Vérification des permissions (un utilisateur ne peut modifier que ses propres decks)
- Retour d'erreur 401 (Unauthorized) si non authentifié
- Retour d'erreur 403 (Forbidden) si accès non autorisé

#### Services mis à jour
- `getAllDecks` : Requiert `userId` et filtre par utilisateur
- `createDeck` : Requiert `user_id` obligatoire
- `getCardsToReview` : Filtre par `userId` via les decks

### 3. Base de données - RLS (Row Level Security)

#### Migration SQL (`backend/src/migrations/002_update_rls_policies.sql`)

**Politiques RLS créées :**

1. **Profiles**
   - Lecture : Utilisateur peut voir son propre profil
   - Mise à jour : Utilisateur peut modifier son propre profil
   - Création : Automatique via trigger lors de l'inscription

2. **Decks**
   - Lecture : Utilisateur voit uniquement ses decks
   - Création : Uniquement avec son propre `user_id`
   - Mise à jour : Uniquement ses propres decks
   - Suppression : Uniquement ses propres decks

3. **Cards**
   - Lecture : Cartes des decks de l'utilisateur
   - Création : Uniquement dans ses propres decks
   - Mise à jour : Uniquement dans ses propres decks
   - Suppression : Uniquement dans ses propres decks

**Trigger automatique :**
- Création automatique d'un profil lors de l'inscription (`handle_new_user`)

### 4. Service API frontend mis à jour

#### Récupération du token
- Utilisation de `supabase.auth.getSession()` pour obtenir le token
- Ajout automatique du header `Authorization: Bearer <token>`
- Gestion des erreurs si la session n'est pas disponible

---

## 🔒 Sécurité

### Protection des routes
- **Frontend** : Routes protégées avec `ProtectedRoute`
- **Backend** : Middleware `authenticate` sur toutes les routes API
- **Base de données** : RLS activé avec politiques basées sur `user_id`

### Validation des permissions
- Vérification que le deck appartient à l'utilisateur avant modification/suppression
- Vérification que le deck appartient à l'utilisateur avant création de carte
- RLS au niveau base de données comme couche de sécurité supplémentaire

### Tokens JWT
- Tokens gérés par Supabase Auth
- Validation côté backend avec Supabase
- Expiration automatique gérée par Supabase

---

## 📝 Configuration requise

### Variables d'environnement

**Frontend (.env) :**
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon
VITE_API_URL=http://localhost:5000
```

**Backend (.env) :**
```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=votre_cle_anon
SUPABASE_SERVICE_KEY=votre_cle_service_role
```

### Migrations SQL

1. **Exécuter la migration 001** (si pas déjà fait)
   - Créer les tables de base

2. **Exécuter la migration 002** (nouvelle)
   - Mettre à jour les politiques RLS
   - Créer le trigger pour les profils

### Configuration Supabase Auth

Dans le dashboard Supabase :
1. Aller dans Authentication → Settings
2. Configurer les providers (Email/Password est activé par défaut)
3. Optionnel : Configurer la confirmation email

---

## 🚀 Utilisation

### Inscription
1. Aller sur `/signup`
2. Remplir le formulaire (email, password, nom)
3. Cliquer sur "S'inscrire"
4. Si confirmation email activée, vérifier l'email
5. Redirection automatique vers la page d'accueil

### Connexion
1. Aller sur `/login`
2. Entrer email et mot de passe
3. Cliquer sur "Se connecter"
4. Redirection automatique vers la page d'accueil

### Déconnexion
1. Cliquer sur "Déconnexion" dans la navigation
2. Redirection vers la page d'accueil
3. Les données sont réinitialisées

---

## ✅ Checklist de l'étape 4

- [x] AuthContext créé avec gestion de session
- [x] Pages Login et Signup créées
- [x] ProtectedRoute pour protéger les routes
- [x] Layout mis à jour avec gestion d'authentification
- [x] Middleware d'authentification backend
- [x] Routes API sécurisées
- [x] Contrôleurs mis à jour avec vérification des permissions
- [x] Services mis à jour pour filtrer par utilisateur
- [x] Migration RLS créée
- [x] Trigger pour création automatique de profil
- [x] Service API mis à jour pour inclure le token
- [x] AppContext mis à jour pour charger les données seulement si authentifié

---

## 🔄 Flux d'authentification

### Inscription
```
1. Utilisateur remplit le formulaire
2. Appel à supabase.auth.signUp()
3. Supabase crée l'utilisateur dans auth.users
4. Trigger crée automatiquement le profil dans public.profiles
5. Si confirmation email : email envoyé
6. Redirection vers /login ou / (selon confirmation)
```

### Connexion
```
1. Utilisateur remplit le formulaire
2. Appel à supabase.auth.signInWithPassword()
3. Supabase valide les credentials
4. Session créée avec token JWT
5. Token stocké dans localStorage (par Supabase)
6. Redirection vers /
```

### Requête API authentifiée
```
1. Frontend : Récupère le token depuis Supabase
2. Frontend : Envoie le token dans header Authorization: Bearer <token>
3. Backend : Middleware authenticate vérifie le token
4. Backend : Supabase valide le token
5. Backend : req.user est rempli avec les données utilisateur
6. Backend : Contrôleur utilise req.user.id pour filtrer les données
7. Backend : RLS au niveau base de données double la sécurité
```

---

## 🐛 Problèmes connus / Limitations

1. **Confirmation email** : Si activée dans Supabase, l'utilisateur doit vérifier son email avant de pouvoir se connecter. La page Signup affiche un message approprié.

2. **Gestion des erreurs** : Les erreurs d'authentification sont affichées à l'utilisateur, mais pourraient être améliorées avec des messages plus spécifiques.

3. **Refresh token** : Supabase gère automatiquement le refresh des tokens, mais en cas d'expiration, l'utilisateur devra se reconnecter.

4. **Mot de passe oublié** : Non implémenté dans cette étape. Peut être ajouté avec `supabase.auth.resetPasswordForEmail()`.

---

## 📝 Prochaines étapes

### ÉTAPE 5 — GESTION DES DECKS ET CARTES
Cette étape est déjà largement implémentée, mais on pourrait ajouter :
- Validation côté serveur plus poussée
- Gestion des erreurs améliorée
- Pagination pour les grandes listes

### Améliorations possibles
- [ ] Mot de passe oublié
- [ ] Changement de mot de passe
- [ ] Gestion du profil utilisateur
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Refresh automatique du token
- [ ] Gestion des sessions multiples

---

## 💡 Notes importantes

1. **RLS double sécurité** : Même si le middleware backend filtre les données, RLS ajoute une couche de sécurité supplémentaire au niveau base de données.

2. **Tokens JWT** : Les tokens sont signés par Supabase et contiennent les informations de l'utilisateur. Ils expirent après un certain temps (configurable dans Supabase).

3. **Profils automatiques** : Le trigger `handle_new_user` crée automatiquement un profil dans `public.profiles` lors de l'inscription. Cela évite d'avoir des utilisateurs sans profil.

4. **Sécurité des routes** : Toutes les routes API nécessitent maintenant une authentification. La route `/api/health` reste publique pour les vérifications.

5. **Isolation des données** : Chaque utilisateur ne voit que ses propres decks et cartes grâce à RLS et au filtrage dans les services.

---

**✅ ÉTAPE 4 TERMINÉE** — L'authentification est maintenant complète et sécurisée !




