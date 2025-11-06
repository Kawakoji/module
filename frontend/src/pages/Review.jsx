import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { api } from '../services/api'

export default function Review() {
  const { getCardsToReview, decks } = useApp()
  const [cardsToReview, setCardsToReview] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [reviewedCount, setReviewedCount] = useState(0)
  const [reviewing, setReviewing] = useState(false)
  const [memoryType, setMemoryType] = useState(null)
  const [sessionStats, setSessionStats] = useState({
    hard: 0,
    medium: 0,
    easy: 0,
  })

  // Charger les cartes à réviser et le profil
  useEffect(() => {
    loadCardsToReview()
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const profile = await api.getProfile()
      setMemoryType(profile.memory_type)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadCardsToReview = async () => {
    try {
      setLoading(true)
      const cards = await getCardsToReview()
      setCardsToReview(cards)
    } catch (error) {
      console.error('Error loading cards to review:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentCard = cardsToReview[currentIndex]
  const currentDeck = currentCard
    ? decks.find((d) => d.id === currentCard.deck_id || d.id === currentCard.decks?.id)
    : null

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // Fonction pour adapter l'affichage selon le type de mémoire
  const getCardDisplayStyle = () => {
    if (!memoryType) {
      // Par défaut, style standard
      return {
        cardClassName: '',
        textClassName: 'text-2xl font-medium text-gray-900 dark:text-white mb-8',
        showIcons: false,
        showAudio: false,
        animationType: 'fade',
      }
    }

    switch (memoryType) {
      case 'visual':
        return {
          cardClassName: 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800',
          textClassName: 'text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-8',
          showIcons: true,
          showAudio: false,
          animationType: 'scale',
        }
      case 'auditory':
        return {
          cardClassName: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-2 border-green-200 dark:border-green-800',
          textClassName: 'text-2xl font-medium text-gray-900 dark:text-white mb-8',
          showIcons: false,
          showAudio: true,
          animationType: 'fade',
        }
      case 'reading':
        return {
          cardClassName: 'bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600',
          textClassName: 'text-xl leading-relaxed text-gray-900 dark:text-white mb-8 space-y-4 max-w-3xl mx-auto text-left px-4',
          showIcons: false,
          showAudio: false,
          animationType: 'fade',
        }
      case 'kinesthetic':
        return {
          cardClassName: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800',
          textClassName: 'text-2xl font-medium text-gray-900 dark:text-white mb-8',
          showIcons: false,
          showAudio: false,
          animationType: 'bounce',
        }
      default:
        return {
          cardClassName: '',
          textClassName: 'text-2xl font-medium text-gray-900 dark:text-white mb-8',
          showIcons: false,
          showAudio: false,
          animationType: 'fade',
        }
    }
  }

  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'fr-FR'
      utterance.rate = 0.9
      speechSynthesis.speak(utterance)
    }
  }

  const displayStyle = getCardDisplayStyle()

  const handleReview = async (quality) => {
    if (!currentCard || reviewing) return

    try {
      setReviewing(true)

      // Qualité : 1=difficile, 2=moyen, 3=facile
      await api.reviewCard(currentCard.id, quality)

      // Mettre à jour les statistiques
      setSessionStats((prev) => ({
        ...prev,
        hard: quality === 1 ? prev.hard + 1 : prev.hard,
        medium: quality === 2 ? prev.medium + 1 : prev.medium,
        easy: quality === 3 ? prev.easy + 1 : prev.easy,
      }))

      // Passer à la carte suivante ou terminer
      if (currentIndex < cardsToReview.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setIsFlipped(false)
        setReviewedCount(reviewedCount + 1)
      } else {
        // Toutes les cartes ont été révisées
        setReviewedCount(reviewedCount + 1)
      }
    } catch (error) {
      console.error('Error reviewing card:', error)
      alert('Erreur lors de la révision : ' + error.message)
    } finally {
      setReviewing(false)
    }
  }

  const resetReview = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setReviewedCount(0)
    setSessionStats({ hard: 0, medium: 0, easy: 0 })
    loadCardsToReview()
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12 max-w-2xl mx-auto">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </Card>
      </div>
    )
  }

  if (cardsToReview.length === 0) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Aucune carte à réviser
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Toutes vos cartes sont à jour ! Créez de nouveaux decks ou ajoutez
            des cartes pour commencer une session de révision.
          </p>
          <Link to="/decks">
            <Button>Voir mes decks</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (reviewedCount >= cardsToReview.length) {
    const total = sessionStats.hard + sessionStats.medium + sessionStats.easy
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Session terminée !
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Vous avez révisé {total} carte{total !== 1 ? 's' : ''} aujourd'hui.
          </p>

          {/* Statistiques de la session */}
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {sessionStats.hard}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Difficile</div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {sessionStats.medium}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Moyen</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {sessionStats.easy}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Facile</div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/decks">
              <Button variant="secondary">Retour aux decks</Button>
            </Link>
            <Button onClick={resetReview}>
              Recommencer
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="max-w-3xl mx-auto">
        {/* Header avec progression */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Session de révision
            </h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentIndex + 1} / {cardsToReview.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / cardsToReview.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Carte de révision */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          key={currentIndex}
        >
          <Card
            className={`min-h-[400px] cursor-pointer hover:shadow-lg transition-shadow ${displayStyle.cardClassName}`}
            onClick={handleFlip}
            hover={false}
          >
            <motion.div
              className="text-center"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ perspective: '1000px' }}
            >
              <div className="text-center" style={{ backfaceVisibility: 'hidden' }}>
                {currentDeck && (
                  <div className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                    Deck: {currentDeck.name}
                  </div>
                )}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {displayStyle.showIcons && (
                    <span className="text-2xl">
                      {isFlipped ? '💡' : '❓'}
                    </span>
                  )}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isFlipped ? 'Réponse' : 'Question'}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <motion.div
                    key={isFlipped ? 'answer' : 'question'}
                    initial={
                      displayStyle.animationType === 'bounce'
                        ? { opacity: 0, scale: 0.8, y: 20 }
                        : displayStyle.animationType === 'scale'
                        ? { opacity: 0, scale: 0.9 }
                        : { opacity: 0, y: 10 }
                    }
                    animate={
                      displayStyle.animationType === 'bounce'
                        ? { opacity: 1, scale: 1, y: 0 }
                        : displayStyle.animationType === 'scale'
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, y: 0 }
                    }
                    transition={
                      displayStyle.animationType === 'bounce'
                        ? { type: 'spring', stiffness: 300, damping: 20 }
                        : { duration: 0.3 }
                    }
                    className={displayStyle.textClassName}
                  >
                    {isFlipped ? currentCard.answer : currentCard.question}
                  </motion.div>
                  {displayStyle.showAudio && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTextToSpeech(
                          isFlipped ? currentCard.answer : currentCard.question
                        )
                      }}
                      className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                      title="Lire à voix haute"
                    >
                      <svg
                        className="w-6 h-6 text-primary-600 dark:text-primary-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {isFlipped
                    ? 'Cliquez pour voir la question'
                    : 'Cliquez pour voir la réponse'}
                </div>
              </div>
            </motion.div>
          </Card>
        </motion.div>

        {/* Actions */}
        <AnimatePresence>
          {isFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Button
                variant="danger"
                onClick={() => handleReview(1)}
                disabled={reviewing}
              >
                {reviewing ? '...' : 'Difficile'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleReview(2)}
                disabled={reviewing}
              >
                {reviewing ? '...' : 'Moyen'}
              </Button>
              <Button
                onClick={() => handleReview(3)}
                disabled={reviewing}
              >
                {reviewing ? '...' : 'Facile'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistiques de la session en cours */}
        {(sessionStats.hard > 0 || sessionStats.medium > 0 || sessionStats.easy > 0) && (
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Cette session :
            </div>
            <div className="flex gap-4 justify-center text-sm">
              <span className="text-red-600 dark:text-red-400">
                {sessionStats.hard} difficile{sessionStats.hard !== 1 ? 's' : ''}
              </span>
              <span className="text-yellow-600 dark:text-yellow-400">
                {sessionStats.medium} moyen{sessionStats.medium !== 1 ? 's' : ''}
              </span>
              <span className="text-green-600 dark:text-green-400">
                {sessionStats.easy} facile{sessionStats.easy !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
