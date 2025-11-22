import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { api } from '../services/api'

const AppContext = createContext()

export function AppProvider({ children }) {
  const { isAuthenticated } = useAuth()
  
  // État des decks
  const [decks, setDecks] = useState([])
  const [cards, setCards] = useState([])
  
  // États de chargement et d'erreur
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Charger les decks quand l'utilisateur est authentifié
  useEffect(() => {
    if (isAuthenticated) {
      loadDecks()
    } else {
      // Réinitialiser les données quand l'utilisateur se déconnecte
      setDecks([])
      setCards([])
    }
  }, [isAuthenticated])

  /**
   * Charger tous les decks depuis l'API
   */
  const loadDecks = async (options = {}) => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getDecks(options)
      // Si c'est un objet avec pagination, extraire les decks
      if (result && typeof result === 'object' && Array.isArray(result.decks)) {
        setDecks(result.decks)
        return result
      }
      // Sinon, c'est un tableau (pour compatibilité)
      setDecks(result || [])
      return result
    } catch (err) {
      console.error('Error loading decks:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  /**
   * Charger les cartes d'un deck
   */
  const loadDeckCards = async (deckId, options = {}) => {
    try {
      const result = await api.getCardsByDeck(deckId, options)
      // Si c'est un objet avec pagination, extraire les cartes
      const cards = result?.cards || result || []
      // Mettre à jour les cartes dans l'état global
      setCards((prev) => {
        // Supprimer les anciennes cartes de ce deck
        const filtered = prev.filter((card) => card.deck_id !== deckId)
        // Ajouter les nouvelles cartes
        return [...filtered, ...cards]
      })
      return result
    } catch (err) {
      console.error('Error loading deck cards:', err)
      throw err
    }
  }

  // Fonctions pour les decks
  const createDeck = async (deckData) => {
    try {
      const newDeck = await api.createDeck(deckData)
      setDecks((prev) => [...prev, newDeck])
      return newDeck
    } catch (err) {
      console.error('Error creating deck:', err)
      throw err
    }
  }

  const updateDeck = async (id, updates) => {
    try {
      const updatedDeck = await api.updateDeck(id, updates)
      setDecks((prev) =>
        prev.map((deck) => (deck.id === id ? updatedDeck : deck))
      )
      return updatedDeck
    } catch (err) {
      console.error('Error updating deck:', err)
      throw err
    }
  }

  const deleteDeck = async (id) => {
    try {
      await api.deleteDeck(id)
      setDecks((prev) => prev.filter((deck) => deck.id !== id))
      // Supprimer aussi les cartes associées de l'état local
      setCards((prev) => prev.filter((card) => card.deck_id !== id))
    } catch (err) {
      console.error('Error deleting deck:', err)
      throw err
    }
  }

  // Fonctions pour les cartes
  const createCard = async (cardData) => {
    try {
      const newCard = await api.createCard({
        deck_id: cardData.deckId,
        question: cardData.question,
        answer: cardData.answer,
      })
      
      // Ajouter la carte à l'état local
      setCards((prev) => [...prev, newCard])
      
      // Mettre à jour le compteur du deck sans recharger tous les decks
      // Cela évite de perdre les decks si le rechargement échoue
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === cardData.deckId
            ? { ...deck, card_count: (deck.card_count || 0) + 1 }
            : deck
        )
      )
      
      return newCard
    } catch (err) {
      console.error('Error creating card:', err)
      throw err
    }
  }

  const updateCard = async (id, updates) => {
    try {
      console.log('[AppContext] updateCard called with:', { id, idType: typeof id, idLength: id?.length, updates })
      
      // Vérifier que l'ID est bien fourni
      if (!id) {
        throw new Error('Card ID is required')
      }
      
      // Vérifier que l'ID ressemble à un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(id)) {
        console.error('[AppContext] Invalid card ID format:', id)
        throw new Error(`Invalid card ID format: ${id}. Expected UUID format.`)
      }
      
      // Vérifier que l'ID n'est pas celui d'un deck (en vérifiant dans les decks)
      const isDeckId = decks.some(deck => deck.id === id)
      if (isDeckId) {
        console.error('[AppContext] CRITICAL ERROR: The provided ID is a deck ID, not a card ID!', { 
          id, 
          deckIds: decks.map(d => d.id),
          cardIds: cards.map(c => c.id).slice(0, 5)
        })
        throw new Error(`ERREUR CRITIQUE: L'ID fourni (${id}) est un ID de deck, pas un ID de carte. Vous ne pouvez pas modifier une carte avec un ID de deck. Veuillez utiliser le bouton de modification du deck pour modifier le deck.`)
      }
      
      // Vérifier que l'ID correspond bien à une carte existante
      const cardExists = cards.some(card => card.id === id)
      if (!cardExists) {
        console.warn('[AppContext] Card ID not found in local cache, but proceeding with API call', { id, cardIds: cards.map(c => c.id).slice(0, 5) })
      }
      
      // Adapter les noms de propriétés (deckId -> deck_id)
      const apiUpdates = {}
      if (updates.question !== undefined) apiUpdates.question = updates.question
      if (updates.answer !== undefined) apiUpdates.answer = updates.answer
      if (updates.easeFactor !== undefined) apiUpdates.ease_factor = updates.easeFactor
      if (updates.interval !== undefined) apiUpdates.interval = updates.interval
      if (updates.repetitions !== undefined) apiUpdates.repetitions = updates.repetitions
      if (updates.nextReview !== undefined) apiUpdates.next_review = updates.nextReview

      console.log('[AppContext] Calling api.updateCard (NOT updateDeck!) with:', { id, apiUpdates, endpoint: `/cards/${id}` })
      
      // IMPORTANT: Appeler api.updateCard, PAS api.updateDeck
      const updatedCard = await api.updateCard(id, apiUpdates)
      console.log('[AppContext] api.updateCard returned:', updatedCard)
      
      setCards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      )
      
      return updatedCard
    } catch (err) {
      console.error('[AppContext] Error updating card:', err)
      throw err
    }
  }

  const deleteCard = async (id) => {
    try {
      // Récupérer la carte avant de la supprimer pour connaître son deck_id
      const cardToDelete = cards.find((card) => card.id === id)
      const deckId = cardToDelete?.deck_id
      
      await api.deleteCard(id)
      setCards((prev) => prev.filter((card) => card.id !== id))
      
      // Mettre à jour le compteur du deck sans recharger tous les decks
      if (deckId) {
        setDecks((prev) =>
          prev.map((deck) =>
            deck.id === deckId
              ? { ...deck, card_count: Math.max(0, (deck.card_count || 0) - 1) }
              : deck
          )
        )
      }
    } catch (err) {
      console.error('Error deleting card:', err)
      throw err
    }
  }

  // Obtenir les cartes d'un deck (depuis l'état local ou charger depuis l'API)
  const getDeckCards = async (deckId) => {
    // Vérifier si on a déjà les cartes en cache
    const cachedCards = cards.filter((card) => card.deck_id === deckId)
    
    // Si on n'a pas de cartes en cache, les charger
    if (cachedCards.length === 0) {
      const result = await loadDeckCards(deckId)
      // S'assurer de retourner un tableau
      return Array.isArray(result) ? result : (result?.cards || [])
    }
    
    return cachedCards
  }

  // Obtenir les cartes à réviser
  const getCardsToReview = async () => {
    try {
      const data = await api.getCardsToReview()
      return data || []
    } catch (err) {
      console.error('Error loading cards to review:', err)
      return []
    }
  }

  const value = {
    decks,
    cards,
    loading,
    error,
    createDeck,
    updateDeck,
    deleteDeck,
    createCard,
    updateCard,
    deleteCard,
    getDeckCards,
    getCardsToReview,
    loadDecks,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
