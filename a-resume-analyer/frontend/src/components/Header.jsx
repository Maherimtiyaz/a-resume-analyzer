import { motion } from 'framer-motion'
import { Sparkles, Github } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="relative">
              <Sparkles className="w-8 h-8 text-primary-500" />
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-8 h-8 text-accent-500 opacity-50" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">
                AI Resume Analyzer
              </h1>
              <p className="text-xs text-gray-400">Powered by ML & NLP</p>
            </div>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
              How it Works
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
            </a>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
