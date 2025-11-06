import { useState, useRef } from 'react'
import Modal from './Modal'
import Button from './Button'
import Card from './Card'
import { api } from '../services/api'

/**
 * Modal pour l'export/import de sauvegardes
 * @param {boolean} isOpen - État d'ouverture
 * @param {function} onClose - Fonction de fermeture
 * @param {function} onImportComplete - Callback après import réussi
 */
export default function BackupModal({ isOpen, onClose, onImportComplete }) {
  const [mode, setMode] = useState('export') // 'export' ou 'import'
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [error, setError] = useState('')
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleExportAll = async () => {
    setExporting(true)
    setError('')

    try {
      await api.exportAllDecks()
      // Le téléchargement se fait automatiquement
      setTimeout(() => {
        setExporting(false)
      }, 1000)
    } catch (err) {
      console.error('Error exporting:', err)
      setError(err.message || 'Erreur lors de l\'export')
      setExporting(false)
    }
  }

  const handleExportDeck = async (deckId) => {
    setExporting(true)
    setError('')

    try {
      await api.exportDeck(deckId)
      setTimeout(() => {
        setExporting(false)
      }, 1000)
    } catch (err) {
      console.error('Error exporting deck:', err)
      setError(err.message || 'Erreur lors de l\'export')
      setExporting(false)
    }
  }

  const handleImport = async () => {
    const file = fileInputRef.current?.files[0]
    if (!file) {
      setError('Veuillez sélectionner un fichier')
      return
    }

    setImporting(true)
    setError('')
    setImportResult(null)

    try {
      const result = await api.importDecks(file, {
        merge: false,
        skipDuplicates: true,
      })

      setImportResult(result)
      if (onImportComplete) {
        onImportComplete(result)
      }
    } catch (err) {
      console.error('Error importing:', err)
      setError(err.message || 'Erreur lors de l\'import')
    } finally {
      setImporting(false)
    }
  }

  const handleClose = () => {
    setMode('export')
    setError('')
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Sauvegarde et restauration 💾"
      className="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
          {mode === 'export' && (
            <Button onClick={handleExportAll} disabled={exporting}>
              {exporting ? 'Export en cours...' : 'Exporter tout'}
            </Button>
          )}
          {mode === 'import' && (
            <Button onClick={handleImport} disabled={importing || !fileInputRef.current?.files[0]}>
              {importing ? 'Import en cours...' : 'Importer'}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-6">
        {/* Sélection du mode */}
        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              setMode('export')
              setError('')
              setImportResult(null)
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              mode === 'export'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Exporter
          </button>
          <button
            onClick={() => {
              setMode('import')
              setError('')
              setImportResult(null)
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              mode === 'import'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Importer
          </button>
        </div>

        {/* Mode Export */}
        {mode === 'export' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Exporter vos données
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Téléchargez une sauvegarde complète de tous vos decks et cartes au format JSON.
                Vous pourrez utiliser ce fichier pour restaurer vos données plus tard.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  • Tous vos decks et cartes seront exportés
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  • Les statistiques de révision seront incluses
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  • Format JSON compatible avec l'import
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Mode Import */}
        {mode === 'import' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Importer une sauvegarde
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Restaurez vos decks et cartes depuis un fichier JSON précédemment exporté.
              </p>

              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary-50 file:text-primary-700
                    hover:file:bg-primary-100
                    dark:file:bg-primary-900/20 dark:file:text-primary-400
                    dark:hover:file:bg-primary-900/30"
                  onChange={() => setError('')}
                />
              </div>

              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-500">
                <p>• Les decks avec le même nom seront ignorés (sauf si vous fusionnez)</p>
                <p>• Toutes les cartes seront importées avec leurs statistiques</p>
                <p>• L'opération peut prendre quelques secondes</p>
              </div>
            </Card>
          </div>
        )}

        {/* Résultat de l'import */}
        {importResult && (
          <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                Import réussi !
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  {importResult.created?.length || 0} deck{importResult.created?.length !== 1 ? 's' : ''} créé{importResult.created?.length !== 1 ? 's' : ''}
                </p>
                {importResult.updated?.length > 0 && (
                  <p>
                    {importResult.updated.length} deck{importResult.updated.length !== 1 ? 's' : ''} mis à jour
                  </p>
                )}
                {importResult.skipped?.length > 0 && (
                  <p>
                    {importResult.skipped.length} deck{importResult.skipped.length !== 1 ? 's' : ''} ignoré{importResult.skipped.length !== 1 ? 's' : ''} (doublons)
                  </p>
                )}
                {importResult.errors?.length > 0 && (
                  <p className="text-red-600 dark:text-red-400">
                    {importResult.errors.length} erreur{importResult.errors.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Indicateur de chargement */}
        {(exporting || importing) && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {exporting ? 'Export en cours...' : 'Import en cours...'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}




