import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, FileText, Briefcase, CheckCircle, XCircle } from 'lucide-react'

export default function ResultsDisplay({ result, loading }) {
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-yellow-400'
    if (score >= 0.4) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score) => {
    if (score >= 0.8) return 'from-green-500 to-emerald-500'
    if (score >= 0.6) return 'from-yellow-500 to-orange-500'
    if (score >= 0.4) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-rose-500'
  }

  const getMatchLabel = (score) => {
    if (score >= 0.8) return 'Excellent Match'
    if (score >= 0.6) return 'Good Match'
    if (score >= 0.4) return 'Moderate Match'
    return 'Weak Match'
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass p-8 rounded-2xl flex flex-col items-center justify-center min-h-[500px]"
          >
            <motion.div
              className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-300 text-lg">Analyzing resume...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
          </motion.div>
        ) : result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            {/* Score Card */}
            <motion.div
              className="glass p-8 rounded-2xl relative overflow-hidden"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-accent-500/10" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">Match Score</h3>
                  {result.match_score >= 0.6 ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400" />
                  )}
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="transform -rotate-90 w-48 h-48">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-dark-700"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#scoreGradient)"
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 552" }}
                        animate={{
                          strokeDasharray: `${result.match_score * 552} 552`
                        }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.div
                        className={`text-5xl font-bold ${getScoreColor(result.match_score)}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                      >
                        {Math.round(result.match_score * 100)}%
                      </motion.div>
                      <div className="text-sm text-gray-400 mt-1">
                        {getMatchLabel(result.match_score)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dark-800/50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-400">Resume Tokens</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {result.processed_resume_tokens}
                    </div>
                  </div>
                  <div className="bg-dark-800/50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Briefcase className="w-4 h-4 text-accent-500" />
                      <span className="text-sm text-gray-400">Job Tokens</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {result.processed_job_tokens}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              className="glass p-6 rounded-2xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <h4 className="font-semibold text-white">Recommendations</h4>
              </div>
              <ul className="space-y-3">
                {result.match_score < 0.6 && (
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2" />
                    <p className="text-gray-300 text-sm">
                      Consider tailoring your resume to better match the job requirements
                    </p>
                  </li>
                )}
                {result.match_score >= 0.6 && result.match_score < 0.8 && (
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                    <p className="text-gray-300 text-sm">
                      Good match! Highlight relevant experience in your application
                    </p>
                  </li>
                )}
                {result.match_score >= 0.8 && (
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2" />
                    <p className="text-gray-300 text-sm">
                      Excellent match! Your skills align very well with this position
                    </p>
                  </li>
                )}
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-400 rounded-full mt-2" />
                  <p className="text-gray-300 text-sm">
                    Review common keywords between your resume and job description
                  </p>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass p-8 rounded-2xl flex flex-col items-center justify-center min-h-[500px]"
          >
            <TrendingUp className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No results yet</p>
            <p className="text-gray-600 text-sm mt-2">Submit your analysis to see results</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
