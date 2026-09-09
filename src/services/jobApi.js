import api from './api'

export const jobApi = {
  getJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  searchJobs: (query) => api.get('/jobs/search', { params: { q: query } }),
  getRecommendedJobs: () => api.get('/jobs/recommended'),
  saveJob: (jobId) => api.post(`/jobs/${jobId}/save`),
  unsaveJob: (jobId) => api.delete(`/jobs/${jobId}/save`),
  getSavedJobs: () => api.get('/jobs/saved'),
}

export default jobApi
