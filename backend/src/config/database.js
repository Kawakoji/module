import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

/**
 * Configuration de la base de données Neon (PostgreSQL)
 * 
 * Note: Si vous utilisez Neon, vous devez utiliser cette configuration
 * au lieu de Supabase pour les opérations de base de données.
 * Supabase Auth reste utilisé pour l'authentification.
 */

let pool = null

export function getDatabasePool() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
      console.warn('⚠️  DATABASE_URL not found. Using Supabase connection.')
      return null
    }

    try {
      pool = new Pool({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false, // Nécessaire pour Neon
        },
        // Configuration pour Neon
        max: 20, // Nombre max de connexions
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      })

      // Gestion des erreurs de connexion
      pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
      })

      console.log('✅ Database pool créé pour Neon')
    } catch (error) {
      console.error('❌ Erreur lors de la création du pool:', error.message)
      return null
    }
  }

  return pool
}

/**
 * Exécuter une requête SQL
 * @param {string} text - Requête SQL
 * @param {Array} params - Paramètres
 * @returns {Promise<Object>} Résultat
 */
export async function query(text, params) {
  const pool = getDatabasePool()
  if (!pool) {
    throw new Error('Database pool not initialized. Check DATABASE_URL.')
  }
  return pool.query(text, params)
}

/**
 * Fermer le pool de connexions
 */
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}

