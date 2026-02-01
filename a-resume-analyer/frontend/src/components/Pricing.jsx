import { motion } from 'framer-motion'
import { Check, X, Download, Sparkles, Zap } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    icon: Zap,
    color: 'from-gray-500 to-gray-600',
    features: [
      {
        name: 'Resume Score Analysis',
        included: true,
        description: 'Get instant ATS compatibility score'
      },
      {
        name: 'PDF Upload',
        included: true,
        description: 'Upload your resume in PDF format'
      },
      {
        name: 'Job Matching (1 job)',
        included: true,
        description: 'Match against 1 job description'
      },
      {
        name: 'AI Resume Customization',
        included: false
      },
      {
        name: 'ML-Powered Optimization',
        included: false
      },
      {
        name: 'Download Optimized Resume',
        included: false
      },
      {
        name: 'Priority Support',
        included: false
      }
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$9.99',
    period: '/month',
    description: 'Unlock full potential with AI',
    icon: Sparkles,
    color: 'from-primary-500 to-accent-500',
    features: [
      {
        name: 'Resume Score Analysis',
        included: true,
        description: 'Get instant ATS compatibility score'
      },
      {
        name: 'PDF Upload',
        included: true,
        description: 'Upload your resume in PDF format'
      },
      {
        name: 'Job Matching (Unlimited)',
        included: true,
        description: 'Match against unlimited job descriptions'
      },
      {
        name: 'AI Resume Customization',
        included: true,
        description: 'AI-powered resume tailoring'
      },
      {
        name: 'ML-Powered Optimization',
        included: true,
        description: 'Advanced ML algorithms for improvement'
      },
      {
        name: 'Download Optimized Resume',
        included: true,
        description: 'Download optimized resume as PDF'
      },
      {
        name: 'Priority Support',
        included: true,
        description: '24/7 email support'
      }
    ],
    cta: 'Start Free Trial',
    highlighted: true
  }
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Simple, Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free, upgrade when you need advanced features. No credit card required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, idx) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative rounded-2xl p-8 transition-all ${
                  plan.highlighted
                    ? 'glass glass-hover border border-primary-500/50 shadow-lg shadow-primary-500/20'
                    : 'glass glass-hover border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.description}</p>
                  </div>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400">{plan.period}</span>}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50 hover:shadow-primary-500/75'
                      : 'border border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-600/10'
                  }`}
                >
                  {plan.cta}
                </motion.button>

                <div className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (idx * 0.1) + (i * 0.05) }}
                      className="flex gap-3"
                    >
                      {feature.included ? (
                        <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={feature.included ? 'text-white' : 'text-gray-500'}>
                          {feature.name}
                        </p>
                        {feature.description && (
                          <p className="text-xs text-gray-500">{feature.description}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Premium Features Include</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass glass-hover p-6 rounded-xl">
              <Download className="w-8 h-8 text-primary-400 mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">PDF Downloads</h4>
              <p className="text-gray-400">Download your optimized resume as a high-quality PDF file ready for applications</p>
            </div>
            <div className="glass glass-hover p-6 rounded-xl">
              <Sparkles className="w-8 h-8 text-accent-400 mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">AI Customization</h4>
              <p className="text-gray-400">Get AI-powered suggestions to tailor your resume for specific job descriptions</p>
            </div>
            <div className="glass glass-hover p-6 rounded-xl">
              <Zap className="w-8 h-8 text-yellow-400 mb-3" />
              <h4 className="text-lg font-semibold text-white mb-2">ML Optimization</h4>
              <p className="text-gray-400">Advanced machine learning algorithms analyze and optimize your resume for ATS systems</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
