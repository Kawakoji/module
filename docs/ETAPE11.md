# ÉTAPE 11 — STATISTIQUES ET PROFIL UTILISATEUR

## 🎯 Objectif

Implémenter des statistiques détaillées de progression et un profil utilisateur personnalisable.

---

## ✅ Ce qui a été implémenté

### 1. Statistiques utilisateur

#### Service de statistiques (`backend/src/services/statsService.js`)

**Fonctions principales :**

1. **`getUserStats(userId)`**
   - Statistiques globales :
     - Total de decks
     - Total de cartes
     - Cartes à réviser
     - Cartes maîtrisées (repetitions >= 5)
     - Cartes en apprentissage (repetitions < 5)

2. **`getReviewStatsByDay(userId, days)`**
   - Statistiques de révision par jour
   - Nombre de cartes révisées par jour
   - Nombre de cartes maîtrisées par jour
   - Par défaut : 7 derniers jours

3. **`getStatsByDeck(userId)`**
   - Statistiques détaillées par deck :
     - Nombre total de cartes
     - Cartes à réviser
     - Cartes maîtrisées
     - Cartes en apprentissage
     - Taux de maîtrise (%)

### 2. Routes API

#### `GET /api/stats`
Récupère les statistiques globales.

**Réponse :**
```json
{
  "totalDecks": 5,
  "totalCards": 150,
  "cardsToReview": 25,
  "masteredCards": 80,
  "learningCards": 70
}
```

#### `GET /api/stats/reviews?days=7`
Récupère les statistiques de révision par jour.

**Réponse :**
```json
[
  {
    "date": "2024-01-15",
    "reviewed": 10,
    "mastered": 3
  }
]
```

#### `GET /api/stats/decks`
Récupère les statistiques par deck.

**Réponse :**
```json
[
  {
    "deckId": "uuid",
    "deckName": "Histoire",
    "totalCards": 30,
    "cardsToReview": 5,
    "masteredCards": 15,
    "learningCards": 15,
    "masteryRate": 50
  }
]
```

### 3. Profil utilisateur

#### Service de profil (`backend/src/services/profileService.js`)

**Fonctions principales :**

1. **`getProfile(userId)`**
   - Récupère le profil utilisateur
   - Crée un profil par défaut s'il n'existe pas

2. **`updateProfile(userId, updates)`**
   - Met à jour le profil
   - Champs : `username`, `avatar_url`

#### Routes API

#### `GET /api/profile`
Récupère le profil utilisateur.

**Réponse :**
```json
{
  "id": "uuid",
  "username": "john_doe",
  "avatar_url": "https://...",
  "created_at": "...",
  "updated_at": "..."
}
```

#### `PUT /api/profile`
Met à jour le profil.

**Body :**
```json
{
  "username": "new_username",
  "avatar_url": "https://..."
}
```

### 4. Interface frontend

#### Page Statistiques (`pages/Stats.jsx`)
- **Graphiques avec Recharts** :
  - Graphique linéaire : Révisions sur 7 jours
  - Graphique en camembert : Distribution des cartes
  - Graphique en barres : Top 5 des decks

- **Cartes de statistiques** :
  - Total Decks
  - Total Cartes
  - À réviser
  - Maîtrisées

- **Tableau détaillé** :
  - Statistiques par deck
  - Taux de maîtrise avec barres de progression

#### Page Profil (`pages/Profile.jsx`)
- Formulaire de modification du profil
- Champs : username, avatar_url
- Affichage des informations du compte
- Email (non modifiable)

### 5. Navigation

- Ajout de "Statistiques" et "Profil" dans le menu de navigation
- Routes protégées avec authentification

---

## 📊 Graphiques implémentés

### 1. Graphique linéaire (Révisions)
- Axe X : Dates (7 derniers jours)
- Lignes :
  - Révisées (bleu)
  - Maîtrisées (vert)
- Tooltip avec formatage des dates

### 2. Graphique en camembert (Distribution)
- Segments :
  - Maîtrisées (vert)
  - En apprentissage (bleu)
- Pourcentages affichés

### 3. Graphique en barres (Top 5 decks)
- Axe X : Noms des decks
- Barres :
  - Total cartes (bleu)
  - Maîtrisées (vert)

---

## ✅ Checklist de l'étape 11

- [x] Service de statistiques créé
- [x] Statistiques globales
- [x] Statistiques par jour
- [x] Statistiques par deck
- [x] Routes API pour les statistiques
- [x] Service de profil créé
- [x] Routes API pour le profil
- [x] Page Statistiques avec graphiques
- [x] Page Profil avec formulaire
- [x] Intégration dans la navigation
- [x] Recharts installé et configuré

---

## 🎨 Fonctionnalités

### Statistiques
- Vue d'ensemble des performances
- Suivi de progression sur 7 jours
- Comparaison entre decks
- Identification des cartes à réviser

### Profil
- Personnalisation du nom d'utilisateur
- URL d'avatar personnalisée
- Affichage des informations du compte

---

## 💡 Améliorations futures possibles

- [ ] Statistiques sur 30 jours / 1 an
- [ ] Graphiques de progression à long terme
- [ ] Objectifs personnalisés (cartes/jour)
- [ ] Badges et achievements
- [ ] Classement et comparaison
- [ ] Export des statistiques
- [ ] Upload d'avatar (au lieu de URL)
- [ ] Préférences utilisateur (notifications, thème par défaut)
- [ ] Historique complet des révisions
- [ ] Heatmap de révision (comme GitHub)

---

## 📚 Références

- [Recharts Documentation](https://recharts.org/)
- [Supabase Profiles](https://supabase.com/docs/guides/auth/managing-user-data)

---

**✅ ÉTAPE 11 TERMINÉE** — Les statistiques et le profil utilisateur sont maintenant fonctionnels !








