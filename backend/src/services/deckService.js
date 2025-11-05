import { supabase } from '../config/supabase.js'
import { NotFoundError } from '../utils/errors.js'
import { validators } from '../utils/validation.js'

/**
 * Service pour gérer les decks
 */

export const deckService = {
  /**
   * Récupérer tous les decks d'un utilisateur avec pagination et recherche
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} options - Options de pagination et recherche
   * @returns {Promise<Object>} { decks, total, page, limit }
   */
  async getAllDecks(userId, options = {}) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { page = 1, limit = 20, search = '' } = options
    const offset = (page - 1) * limit

    let query = supabase
      .from('decks')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    // Recherche par nom ou description
    // Note: Supabase ne supporte pas directement OR avec ilike
    // On utilise une approche avec des filtres multiples
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`
      // Utiliser or() avec la syntaxe correcte pour ilike
      query = query.or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(`Error fetching decks: ${error.message}`)
    }

    return {
      decks: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },

  /**
   * Récupérer un deck par son ID
   * @param {string} deckId - ID du deck
   * @returns {Promise<Object>} Le deck
   */
  async getDeckById(deckId) {
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)
      .single()

    if (error || !data) {
      throw new NotFoundError('Deck')
    }

    return data
  },

  /**
   * Créer un nouveau deck
   * @param {Object} deckData - Données du deck { name, description, user_id }
   * @returns {Promise<Object>} Le deck créé
   */
  async createDeck(deckData) {
    try {
      const { name, description, user_id } = deckData

      // Validation
      const validatedName = validators.validateDeckName(name)
      const validatedDescription = validators.validateDeckDescription(description)
      validators.validateUUID(user_id, 'User ID')

      const deck = {
        name: validatedName,
        description: validatedDescription,
        user_id,
      }

      const { data, error } = await supabase
        .from('decks')
        .insert([deck])
        .select()
        .single()

      if (error) {
        console.error('[DeckService] Supabase error creating deck:', error)
        // Préserver les erreurs de validation
        if (error.code && error.code.startsWith('PGRST')) {
          throw error
        }
        throw new Error(`Error creating deck: ${error.message}`)
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
      console.error('[DeckService] Error in createDeck:', error)
      throw error
    }
  },

  /**
   * Mettre à jour un deck
   * @param {string} deckId - ID du deck
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} Le deck mis à jour
   */
  async updateDeck(deckId, updates) {
    const { name, description } = updates

    const updateData = {}
    if (name !== undefined) {
      updateData.name = validators.validateDeckName(name)
    }
    if (description !== undefined) {
      updateData.description = validators.validateDeckDescription(description)
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Aucune donnée à mettre à jour')
    }

    const { data, error } = await supabase
      .from('decks')
      .update(updateData)
      .eq('id', deckId)
      .select()
      .single()

    if (error || !data) {
      throw new NotFoundError('Deck')
    }

    return data
  },

  /**
   * Supprimer un deck
   * @param {string} deckId - ID du deck
   * @returns {Promise<void>}
   */
  async deleteDeck(deckId) {
    // Vérifier que le deck existe
    await this.getDeckById(deckId)

    const { error } = await supabase.from('decks').delete().eq('id', deckId)

    if (error) {
      throw new Error(`Error deleting deck: ${error.message}`)
    }
  },
}

