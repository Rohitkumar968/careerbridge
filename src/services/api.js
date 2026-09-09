import axios from 'axios'

// =====================================================
// CAREERBRIDGE API CONFIGURATION
// =====================================================

const API_URL = 'https://careerbridge-r5yo.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // FormData ke liye browser khud Content-Type set karega
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')

      // Login page par redirect
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// =====================================================
// EXPORT
// =====================================================

export default api