import express from 'express'
import { cardController } from '../controllers/cardController.js'
import { authenticate } from '../middleware/auth.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour les cartes
// IMPORTANT: Les routes spécifiques doivent être définies AVANT les routes paramétrées
router.get('/review', cardController.getCardsToReview)
router.get('/deck/:deckId', cardController.getCardsByDeck)
router.post('/', cardController.createCard)
// PUT et DELETE avant GET pour éviter les conflits
router.put('/:id', (req, res, next) => {
  console.log('[CardRoutes] PUT /:id called with id:', req.params.id)
  next()
}, cardController.updateCard)
router.delete('/:id', cardController.deleteCard)
router.get('/:id', cardController.getCardById) // GET doit être en dernier pour éviter les conflits

export default router

