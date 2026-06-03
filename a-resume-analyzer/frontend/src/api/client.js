import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const api = {
  // ===== Health =====
  health: () => apiClient.get('/api/health'),

  // ===== Authentication =====
  auth: {
    signup: (email, password) =>
      apiClient.post('/api/auth/signup', { email, password }),
    login: (email, password) =>
      apiClient.post('/api/auth/login', { email, password }),
    getCurrentUser: () =>
      apiClient.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
    getSubscription: () =>
      apiClient.get('/api/auth/subscription', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
    verifyEmail: (token) =>
      apiClient.post('/api/auth/verify-email', { token }),
    requestEmailVerification: (email) =>
      apiClient.post('/api/auth/request-email-verification', { email }),
  },

  // ===== Resume Builder =====
  resume: {
    getTemplates: () => apiClient.get('/api/resume/templates'),
    generate: (resumeData) =>
      apiClient.post('/api/resume/generate', resumeData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
    downloadResume: (resumeId) =>
      apiClient.get(`/api/resume/download/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        responseType: 'blob'
      }),
    getMyResumes: () =>
      apiClient.get('/api/resume/my-resumes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
    previewResume: (resumeId) =>
      apiClient.get(`/api/resume/preview/${resumeId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      }),
  },

  // ===== Job Matching =====
  match: {
    matchText: (resumeText, jobDescription) =>
      apiClient.post('/api/match', {
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    uploadResume: (file) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiClient.post('/api/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    uploadAndMatch: (file, jobDescription) => {
      const formData = new FormData()
      formData.append('resume_file', file)
      formData.append('job_description', jobDescription)
      return apiClient.post('/api/upload/match', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    batchMatch: (resumes, jobDescriptions) =>
      apiClient.post('/api/batch/match', {
        resumes,
        job_descriptions: jobDescriptions,
      }),
    multiJobMatch: (resumeText, jobDescriptions, topK = null) =>
      apiClient.post('/api/match/multi-job', {
        resume_text: resumeText,
        job_descriptions: jobDescriptions,
        top_k: topK,
      }),
  },

  // ===== Admin =====
  admin: {
    retrain: (adminToken) =>
      apiClient.post('/api/admin/retrain', null, {
        headers: { 'X-Admin-Token': adminToken },
      }),
  },
}

export default apiClient
