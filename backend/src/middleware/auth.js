import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Créer un client Supabase pour vérifier les tokens JWT
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7) // Enlever "Bearer "

    // Vérifier le token avec Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token)

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Ajouter l'utilisateur à la requête
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Middleware optionnel - vérifie l'authentification mais ne bloque pas si absent
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const {
        data: { user },
      } = await supabase.auth.getUser(token)

      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // En cas d'erreur, continuer sans authentification
    next()
  }
}



