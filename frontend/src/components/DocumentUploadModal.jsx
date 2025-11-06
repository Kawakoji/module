import { useState, useRef } from 'react'
import Modal from './Modal'
import Button from './Button'
import Card from './Card'
import Input from './Input'

/**
 * Modal pour uploader et importer des documents
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onCreateAll - Callback pour créer toutes les cartes
 * @param {string} deckId - ID du deck
 */
export default function DocumentUploadModal({
  isOpen,
  onClose,
  onCreateAll,
  deckId,
}) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [count, setCount] = useState(10)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Vérifier la taille (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (max 10MB)')
        return
      }

      // Vérifier le type
      const allowedTypes = [
        'application/pdf',
        'text/plain',
        'text/markdown',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      const allowedExtensions = ['.pdf', '.txt', '.md', '.doc', '.docx']
      const fileExt = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf('.'))
      const isValidType =
        allowedTypes.includes(selectedFile.type) ||
        allowedExtensions.includes(fileExt)

      if (!isValidType) {
        setError(
          `Type de fichier non supporté. Types acceptés : ${allowedExtensions.join(', ')}`
        )
        return
      }

      setFile(selectedFile)
      setError('')
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    setUploading(true)
    setError('')
    setResult(null)

    try {
      const { api } = await import('../services/api')

      if (autoGenerate) {
        // Upload et génération automatique
        const response = await api.uploadDocument(file, deckId, true, count)

        if (response.cardsGenerated && response.created) {
          setResult({
            type: 'auto',
            extractedText: response.extractedText,
            cards: response.created,
            total: response.total,
            createdCount: response.createdCount,
            failed: response.failed || [],
          })

          // Si toutes les cartes ont été créées, appeler onCreateAll
          if (onCreateAll && response.createdCount > 0) {
            // Les cartes sont déjà créées, on peut juste fermer
            setTimeout(() => {
              onClose()
              if (onCreateAll) {
                onCreateAll(response.created)
              }
            }, 2000)
          }
        } else {
          // Génération échouée mais texte extrait
          setResult({
            type: 'text-only',
            extractedText: response.extractedText,
            error: response.error,
          })
        }
      } else {
        // Upload et génération manuelle (sans créer)
        const response = await api.extractAndGenerate(file, deckId, count)

        setResult({
          type: 'manual',
          extractedText: response.extractedText,
          cards: response.cards,
          count: response.count,
        })
      }
    } catch (err) {
      console.error('Error uploading document:', err)
      setError(err.message || 'Erreur lors de l\'upload du document')
    } finally {
      setUploading(false)
    }
  }

  const handleCreateAll = async () => {
    if (!result || !result.cards) return

    setUploading(true)
    try {
      if (onCreateAll) {
        await onCreateAll(result.cards)
        handleClose()
      }
    } catch (err) {
      console.error('Error creating cards:', err)
      setError(err.message || 'Erreur lors de la création des cartes')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setError('')
    setResult(null)
    setAutoGenerate(true)
    setCount(10)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const fakeEvent = { target: { files: [droppedFile] } }
      handleFileChange(fakeEvent)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importer un document 📄"
      className="max-w-4xl"
      footer={
        result ? (
          result.type === 'auto' ? (
            <Button onClick={handleClose}>
              {result.createdCount > 0
                ? `${result.createdCount} cartes créées !`
                : 'Fermer'}
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Fermer
              </Button>
              <Button onClick={handleCreateAll} disabled={uploading}>
                {uploading
                  ? 'Création...'
                  : `Créer toutes les cartes (${result.cards?.length || 0})`}
              </Button>
            </>
          )
        ) : (
          <>
            <Button variant="secondary" onClick={handleClose} disabled={uploading}>
              Annuler
            </Button>
            <Button onClick={handleUpload} disabled={!file || uploading}>
              {uploading ? 'Traitement...' : 'Importer'}
            </Button>
          </>
        )
      }
    >
      <div className="space-y-6">
        {!result ? (
          <>
            {/* Zone de dépôt */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                file
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.txt,.md,.doc,.docx"
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="text-4xl mb-4">📄</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {file ? file.name : 'Glissez-déposez un fichier ici'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  ou cliquez pour sélectionner
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  Formats supportés : PDF, TXT, MD, DOC, DOCX (max 10MB)
                </div>
              </label>
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto-generate"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="mr-2"
                  disabled={uploading}
                />
                <label
                  htmlFor="auto-generate"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Générer et créer automatiquement les cartes
                </label>
              </div>

              {autoGenerate && (
                <Input
                  label="Nombre de cartes à générer"
                  type="number"
                  min="1"
                  max="20"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10) || 10)}
                  disabled={uploading}
                />
              )}
            </div>
          </>
        ) : (
          <>
            {/* Résultat */}
            {result.type === 'auto' && result.createdCount > 0 ? (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <div className="text-center">
                  <div className="text-4xl mb-2">✅</div>
                  <div className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                    {result.createdCount} carte{result.createdCount !== 1 ? 's' : ''}{' '}
                    créée{result.createdCount !== 1 ? 's' : ''} !
                  </div>
                  {result.failed && result.failed.length > 0 && (
                    <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                      {result.failed.length} carte{result.failed.length !== 1 ? 's' : ''} n'a{' '}
                      {result.failed.length !== 1 ? 'ont' : 'a'} pas pu être créée{result.failed.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Card>
            ) : result.type === 'manual' ? (
              <div className="space-y-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                    Texte extrait (aperçu) :
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                    {result.extractedText}
                  </div>
                </Card>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {result.count} carte{result.count !== 1 ? 's' : ''} générée{result.count !== 1 ? 's' : ''} :
                  </div>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {result.cards.map((card, index) => (
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
              </div>
            ) : (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <div className="text-sm text-yellow-800 dark:text-yellow-300">
                  Texte extrait mais génération de cartes échouée : {result.error}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 max-h-32 overflow-y-auto">
                  {result.extractedText}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Indicateur de chargement */}
        {uploading && !result && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Traitement du document...
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}




