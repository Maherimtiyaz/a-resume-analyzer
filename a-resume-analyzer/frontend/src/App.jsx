import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Hero from './components/Hero'
import MatchingInterface from './components/MatchingInterface'
import Features from './components/Features'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import ResumeBuilder from './components/ResumeBuilder'
import Pricing from './components/Pricing'

function App() {
  const [showMatching, setShowMatching] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token')
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
    setActiveTab('home')
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    setActiveTab('home')
  }

  const handleSignupSuccess = () => {
    setIsAuthenticated(true)
    setActiveTab('home')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary-500 border-t-accent-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <Header 
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
        isAuthenticated={isAuthenticated}
      />
      
      <AnimatePresence mode="wait">
        {activeTab === 'builder' && isAuthenticated ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 py-12"
          >
            <button
              onClick={() => setActiveTab('home')}
              className="text-primary-400 hover:text-primary-300 mb-6"
            >
              ← Back
            </button>
            <ResumeBuilder />
          </motion.div>
        ) : activeTab === 'pricing' && isAuthenticated ? (
          <motion.div
            key="pricing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-4 py-12"
          >
            <button
              onClick={() => setActiveTab('home')}
              className="text-primary-400 hover:text-primary-300 mb-6"
            >
              ← Back
            </button>
            <Pricing />
          </motion.div>
        ) : showMatching && isAuthenticated ? (
          <motion.div
            key="matching"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MatchingInterface onBack={() => setShowMatching(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero 
              onGetStarted={() => {
                if (!isAuthenticated) {
                  setShowLoginModal(true)
                } else {
                  setShowMatching(true)
                }
              }}
              onResumeBuilder={() => {
                if (!isAuthenticated) {
                  setShowLoginModal(true)
                } else {
                  setActiveTab('builder')
                }
              }}
              onPricing={() => {
                if (!isAuthenticated) {
                  setShowLoginModal(true)
                } else {
                  setActiveTab('pricing')
                }
              }}
            />
            <Features />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <SignupModal 
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSignupSuccess={handleSignupSuccess}
      />
      
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a24',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: {
            iconTheme: {
              primary: '#6366f1',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  )
}

export default App
