import express from 'express'
import { statsController } from '../controllers/statsController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour les statistiques
router.get('/', statsController.getStats)
router.get('/reviews', statsController.getReviewStats)
router.get('/decks', statsController.getDeckStats)

export default router




