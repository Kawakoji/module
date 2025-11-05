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
} else if (useNeon) {
  // Si on utilise Neon, on crée un client Supabase "dummy" pour la compatibilité
  // Les services devront être adaptés pour utiliser pg directement
  // Pour l'instant, on utilise Supabase JS avec la connection string de Neon
  // Note: Cela peut ne pas fonctionner parfaitement, il faudra adapter les services
  console.log('⚠️  Using Neon database. Some Supabase JS features may not work.')
  console.log('💡 Consider using pg directly for better compatibility.')
  
  // On essaie quand même de créer un client avec la connection string
  // mais cela ne fonctionnera probablement pas pour les opérations de base
  // Pour l'instant, on garde supabaseAuth pour l'auth
  supabase = supabaseAuth || {
    // Wrapper minimal pour compatibilité
    from: (table) => {
      throw new Error(
        `Supabase JS cannot be used with Neon connection strings directly. ` +
        `Please use the database adapter or modify services to use pg.`
      )
    }
  }
}

// Export pour compatibilité
export { supabase, supabaseAuth, supabaseAnon }

// Export de la fonction query pour Neon
export { query, getDatabasePool } from './database.js'

