import { supabase } from '../config/supabase.js'

/**
 * Service pour les statistiques utilisateur
 */

export const statsService = {
  /**
   * Récupérer les statistiques globales d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques complètes
   */
  async getUserStats(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Récupérer le nombre total de decks
    const { count: totalDecks } = await supabase
      .from('decks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Récupérer le nombre total de cartes
    const { data: decksData } = await supabase
      .from('decks')
      .select('id')
      .eq('user_id', userId)

    const deckIds = (decksData || []).map((d) => d.id)

    let totalCards = 0
    let cardsToReview = 0
    let masteredCards = 0
    let learningCards = 0

    if (deckIds.length > 0) {
      // Total de cartes
      const { count: totalCardsCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .in('deck_id', deckIds)

      totalCards = totalCardsCount || 0

      // Cartes à réviser (next_review <= maintenant)
      const now = new Date().toISOString()
      const { count: toReviewCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .in('deck_id', deckIds)
        .lte('next_review', now)

      cardsToReview = toReviewCount || 0

      // Cartes maîtrisées (repetitions >= 5)
      const { count: masteredCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .in('deck_id', deckIds)
        .gte('repetitions', 5)

      masteredCards = masteredCount || 0

      // Cartes en apprentissage (repetitions < 5)
      const { count: learningCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true })
        .in('deck_id', deckIds)
        .lt('repetitions', 5)

      learningCards = learningCount || 0
    }

    return {
      totalDecks: totalDecks || 0,
      totalCards,
      cardsToReview,
      masteredCards,
      learningCards,
    }
  },

  /**
   * Récupérer les statistiques de révision par jour (7 derniers jours)
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Statistiques par jour
   */
  async getReviewStatsByDay(userId, days = 7) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Récupérer les decks de l'utilisateur
    const { data: decksData } = await supabase
      .from('decks')
      .select('id')
      .eq('user_id', userId)

    const deckIds = (decksData || []).map((d) => d.id)

    if (deckIds.length === 0) {
      return []
    }

    // Récupérer les cartes avec leurs dates de mise à jour
    const { data: cardsData } = await supabase
      .from('cards')
      .select('updated_at, repetitions')
      .in('deck_id', deckIds)

    // Grouper par jour
    const stats = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      stats[dateStr] = {
        date: dateStr,
        reviewed: 0,
        mastered: 0,
      }
    }

    // Compter les révisions par jour
    ;(cardsData || []).forEach((card) => {
      const cardDate = new Date(card.updated_at)
      const dateStr = cardDate.toISOString().split('T')[0]

      if (stats[dateStr]) {
        stats[dateStr].reviewed++
        if (card.repetitions >= 5) {
          stats[dateStr].mastered++
        }
      }
    })

    return Object.values(stats)
  },

  /**
   * Récupérer les statistiques par deck
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Array>} Statistiques par deck
   */
  async getStatsByDeck(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Récupérer tous les decks avec leurs cartes
    const { data: decks } = await supabase
      .from('decks')
      .select('id, name, card_count')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!decks || decks.length === 0) {
      return []
    }

    const deckIds = decks.map((d) => d.id)

    // Récupérer les statistiques des cartes par deck
    const { data: cards } = await supabase
      .from('cards')
      .select('deck_id, repetitions, next_review')
      .in('deck_id', deckIds)

    const now = new Date().toISOString()

    // Calculer les stats par deck
    const statsByDeck = decks.map((deck) => {
      const deckCards = (cards || []).filter((c) => c.deck_id === deck.id)
      const toReview = deckCards.filter((c) => c.next_review <= now).length
      const mastered = deckCards.filter((c) => c.repetitions >= 5).length
      const learning = deckCards.filter((c) => c.repetitions < 5).length

      return {
        deckId: deck.id,
        deckName: deck.name,
        totalCards: deck.card_count || 0,
        cardsToReview: toReview,
        masteredCards: mastered,
        learningCards: learning,
        masteryRate: deck.card_count > 0 ? (mastered / deck.card_count) * 100 : 0,
      }
    })

    return statsByDeck
  },
}




