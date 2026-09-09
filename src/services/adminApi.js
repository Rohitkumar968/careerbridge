import api from './api'

export const adminApi = {
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  suspendUser: (id) => api.post(`/admin/users/${id}/suspend`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getJobs: (params) => api.get('/admin/jobs', { params }),
  approveJob: (id) => api.post(`/admin/jobs/${id}/approve`),
  rejectJob: (id) => api.post(`/admin/jobs/${id}/reject`),
  suspendJob: (id) => api.post(`/admin/jobs/${id}/suspend`),
  getStats: () => api.get('/admin/stats'),
  getReports: (params) => api.get('/admin/reports', { params }),
}

export default adminApi
