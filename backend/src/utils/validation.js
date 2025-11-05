/**
 * Utilitaires de validation
 */

import { ValidationError } from './errors.js'

export const validators = {
  /**
   * Valider un nom de deck
   */
  validateDeckName(name) {
    if (!name || typeof name !== 'string') {
      throw new ValidationError('Le nom du deck est requis', 'name')
    }

    const trimmed = name.trim()

    if (trimmed.length === 0) {
      throw new ValidationError('Le nom du deck ne peut pas être vide', 'name')
    }

    if (trimmed.length < 2) {
      throw new ValidationError('Le nom du deck doit contenir au moins 2 caractères', 'name')
    }

    if (trimmed.length > 100) {
      throw new ValidationError('Le nom du deck ne peut pas dépasser 100 caractères', 'name')
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
      throw new ValidationError('La description doit être une chaîne de caractères', 'description')
    }

    const trimmed = description.trim()

    if (trimmed.length > 500) {
      throw new ValidationError('La description ne peut pas dépasser 500 caractères', 'description')
    }

    return trimmed || null
  },

  /**
   * Valider une question de carte
   */
  validateCardQuestion(question) {
    if (!question || typeof question !== 'string') {
      throw new ValidationError('La question est requise', 'question')
    }

    const trimmed = question.trim()

    if (trimmed.length === 0) {
      throw new ValidationError('La question ne peut pas être vide', 'question')
    }

    if (trimmed.length < 3) {
      throw new ValidationError('La question doit contenir au moins 3 caractères', 'question')
    }

    if (trimmed.length > 1000) {
      throw new ValidationError('La question ne peut pas dépasser 1000 caractères', 'question')
    }

    return trimmed
  },

  /**
   * Valider une réponse de carte
   */
  validateCardAnswer(answer) {
    if (!answer || typeof answer !== 'string') {
      throw new ValidationError('La réponse est requise', 'answer')
    }

    const trimmed = answer.trim()

    if (trimmed.length === 0) {
      throw new ValidationError('La réponse ne peut pas être vide', 'answer')
    }

    if (trimmed.length < 1) {
      throw new ValidationError('La réponse doit contenir au moins 1 caractère', 'answer')
    }

    if (trimmed.length > 2000) {
      throw new ValidationError('La réponse ne peut pas dépasser 2000 caractères', 'answer')
    }

    return trimmed
  },

  /**
   * Valider un UUID
   */
  validateUUID(uuid, fieldName = 'ID') {
    if (!uuid || typeof uuid !== 'string') {
      throw new ValidationError(`${fieldName} est requis`, fieldName.toLowerCase())
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

    if (!uuidRegex.test(uuid)) {
      throw new ValidationError(`${fieldName} n'est pas un UUID valide`, fieldName.toLowerCase())
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



