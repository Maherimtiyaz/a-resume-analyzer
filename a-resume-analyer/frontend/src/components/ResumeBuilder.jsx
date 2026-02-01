import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { api } from '../api/client'
import { Download, Eye, Plus } from 'lucide-react'

export default function ResumeBuilder() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [resumes, setResumes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    experience: [{ company: '', job_title: '', start_date: '', end_date: '', description: '' }],
    education: [{ school: '', degree: '', field: '', start_date: '', end_date: '' }],
    skills: '',
    template: 'ats-friendly-1'
  })

  useEffect(() => {
    loadTemplates()
    loadResumes()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await api.resume.getTemplates()
      setTemplates(response.data)
      setSelectedTemplate(response.data[0]?.name)
    } catch (error) {
      toast.error('Failed to load templates')
    }
  }

  const loadResumes = async () => {
    try {
      const response = await api.resume.getMyResumes()
      setResumes(response.data)
    } catch (error) {
      // Not authenticated or no resumes
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
        template: selectedTemplate,
      }

      const response = await api.resume.generate(payload)
      toast.success('Resume generated successfully!')
      
      // Reset form
      setShowForm(false)
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        experience: [{ company: '', job_title: '', start_date: '', end_date: '', description: '' }],
        education: [{ school: '', degree: '', field: '', start_date: '', end_date: '' }],
        skills: '',
        template: 'ats-friendly-1'
      })
      
      loadResumes()
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to generate resume')
    } finally {
      setLoading(false)
    }
  }

  const downloadResume = async (resumeId) => {
    try {
      const response = await api.resume.downloadResume(resumeId)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `resume_${resumeId}.pdf`)
      document.body.appendChild(link)
      link.click()
      toast.success('Resume downloaded!')
    } catch (error) {
      toast.error('Failed to download resume')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-6">Resume Builder</h2>
        
        {/* Templates */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Choose a Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <motion.div
                key={template.name}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedTemplate(template.name)}
                className={`p-6 rounded-lg cursor-pointer transition ${
                  selectedTemplate === template.name
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 border-2 border-primary-400'
                    : 'bg-dark-800 border border-dark-600 hover:border-primary-500'
                }`}
              >
                <h4 className="text-lg font-semibold text-white">{template.display_name}</h4>
                <p className="text-sm text-gray-300 mt-2">{template.description}</p>
                {template.ats_optimized && (
                  <span className="inline-block mt-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                    ATS Optimized
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Resume Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-primary-500/50 transition"
          >
            <Plus size={20} />
            Create New Resume
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-dark-800 p-8 rounded-lg space-y-6 border border-dark-600"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Professional Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-white mb-2">Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                placeholder="Python, React, AWS, ..."
                className="w-full bg-dark-700 border border-dark-600 rounded px-4 py-2 text-white"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-lg hover:shadow-lg disabled:opacity-50 transition"
              >
                {loading ? 'Generating...' : 'Generate Resume'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-dark-700 border border-dark-600 text-white px-6 py-2 rounded-lg hover:border-primary-500 transition"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </div>

      {/* My Resumes */}
      {resumes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">My Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-800 border border-dark-600 rounded-lg p-6 hover:border-primary-500 transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white capitalize">
                      {resume.template}
                    </h4>
                    <p className="text-sm text-gray-400">
                      ATS Score: <span className="text-primary-400 font-semibold">{(resume.ats_score * 100).toFixed(0)}%</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadResume(resume.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded transition"
                  >
                    <Download size={18} />
                    Download
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded transition"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
