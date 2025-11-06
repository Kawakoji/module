/**
 * Service pour l'algorithme SM2 (SuperMemo 2)
 * Utilisé pour calculer les intervalles de révision espacée
 */

/**
 * Calculer les nouvelles valeurs après une révision
 * @param {Object} card - La carte actuelle
 * @param {number} quality - Qualité de la réponse (0-5)
 *                           0-1: Oublié, 2: Difficile, 3: Moyen, 4-5: Facile
 * @returns {Object} Nouvelles valeurs { ease_factor, interval, repetitions, next_review }
 */
export function calculateSM2(card, quality) {
  // Valeurs par défaut si la carte n'a pas encore de valeurs
  let easeFactor = card.ease_factor || 2.5
  let interval = card.interval || 1
  let repetitions = card.repetitions || 0

  // Qualité : 0-5 (0=oublié, 1=difficile, 2-3=moyen, 4-5=facile)
  // Nous normalisons à 0-5 pour SM2
  // Mais notre interface utilise : 1=difficile, 2=moyen, 3=facile
  // Conversion : 1 -> 2, 2 -> 3, 3 -> 5
  let q = quality
  if (quality === 1) q = 2  // Difficile -> 2
  else if (quality === 2) q = 3  // Moyen -> 3
  else if (quality === 3) q = 5  // Facile -> 5

  // Si la réponse est très mauvaise (q < 3), réinitialiser
  if (q < 3) {
    interval = 1
    repetitions = 0
    // Légère réduction du facteur de facilité
    easeFactor = Math.max(1.3, easeFactor - 0.2)
  } else {
    // Calculer le nouveau facteur de facilité
    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    
    // S'assurer que le facteur reste dans des limites raisonnables
    easeFactor = Math.max(1.3, Math.min(2.5, easeFactor))

    // Calculer le nouvel intervalle
    if (repetitions === 0) {
      interval = 1
    } else if (repetitions === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }

    // Augmenter le nombre de répétitions
    repetitions += 1
  }

  // Calculer la prochaine date de révision
  const now = new Date()
  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    ease_factor: Math.round(easeFactor * 100) / 100, // Arrondir à 2 décimales
    interval,
    repetitions,
    next_review: nextReview.toISOString(),
  }
}

/**
 * Convertir les niveaux de difficulté de l'interface en qualité SM2
 * @param {string} difficulty - 'hard', 'medium', 'easy'
 * @returns {number} Qualité SM2 (0-5)
 */
export function difficultyToQuality(difficulty) {
  const mapping = {
    hard: 1,    // Difficile -> 2 en SM2
    medium: 2,  // Moyen -> 3 en SM2
    easy: 3,    // Facile -> 5 en SM2
  }
  return mapping[difficulty.toLowerCase()] || 2
}




