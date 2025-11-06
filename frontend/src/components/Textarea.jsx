/**
 * Composant Textarea réutilisable
 * @param {string} label - Label du champ
 * @param {string} error - Message d'erreur
 * @param {boolean} required - Champ requis
 */
export default function Textarea({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`input resize-none min-h-[100px] ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}




