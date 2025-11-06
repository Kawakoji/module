import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'
import MemoryTestModal from '../components/MemoryTestModal'
import { api } from '../services/api'

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    username: '',
    avatar_url: '',
    memory_type: '',
  })
  const [errors, setErrors] = useState({})
  const [showMemoryTest, setShowMemoryTest] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const data = await api.getProfile()
      setProfile({
        username: data.username || '',
        avatar_url: data.avatar_url || '',
        memory_type: data.memory_type || '',
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setSaving(true)

    try {
      const updated = await api.updateProfile({
        username: profile.username.trim() || null,
        avatar_url: profile.avatar_url.trim() || null,
        memory_type: profile.memory_type || null,
      })
      setProfile({
        username: updated.username || '',
        avatar_url: updated.avatar_url || '',
        memory_type: updated.memory_type || '',
      })
      alert('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ general: error.message || 'Erreur lors de la mise à jour' })
    } finally {
      setSaving(false)
    }
  }

  const handleMemoryTestComplete = async (updatedProfile) => {
    // Recharger le profil pour mettre à jour le type de mémoire
    await loadProfile()
    alert(
      `Test terminé ! Votre type de mémoire est : ${getMemoryTypeLabel(updatedProfile.memory_type)}`
    )
  }

  const getMemoryTypeLabel = (type) => {
    const labels = {
      visual: '👁️ Visuelle',
      auditory: '👂 Auditive',
      reading: '📖 Lecture/Écriture',
      kinesthetic: '🤲 Kinesthésique',
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-0">
        <Card className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Chargement du profil...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-0 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Mon Profil 👤
      </h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Informations de base
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  L'email ne peut pas être modifié
                </p>
              </div>

              <Input
                label="Nom d'utilisateur"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                placeholder="Votre nom d'utilisateur"
                error={errors.username}
              />

              <Input
                label="URL de l'avatar"
                value={profile.avatar_url}
                onChange={(e) =>
                  setProfile({ ...profile, avatar_url: e.target.value })
                }
                placeholder="https://example.com/avatar.jpg"
                error={errors.avatar_url}
                type="url"
              />
            </div>
          </div>

          {/* Type de mémoire */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Type de mémoire 🧠
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Votre type de mémoire préféré
                </label>
                <select
                  value={profile.memory_type || ''}
                  onChange={(e) =>
                    setProfile({ ...profile, memory_type: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Non défini</option>
                  <option value="visual">👁️ Visuelle (images, diagrammes, couleurs)</option>
                  <option value="auditory">👂 Auditive (sons, voix, musique)</option>
                  <option value="reading">📖 Lecture/Écriture (textes, listes, notes)</option>
                  <option value="kinesthetic">🤲 Kinesthésique (mouvements, interactions)</option>
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ce choix adapte l'affichage de vos cartes pour optimiser votre apprentissage
                </p>
              </div>

              {/* Bouton pour faire le test */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Vous ne savez pas quel est votre type ?
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowMemoryTest(true)}
                >
                  🧪 Faire le test (10 questions)
                </Button>
              </div>
            </div>
          </div>

          {/* Erreur générale */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={loadProfile}
              disabled={saving}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Informations supplémentaires */}
      <Card className="p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Informations du compte
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">ID utilisateur :</span>
            <span className="text-gray-900 dark:text-white font-mono text-xs">
              {user?.id?.substring(0, 8)}...
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Membre depuis :</span>
            <span className="text-gray-900 dark:text-white">
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString('fr-FR')
                : '-'}
            </span>
          </div>
        </div>
      </Card>

      {/* Modal de test de mémoire */}
      <MemoryTestModal
        isOpen={showMemoryTest}
        onClose={() => setShowMemoryTest(false)}
        onComplete={handleMemoryTestComplete}
      />
    </div>
  )
}




