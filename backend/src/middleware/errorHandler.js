/**
 * Middleware de gestion des erreurs
 */

import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
} from '../utils/errors.js'

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })

  // Erreurs personnalisées
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      field: err.field,
    })
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message,
    })
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      error: 'Forbidden',
      message: err.message,
    })
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message,
    })
  }

  // Erreur Supabase
  if (err.code && err.code.startsWith('PGRST')) {
    // Erreur de contrainte unique
    if (err.message.includes('duplicate key')) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Cette ressource existe déjà',
      })
    }

    // Ressource non trouvée
    if (err.message.includes('No rows found')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Ressource introuvable',
      })
    }

    return res.status(400).json({
      error: 'Database Error',
      message: err.message,
    })
  }

  // Erreur par défaut
  const statusCode = err.statusCode || err.status || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Une erreur est survenue'
      : err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  })
}

