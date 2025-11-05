// Handler Vercel catch-all pour toutes les routes /api/*
// Le pattern [...path] capture toutes les routes sous /api

import serverless from '@vercel/node'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import compression from 'compression'
import { errorHandler } from '../backend/src/middleware/errorHandler.js'
import { rateLimiter } from '../backend/src/middleware/rateLimiter.js'
import deckRoutes from '../backend/src/routes/deckRoutes.js'
import cardRoutes from '../backend/src/routes/cardRoutes.js'
import reviewRoutes from '../backend/src/routes/reviewRoutes.js'
import aiRoutes from '../backend/src/routes/aiRoutes.js'
import documentRoutes from '../backend/src/routes/documentRoutes.js'
import backupRoutes from '../backend/src/routes/backupRoutes.js'
import statsRoutes from '../backend/src/routes/statsRoutes.js'
import profileRoutes from '../backend/src/routes/profileRoutes.js'

// Charger les variables d'environnement
dotenv.config()

const app = express()

// Configuration CORS pour autoriser toutes les URLs Vercel (production et preview)
const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, curl, etc.)
    if (!origin) return callback(null, true)
    
    // Autoriser toutes les URLs Vercel
    if (
      origin.includes('vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      callback(null, true)
    } else {
      callback(null, true) // Autoriser toutes les origines pour le moment
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}

// Gérer les requêtes OPTIONS (preflight) AVANT tout autre middleware
// Les requêtes OPTIONS ne doivent pas passer par le rate limiter
app.options('*', (req, res) => {
  const origin = req.headers.origin
  if (!origin || origin.includes('vercel.app') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.header('Access-Control-Allow-Origin', origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.status(200).end()
  } else {
    res.status(403).end()
  }
})

// Middleware
app.use(cors(corsOptions))
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Rate limiting (exclure OPTIONS qui sont déjà gérées)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  next()
})
app.use('/ai', rateLimiter(20, 15 * 60 * 1000))
app.use('/', rateLimiter(100, 15 * 60 * 1000))

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Routes de santé
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Moduleia API is running',
    timestamp: new Date().toISOString(),
  })
})

// Routes API (sans le préfixe /api car on est déjà dans /api)
app.use('/decks', deckRoutes)
app.use('/cards', cardRoutes)
app.use('/reviews', reviewRoutes)
app.use('/ai', aiRoutes)
app.use('/documents', documentRoutes)
app.use('/backup', backupRoutes)
app.use('/stats', statsRoutes)
app.use('/profile', profileRoutes)

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path })
})

// Middleware de gestion des erreurs
app.use(errorHandler)

// Handler pour Vercel Serverless Functions
// @vercel/node wrapper pour Express
export default serverless(app)

