import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { Mail, Lock, ArrowRight, X, Eye, EyeOff } from 'lucide-react'

export default function SignupModal({ isOpen, onClose, onSignupSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateSignup = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!validateSignup()) {
      return
    }

    setLoading(true)
    try {
      const response = await api.auth.signup(email.toLowerCase(), password)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      
      toast.success('Account created successfully! 🎉')
      onSignupSuccess?.()
      onClose()
    } catch (error) {
      if (error.response?.status === 409) {
        setErrors({
          email: 'This email is already registered. Please sign in instead.'
        })
        toast.error('Email already registered')
      } else if (error.response?.status === 400) {
        const detail = error.response.data.detail
        if (detail.includes('email')) {
          setErrors({ email: detail })
        } else if (detail.includes('Password')) {
          setErrors({ password: detail })
        } else {
          toast.error(detail)
        }
      } else {
        toast.error(error.response?.data?.detail || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-dark-800 rounded-lg p-8 max-w-md w-full border border-primary-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Account</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-primary-500" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) {
                        setErrors({ ...errors, email: '' })
                      }
                    }}
                    placeholder="your@email.com"
                    className={`w-full pl-10 pr-4 py-2 bg-dark-700 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.email
                        ? 'border-red-500 focus:border-red-500 bg-red-900/10'
                        : 'border-dark-600 focus:border-primary-500'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-primary-500" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) {
                        setErrors({ ...errors, password: '' })
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-dark-700 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500 bg-red-900/10'
                        : 'border-dark-600 focus:border-primary-500'
                    }`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                )}
                {!errors.password && (
                  <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-primary-500" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) {
                        setErrors({ ...errors, confirmPassword: '' })
                      }
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-2 bg-dark-700 border rounded text-white placeholder-gray-500 focus:outline-none transition ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 bg-red-900/10'
                        : 'border-dark-600 focus:border-primary-500'
                    }`}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 rounded font-medium hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 transition flex items-center justify-center gap-2 mt-6"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                <ArrowRight size={18} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
