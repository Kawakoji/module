import { supabase } from '../config/supabase.js'
import { NotFoundError, ValidationError } from '../utils/errors.js'

/**
 * Service pour gérer les cartes
 */

export const cardService = {
  /**
   * Récupérer toutes les cartes d'un deck avec pagination
   * @param {string} deckId - ID du deck
   * @param {Object} options - Options de pagination
   * @returns {Promise<Object>} { cards, total, page, limit }
   */
  async getCardsByDeck(deckId, options = {}) {
    const { page = 1, limit = 50 } = options
    const offset = (page - 1) * limit

    const { data, error, count } = await supabase
      .from('cards')
      .select('*', { count: 'exact' })
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Error fetching cards: ${error.message}`)
    }

    return {
      cards: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },

  /**
   * Récupérer une carte par son ID
   * @param {string} cardId - ID de la carte
   * @returns {Promise<Object>} La carte
   */
  async getCardById(cardId) {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('id', cardId)
      .single()

    if (error || !data) {
      throw new NotFoundError('Carte')
    }

    return data
  },

  /**
   * Récupérer les cartes à réviser
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Liste des cartes à réviser
   */
  async getCardsToReview(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const now = new Date().toISOString()

    // Récupérer les cartes dont next_review est dans le passé
    // Filtrer par utilisateur via les decks
    const { data, error } = await supabase
      .from('cards')
      .select('*, decks!inner(*)')
      .lte('next_review', now)
      .eq('decks.user_id', userId)
      .order('next_review', { ascending: true })

    if (error) {
      throw new Error(`Error fetching cards to review: ${error.message}`)
    }

    return data
  },

  /**
   * Créer une nouvelle carte
   * @param {Object} cardData - Données de la carte { deck_id, question, answer }
   * @returns {Promise<Object>} La carte créée
   */
  async createCard(cardData) {
    try {
      const { validators } = await import('../utils/validation.js')
      const { deck_id, question, answer } = cardData

      console.log('[CardService] Creating card with data:', {
        deck_id,
        question: question?.substring(0, 50),
        answer: answer?.substring(0, 50),
        hasQuestion: !!question,
        hasAnswer: !!answer,
      })

      // Validation
      if (!deck_id) {
        throw new ValidationError('Deck ID est requis', 'deck_id')
      }
      validators.validateUUID(deck_id, 'Deck ID')
      const validatedQuestion = validators.validateCardQuestion(question)
      const validatedAnswer = validators.validateCardAnswer(answer)

    const card = {
      deck_id,
      question: validatedQuestion,
      answer: validatedAnswer,
      // Valeurs par défaut pour la révision espacée (SM2)
      ease_factor: 2.5,
      interval: 1,
      repetitions: 0,
      next_review: new Date().toISOString(),
    }

      const { data, error } = await supabase
        .from('cards')
        .insert([card])
        .select()
        .single()

      if (error) {
        console.error('[CardService] Supabase error creating card:', error)
        // Préserver les erreurs de validation
        if (error.code && error.code.startsWith('PGRST')) {
          throw error
        }
        throw new Error(`Error creating card: ${error.message}`)
      }

      if (!data) {
        throw new Error('No data returned from database')
      }

      return data
    } catch (error) {
      // Si c'est déjà une ValidationError, la relancer telle quelle
      if (error.name === 'ValidationError') {
        throw error
      }
      // Si c'est une erreur Supabase, la relancer telle quelle pour que errorHandler la gère
      if (error.code && error.code.startsWith('PGRST')) {
        throw error
      }
      // Sinon, encapsuler dans une nouvelle erreur
      console.error('[CardService] Error in createCard:', error)
      throw error
    }
  },

  /**
   * Mettre à jour une carte
   * @param {string} cardId - ID de la carte
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} La carte mise à jour
   */
  async updateCard(cardId, updates) {
    const { validators } = await import('../utils/validation.js')
    const { question, answer, ease_factor, interval, repetitions, next_review } = updates

    const updateData = {}
    if (question !== undefined) {
      updateData.question = validators.validateCardQuestion(question)
    }
    if (answer !== undefined) {
      updateData.answer = validators.validateCardAnswer(answer)
    }
    if (ease_factor !== undefined) {
      if (typeof ease_factor !== 'number' || ease_factor < 1.3 || ease_factor > 2.5) {
        throw new Error('Le facteur de facilité doit être entre 1.3 et 2.5')
      }
      updateData.ease_factor = ease_factor
    }
    if (interval !== undefined) {
      if (typeof interval !== 'number' || interval < 0) {
        throw new Error('L\'intervalle doit être un nombre positif')
      }
      updateData.interval = interval
    }
    if (repetitions !== undefined) {
      if (typeof repetitions !== 'number' || repetitions < 0) {
        throw new Error('Le nombre de répétitions doit être un nombre positif')
      }
      updateData.repetitions = repetitions
    }
    if (next_review !== undefined) {
      updateData.next_review = next_review
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Aucune donnée à mettre à jour')
    }

    const { data, error } = await supabase
      .from('cards')
      .update(updateData)
      .eq('id', cardId)
      .select()
      .single()

    if (error || !data) {
      throw new NotFoundError('Carte')
    }

    return data
  },

  /**
   * Supprimer une carte
   * @param {string} cardId - ID de la carte
   * @returns {Promise<void>}
   */
  async deleteCard(cardId) {
    // Vérifier que la carte existe
    await this.getCardById(cardId)

    const { error } = await supabase.from('cards').delete().eq('id', cardId)

    if (error) {
      throw new Error(`Error deleting card: ${error.message}`)
    }
  },
}

