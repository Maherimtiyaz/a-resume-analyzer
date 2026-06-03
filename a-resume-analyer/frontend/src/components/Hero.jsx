import { motion } from 'framer-motion'
import { Sparkles, Zap, Target } from 'lucide-react'

export default function Hero({ onGetStarted, onResumeBuilder, onPricing }) {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-gray-300">AI-Powered Resume Tool</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          >
            <span className="gradient-text animate-gradient">
              Smart Resume
            </span>
            <br />
            <span className="text-white drop-shadow-2xl">Analyzer</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Build ATS-friendly resumes, match your skills with perfect jobs, and optimize your career with{' '}
            <span className="text-primary-500 font-medium hover:text-primary-400 transition-colors cursor-default">AI-powered</span> analytics.{' '}
            <span className="text-accent-500 font-medium">Free trial included</span>.
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 flex-wrap">
            <motion.button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg font-semibold text-lg text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/75 transition-shadow"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start Matching</span>
              </span>
            </motion.button>

            <motion.button
              onClick={onResumeBuilder}
              className="px-8 py-4 border-2 border-primary-500/50 hover:border-primary-500 text-white rounded-lg font-semibold text-lg transition-all hover:bg-primary-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>Build Resume</span>
              </span>
            </motion.button>

            <motion.button
              onClick={onPricing}
              className="px-8 py-4 border-2 border-accent-500/50 hover:border-accent-500 text-white rounded-lg font-semibold text-lg transition-all hover:bg-accent-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>View Plans</span>
              </span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: 'ATS Score', value: '100%', icon: Target },
              { label: 'Speed', value: '<1s', icon: Zap },
              { label: 'Templates', value: '5+', icon: Sparkles },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="glass p-6 rounded-2xl relative overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (0.1 * i), type: "spring", stiffness: 100 }}
                whileHover={{ y: -10, scale: 1.02, rotateX: 5, rotateY: 5 }}
                style={{ perspective: 1000 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-2 transform group-hover:scale-110 transition-transform duration-500" />
                <div className="text-3xl font-bold text-white mb-1 drop-shadow-md">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium tracking-wide">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
