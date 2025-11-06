import { reviewService } from '../services/reviewService.js'

/**
 * Contrôleur pour les révisions
 */

export const reviewController = {
  /**
   * POST /api/reviews
   * Enregistrer une révision de carte
   * Body: { cardId, quality } où quality = 1 (difficile), 2 (moyen), 3 (facile)
   */
  async reviewCard(req, res, next) {
    try {
      const { cardId, quality } = req.body

      if (!cardId) {
        return res.status(400).json({ error: 'Card ID is required' })
      }

      if (!quality || ![1, 2, 3].includes(quality)) {
        return res.status(400).json({
          error: 'Quality must be 1 (hard), 2 (medium), or 3 (easy)',
        })
      }

      const updatedCard = await reviewService.reviewCard(
        cardId,
        quality,
        req.user.id
      )

      res.json(updatedCard)
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/reviews/batch
   * Enregistrer plusieurs révisions en une fois
   * Body: { reviews: [{ cardId, quality }, ...] }
   */
  async reviewMultipleCards(req, res, next) {
    try {
      const { reviews } = req.body

      if (!Array.isArray(reviews) || reviews.length === 0) {
        return res.status(400).json({
          error: 'Reviews must be a non-empty array',
        })
      }

      const result = await reviewService.reviewMultipleCards(reviews, req.user.id)

      res.json(result)
    } catch (error) {
      next(error)
    }
  },
}




