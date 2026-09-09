import api from './api'

export const aiApi = {
  analyzeResume: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/ai/analyze-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  getJobMatches: () => api.get('/ai/job-matches'),
  sendChatMessage: (message) => api.post('/ai/chat', { message }),
  getChatHistory: () => api.get('/ai/chat-history'),
  getRankingCandidates: (jobId) => api.get(`/ai/ranking/${jobId}`),
}

export default aiApi
