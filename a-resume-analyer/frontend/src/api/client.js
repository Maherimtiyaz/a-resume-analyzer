import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const api = {
  // Health check
  health: () => apiClient.get('/api/health'),

  // Text matching
  matchText: (resumeText, jobDescription) =>
    apiClient.post('/api/match', {
      resume_text: resumeText,
      job_description: jobDescription,
    }),

  // PDF upload
  uploadResume: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post('/api/upload/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Upload and match
  uploadAndMatch: (file, jobDescription) => {
    const formData = new FormData()
    formData.append('resume_file', file)
    formData.append('job_description', jobDescription)
    return apiClient.post('/api/upload/match', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Batch matching
  batchMatch: (resumes, jobDescriptions) =>
    apiClient.post('/api/batch/match', {
      resumes,
      job_descriptions: jobDescriptions,
    }),

  // Multi-job matching
  multiJobMatch: (resumeText, jobDescriptions, topK = null) =>
    apiClient.post('/api/match/multi-job', {
      resume_text: resumeText,
      job_descriptions: jobDescriptions,
      top_k: topK,
    }),

  // Admin - retrain
  retrain: (adminToken) =>
    apiClient.post('/api/admin/retrain', null, {
      headers: { 'X-Admin-Token': adminToken },
    }),
}

export default apiClient
