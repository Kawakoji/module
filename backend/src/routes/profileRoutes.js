import express from 'express'
import { profileController } from '../controllers/profileController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour le profil
router.get('/', profileController.getProfile)
router.put('/', profileController.updateProfile)
router.post('/memory-test', profileController.saveMemoryTestResults)

export default router




