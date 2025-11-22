/**
 * Service API pour communiquer avec le backend
 */

import { supabase } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Vérifier que l'URL de l'API est configurée
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('[API] VITE_API_URL is not set in production! API calls will fail.')
}

// Normaliser l'URL pour éviter les doubles slashes
const normalizeUrl = (baseUrl, endpoint) => {
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${base}${path}`
}

// Log l'URL de l'API au chargement (seulement en dev)
if (import.meta.env.DEV) {
  console.log('[API] API_URL:', API_URL)
}

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
async function request(endpoint, options = {}) {
  const url = normalizeUrl(API_URL, endpoint)
  
  // Récupérer le token depuis Supabase
  let token = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    token = session?.access_token
  } catch (error) {
    console.error('Error getting session:', error)
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  // Si on a un body, le convertir en JSON
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    console.log(`[API] Fetching: ${url}`, { method: config.method || 'GET' })
    const response = await fetch(url, config)
    
    console.log(`[API] Response status: ${response.status}`, { url })
    
    // Si la réponse est vide (204), retourner null
    if (response.status === 204) {
      return null
    }

    // Vérifier si la réponse est du JSON
    const contentType = response.headers.get('content-type')
    let data
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch (jsonError) {
        // Si le JSON est invalide, essayer de lire le texte
        const text = await response.text()
        console.error('[API] Invalid JSON response:', text.substring(0, 200))
        throw new Error(`Server returned invalid JSON: ${response.status} ${response.statusText}`)
      }
    } else {
      // Si ce n'est pas du JSON, lire le texte
      const text = await response.text()
      console.error('[API] Non-JSON response:', {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        text: text.substring(0, 500),
        url
      })
      
      // Pour les erreurs 404, essayer de parser comme JSON quand même
      if (response.status === 404) {
        // Essayer de parser comme JSON
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
          try {
            data = JSON.parse(text)
            // Si on a réussi à parser, continuer avec le traitement normal
            // Le code ci-dessous gérera l'erreur 404
          } catch (parseError) {
            console.error('[API] Failed to parse 404 response as JSON:', parseError)
            throw new Error(`Route not found: ${url}. Server response: ${text.substring(0, 100)}`)
          }
        } else {
          // Si ce n'est pas du JSON, créer un objet d'erreur standard
          data = {
            error: 'Not Found',
            message: `Route not found: ${url}`,
            details: text.substring(0, 200)
          }
        }
      } else {
        throw new Error(`Server returned non-JSON response: ${response.status} ${response.statusText}. Response: ${text.substring(0, 200)}`)
      }
    }

    // Si la réponse n'est pas OK, lancer une erreur
    if (!response.ok) {
      // Si erreur 401, rediriger vers la page de connexion
      if (response.status === 401) {
        window.location.href = '/login'
        return
      }
      
      // Pour les erreurs de validation, inclure le champ
      const errorMessage = data.message || data.error || `HTTP error! status: ${response.status}`
      const error = new Error(errorMessage)
      if (data.field) {
        error.field = data.field
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('[API] Error details:', {
      url,
      method: config.method || 'GET',
      error: error.message,
      name: error.name,
      stack: error.stack
    })
    
    // Améliorer le message d'erreur
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to API at ${url}. Please check if the server is running and VITE_API_URL is correct.`)
    }
    
    throw error
  }
}

export const api = {
  // ===== DECKS =====
  
  /**
   * Récupérer tous les decks
   * @param {Object} options - Options de pagination et recherche { page, limit, search }
   */
  async getDecks(options = {}) {
    const params = new URLSearchParams()
    if (options.page) params.append('page', options.page)
    if (options.limit) params.append('limit', options.limit)
    if (options.search) params.append('search', options.search)
    
    const query = params.toString()
    return request(`/decks${query ? `?${query}` : ''}`)
  },

  /**
   * Récupérer un deck par son ID
   */
  async getDeck(deckId) {
    return request(`/decks/${deckId}`)
  },

  /**
   * Créer un nouveau deck
   */
  async createDeck(deckData) {
    return request('/decks', {
      method: 'POST',
      body: deckData,
    })
  },

  /**
   * Mettre à jour un deck
   */
  async updateDeck(deckId, updates) {
    console.log('[API] updateDeck called with:', { deckId, updates })
    return request(`/decks/${deckId}`, {
      method: 'PUT',
      body: updates,
    })
  },

  /**
   * Supprimer un deck
   */
  async deleteDeck(deckId) {
    console.log('[API] deleteDeck called with:', { deckId })
    return request(`/decks/${deckId}`, {
      method: 'DELETE',
    })
  },

  // ===== CARDS =====

  /**
   * Récupérer les cartes d'un deck
   * @param {string} deckId - ID du deck
   * @param {Object} options - Options de pagination { page, limit }
   */
  async getCardsByDeck(deckId, options = {}) {
    const params = new URLSearchParams()
    if (options.page) params.append('page', options.page)
    if (options.limit) params.append('limit', options.limit)
    
    const query = params.toString()
    return request(`/cards/deck/${deckId}${query ? `?${query}` : ''}`)
  },

  /**
   * Récupérer les cartes à réviser
   */
  async getCardsToReview() {
    return request('/cards/review')
  },

  /**
   * Récupérer une carte par son ID
   */
  async getCard(cardId) {
    return request(`/cards/${cardId}`)
  },

  /**
   * Créer une nouvelle carte
   */
  async createCard(cardData) {
    return request('/cards', {
      method: 'POST',
      body: cardData,
    })
  },

  /**
   * Mettre à jour une carte
   */
  async updateCard(cardId, updates) {
    if (!cardId) {
      throw new Error('Card ID is required')
    }
    
    // Vérifier que l'ID ressemble à un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(cardId)) {
      console.error('[API] Invalid card ID format:', cardId)
      throw new Error(`Invalid card ID format: ${cardId}`)
    }
    
    console.log('[API] updateCard called with:', { 
      cardId, 
      cardIdLength: cardId.length,
      updates,
      endpoint: `/cards/${cardId}`
    })
    
    const endpoint = `/cards/${cardId}`
    console.log('[API] Calling endpoint:', endpoint)
    
    return request(endpoint, {
      method: 'PUT',
      body: updates,
    })
  },

  /**
   * Supprimer une carte
   */
  async deleteCard(cardId) {
    return request(`/cards/${cardId}`, {
      method: 'DELETE',
    })
  },

  // ===== REVIEWS =====

  /**
   * Enregistrer une révision de carte
   * @param {string} cardId - ID de la carte
   * @param {number} quality - Qualité (1=difficile, 2=moyen, 3=facile)
   */
  async reviewCard(cardId, quality) {
    return request('/reviews', {
      method: 'POST',
      body: { cardId, quality },
    })
  },

  // ===== AI =====

  /**
   * Générer des cartes à partir d'un texte
   * @param {string} text - Texte source
   * @param {string} deckId - ID du deck
   * @param {number} count - Nombre de cartes (optionnel, défaut: 5)
   */
  async generateCardsFromText(text, deckId, count = 5) {
    return request('/ai/generate-from-text', {
      method: 'POST',
      body: { text, deckId, count },
    })
  },

  /**
   * Générer des cartes à partir d'un sujet
   * @param {string} topic - Sujet
   * @param {string} deckId - ID du deck
   * @param {number} count - Nombre de cartes (optionnel)
   */
  async generateCardsFromTopic(topic, deckId, count = 5) {
    return request('/ai/generate-from-topic', {
      method: 'POST',
      body: { topic, deckId, count },
    })
  },

  /**
   * Générer et créer automatiquement les cartes
   * @param {string} text - Texte source
   * @param {string} deckId - ID du deck
   * @param {number} count - Nombre de cartes (optionnel)
   */
  async generateAndCreateCards(text, deckId, count = 5) {
    return request('/ai/generate-and-create', {
      method: 'POST',
      body: { text, deckId, count },
    })
  },

  // ===== DOCUMENTS =====

  /**
   * Upload un document et extraire le texte
   * @param {File} file - Fichier à uploader
   * @param {string} deckId - ID du deck
   * @param {boolean} autoGenerate - Générer automatiquement les cartes
   * @param {number} count - Nombre de cartes (si autoGenerate)
   */
  async uploadDocument(file, deckId, autoGenerate = false, count = 10) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('deckId', deckId)
    formData.append('autoGenerate', autoGenerate)
    if (autoGenerate) {
      formData.append('count', count)
    }

    const url = `${API_URL}/documents/upload`
    let token = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      token = session?.access_token
    } catch (error) {
      console.error('Error getting session:', error)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Ne pas mettre Content-Type, le navigateur le fera automatiquement avec la boundary
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'Something went wrong')
      error.statusCode = response.status
      error.data = data
      throw error
    }

    return data
  },

  /**
   * Upload un document, extraire le texte et générer des cartes (sans les créer)
   * @param {File} file - Fichier à uploader
   * @param {string} deckId - ID du deck
   * @param {number} count - Nombre de cartes à générer
   */
  async extractAndGenerate(file, deckId, count = 10) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('deckId', deckId)
    formData.append('count', count)

    const url = `${API_URL}/documents/extract-and-generate`
    let token = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      token = session?.access_token
    } catch (error) {
      console.error('Error getting session:', error)
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || data.error || 'Something went wrong')
      error.statusCode = response.status
      error.data = data
      throw error
    }

    return data
  },

  // ===== BACKUP =====

  /**
   * Exporter tous les decks
   * @returns {Promise<Blob>} Fichier JSON téléchargeable
   */
  async exportAllDecks() {
    const url = `${API_URL}/backup/export/all`
    let token = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      token = session?.access_token
    } catch (error) {
      console.error('Error getting session:', error)
    }

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || data.error || 'Export failed')
    }

    const blob = await response.blob()
    const url2 = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url2
    a.download = `moduleia-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url2)
    document.body.removeChild(a)

    return blob
  },

  /**
   * Exporter un deck spécifique
   * @param {string} deckId - ID du deck
   * @returns {Promise<Blob>} Fichier JSON téléchargeable
   */
  async exportDeck(deckId) {
    const url = `${API_URL}/backup/export/${deckId}`
    let token = null
    try {
      const { data: { session } } = await supabase.auth.getSession()
      token = session?.access_token
    } catch (error) {
      console.error('Error getting session:', error)
    }

    const response = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || data.error || 'Export failed')
    }

    const blob = await response.blob()
    const url2 = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url2
    const contentDisposition = response.headers.get('Content-Disposition')
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
      : `moduleia-deck-${deckId}.json`
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url2)
    document.body.removeChild(a)

    return blob
  },

  /**
   * Importer des decks depuis un fichier JSON
   * @param {File} file - Fichier JSON à importer
   * @param {Object} options - Options d'import { merge, skipDuplicates }
   * @returns {Promise<Object>} Résultat de l'import
   */
  async importDecks(file, options = {}) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result)

          const url = `${API_URL}/backup/import`
          let token = null
          try {
            const { data: { session } } = await supabase.auth.getSession()
            token = session?.access_token
          } catch (error) {
            console.error('Error getting session:', error)
          }

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify({ data, options }),
          })

          const result = await response.json()

          if (!response.ok) {
            throw new Error(result.message || result.error || 'Import failed')
          }

          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => {
        reject(new Error('Error reading file'))
      }

      reader.readAsText(file)
    })
  },

  // ===== STATS =====

  /**
   * Récupérer les statistiques globales
   */
  async getStats() {
    return request('/stats')
  },

  /**
   * Récupérer les statistiques de révision par jour
   * @param {number} days - Nombre de jours (défaut: 7)
   */
  async getReviewStats(days = 7) {
    return request(`/stats/reviews?days=${days}`)
  },

  /**
   * Récupérer les statistiques par deck
   */
  async getDeckStats() {
    return request('/stats/decks')
  },

  // ===== PROFILE =====

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile() {
    return request('/profile')
  },

  /**
   * Mettre à jour le profil utilisateur
   * @param {Object} updates - { username, avatar_url, memory_type }
   */
  async updateProfile(updates) {
    return request('/profile', {
      method: 'PUT',
      body: updates,
    })
  },

  /**
   * Sauvegarder les résultats du test de mémoire
   * @param {Array} answers - Réponses du test [{ questionId, type }]
   */
  async saveMemoryTestResults(answers) {
    return request('/profile/memory-test', {
      method: 'POST',
      body: { answers },
    })
  },
}
