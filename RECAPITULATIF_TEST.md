# 📋 RÉCAPITULATIF COMPLET - MODULEIA
## Guide de test des fonctionnalités

Ce document liste toutes les fonctionnalités censées fonctionner dans l'application Moduleia pour que vous puissiez les tester systématiquement.

---

## 🔐 1. AUTHENTIFICATION

### Fonctionnalités à tester :

#### **Inscription (Signup)**
- ✅ Créer un nouveau compte avec email et mot de passe
- ✅ Validation des champs (email valide, mot de passe minimum)
- ✅ Messages d'erreur si l'email existe déjà
- ✅ Redirection vers la page de connexion après inscription réussie

#### **Connexion (Login)**
- ✅ Se connecter avec email et mot de passe
- ✅ Messages d'erreur si identifiants incorrects
- ✅ Redirection vers la page d'accueil après connexion
- ✅ Persistance de la session (rester connecté après rafraîchissement)

#### **Déconnexion**
- ✅ Bouton de déconnexion dans le menu
- ✅ Redirection vers la page d'accueil après déconnexion
- ✅ Suppression de la session

#### **Protection des routes**
- ✅ Redirection vers `/login` si non connecté
- ✅ Accès bloqué aux pages protégées sans authentification

---

## 📚 2. GESTION DES DECKS

### Fonctionnalités à tester :

#### **Création de deck**
- ✅ Créer un nouveau deck avec nom et description
- ✅ Validation des champs (nom requis)
- ✅ Affichage du nouveau deck dans la liste
- ✅ Messages d'erreur si création échoue

#### **Liste des decks**
- ✅ Afficher tous les decks de l'utilisateur
- ✅ Afficher le nombre de cartes par deck
- ✅ Affichage correct même avec 0 deck
- ✅ Indicateur de chargement pendant le fetch

#### **Détails d'un deck**
- ✅ Afficher les informations du deck (nom, description)
- ✅ Afficher toutes les cartes du deck
- ✅ Navigation depuis la liste vers les détails
- ✅ Bouton pour retourner à la liste

#### **Modification de deck**
- ✅ Modifier le nom d'un deck
- ✅ Modifier la description d'un deck
- ✅ Sauvegarde des modifications
- ✅ Mise à jour immédiate dans l'interface

#### **Suppression de deck**
- ✅ Supprimer un deck (avec confirmation)
- ✅ Suppression de toutes les cartes associées
- ✅ Retrait du deck de la liste après suppression
- ✅ Messages d'erreur si suppression échoue

---

## 🎴 3. GESTION DES CARTES

### Fonctionnalités à tester :

#### **Création de carte**
- ✅ Créer une carte avec question et réponse
- ✅ Associer la carte à un deck
- ✅ Validation des champs (question et réponse requis)
- ✅ Affichage immédiat dans la liste des cartes
- ✅ Incrémentation du compteur de cartes du deck

#### **Liste des cartes**
- ✅ Afficher toutes les cartes d'un deck
- ✅ Affichage correct même avec 0 carte
- ✅ Pagination si beaucoup de cartes
- ✅ Indicateur de chargement

#### **Détails d'une carte**
- ✅ Afficher la question et la réponse
- ✅ Afficher les métadonnées (date de création, prochaine révision)
- ✅ Navigation depuis la liste vers les détails

#### **Modification de carte**
- ✅ Modifier la question d'une carte
- ✅ Modifier la réponse d'une carte
- ✅ Sauvegarde des modifications
- ✅ Mise à jour immédiate dans l'interface

#### **Suppression de carte**
- ✅ Supprimer une carte (avec confirmation)
- ✅ Retrait de la carte de la liste après suppression
- ✅ Décrémentation du compteur de cartes du deck
- ✅ Messages d'erreur si suppression échoue

---

## 📊 4. SYSTÈME DE RÉVISION ESPACÉE (SM2)

### Fonctionnalités à tester :

#### **Récupération des cartes à réviser**
- ✅ Afficher les cartes dont la date de révision est arrivée
- ✅ Compteur correct sur la page d'accueil
- ✅ Affichage "Aucune carte à réviser" si aucune carte

#### **Interface de révision**
- ✅ Afficher la question de la carte
- ✅ Bouton pour retourner la carte (voir la réponse)
- ✅ Affichage de la réponse après retournement
- ✅ Boutons de notation : Facile / Moyen / Difficile / À revoir

#### **Soumission de révision**
- ✅ Enregistrer la révision avec la note choisie
- ✅ Calcul automatique de la prochaine date de révision (algorithme SM2)
- ✅ Mise à jour de l'intervalle de révision
- ✅ Passage à la carte suivante automatiquement
- ✅ Fin de session quand toutes les cartes sont révisées

#### **Algorithme SM2**
- ✅ Intervalle augmente si la réponse est "Facile"
- ✅ Intervalle diminue si la réponse est "Difficile" ou "À revoir"
- ✅ Calcul correct de la prochaine date selon l'algorithme
- ✅ Statistiques de session (nombre de cartes révisées, réussites, échecs)

#### **Révision par lot (batch)**
- ✅ Réviser plusieurs cartes en une seule requête
- ✅ Mise à jour correcte de toutes les cartes

---

## 🤖 5. GÉNÉRATION IA DE CARTES

### Fonctionnalités à tester :

#### **Génération depuis texte**
- ✅ Saisir un texte dans le modal
- ✅ Générer des cartes à partir du texte
- ✅ Affichage des cartes générées avant création
- ✅ Possibilité de modifier les cartes avant de les sauvegarder
- ✅ Création des cartes dans le deck sélectionné
- ✅ Messages d'erreur si génération échoue (API OpenAI)

#### **Génération depuis sujet**
- ✅ Saisir un sujet (ex: "Photosynthèse")
- ✅ Génération automatique de cartes sur ce sujet
- ✅ Affichage des cartes générées
- ✅ Création dans le deck sélectionné

#### **Génération et création directe**
- ✅ Générer et créer directement sans prévisualisation
- ✅ Cartes créées immédiatement dans le deck

#### **Gestion des erreurs IA**
- ✅ Message d'erreur si clé API manquante
- ✅ Message d'erreur si quota OpenAI dépassé
- ✅ Message d'erreur si texte trop long
- ✅ Rate limiting (limite de requêtes)

---

## 📄 6. IMPORT DE DOCUMENTS

### Fonctionnalités à tester :

#### **Upload de fichier**
- ✅ Upload de fichier PDF
- ✅ Upload de fichier texte (.txt)
- ✅ Drag & drop de fichier
- ✅ Sélection de fichier via bouton
- ✅ Indicateur de progression pendant l'upload
- ✅ Messages d'erreur si format non supporté
- ✅ Messages d'erreur si fichier trop volumineux

#### **Extraction de texte**
- ✅ Extraction automatique du texte depuis PDF
- ✅ Extraction du texte depuis fichier .txt
- ✅ Affichage du texte extrait
- ✅ Messages d'erreur si extraction échoue

#### **Génération depuis document**
- ✅ Générer des cartes depuis le texte extrait
- ✅ Création automatique des cartes dans le deck sélectionné
- ✅ Processus complet : Upload → Extraction → Génération → Création

---

## 📈 7. STATISTIQUES

### Fonctionnalités à tester :

#### **Statistiques globales**
- ✅ Nombre total de decks
- ✅ Nombre total de cartes
- ✅ Nombre de cartes à réviser
- ✅ Taux de réussite global
- ✅ Graphiques de progression (Recharts)
- ✅ Indicateur de chargement

#### **Statistiques de révisions**
- ✅ Nombre de révisions aujourd'hui
- ✅ Nombre de révisions cette semaine
- ✅ Nombre de révisions ce mois
- ✅ Graphique d'évolution des révisions
- ✅ Taux de réussite par période

#### **Statistiques par deck**
- ✅ Statistiques spécifiques à chaque deck
- ✅ Nombre de cartes par deck
- ✅ Taux de réussite par deck
- ✅ Cartes à réviser par deck

---

## 👤 8. PROFIL UTILISATEUR

### Fonctionnalités à tester :

#### **Affichage du profil**
- ✅ Afficher l'email de l'utilisateur
- ✅ Afficher les informations du profil (nom, bio, etc.)
- ✅ Afficher les statistiques personnelles

#### **Modification du profil**
- ✅ Modifier le nom d'affichage
- ✅ Modifier la bio/description
- ✅ Sauvegarde des modifications
- ✅ Mise à jour immédiate dans l'interface

#### **Test de mémoire**
- ✅ Passer le test de mémoire
- ✅ Sauvegarder les résultats du test
- ✅ Affichage des résultats dans le profil

---

## 💾 9. SAUVEGARDE ET EXPORT

### Fonctionnalités à tester :

#### **Export de tous les decks**
- ✅ Exporter tous les decks en JSON
- ✅ Téléchargement du fichier JSON
- ✅ Format JSON valide et lisible
- ✅ Contenu complet (decks + cartes)

#### **Export d'un deck spécifique**
- ✅ Exporter un seul deck en JSON
- ✅ Téléchargement du fichier
- ✅ Format JSON valide

#### **Import de sauvegarde**
- ✅ Importer un fichier JSON de sauvegarde
- ✅ Création des decks et cartes depuis le JSON
- ✅ Gestion des doublons (ne pas créer en double)
- ✅ Messages d'erreur si format JSON invalide
- ✅ Messages d'erreur si structure incorrecte

---

## 🎨 10. INTERFACE UTILISATEUR

### Fonctionnalités à tester :

#### **Mode clair/sombre**
- ✅ Basculer entre mode clair et sombre
- ✅ Persistance du choix (localStorage)
- ✅ Application correcte du thème sur toutes les pages
- ✅ Bouton de bascule visible

#### **Navigation**
- ✅ Menu de navigation fonctionnel
- ✅ Liens vers toutes les pages
- ✅ Indication de la page active
- ✅ Navigation responsive (mobile)

#### **Responsive design**
- ✅ Affichage correct sur mobile
- ✅ Affichage correct sur tablette
- ✅ Affichage correct sur desktop
- ✅ Menu hamburger sur mobile

#### **Animations**
- ✅ Animations fluides (Framer Motion)
- ✅ Transitions entre pages
- ✅ Animations des modals
- ✅ Micro-interactions sur les boutons

#### **Gestion des erreurs**
- ✅ Messages d'erreur clairs et compréhensibles
- ✅ Affichage des erreurs réseau
- ✅ Affichage des erreurs de validation
- ✅ Indicateurs de chargement

---

## 🔧 11. FONCTIONNALITÉS TECHNIQUES

### Fonctionnalités à tester :

#### **API Backend**
- ✅ Route `/api/health` fonctionne
- ✅ Toutes les routes API nécessitent authentification
- ✅ Rate limiting actif (limite les requêtes)
- ✅ Compression des réponses activée
- ✅ Gestion des erreurs CORS

#### **Base de données**
- ✅ Connexion à la base de données fonctionne
- ✅ Row Level Security (RLS) actif
- ✅ Isolation des données par utilisateur
- ✅ Pas d'accès aux données d'autres utilisateurs

#### **Sécurité**
- ✅ Tokens JWT valides
- ✅ Expiration des tokens
- ✅ Validation des entrées utilisateur
- ✅ Protection contre les injections SQL

---

## 📱 12. PAGES SPÉCIFIQUES

### Page d'accueil (`/`)
- ✅ Affichage du message de bienvenue
- ✅ Statistiques rapides (decks, cartes, à réviser)
- ✅ Boutons d'action (Voir mes decks, Réviser)
- ✅ Présentation des fonctionnalités
- ✅ Redirection si non connecté

### Page Decks (`/decks`)
- ✅ Liste de tous les decks
- ✅ Bouton pour créer un nouveau deck
- ✅ Clic sur un deck pour voir les détails
- ✅ Actions sur chaque deck (modifier, supprimer)

### Page Détails Deck (`/decks/:deckId`)
- ✅ Informations du deck
- ✅ Liste des cartes du deck
- ✅ Bouton pour créer une nouvelle carte
- ✅ Boutons pour générer des cartes (IA, document)
- ✅ Actions sur chaque carte (modifier, supprimer)

### Page Révision (`/review`)
- ✅ Liste des cartes à réviser
- ✅ Interface de révision
- ✅ Navigation entre les cartes
- ✅ Statistiques de session

### Page Statistiques (`/stats`)
- ✅ Graphiques de progression
- ✅ Statistiques détaillées
- ✅ Filtres par période
- ✅ Statistiques par deck

### Page Profil (`/profile`)
- ✅ Informations du profil
- ✅ Formulaire de modification
- ✅ Test de mémoire
- ✅ Statistiques personnelles

---

## 🧪 13. CAS LIMITES ET ERREURS

### À tester :

#### **Cas limites**
- ✅ Créer un deck sans nom (doit échouer)
- ✅ Créer une carte sans question/réponse (doit échouer)
- ✅ Supprimer un deck avec des cartes (doit supprimer les cartes aussi)
- ✅ Réviser une carte qui n'existe plus (doit gérer l'erreur)
- ✅ Générer des cartes sans clé API (doit afficher un message)

#### **Gestion des erreurs réseau**
- ✅ Perte de connexion pendant une requête
- ✅ Timeout de requête
- ✅ Erreur 500 du serveur
- ✅ Erreur 404 (ressource non trouvée)
- ✅ Erreur 401 (non autorisé)

#### **Performance**
- ✅ Chargement rapide de la page d'accueil
- ✅ Chargement rapide de la liste des decks
- ✅ Pas de lag lors de la création/modification
- ✅ Pagination si beaucoup de données

---

## ✅ CHECKLIST DE TEST COMPLÈTE

### Authentification
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne
- [ ] Déconnexion fonctionne
- [ ] Protection des routes fonctionne

### Decks
- [ ] Création de deck fonctionne
- [ ] Liste des decks fonctionne
- [ ] Modification de deck fonctionne
- [ ] Suppression de deck fonctionne

### Cartes
- [ ] Création de carte fonctionne
- [ ] Liste des cartes fonctionne
- [ ] Modification de carte fonctionne
- [ ] Suppression de carte fonctionne

### Révision
- [ ] Récupération des cartes à réviser fonctionne
- [ ] Interface de révision fonctionne
- [ ] Soumission de révision fonctionne
- [ ] Algorithme SM2 fonctionne correctement

### IA
- [ ] Génération depuis texte fonctionne
- [ ] Génération depuis sujet fonctionne
- [ ] Gestion des erreurs IA fonctionne

### Documents
- [ ] Upload de fichier fonctionne
- [ ] Extraction de texte fonctionne
- [ ] Génération depuis document fonctionne

### Statistiques
- [ ] Statistiques globales fonctionnent
- [ ] Statistiques de révisions fonctionnent
- [ ] Statistiques par deck fonctionnent

### Profil
- [ ] Affichage du profil fonctionne
- [ ] Modification du profil fonctionne
- [ ] Test de mémoire fonctionne

### Sauvegarde
- [ ] Export de tous les decks fonctionne
- [ ] Export d'un deck fonctionne
- [ ] Import de sauvegarde fonctionne

### Interface
- [ ] Mode clair/sombre fonctionne
- [ ] Navigation fonctionne
- [ ] Responsive design fonctionne
- [ ] Animations fonctionnent

---

## 🚀 COMMENT TESTER

1. **Démarrer l'application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Tester dans l'ordre**
   - Commencer par l'authentification
   - Puis créer un deck
   - Puis créer des cartes
   - Puis tester la révision
   - Puis tester l'IA
   - Puis tester l'import de documents
   - Puis vérifier les statistiques
   - Puis tester le profil
   - Puis tester la sauvegarde

3. **Noter les problèmes**
   - Pour chaque fonctionnalité, noter si elle fonctionne ou non
   - Noter les erreurs rencontrées
   - Noter les comportements inattendus

---

## 📝 NOTES IMPORTANTES

- **Variables d'environnement** : Assurez-vous que toutes les variables d'environnement sont configurées (voir `.env.example`)
- **Base de données** : Assurez-vous que la base de données est accessible et que les migrations sont exécutées
- **Clé OpenAI** : La génération IA nécessite une clé API OpenAI (optionnel)
- **Supabase Auth** : L'authentification nécessite un projet Supabase configuré

---

**Bon test ! 🎯**

