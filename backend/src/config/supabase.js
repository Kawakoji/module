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
  console.log(`📡 SUPABASE_URL: ${process.env.SUPABASE_URL?.substring(0, 30)}...`)
} else if (useNeon) {
  // Si on utilise Neon, on ne peut PAS utiliser Supabase JS pour les opérations DB
  // Supabase JS nécessite l'API REST de Supabase, pas une connection PostgreSQL directe
  console.log('⚠️  DATABASE_URL detected (Neon PostgreSQL).')
  console.log('⚠️  Supabase JS cannot be used with Neon PostgreSQL connection strings.')
  console.log('💡 You need to either:')
  console.log('   1. Use Supabase (not Neon) for database - set SUPABASE_URL to Supabase project URL')
  console.log('   2. Or migrate services to use pg directly with DATABASE_URL')
  
  // Si SUPABASE_URL pointe vers Supabase (pas Neon), on peut l'utiliser pour l'API REST
  if (useSupabaseAuth && process.env.SUPABASE_URL) {
    const supabaseUrl = process.env.SUPABASE_URL.toLowerCase()
    // Vérifier si SUPABASE_URL ressemble à une URL Supabase (contient .supabase.co)
    if (supabaseUrl.includes('.supabase.co')) {
      console.log('✅ SUPABASE_URL points to Supabase, using Supabase JS API')
      supabase = supabaseAuth
    } else {
      console.error('❌ SUPABASE_URL does not appear to point to Supabase.')
      console.error('💡 SUPABASE_URL should be like: https://xxxxx.supabase.co')
      console.error('💡 Current SUPABASE_URL starts with:', process.env.SUPABASE_URL.substring(0, 30))
      supabase = {
        from: (table) => {
          throw new Error(
            `Database configuration error: SUPABASE_URL does not point to Supabase. ` +
            `Please set SUPABASE_URL to your Supabase project URL (https://xxxxx.supabase.co)`
          )
        }
      }
    }
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

