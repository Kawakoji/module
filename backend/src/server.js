import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import compression from 'compression'
import { errorHandler } from './middleware/errorHandler.js'
import { rateLimiter } from './middleware/rateLimiter.js'
import deckRoutes from './routes/deckRoutes.js'
import cardRoutes from './routes/cardRoutes.js'
import reviewRoutes from './routes/reviewRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import backupRoutes from './routes/backupRoutes.js'
import statsRoutes from './routes/statsRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

// Charger les variables d'environnement
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(compression()) // Compression des réponses
app.use(express.json({ limit: '10mb' })) // Limite de taille pour JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' })) // Pour les formulaires multipart

// Rate limiting (doit être avant les routes)
// Plus strict pour les routes IA, puis général
app.use('/api/ai', rateLimiter(20, 15 * 60 * 1000)) // 20 requêtes par 15 minutes pour l'IA
app.use('/api', rateLimiter(100, 15 * 60 * 1000)) // 100 requêtes par 15 minutes pour le reste

// Logging middleware (simple)
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

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler)

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📚 API available at http://localhost:${PORT}/api`)
})

