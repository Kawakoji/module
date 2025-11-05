import express from 'express'
import { deckController } from '../controllers/deckController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour les decks
router.get('/', deckController.getAllDecks)
router.get('/:id', deckController.getDeckById)
router.post('/', deckController.createDeck)
router.put('/:id', deckController.updateDeck)
router.delete('/:id', deckController.deleteDeck)

export default router

