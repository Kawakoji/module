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
            email: null,
            full_name: null,
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
   * @param {Object} updates - Données à mettre à jour { username, avatar_url, memory_type }
   * @returns {Promise<Object>} Profil mis à jour
   */
  async updateProfile(userId, updates) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const { username, full_name, avatar_url, memory_type } = updates

    const updateData = {}
    // username peut être mappé vers full_name si la colonne username n'existe pas
    if (username !== undefined) {
      updateData.full_name = username?.trim() || null
    }
    if (full_name !== undefined) {
      updateData.full_name = full_name?.trim() || null
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url?.trim() || null
    }
    if (memory_type !== undefined) {
      // Valider le type de mémoire
      const validTypes = ['visual', 'auditory', 'kinesthetic', 'reading']
      if (memory_type && !validTypes.includes(memory_type)) {
        throw new Error(`Type de mémoire invalide. Types valides: ${validTypes.join(', ')}`)
      }
      updateData.memory_type = memory_type || null
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

  /**
   * Sauvegarder les résultats du test de mémoire
   * @param {string} userId - ID de l'utilisateur
   * @param {Array} answers - Réponses du test [{ questionId, type }]
   * @returns {Promise<Object>} Profil mis à jour avec le type de mémoire
   */
  async saveMemoryTestResults(userId, answers) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      throw new Error('Les réponses du test sont requises')
    }

    // Calculer les scores pour chaque type
    const scores = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0,
    }

    // Compter les réponses par type
    answers.forEach((answer) => {
      if (answer.type && scores.hasOwnProperty(answer.type)) {
        scores[answer.type]++
      }
    })

    // Déterminer le type dominant
    const maxScore = Math.max(...Object.values(scores))
    const dominantType = Object.keys(scores).find((key) => scores[key] === maxScore)

    // En cas d'égalité, choisir le premier type en égalité (ou on pourrait demander à l'utilisateur)
    // Pour simplifier, on prend le premier type avec le score max
    const memoryType = dominantType || 'reading' // Fallback par défaut

    // Mettre à jour le profil
    const { data, error } = await supabase
      .from('profiles')
      .update({
        memory_type: memoryType,
        memory_test_completed: true,
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Error saving test results: ${error.message}`)
    }

    return data
  },
}




