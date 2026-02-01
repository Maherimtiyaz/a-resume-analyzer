import { motion } from 'framer-motion'
import { Zap, Shield, Cpu, Download, BarChart3, Sparkles } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Resume Score Analysis',
    description: 'Get instant ATS compatibility score',
    tier: 'free',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Processing',
    description: 'Get instant results with our optimized TF-IDF algorithm',
    tier: 'free',
    color: 'from-yellow-400 to-yellow-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data never leaves our secure servers, 100% confidential',
    tier: 'free',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Sparkles,
    title: 'AI Resume Customization',
    description: 'AI-powered resume tailoring for specific job descriptions',
    tier: 'paid',
    color: 'from-primary-500 to-accent-500'
  },
  {
    icon: Cpu,
    title: 'ML-Powered Optimization',
    description: 'Advanced machine learning algorithms for resume improvement',
    tier: 'paid',
    color: 'from-primary-500 to-accent-500'
  },
  {
    icon: Download,
    title: 'PDF Downloads',
    description: 'Download your optimized resume as a high-quality PDF file',
    tier: 'paid',
    color: 'from-primary-500 to-accent-500'
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

        {/* Free Tier Features */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 flex-grow bg-gradient-to-r from-gray-500 to-transparent"></div>
            <h3 className="text-2xl font-bold text-white whitespace-nowrap">Free Tier</h3>
            <div className="h-1 flex-grow bg-gradient-to-l from-gray-500 to-transparent"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.tier === 'free').map((feature, i) => (
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
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <span className="text-xs font-semibold text-gray-400">✓ Included</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Premium Tier Features */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-1 flex-grow bg-gradient-to-r from-primary-500 to-transparent"></div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent whitespace-nowrap">Professional Tier</h3>
            <div className="h-1 flex-grow bg-gradient-to-l from-primary-500 to-transparent"></div>
          </div>

          <p className="text-center text-gray-400 mb-8">Unlock advanced AI and ML capabilities with a Professional subscription</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.filter(f => f.tier === 'paid').map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass glass-hover p-6 rounded-2xl group cursor-pointer border border-primary-500/30 hover:border-primary-500/60"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/30`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
                <div className="mt-4 pt-4 border-t border-primary-500/20">
                  <span className="text-xs font-semibold text-primary-400">⭐ Premium Only</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <a href="#pricing" className="inline-block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-8 py-4 rounded-lg font-semibold shadow-lg shadow-primary-500/50 hover:shadow-primary-500/75 transition-shadow"
            >
              View Pricing Plans
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
