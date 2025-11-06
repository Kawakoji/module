import { statsService } from '../services/statsService.js'

/**
 * Contrôleur pour les statistiques
 */

export const statsController = {
  /**
   * GET /api/stats
   * Récupérer les statistiques globales de l'utilisateur
   */
  async getStats(req, res, next) {
    try {
      const stats = await statsService.getUserStats(req.user.id)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/stats/reviews
   * Récupérer les statistiques de révision par jour
   */
  async getReviewStats(req, res, next) {
    try {
      const days = parseInt(req.query.days, 10) || 7
      const stats = await statsService.getReviewStatsByDay(req.user.id, days)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/stats/decks
   * Récupérer les statistiques par deck
   */
  async getDeckStats(req, res, next) {
    try {
      const stats = await statsService.getStatsByDeck(req.user.id)
      res.json(stats)
    } catch (error) {
      next(error)
    }
  },
}




