import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Déterminer le type de storage selon l'environnement
// Sur Vercel (read-only filesystem), utiliser memory storage
const isVercel = !!process.env.VERCEL || process.env.VERCEL_ENV !== undefined

let storage

// Toujours essayer memory storage d'abord sur Vercel, sinon essayer disk storage avec fallback
if (isVercel) {
  // Sur Vercel, utiliser memory storage (filesystem en lecture seule)
  storage = multer.memoryStorage()
  console.log('📦 Using memory storage for file uploads (Vercel environment)')
} else {
  // En développement local ou autre environnement, essayer disk storage
  try {
    const uploadsDir = path.join(__dirname, '../../uploads')
    
    // Créer le dossier uploads s'il n'existe pas (avec gestion d'erreur)
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Si on arrive ici, on peut utiliser disk storage
    storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadsDir)
      },
      filename: (req, file, cb) => {
        // Générer un nom de fichier unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
      },
    })
  } catch (error) {
    // Si on ne peut pas créer le dossier, fallback sur memory storage
    console.warn('⚠️  Could not create uploads directory, falling back to memory storage:', error.message)
    storage = multer.memoryStorage()
  }
}

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]

  const allowedExtensions = ['.pdf', '.txt', '.md', '.doc', '.docx']

  const fileExt = path.extname(file.originalname).toLowerCase()
  const isValidMime = allowedMimes.includes(file.mimetype)
  const isValidExt = allowedExtensions.includes(fileExt)

  if (isValidMime || isValidExt) {
    cb(null, true)
  } else {
    cb(
      new Error(
        `Type de fichier non supporté. Types acceptés : ${allowedExtensions.join(', ')}`
      ),
      false
    )
  }
}

// Configuration de multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
})

// Middleware pour nettoyer les fichiers temporaires après traitement
// Note: Avec memory storage, les fichiers sont automatiquement libérés
export const cleanupUpload = (filePath) => {
  if (filePath && fs.existsSync && fs.existsSync(filePath)) {
    try {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting temp file:', err)
        }
      })
    } catch (error) {
      // Ignorer les erreurs de suppression (peut être sur un filesystem en lecture seule)
      console.warn('Could not delete temp file:', error.message)
    }
  }
}



