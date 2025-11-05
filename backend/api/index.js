// Point d'entrée pour Vercel Serverless Functions
// Ce fichier permet de déployer le backend sur Vercel

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import compression from 'compression'
import { errorHandler } from '../src/middleware/errorHandler.js'
import { rateLimiter } from '../src/middleware/rateLimiter.js'
import deckRoutes from '../src/routes/deckRoutes.js'
import cardRoutes from '../src/routes/cardRoutes.js'
import reviewRoutes from '../src/routes/reviewRoutes.js'
import aiRoutes from '../src/routes/aiRoutes.js'
import documentRoutes from '../src/routes/documentRoutes.js'
import backupRoutes from '../src/routes/backupRoutes.js'
import statsRoutes from '../src/routes/statsRoutes.js'
import profileRoutes from '../src/routes/profileRoutes.js'

// Charger les variables d'environnement
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting
app.use('/api/ai', rateLimiter(20, 15 * 60 * 1000))
app.use('/api', rateLimiter(100, 15 * 60 * 1000))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Routes de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Moduleia API is running',
    timestamp: new Date().toISOString(),
  })
})

// Routes API
app.use('/api/decks', deckRoutes)
app.use('/api/cards', cardRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/backup', backupRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/profile', profileRoutes)

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Middleware de gestion des erreurs
app.use(errorHandler)

// Export pour Vercel Serverless Functions
export default app
