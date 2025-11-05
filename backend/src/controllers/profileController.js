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
      const { username, avatar_url } = req.body
      const profile = await profileService.updateProfile(req.user.id, {
        username,
        avatar_url,
      })
      res.json(profile)
    } catch (error) {
      next(error)
    }
  },
}



