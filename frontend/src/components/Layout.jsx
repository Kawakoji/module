import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from './ThemeToggle'
import Button from './Button'

export default function Layout({ children }) {
  const location = useLocation()
  const { isAuthenticated, user, signOut } = useAuth()

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/decks', label: 'Mes Decks' },
    { path: '/review', label: 'Révision' },
    { path: '/stats', label: 'Statistiques' },
    { path: '/profile', label: 'Profil' },
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navigation */}
      <nav className="bg-[#13131f] border-b border-[#2a2a35] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <h1 className="text-2xl font-bold text-white">
                    🎴 Moduleia
                  </h1>
                </Link>
              </div>
              {isAuthenticated && (
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium rounded-2xl ${
                        location.pathname === item.path
                          ? 'border-[#7c3aed] text-white'
                          : 'border-transparent text-gray-400 hover:border-[#7c3aed] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 hidden sm:block">
                    {user?.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Connexion
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">
                      Inscription
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}

