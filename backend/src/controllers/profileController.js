import { profileService } from '../services/profileService.js'

/**
 * Contrôleur pour le profil utilisateur
 */

export const profileController = {
  /**
   * GET /api/profile
   * Récupérer le profil de l'utilisateur
   */
  async getProfile(req, res, next) {
    try {
      const profile = await profileService.getProfile(req.user.id)
      res.json(profile)
    } catch (error) {
      next(error)
    }
  },

  /**
   * PUT /api/profile
   * Mettre à jour le profil de l'utilisateur
   */
  async updateProfile(req, res, next) {
    try {
      const { username, avatar_url, memory_type } = req.body
      const profile = await profileService.updateProfile(req.user.id, {
        username,
        avatar_url,
        memory_type,
      })
      res.json(profile)
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/profile/memory-test
   * Sauvegarder les résultats du test de mémoire
   */
  async saveMemoryTestResults(req, res, next) {
    try {
      const { answers } = req.body
      if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Les réponses du test sont requises' })
      }
      const profile = await profileService.saveMemoryTestResults(req.user.id, answers)
      res.json(profile)
    } catch (error) {
      next(error)
    }
  },
}




