import { extractTextFromDocument, cleanExtractedText } from '../services/documentService.js'
import { generateCardsFromText } from '../services/aiService.js'
import { cardService } from '../services/cardService.js'
import { supabase } from '../config/supabase.js'
import { ForbiddenError } from '../utils/errors.js'

/**
 * Contrôleur pour l'import de documents
 */

export const documentController = {
  /**
   * POST /api/documents/upload
   * Upload un document et extrait le texte
   * Body: FormData avec file et deckId
   */
  async uploadDocument(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' })
      }

      const { deckId, autoGenerate } = req.body

      if (!deckId) {
        return res.status(400).json({ error: 'Deck ID est requis' })
      }

      // Vérifier que le deck appartient à l'utilisateur
      const { data: deck } = await supabase
        .from('decks')
        .select('id, user_id')
        .eq('id', deckId)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      // Extraire le texte du document
      const extractedText = await extractTextFromDocument(
        req.file.path,
        req.file.mimetype
      )

      // Nettoyer le texte
      const cleanedText = cleanExtractedText(extractedText)

      if (!cleanedText || cleanedText.trim().length === 0) {
        return res.status(400).json({
          error: 'Impossible d\'extraire du texte du document',
        })
      }

      // Si autoGenerate est activé, générer et créer les cartes automatiquement
      if (autoGenerate === 'true' || autoGenerate === true) {
        try {
          const count = parseInt(req.body.count) || 10
          const generatedCards = await generateCardsFromText(cleanedText, count)

          // Créer toutes les cartes dans le deck
          const createdCards = []
          const errors = []

          for (const card of generatedCards) {
            try {
              const created = await cardService.createCard({
                deck_id: deckId,
                question: card.question,
                answer: card.answer,
              })
              createdCards.push(created)
            } catch (error) {
              errors.push({
                card,
                error: error.message,
              })
            }
          }

          return res.json({
            success: true,
            extractedText: cleanedText.substring(0, 500) + '...', // Aperçu
            cardsGenerated: true,
            created: createdCards,
            failed: errors,
            total: generatedCards.length,
            createdCount: createdCards.length,
          })
        } catch (aiError) {
          // Si la génération IA échoue, retourner juste le texte extrait
          return res.json({
            success: true,
            extractedText: cleanedText,
            cardsGenerated: false,
            error: aiError.message,
          })
        }
      }

      // Retourner juste le texte extrait
      res.json({
        success: true,
        extractedText: cleanedText,
        cardsGenerated: false,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/documents/extract-and-generate
   * Upload un document, extrait le texte et génère des cartes (sans les créer)
   */
  async extractAndGenerate(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' })
      }

      const { deckId, count = 10 } = req.body

      if (!deckId) {
        return res.status(400).json({ error: 'Deck ID est requis' })
      }

      // Vérifier que le deck appartient à l'utilisateur
      const { data: deck } = await supabase
        .from('decks')
        .select('id, user_id')
        .eq('id', deckId)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      // Extraire le texte
      const extractedText = await extractTextFromDocument(
        req.file.path,
        req.file.mimetype
      )
      const cleanedText = cleanExtractedText(extractedText)

      if (!cleanedText || cleanedText.trim().length === 0) {
        return res.status(400).json({
          error: 'Impossible d\'extraire du texte du document',
        })
      }

      // Générer les cartes avec l'IA
      const generatedCards = await generateCardsFromText(
        cleanedText,
        parseInt(count, 10)
      )

      res.json({
        success: true,
        extractedText: cleanedText.substring(0, 500) + '...', // Aperçu
        cards: generatedCards,
        count: generatedCards.length,
      })
    } catch (error) {
      next(error)
    }
  },
}



