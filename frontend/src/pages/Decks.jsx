import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../contexts/AppContext'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import BackupModal from '../components/BackupModal'

export default function Decks() {
  const { decks, createDeck, deleteDeck, loading, loadDecks } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        setSubmitting(true)
        await createDeck({
          name: formData.name.trim(),
          description: formData.description.trim(),
        })
        setFormData({ name: '', description: '' })
        setErrors({})
        setIsModalOpen(false)
      } catch (error) {
        console.error('Error creating deck:', error)
        alert('Erreur lors de la création : ' + error.message)
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleDelete = async (deckId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce deck ? Toutes les cartes associées seront également supprimées.')) {
      try {
        await deleteDeck(deckId)
      } catch (error) {
        console.error('Error deleting deck:', error)
        alert('Erreur lors de la suppression : ' + error.message)
      }
    }
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Mes Decks
        </h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setIsBackupModalOpen(true)}>
            💾 Sauvegarde
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            + Nouveau Deck
          </Button>
        </div>
      </div>

      {/* Liste des decks */}
      {loading ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </Card>
      ) : decks.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            Aucun deck
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Créez votre premier deck pour commencer !
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            Créer un deck
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {decks.map((deck, index) => (
              <Card
                key={deck.id}
                delay={index * 0.1}
                className="hover:shadow-lg transition-shadow"
              >
              <div className="flex justify-between items-start mb-2">
                <Link
                  to={`/decks/${deck.id}`}
                  className="flex-1"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {deck.name}
                  </h3>
                </Link>
                <button
                  onClick={() => handleDelete(deck.id)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 ml-2"
                  aria-label="Supprimer le deck"
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
              {deck.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {deck.description}
                </p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{deck.card_count || 0} carte{(deck.card_count || 0) !== 1 ? 's' : ''}</span>
                <Link
                  to={`/decks/${deck.id}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Voir →
                </Link>
              </div>
            </Card>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal de création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setFormData({ name: '', description: '' })
          setErrors({})
        }}
        title="Créer un nouveau deck"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setFormData({ name: '', description: '' })
                setErrors({})
              }}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Création...' : 'Créer'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom du deck"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
            placeholder="Ex: Histoire de France"
            autoFocus
            disabled={submitting}
          />
          <Textarea
            label="Description (optionnel)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={errors.description}
            placeholder="Décrivez le contenu de ce deck..."
            rows={3}
            disabled={submitting}
          />
        </form>
      </Modal>

      {/* Modal de sauvegarde */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onImportComplete={async (result) => {
          // Recharger les decks après l'import
          if (loadDecks) {
            await loadDecks()
          }
        }}
      />
    </div>
  )
}
