/**
 * Rate limiting middleware simple
 * Pour une production réelle, utiliser express-rate-limit
 */

const requestCounts = new Map()

/**
 * Rate limiter simple par IP
 * @param {number} maxRequests - Nombre maximum de requêtes
 * @param {number} windowMs - Fenêtre de temps en ms
 */
export const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress
    const now = Date.now()

    // Nettoyer les anciennes entrées
    if (requestCounts.size > 10000) {
      requestCounts.clear()
    }

    const userRequests = requestCounts.get(ip) || { count: 0, resetTime: now + windowMs }

    // Réinitialiser si la fenêtre est passée
    if (now > userRequests.resetTime) {
      userRequests.count = 0
      userRequests.resetTime = now + windowMs
    }

    // Vérifier la limite
    if (userRequests.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Trop de requêtes. Veuillez réessayer plus tard.',
        retryAfter: Math.ceil((userRequests.resetTime - now) / 1000),
      })
    }

    // Incrémenter le compteur
    userRequests.count++
    requestCounts.set(ip, userRequests)

    // Ajouter les headers de rate limit
    res.setHeader('X-RateLimit-Limit', maxRequests)
    res.setHeader('X-RateLimit-Remaining', maxRequests - userRequests.count)
    res.setHeader('X-RateLimit-Reset', new Date(userRequests.resetTime).toISOString())

    next()
  }
}








