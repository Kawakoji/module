/**
 * Composant Input réutilisable
 * @param {string} label - Label du champ
 * @param {string} error - Message d'erreur
 * @param {boolean} required - Champ requis
 */
export default function Input({
  label,
  error,
  required = false,
  className = '',
  id,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-white mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2 border border-[#2a2a35] rounded-2xl bg-[#13131f] text-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed] focus:border-[#7c3aed] ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}










