import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/Button'
import Card from '../components/Card'

export default function Home() {
  const { decks, loading, getCardsToReview } = useApp()
  const [cardsToReview, setCardsToReview] = useState([])
  const [cardsCount, setCardsCount] = useState(0)

  // Charger les statistiques
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const cards = await getCardsToReview()
      setCardsToReview(cards)
      // Calculer le total des cartes depuis les decks
      const total = decks.reduce((sum, deck) => sum + (deck.card_count || 0), 0)
      setCardsCount(total)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <Card className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bienvenue sur Moduleia
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Votre application intelligente de flashcards avec assistance IA.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/decks">
              <Button size="lg">Voir mes decks</Button>
            </Link>
            {cardsToReview.length > 0 && (
              <Link to="/review">
                <Button size="lg" variant="secondary">
                  Réviser ({cardsToReview.length})
                </Button>
              </Link>
            )}
          </div>
        </Card>

        {/* Statistiques rapides */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {loading ? '...' : decks.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Deck{decks.length !== 1 ? 's' : ''}
            </div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {loading ? '...' : cardsCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Carte{cardsCount !== 1 ? 's' : ''}
            </div>
          </Card>
          <Card>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
              {cardsToReview.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              À réviser
            </div>
          </Card>
        </div>

        {/* Fonctionnalités */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Fonctionnalités
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">📚 Créez des decks</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Organisez vos cartes par catégories et sujets.
              </p>
            </div>

            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">🤖 Génération IA</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Générez automatiquement des cartes à partir de texte.
              </p>
            </div>

            <div className="p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">📊 Révision espacée</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimisez votre mémorisation avec l'algorithme SM2.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
