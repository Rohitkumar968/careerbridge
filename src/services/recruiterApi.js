import api from './api'

export const recruiterApi = {
  getCompany: () => api.get('/recruiter/company'),
  updateCompany: (data) => api.put('/recruiter/company', data),
  getApplicants: (params) => api.get('/recruiter/applicants', { params }),
  getApplicantById: (id) => api.get(`/recruiter/applicants/${id}`),
  updateApplicantStatus: (id, status) => api.put(`/recruiter/applicants/${id}/status`, { status }),
  getAnalytics: () => api.get('/recruiter/analytics'),
  shortlistCandidate: (id) => api.post(`/recruiter/applicants/${id}/shortlist`),
  rejectCandidate: (id) => api.post(`/recruiter/applicants/${id}/reject`),
}

export default recruiterApi
