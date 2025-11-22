import { deckService } from '../services/deckService.js'
import { ForbiddenError } from '../utils/errors.js'

/**
 * Contrôleur pour les decks
 */

export const deckController = {
  /**
   * GET /api/decks
   * Récupérer tous les decks de l'utilisateur authentifié
   * Query params: page, limit, search
   */
  async getAllDecks(req, res, next) {
    try {
      const { page, limit, search } = req.query
      const result = await deckService.getAllDecks(req.user.id, {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        search,
      })
      res.json(result)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/decks/:id
   * Récupérer un deck par son ID
   */
  async getDeckById(req, res, next) {
    try {
      const { id } = req.params
      const deck = await deckService.getDeckById(id)

      // Vérifier que le deck appartient à l'utilisateur
      if (deck.user_id !== req.user.id) {
        throw new ForbiddenError()
      }

      res.json(deck)
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/decks
   * Créer un nouveau deck
   */
  async createDeck(req, res, next) {
    try {
      const { name, description } = req.body

      const deck = await deckService.createDeck({
        name,
        description,
        user_id: req.user.id,
      })

      res.status(201).json(deck)
    } catch (error) {
      next(error)
    }
  },

  /**
   * PUT /api/decks/:id
   * Mettre à jour un deck
   */
  async updateDeck(req, res, next) {
    try {
      const { id } = req.params
      const { name, description } = req.body

      console.log('[DeckController] updateDeck called with:', {
        id,
        userId: req.user?.id,
        hasName: !!name,
        hasDescription: !!description
      })

      if (!req.user || !req.user.id) {
        console.error('[DeckController] No user in request')
        throw new ForbiddenError('User not authenticated')
      }

      // Vérifier que le deck appartient à l'utilisateur
      const deck = await deckService.getDeckById(id)
      
      console.log('[DeckController] Deck found:', {
        deckId: deck?.id,
        deckUserId: deck?.user_id,
        requestUserId: req.user.id,
        match: deck?.user_id === req.user.id
      })

      if (!deck) {
        throw new NotFoundError('Deck')
      }

      if (deck.user_id !== req.user.id) {
        console.error('[DeckController] User does not own deck:', {
          deckUserId: deck.user_id,
          requestUserId: req.user.id
        })
        throw new ForbiddenError()
      }

      const updatedDeck = await deckService.updateDeck(id, { name, description })
      res.json(updatedDeck)
    } catch (error) {
      console.error('[DeckController] Error in updateDeck:', error)
      next(error)
    }
  },

  /**
   * DELETE /api/decks/:id
   * Supprimer un deck
   */
  async deleteDeck(req, res, next) {
    try {
      const { id } = req.params

      console.log('[DeckController] deleteDeck called with:', {
        id,
        userId: req.user?.id
      })

      if (!req.user || !req.user.id) {
        console.error('[DeckController] No user in request')
        throw new ForbiddenError('User not authenticated')
      }

      // Vérifier que le deck appartient à l'utilisateur
      const deck = await deckService.getDeckById(id)
      
      console.log('[DeckController] Deck found:', {
        deckId: deck?.id,
        deckUserId: deck?.user_id,
        requestUserId: req.user.id,
        match: deck?.user_id === req.user.id
      })

      if (!deck) {
        throw new NotFoundError('Deck')
      }

      if (deck.user_id !== req.user.id) {
        console.error('[DeckController] User does not own deck:', {
          deckUserId: deck.user_id,
          requestUserId: req.user.id
        })
        throw new ForbiddenError()
      }

      await deckService.deleteDeck(id)
      res.status(204).send()
    } catch (error) {
      console.error('[DeckController] Error in deleteDeck:', error)
      next(error)
    }
  },
}

