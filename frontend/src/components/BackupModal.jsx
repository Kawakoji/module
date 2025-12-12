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
        <div className="flex gap-2 border-b border-[#2a2a35]">
          <button
            onClick={() => {
              setMode('export')
              setError('')
              setImportResult(null)
            }}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors rounded-2xl ${
              mode === 'export'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-gray-400 hover:text-white'
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
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors rounded-2xl ${
              mode === 'import'
                ? 'border-[#7c3aed] text-[#7c3aed]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Importer
          </button>
        </div>

        {/* Mode Export */}
        {mode === 'export' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-white">
                Exporter vos données
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Téléchargez une sauvegarde complète de tous vos decks et cartes au format JSON.
                Vous pourrez utiliser ce fichier pour restaurer vos données plus tard.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-gray-400">
                  • Tous vos decks et cartes seront exportés
                </p>
                <p className="text-xs text-gray-400">
                  • Les statistiques de révision seront incluses
                </p>
                <p className="text-xs text-gray-400">
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
              <h3 className="text-lg font-semibold mb-2 text-white">
                Importer une sauvegarde
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Restaurez vos decks et cartes depuis un fichier JSON précédemment exporté.
              </p>

              <div className="mb-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-2xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#7c3aed] file:text-white
                    hover:file:bg-[#6d28d9]"
                  onChange={() => setError('')}
                />
              </div>

              <div className="space-y-2 text-xs text-gray-400">
                <p>• Les decks avec le même nom seront ignorés (sauf si vous fusionnez)</p>
                <p>• Toutes les cartes seront importées avec leurs statistiques</p>
                <p>• L'opération peut prendre quelques secondes</p>
              </div>
            </Card>
          </div>
        )}

        {/* Résultat de l'import */}
        {importResult && (
          <Card className="p-6 bg-green-900/20 border-green-800">
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <div className="text-lg font-medium text-green-300 mb-2">
                Import réussi !
              </div>
              <div className="text-sm text-gray-300 space-y-1">
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
                  <p className="text-red-400">
                    {importResult.errors.length} erreur{importResult.errors.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {/* Indicateur de chargement */}
        {(exporting || importing) && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#7c3aed]"></div>
            <p className="mt-4 text-gray-400">
              {exporting ? 'Export en cours...' : 'Import en cours...'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}










