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
  // Ne pas envoyer de réponse si elle a déjà été envoyée
  if (res.headersSent) {
    console.error('[ErrorHandler] Headers already sent, cannot send error response')
    return next(err)
  }

  // S'assurer que le Content-Type est JSON
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  
  console.error('[ErrorHandler] Error:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code,
    details: err.details || err.hint,
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

  // Erreur Supabase / PostgREST
  if (err.code && (err.code.startsWith('PGRST') || err.code === '23505' || err.code === '23503')) {
    // Erreur de contrainte unique (code 23505)
    if (err.code === '23505' || err.message?.includes('duplicate key')) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Cette ressource existe déjà',
      })
    }

    // Erreur de clé étrangère (code 23503)
    if (err.code === '23503' || err.message?.includes('foreign key')) {
      return res.status(400).json({
        error: 'Invalid Reference',
        message: 'Référence invalide',
      })
    }

    // Ressource non trouvée
    if (err.message?.includes('No rows found') || err.message?.includes('no rows')) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Ressource introuvable',
      })
    }

    // Erreur de contrainte de validation
    if (err.message?.includes('violates check constraint')) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Les données ne respectent pas les contraintes',
      })
    }

    return res.status(400).json({
      error: 'Database Error',
      message: err.message || 'Erreur de base de données',
      ...(process.env.NODE_ENV !== 'production' && {
        code: err.code,
        details: err.details,
        hint: err.hint,
      }),
    })
  }

  // Erreur par défaut
  const statusCode = err.statusCode || err.status || 500
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Une erreur est survenue'
      : err.message || 'Internal Server Error'

  return res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && {
      name: err.name,
      stack: err.stack,
      code: err.code,
    }),
  })
}

