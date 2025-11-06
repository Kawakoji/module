# ÉTAPE 5 — GESTION DES DECKS ET CARTES (AMÉLIORATIONS)

## 🎯 Objectif

Améliorer le CRUD existant avec validation renforcée, meilleure gestion des erreurs, pagination et recherche.

---

## ✅ Ce qui a été implémenté

### 1. Validation des données

#### Utilitaires de validation (`backend/src/utils/validation.js`)
- `validateDeckName` : Nom entre 2 et 100 caractères
- `validateDeckDescription` : Description max 500 caractères
- `validateCardQuestion` : Question entre 3 et 1000 caractères
- `validateCardAnswer` : Réponse entre 1 et 2000 caractères
- `validateUUID` : Validation du format UUID
- `validatePagination` : Validation des paramètres de pagination

### 2. Gestion des erreurs améliorée

#### Classes d'erreurs personnalisées (`backend/src/utils/errors.js`)
- `ValidationError` : Erreurs de validation (400)
- `NotFoundError` : Ressource introuvable (404)
- `ForbiddenError` : Accès interdit (403)
- `UnauthorizedError` : Non authentifié (401)

#### Middleware d'erreurs amélioré (`backend/src/middleware/errorHandler.js`)
- Gestion des erreurs personnalisées
- Messages d'erreur adaptés selon l'environnement (dev/prod)
- Gestion des erreurs Supabase spécifiques
- Codes HTTP appropriés

### 3. Pagination

#### Decks
- `getAllDecks` retourne maintenant : `{ decks, total, page, limit, totalPages }`
- Paramètres de requête : `?page=1&limit=20&search=term`
- Limite par défaut : 20 decks par page
- Limite maximale : 100

#### Cartes
- `getCardsByDeck` retourne : `{ cards, total, page, limit, totalPages }`
- Paramètres de requête : `?page=1&limit=50`
- Limite par défaut : 50 cartes par page

### 4. Recherche

#### Recherche de decks
- Recherche par nom ou description
- Insensible à la casse (ilike)
- Paramètre : `?search=terme`
- Utilise l'opérateur OR de Supabase

### 5. Services améliorés

#### deckService
- Validation des données avant création/mise à jour
- Vérification de l'existence avant suppression
- Messages d'erreur clairs
- Support de la pagination et recherche

#### cardService
- Validation des questions et réponses
- Validation des paramètres de révision espacée
  - `ease_factor` : entre 1.3 et 2.5
  - `interval` : nombre positif
  - `repetitions` : nombre positif
- Pagination pour les grandes listes

### 6. Contrôleurs améliorés

#### Utilisation de `next(error)`
- Toutes les erreurs passent par le middleware d'erreurs
- Code plus propre et cohérent
- Gestion centralisée des erreurs

#### Vérifications de permissions
- Vérification que le deck appartient à l'utilisateur avant modification
- Vérification que le deck appartient à l'utilisateur avant création de carte
- Utilisation de `ForbiddenError` pour les accès non autorisés

### 7. Frontend mis à jour

#### Service API
- Support des paramètres de pagination et recherche
- `getDecks(options)` : `{ page, limit, search }`
- `getCardsByDeck(deckId, options)` : `{ page, limit }`

#### AppContext
- Support de la pagination dans `loadDecks` et `loadDeckCards`
- Gestion des réponses paginées (objet) ou non (tableau)

---

## 📝 Format des réponses API

### Liste paginée de decks
```json
{
  "decks": [...],
  "total": 42,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### Liste paginée de cartes
```json
{
  "cards": [...],
  "total": 150,
  "page": 1,
  "limit": 50,
  "totalPages": 3
}
```

---

## 🔍 Exemples d'utilisation

### Rechercher des decks
```bash
GET /api/decks?search=histoire&page=1&limit=10
```

### Récupérer les cartes d'un deck (page 2)
```bash
GET /api/cards/deck/{deckId}?page=2&limit=50
```

### Créer un deck avec validation
```bash
POST /api/decks
{
  "name": "Histoire",  # Doit être entre 2 et 100 caractères
  "description": "..."  # Optionnel, max 500 caractères
}
```

---

## ✅ Checklist de l'étape 5

- [x] Système de validation créé
- [x] Classes d'erreurs personnalisées
- [x] Middleware d'erreurs amélioré
- [x] Pagination pour decks
- [x] Pagination pour cartes
- [x] Recherche de decks
- [x] Validation des données dans les services
- [x] Contrôleurs utilisant `next(error)`
- [x] Vérifications de permissions améliorées
- [x] Service API frontend mis à jour
- [x] AppContext mis à jour pour la pagination

---

## 🚀 Améliorations futures possibles

### Court terme
- [ ] Recherche avancée (filtres multiples)
- [ ] Tri personnalisé (par nom, date, nombre de cartes)
- [ ] Export/Import de decks (JSON, CSV)
- [ ] Duplication de decks

### Moyen terme
- [ ] Tags/catégories pour les decks
- [ ] Recherche full-text avancée
- [ ] Cache des résultats de recherche
- [ ] Statistiques de recherche

---

## 💡 Notes importantes

1. **Validation** : Toutes les données sont validées avant insertion/mise à jour. Les erreurs de validation retournent un code 400 avec un message clair.

2. **Pagination** : La pagination est optionnelle. Si aucun paramètre n'est fourni, les valeurs par défaut sont utilisées.

3. **Recherche** : La recherche est insensible à la casse et cherche dans le nom ET la description des decks.

4. **Performance** : La pagination limite le nombre de résultats retournés, améliorant les performances pour les grandes listes.

5. **Compatibilité** : Le frontend gère à la fois les réponses paginées (objet) et non paginées (tableau) pour la compatibilité.

---

**✅ ÉTAPE 5 TERMINÉE** — Le CRUD est maintenant robuste avec validation, pagination et recherche !




