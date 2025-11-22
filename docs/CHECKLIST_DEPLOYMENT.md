# ✅ Checklist de Déploiement - Vercel + Neon

Checklist complète pour déployer Moduleia sur Vercel avec Neon.

---

## 🔧 Préparation

### Base de données

- [ ] Créer un compte Neon : [neon.tech](https://neon.tech)
- [ ] Créer un nouveau projet Neon
- [ ] Noter la **Connection String** (DATABASE_URL)
- [ ] Exécuter les migrations SQL dans Neon SQL Editor :
  - [ ] `001_create_tables.sql`
  - [ ] `002_update_rls_policies.sql` (adapter si nécessaire)
- [ ] Tester la connexion avec un client PostgreSQL

### Authentification

- [ ] Créer un compte Supabase : [supabase.com](https://supabase.com)
- [ ] Créer un nouveau projet (uniquement pour Auth)
- [ ] Noter l'URL et les clés API
- [ ] Configurer Email/Password dans Authentication → Settings

### Code

- [ ] Vérifier que tous les fichiers sont commités
- [ ] Pousser le code sur GitHub
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Créer les fichiers `.env.example` (déjà fait)

---

## 🚀 Déploiement Vercel

### Configuration projet

- [ ] Aller sur [vercel.com](https://vercel.com)
- [ ] Importer le projet depuis GitHub
- [ ] Configurer :
  - [ ] **Root Directory** : `.` (racine du monorepo)
  - [ ] **Framework Preset** : Vite (pour frontend)
  - [ ] **Build Command** : `cd frontend && npm run build`
  - [ ] **Output Directory** : `frontend/dist`
  - [ ] **Install Command** : `npm install` (auto-détecté)

### Variables d'environnement

**Frontend** (dans Vercel Dashboard) :
- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_API_URL` (ex: `https://votre-app.vercel.app/api`)

**Backend** :
- [ ] `PORT=5000` (ou laisser Vercel gérer)
- [ ] `NODE_ENV=production`
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_KEY`
- [ ] `DATABASE_URL` (connection string Neon)
- [ ] `OPENAI_API_KEY` (optionnel)

### Déploiement

- [ ] Cliquer sur "Deploy"
- [ ] Attendre la fin du build (2-3 minutes)
- [ ] Vérifier que le build est réussi
- [ ] Noter l'URL de déploiement

---

## 🧪 Tests post-déploiement

### Frontend

- [ ] Page d'accueil accessible
- [ ] Navigation fonctionnelle
- [ ] Mode sombre/clair fonctionne
- [ ] Thème sauvegardé

### Authentification

- [ ] Page `/signup` accessible
- [ ] Création de compte fonctionne
- [ ] Page `/login` accessible
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne
- [ ] Redirection après auth fonctionne

### Fonctionnalités principales

- [ ] Page `/decks` accessible
- [ ] Création de deck fonctionne
- [ ] Modification de deck fonctionne
- [ ] Suppression de deck fonctionne
- [ ] Page `/decks/:id` accessible
- [ ] Création de carte fonctionne
- [ ] Modification de carte fonctionne
- [ ] Suppression de carte fonctionne
- [ ] Flip de carte fonctionne

### Révision

- [ ] Page `/review` accessible
- [ ] Chargement des cartes à réviser fonctionne
- [ ] Flip de carte fonctionne
- [ ] Évaluation (difficile/moyen/facile) fonctionne
- [ ] Passage à la carte suivante fonctionne
- [ ] Statistiques de session s'affichent

### IA (si configuré)

- [ ] Bouton "Générer avec IA" visible
- [ ] Modal de génération s'ouvre
- [ ] Génération depuis texte fonctionne
- [ ] Génération depuis sujet fonctionne
- [ ] Création des cartes générées fonctionne

### Import de documents

- [ ] Bouton "Importer document" visible
- [ ] Upload de fichier fonctionne
- [ ] Extraction de texte fonctionne
- [ ] Génération de cartes depuis document fonctionne

### Statistiques

- [ ] Page `/stats` accessible
- [ ] Statistiques globales s'affichent
- [ ] Graphiques se chargent
- [ ] Statistiques par deck s'affichent

### Profil

- [ ] Page `/profile` accessible
- [ ] Modification du profil fonctionne
- [ ] Sauvegarde du profil fonctionne

### Sauvegarde

- [ ] Bouton "Sauvegarde" visible
- [ ] Export de tous les decks fonctionne
- [ ] Export d'un deck fonctionne
- [ ] Import de sauvegarde fonctionne

---

## 🔍 Vérifications techniques

### API

- [ ] `GET /api/health` retourne 200
- [ ] Toutes les routes API sont accessibles
- [ ] Les erreurs sont gérées correctement
- [ ] Rate limiting fonctionne

### Base de données

- [ ] Connexion à Neon fonctionne
- [ ] Tables créées correctement
- [ ] Données persistées correctement
- [ ] Requêtes performantes

### Performance

- [ ] Temps de chargement < 3s
- [ ] Images optimisées
- [ ] Code minifié
- [ ] Compression activée

### Sécurité

- [ ] HTTPS activé (automatique sur Vercel)
- [ ] CORS configuré correctement
- [ ] Variables d'environnement sécurisées
- [ ] Authentification requise pour les routes protégées

---

## 📊 Monitoring

### Vercel

- [ ] Vérifier les logs dans Vercel Dashboard
- [ ] Configurer les Analytics (optionnel)
- [ ] Configurer les Web Vitals (optionnel)

### Neon

- [ ] Vérifier les connexions actives
- [ ] Vérifier l'utilisation de la base
- [ ] Configurer les backups (optionnel)

---

## 🐛 Problèmes courants

### Build échoue

- [ ] Vérifier les logs dans Vercel
- [ ] Vérifier que tous les packages.json sont corrects
- [ ] Vérifier les variables d'environnement

### Erreur 500

- [ ] Vérifier les logs backend dans Vercel
- [ ] Vérifier la connexion à Neon
- [ ] Vérifier les variables d'environnement

### Erreur CORS

- [ ] Vérifier `VITE_API_URL`
- [ ] Vérifier la configuration CORS dans le backend

### Erreur d'authentification

- [ ] Vérifier les clés Supabase
- [ ] Vérifier que Supabase Auth est configuré
- [ ] Vérifier les tokens JWT

---

## ✅ Déploiement réussi !

Si tous les items sont cochés, votre application est déployée et fonctionnelle ! 🎉

---

**Prochaines étapes** :
1. Partager l'URL avec vos utilisateurs
2. Monitorer les performances
3. Ajouter des fonctionnalités selon les besoins








