# ÉTAPE 10 — SAUVEGARDE ET SYNCHRONISATION CLOUD

## 🎯 Objectif

Implémenter l'export/import de decks et la sauvegarde de secours pour permettre aux utilisateurs de sauvegarder et restaurer leurs données.

---

## ✅ Ce qui a été implémenté

### 1. Synchronisation cloud automatique

**Note importante** : Les données sont déjà synchronisées en temps réel via Supabase PostgreSQL. Chaque utilisateur voit automatiquement ses données sur tous ses appareils dès qu'il se connecte.

### 2. Export de sauvegardes

#### Service de sauvegarde (`backend/src/services/backupService.js`)

**Fonctions principales :**

1. **`exportAllDecks(userId)`**
   - Exporte tous les decks de l'utilisateur avec leurs cartes
   - Format JSON structuré avec métadonnées
   - Inclut toutes les statistiques de révision (SM2)

2. **`exportDeck(deckId, userId)`**
   - Exporte un deck spécifique avec ses cartes
   - Format JSON pour un deck unique

**Format d'export :**
```json
{
  "version": "1.0",
  "exportDate": "2024-01-15T10:30:00Z",
  "decks": [
    {
      "id": "uuid",
      "name": "Histoire",
      "description": "...",
      "card_count": 10,
      "cards": [
        {
          "question": "...",
          "answer": "...",
          "ease_factor": 2.5,
          "interval": 5,
          "repetitions": 3,
          "next_review": "..."
        }
      ]
    }
  ],
  "totalDecks": 5,
  "totalCards": 150
}
```

### 3. Import de sauvegardes

#### Fonction `importDecks(importData, userId, options)`

**Options d'import :**
- `merge` : Si `true`, met à jour les decks existants au lieu de créer de nouveaux
- `skipDuplicates` : Si `true`, ignore les decks avec le même nom

**Résultat de l'import :**
```json
{
  "success": true,
  "created": [...],
  "updated": [...],
  "skipped": [...],
  "errors": [...],
  "total": 5
}
```

### 4. Routes API

#### `GET /api/backup/export/all`
Exporte tous les decks de l'utilisateur.

**Réponse :** Fichier JSON téléchargeable avec headers appropriés.

#### `GET /api/backup/export/:deckId`
Exporte un deck spécifique.

**Réponse :** Fichier JSON téléchargeable.

#### `POST /api/backup/import`
Importe des decks depuis un fichier JSON.

**Body :**
```json
{
  "data": { /* données d'export */ },
  "options": {
    "merge": false,
    "skipDuplicates": true
  }
}
```

### 5. Interface frontend

#### Composant `BackupModal.jsx`
- Modal avec deux onglets : Export et Import
- Export : Bouton pour télécharger la sauvegarde complète
- Import : Sélection de fichier + bouton d'import
- Affichage des résultats d'import (créés, mis à jour, ignorés, erreurs)
- Gestion des erreurs
- États de chargement

#### Intégration
- Bouton "💾 Sauvegarde" dans la page Decks
- Bouton "💾 Exporter" dans DeckDetail (export d'un deck spécifique)

### 6. Service API frontend

#### Fonctions dans `api.js`

- `exportAllDecks()` : Télécharge automatiquement le fichier JSON
- `exportDeck(deckId)` : Télécharge un deck spécifique
- `importDecks(file, options)` : Importe depuis un fichier JSON

---

## 📝 Format de sauvegarde

### Structure complète
```json
{
  "version": "1.0",
  "exportDate": "ISO date",
  "decks": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "string",
      "description": "string | null",
      "card_count": "number",
      "created_at": "ISO date",
      "updated_at": "ISO date",
      "cards": [
        {
          "id": "uuid",
          "deck_id": "uuid",
          "question": "string",
          "answer": "string",
          "ease_factor": "number",
          "interval": "number",
          "repetitions": "number",
          "next_review": "ISO date",
          "created_at": "ISO date",
          "updated_at": "ISO date"
        }
      ]
    }
  ],
  "totalDecks": "number",
  "totalCards": "number"
}
```

### Format deck unique
```json
{
  "version": "1.0",
  "exportDate": "ISO date",
  "deck": {
    /* même structure que ci-dessus */
  },
  "totalCards": "number"
}
```

---

## ✅ Checklist de l'étape 10

- [x] Service de sauvegarde créé
- [x] Export de tous les decks
- [x] Export d'un deck spécifique
- [x] Import de sauvegardes
- [x] Gestion des doublons
- [x] Options de fusion
- [x] Routes API créées
- [x] Modal de sauvegarde frontend
- [x] Intégration dans Decks et DeckDetail
- [x] Gestion des erreurs
- [x] Téléchargement automatique des fichiers

---

## 🔄 Synchronisation automatique

Grâce à Supabase PostgreSQL, les données sont automatiquement synchronisées :

- **Multi-appareils** : Les données sont accessibles sur tous les appareils où l'utilisateur est connecté
- **Temps réel** : Les modifications sont synchronisées instantanément
- **Sécurisé** : Row Level Security (RLS) garantit l'isolation des données
- **Persistant** : Les données sont stockées de manière permanente dans la base de données

---

## 💡 Cas d'usage

### Sauvegarde de secours
1. Exporter régulièrement tous les decks
2. Stocker le fichier JSON dans un endroit sûr (cloud, disque dur externe)
3. En cas de problème, importer la sauvegarde

### Partage de decks
1. Exporter un deck spécifique
2. Partager le fichier JSON avec un autre utilisateur
3. L'autre utilisateur peut importer le deck dans son compte

### Migration de compte
1. Exporter tous les decks de l'ancien compte
2. Importer dans le nouveau compte
3. Les données sont restaurées

---

## 🐛 Limitations connues

1. **Taille des fichiers** : Les exports très volumineux peuvent prendre du temps
2. **Format JSON** : Le format est spécifique à Moduleia (non compatible avec Anki directement)
3. **Doublons** : Les decks avec le même nom sont ignorés par défaut (sauf si merge activé)

---

## 💡 Améliorations futures possibles

- [ ] Export vers d'autres formats (Anki, CSV)
- [ ] Import depuis Anki
- [ ] Sauvegarde automatique périodique
- [ ] Historique des sauvegardes
- [ ] Sauvegarde dans Supabase Storage
- [ ] Compression des fichiers exportés
- [ ] Export sélectif (choisir quels decks exporter)
- [ ] Synchronisation en temps réel avec WebSockets

---

## 📚 Références

- [Supabase PostgreSQL](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

**✅ ÉTAPE 10 TERMINÉE** — L'export/import et la sauvegarde sont maintenant fonctionnels !








