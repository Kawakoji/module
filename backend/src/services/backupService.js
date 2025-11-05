import { supabase } from '../config/supabase.js'
import { cardService } from './cardService.js'

/**
 * Service pour l'export/import et la sauvegarde de decks
 */

export const backupService = {
  /**
   * Exporter tous les decks d'un utilisateur avec leurs cartes
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Objet JSON avec tous les decks et cartes
   */
  async exportAllDecks(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    // Récupérer tous les decks de l'utilisateur
    const { data: decks, error: decksError } = await supabase
      .from('decks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (decksError) {
      throw new Error(`Error fetching decks: ${decksError.message}`)
    }

    // Pour chaque deck, récupérer toutes les cartes
    const decksWithCards = await Promise.all(
      (decks || []).map(async (deck) => {
        const { cards } = await cardService.getCardsByDeck(deck.id, {
          page: 1,
          limit: 10000, // Récupérer toutes les cartes
        })

        return {
          ...deck,
          cards: cards || [],
        }
      })
    )

    // Créer l'objet d'export
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      decks: decksWithCards,
      totalDecks: decksWithCards.length,
      totalCards: decksWithCards.reduce((sum, deck) => sum + (deck.cards?.length || 0), 0),
    }

    return exportData
  },

  /**
   * Exporter un deck spécifique avec ses cartes
   * @param {string} deckId - ID du deck
   * @param {string} userId - ID de l'utilisateur (pour vérification)
   * @returns {Promise<Object>} Objet JSON avec le deck et ses cartes
   */
  async exportDeck(deckId, userId) {
    if (!deckId) {
      throw new Error('Deck ID is required')
    }

    // Vérifier que le deck appartient à l'utilisateur
    const { data: deck, error: deckError } = await supabase
      .from('decks')
      .select('*')
      .eq('id', deckId)
      .eq('user_id', userId)
      .single()

    if (deckError || !deck) {
      throw new Error('Deck not found or access denied')
    }

    // Récupérer toutes les cartes du deck
    const { cards } = await cardService.getCardsByDeck(deckId, {
      page: 1,
      limit: 10000,
    })

    // Créer l'objet d'export
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      deck: {
        ...deck,
        cards: cards || [],
      },
      totalCards: cards?.length || 0,
    }

    return exportData
  },

  /**
   * Importer des decks depuis un objet JSON
   * @param {Object} importData - Données d'import (format d'export)
   * @param {string} userId - ID de l'utilisateur
   * @param {Object} options - Options d'import { merge, skipDuplicates }
   * @returns {Promise<Object>} Résultat de l'import
   */
  async importDecks(importData, userId, options = {}) {
    const { merge = false, skipDuplicates = true } = options

    if (!importData || (!importData.decks && !importData.deck)) {
      throw new Error('Invalid import data format')
    }

    // Normaliser les données (support deck unique ou array de decks)
    const decksToImport = importData.deck
      ? [importData.deck]
      : importData.decks || []

    const results = {
      created: [],
      updated: [],
      skipped: [],
      errors: [],
      total: decksToImport.length,
    }

    // Récupérer les decks existants pour vérifier les doublons
    const { data: existingDecks } = await supabase
      .from('decks')
      .select('id, name')
      .eq('user_id', userId)

    const existingDeckNames = new Set(
      (existingDecks || []).map((d) => d.name.toLowerCase())
    )

    for (const deckData of decksToImport) {
      try {
        // Vérifier si le deck existe déjà
        const deckExists = existingDeckNames.has(deckData.name?.toLowerCase())

        if (deckExists && skipDuplicates) {
          results.skipped.push({
            name: deckData.name,
            reason: 'Deck with same name already exists',
          })
          continue
        }

        // Créer ou mettre à jour le deck
        let deck
        if (deckExists && merge) {
          // Mettre à jour le deck existant
          const existingDeck = existingDecks.find(
            (d) => d.name.toLowerCase() === deckData.name.toLowerCase()
          )
          const { data: updatedDeck, error: updateError } = await supabase
            .from('decks')
            .update({
              name: deckData.name,
              description: deckData.description || null,
            })
            .eq('id', existingDeck.id)
            .select()
            .single()

          if (updateError) throw updateError
          deck = updatedDeck
          results.updated.push(deck)
        } else {
          // Créer un nouveau deck
          const { data: newDeck, error: createError } = await supabase
            .from('decks')
            .insert([
              {
                user_id: userId,
                name: deckData.name,
                description: deckData.description || null,
              },
            ])
            .select()
            .single()

          if (createError) throw createError
          deck = newDeck
          results.created.push(deck)
          existingDeckNames.add(deckData.name.toLowerCase())
        }

        // Importer les cartes du deck
        const cards = deckData.cards || []
        const importedCards = []

        for (const cardData of cards) {
          try {
            const { data: newCard, error: cardError } = await supabase
              .from('cards')
              .insert([
                {
                  deck_id: deck.id,
                  question: cardData.question,
                  answer: cardData.answer,
                  ease_factor: cardData.ease_factor || 2.5,
                  interval: cardData.interval || 1,
                  repetitions: cardData.repetitions || 0,
                  next_review: cardData.next_review || new Date().toISOString(),
                },
              ])
              .select()
              .single()

            if (cardError) throw cardError
            importedCards.push(newCard)
          } catch (cardError) {
            results.errors.push({
              deck: deckData.name,
              card: cardData.question,
              error: cardError.message,
            })
          }
        }

        // Ajouter les cartes importées au résultat
        const createdDeck = results.created.find((d) => d.id === deck.id)
        if (createdDeck) {
          createdDeck.importedCards = importedCards.length
        } else {
          const updatedDeck = results.updated.find((d) => d.id === deck.id)
          if (updatedDeck) {
            updatedDeck.importedCards = importedCards.length
          }
        }
      } catch (error) {
        results.errors.push({
          deck: deckData.name,
          error: error.message,
        })
      }
    }

    return results
  },
}

