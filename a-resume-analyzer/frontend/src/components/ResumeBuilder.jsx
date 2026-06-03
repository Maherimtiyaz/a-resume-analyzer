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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
                style={{ perspective: 1000 }}
                onClick={() => setSelectedTemplate(template.name)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  selectedTemplate === template.name
                    ? 'glass border border-primary-500 shadow-xl shadow-primary-500/20'
                    : 'glass border border-white/10 hover:border-primary-500/50'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent transition-opacity duration-500 ${selectedTemplate === template.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`} />
                <div className="relative z-10">
                  <h4 className="text-lg font-semibold text-white">{template.display_name}</h4>
                  <p className="text-sm text-gray-300 mt-2">{template.description}</p>
                  {template.ats_optimized && (
                    <span className="inline-block mt-3 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                      ATS Optimized
                    </span>
                  )}
                </div>
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
            className="glass p-8 rounded-2xl space-y-6 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 pointer-events-none" />
            <div className="relative z-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Professional Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
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
                className="w-full bg-dark-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-500 transition-colors"
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
                className="flex-1 glass glass-hover text-white px-6 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
            </div>
          </motion.form>
        )}
      </div>

      {/* My Resumes */}
      {resumes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">My Resumes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumes.map((resume, i) => (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring" }}
                whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
                style={{ perspective: 1000 }}
                className="glass p-6 rounded-2xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white capitalize">
                        {resume.template}
                      </h4>
                      <p className="text-sm text-gray-400 mt-1">
                        ATS Score: <span className="text-primary-400 font-semibold px-2 py-0.5 bg-primary-500/10 rounded border border-primary-500/20">{(resume.ats_score * 100).toFixed(0)}%</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => downloadResume(resume.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 hover:shadow-lg hover:shadow-primary-500/50 text-white py-2 rounded-lg transition-all"
                    >
                      <Download size={18} />
                      Download
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 glass glass-hover text-white px-4 py-2 rounded-lg transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
