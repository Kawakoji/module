import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import Textarea from './Textarea'
import Input from './Input'
import Card from './Card'

/**
 * Modal pour générer des cartes avec l'IA
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onGenerate - Callback avec les cartes générées
 * @param {function} onCreateAll - Callback pour créer toutes les cartes directement
 * @param {string} deckId - ID du deck
 */
export default function AIGenerateModal({
  isOpen,
  onClose,
  onGenerate,
  onCreateAll,
  deckId,
}) {
  const [mode, setMode] = useState('text') // 'text' ou 'topic'
  const [text, setText] = useState('')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [generatedCards, setGeneratedCards] = useState([])
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (mode === 'text' && !text.trim()) {
      setError('Le texte est requis')
      return
    }
    if (mode === 'topic' && !topic.trim()) {
      setError('Le sujet est requis')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedCards([])

    try {
      const { api } = await import('../services/api')
      let result

      if (mode === 'text') {
        result = await api.generateCardsFromText(text.trim(), deckId, count)
      } else {
        result = await api.generateCardsFromTopic(topic.trim(), deckId, count)
      }

      if (result.cards && result.cards.length > 0) {
        setGeneratedCards(result.cards)
        if (onGenerate) {
          onGenerate(result.cards)
        }
      } else {
        setError('Aucune carte générée')
      }
    } catch (err) {
      console.error('Error generating cards:', err)
      setError(err.message || 'Erreur lors de la génération')
    } finally {
      setGenerating(false)
    }
  }

  const handleCreateAll = async () => {
    if (generatedCards.length === 0) return

    setGenerating(true)
    setError('')

    try {
      if (onCreateAll) {
        await onCreateAll(generatedCards)
        handleClose()
      }
    } catch (err) {
      console.error('Error creating cards:', err)
      setError(err.message || 'Erreur lors de la création')
    } finally {
      setGenerating(false)
    }
  }

  const handleClose = () => {
    setText('')
    setTopic('')
    setCount(5)
    setGeneratedCards([])
    setError('')
    setMode('text')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Générer des cartes avec l'IA 🤖"
      className="max-w-4xl"
      footer={
        generatedCards.length > 0 ? (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Fermer
            </Button>
            <Button onClick={handleCreateAll} disabled={generating}>
              {generating ? 'Création...' : `Créer toutes les cartes (${generatedCards.length})`}
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} disabled={generating}>
              Annuler
            </Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? 'Génération...' : 'Générer'}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-6">
        {/* Sélection du mode */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setMode('text')
              setGeneratedCards([])
              setError('')
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              mode === 'text'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Depuis un texte
          </button>
          <button
            onClick={() => {
              setMode('topic')
              setGeneratedCards([])
              setError('')
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              mode === 'topic'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Depuis un sujet
          </button>
        </div>

        {/* Formulaire selon le mode */}
        {mode === 'text' ? (
          <div className="space-y-4">
            <Textarea
              label="Texte source"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Collez ici le texte dont vous voulez créer des cartes flashcard. Par exemple : un chapitre de cours, un article, des notes..."
              rows={8}
              disabled={generating}
            />
            <Input
              label="Nombre de cartes à générer"
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 5)}
              disabled={generating}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Sujet"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ex: Histoire de la Révolution française"
              disabled={generating}
              autoFocus
            />
            <Input
              label="Nombre de cartes à générer"
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 5)}
              disabled={generating}
            />
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Cartes générées */}
        {generatedCards.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {generatedCards.length} carte{generatedCards.length !== 1 ? 's' : ''} générée{generatedCards.length !== 1 ? 's' : ''} :
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {generatedCards.map((card, index) => (
                <Card key={index} className="p-4">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Question {index + 1} :
                    </span>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                      {card.question}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Réponse :
                    </span>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {card.answer}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Indicateur de génération */}
        {generating && generatedCards.length === 0 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              L'IA génère vos cartes...
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}




