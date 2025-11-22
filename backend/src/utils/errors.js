/**
 * Classes d'erreurs personnalisées
 */

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.statusCode = 400
  }
}

export class NotFoundError extends Error {
  constructor(resource = 'Ressource') {
    super(`${resource} introuvable`)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Accès interdit') {
    super(message)
    this.name = 'ForbiddenError'
    this.statusCode = 403
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Authentification requise') {
    super(message)
    this.name = 'UnauthorizedError'
    this.statusCode = 401
  }
}








