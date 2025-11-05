import fs from 'fs'
import path from 'path'
import pdfParse from 'pdf-parse'
import { cleanupUpload } from '../middleware/upload.js'

/**
 * Service pour extraire le texte des documents
 */

/**
 * Extraire le texte d'un fichier PDF
 * @param {string} filePath - Chemin vers le fichier PDF
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath)
    const data = await pdfParse(dataBuffer)

    // Retourner le texte extrait
    return data.text
  } catch (error) {
    throw new Error(`Erreur lors de l'extraction du PDF : ${error.message}`)
  }
}

/**
 * Extraire le texte d'un fichier texte
 * @param {string} filePath - Chemin vers le fichier
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromTextFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf-8')
    return text
  } catch (error) {
    throw new Error(`Erreur lors de la lecture du fichier : ${error.message}`)
  }
}

/**
 * Extraire le texte d'un document (détecte automatiquement le type)
 * @param {string} filePath - Chemin vers le fichier
 * @param {string} mimeType - Type MIME du fichier
 * @returns {Promise<string>} Texte extrait
 */
export async function extractTextFromDocument(filePath, mimeType) {
  const fileExt = path.extname(filePath).toLowerCase()

  try {
    if (fileExt === '.pdf' || mimeType === 'application/pdf') {
      return await extractTextFromPDF(filePath)
    } else if (
      ['.txt', '.md'].includes(fileExt) ||
      mimeType?.startsWith('text/')
    ) {
      return await extractTextFromTextFile(filePath)
    } else {
      throw new Error(`Type de fichier non supporté : ${fileExt}`)
    }
  } finally {
    // Nettoyer le fichier temporaire après extraction
    cleanupUpload(filePath)
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



