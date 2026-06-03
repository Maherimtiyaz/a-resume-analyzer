import { motion } from 'framer-motion'

export default function TextInput({ resumeText, setResumeText, jobDescription, setJobDescription }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* Resume Text Input */}
      <div className="glass p-6 rounded-2xl">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Resume Text
        </label>
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste resume text here... Include skills, experience, education, etc."
          className="w-full h-64 bg-dark-800 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all resize-none"
        />
        <div className="mt-2 flex justify-between text-sm text-gray-400">
          <span>Minimum 10 characters</span>
          <span>{resumeText.length} chars</span>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="glass p-6 rounded-2xl">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here... Include requirements, responsibilities, qualifications, etc."
          className="w-full h-64 bg-dark-800 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none transition-all resize-none"
        />
        <div className="mt-2 flex justify-between text-sm text-gray-400">
          <span>Minimum 10 characters</span>
          <span>{jobDescription.length} chars</span>
        </div>
      </div>
    </motion.div>
  )
}
