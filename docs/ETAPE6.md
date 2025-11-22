# ÉTAPE 6 — SYSTÈME DE RÉVISION ESPACÉE (SM2)

## 🎯 Objectif

Implémenter l'algorithme SM2 (SuperMemo 2) pour optimiser la mémorisation avec des intervalles de révision adaptatifs.

---

## ✅ Ce qui a été implémenté

### 1. Algorithme SM2

#### Service SM2 (`backend/src/services/sm2Service.js`)

**Fonction `calculateSM2(card, quality)`**

Calcule les nouvelles valeurs après une révision :

- **Qualité de la réponse** :
  - `1` = Difficile (Q=2 en SM2)
  - `2` = Moyen (Q=3 en SM2)
  - `3` = Facile (Q=5 en SM2)

- **Logique SM2** :
  - Si Q < 3 (réponse difficile/mauvaise) :
    - Intervalle réinitialisé à 1 jour
    - Répétitions réinitialisées à 0
    - Facteur de facilité réduit de 0.2 (minimum 1.3)
  
  - Si Q >= 3 (réponse moyenne/facile) :
    - Facteur de facilité ajusté : `EF = EF + (0.1 - (5 - Q) * (0.08 + (5 - Q) * 0.02))`
    - Intervalle calculé :
      - Si repetitions = 0 : interval = 1 jour
      - Si repetitions = 1 : interval = 6 jours
      - Sinon : interval = interval × EF (arrondi)
    - Répétitions incrémentées

- **Valeurs retournées** :
  - `ease_factor` : Facteur de facilité (entre 1.3 et 2.5)
  - `interval` : Nombre de jours avant la prochaine révision
  - `repetitions` : Nombre de révisions réussies
  - `next_review` : Date de la prochaine révision

### 2. Service de révision

#### `reviewService.js`
- `reviewCard(cardId, quality, userId)` : Enregistrer une révision
- `reviewMultipleCards(reviews, userId)` : Révisions multiples en une fois
- Vérification des permissions (carte appartient à l'utilisateur)

### 3. Routes API

#### `POST /api/reviews`
Enregistrer une révision de carte.

**Body :**
```json
{
  "cardId": "uuid",
  "quality": 1  // 1=difficile, 2=moyen, 3=facile
}
```

**Réponse :**
```json
{
  "id": "uuid",
  "question": "...",
  "answer": "...",
  "ease_factor": 2.3,
  "interval": 12,
  "repetitions": 5,
  "next_review": "2024-01-15T00:00:00Z"
}
```

#### `POST /api/reviews/batch`
Enregistrer plusieurs révisions en une fois.

**Body :**
```json
{
  "reviews": [
    { "cardId": "uuid1", "quality": 3 },
    { "cardId": "uuid2", "quality": 2 }
  ]
}
```

### 4. Interface de révision améliorée

#### Page Review mise à jour
- Enregistrement réel des révisions avec SM2
- Statistiques de session (difficile/moyen/facile)
- Affichage des statistiques en fin de session
- Gestion de l'état de chargement pendant la révision
- Désactivation des boutons pendant l'enregistrement

---

## 📊 Fonctionnement de SM2

### Exemple de progression

**Première révision (Facile) :**
- EF = 2.5 → 2.6
- Interval = 1 → 6 jours
- Repetitions = 0 → 1

**Deuxième révision (Facile) :**
- EF = 2.6 → 2.7
- Interval = 6 → 16 jours (6 × 2.7)
- Repetitions = 1 → 2

**Troisième révision (Facile) :**
- EF = 2.7 → 2.8
- Interval = 16 → 45 jours (16 × 2.8)
- Repetitions = 2 → 3

**Révision difficile :**
- EF = 2.8 → 2.6 (réduit de 0.2)
- Interval = 45 → 1 jour (réinitialisé)
- Repetitions = 3 → 0 (réinitialisé)

---

## 🔄 Flux de révision

1. **Utilisateur voit la question**
2. **Clique pour voir la réponse**
3. **Évalue la difficulté** (Difficile/Moyen/Facile)
4. **Frontend** : Appel à `POST /api/reviews`
5. **Backend** : 
   - Récupère la carte
   - Vérifie les permissions
   - Calcule les nouvelles valeurs avec SM2
   - Met à jour la carte dans la base de données
6. **Frontend** : Passe à la carte suivante

---

## 📝 Exemples de calculs SM2

### Cas 1 : Réponse facile (Q=5)
```
Initial: EF=2.5, I=10, R=3
Nouveau EF = 2.5 + (0.1 - (5-5) * (0.08 + (5-5) * 0.02))
          = 2.5 + 0.1 = 2.6
Nouvel I = 10 × 2.6 = 26 jours
R = 3 + 1 = 4
```

### Cas 2 : Réponse moyenne (Q=3)
```
Initial: EF=2.5, I=10, R=3
Nouveau EF = 2.5 + (0.1 - (5-3) * (0.08 + (5-3) * 0.02))
          = 2.5 + (0.1 - 2 * 0.12) = 2.5 - 0.14 = 2.36
Nouvel I = 10 × 2.36 = 24 jours
R = 3 + 1 = 4
```

### Cas 3 : Réponse difficile (Q=2)
```
Initial: EF=2.5, I=10, R=3
Nouveau EF = max(1.3, 2.5 - 0.2) = 2.3
Nouvel I = 1 jour (réinitialisé)
R = 0 (réinitialisé)
```

---

## ✅ Checklist de l'étape 6

- [x] Algorithme SM2 implémenté
- [x] Service de révision créé
- [x] Routes API pour les révisions
- [x] Contrôleur de révision
- [x] Interface de révision mise à jour
- [x] Enregistrement réel des révisions
- [x] Statistiques de session
- [x] Gestion des erreurs

---

## 🚀 Utilisation

### Réviser une carte

1. Aller sur la page "Révision"
2. Voir la question et cliquer pour voir la réponse
3. Évaluer la difficulté :
   - **Difficile** : Réinitialise l'intervalle, la carte sera revue demain
   - **Moyen** : Augmente légèrement l'intervalle
   - **Facile** : Augmente significativement l'intervalle
4. La carte est automatiquement mise à jour avec les nouvelles valeurs

### Voir les cartes à réviser

Les cartes dont `next_review` est dans le passé apparaissent automatiquement dans la liste de révision.

---

## 💡 Notes importantes

1. **Algorithme SM2** : C'est l'algorithme classique utilisé par Anki et SuperMemo. Il optimise les intervalles de révision pour maximiser la rétention.

2. **Facteur de facilité** : Entre 1.3 et 2.5. Plus il est élevé, plus l'intervalle augmente rapidement.

3. **Réinitialisation** : Si une carte est marquée comme "difficile", elle est réinitialisée pour être revue plus tôt.

4. **Performance** : Les calculs SM2 sont rapides et se font côté serveur pour garantir la cohérence.

5. **Flexibilité** : L'algorithme s'adapte automatiquement à chaque utilisateur selon ses performances.

---

## 🔧 Améliorations futures possibles

- [ ] Variantes de SM2 (SM-3, SM-4, FSRS)
- [ ] Ajustement automatique du facteur de facilité initial
- [ ] Historique des révisions
- [ ] Graphiques de progression
- [ ] Prévision de la charge de révision
- [ ] Mode cram (réviser toutes les cartes d'un deck)

---

## 📚 Références

- [SuperMemo Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Anki Algorithm](https://apps.ankiweb.net/docs/manual.html#what-spaced-repetition-algorithm-does-anki-use)

---

**✅ ÉTAPE 6 TERMINÉE** — Le système de révision espacée avec SM2 est maintenant fonctionnel !








