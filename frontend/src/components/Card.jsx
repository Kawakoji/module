import { motion } from 'framer-motion'

/**
 * Composant Card réutilisable avec animations
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS supplémentaires
 * @param {boolean} hover - Activer l'effet hover
 * @param {number} delay - Délai d'animation (en secondes)
 */
export default function Card({
  children,
  className = '',
  hover = true,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`bg-[#13131f] border border-[#2a2a35] rounded-2xl shadow-md p-6 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
