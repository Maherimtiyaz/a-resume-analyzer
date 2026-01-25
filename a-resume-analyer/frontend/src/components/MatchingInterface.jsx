import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, FileText, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import FileUpload from './FileUpload'
import TextInput from './TextInput'
import ResultsDisplay from './ResultsDisplay'
import { api } from '../api/client'

export default function MatchingInterface({ onBack }) {
  const [mode, setMode] = useState('text') // 'text' or 'upload'
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)

  const handleTextMatch = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.error('Please fill in both fields')
      return
    }

    setLoading(true)
    try {
      const response = await api.matchText(resumeText, jobDescription)
      setResult(response.data)
      toast.success('Match completed!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to analyze')
    } finally {
      setLoading(false)
    }
  }

  const handleFileMatch = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error('Please upload a PDF and enter job description')
      return
    }

    setLoading(true)
    try {
      const response = await api.uploadAndMatch(resumeFile, jobDescription)
      setResult(response.data)
      toast.success('PDF analyzed successfully!')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to analyze PDF')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (mode === 'text') {
      handleTextMatch()
    } else {
      handleFileMatch()
    }
  }

  return (
    <section className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass p-1 rounded-xl inline-flex">
            <button
              onClick={() => setMode('text')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                mode === 'text'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Text Input
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                mode === 'upload'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-5 h-5 inline mr-2" />
              Upload PDF
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            layout
            className="space-y-6"
          >
            <AnimatePresence mode="wait">
              {mode === 'text' ? (
                <TextInput
                  key="text"
                  resumeText={resumeText}
                  setResumeText={setResumeText}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
              ) : (
                <FileUpload
                  key="upload"
                  resumeFile={resumeFile}
                  setResumeFile={setResumeFile}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
              )}
            </AnimatePresence>

            {/* Analyze Button */}
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Analyzing...
                </span>
              ) : (
                'Analyze Match'
              )}
            </motion.button>
          </motion.div>

          {/* Results Section */}
          <ResultsDisplay result={result} loading={loading} />
        </div>
      </div>
    </section>
  )
}
