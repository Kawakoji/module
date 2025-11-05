import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AppProvider } from './contexts/AppContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Decks from './pages/Decks'
import DeckDetail from './pages/DeckDetail'
import Review from './pages/Review'
import Stats from './pages/Stats'
import Profile from './pages/Profile'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/decks"
                  element={
                    <ProtectedRoute>
                      <Decks />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/decks/:deckId"
                  element={
                    <ProtectedRoute>
                      <DeckDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review"
                  element={
                    <ProtectedRoute>
                      <Review />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stats"
                  element={
                    <ProtectedRoute>
                      <Stats />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

