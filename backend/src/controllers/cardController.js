import { cardService } from '../services/cardService.js'
import { ForbiddenError } from '../utils/errors.js'

/**
 * Contrôleur pour les cartes
 */

export const cardController = {
  /**
   * GET /api/cards/deck/:deckId
   * Récupérer toutes les cartes d'un deck avec pagination
   * Query params: page, limit
   */
  async getCardsByDeck(req, res, next) {
    try {
      const { deckId } = req.params
      const { page, limit } = req.query

      // Vérifier que le deck appartient à l'utilisateur
      const { supabase } = await import('../config/supabase.js')
      const { data: deck } = await supabase
        .from('decks')
        .select('id, user_id')
        .eq('id', deckId)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      const result = await cardService.getCardsByDeck(deckId, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      })
      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/cards/review
   * Récupérer les cartes à réviser
   */
  async getCardsToReview(req, res, next) {
    try {
      const cards = await cardService.getCardsToReview(req.user.id)
      res.json(cards)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/cards/:id
   * Récupérer une carte par son ID
   */
  async getCardById(req, res, next) {
    try {
      const { id } = req.params
      const card = await cardService.getCardById(id)

      // Vérifier que la carte appartient à l'utilisateur via le deck
      const { supabase } = await import('../config/supabase.js')
      const { data: deck } = await supabase
        .from('decks')
        .select('user_id')
        .eq('id', card.deck_id)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      res.json(card)
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/cards
   * Créer une nouvelle carte
   */
  async createCard(req, res, next) {
    try {
      const { deck_id, question, answer } = req.body

      // Vérifier que le deck appartient à l'utilisateur
      const { supabase } = await import('../config/supabase.js')
      const { data: deck } = await supabase
        .from('decks')
        .select('id, user_id')
        .eq('id', deck_id)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      const card = await cardService.createCard({
        deck_id,
        question,
        answer,
      })

      res.status(201).json(card)
    } catch (error) {
      next(error)
    }
  },

  /**
   * PUT /api/cards/:id
   * Mettre à jour une carte
   */
  async updateCard(req, res, next) {
    try {
      const { id } = req.params
      const { question, answer, ease_factor, interval, repetitions, next_review } = req.body

      // Vérifier que la carte appartient à l'utilisateur
      const card = await cardService.getCardById(id)
      const { supabase } = await import('../config/supabase.js')
      const { data: deck } = await supabase
        .from('decks')
        .select('user_id')
        .eq('id', card.deck_id)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      const updatedCard = await cardService.updateCard(id, {
        question,
        answer,
        ease_factor,
        interval,
        repetitions,
        next_review,
      })

      res.json(updatedCard)
    } catch (error) {
      next(error)
    }
  },

  /**
   * DELETE /api/cards/:id
   * Supprimer une carte
   */
  async deleteCard(req, res, next) {
    try {
      const { id } = req.params

      // Vérifier que la carte appartient à l'utilisateur
      const card = await cardService.getCardById(id)
      const { supabase } = await import('../config/supabase.js')
      const { data: deck } = await supabase
        .from('decks')
        .select('user_id')
        .eq('id', card.deck_id)
        .single()

      if (!deck || deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      await cardService.deleteCard(id)
      res.status(204).send()
    } catch (error) {
      next(error)
    }
  },
}

