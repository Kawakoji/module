# ÉTAPE 7 — IA DE GÉNÉRATION DE CARTES

## 🎯 Objectif

Intégrer OpenAI API pour générer automatiquement des cartes flashcard à partir de texte ou d'un sujet.

---

## ✅ Ce qui a été implémenté

### 1. Service OpenAI

#### `backend/src/services/aiService.js`

**Fonctions principales :**

1. **`generateCardsFromText(text, count)`**
   - Génère des cartes à partir d'un texte source
   - Utilise GPT-3.5-turbo
   - Prompt optimisé pour créer des flashcards éducatives
   - Parse et valide la réponse JSON

2. **`generateCardsFromTopic(topic, count)`**
   - Génère des cartes à partir d'un sujet
   - Crée des questions/réponses pertinentes sur le sujet

**Caractéristiques :**
- Gestion des erreurs OpenAI
- Parsing robuste du JSON (gère les markdown code blocks)
- Extraction intelligente des cartes (supporte différents formats de réponse)
- Validation des cartes générées
- Limite le nombre de cartes (1-20)

### 2. Routes API

#### `POST /api/ai/generate-from-text`
Génère des cartes à partir d'un texte.

**Body :**
```json
{
  "text": "Le texte source...",
  "deckId": "uuid",
  "count": 5
}
```

**Réponse :**
```json
{
  "cards": [
    {
      "question": "Question 1",
      "answer": "Réponse 1"
    }
  ],
  "count": 5
}
```

#### `POST /api/ai/generate-from-topic`
Génère des cartes à partir d'un sujet.

**Body :**
```json
{
  "topic": "Histoire de la Révolution française",
  "deckId": "uuid",
  "count": 5
}
```

#### `POST /api/ai/generate-and-create`
Génère et crée automatiquement les cartes dans le deck.

**Body :**
```json
{
  "text": "Le texte source...",
  "deckId": "uuid",
  "count": 5
}
```

**Réponse :**
```json
{
  "created": [...],
  "failed": [...],
  "total": 5,
  "createdCount": 5
}
```

### 3. Interface frontend

#### Composant `AIGenerateModal.jsx`
- Modal avec deux modes : texte ou sujet
- Formulaire pour saisir le texte/sujet
- Sélection du nombre de cartes (1-20)
- Affichage des cartes générées avec prévisualisation
- Bouton pour créer toutes les cartes d'un coup
- Gestion de l'état de chargement
- Gestion des erreurs

#### Intégration dans `DeckDetail.jsx`
- Bouton "🤖 Générer avec IA" dans le header
- Bouton également disponible quand il n'y a pas de cartes
- Modal s'ouvre pour la génération
- Les cartes peuvent être créées individuellement ou toutes en une fois

### 4. Sécurité

- Vérification que le deck appartient à l'utilisateur
- Authentification requise pour toutes les routes IA
- Validation des paramètres (texte non vide, count entre 1-20)
- Gestion des erreurs OpenAI

---

## 🔧 Configuration

### Variables d'environnement

**Backend (.env) :**
```env
OPENAI_API_KEY=sk-...
```

### Installation

```bash
cd backend
npm install openai
```

---

## 📝 Exemples d'utilisation

### Générer depuis un texte

1. Aller sur un deck
2. Cliquer sur "🤖 Générer avec IA"
3. Sélectionner "Depuis un texte"
4. Coller le texte source
5. Choisir le nombre de cartes (défaut: 5)
6. Cliquer sur "Générer"
7. Prévisualiser les cartes générées
8. Cliquer sur "Créer toutes les cartes"

### Générer depuis un sujet

1. Ouvrir le modal IA
2. Sélectionner "Depuis un sujet"
3. Entrer le sujet (ex: "Photosynthesis")
4. Choisir le nombre de cartes
5. Générer et créer

---

## 🎨 Prompt d'IA

Le prompt utilisé est optimisé pour générer des flashcards de qualité :

- Questions claires et précises
- Réponses concises mais complètes (max 200 mots)
- Variété des types de questions (concept, définition, application)
- Format JSON strict

---

## ✅ Checklist de l'étape 7

- [x] Service OpenAI créé
- [x] Génération depuis texte
- [x] Génération depuis sujet
- [x] Parsing robuste du JSON
- [x] Routes API créées
- [x] Contrôleurs avec vérifications de permissions
- [x] Modal de génération IA
- [x] Intégration dans DeckDetail
- [x] Gestion des erreurs
- [x] États de chargement

---

## 🐛 Limitations connues

1. **Coût OpenAI** : Chaque génération consomme des tokens. GPT-3.5-turbo est utilisé pour réduire les coûts.

2. **Qualité variable** : La qualité des cartes dépend du texte source et du prompt. Certains textes génèrent de meilleures cartes que d'autres.

3. **Limite de tokens** : Les textes très longs peuvent être tronqués. Limiter à ~2000 mots pour de meilleurs résultats.

4. **Format JSON** : L'IA peut parfois retourner du JSON dans différents formats. Le parsing est robuste mais peut échouer dans certains cas.

---

## 💡 Améliorations futures possibles

- [ ] Support de plusieurs modèles (GPT-4, Claude, etc.)
- [ ] Personnalisation du prompt selon le domaine
- [ ] Génération de cartes avec images
- [ ] Amélioration itérative (demander des modifications)
- [ ] Historique des générations
- [ ] Templates de prompts
- [ ] Génération par lots (plusieurs decks à la fois)

---

## 📚 Références

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-3.5 Turbo](https://platform.openai.com/docs/models/gpt-3-5)

---

**✅ ÉTAPE 7 TERMINÉE** — La génération de cartes avec IA est maintenant fonctionnelle !




