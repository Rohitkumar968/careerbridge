import api from './api'

export const interviewApi = {
  getInterviews: (params) => api.get('/interviews', { params }),
  getInterviewById: (id) => api.get(`/interviews/${id}`),
  scheduleInterview: (data) => api.post('/interviews', data),
  updateInterview: (id, data) => api.put(`/interviews/${id}`, data),
  cancelInterview: (id) => api.post(`/interviews/${id}/cancel`),
  rescheduleInterview: (id, data) => api.post(`/interviews/${id}/reschedule`, data),
}

export default interviewApi
