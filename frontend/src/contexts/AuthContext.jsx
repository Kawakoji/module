import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = []
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  throw new Error(
    `Missing Supabase environment variables: ${missing.join(', ')}\n` +
    `Please create a .env file in the frontend directory with:\n` +
    `VITE_SUPABASE_URL=your_supabase_url\n` +
    `VITE_SUPABASE_ANON_KEY=your_supabase_anon_key`
  )
}

// Vérifier que l'URL est valide
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(`Invalid VITE_SUPABASE_URL: must start with http:// or https://`)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Charger la session au démarrage
  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Inscription avec email et mot de passe
   */
  const signUp = async (email, password, options = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options.fullName || '',
          },
          ...options,
        },
      })

      if (error) {
        // Améliorer le message d'erreur
        if (error.message.includes('Failed to fetch')) {
          throw new Error(
            'Impossible de se connecter à Supabase. Vérifiez que:\n' +
            '1. VITE_SUPABASE_URL est correcte dans votre fichier .env\n' +
            '2. VITE_SUPABASE_ANON_KEY est correcte dans votre fichier .env\n' +
            '3. Le serveur de développement est redémarré après avoir créé/modifié le .env\n' +
            '4. Votre connexion internet fonctionne'
          )
        }
        throw error
      }
      return data
    } catch (error) {
      // Capturer les erreurs réseau
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(
          'Erreur de connexion réseau. Vérifiez:\n' +
          '1. Que les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans frontend/.env\n' +
          '2. Que le serveur de développement a été redémarré après la création du .env\n' +
          '3. Que votre connexion internet fonctionne'
        )
      }
      throw error
    }
  }

  /**
   * Connexion avec email et mot de passe
   */
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Améliorer le message d'erreur
        if (error.message.includes('Failed to fetch')) {
          throw new Error(
            'Impossible de se connecter à Supabase. Vérifiez que:\n' +
            '1. VITE_SUPABASE_URL est correcte dans votre fichier .env\n' +
            '2. VITE_SUPABASE_ANON_KEY est correcte dans votre fichier .env\n' +
            '3. Le serveur de développement est redémarré après avoir créé/modifié le .env\n' +
            '4. Votre connexion internet fonctionne'
          )
        }
        throw error
      }
      return data
    } catch (error) {
      // Capturer les erreurs réseau
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(
          'Erreur de connexion réseau. Vérifiez:\n' +
          '1. Que les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont définies dans frontend/.env\n' +
          '2. Que le serveur de développement a été redémarré après la création du .env\n' +
          '3. Que votre connexion internet fonctionne'
        )
      }
      throw error
    }
  }

  /**
   * Déconnexion
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Récupérer le token d'accès
   */
  const getAccessToken = () => {
    return session?.access_token || null
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getAccessToken,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Exporter supabase pour utilisation dans les services
export { supabase }








