import { useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X } from 'lucide-react'

export default function FileUpload({ resumeFile, setResumeFile, jobDescription, setJobDescription }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0])
    }
  }, [setResumeFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="space-y-6"
    >
      {/* PDF Upload Zone */}
      <div className="glass p-6 rounded-2xl">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Resume (PDF)
        </label>
        
        {!resumeFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-gray-600 hover:border-primary-500 hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            <motion.div
              animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {isDragActive ? 'Drop your PDF here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-gray-400">
                or click to browse (PDF only, max 10MB)
              </p>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-primary-500/10 border border-primary-500/30 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary-500" />
              <div>
                <p className="font-medium text-white">{resumeFile.name}</p>
                <p className="text-sm text-gray-400">
                  {(resumeFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => setResumeFile(null)}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Job Description Input */}
      <div className="glass p-6 rounded-2xl">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
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
