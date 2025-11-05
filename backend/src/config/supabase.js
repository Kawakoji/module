import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { getDatabasePool, query } from './database.js'

dotenv.config()

// Vérifier si on utilise Neon (DATABASE_URL) ou Supabase
const useNeon = !!process.env.DATABASE_URL
const useSupabaseAuth = !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_KEY

// Client Supabase pour l'authentification (toujours utilisé si configuré)
let supabaseAuth = null
let supabaseAnon = null

if (useSupabaseAuth) {
  // Client Supabase avec la clé service (pour l'authentification uniquement)
  supabaseAuth = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )

  // Client Supabase pour les opérations utilisateur (avec clé anon)
  supabaseAnon = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
    }
  )
}

// Client Supabase pour la base de données
// Si DATABASE_URL est présent, on utilisera pg directement dans les services
// Sinon, on utilise Supabase JS normalement
let supabase = null

if (!useNeon && useSupabaseAuth) {
  // Utiliser Supabase JS normalement
  supabase = supabaseAuth
  console.log('✅ Using Supabase JS for database operations')
} else if (useNeon) {
  // Si on utilise Neon, on utilise Supabase JS avec SUPABASE_URL
  // car Supabase JS peut fonctionner avec une connection string PostgreSQL standard
  // à condition que SUPABASE_URL pointe vers la base de données
  if (useSupabaseAuth && process.env.SUPABASE_URL) {
    // Utiliser Supabase JS avec SUPABASE_URL (qui devrait pointer vers Supabase, pas Neon)
    // Si SUPABASE_URL pointe vers Neon, cela pourrait ne pas fonctionner
    console.log('⚠️  DATABASE_URL detected. Using Supabase JS with SUPABASE_URL.')
    console.log('💡 If SUPABASE_URL points to Neon, this may not work. Use Supabase for database or migrate services to use pg.')
    supabase = supabaseAuth
  } else {
    // Pas de SUPABASE_URL configuré, on ne peut pas utiliser Supabase JS
    console.error('❌ DATABASE_URL is set but SUPABASE_URL is not configured.')
    console.error('💡 You need both SUPABASE_URL and SUPABASE_SERVICE_KEY to use Supabase JS.')
    console.error('💡 Or migrate services to use pg directly with DATABASE_URL.')
    supabase = {
      // Wrapper minimal pour compatibilité qui lance une erreur explicite
      from: (table) => {
        throw new Error(
          `Database configuration error: DATABASE_URL is set but SUPABASE_URL is missing. ` +
          `Please configure SUPABASE_URL and SUPABASE_SERVICE_KEY, or migrate services to use pg directly.`
        )
      }
    }
  }
} else if (!useSupabaseAuth) {
  console.error('❌ Neither DATABASE_URL nor SUPABASE_URL is configured.')
  console.error('💡 Please configure SUPABASE_URL and SUPABASE_SERVICE_KEY, or DATABASE_URL.')
  supabase = {
    from: (table) => {
      throw new Error(
        `Database not configured: Please set SUPABASE_URL and SUPABASE_SERVICE_KEY, or DATABASE_URL.`
      )
    }
  }
}

// Export pour compatibilité
export { supabase, supabaseAuth, supabaseAnon }

// Export de la fonction query pour Neon
export { query, getDatabasePool } from './database.js'

