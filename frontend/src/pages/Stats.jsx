import { useState, useEffect } from 'react'
import { useApp } from '../contexts/AppContext'
import Card from '../components/Card'
import Button from '../components/Button'
import { api } from '../services/api'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function Stats() {
  const { loadDecks } = useApp()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [reviewStats, setReviewStats] = useState([])
  const [deckStats, setDeckStats] = useState([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const [globalStats, reviews, decks] = await Promise.all([
        api.getStats(),
        api.getReviewStats(7),
        api.getDeckStats(),
      ])
      setStats(globalStats)
      setReviewStats(reviews)
      setDeckStats(decks)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chargement des statistiques...</p>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Erreur lors du chargement des statistiques</p>
        </Card>
      </div>
    )
  }

  // Préparer les données pour le graphique en camembert
  const cardsDistribution = [
    { name: 'Maîtrisées', value: stats.masteredCards },
    { name: 'En apprentissage', value: stats.learningCards },
  ].filter((item) => item.value > 0)

  // Top 5 des decks par nombre de cartes
  const topDecks = [...deckStats]
    .sort((a, b) => b.totalCards - a.totalCards)
    .slice(0, 5)

  return (
    <div className="px-4 sm:px-0 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Statistiques 📊
        </h1>
        <Button variant="secondary" onClick={loadStats}>
          Actualiser
        </Button>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Decks
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalDecks}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total Cartes
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats.totalCards}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            À réviser
          </div>
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            {stats.cardsToReview}
          </div>
        </Card>
        <Card className="p-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Maîtrisées
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.masteredCards}
          </div>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique de révision sur 7 jours */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Révisions (7 derniers jours)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reviewStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return `${date.getDate()}/${date.getMonth() + 1}`
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('fr-FR')
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="reviewed"
                stroke="#3b82f6"
                name="Révisées"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="mastered"
                stroke="#10b981"
                name="Maîtrisées"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribution des cartes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Distribution des cartes
          </h3>
          {cardsDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cardsDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cardsDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              Aucune carte
            </div>
          )}
        </Card>
      </div>

      {/* Top 5 des decks */}
      {topDecks.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Top 5 des decks
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDecks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="deckName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalCards" fill="#3b82f6" name="Total cartes" />
              <Bar dataKey="masteredCards" fill="#10b981" name="Maîtrisées" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Statistiques par deck */}
      {deckStats.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Statistiques par deck
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Deck
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    À réviser
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Maîtrisées
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Taux de maîtrise
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {deckStats.map((deck) => (
                  <tr key={deck.deckId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {deck.deckName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {deck.totalCards}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400">
                      {deck.cardsToReview}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                      {deck.masteredCards}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${deck.masteryRate}%` }}
                          />
                        </div>
                        <span>{deck.masteryRate.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}



