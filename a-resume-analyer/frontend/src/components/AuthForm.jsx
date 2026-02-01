import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function AuthForm({ onAuthSuccess }) {
  const [isSignup, setIsSignup] = useState(false)
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

  const validateLogin = () => {
    const newErrors = {}

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
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
      onAuthSuccess?.()
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

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateLogin()) {
      return
    }

    setLoading(true)
    try {
      const response = await api.auth.login(email.toLowerCase(), password)
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
      
      toast.success('Logged in successfully! 👋')
      onAuthSuccess?.()
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({
          password: 'Invalid email or password'
        })
        toast.error('Invalid email or password')
      } else {
        toast.error(error.response?.data?.detail || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setErrors({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-lg p-8 max-w-md w-full border border-primary-500/20"
    >
      <h2 className="text-2xl font-bold text-white mb-6">
        {isSignup ? 'Create Account' : 'Welcome Back'}
      </h2>

      <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
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
          {isSignup && !errors.password && (
            <p className="text-gray-400 text-xs mt-1">Minimum 8 characters</p>
          )}
        </div>

        {isSignup && (
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
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white py-2 rounded font-medium hover:shadow-lg hover:shadow-primary-500/50 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
          <ArrowRight size={18} />
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-dark-700">
        <button
          type="button"
          onClick={toggleMode}
          className="w-full text-center text-primary-400 hover:text-primary-300 text-sm font-medium"
        >
          {isSignup
            ? 'Already have an account? Sign In'
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </motion.div>
  )
}
