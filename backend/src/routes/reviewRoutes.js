import express from 'express'
import { reviewController } from '../controllers/reviewController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour les révisions
router.post('/', reviewController.reviewCard)
router.post('/batch', reviewController.reviewMultipleCards)

export default router



