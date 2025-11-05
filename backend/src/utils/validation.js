/**
 * Utilitaires de validation
 */

export const validators = {
  /**
   * Valider un nom de deck
   */
  validateDeckName(name) {
    if (!name || typeof name !== 'string') {
      throw new Error('Le nom du deck est requis')
    }

    const trimmed = name.trim()

    if (trimmed.length === 0) {
      throw new Error('Le nom du deck ne peut pas être vide')
    }

    if (trimmed.length < 2) {
      throw new Error('Le nom du deck doit contenir au moins 2 caractères')
    }

    if (trimmed.length > 100) {
      throw new Error('Le nom du deck ne peut pas dépasser 100 caractères')
    }

    return trimmed
  },

  /**
   * Valider une description de deck
   */
  validateDeckDescription(description) {
    if (!description) {
      return null
    }

    if (typeof description !== 'string') {
      throw new Error('La description doit être une chaîne de caractères')
    }

    const trimmed = description.trim()

    if (trimmed.length > 500) {
      throw new Error('La description ne peut pas dépasser 500 caractères')
    }

    return trimmed || null
  },

  /**
   * Valider une question de carte
   */
  validateCardQuestion(question) {
    if (!question || typeof question !== 'string') {
      throw new Error('La question est requise')
    }

    const trimmed = question.trim()

    if (trimmed.length === 0) {
      throw new Error('La question ne peut pas être vide')
    }

    if (trimmed.length < 3) {
      throw new Error('La question doit contenir au moins 3 caractères')
    }

    if (trimmed.length > 1000) {
      throw new Error('La question ne peut pas dépasser 1000 caractères')
    }

    return trimmed
  },

  /**
   * Valider une réponse de carte
   */
  validateCardAnswer(answer) {
    if (!answer || typeof answer !== 'string') {
      throw new Error('La réponse est requise')
    }

    const trimmed = answer.trim()

    if (trimmed.length === 0) {
      throw new Error('La réponse ne peut pas être vide')
    }

    if (trimmed.length < 1) {
      throw new Error('La réponse doit contenir au moins 1 caractère')
    }

    if (trimmed.length > 2000) {
      throw new Error('La réponse ne peut pas dépasser 2000 caractères')
    }

    return trimmed
  },

  /**
   * Valider un UUID
   */
  validateUUID(uuid, fieldName = 'ID') {
    if (!uuid || typeof uuid !== 'string') {
      throw new Error(`${fieldName} est requis`)
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(uuid)) {
      throw new Error(`${fieldName} n'est pas un UUID valide`)
    }

    return uuid
  },

  /**
   * Valider les paramètres de pagination
   */
  validatePagination(page, limit) {
    const pageNum = parseInt(page, 10) || 1
    const limitNum = parseInt(limit, 10) || 20

    if (pageNum < 1) {
      throw new Error('Le numéro de page doit être supérieur à 0')
    }

    if (limitNum < 1) {
      throw new Error('La limite doit être supérieure à 0')
    }

    if (limitNum > 100) {
      throw new Error('La limite ne peut pas dépasser 100')
    }

    return {
      page: pageNum,
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
    }
  },
}



