# ÉTAPE 8 — IMPORT DE DOCUMENTS

## 🎯 Objectif

Implémenter l'import de documents (PDF, texte) avec extraction automatique du contenu et génération de cartes via IA.

---

## ✅ Ce qui a été implémenté

### 1. Upload de fichiers

#### Middleware Multer (`backend/src/middleware/upload.js`)
- Configuration de multer pour l'upload de fichiers
- Stockage temporaire dans `backend/uploads/`
- Filtrage des types de fichiers (PDF, TXT, MD, DOC, DOCX)
- Limite de taille : 10MB max
- Nettoyage automatique des fichiers temporaires

**Types de fichiers supportés :**
- `.pdf` - Documents PDF
- `.txt` - Fichiers texte
- `.md` - Markdown
- `.doc`, `.docx` - Microsoft Word

### 2. Extraction de texte

#### Service de documents (`backend/src/services/documentService.js`)

**Fonctions principales :**

1. **`extractTextFromPDF(filePath)`**
   - Utilise `pdf-parse` pour extraire le texte des PDF
   - Retourne le texte brut extrait

2. **`extractTextFromTextFile(filePath)`**
   - Lit les fichiers texte directement
   - Support UTF-8

3. **`extractTextFromDocument(filePath, mimeType)`**
   - Détecte automatiquement le type de fichier
   - Appelle la fonction d'extraction appropriée
   - Nettoie automatiquement le fichier temporaire après extraction

4. **`cleanExtractedText(text)`**
   - Nettoie le texte extrait
   - Supprime les espaces multiples
   - Limite à 50 000 caractères (pour optimiser les coûts OpenAI)
   - Supprime les caractères spéciaux problématiques

### 3. Routes API

#### `POST /api/documents/upload`
Upload un document, extrait le texte et optionnellement génère des cartes.

**Body (FormData) :**
- `file` : Fichier à uploader
- `deckId` : ID du deck
- `autoGenerate` : `true`/`false` (générer automatiquement les cartes)
- `count` : Nombre de cartes (si autoGenerate)

**Réponse (autoGenerate = true) :**
```json
{
  "success": true,
  "extractedText": "Aperçu du texte...",
  "cardsGenerated": true,
  "created": [...],
  "failed": [...],
  "total": 10,
  "createdCount": 10
}
```

**Réponse (autoGenerate = false) :**
```json
{
  "success": true,
  "extractedText": "Texte complet extrait...",
  "cardsGenerated": false
}
```

#### `POST /api/documents/extract-and-generate`
Upload un document, extrait le texte et génère des cartes (sans les créer).

**Body (FormData) :**
- `file` : Fichier à uploader
- `deckId` : ID du deck
- `count` : Nombre de cartes à générer

**Réponse :**
```json
{
  "success": true,
  "extractedText": "Aperçu du texte...",
  "cards": [...],
  "count": 10
}
```

### 4. Interface frontend

#### Composant `DocumentUploadModal.jsx`
- Zone de drag & drop
- Sélection de fichier par clic
- Validation du type et de la taille
- Options :
  - Génération automatique des cartes
  - Nombre de cartes à générer
- Affichage des résultats :
  - Succès avec nombre de cartes créées
  - Prévisualisation des cartes générées
  - Aperçu du texte extrait
- Gestion des erreurs
- États de chargement

#### Intégration dans `DeckDetail.jsx`
- Bouton "📄 Importer document" dans le header
- Disponible également quand il n'y a pas de cartes
- Modal s'ouvre pour l'upload
- Création automatique ou manuelle des cartes

### 5. Sécurité

- Vérification que le deck appartient à l'utilisateur
- Authentification requise
- Validation des types de fichiers
- Limite de taille (10MB)
- Nettoyage automatique des fichiers temporaires
- Pas de stockage permanent des fichiers uploadés

---

## 🔧 Configuration

### Installation

```bash
cd backend
npm install multer pdf-parse
```

### Structure des dossiers

Le dossier `backend/uploads/` est créé automatiquement pour stocker temporairement les fichiers.

⚠️ **Important** : Ce dossier doit être dans `.gitignore` (déjà fait).

---

## 📝 Flux d'utilisation

### Mode automatique (recommandé)

1. Ouvrir un deck
2. Cliquer sur "📄 Importer document"
3. Glisser-déposer ou sélectionner un fichier (PDF, TXT, etc.)
4. Cocher "Générer et créer automatiquement les cartes"
5. Choisir le nombre de cartes (défaut: 10)
6. Cliquer sur "Importer"
7. Le système :
   - Upload le fichier
   - Extrait le texte
   - Génère les cartes avec l'IA
   - Crée toutes les cartes dans le deck
8. Les cartes apparaissent automatiquement dans le deck

### Mode manuel

1. Uploader le document
2. Décocher "Générer automatiquement"
3. Cliquer sur "Importer"
4. Le texte est extrait et affiché
5. Utiliser le bouton "Générer avec IA" pour créer des cartes depuis le texte

---

## 🎨 Exemples d'utilisation

### Import d'un PDF de cours

1. Télécharger le PDF du cours
2. Ouvrir le deck correspondant
3. Importer le document
4. Générer 15 cartes automatiquement
5. Réviser les cartes générées

### Import de notes texte

1. Créer un fichier `.txt` avec vos notes
2. Importer dans le deck
3. L'IA génère des questions/réponses pertinentes

---

## ✅ Checklist de l'étape 8

- [x] Middleware Multer configuré
- [x] Service d'extraction PDF
- [x] Service d'extraction texte
- [x] Nettoyage du texte extrait
- [x] Routes API pour upload
- [x] Intégration avec service IA
- [x] Modal d'upload frontend
- [x] Drag & drop
- [x] Validation des fichiers
- [x] Gestion des erreurs
- [x] Nettoyage automatique des fichiers temporaires

---

## 🐛 Limitations connues

1. **Fichiers Word (.doc/.docx)** : Actuellement, seuls les fichiers texte et PDF sont extraits. Les fichiers Word nécessiteraient une bibliothèque supplémentaire (comme `mammoth`).

2. **Taille des fichiers** : Limite à 10MB. Pour les très gros fichiers, le texte est tronqué à 50 000 caractères.

3. **Qualité PDF** : La qualité de l'extraction dépend de la qualité du PDF. Les PDF scannés (images) nécessiteraient de l'OCR.

4. **Coûts OpenAI** : Chaque import avec génération automatique consomme des tokens OpenAI.

---

## 💡 Améliorations futures possibles

- [ ] Support OCR pour PDF scannés (Tesseract.js)
- [ ] Extraction de fichiers Word (.doc/.docx)
- [ ] Extraction de fichiers PowerPoint
- [ ] Extraction depuis URLs (scraping)
- [ ] Extraction depuis Google Drive / Dropbox
- [ ] Prévisualisation du document avant import
- [ ] Historique des imports
- [ ] Extraction de sections spécifiques
- [ ] Support de plusieurs fichiers en une fois
- [ ] Compression automatique des images dans les PDF

---

## 📚 Références

- [Multer Documentation](https://github.com/expressjs/multer)
- [pdf-parse Documentation](https://www.npmjs.com/package/pdf-parse)

---

**✅ ÉTAPE 8 TERMINÉE** — L'import de documents avec génération automatique de cartes est maintenant fonctionnel !




