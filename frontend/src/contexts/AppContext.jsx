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
      
      // Recharger les decks pour mettre à jour le compteur
      await loadDecks()
      
      return newCard
    } catch (err) {
      console.error('Error creating card:', err)
      throw err
    }
  }

  const updateCard = async (id, updates) => {
    try {
      // Adapter les noms de propriétés (deckId -> deck_id)
      const apiUpdates = {}
      if (updates.question !== undefined) apiUpdates.question = updates.question
      if (updates.answer !== undefined) apiUpdates.answer = updates.answer
      if (updates.easeFactor !== undefined) apiUpdates.ease_factor = updates.easeFactor
      if (updates.interval !== undefined) apiUpdates.interval = updates.interval
      if (updates.repetitions !== undefined) apiUpdates.repetitions = updates.repetitions
      if (updates.nextReview !== undefined) apiUpdates.next_review = updates.nextReview

      const updatedCard = await api.updateCard(id, apiUpdates)
      
      setCards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      )
      
      return updatedCard
    } catch (err) {
      console.error('Error updating card:', err)
      throw err
    }
  }

  const deleteCard = async (id) => {
    try {
      await api.deleteCard(id)
      setCards((prev) => prev.filter((card) => card.id !== id))
      
      // Recharger les decks pour mettre à jour le compteur
      await loadDecks()
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
      return await loadDeckCards(deckId)
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
