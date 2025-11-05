import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import { cleanupUpload } from '../middleware/upload.js'

/**
 * Service pour extraire le texte des documents
 */

/**
 * Extraire le texte d'un fichier PDF
 * @param {string|Buffer} filePathOrBuffer - Chemin vers le fichier PDF ou Buffer
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromPDF(filePathOrBuffer) {
  try {
    let dataBuffer
    if (Buffer.isBuffer(filePathOrBuffer)) {
      // Memory storage: utiliser directement le buffer
      dataBuffer = filePathOrBuffer
    } else {
      // Disk storage: lire le fichier
      dataBuffer = fs.readFileSync(filePathOrBuffer)
    }
    const data = await pdfParse(dataBuffer)

    // Retourner le texte extrait
    return data.text
  } catch (error) {
    throw new Error(`Erreur lors de l'extraction du PDF : ${error.message}`)
  }
}

/**
 * Extraire le texte d'un fichier texte
 * @param {string|Buffer} filePathOrBuffer - Chemin vers le fichier ou Buffer
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromTextFile(filePathOrBuffer) {
  try {
    if (Buffer.isBuffer(filePathOrBuffer)) {
      // Memory storage: convertir le buffer en texte
      return filePathOrBuffer.toString('utf-8')
    } else {
      // Disk storage: lire le fichier
      return fs.readFileSync(filePathOrBuffer, 'utf-8')
    }
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du fichier : ${error.message}`)
  }
}

/**
 * Extraire le texte d'un document (détecte automatiquement le type)
 * @param {string|Buffer} filePathOrBuffer - Chemin vers le fichier ou Buffer
 * @param {string} mimeType - Type MIME du fichier
 * @param {string} originalName - Nom original du fichier (pour l'extension)
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromDocument(filePathOrBuffer, mimeType, originalName = null) {
  // Déterminer l'extension du fichier
  let fileExt = ''
  if (Buffer.isBuffer(filePathOrBuffer)) {
    // Memory storage: utiliser originalName pour l'extension
    if (originalName) {
      fileExt = path.extname(originalName).toLowerCase()
    }
  } else {
    // Disk storage: utiliser le chemin
    fileExt = path.extname(filePathOrBuffer).toLowerCase()
  }

  try {
    if (fileExt === '.pdf' || mimeType === 'application/pdf') {
      return await extractTextFromPDF(filePathOrBuffer)
    } else if (
      ['.txt', '.md'].includes(fileExt) ||
      mimeType?.startsWith('text/')
    ) {
      return await extractTextFromTextFile(filePathOrBuffer)
    } else {
      throw new Error(`Type de fichier non supporté : ${fileExt || mimeType}`)
    }
  } finally {
    // Nettoyer le fichier temporaire après extraction (seulement si c'est un chemin)
    if (typeof filePathOrBuffer === 'string') {
      cleanupUpload(filePathOrBuffer)
    }
    // Avec memory storage, le buffer est automatiquement libéré par le GC
  }
}

/**
 * Nettoyer et formater le texte extrait
 * @param {string} text - Texte brut
 * @returns {string} Texte nettoyé
 */
export function cleanExtractedText(text) {
  if (!text) return ''

  // Supprimer les espaces multiples
  let cleaned = text.replace(/\s+/g, ' ')

  // Supprimer les sauts de ligne multiples
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n')

  // Nettoyer les caractères spéciaux problématiques
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '')

  // Limiter la taille (max 50000 caractères pour éviter les coûts OpenAI)
  if (cleaned.length > 50000) {
    cleaned = cleaned.substring(0, 50000) + '\n\n[Texte tronqué pour optimisation]'
  }

  return cleaned.trim()
}



