import api from './api'

export const resumeApi = {
  getResume: () => {
    return api.get('/resume')
  },

  uploadResume: (file) => {
    const formData = new FormData()

    formData.append('resume', file)

    return api.post(
      '/resume/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  },

  viewResume: () => {
    return api.get(
      '/resume/view',
      {
        responseType: 'blob',
      }
    )
  },

  downloadResume: () => {
    return api.get(
      '/resume/download',
      {
        responseType: 'blob',
      }
    )
  },

  deleteResume: () => {
    return api.delete('/resume')
  },

  analyzeResume: () => {
    return api.post('/resume/analyze')
  },

  getAnalysis: () => {
    return api.get('/resume/analysis')
  },
}

export default resumeApi