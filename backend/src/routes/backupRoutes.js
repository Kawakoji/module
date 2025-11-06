import express from 'express'
import { backupController } from '../controllers/backupController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour l'export/import
router.get('/export/all', backupController.exportAll)
router.get('/export/:deckId', backupController.exportDeck)
router.post('/import', backupController.importDecks)

export default router




