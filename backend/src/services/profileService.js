import { supabase } from '../config/supabase.js'

/**
 * Service pour le profil utilisateur
 */

export const profileService = {
  /**
   * Récupérer le profil d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Profil utilisateur
   */
  async getProfile(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, c'est OK pour un nouveau profil
      throw new Error(`Error fetching profile: ${error.message}`)
    }

    // Si le profil n'existe pas, créer un profil par défaut
    if (!data) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: null,
            avatar_url: null,
          },
        ])
        .select()
        .single()

      if (createError) {
        throw new Error(`Error creating profile: ${createError.message}`)
      }

      return newProfile
    }

    return data
  },

  /**
   * Mettre à jour le profil d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} updates - Données à mettre à jour { username, avatar_url }
   * @returns {Promise<Object>} Profil mis à jour
   */
  async updateProfile(userId, updates) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { username, avatar_url } = updates

    const updateData = {}
    if (username !== undefined) {
      updateData.username = username?.trim() || null
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url?.trim() || null
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('Aucune donnée à mettre à jour')
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`)
    }

    return data
  },
}



