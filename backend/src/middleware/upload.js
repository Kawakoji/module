import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuration de multer pour stocker les fichiers temporairement
const storage = multer.diskStorage({
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
export const cleanupUpload = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting temp file:', err)
      }
    })
  }
}



