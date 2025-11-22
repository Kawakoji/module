// Handler Vercel catch-all pour toutes les routes /api/*
// Le pattern [...path] capture toutes les routes sous /api

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

// Gérer les requêtes OPTIONS (preflight) EN PREMIER, avant TOUT autre middleware
app.options('*', (req, res) => {
  const origin = req.headers.origin
  // Autoriser toutes les origines Vercel
  res.header('Access-Control-Allow-Origin', origin || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Max-Age', '86400') // Cache preflight pour 24h
  res.status(200).end()
})

// Configuration CORS simplifiée - autoriser toutes les origines pour le moment
const corsOptions = {
  origin: true, // Autoriser toutes les origines
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}

// Middleware CORS - appliqué à toutes les routes
app.use(cors(corsOptions))

// Middleware de debug pour toutes les requêtes
app.use((req, res, next) => {
  console.log(`[Express App] ${req.method} ${req.url}`, {
    originalUrl: req.originalUrl,
    baseUrl: req.baseUrl,
    path: req.path
  })
  next()
})

// Middleware pour s'assurer que toutes les réponses sont en JSON
app.use((req, res, next) => {
  // Wrapper pour garantir JSON
  const originalJson = res.json
  const originalSend = res.send
  const originalStatus = res.status
  
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalJson.call(this, data)
  }
  
  res.send = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (typeof data === 'string' && !data.startsWith('{') && !data.startsWith('[')) {
      return originalJson.call(this, { message: data })
    }
    return originalSend.call(this, data)
  }
  
  res.status = function(code) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalStatus.call(this, code)
  }
  
  next()
})

// Middleware de compression
app.use(compression())

// Body parsers
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
export default async function (req, res) {
  // S'assurer immédiatement que le Content-Type est JSON
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  
  // Wrapper pour garantir JSON
  const originalJson = res.json
  const originalSend = res.send
  const originalStatus = res.status
  
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalJson.call(this, data)
  }
  
  res.send = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (typeof data === 'string' && !data.startsWith('{') && !data.startsWith('[')) {
      return originalJson.call(this, { message: data })
    }
    return originalSend.call(this, data)
  }
  
  res.status = function(code) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return originalStatus.call(this, code)
  }

  try {
    // Dans Vercel avec [...path], le chemin est dans req.query.path
    // Exemple: /api/decks/123 devient { path: ['decks', '123'] }
    let path = req.url || req.originalUrl || '/'
    
    // Si le chemin ne commence pas par /api, le reconstruire depuis req.query.path
    if (!path.startsWith('/api')) {
      if (req.query && req.query.path) {
        // req.query.path est un tableau ou une chaîne
        const pathArray = Array.isArray(req.query.path) 
          ? req.query.path 
          : (typeof req.query.path === 'string' ? req.query.path.split('/') : [])
        path = `/api/${pathArray.join('/')}`
      } else {
        // Si pas de query.path, essayer de reconstruire depuis req.url
        path = path.startsWith('/') ? `/api${path}` : `/api/${path}`
      }
    }
    
    // Mettre à jour req.url et req.originalUrl pour Express
    req.url = path
    req.originalUrl = path
    
    // Log détaillé pour debug
    console.log(`[API Handler] ${req.method} ${path}`, {
      originalUrl: req.originalUrl,
      url: req.url,
      baseUrl: req.baseUrl,
      path: req.path,
      query: req.query,
      queryPath: req.query?.path,
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'present' : 'missing'
      },
      body: req.body ? JSON.stringify(req.body).substring(0, 200) : undefined
    })
    
    // Utiliser Express directement
    // Express peut être appelé comme fonction
    app(req, res)
  } catch (error) {
    console.error('[API] Serverless function error:', error)
    console.error('[API] Error name:', error.name)
    console.error('[API] Error message:', error.message)
    console.error('[API] Error stack:', error.stack)
    
    // S'assurer que la réponse est en JSON
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
    } else {
      // Si les headers ont déjà été envoyés, on ne peut rien faire
      console.error('[API] Headers already sent, cannot send error response')
    }
  }
}

