import express from 'express'
import { documentController } from '../controllers/documentController.js'
import { authenticate } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

const router = express.Router()

// Toutes les routes nécessitent une authentification
router.use(authenticate)

// Routes pour l'import de documents
// upload.single('file') : 'file' est le nom du champ dans FormData
router.post('/upload', upload.single('file'), documentController.uploadDocument)
router.post(
  '/extract-and-generate',
  upload.single('file'),
  documentController.extractAndGenerate
)

export default router




