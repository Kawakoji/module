import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { motion } from 'framer-motion'
import { api } from '../services/api'

const MEMORY_TEST_QUESTIONS = [
  {
    id: 1,
    question: 'Pour apprendre une nouvelle langue, je préfère :',
    options: [
      { text: 'Voir des images, des diagrammes et des cartes', type: 'visual' },
      { text: 'Écouter des conversations et de la musique', type: 'auditory' },
      { text: 'Lire des textes et écrire des phrases', type: 'reading' },
      { text: 'Pratiquer avec des gestes et des mouvements', type: 'kinesthetic' },
    ],
  },
  {
    id: 2,
    question: 'Pour retenir un numéro de téléphone, je :',
    options: [
      { text: 'Le visualise écrit dans ma tête', type: 'visual' },
      { text: 'Le répète à voix haute plusieurs fois', type: 'auditory' },
      { text: 'L\'écris sur un papier', type: 'reading' },
      { text: 'Le compose plusieurs fois sur le clavier', type: 'kinesthetic' },
    ],
  },
  {
    id: 3,
    question: 'Dans un musée, je suis surtout attiré par :',
    options: [
      { text: 'Les tableaux et les sculptures visuelles', type: 'visual' },
      { text: 'Les audio-guides et les explications orales', type: 'auditory' },
      { text: 'Les panneaux explicatifs et les textes', type: 'reading' },
      { text: 'Les activités interactives et les manipulations', type: 'kinesthetic' },
    ],
  },
  {
    id: 4,
    question: 'Quand je dois expliquer quelque chose à quelqu\'un, je :',
    options: [
      { text: 'Fais des schémas ou des dessins', type: 'visual' },
      { text: 'Parle et explique oralement', type: 'auditory' },
      { text: 'Écris un texte ou une liste', type: 'reading' },
      { text: 'Montre avec des gestes et des exemples pratiques', type: 'kinesthetic' },
    ],
  },
  {
    id: 5,
    question: 'Pour me souvenir d\'une liste de courses, je :',
    options: [
      { text: 'Visualise les produits dans les rayons', type: 'visual' },
      { text: 'Récite la liste à voix haute', type: 'auditory' },
      { text: 'Écris la liste sur un papier', type: 'reading' },
      { text: 'Fais le trajet mentalement dans le magasin', type: 'kinesthetic' },
    ],
  },
  {
    id: 6,
    question: 'Pour apprendre à utiliser un nouveau logiciel, je préfère :',
    options: [
      { text: 'Voir des tutoriels vidéo avec captures d\'écran', type: 'visual' },
      { text: 'Écouter quelqu\'un m\'expliquer', type: 'auditory' },
      { text: 'Lire la documentation écrite', type: 'reading' },
      { text: 'Essayer directement et apprendre en faisant', type: 'kinesthetic' },
    ],
  },
  {
    id: 7,
    question: 'Quand je dois mémoriser des dates historiques, je :',
    options: [
      { text: 'Crée une frise chronologique visuelle', type: 'visual' },
      { text: 'Les récite comme une chanson ou un poème', type: 'auditory' },
      { text: 'Les écris plusieurs fois dans un cahier', type: 'reading' },
      { text: 'Les associe à des gestes ou des mouvements', type: 'kinesthetic' },
    ],
  },
  {
    id: 8,
    question: 'Pour réviser avant un examen, je préfère :',
    options: [
      { text: 'Créer des mind maps et des schémas colorés', type: 'visual' },
      { text: 'Réciter mes notes à voix haute', type: 'auditory' },
      { text: 'Relire mes notes et résumés écrits', type: 'reading' },
      { text: 'Faire des exercices pratiques et des quiz', type: 'kinesthetic' },
    ],
  },
  {
    id: 9,
    question: 'Quand je dois apprendre une nouvelle recette, je :',
    options: [
      { text: 'Regarde des photos ou des vidéos de la préparation', type: 'visual' },
      { text: 'Écoute quelqu\'un me l\'expliquer', type: 'auditory' },
      { text: 'Lis la recette écrite étape par étape', type: 'reading' },
      { text: 'Cuisine directement en suivant les étapes', type: 'kinesthetic' },
    ],
  },
  {
    id: 10,
    question: 'Pour me souvenir d\'un nom de personne, je :',
    options: [
      { text: 'Visualise son visage et associe le nom', type: 'visual' },
      { text: 'Répète le nom plusieurs fois à voix haute', type: 'auditory' },
      { text: 'L\'écris mentalement ou sur papier', type: 'reading' },
      { text: 'Fais un geste ou une action en disant le nom', type: 'kinesthetic' },
    ],
  },
]

/**
 * Modal pour le test de mémoire (10 questions VARK)
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onComplete - Callback appelé quand le test est terminé
 */
export default function MemoryTestModal({ isOpen, onClose, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const question = MEMORY_TEST_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / MEMORY_TEST_QUESTIONS.length) * 100
  const isLastQuestion = currentQuestion === MEMORY_TEST_QUESTIONS.length - 1

  const handleAnswer = async (type) => {
    const newAnswers = [...answers, { questionId: question.id, type }]
    setAnswers(newAnswers)
    setError('')

    if (isLastQuestion) {
      // Test terminé, envoyer les résultats
      await handleComplete(newAnswers)
    } else {
      // Passer à la question suivante
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handleComplete = async (finalAnswers) => {
    setSaving(true)
    setError('')

    try {
      const profile = await api.saveMemoryTestResults(finalAnswers)
      onComplete?.(profile)
      // Réinitialiser pour une prochaine utilisation
      setCurrentQuestion(0)
      setAnswers([])
      onClose()
    } catch (err) {
      console.error('Error saving test results:', err)
      setError(err.message || 'Erreur lors de la sauvegarde des résultats')
      setSaving(false)
    }
  }

  const handleClose = () => {
    if (saving) return // Empêcher la fermeture pendant la sauvegarde

    // Réinitialiser si on ferme avant la fin
    if (currentQuestion > 0) {
      if (window.confirm('Êtes-vous sûr de vouloir quitter le test ? Vos réponses seront perdues.')) {
        setCurrentQuestion(0)
        setAnswers([])
        setError('')
        onClose()
      }
    } else {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Test de mémoire 🧠"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Barre de progression */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>
              Question {currentQuestion + 1} / {MEMORY_TEST_QUESTIONS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-primary-600 h-2 rounded-full transition-all"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            {question.question}
          </h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(option.type)}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-left p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-500 dark:hover:border-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 mr-3 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary-600 opacity-0 group-hover:opacity-100" />
                  </div>
                  <span className="text-gray-900 dark:text-white">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Indicateur de sauvegarde */}
        {saving && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Calcul de votre type de mémoire...
            </p>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
          Ce test vous aide à identifier votre style d'apprentissage préféré
        </div>
      </div>
    </Modal>
  )
}

