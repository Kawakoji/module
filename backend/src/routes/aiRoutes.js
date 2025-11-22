import express from 'express'
import { aiController } from '../controllers/aiController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour l'IA
router.post('/generate-from-text', aiController.generateFromText)
router.post('/generate-from-topic', aiController.generateFromTopic)
router.post('/generate-and-create', aiController.generateAndCreate)

export default router








