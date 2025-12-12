import { motion } from 'framer-motion'

/**
 * Composant Button réutilisable avec animations
 * @param {string} variant - 'primary', 'secondary', 'danger', 'ghost'
 * @param {string} size - 'sm', 'md', 'lg'
 * @param {boolean} disabled - Désactive le bouton
 * @param {React.ReactNode} children - Contenu du bouton
 * @param {string} className - Classes CSS supplémentaires
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  className = '',
  ...props
}) {
  const baseStyles =
    'font-medium rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#7c3aed] hover:bg-[#6d28d9] text-white focus:ring-[#7c3aed] shadow-[0_0_20px_rgba(124,58,237,0.3)]',
    secondary:
      'bg-[#13131f] border border-[#2a2a35] hover:bg-[#1a1a2a] text-white focus:ring-[#7c3aed]',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 rounded-2xl',
    ghost:
      'bg-transparent hover:bg-[#13131f] text-gray-400 hover:text-white focus:ring-[#7c3aed]',
  }

  const sizes = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <motion.button
      className={classes}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}
