// Handler Vercel catch-all pour toutes les routes /api/*
// Le pattern [...path] capture toutes les routes sous /api
// Ce fichier est dans frontend/api/ car Root Directory = frontend

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import compression from 'compression'
import { errorHandler } from '../../backend/src/middleware/errorHandler.js'
import { rateLimiter } from '../../backend/src/middleware/rateLimiter.js'
import deckRoutes from '../../backend/src/routes/deckRoutes.js'
import cardRoutes from '../../backend/src/routes/cardRoutes.js'
import reviewRoutes from '../../backend/src/routes/reviewRoutes.js'
import aiRoutes from '../../backend/src/routes/aiRoutes.js'
import documentRoutes from '../../backend/src/routes/documentRoutes.js'
import backupRoutes from '../../backend/src/routes/backupRoutes.js'
import statsRoutes from '../../backend/src/routes/statsRoutes.js'
import profileRoutes from '../../backend/src/routes/profileRoutes.js'

// Charger les variables d'environnement
dotenv.config()

const app = express()

// Gérer les requêtes OPTIONS (preflight) EN PREMIER
app.options('*', (req, res) => {
  const origin = req.headers.origin
  res.header('Access-Control-Allow-Origin', origin || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400')
  res.status(200).end()
})

// Configuration CORS
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}

app.use(cors(corsOptions))
app.use(compression())

// Middleware de debug pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`[Express App] ${req.method} ${req.url}`, {
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path
  })
  next()
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Créer un routeur API
const apiRouter = express.Router()

// Rate limiting sur le routeur API
apiRouter.use('/ai', rateLimiter(20, 15 * 60 * 1000))
apiRouter.use('/', rateLimiter(100, 15 * 60 * 1000))

// Logging middleware sur le routeur API
apiRouter.use((req, res, next) => {
  console.log(`[API Router] ${req.method} ${req.path}`, {
    url: req.url,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl
  })
  next()
})

// Routes de santé
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Moduleia API is running',
    timestamp: new Date().toISOString(),
  })
})

// Routes API sur le routeur
apiRouter.use('/decks', deckRoutes)
apiRouter.use('/cards', cardRoutes)
apiRouter.use('/reviews', reviewRoutes)
apiRouter.use('/ai', aiRoutes)
apiRouter.use('/documents', documentRoutes)
apiRouter.use('/backup', backupRoutes)
apiRouter.use('/stats', statsRoutes)
apiRouter.use('/profile', profileRoutes)

// Monter le routeur API sur /api
app.use('/api', apiRouter)

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path })
})

// Middleware de gestion des erreurs
app.use(errorHandler)

// Handler pour Vercel Serverless Functions
// Utiliser Express directement sans @vercel/node
export default async function handler(req, res) {
  // S'assurer que le Content-Type est JSON
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  
  try {
    // Log détaillé pour debug
    console.log(`[API Handler] ${req.method} ${req.url}`, {
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl,
      path: req.path,
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'present' : 'missing'
      }
    })
    
    // Utiliser Express directement
    app(req, res)
  } catch (error) {
    console.error('[API] Serverless function error:', error)
    
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      return res.status(500).json({
        error: 'Internal server error',
        message: error.message || 'An unexpected error occurred',
        ...(process.env.NODE_ENV !== 'production' && {
          name: error.name,
          stack: error.stack
        })
      })
    }
  }
}



