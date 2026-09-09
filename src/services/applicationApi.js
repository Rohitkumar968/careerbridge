import api from './api'

export const applicationApi = {
  getApplications: (params) => api.get('/applications', { params }),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  applyForJob: (jobId, data) => api.post(`/applications/apply/${jobId}`, data),
  updateApplicationStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
  getApplicationStats: () => api.get('/applications/stats'),
  withdrawApplication: (id) => api.post(`/applications/${id}/withdraw`),
}

export default applicationApi
