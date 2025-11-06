import { generateCardsFromText, generateCardsFromTopic } from '../services/aiService.js'
import { cardService } from '../services/cardService.js'
import { supabase } from '../config/supabase.js'
import { ForbiddenError } from '../utils/errors.js'

/**
 * Contrôleur pour les fonctionnalités IA
 */

export const aiController = {
  /**
   * POST /api/ai/generate-from-text
   * Générer des cartes à partir d'un texte
   * Body: { text, deckId, count }
   */
  async generateFromText(req, res, next) {
    try {
      const { text, deckId, count = 5 } = req.body

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Le texte est requis' })
      }

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

      // Générer les cartes avec l'IA
      const generatedCards = await generateCardsFromText(text, count)

      // Optionnel : créer automatiquement les cartes dans le deck
      // Pour l'instant, on retourne juste les cartes générées
      // Le frontend pourra les créer une par une après validation

      res.json({
        cards: generatedCards,
        count: generatedCards.length,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/ai/generate-from-topic
   * Générer des cartes à partir d'un sujet
   * Body: { topic, deckId, count }
   */
  async generateFromTopic(req, res, next) {
    try {
      const { topic, deckId, count = 5 } = req.body

      if (!topic || !topic.trim()) {
        return res.status(400).json({ error: 'Le sujet est requis' })
      }

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

      // Générer les cartes avec l'IA
      const generatedCards = await generateCardsFromTopic(topic, count)

      res.json({
        cards: generatedCards,
        count: generatedCards.length,
      })
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/ai/generate-and-create
   * Générer des cartes et les créer automatiquement dans le deck
   * Body: { text, deckId, count }
   */
  async generateAndCreate(req, res, next) {
    try {
      const { text, deckId, count = 5 } = req.body

      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Le texte est requis' })
      }

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

      // Générer les cartes avec l'IA
      const generatedCards = await generateCardsFromText(text, count)

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

      res.json({
        created: createdCards,
        failed: errors,
        total: generatedCards.length,
        createdCount: createdCards.length,
      })
    } catch (error) {
      next(error)
    }
  },
}




