/**
 * Script de test pour vérifier la connexion à Neon
 * 
 * Usage: node test-neon.js
 */

import { query, getDatabasePool } from './src/config/database.js'
import dotenv from 'dotenv'

dotenv.config()

async function testConnection() {
  console.log('🔍 Test de connexion à Neon...\n')

  try {
    // Test 1: Vérifier que DATABASE_URL est défini
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL n\'est pas défini dans .env')
      process.exit(1)
    }

    console.log('✅ DATABASE_URL trouvé')

    // Test 2: Créer le pool de connexions
    const pool = getDatabasePool()
    if (!pool) {
      console.error('❌ Impossible de créer le pool de connexions')
      process.exit(1)
    }

    console.log('✅ Pool de connexions créé')

    // Test 3: Exécuter une requête simple
    const result = await query('SELECT NOW() as current_time, version() as pg_version')
    console.log('✅ Requête exécutée avec succès')
    console.log('   Heure actuelle:', result.rows[0].current_time)
    console.log('   Version PostgreSQL:', result.rows[0].pg_version.split(' ')[0])

    // Test 4: Vérifier les tables existantes
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)

    console.log('\n📊 Tables existantes:')
    if (tablesResult.rows.length === 0) {
      console.log('   ⚠️  Aucune table trouvée. Exécutez les migrations !')
    } else {
      tablesResult.rows.forEach((row) => {
        console.log(`   - ${row.table_name}`)
      })
    }

    // Test 5: Vérifier les tables nécessaires
    const requiredTables = ['profiles', 'decks', 'cards']
    const existingTables = tablesResult.rows.map((r) => r.table_name)
    const missingTables = requiredTables.filter((t) => !existingTables.includes(t))

    if (missingTables.length > 0) {
      console.log('\n⚠️  Tables manquantes:')
      missingTables.forEach((table) => {
        console.log(`   - ${table}`)
      })
      console.log('\n💡 Exécutez les migrations dans Neon SQL Editor')
    } else {
      console.log('\n✅ Toutes les tables nécessaires sont présentes')
    }

    console.log('\n🎉 Connexion à Neon réussie !')

    // Fermer le pool
    await pool.end()
    process.exit(0)
  } catch (error) {
    console.error('\n❌ Erreur de connexion:')
    console.error('   Message:', error.message)
    console.error('   Code:', error.code)
    
    if (error.message.includes('connection')) {
      console.error('\n💡 Vérifiez:')
      console.error('   - Que DATABASE_URL est correct dans .env')
      console.error('   - Que votre base Neon est active')
      console.error('   - Que votre IP est autorisée (si nécessaire)')
    }

    process.exit(1)
  }
}

testConnection()








