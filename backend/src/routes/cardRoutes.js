import express from 'express'
import { cardController } from '../controllers/cardController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour les cartes
router.get('/review', cardController.getCardsToReview)
router.get('/deck/:deckId', cardController.getCardsByDeck)
router.get('/:id', cardController.getCardById)
router.post('/', cardController.createCard)
router.put('/:id', cardController.updateCard)
router.delete('/:id', cardController.deleteCard)

export default router

