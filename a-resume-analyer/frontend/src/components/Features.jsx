import { motion } from 'framer-motion'
import { Zap, Shield, Cpu, Upload, BarChart3, Layers } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get instant results with our optimized TF-IDF algorithm',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data never leaves our secure servers, 100% confidential',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Cpu,
    title: 'AI-Powered',
    description: 'Advanced NLP with NLTK preprocessing and ML algorithms',
    color: 'from-primary-500 to-accent-500'
  },
  {
    icon: Upload,
    title: 'PDF Support',
    description: 'Upload PDF resumes directly, no copy-paste needed',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: BarChart3,
    title: 'Batch Processing',
    description: 'Analyze multiple resumes at once for efficient screening',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Layers,
    title: 'Multi-Job Match',
    description: 'Match one resume against multiple job descriptions',
    color: 'from-red-500 to-rose-500'
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Powerful Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need for intelligent resume analysis
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass glass-hover p-6 rounded-2xl group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
