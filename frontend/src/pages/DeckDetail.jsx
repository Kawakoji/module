import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import AIGenerateModal from '../components/AIGenerateModal'
import DocumentUploadModal from '../components/DocumentUploadModal'

export default function DeckDetail() {
  const { deckId } = useParams()
  const { decks, getDeckCards, createCard, updateCard, deleteCard } = useApp()
  const deck = decks.find((d) => d.id === deckId)
  const [deckCards, setDeckCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [editingCard, setEditingCard] = useState(null)
  const [formData, setFormData] = useState({ question: '', answer: '' })
  const [errors, setErrors] = useState({})
  const [flippedCards, setFlippedCards] = useState({})

  // Charger les cartes du deck
  useEffect(() => {
    if (deckId) {
      loadCards()
    }
  }, [deckId])

  const loadCards = async () => {
    try {
      setLoading(true)
      const cards = await getDeckCards(deckId)
      setDeckCards(cards)
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!deck) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Deck introuvable
          </h2>
          <Link to="/decks">
            <Button variant="secondary">Retour aux decks</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.question.trim()) {
      newErrors.question = 'La question est requise'
    }
    if (!formData.answer.trim()) {
      newErrors.answer = 'La réponse est requise'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        if (editingCard) {
          await updateCard(editingCard.id, {
            question: formData.question.trim(),
            answer: formData.answer.trim(),
          })
        } else {
          await createCard({
            deckId: deck.id,
            question: formData.question.trim(),
            answer: formData.answer.trim(),
          })
        }
        setFormData({ question: '', answer: '' })
        setErrors({})
        setEditingCard(null)
        setIsModalOpen(false)
        // Recharger les cartes
        await loadCards()
      } catch (error) {
        console.error('Error saving card:', error)
        alert('Erreur lors de la sauvegarde : ' + error.message)
      }
    }
  }

  const handleEdit = (card) => {
    setEditingCard(card)
    setFormData({ question: card.question, answer: card.answer })
    setIsModalOpen(true)
  }

  const handleDelete = async (cardId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      try {
        await deleteCard(cardId)
        await loadCards()
      } catch (error) {
        console.error('Error deleting card:', error)
        alert('Erreur lors de la suppression : ' + error.message)
      }
    }
  }

  const toggleFlip = (cardId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }))
  }

  return (
    <div className="px-4 sm:px-0">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/decks"
          className="text-primary-600 dark:text-primary-400 hover:underline mb-2 inline-block"
        >
          ← Retour aux decks
        </Link>
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {deck.name}
            </h1>
            {deck.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {deck.description}
              </p>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant="secondary" onClick={() => setIsDocumentModalOpen(true)}>
              📄 Importer document
            </Button>
            <Button variant="secondary" onClick={() => setIsAIModalOpen(true)}>
              🤖 Générer avec IA
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={async () => {
                try {
                  const { api } = await import('../services/api')
                  await api.exportDeck(deck.id)
                } catch (error) {
                  console.error('Error exporting deck:', error)
                  alert('Erreur lors de l\'export : ' + error.message)
                }
              }}
            >
              💾 Exporter
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              + Ajouter une carte
            </Button>
          </div>
        </div>
      </div>

      {/* Liste des cartes */}
      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </Card>
      ) : deckCards.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🎴</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Aucune carte
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Ajoutez votre première carte à ce deck !
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="secondary" onClick={() => setIsDocumentModalOpen(true)}>
              📄 Importer document
            </Button>
            <Button variant="secondary" onClick={() => setIsAIModalOpen(true)}>
              🤖 Générer avec IA
            </Button>
            <Button onClick={() => setIsModalOpen(true)}>
              Ajouter une carte
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {deckCards.map((card, index) => {
              const isFlipped = flippedCards[card.id]
              return (
                <Card
                  key={card.id}
                  delay={index * 0.05}
                  className="relative min-h-[200px] cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => toggleFlip(card.id)}
                >
                <div className="flex justify-end gap-2 mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(card)
                    }}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    aria-label="Modifier"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(card.id)
                    }}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                    aria-label="Supprimer"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {isFlipped ? 'Réponse' : 'Question'}
                  </div>
                  <div className="text-lg font-medium text-gray-900 dark:text-white">
                    {isFlipped ? card.answer : card.question}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    Cliquez pour retourner
                  </div>
                </div>
              </Card>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de création/édition */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ question: '', answer: '' })
          setErrors({})
          setEditingCard(null)
        }}
        title={editingCard ? 'Modifier la carte' : 'Ajouter une nouvelle carte'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ question: '', answer: '' })
                setErrors({})
                setEditingCard(null)
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {editingCard ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            label="Question"
            value={formData.question}
            onChange={(e) =>
              setFormData({ ...formData, question: e.target.value })
            }
            error={errors.question}
            required
            placeholder="Ex: Quelle est la capitale de la France ?"
            autoFocus
            rows={3}
          />
          <Textarea
            label="Réponse"
            value={formData.answer}
            onChange={(e) =>
              setFormData({ ...formData, answer: e.target.value })
            }
            error={errors.answer}
            required
            placeholder="Ex: Paris"
            rows={3}
          />
        </form>
      </Modal>

      {/* Modal de génération IA */}
      <AIGenerateModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        deckId={deck.id}
        onGenerate={(cards) => {
          // Les cartes sont générées, l'utilisateur peut les voir et les créer
          console.log('Cartes générées:', cards)
        }}
        onCreateAll={async (cards) => {
          // Créer toutes les cartes générées
          try {
            for (const card of cards) {
              await createCard({
                deckId: deck.id,
                question: card.question,
                answer: card.answer,
              })
            }
            await loadCards()
          } catch (error) {
            console.error('Error creating cards:', error)
            throw error
          }
        }}
      />

      {/* Modal d'import de document */}
      <DocumentUploadModal
        isOpen={isDocumentModalOpen}
        onClose={() => setIsDocumentModalOpen(false)}
        deckId={deck.id}
        onCreateAll={async (cards) => {
          // Les cartes sont déjà créées par le backend si autoGenerate
          // Mais on peut aussi recevoir des cartes à créer manuellement
          if (cards && cards.length > 0) {
            try {
              for (const card of cards) {
                await createCard({
                  deckId: deck.id,
                  question: card.question,
                  answer: card.answer,
                })
              }
              await loadCards()
            } catch (error) {
              console.error('Error creating cards:', error)
              throw error
            }
          } else {
            // Recharger les cartes si elles ont été créées automatiquement
            await loadCards()
          }
        }}
      />
    </div>
  )
}
