import { supabase } from '../config/supabase.js'
import { NotFoundError, ForbiddenError } from '../utils/errors.js'
import { calculateSM2 } from './sm2Service.js'

/**
 * Service pour gérer les révisions de cartes
 */

export const reviewService = {
  /**
   * Enregistrer une révision de carte avec l'algorithme SM2
   * @param {string} cardId - ID de la carte
   * @param {number} quality - Qualité de la réponse (1=difficile, 2=moyen, 3=facile)
   * @param {string} userId - ID de l'utilisateur (pour vérifier les permissions)
   * @returns {Promise<Object>} La carte mise à jour
   */
  async reviewCard(cardId, quality, userId) {
    if (!cardId) {
      throw new Error('Card ID is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    if (![1, 2, 3].includes(quality)) {
      throw new Error('Quality must be 1 (hard), 2 (medium), or 3 (easy)')
    }

    // Récupérer la carte avec son deck
    const { data: card, error: cardError } = await supabase
      .from('cards')
      .select('*, decks!inner(user_id)')
      .eq('id', cardId)
      .single()

    if (cardError || !card) {
      throw new NotFoundError('Carte')
    }

    // Vérifier que la carte appartient à l'utilisateur
    if (card.decks.user_id !== userId) {
      throw new ForbiddenError()
    }

    // Calculer les nouvelles valeurs avec SM2
    const newValues = calculateSM2(card, quality)

    // Mettre à jour la carte
    const { data: updatedCard, error: updateError } = await supabase
      .from('cards')
      .update(newValues)
      .eq('id', cardId)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Error updating card: ${updateError.message}`)
    }

    return updatedCard
  },

  /**
   * Enregistrer plusieurs révisions en une fois
   * @param {Array} reviews - Array de { cardId, quality }
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Les cartes mises à jour
   */
  async reviewMultipleCards(reviews, userId) {
    const results = []
    const errors = []

    for (const review of reviews) {
      try {
        const updated = await this.reviewCard(review.cardId, review.quality, userId)
        results.push(updated)
      } catch (error) {
        errors.push({
          cardId: review.cardId,
          error: error.message,
        })
      }
    }

    if (errors.length > 0 && results.length === 0) {
      throw new Error('Toutes les révisions ont échoué')
    }

    return { results, errors }
  },
}



