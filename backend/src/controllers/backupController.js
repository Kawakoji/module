import { backupService } from '../services/backupService.js'

/**
 * Contrôleur pour l'export/import et la sauvegarde
 */

export const backupController = {
  /**
   * GET /api/backup/export/all
   * Exporter tous les decks de l'utilisateur
   */
  async exportAll(req, res, next) {
    try {
      const exportData = await backupService.exportAllDecks(req.user.id)

      res.setHeader('Content-Type', 'application/json')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="moduleia-backup-${new Date().toISOString().split('T')[0]}.json"`
      )

      res.json(exportData)
    } catch (error) {
      next(error)
    }
  },

  /**
   * GET /api/backup/export/:deckId
   * Exporter un deck spécifique
   */
  async exportDeck(req, res, next) {
    try {
      const { deckId } = req.params
      const exportData = await backupService.exportDeck(deckId, req.user.id)

      res.setHeader('Content-Type', 'application/json')
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="moduleia-deck-${exportData.deck.name.replace(/[^a-z0-9]/gi, '_')}-${new Date().toISOString().split('T')[0]}.json"`
      )

      res.json(exportData)
    } catch (error) {
      next(error)
    }
  },

  /**
   * POST /api/backup/import
   * Importer des decks depuis un fichier JSON
   * Body: { data, options }
   */
  async importDecks(req, res, next) {
    try {
      const { data, options = {} } = req.body

      if (!data) {
        return res.status(400).json({ error: 'Import data is required' })
      }

      const results = await backupService.importDecks(data, req.user.id, options)

      res.json({
        success: true,
        ...results,
      })
    } catch (error) {
      next(error)
    }
  },
}








