import { motion } from 'framer-motion'
import { Sparkles, Zap, Target } from 'lucide-react'

export default function Hero({ onGetStarted }) {
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
            <span className="text-sm text-gray-300">AI-Powered Matching Engine</span>
          </motion.div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-text animate-gradient">
              Smart Resume
            </span>
            <br />
            <span className="text-white">Matching</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Analyze resumes against job descriptions with cutting-edge{' '}
            <span className="text-primary-500 font-semibold">TF-IDF</span> and{' '}
            <span className="text-accent-500 font-semibold">ML algorithms</span>.
            Get instant similarity scores.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>Start Analyzing</span>
              </span>
            </motion.button>

            <motion.button
              className="px-8 py-4 glass glass-hover rounded-xl font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center space-x-2">
                <Target className="w-5 h-5" />
                <span>View Demo</span>
              </span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {[
              { label: 'Accuracy', value: '98%', icon: Target },
              { label: 'Speed', value: '<1s', icon: Zap },
              { label: 'Features', value: '10+', icon: Sparkles },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="glass p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                whileHover={{ y: -5 }}
              >
                <stat.icon className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
