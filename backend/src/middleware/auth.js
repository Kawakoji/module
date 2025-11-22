import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY

// Créer un client Supabase pour vérifier les tokens JWT
// Si les variables manquent, on créera le client plus tard dans authenticate
let supabase = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
} else {
  console.warn('⚠️  Missing Supabase environment variables. Authentication will fail.')
}

/**
 * Middleware d'authentification
 * Vérifie le token JWT et ajoute l'utilisateur à req.user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Vérifier que Supabase est configuré
    if (!supabase) {
      console.error('Supabase not configured. Missing SUPABASE_URL or SUPABASE_ANON_KEY')
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'Authentication service not configured. Please check environment variables.'
      })
    }

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
      console.error('[Auth] Auth error:', {
        error: error?.message,
        errorCode: error?.status,
        hasUser: !!user
      })
      return res.status(401).json({ error: 'Invalid token', details: error?.message })
    }

    // Ajouter l'utilisateur à la requête
    req.user = user
    
    console.log('[Auth] User authenticated:', {
      userId: user.id,
      email: user.email,
      method: req.method,
      path: req.path
    })
    
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(500).json({ 
      error: 'Authentication failed',
      message: error.message 
    })
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



